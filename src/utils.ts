import Either from 'tsmonad';

//async function fetch_or_err(url: string, opts): Promise<Result<Response>> {
async function fetch_or_err(url: string, opts): Promise<Either<Response, string>> {
    let res = await fetch(url, opts);

    if ( !res.ok )
        return Either.right(response.statusText);
    else
        return res as Response;
}
