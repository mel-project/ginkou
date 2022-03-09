import { derived, readable, Readable, Subscriber, Writable, writable } from "svelte/store";
import { list_wallets,  wallet_dump } from "./utils";
import JSONbig from "json-bigint";
import { Maybe, Just, Nothing } from "purify-ts/Maybe";
import type { PersistentValue, PersistentStorage, SettingConfig,
   Obj, State, StateObject,WalletSummary, WalletDump,Transaction, WalletCryptoData } from "./types";


// todo: implement 
// these functions are never used
export function store_wallet(
    wallet_name: string,
    encrypted_priv_key: Uint8Array,
    salt: Uint8Array,
    iv: Uint8Array
  ) {
    localStorage.setItem(
      wallet_name,
      JSON.stringify({
        iv: [].map.call(iv, (x) => x),
        salt: [].map.call(salt, (x) => x),
        priv_key: [].map.call(encrypted_priv_key, (x) => x),
      })
    );
  }
  
  // TODO put in a maybe
  export function get_wallet(wallet_name: string): WalletCryptoData {
    let data = JSONbig.parse(localStorage.getItem(wallet_name) as unknown as string);
    // if (data == null)
    data.salt = new Uint8Array(data.salt);
    data.iv = new Uint8Array(data.iv);
    data.priv_key = new Uint8Array(data.priv_key);
  
    return data;
  }
  
// this might be a little jank
const default_state_obj = (): State<string>=>{
  return {
    network: "",
    persistent_tabs: "",
    default_tab: "",
    current_wallet: "",
    active_tab: "",
    contacts: "",
  }
}
function assert_object_fields<T extends Object> (default_object: T ) {
  return (test_object: T): Maybe<T> => {
    // console.log("test_object", test_object)
    const property_test = (acc: Boolean, obj: [string, Object]) => acc && test_object.hasOwnProperty(obj[0])
    if(Object.entries(default_object).reduce(property_test, true)) return Just(test_object)
    return Nothing
  }
}

// for every entry in an object, map a function onto it's value and return the reconstructed object
function object_map<T, F> (obj_entries: [string, T][], func: (name: string, obj: T) => F){
  console.log(obj_entries)
  return Object.assign({}, ...obj_entries.map((entry: [string, T])=>({[entry[0]]:func(entry[0], entry[1])})))
}

const get_saved_setting = (localName: string): Maybe<PersistentValue> => {
  let saved_value: string | null = localStorage.getItem(localName)
  let maybe_value: Maybe<PersistentValue> = saved_value ? Just(Object.assign({},JSONbig.parse(saved_value))) : Nothing
  // console.log(maybe_value.extract(), "maybed")
  return maybe_value.chain(assert_object_fields({name: "", value:""}))
  
  
}

const get_all_saved_settings = (storage_name: string, default_settings: PersistentStorage): PersistentStorage=> {
  return default_settings.map((obj: PersistentValue)=> {
    return get_saved_setting(storage_name+obj.name)
  })
  .filter((m: Maybe<PersistentValue>)=>m.isJust())
  .map((m:Maybe<PersistentValue>)=>m.extract()) as unknown as PersistentStorage

}



const config_to_persistent = (name: string, setting_config: SettingConfig): PersistentValue =>  {
  return {name, value: setting_config.default}
}

const persistent_to_object = (pv: PersistentValue): Obj<string> => {
  return {[pv.name]: pv.value}
}
const persistent_to_writable = (storage_name: string, pv: PersistentValue): Writable<any> => {
  let w = writable(pv.value)
  w.subscribe( (value: any)=>{
    pv.value = value
    localStorage.setItem(storage_name+pv.name, JSONbig.stringify(pv))
  })
  return w
}

// const storage_to_state_writable = (storage_name: string, storage: PersistentStorage): State<Writable<any>> => {

//   return object_map(storage.map(persistent_to_object).map(Object.entries), (name: string, obj: PersistentValue)=>persistent_to_writable(storage_name, obj))
// }

// const derive_state_object = (state: State<Writable<any>>) => {
//   return derived({}, (set)=>{

//   })
// }
const restore_all_settings = (storage_name: string, setting_types: State<SettingConfig>): State<Writable<any>>=>{

    //  the type isn't important here, what's important is gettings around typescript to solve the issue of json being too flexible 
    const assert_state = assert_object_fields(default_state_obj())(setting_types as unknown as State<string>)
    if(!assert_state) console.warn("store.ts::restore_all_settings\nsettings_types doesn't satisfy type State<T>, be sure all fields in state are satisfied")
    // this is what the storage state will look like on first start
    const default_storage: PersistentStorage = Object.entries(setting_types).map((entry: [string, SettingConfig])=>config_to_persistent(entry[0], entry[1]));

    // the previous saved settings state
    const saved_storage: PersistentValue[] = get_all_saved_settings(storage_name, default_storage);


    const default_state: State<PersistentValue> =  Object.assign({}, ...default_storage.map((pv:PersistentValue)=>({[pv.name]:pv})))
    const saved_state: State<PersistentValue> =  Object.assign({}, ...saved_storage.map((pv:PersistentValue)=>({[pv.name]:pv})))
    const reconstructed_state: State<PersistentValue> = Object.assign(default_state, saved_state)

    const state: State<Writable<any>> =  Object.assign({}, ...Object.entries(reconstructed_state).map((entry: [string, PersistentValue])=>({[entry[0]]: persistent_to_writable(storage_name,entry[1])})))

    return state

}
// settings 
export const AppState = (setting_types: State<SettingConfig>): StateObject => {
  return { settings: restore_all_settings("ginkou_storage_", setting_types) };
}

export const Melwalletd = (settings: State<Readable<string>>) => {
  // Current wallet dump. Automatically talks to the daemon.
  const current_wallet_dump: Readable<WalletDump> = derived(
    settings.current_wallet,
    ($name, set: (a0: any) => void) => {
      if ($name == null) {
        set(null);
      } else {
        // we set up a timeout that fetches and then dumps stuff properly
        const refresh = async () => {
          // fetch the stuff and set
          const dump = await wallet_dump($name as string);
          dump
            .ifLeft((e) => console.error(`error encountered in wallet_dump: ${e}`))
            .map((dump) => {
              // console.log("obtained wallet_dump");
              // console.log(dump);
              set(dump);
            });
        };
        refresh()
        const interval = setInterval(refresh, 5000);
        return () => clearInterval(interval);
      }
    },
    null
  );
  // List of all wallets, both mainnet and testnet
  const wallet_summaries: Readable<Obj<WalletSummary>> = readable({}, (set) => {
    const refresh = async () => {
      // fetch the stuff and set
      const list = await list_wallets();
      list
        .ifLeft((e) => console.log(`error encountered in list_wallets: ${JSON.stringify(e)}`))
        .map((list) => {
          // console.info("obtained list_wallets");
          set(list);
        });
    };
    refresh()
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);

  });
  const sorted_confirmed_txx: Readable<
  [string, [Transaction, number]][] | null
> = derived(current_wallet_dump, ($dump) => {
  if ($dump) {
    let txx = Object.entries(($dump as WalletDump).full.tx_confirmed);
    txx.sort((a, b) => a[1][1] - b[1][1]);
    txx.reverse();
    // console.log(txx);
    return txx;
  } else {
    return null;
  }

});
  return { wallet_summaries, current_wallet_dump, sorted_confirmed_txx };
}


export default { AppState, Melwalletd }
// settings.subscribe((v)=>{})
