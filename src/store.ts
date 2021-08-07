import { derived, readable, Readable, Writable, writable } from "svelte/store";
import { list_wallets, WalletSummary, WalletDump, wallet_dump } from "./utils";
import JSONbig from "json-bigint";




// settings 
export const Settings = (setting_types: [Object]) => {
  const writable_settings: Writable<{[key: string]: string} | null> = writable({}, (set) =>{
    const persistant_settings = localStorage.getItem('writable_settings');
    const defaults = {};
    setting_types.forEach((entry)=>{
      const setting_name = entry.name;
      const setting_default = entry.default || "";
      defaults[setting_name] = setting_default;
    });
    console.log(JSONbig.parse(persistant_settings))
    set(Object.assign(defaults, JSONbig.parse(persistant_settings)))

    
  });
  
  writable_settings.subscribe((value)=>{
    localStorage.setItem("writable_settings", JSONbig.stringify(value))
  })
  
  
  // create read only interface for _settings
  const settings = (() => {
  
    let read_only_settings: {[key: string]: Readable<string>} = {};
    // create inital map from Object<string> to Object<Readable<String>>
    // call immediately after to unsubscribe
    const do_once_and_unsubscribe = writable_settings.subscribe(($settings)=>{
      // map _setting entries to readables
      Object.entries($settings).map((s: any) => {
        const setting_name = s[0]
        const setting_value = s[1]
        read_only_settings[setting_name] = readable(setting_value, watchSetting(setting_name))
      })
    });
    do_once_and_unsubscribe()
    
    // subscribe to changes in writable_settings and alter this readable from within
    function watchSetting(field_name: string){
      return (set: any)=>{
        writable_settings.subscribe(($setting: {[key: string]: string} | null)=>{
          // if store_value: readables[name] = $store_value[name]
          // what is readables?
          // readables is a mapping from writable_settings: {string: string} => {string: Readable<string>} 
          if($setting){
            set($setting[field_name])
          }
        })
      }
    }
    return read_only_settings;
  
  
  })();
  
  // Current wallet dump. Automatically talks to the daemon.
  const current_wallet_dump: Readable<WalletDump> = derived(
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
  
 
  return {writable_settings, settings, current_wallet_dump};
  
}
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
