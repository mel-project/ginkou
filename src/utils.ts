import { EitherAsync } from 'purify-ts/EitherAsync';
import { Either, Left, Right } from 'purify-ts/Either';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
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


// Casting functions
// ----

function intoWallet(x: any): Maybe<Wallet> {
    return is<Wallet>(x) ? Just(x) : Nothing;
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
function castEither<T>(m: Maybe<T>): Either<string, T> {
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
        return liftEither( castAnyEither<PrivateKey>(res, isPrivateKey) );
        //return liftEither( fromAnyEither<PrivateKey>(res) );
    });

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
export const send_mel = (base_url: string, wallet_name: string, wallet: any, mel: number)
//: Promise<Either<string, TxHash>> =>
:EitherAsync<string, TxHash> =>
    EitherAsync( async ({ fromPromise }) => {
        const micromel = mel * 1000;
        //const wallet   = wallets[wallet_name];
        const outputs  = [micromel, wallet.total_micromel - micromel];
        const addr     = base_url + '/wallets/' + wallet_name;

        // Prepare tx
        const res: Response = await fromPromise(fetch_or_err(addr + '/prepare-tx', {
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

        // Tx hash or throws
        const tx: TxHash = await res.json();

        // Send tx
        const send_res: Response = await fromPromise(fetch_or_err(addr + '/send-tx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tx),
        }));

        return send_res.text();
    });

// Get a list of all stored wallets
export const list_wallets = (port: number = default_port)
:EitherAsync<string, Wallet[]> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        const url = `${home_addr}:${port}/wallets`;
        const res = await fromPromise(fetch_or_err(url, { method: 'GET' }));

        return liftEither(castEither<Wallet[]>(intoListOf<Wallet>(res, intoWallet)));
    });
