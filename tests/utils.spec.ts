import { assert } from 'chai';
import * as utils from '../src/utils';
import type { PrivateKey } from '../src/utils';
import { EitherAsync } from 'purify-ts/EitherAsync';

describe('list wallets', () => {
    it('should return empty list', async () => {
        const res = await utils.list_wallets();

        res
            .ifRight( (wallets) => {
                //console.log(wallets);
                //assert.equal(wallets, []);
                assert.equal(Object.keys(wallets).length, 1);
            })
            .ifLeft( e => {
                console.log(e);
                assert(false);
            });
    });
});

describe('new wallet', () => {
    it('create a wallet', async () => {
        const wallet_name = 'test';
        const use_testnet = true;
        const res = await utils.new_wallet(wallet_name, use_testnet, "",11773).run();

        res.ifLeft( e => {
            console.log(e);
            assert(false)
        });
    });
});
