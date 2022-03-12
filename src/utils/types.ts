import type { Either } from "purify-ts";
import type { Readable, Writable } from "svelte/store";
import type BigNumber from "bignumber.js";

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
  total_micromel: BigNumber;
  network: number;
  address: string;
  locked: boolean;
}

export type WalletEntry = { [key: string]: WalletSummary };

export interface CoinData {
  covhash: string;
  value: BigNumber;
  denom: string;
  additional_data: string;
}

export interface CoinDataHeight {
  coin_data: CoinData;
  height: number;
}

export interface CoinID {
  txhash: TxHash;
  index: number;
}

export interface Transaction {
  kind: number;
  inputs: CoinID[];
  outputs: CoinData[];
  fee: BigNumber;
  scripts: string[];
  data: string;
  sigs: string[];
}

export interface TxHistory {
  tx_in_progress: [TxHash, Transaction][];
  tx_confirmed: [TxHash, [Transaction, number]][];
}

export interface WalletDump {
  summary: WalletSummary;
  full: {
    unspent_coins: [CoinID, CoinDataHeight][];
    spent_coins: [CoinID, CoinDataHeight][];
    tx_in_progress_v2: { [key: string]: [Transaction, number] };
    tx_confirmed: { [key: string]: [Transaction, number] };
    my_covenant: string;
    network: number;
  };
}

export type UnconfirmedTransaction = [TxHash, [Transaction]];
export type ConfirmedTransaction = [TxHash, [Transaction, number]];
export type Either_Transaction = Either<
  UnconfirmedTransaction,
  ConfirmedTransaction
>;

export type Obj<T> = { [key: string]: T };
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
