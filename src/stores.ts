import { derived, readable, Readable, writable, Writable } from "svelte/store";
import type {
  NetworkStatus,
  Obj,
  PersistentValue,
  WalletSummary,
} from "./utils/types";
import { list_wallets, network_status, TESTNET } from "./utils/utils";
import JSONbig from "json-bigint";

export function persistentWritable<T>(
  storage_name: string,
  default_value: T
): Writable<T> {
  let initString = localStorage.getItem(storage_name);
  let initValue = null;
  initValue = (initString && JSONbig.parse(initString)) || default_value;
  let w = writable(initValue);
  w.subscribe((value: T) => {
    console.log("storing", value);
    localStorage.setItem(storage_name, JSONbig.stringify(value));
  });
  return w;
}

// List of all wallets, both mainnet and testnet
let lastSummaries: any = 0;
export const walletSummaries: Readable<Obj<WalletSummary>> = readable(
  {},
  (set) => {
    const refresh = async () => {
      // fetch the stuff and set
      const list = await list_wallets();
      list
        .ifLeft((e) =>
          console.log(`error encountered in list_wallets: ${JSON.stringify(e)}`)
        )
        .map((list) => {
          // console.info("obtained list_wallets");
          if (JSON.stringify(list) !== lastSummaries) {
            lastSummaries = JSON.stringify(list);
            set(list);
          }
        });
    };
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }
);

// Name of current wallet, as a string.
export const currentWalletName: Writable<string | null> = persistentWritable(
  "current_wallet",
  null
);

// Summary of current wallet.
export const currentWalletSummary: Readable<WalletSummary | null> = derived(
  [walletSummaries, currentWalletName],
  ([a, b]) => (b ? a[b] : null)
);

// Current network status
export const currentNetworkStatus: Readable<NetworkStatus | null> = derived(
  [currentWalletSummary],
  ([summary], set) => {
    if (summary) {
      const refresh = async () => {
        // fetch the stuff and set
        const list = await network_status(summary.network.eq(TESTNET));
        list
          .ifLeft((e) =>
            console.error(
              `error encountered in network_status: ${JSON.stringify(e)}`
            )
          )
          .ifRight((list) => {
            set(list);
          });
      };
      refresh();
      const interval = setInterval(refresh, 15000);
      return () => clearInterval(interval);
    }
  }
);

export const persistent_tabs: Writable<boolean> = persistentWritable(
  "persistent_tabs",
  false
);
export const last_tab: Writable<number> = persistentWritable("last_tab", 0);
export const default_tab: Writable<number> = persistentWritable(
  "default_tab",
  0
);
export const miscSettings: Writable<{ [key: string]: any }> = writable({});
