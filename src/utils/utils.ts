import { EitherAsync } from "purify-ts/EitherAsync";
import { Either, Left, Right } from "purify-ts/Either";
import { Maybe, Just, Nothing } from "purify-ts/Maybe";
import { derive_key, decrypt } from "./crypto";
import JSONbiggg from "json-bigint";
import fetch from "cross-fetch";
import BigNumber from "bignumber.js";
import type {
  WalletDump,
  TxHistory,
  TxHash,
  Transaction,
  CoinID,
  CoinData,
  PrivateKey,
  WalletSummary,
  WalletEntry,
  NetworkStatus,
} from "./types";
import Toastify from "toastify-js";
import { walletSummaries } from "../stores";
import { EventDispatcher, PromiseCallback } from "./svelte-types";

const JSONbig = JSONbiggg({ alwaysParseAsBig: true });

console.log("in utils", Either);
export const MEL = "6d";
export const TESTNET = new BigNumber(1);
export const MAINNET = new BigNumber(255);
const home_addr = "http://127.0.0.1";
const default_port = 11773;

export const kind2str = (bkind: BigNumber) => {
  const kind = bkind.toNumber();
  if (kind === 0x00) {
    return "Normal";
  } else if (kind === 0x10) {
    return "Stake";
  } else if (kind === 0x50) {
    return "DoscMint";
  } else if (kind === 0x51) {
    return "Swap";
  } else if (kind === 0x52) {
    return "LiqDeposit";
  } else if (kind === 0x53) {
    return "LiqWithdrawal";
  } else if (kind === 0xff) {
    return "Faucet";
  } else {
    throw "this should never happen";
  }
};

export const denom2str = (denom: string) => {
  if (denom === "6d") {
    return "MEL";
  } else if (denom === "64") {
    return "ERG";
  } else if (denom === "73") {
    return "SYM";
  } else {
    return "X-" + denom.substring(0, 8) + "...";
  }
};

export const wallet_dump_default: WalletDump = {
  summary: {
    total_micromel: new BigNumber(0),
    network: new BigNumber(1),
    address: "",
    locked: true,
    detailed_balance: {},
  },
  full: {
    unspent_coins: [],
    spent_coins: [],
    tx_in_progress_v2: {},
    tx_confirmed: {},
    my_covenant: "",
    network: new BigNumber(1),
  },
};

// Custom type guards
// ----

function intoTxHistory(x: any): Maybe<TxHistory> {
  if ("tx_in_progress" in x && "tx_confirmed" in x) {
    return intoListOf<[TxHash, Transaction]>(x.tx_in_progress, intoTxTuple)
      .chain((_) =>
        intoListOf<[TxHash, [Transaction, number]]>(
          x.tx_confirmed,
          intoCdhTuple
        )
      )
      .chain((_) => Just(x));
  } else return Nothing;
}

function intoTxTuple(x: any): Maybe<[TxHash, Transaction]> {
  if (typeof x == "object") {
    return intoTxHash(x[0])
      .chain((_) => intoTransaction(x[1]))
      .chain((_) => Just(x));
  } else return Nothing;
}

function intoCdhTuple(x: any): Maybe<[TxHash, [Transaction, number]]> {
  if (typeof x == "object" && typeof x[1][1] == "number") {
    return intoTxHash(x[0])
      .chain((_) => intoTransaction(x[1][0]))
      .chain((_) => Just(x));
  } else return Nothing;
}

function intoTransaction(x: any): Maybe<Transaction> {
  console.log("here", x);
  if (
    "kind" in x &&
    x.kind instanceof BigNumber &&
    "inputs" in x &&
    "outputs" in x &&
    "fee" in x &&
    x.fee instanceof BigNumber &&
    "data" in x &&
    x.data instanceof BigNumber &&
    "sigs" in x
  ) {
    return intoListOf(x.inputs, intoCoinID)
      .chain((_) => intoListOf(x.outputs, intoCoinData))
      .chain((_) => intoListOf<string>(x.scripts, intoString))
      .chain((_) => intoListOf<string>(x.sigs, intoString))
      .chain((_) => Just(x));
  } else return Nothing;
}

