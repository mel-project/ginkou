import { assert } from 'chai';
import * as utils from '../src/utils';
import type { Wallet } from '../src/utils';
import { EitherAsync } from 'purify-ts/EitherAsync';

describe('list wallets', () => {
    it('should return empty list', () => {
        EitherAsync( async ({ fromPromise }) => {
            const wallets: Wallet[] = await fromPromise( utils.list_wallets() );
            assert.equal(wallets, []);
        }).run();
    });
});
