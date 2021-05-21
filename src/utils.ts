//import Either from 'tsmonad';
import { EitherAsync } from 'purify-ts/EitherAsync';
import { Either, Left, Right } from 'purify-ts/Either';
//import { MaybeAsync } from 'purify-ts/MaybeAsync';
//import { Maybe, Nothing, Just } from 'purify-ts/Maybe';

export type BlockHeight = number;
export type TxHash = string;

export async function fetch_or_err(url: string, opts): Promise<Either<string, Response>> {
    // Throws on a promise rejection, which will be caught by EitherAsync's run()
    let res = await fetch(url, opts);

    if ( !res.ok )
        return Left(res.statusText);
    else
        return Right(res);
}

export const check_tx = async (url: string, txhash: TxHash)
: Promise<Either<string, BlockHeight>> =>
    EitherAsync( async ({ liftEither, fromPromise }) => {
        let res: Response = await fromPromise(fetch_or_err(url, { method : 'GET' }));
        let json = await res.json();
        const height: BlockHeight | null = json.confirmed_height;

        if (height != null)
            return liftEither(Right(height as BlockHeight));
        else
            return liftEither(Left('not yet confirmed'));
    });
