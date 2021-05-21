//import Either from 'tsmonad';
import { Either } from 'purify-ts/Either';

//async function fetch_or_err(url: string, opts): Promise<Result<Response>> {
//export async function fetch_or_err(url: string, opts): Promise<Either<string, Response>> {
export async function fetch_or_err(url: string, opts): Promise<Either<string, Response>> {
    let res = await fetch(url, opts);

    if ( !res.ok )
        return Either.left<string, Response>(response.statusText);
    else
        return Either.right<string, Response>(res);
}
