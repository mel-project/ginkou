import { derived, readable, Readable, writable, Writable } from "svelte/store";
import { list_wallets, network_status } from "./utils/wallet-utils";
import { Header, MelwalletdClient, NetID, NotPromise, ThemelioJson, ThemelioWallet, WalletSummary } from "melwallet.js"
import { Either } from "purify-ts";

export function persistentWritable<T>(
  storage_name: string,
  default_value: NotPromise<T>
): Writable<T> {
  let storedString = localStorage.getItem(storage_name);
  let currentValue = storedString ? ThemelioJson.parse(storedString) as T : default_value;
  let w = writable(currentValue);
  w.subscribe((value: T) => {
    // console.log("storing", value);
    localStorage.setItem(storage_name, ThemelioJson.stringify(value as any));
  });
  return w;
}

export const melwalletdClient: MelwalletdClient = new MelwalletdClient();
const default_header: Header = {
  network: NetID.Custom08,
  previous: "",
  height: 0n,
  history_hash: "",
  coins_hash: "",
  transactions_hash: "",
  fee_pool: 0n,
  fee_multiplier: 0n,
  dosc_speed: 0n,
  pools_hash: "",
  stakes_hash: ""
}

export const latestHeader: Readable<Header> = readable(
  default_header,
  (set) => {
    const refresh = async () => {
      // fetch the stuff and set
     melwalletdClient.latest_header().then(set)
    };
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }
);

// List of all wallets, both mainnet and testnet
let lastSummaries: any = 0;
export const walletList: Readable<string[]> = readable(
  [] as string[],
  (set) => {
    const refresh = async () => {
      // fetch the stuff and set
      let list: Either<string, string[]> = await list_wallets()
      if (list.isLeft()) set([]);
      set(list.unsafeCoerce())
    };
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }
);

// Name of current wallet, as a string.
export const currentWalletName: Writable<string> = persistentWritable(
  "current_wallet",
  "%null%"
);

export const currentWallet: Readable<ThemelioWallet> = derived(
  currentWalletName,
  (wallet_name, set) => {
    if (!wallet_name) return;
    melwalletdClient.get_wallet(wallet_name).then(set);
    return;
  }
)

// Summary of current wallet.
export const currentWalletSummary: Readable<WalletSummary> = derived(
  currentWallet,
  (wallet: ThemelioWallet | null, set) => {
    const refresh = async () => {
      if (wallet) {
        wallet.get_name()
          .then((name)=>melwalletdClient.wallet_summary(name))
          .then(set)
      }
      // fetch the stuff and set
    };
    refresh();
    const interval = setInterval(refresh, 200);
    return () => clearInterval(interval);
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


