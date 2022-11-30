import { Either, Left, Right, EitherAsync, maybe } from "purify-ts";
import { TxHash } from "./types";
import {
    MelwalletdClient, MelwalletdWallet,
} from "melwallet.js"
import { PrepareTxArgsHelpers, SwapInfo, TxBalance, WalletSummary } from "melwallet.js"
import { Denom, Transaction, CoinData, Header } from "melwallet.js"

const client: MelwalletdClient = new MelwalletdClient()

export async function maybe_error<T>(promise: Promise<T>): Promise<Either<string, T>> {
    try {
        let res = await promise;
        return Right(res);
    } catch (e: any) {
        return Left(e.message);
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
        console.log("this is the wallet: ", wallet)
        return await fromPromise(maybe_error(wallet.unlock(password)));

    });

// Send faucet to given wallet. Returns a successful request to melwalletd,
// not a successful transaction.
export const tap_faucet = (
    wallet_name: string,
): EitherAsync<string, TxHash> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const wallet = await client.get_wallet(wallet_name);
        const address = await wallet.get_address();
        let num: bigint = 1001000000n;
        let prepare_faucet_args = PrepareTxArgsHelpers.faucet(address, num);
        let tx_hash = await wallet.send_tx(prepare_faucet_args);
        return tx_hash;
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
        // the forced cast is because I don't think export_sk will ever be able to return None, since the wallet exists by this point
        let res = await fromPromise(maybe_error(wallet.export_sk(password))) as string;
        return liftEither(Right(res));
    });



export const swap_info = (
    from: Denom,
    to: Denom,
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
console.log(client)
// Get a list of all stored wallet names
export const list_wallets = (
): EitherAsync<string, string[]> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        const res = await client.list_wallets()
        return res;
    });

// Get the network status
export const network_status = (
): EitherAsync<string, Header> =>
    EitherAsync(async ({ liftEither, fromPromise }) => {
        return await fromPromise(maybe_error(client.latest_header()));
    });
