import { derived, readable, Readable, Writable, writable } from "svelte/store";
import { list_wallets, WalletSummary, WalletDump, wallet_dump } from "./utils";
import JSONbig from "json-bigint";



// settings 
export const _settings: Writable<{[key: string]: string} | null> = writable(null, (set) =>{
  set(JSONbig.parse(localStorage.getItem('_settings')) || {});
});

_settings.subscribe((value)=>{
  localStorage.setItem("_settings", JSONbig.stringify(value))
  console.log(value)
})


// create read only interface for _settings
export const settings = (() => {

  // subscribe to changes in _settings and alter this readable from within
  function watchSetting(store: Writable<{[key: string]: string} | null>,name: string){
    return (set: any)=>{
      store.subscribe(($value: {[key: string]: string} | null)=>{
        // if value: readables[name] = $value[name]
        // what is readables?
        // readables is a mapping from _settings: {string: string} => > {string: Readable<string>} 
        console.log(name, $value[name])
        $value && set($value[name])
      })
    }
  }
  let r_settings: {[key: string]: Readable<string>} = {};
  // create inital map from Object<string> to Object<Readable<String>>
  // call immediately after to unsubscribe
  (_settings.subscribe(($settings)=>{
    // map _setting entries to readables
    Object.entries($settings).map((s: any) => 
      r_settings[s[0]] = readable(s[1], watchSetting(_settings, s[0])))

  }))();

  return r_settings;


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