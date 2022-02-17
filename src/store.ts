import { derived, readable, Readable, Subscriber, Writable, writable } from "svelte/store";
import { list_wallets, WalletSummary, WalletDump, wallet_dump } from "./utils";
import JSONbig from "json-bigint";


export type Obj<T> = { [key: string]: T }
export type PersistentStorage = PersistentValue[]

export interface Named {
  label: string
}
export interface PersistentValue extends Named{
  value: any;
}

/**
 * This interface describes a single setting field within the larger settings context.
 * the settings context is used to manage global state and track user preferences
 * the settings which track user preferences should be set as `visible: true`
 */

export interface SettingConfig extends Named{
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
export interface State<T extends SettingConfig | Readable<string> | string> {
  network: T;
  persistent_tabs: T;
  default_tab: T;
  current_wallet: T;
  active_tab: T;
}

interface StateObject {
  settings: State<Writable<string>>;
  // writable_settings: Writable<State<string>>;
  set_setting: (name: string | Readable<string>, value: string | Readable<string>) => void;
}

const get_persistent_settings = (localName: string): PersistentStorage =>  {
  const persistent_settings = localStorage.getItem(localName)
  if (persistent_settings)
    return JSONbig.parse(persistent_settings)
  else
    return []
}

const validate_object_fields = (default_object: Object) => (test_object: Object): Boolean => {
  const property_test = (acc: Boolean, obj: [string, Object]) => acc && test_object.hasOwnProperty(obj[0])
  return Object.entries(default_object).reduce(property_test, true)
}
console.log("validate", validate_object_fields)
const config_to_persistent = (setting_config: SettingConfig): PersistentValue =>  {
  return {label: setting_config.label, value: setting_config.default}
}

const restore_all_settings = (storage_name: string, setting_types: State<SettingConfig>): State<Writable<string>>=>{

  const settings: State<Writable<string>> = writable({}, (set) => {

    // this is what the storage state will look like on first start
    const default_storage: PersistentStorage = Object.values(setting_types).map(config_to_persistent);

    // the previous saved settings state
    const saved_settings: PersistentStorage = get_persistent_settings(storage_name);
    

    const default_state: State<string> = Object.assign({}, ...saved_settings)



    // the svelte contexts way to say, basically, writable_settings = settings
    set(settings)
  }) as unknown as Writable<State<string>>; // guarenteed unless setting_types is improperly cast 
  return settings

}
// settings 
export const State = (setting_types: State<Setting>): StateObject => {
  // create writable settings as a certain combination of persistent settings + setting defaults
  
  // create read only interface for _settings
  return { settings: settings, set_setting };
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
        .ifLeft((e) => console.log(`error encountered in list_wallets: ${JSON.stringify(e)}`))
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


export default { State, Melwalletd }
// settings.subscribe((v)=>{})
