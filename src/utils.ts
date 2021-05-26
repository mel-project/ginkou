import { EitherAsync } from 'purify-ts/EitherAsync';
import { Either, Left, Right } from 'purify-ts/Either';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import { is } from 'typescript-is';
import fetch from 'cross-fetch';

export type BlockHeight = number;
export type TxHash = string;
export type PrivateKey = string;

const home_addr = 'http://127.0.0.1';
const default_port = 11773;

export interface Wallet {
    total_micromel: number,
    network: number,
    address: TxHash,
}

// Custom type guards
// ----

/*
function isPrivateKey(x: any): x is Wallet {
    return typeof(x) == 'string' ? true : false;
}

function isWallet(x: any): x is Wallet {
    if ('total_micromel' in x && typeof(x.total_micromel) == 'number'
        && 'network' in x     && typeof(x.network) == 'number'
        && 'address' in x     && typeof(x.address) == 'string')
        return true;
    else
        return false;
}
*/


// Casting functions
// ----

function intoTxHash(x: any): Maybe<TxHash> {
    return is<TxHash>(x) ? Just(x) : Nothing;
}

function intoWallet(x: any): Maybe<Wallet> {
    return is<Wallet>(x) ? Just(x) : Nothing;
}

function intoPrivateKey(x: any): Maybe<PrivateKey> {
    return is<PrivateKey>(x) ? Just(x) : Nothing;
}

function intoListOf<T>(a: any, intoT: (a0: any) => Maybe<T>): Maybe<T[]> {
    if ( Array.isArray(a) )
        for (const x of a) {
            if ( intoT(a).isNothing() )
                return Nothing;
        }

    return Just(a as T[]);
}

/*
function isListOf<T>(a: any, pred: (a0: any) => boolean): a is T[] {
    if ( Array.isArray(a) )
        for (const x of a) {
            if ( !pred(a) )
                return false;
        }

    return true;
}
*/

/*
function castAnyEither<T>(x: any, pred: (a: any) => boolean): Either<string, T> {
    const t = pred(x)
    if ( pred(x) )
        return Right(x as T);
    else
        return Left('failed to cast object to expected type.');
}
*/

// Give a string cast error if maybe is nothing
function mToEither<T>(m: Maybe<T>): Either<string, T> {
    return m.caseOf({
        Just: x => Right(x),
        Nothing: () => Left('failed to cast json to expected type'),
    });
}

/// Fetch a url endpoint and parse as json, error if the http response is not ok
export async function fetch_or_err(url: string, opts: any): Promise<Either<string, any>> {
    // Throws on a promise rejection, which will be caught by EitherAsync's run()
    let res = await fetch(url, opts);

    if ( !res.ok )
        return Left(res.statusText);
    else
        return Right( await res.json() );
}

// Send faucet to given wallet. Returns a succesful request to walletd,
// not a succesful transaction.
export const tap_faucet = (url: string)
: EitherAsync<string, TxHash> =>
    EitherAsync( async ({ fromPromise }) => {
        let res: Response = await fromPromise(fetch_or_err(url, { method: 'POST' }));
        return await res.text();
    });

// Creates a new wallet and returns a private key for the new wallet.
export const new_wallet = (wallet_name: string, use_testnet: boolean, port: number = default_port)
: EitherAsync<string, PrivateKey> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        const url = `${home_addr}:${port}/wallets/${wallet_name}`;
        let res = await fromPromise(fetch_or_err(url, {
            method: 'PUT',
            body: JSON.stringify({ testnet : use_testnet }),
        }));

        // Response is a quoted string, so json parses to a string
        return liftEither( mToEither<PrivateKey>(intoPrivateKey(res)) );
    });

// Poll daemon to check tx until it is confirmed
// TODO handle when daemon returns failed tx
export const confirm_tx = async (url: string, txhash: TxHash)
: Promise<Either<string, BlockHeight>> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        let res: Response = await fromPromise(fetch_or_err(url, { method : 'GET' }));
        let json = await res.json();
        const height: BlockHeight | null = json.confirmed_height;

        if (height != null)
            return liftEither(Right(height as BlockHeight));
        else
            // Poll until tx is confirmed
            return await fromPromise(confirm_tx(url, txhash));
            //return liftEither(Left('not yet confirmed'));
    });

// TODO type annotation for wallet
export const send_mel = (
    wallet_name: string,
    wallet: Wallet,
    to: string,
    mel: number,
    port: number = default_port)
:EitherAsync<string, TxHash> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        const micromel = mel * 1000;
        const outputs  = [micromel, wallet.total_micromel - micromel];
        const url_prepare_tx = `${home_addr}:${port}/wallets/${wallet_name}/prepare-tx`;
        const url_send_tx    = `${home_addr}:${port}/wallets/${wallet_name}/send-tx`;

        // Prepare tx (get a json-encoded tx back)
        const tx: any = await fromPromise(fetch_or_err(url_prepare_tx, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                outputs: outputs,
                // TODO tmp dummy
                signing_key: "cde6cb9f4850495201db80b884135870916850e3167e6eaaa8c70895e10f462a45567a851dbf93797099d0c9557494b896e0f4d9b9cc3feb93e353221ed0bffb",
            }),
        }));

        // Send tx
        const txhash: any = await fromPromise(fetch_or_err(url_send_tx, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tx),
        }));

        // Runtime type check and return
        return liftEither(mToEither( intoTxHash(txhash) ));
    });

// Get a list of all stored wallets
export const list_wallets = (port: number = default_port)
:EitherAsync<string, Wallet[]> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        const url = `${home_addr}:${port}/wallets`;
        const res = await fromPromise(fetch_or_err(url, { method: 'GET' }));

        return liftEither(mToEither(
            intoListOf(res, intoWallet)
        ));
    });
