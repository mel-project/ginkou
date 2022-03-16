import { derived, readable, Readable, writable, Writable } from "svelte/store";
import type { Obj, PersistentValue, WalletSummary } from "./utils/types";
import { list_wallets } from "./utils/utils";
import JSONbig from "json-bigint";

const persistentWritable = (storage_name: string): Writable<any> => {
  let initString = localStorage.getItem(storage_name);
  let initValue = null;
  try {
    initValue = initString && JSONbig.parse(initString);
  } catch {}
  let w = writable(initValue);
  w.subscribe((value: any) => {
    localStorage.setItem(storage_name, JSONbig.stringify(value));
  });
  return w;
};

// List of all wallets, both mainnet and testnet
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
          set(list);
        });
    };
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }
);

// Name of current wallet, as a string.
export const currentWalletName: Writable<string | null> = persistentWritable(
  "current_wallet"
);

// Summary of current wallet.
export const currentWalletSummary: Readable<WalletSummary | null> = derived(
  [walletSummaries, currentWalletName],
  ([a, b]) => (b ? a[b] : null)
);
