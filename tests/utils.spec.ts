import { assert } from 'chai';
import * as utils from '../src/utils';
import type { Wallet, PrivateKey } from '../src/utils';
import { EitherAsync } from 'purify-ts/EitherAsync';

describe('list wallets', () => {
    it('should return empty list', async () => {
        await EitherAsync( async ({ fromPromise }) => {
            const wallets: Wallet[] = await fromPromise( utils.list_wallets() );
            assert.equal(wallets, []);
        })
        .run();
    });
});
describe('new wallet', () => {
    it('create a wallet', async () => {
        /*
        await EitherAsync( async ({ fromPromise }) => {
            const wallet_name = 'test';
            const use_testnet = true;

            const pk: PrivateKey = await fromPromise( utils.new_wallet(wallet_name, use_testnet) );
        })
        .run();
        */
        const wallet_name = 'test';
        const use_testnet = true;
        const res = await utils.new_wallet(wallet_name, use_testnet)
            //.map( pk => assert(typeof(pk) === 'string') )
            //.map( pk => assert(false) )
            //.mapLeft( e => assert(false))
            .run();

        res.ifLeft( e => { console.log(e); assert(false) });
        //assert.equal(res.ifLeft(
    });
});
