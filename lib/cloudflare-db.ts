import { getCloudflareContext } from "@opennextjs/cloudflare";
export interface D1Database { prepare(sql:string): { bind(...values:unknown[]): { all<T=Record<string,unknown>>():Promise<{results:T[];success:boolean;meta?:{changes?:number}}>; first<T=Record<string,unknown>>():Promise<T|null>; run():Promise<{success:boolean;meta?:{changes?:number}}> } } }
export async function getDatabase():Promise<D1Database|null>{try{const {env}=await getCloudflareContext({async:true});return (env as unknown as {DB?:D1Database}).DB??null}catch{return null}}
export const makeId=()=>crypto.randomUUID();
export function jsonError(error:string,status=400){return Response.json({error},{status})}