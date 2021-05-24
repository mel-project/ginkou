import { EitherAsync } from 'purify-ts/EitherAsync';
import { Either, Left, Right } from 'purify-ts/Either';

export type BlockHeight = number;
export type TxHash = string;
export type PrivateKey = string;

const home_addr = '127.0.0.1';
const default_port = 11773;

export async function fetch_or_err(url: string, opts): Promise<Either<string, Response>> {
    // Throws on a promise rejection, which will be caught by EitherAsync's run()
    let res = await fetch(url, opts);

    if ( !res.ok )
        return Left(res.statusText);
    else
        return Right(res);
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
export const new_wallet = (url: string, use_testnet: boolean)
: EitherAsync<string, PrivateKey> =>
    EitherAsync( async ({ fromPromise }) => {
        //let addr = url + '/' + wallet_name;
        let res: Response = await fromPromise(fetch_or_err(url, {
            method: 'PUT',
            body: { testnet : use_testnet },
        }));

        // Response is a quoted string, so json parses to a string
        return await res.json();
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
export const send_mel = (base_url: string, wallet_name: string, wallet, mel: number)
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
            body: {
                outputs: outputs,
                // TODO tmp dummy
                signing_key: "cde6cb9f4850495201db80b884135870916850e3167e6eaaa8c70895e10f462a45567a851dbf93797099d0c9557494b896e0f4d9b9cc3feb93e353221ed0bffb",
            },
        }));

        // Tx hash or throws
        const tx: TxHash = await res.json();

        // Send tx
        const send_res: Response = await fromPromise(fetch_or_err(addr + '/send-tx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: tx,
        }));

        return send_res.text();
    });

// Get a list of all stored wallets
/*
export const list_wallets = (port: number = default_port)
:EitherAsync<string, Wallet[]> =>
    EitherAsync( async ({ fromPromise }) => {
        const url = '${home_addr}:${port}/wallets';
        const res = fromPromise(fetch_or_err(url, { method: 'GET' }));
    });
*/
