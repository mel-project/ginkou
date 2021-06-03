import { EitherAsync } from 'purify-ts/EitherAsync';
import { Either, Left, Right } from 'purify-ts/Either';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe';
import fetch from 'cross-fetch';

export type BlockHeight = number;
export type TxHash = string;
export type PrivateKey = string;

export const MEL = '6d';

const home_addr = 'http://127.0.0.1';
const default_port = 11773;

export interface Wallet {
    total_micromel: number,
    network: number,
    address: TxHash,
}

export interface CoinData {
    covhash: string,
    value: number,
    denom: string,
    additional_data: string,
}

export interface CoinDataHeight {
    coin_data: CoinData,
    height: number,
}

export interface CoinID {
    txhash: TxHash,
    index: number,
}

export interface Transaction {
    kind: number,
    inputs: CoinID[],
    outputs: CoinData[],
    fee: number,
    scripts: string[],
    data: string,
    sigs: string[],
}

export interface TxHistory {
    tx_in_progress: [TxHash, Transaction][],
    tx_confirmed: [TxHash, [Transaction, number]][],
}

export interface WalletDump {
    summary: {
        total_micromel: number,
        network: number,
        address: string,
    },
    full: {
        unspent_coins: [CoinID, CoinDataHeight][],
        spent_coins: [CoinID, CoinDataHeight][],
        tx_in_progress: [TxHash, Transaction][],
        tx_confirmed: [TxHash, [Transaction, number]][],
        my_covenant: string,
        network: number,
    }
}

export const wallet_dump_default: WalletDump = {
    summary: {
        total_micromel: 0,
        network: 1,
        address: '',
    },
    full: {
        unspent_coins: [],
        spent_coins: [],
        tx_in_progress: [],
        tx_confirmed: [],
        my_covenant: '',
        network: 1,
    }
}

// Custom type guards
// ----

function intoTxHistory(x: any): Maybe<TxHistory> {
    if ('tx_in_progress' in x && 'tx_confirmed' in x) {
        const tx_in_progress = do_maybe(intoListOf<[TxHash, Transaction]>(x.tx_in_progress, intoTxTuple));
        const tx_confirmed = do_maybe(intoListOf<[TxHash, [Transaction, number]]>(x.tx_confirmed, intoCdhTuple));

        return Just(x);
    } else
        return Nothing;
}

function intoTxTuple(x: any): Maybe<[TxHash, Transaction]> {
    if ( typeof(x) == 'object' ) {
        const txhash = do_maybe( intoTxHash(x[0]) );
        const tx     = do_maybe( intoTransaction(x[1]) );

        return Just(x);
    }
    else
        return Nothing;
}

function intoCdhTuple(x: any): Maybe<[TxHash, [Transaction, number]]> {
    if ( typeof(x) == 'object'
         && typeof(x[1][1]) == 'number' )
    {
        const txhash = do_maybe( intoTxHash(x[0]) );
        const tx     = do_maybe( intoTransaction(x[1][0]) );

        return Just(x);
    }
    else
        return Nothing;
}

function intoTransaction(x: any): Maybe<Transaction> {
    if ('kind' in x && typeof(x.kind) == 'number'
        && 'inputs' in x
        && 'outputs' in x
        && 'fee' in x && typeof(x.fee) == 'number'
        && 'scripts' in x
        && 'data' in x && typeof(x.data) == 'string'
        && 'sigs' in x)
    {
        const inputs  = do_maybe( intoListOf(x.inputs, intoCoinID) );
        const output  = do_maybe( intoListOf(x.outputs, intoCoinData) );
        const scripts = do_maybe( intoListOf<string>(x.scripts, JSON.parse) );
        const sigs    = do_maybe( intoListOf<string>(x.sigs, JSON.parse) );

        return Just(x);
    }
    else return Nothing;
}

function intoCoinID(x: any): Maybe<CoinID> {
    if ('txhash' in x
     && 'index' in x && typeof(x.index) == 'number')
    {
        const txhash = do_maybe( intoTxHash(x.txhash) );

        return Just(x);
    }
    else
        return Nothing;
}

function intoCoinData(x: any): Maybe<CoinData> {
    if ('covhash' in x && typeof(x.covhash) == 'string'
     && 'value' in x && typeof(x.value) == 'number'
     && 'denom' in x && typeof(x.denom) == 'string'
     && 'additional_data' in x && typeof(x.additional_data) == 'string')
        return Just(x);
    else
        return Nothing;
}