function intoCoinID(x: any): Maybe<CoinID> {
  if ("txhash" in x && "index" in x && typeof x.index == "number") {
    return intoTxHash(x.txhash).chain((_) => Just(x));
  } else return Nothing;
}

function intoCoinData(x: any): Maybe<CoinData> {
  if (
    "covhash" in x &&
    typeof x.covhash == "string" &&
    "value" in x &&
    typeof x.value == "number" &&
    "denom" in x &&
    typeof x.denom == "string" &&
    "additional_data" in x &&
    typeof x.additional_data == "string"
  )
    return Just(x);
  else return Nothing;
}

function intoPrivateKey(x: any): Maybe<PrivateKey> {
  return typeof x == "string" ? Just(x) : Nothing;
}

function intoWallet(x: any): Maybe<WalletSummary> {
  if (
    "total_micromel" in x &&
    typeof x.total_micromel == "number" &&
    "network" in x &&
    typeof x.network == "number" &&
    "address" in x &&
    typeof x.address == "string"
  )
    return Just(x);
  else return Nothing;
}

function intoTxHash(x: any): Maybe<TxHash> {
  if (typeof x == "string")
    // && x.length() == 256)
    return Just(x);
  else return Nothing;
}

function intoString(x: any): Maybe<string> {
  return Just(x);
}

// Helpers
// Return x in Just x or throw error on Nothing.
// Convenient do-notation for maybe types.
/*
function do_maybe<T>(e: Maybe<T>): T {
    if ( e.isJust() )
        return e.extract();
    else
        throw e.extract();
}
*/

// Do notation for EitherAsync
/*
async function do_ea<L,R>(ea: EitherAsync<L,R>): Promise<R> {
    let e = await ea;
    return do_either(e);
}
function do_either<L,R>(e: Either<L,R>): R {
    if ( e.isRight() )
        return e.extract();
    else
        throw e.extract();
}
*/

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
  if (Array.isArray(a))
    for (const x of a) {
      if (intoT(x).isNothing()) return Nothing;
    }

  return Just(a as T[]);
}

// Give a string cast error if maybe is nothing
function cast_to_either<T>(m: Maybe<T>): Either<string, T> {
  return m.caseOf({
    Just: (x) => Right(x),
    Nothing: () => Left("failed to cast json to expected type"),
  });
}

// Compute total value flowing out of wallet from a list of coins
export function net_spent(tx: Transaction, self_covhash: string): BigNumber {
  return tx.outputs
    .filter((cd) => cd.covhash != self_covhash)
    .filter((cd) => cd.denom == MEL)
    .map((cd) => cd.value)
    .reduce((a, b) => a.plus(b), new BigNumber(0))
    .plus(tx.fee);
}

/// Fetch a url endpoint and parse as json, error if the HTTP response is not OK
export async function fetch_json_or_err(
  url: string,
  opts: any
): Promise<Either<string, any>> {
  try {
    let res = await fetch(url, opts);

    if (!res.ok) return Left("(" + res.status + ") " + (await res.text()));
    else return Right(JSONbig.parse(await res.text()));
  } catch (e: any) {
    return Left(e.to_string());
  }
}

/// Fetch a url endpoint and parse as json, error if the HTTP response is not OK
export async function fetch_text_or_err(
  url: string,
  opts: any
): Promise<Either<string, string>> {
  // Throws on a promise rejection, which will be caught by EitherAsync's run()
  let res = await fetch(url, opts);

  if (!res.ok) return Left("(" + res.status + ") " + (await res.text()));
  else return Right(await res.text());
}

// Send faucet to given wallet. Returns a successful request to melwalletd,
// not a successful transaction.
export const tap_faucet = (
  wallet_name: string,
  port: number = default_port
): EitherAsync<string, TxHash> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    console.log("tapping");
    const url = `${home_addr}:${port}/wallets/${wallet_name}/send-faucet`;
    let res = await fromPromise(fetch_json_or_err(url, { method: "POST" }));
    return liftEither(cast_to_either(intoTxHash(res)));
  });

