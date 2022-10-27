import { Either, Left, Right, EitherAsync, maybe } from "purify-ts";
import { TxHash } from "./types";
import {
    CoinData, Header,
    MelwalletdClient, MelwalletdWallet,
    Transaction, ThemelioJson as JsonBig, prepare_faucet, UnpreparedTransaction, WalletSummary, ThemelioJson, TxBalance, PoolState, SwapInfo, send_faucet
} from "melwallet.js"


const client: MelwalletdClient = new MelwalletdClient()
const default_port = 11773


export async function maybe_error<T>(promise: Promise<T>): Promise<Either<string, T>> {
    try {
        let res = await promise;
        return Right(res);
    } catch (e: any) {
        return Left(e.to_string());
    }
}

type Wallet = InstanceType<typeof MelwalletdWallet>
type WalletMethodTypes<K extends keyof Wallet> =
    Parameters<Wallet[K]>

let get_wallet = async (client: MelwalletdClient, wallet_name: string) => {
    let wallet = await client.get_wallet(wallet_name)
    let f = async <T extends keyof Wallet>(func_name: T) => {
        let wallet_func = wallet[func_name]

        return wallet_func
    }
    let func = await f("unlock")
    let args = ["123"] as const
    func(...args)
}

// Locks up a wallet.
export const lock_wallet = (
    wallet_name: string,
): EitherAsync<string, boolean> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        console.log("locking");
        const wallet = await client.get_wallet(wallet_name)
        return await fromPromise(maybe_error(wallet.lock()));
    });

// Unlocks a wallet.
export const unlock_wallet = (
    wallet_name: string,
    password: string,
): EitherAsync<string, boolean> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name)
        return await fromPromise(maybe_error(wallet.unlock(password)));

    });

// Send faucet to given wallet. Returns a successful request to melwalletd,
// not a successful transaction.
export const tap_faucet = (
    wallet_name: string,
): EitherAsync<string, TxHash> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name);
        let num: bigint = 1001000000n;
        let res = await fromPromise(maybe_error(send_faucet(wallet)));
        return await res;
    });

// Creates a new wallet and returns a private key for the new wallet.
export const new_wallet = (
    wallet_name: string,
    use_testnet: boolean,
    password: string,
    secret?: string,
): EitherAsync<string, void> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        await fromPromise(maybe_error(client.create_wallet(wallet_name, password)));

        return liftEither(Right(undefined));
    });


// Unlocks a wallet.
export const export_sk = (
    wallet_name: string,
    password: string,
): EitherAsync<string, string> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name);
        let res = await fromPromise(maybe_error(wallet.export_sk(password)));
        return liftEither(Right(res));
    });



export const swap_info = (
    from: string,
    to: string,
    value: bigint,
    testnet: boolean,
): EitherAsync<string, SwapInfo> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {

        // Send tx
        const nfo: SwapInfo | null = await fromPromise(maybe_error(client.simulate_swap(to, from, value)));
        if (!nfo) {
            throw `unable to swap: ${to}/${from}`
        }
        // Runtime type check and return
        return nfo;
    });


export const send_tx = (
    wallet_name: string,
    transaction: Transaction,
): EitherAsync<string, TxHash> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name);
        // Send tx
        const e_txhash: any = await fromPromise(maybe_error(wallet.send_tx(transaction)));
        // Runtime type check and return
        return e_txhash;
    });

export const prepare_swap_tx = (
    wallet_name: string,
    poolkey: string,
    outputs: CoinData[],
): EitherAsync<string, Transaction> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name);
        const prepare_swap: UnpreparedTransaction = {
            kind: 0x51,
            data: poolkey,
            outputs,
        };
        const tx: Transaction = await fromPromise(
            maybe_error(wallet.prepare_transaction(prepare_swap)));
        return tx;
    });

export const ensure_unlocked = async (
    wallet_name: string,
    pwd: string
) => {
    const wallet = await client.get_wallet(wallet_name);
    try {
        await wallet.unlock(pwd);
    }
    catch {

    }

};

export const prepare_tx = (
    wallet_name: string,
    outputs: CoinData[],
): EitherAsync<string, Transaction> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name);
        const prepared: UnpreparedTransaction = {
            outputs,
        };
        // Prepare tx (get a json-encoded tx back)
        const tx = await fromPromise(
            maybe_error(wallet.prepare_transaction(prepared)));

        return tx;
    });


// Get a list of all stored wallets
export const list_wallets = (
): EitherAsync<string, Map<String, WalletSummary>> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const res = maybe_error(client.list_wallets());
        return fromPromise(res);
    });

// Get a list of all stored wallets
export const list_transactions = (
    wallet_name: string,
): EitherAsync<string, [string, bigint | null][]> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name);
        const res = await fromPromise(maybe_error(wallet.list_transactions()));

        return res;
    });

// Get the balance for one particular transaction
export const transaction_balance = (
    wallet_name: string,
    txhash: string,
): EitherAsync<string, TxBalance> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name);
        const tx = wallet.get_transaction(txhash);
        const res = await fromPromise(maybe_error(wallet.get_transaction_balance(txhash)));
        return res;
    });

// Get the full value for one particular transaction
export const transaction_full = (
    wallet_name: string,
    txhash: string,
): EitherAsync<string, Transaction> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name);
        const res = await fromPromise(maybe_error(wallet.get_transaction(txhash)));

        return res;
    });

// Get the network status
export const network_status = (
): EitherAsync<string, Header> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        return await fromPromise(maybe_error(client.get_summary()));
    });
