// Using SubtleCrypto API W3C standard

// Encrypt plaintext via AES, takes an encryption key and initial vector which
// must match during decryption.
export async function encrypt(
    plaintext: string,
    enc_key: CryptoKey,
    iv: Uint8Array):
Promise<ArrayBuffer> {
    const enc = new TextEncoder();

    return window.crypto.subtle.encrypt({
            name: 'AES-GCM',
            iv: iv,
        },
        enc_key,
        enc.encode(plaintext),
    );
}

// Derive encryption key from a password and salt
export async function derive_key(password: string, salt: Uint8Array) {
    const enc = new TextEncoder();

    const key_material = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt: salt,
            "iterations": 100000,
            "hash": "SHA-256",
        },
        key_material,
        { "name": "AES-GCM", "length": 256 },
        true,
        [ "encrypt", "decrypt" ],
    );
}

export async function decrypt(
    ciphertext: Uint8Array,
    key: CryptoKey,
    iv: Uint8Array):
Promise<ArrayBuffer> {
    return window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        ciphertext
    );
}

export function buf_to_hex(buf: ArrayBuffer): string {
    return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
}
