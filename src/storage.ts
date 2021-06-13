import JSONbig from "json-bigint";

// The object stored in local storage.
// priv_key is encrypted and can be decrypted using iv, salt, and a
// user-provided password.
export interface WalletCryptoData {
  salt: Uint8Array;
  iv: Uint8Array;
  priv_key: Uint8Array;
}

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
  let data = JSONbig.parse(localStorage.getItem(wallet_name));
  // if (data == null)
  data.salt = new Uint8Array(data.salt);
  data.iv = new Uint8Array(data.iv);
  data.priv_key = new Uint8Array(data.priv_key);

  return data;
}
