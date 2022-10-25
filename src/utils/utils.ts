import { Either, Left, Right } from "purify-ts/Either";
import { Maybe, Just, Nothing } from "purify-ts/Maybe";
import type {
  Obj,
} from "./types";
import Toastify from "toastify-js";
import { EventDispatcher, PromiseCallback } from "./svelte-types";
import { TxKind } from "melwallet.js";
// export * from "./wallet-utils";

console.log("in utils", Either);
export const MEL = "6d";
const default_port = 11773;

export const kind2str = (bkind: TxKind) => {
  const kind = Number(bkind);
  if (kind === 0x00) {
    return "Normal";
  } else if (kind === 0x10) {
    return "Stake";
  } else if (kind === 0x50) {
    return "DoscMint";
  } else if (kind === 0x51) {
    return "Swap";
  } else if (kind === 0x52) {
    return "LiqDeposit";
  } else if (kind === 0x53) {
    return "LiqWithdrawal";
  } else if (kind === 0xff) {
    return "Faucet";
  } else {
    throw "this should never happen";
  }
};

export function map_entries<T,K>(map: Map<T,K>): [T,K][]{
  let entries: [T, K][] = Object.entries(map) as any;
  return entries
}
function intoListOf<T>(a: any, intoT: (a0: any) => Maybe<T>): Maybe<T[]> {
  if (Array.isArray(a))
    for (const x of a) {
      if (intoT(x).isNothing()) return Nothing;
    }

  return Just(a as T[]);
}

// Give a string cast error if maybe is nothing
export function cast_to_either<T>(m: Maybe<T>): Either<string, T> {
  return m.caseOf({
    Just: (x) => Right(x),
    Nothing: () => Left("failed to cast json to expected type"),
  });
}

export function WaitableEvent<T>(
  type: string,
  dispatcher: EventDispatcher,
  callback: PromiseCallback<T>
): (detail?: any, timeout?: number) => Promise<T> {
  return (detail = {}, timeout) =>
    new Promise((resolve, reject) => {
      if (timeout) setTimeout(() => reject("Promise Failure"), timeout);
      dispatcher(
        type,
        Object.assign(detail, { _callback: callback(resolve, reject) })
      );
    });
}

// Simple toast
export const showToast = (m: string) => {
  Toastify({
    text: m,
    position: "center",
    style: {
      background: "black",
      boxShadow: "none",
    },
  }).showToast();
};

// Copy to clipboard
export const copyToClipboard = (text: string) => {
  var input = document.createElement("textarea");
  input.innerHTML = text;
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand("copy");
  document.body.removeChild(input);
  return result;
};

//this is the shared definition of _ipc_handler as created by the various ginkou-loaders
//we may want to move this implementation  directly into ginkou
// function _ipc_handler(_event, params) {
//   let _params = params || {};
//   window.ipc.postMessage(JSON.stringify(Object.assign({ _event }, _params)));
// }

export function ipc_handler(name: string, obj: Obj<any>) {
  if ("_ipc_handler" in window) {
    // console._info("evoking ipc: ", _event);
    return (window as any)._ipc_handler(name, obj);
  }
}
export function capture_log(mode: string) {
  let logger = (console as any)[mode] as any;
  // move console logging function to new underscore-prefixed name
  // ex: `console.log` becomes `console._log`
  (console as any)["_" + mode] = logger;
  function inner() {
    ipc_handler("log-event", {
      level: mode,
      message: Object.values(arguments).join("\n"),
    });
    logger(...arguments);
  }
  return inner;
}

export function register_console_loggers() {
  let levels = ["log", "debug", "info", "warn", "error"];
  levels.forEach((level) => ((console as any)[level] = capture_log(level)));
}

export function download_logs() {
  ipc_handler("download-logs", {});
}

export function set_conversion_factor(conversion_factor: number) {
  ipc_handler("set-conversion-factor", { conversion_factor });
}

export function open_browser(url: string) {
  ipc_handler("open-browser", { url });
}
