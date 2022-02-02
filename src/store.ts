import { derived, readable, Readable, Subscriber, Writable, writable } from "svelte/store";
import { list_wallets, WalletSummary, WalletDump, wallet_dump } from "./utils";
import JSONbig from "json-bigint";


export type Obj<T> = { [key: string]: T }
export interface PersistentSetting {
  default?: any;
}

/**
 * This interface describes a single setting field within the larger settings context.
 * the settings context is used to manage global state and track user preferences
 * the settings which track user preferences should be set as `visible: true`
 */
export interface Setting extends PersistentSetting {
  label?: string; // the name of this field
  type?: string; // the type of the setting input (can be anything supported by )
  options?: Obj<string | number>; // for types with multiple selection options
  depends?: Obj<string | number | boolean>;
  visible?: boolean; // should this be displayed (interpreted by the acting component)
  override?: boolean; // should the default value be used instead of persisting (debug tool)
}

/**
 * These are the settings which describe global state and user preferences 
 */
export interface Settings<T extends Setting | Readable<string> | string> {
  [field_name: string]: T;
  network: T;
  persistent_tabs: T;
  default_tab: T;
  current_wallet: T;
  active_tab: T;
}

interface SettingsObject {
  settings: Settings<Writable<string>>;
  // writable_settings: Writable<Settings<string>>;
  set_setting: (name: string | Readable<string>, value: string | Readable<string>) => void;
}
const initSettings = (writable_settings: Readable<Settings<string>>): Settings<Writable<string>> => {

  // subscribe to changes in writable_settings and alter this readable from within
  function watchSetting(field_name: string) {
    return (set: any) => {
      writable_settings.subscribe(($setting) => {
        // if store_value: readables[name] = $store_value[name]
        // what is readables?
        // readables is a mapping from writable_settings: {string: string} => {string: Readable<string>} 
        if ($setting) {
          set($setting[field_name])
        }
      })
    }
  }

  let read_only_settings: Obj<Writable<string>> = {};
  // create inital map from Object<string> to Object<Readable<String>>
  // call immediately after to unsubscribe
  const do_once_and_unsubscribe = writable_settings.subscribe(($settings) => {
    // map _setting entries to readables
    Object.keys($settings).forEach((setting_name: any) => {
      const setting_value = $settings[setting_name]
      read_only_settings[setting_name] = writable(setting_value, watchSetting(setting_name))
    })
  });
  do_once_and_unsubscribe()

  return (read_only_settings as unknown) as Settings<Writable<string>>;

};

const get_persistent_settings = (localName: string): Obj<any> =>  {
  const persistent_settings = localStorage.getItem(localName)
  if (persistent_settings)
    return JSONbig.parse(persistent_settings)
  else
    return {}
}
// settings 
export const Settings = (setting_types: Settings<Setting>): SettingsObject => {
  // create writable settings as a certain combination of persistent settings + setting defaults
  const writable_settings: Writable<Settings<string>> = writable({}, (set) => {
    // start settings as the previous saved state
    const settings: Obj<any> = get_persistent_settings("writable_settings");
    // for each setting, check if setting.override is set or if it didn't exists in persistent storage
    // in either case, use it's default value
    Object.entries(setting_types).forEach((entry: [string, Setting]) => {
      const setting_name: string = entry[0];
      const setting: Setting = entry[1];
      // if setting.override or the setting doesn't exist in persistent storage
      if(setting.override || !settings[setting_name])
        // use default value
        settings[setting_name] = setting.default
    });

    // the svelte contexts way to say, basically, writable_settings = settings
    set(settings)
  }) as unknown as Writable<Settings<string>>; // guarenteed unless setting_types is improperly cast 

  // whenever writable settings is changed
  writable_settings.subscribe((value) => {
    // resave the entire thing to local storage
    localStorage.setItem("writable_settings", JSONbig.stringify(value))
  })

  let set_setting: SettingsObject["set_setting"] = (name, value) => { };

  // (writable_settings.subscribe((settings) => {
  //   set_setting = (name, value) => {
  //     (settings as Settings<string>)[name] = value
  //   }
  // }))();

  // create read only interface for _settings
  return { settings: initSettings(writable_settings), set_setting };
}

export const Melwalletd = (settings: Settings<Readable<string>>) => {
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
        const interval = setInterval(refresh, 5000);
        refresh();
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
        .ifLeft((e) => console.error(`error encountered in list_wallets: ${e}`))
        .map((list) => {
          // console.info("obtained list_wallets");
          set(list);
        });
    };
    const interval = setInterval(refresh, 1000);
    refresh();
    return () => clearInterval(interval);

  });
  return { wallet_summaries, current_wallet_dump };
}


export default { Settings, Melwalletd }
// settings.subscribe((v)=>{})
