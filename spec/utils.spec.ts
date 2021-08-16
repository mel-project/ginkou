import { assert } from 'chai';
import * as utils from '../src/utils';
import type { PrivateKey } from '../src/utils';
import { EitherAsync } from 'purify-ts/EitherAsync';

describe.skip('list wallets', () => {
    it('should return empty list', async () => {
        const res = await utils.list_wallets();
        
        res
            .ifRight( (wallets) => {
                assert.isAbove(Object.keys(wallets).length, 0);
            })
            .ifLeft( e => {
                console.log(e);
                assert(false);
            });
    });
});

describe.skip('new wallet', () => {
    it('create a wallet', async () => {
        const wallet_name = 'test';
        const use_testnet = true;
        const res = await utils.new_wallet(wallet_name, use_testnet,"").run();

        res.ifLeft( e => {
            assert.equal(e, "(500) ERROR: cannot create wallet")
        });
    });
});