// Creates a new wallet and returns a private key for the new wallet.
export const new_wallet = (
  wallet_name: string,
  use_testnet: boolean,
  password: string,
  secret?: string,
  port: number = default_port
): EitherAsync<string, void> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url = `${home_addr}:${port}/wallets/${wallet_name}`;
    await fromPromise(
      fetch_text_or_err(url, {
        method: "PUT",
        body: JSONbig.stringify({ testnet: use_testnet, password: password, secret }),
      })
    );

    return liftEither(Right(undefined));
  });

// Locks up a wallet.
export const lock_wallet = (
  wallet_name: string,
  port: number = default_port
): EitherAsync<string, void> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {

    console.log('locking')
    const url = `${home_addr}:${port}/wallets/${wallet_name}/lock`;
    await fromPromise(
      fetch_text_or_err(url, {
        method: "POST",
      })
    );

    // Response is a quoted string, so json parses to a string
    return liftEither(Right(undefined));
  });

// Unlocks a wallet.
export const unlock_wallet = (
  wallet_name: string,
  password: string,
  port: number = default_port
): EitherAsync<string, void> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url = `${home_addr}:${port}/wallets/${wallet_name}/unlock`;
    await fromPromise(
      fetch_text_or_err(url, {
        method: "POST",
        body: JSONbig.stringify({
          password: password,
        }),
      })
    );

    return liftEither(Right(undefined));
  });

  // Unlocks a wallet.
export const export_sk = (
  wallet_name: string,
  password: string,
  port: number = default_port
): EitherAsync<string, void> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url = `${home_addr}:${port}/wallets/${wallet_name}/export-sk`;
    await fromPromise(
      fetch_text_or_err(url, {
        method: "POST",
        body: JSONbig.stringify({
          password: password,
        }),
      })
    );

    return liftEither(Right(undefined));
  });

// // Poll daemon to check tx until it is confirmed
// // TODO handle when daemon returns failed tx
// export const confirm_tx = async (
//   url: string,
//   txhash: TxHash
// ): Promise<Either<string, BlockHeight>> =>
//   EitherAsync(async ({ liftEither, fromPromise }) => {
//     let res: Response = await fromPromise(
//       fetch_json_or_err(url, { method: "GET" })
//     );
//     let json = JSONbig.parse(await res.text());
//     const height: BlockHeight | null = json.confirmed_height;

//     if (height != null) return liftEither(Right(height as BlockHeight));
//     // Poll until tx is confirmed
//     else return await fromPromise(confirm_tx(url, txhash));
//   });

export const add_coin = (
  wallet_name: string,
  coin_id_string: string,
  port: number = default_port
): EitherAsync<string, void> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url_add_coin = `${home_addr}:${port}/wallets/${wallet_name}/coins/${coin_id_string}`;
    await fromPromise(
      fetch_text_or_err(url_add_coin, {
        method: "PUT",
        body: "",
      })
    );
  });

export interface SwapInfo {
  result: BigNumber;
  price_impact: BigNumber;
  poolkey: string;
}

export const swap_info = (
  from: string,
  to: string,
  value: BigNumber,
  testnet: boolean,
  port: number = default_port
): EitherAsync<string, SwapInfo> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url_swap_info = `${home_addr}:${port}/pool_info`;

    // Send tx
    const nfo: any = await fromPromise(
      fetch_json_or_err(url_swap_info, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONbig.stringify({
          from: from,
          to: to,
          value: value,
          testnet: testnet,
        }),
      })
    );

    // Runtime type check and return
    return nfo;
  });

export const send_tx = (
  wallet_name: string,
  transaction: Transaction,
  port: number = default_port
): EitherAsync<string, TxHash> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url_send_tx = `${home_addr}:${port}/wallets/${wallet_name}/send-tx`;

    // Send tx
    const e_txhash: any = await fromPromise(
      fetch_json_or_err(url_send_tx, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONbig.stringify(transaction),
      })
    );

    // Runtime type check and return
    return e_txhash;
  });

export const prepare_swap_tx = (
  wallet_name: string,
  poolkey: string,
  outputs: CoinData[],
  port: number = default_port
): EitherAsync<string, Transaction> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url_prepare_tx = `${home_addr}:${port}/wallets/${wallet_name}/prepare-tx`;
    // Prepare tx (get a json-encoded tx back)
    const tx = await fromPromise(
      fetch_json_or_err(url_prepare_tx, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONbig.stringify({
          kind: 0x51,
          data: poolkey,
          outputs,
        }),
      })
    );

    return tx;
  });
