import { derived, readable, Readable, Writable, writable } from "svelte/store";
import { list_wallets, WalletSummary, WalletDump, wallet_dump } from "./utils";
import JSONbig from "json-bigint";



// settings 
export const _settings: Writable<{[key: string]: string} | null> = writable({}, (set) =>{
  const persistant_settings = localStorage.getItem('_settings');

  if(persistant_settings){
    set(JSONbig.parse(persistant_settings));
  }
  else{
    const default_settings = {network: "main"};
    set(default_settings);
  }
  
});

_settings.subscribe((value)=>{
  localStorage.setItem("_settings", JSONbig.stringify(value))
  console.log(value)
})


// create read only interface for _settings
export const settings = (() => {

  let read_only_settings: {[key: string]: Readable<string>} = {};
  // create inital map from Object<string> to Object<Readable<String>>
  // call immediately after to unsubscribe
  const do_once_and_unsubscribe = _settings.subscribe(($settings)=>{
    // map _setting entries to readables
    Object.entries($settings).map((s: any) => {
      const setting_name = s[0]
      const setting_value = s[1]
      read_only_settings[setting_name] = readable(setting_value, watchSetting(_settings, setting_name))
    })
  });
  do_once_and_unsubscribe()
  
  // subscribe to changes in _settings and alter this readable from within
  function watchSetting(store: Writable<{[key: string]: string} | null>,field_name: string){
    return (set: any)=>{
      store.subscribe(($store_value: {[key: string]: string} | null)=>{
        // if value: readables[name] = $value[name]
        // what is readables?
        // readables is a mapping from _settings: {string: string} => {string: Readable<string>} 
        if($store_value){
          console.log(field_name, $store_value[field_name])
          set($store_value[field_name])
        }
      })
    }
  }
  return read_only_settings;


})();


// Current wallet dump. Automatically talks to the daemon.
export const current_wallet_dump: Readable<WalletDump | null> = derived(
  settings.current_wallet,
  ($name, set: (a0: any) => void) => {
    console.log("ENTERING");
    if ($name == null) {
      set(null);
    } else {
      // we set up a timeout that fetches and then dumps stuff properly
      const refresh = async () => {
        // fetch the stuff and set
        const dump = await wallet_dump($name);
        dump
          .ifLeft((e) => console.log(`error encountered in wallet_dump: ${e}`))
          .map((dump) => {
            // console.log("obtained wallet_dump");
            // console.log(dump);
            set(dump);
          });
      };
      const interval = setInterval(refresh, 5000);
      refresh();
      return () => clearInterval(interval);
    }
  },
  null
);

// List of all wallets, both mainnet and testnet
export const wallet_summaries: Readable<{
  [key: string]: WalletSummary;
}> = readable({}, (set) => {
  const refresh = async () => {
    // fetch the stuff and set
    const list = await list_wallets();
    list
      .ifLeft((e) => console.log(`error encountered in list_wallets: ${e}`))
      .map((list) => {
        // console.log("obtained list_wallets");
        set(list);
      });
  };
  const interval = setInterval(refresh, 1000);
  refresh();
  return () => clearInterval(interval);
});


// settings.subscribe((v)=>{})
_settings.subscribe((v)=>{})