function intoPrivateKey(x: any): Maybe<PrivateKey> {
    return typeof(x) == 'string' ? Just(x) : Nothing;
}

function intoWallet(x: any): Maybe<Wallet> {
    if ('total_micromel' in x && typeof(x.total_micromel) == 'number'
        && 'network' in x     && typeof(x.network) == 'number'
        && 'address' in x     && typeof(x.address) == 'string')
        return Just(x);
    else
        return Nothing;
}

function intoTxHash(x: any): Maybe<TxHash> {
    if (typeof(x) == 'string')// && x.length() == 256)
        return Just(x);
    else
        return Nothing;
}

// Helpers

// Return x in Just x or throw error on Nothing.
// Convenient do-notation for maybe types.
function do_maybe<T>(e: Maybe<T>): T {
    if ( e.isJust() )
        return e.extract();
    else
        throw e.extract();
}


// Casting functions
// ----

/*
function intoTxHash(x: any): Maybe<TxHash> {
    return is<TxHash>(x) ? Just(x) : Nothing;
}

function intoWallet(x: any): Maybe<Wallet> {
    return is<Wallet>(x) ? Just(x) : Nothing;
}

function intoPrivateKey(x: any): Maybe<PrivateKey> {
    return is<PrivateKey>(x) ? Just(x) : Nothing;
}
*/

function intoListOf<T>(a: any, intoT: (a0: any) => Maybe<T>): Maybe<T[]> {
    if ( Array.isArray(a) )
        for (const x of a) {
            if ( intoT(a).isNothing() )
                return Nothing;
        }

    return Just(a as T[]);
}

// Give a string cast error if maybe is nothing
function cast_to_either<T>(m: Maybe<T>): Either<string, T> {
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
export const tap_faucet = (wallet_name: string, port: number = default_port)
: EitherAsync<string, TxHash> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        const url = `${home_addr}:${port}/wallets/${wallet_name}/send-faucet`;
        let res = await fromPromise(fetch_or_err(url, { method: 'POST' }));
        return liftEither(cast_to_either(intoTxHash(res)));
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
        return liftEither( cast_to_either<PrivateKey>(intoPrivateKey(res)) );
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
    });

export const send_mel = (
    wallet_name: string,
    wallet: Wallet,
    to: string,
    mel: number,
    priv_key: PrivateKey,
    additional_data: string = '',
    port: number = default_port)
:EitherAsync<string, TxHash> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        const url_prepare_tx = `${home_addr}:${port}/wallets/${wallet_name}/prepare-tx`;
        const url_send_tx    = `${home_addr}:${port}/wallets/${wallet_name}/send-tx`;

        const micromel = mel * 1000;
        const outputs: CoinData[]  = [
            {
                covhash: to,
                value: micromel,
                denom: MEL,
                additional_data: additional_data
            }
        ];

        // Prepare tx (get a json-encoded tx back)
        const tx: any = await fromPromise(fetch_or_err(url_prepare_tx, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                outputs: outputs,
                signing_key: priv_key,
            }),
        }));

        // Send tx
        const e_txhash = await fromPromise(fetch_or_err(url_send_tx, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tx),
        }));

        // Runtime type check and return
        return liftEither(cast_to_either( intoTxHash(e_txhash) ));
    });

// Get a list of all stored wallets
export const list_wallets = (port: number = default_port)
:EitherAsync<string, Wallet[]> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        const url = `${home_addr}:${port}/wallets`;
        const res = await fromPromise(fetch_or_err(url, { method: 'GET' }));

        return liftEither(cast_to_either(
            intoListOf(res, intoWallet)
        ));
    });

export const wallet_dump = (wallet_name: string, port: number = default_port)
:EitherAsync<string, WalletDump> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        const url = `${home_addr}:${port}/wallets/${wallet_name}`;
        const res = await fromPromise(fetch_or_err(url, { method: 'GET' }));

        // TODO cast this with runtime checks
        return liftEither( Right(res as WalletDump) );
    });

// Get a TxHistory of a given wallet
export const tx_history = (wallet_name: string, port: number = default_port)
:EitherAsync<string, TxHistory> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        const dump = await fromPromise(wallet_dump(wallet_name, port));

        return liftEither(cast_to_either(intoTxHistory(dump.full)));
    });