export function WaitableEvent<T> (type: string,dispatcher: EventDispatcher, callback: PromiseCallback<T>): 
  (detail?: any, timeout?: number)=>Promise<T> {
  return (detail={},timeout)=>
       new Promise((resolve, reject)=>{
          if(timeout) setTimeout(()=>reject("Promise Failure"), timeout);
          dispatcher(type, Object.assign(detail, {_callback: callback(resolve, reject)}))
  })
  
}
export const ensure_unlocked = async (
  walletName: string,
  walletSummary: WalletSummary,
  pwd: string,
) => {
  if (walletSummary.locked) {
    if (pwd != undefined) {
      console.log('unlock wallet')
      let result = await unlock_wallet(walletName, pwd).run();
      result.ifLeft((err) => {
        throw err;
      });
    }
  }
};

export const prepare_tx = (
  wallet_name: string,
  outputs: CoinData[],
  port: number = default_port
): EitherAsync<string, Transaction> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url_prepare_tx = `${home_addr}:${port}/wallets/${wallet_name}/prepare-tx`;
    // Prepare tx (get a json-encoded tx back)
    const tx = await fromPromise(
      fetch_json_or_err(url_prepare_tx, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONbig.stringify({
          outputs: outputs,
        }),
      })
    );

    return tx;
  });

// export const send_mel = (
//   wallet_name: string,
//   wallet: WalletSummary,
//   to: string[],
//   mel: BigNumber[],
//   additional_data: string = "",
//   port: number = default_port
// ): EitherAsync<string, TxHash> =>
//   EitherAsync(async ({ liftEither, fromPromise }) => {
//     let tx_res = await prepare_tx(wallet_name, to, mel, additional_data, port);

//     const tx: Transaction = await liftEither(
//       cast_to_either(intoTransaction(tx_res))
//     );
//     return liftEither(await send_tx(wallet_name, tx));
//   });

// Get a list of all stored wallets
export const list_wallets = (
  port: number = default_port
): EitherAsync<string, WalletSummary[]> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url = `${home_addr}:${port}/wallets`;
    const res = await fromPromise(fetch_json_or_err(url, { method: "GET" }));

    return liftEither(cast_to_either(intoListOf(res, intoWallet)));
  });

// Get a list of all stored wallets
export const list_transactions = (
  walletName: string,
  port: number = default_port
): EitherAsync<string, [string, BigNumber | null][]> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url = `${home_addr}:${port}/wallets/${walletName}/transactions`;
    const res = await fromPromise(fetch_json_or_err(url, { method: "GET" }));

    return res;
  });

// Get the balance for one particular transaction
export const transaction_balance = (
  walletName: string,
  txhash: string,
  port: number = default_port
): EitherAsync<string, [boolean, { [key: string]: BigNumber }]> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url = `${home_addr}:${port}/wallets/${walletName}/transactions/${txhash}/balance`;
    const res = await fromPromise(fetch_json_or_err(url, { method: "GET" }));

    return res;
  });

// Get the full value for one particular transaction
export const transaction_full = (
  walletName: string,
  txhash: string,
  port: number = default_port
): EitherAsync<string, Transaction> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url = `${home_addr}:${port}/wallets/${walletName}/transactions/${txhash}`;
    const res = await fromPromise(fetch_json_or_err(url, { method: "GET" }));

    return res.raw;
  });

// Get the network status
export const network_status = (
  testnet: boolean,
  port: number = default_port
): EitherAsync<string, NetworkStatus> =>
  EitherAsync(async ({ liftEither, fromPromise }) => {
    const url = `${home_addr}:${port}/summary` + (testnet ? "testnet" : "");
    return await fromPromise(fetch_json_or_err(url, { method: "GET" }));
  });

// Simple toast
export const showToast = (m: string) => {
  Toastify({
    text: m,
    position: "center",
    style: {
      background: "black",
      boxShadow: "none",
    },
  }).showToast();
};

// Copy to clipboard
export const copyToClipboard = (text: string) => {
  var input = document.createElement("textarea");
  input.innerHTML = text;
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand("copy");
  document.body.removeChild(input);
  return result;
};
