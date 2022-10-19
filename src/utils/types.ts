import type { Either } from "purify-ts";
import type { Readable, Writable } from "svelte/store";
import { CoinDataHeight, Transaction } from "melwallet.js";

export type BlockHeight = number;
export type TxHash = string;
export type PrivateKey = string;

// The object stored in local storage.
// priv_key is encrypted and can be decrypted using iv, salt, and a
// user-provided password.
export interface WalletCryptoData {
  salt: Uint8Array;
  iv: Uint8Array;
  priv_key: Uint8Array;
}

export interface WalletSummary {
  total_micromel: bigint;
  network: bigint;
  address: string;
  locked: boolean;
  detailed_balance: Obj<bigint>;
}

export type WalletEntry = { [key: string]: WalletSummary };


export interface CoinID {
  txhash: TxHash;
  index: bigint;
}


export interface TxHistory {
  tx_in_progress: [TxHash, Transaction][];
  tx_confirmed: [TxHash, [Transaction, bigint]][];
}

export interface WalletDump {
  summary: WalletSummary;
  full: {
    unspent_coins: [CoinID, CoinDataHeight][];
    spent_coins: [CoinID, CoinDataHeight][];
    tx_in_progress_v2: { [key: string]: [Transaction, bigint] };
    tx_confirmed: { [key: string]: [Transaction, bigint] };
    my_covenant: string;
    network: bigint;
  };
}

export type UnconfirmedTransaction = [TxHash, [Transaction]];
export type ConfirmedTransaction = [TxHash, [Transaction, bigint]];
export type Either_Transaction = Either<
  UnconfirmedTransaction,
  ConfirmedTransaction
>;

export type Obj<T> = Record<string, T>;
export type PersistentStorage = PersistentValue[];

export interface Named {
  name: string;
}
export interface PersistentValue extends Named {
  value: any;
}

/**
 * This interface describes a single setting field within the larger settings context.
 * the settings context is used to manage global state and track user preferences
 * the settings which track user preferences should be set as `visible: true`
 */

export interface SettingConfig {
  label?: string;
  field?: string; // the type of the setting input (can be anything supported by )
  options?: Obj<string | number>; // for types with multiple selection options
  depends?: Obj<string | number | boolean>;
  visible?: boolean; // should this be displayed (interpreted by the acting component)
  override?: boolean; // should the default value be used instead of persisting (debug tool)
  default: any;
}

/**
 * These are the settings which describe global state and user preferences
 */
export interface State<
  T extends SettingConfig | PersistentValue | Readable<any> | string
> {
  network: T;
  persistent_tabs: T;
  default_tab: T;
  current_wallet: T;
  active_tab: T;
  contacts: T;
}

export interface StateObject {
  settings: State<Writable<string>>;
  // writable_settings: Writable<State<string>>;
  // set_setting: (name: string | Readable<string>, value: string | Readable<string>) => void;
}

// Network status
export interface NetworkStatus {
  network: bigint;
  previous: string;
  height: bigint;
  history_hash: string;
  coins_hash: string;
  transactions_hash: string;
  fee_pool: bigint;
  fee_multiplier: bigint;
  dosc_speed: bigint;
  pools_hash: string;
  stakes_hash: string;
}
