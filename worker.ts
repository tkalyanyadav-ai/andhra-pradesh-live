// OpenNext generates the fetch handler during the build. This wrapper adds Cloudflare Cron support.
import openNextWorker from "./.open-next/worker.js";
import { collectOfficialSources } from "./lib/collector";

type Env = { DB: { prepare(sql:string): { bind(...values:unknown[]): { all<T=Record<string,unknown>>():Promise<{results:T[]}>; run():Promise<unknown> } } }; GEMINI_API_KEY?: string };

export default {
  fetch: openNextWorker.fetch,
  async scheduled(_controller: ScheduledController, env: Env, _ctx: ExecutionContext) {
    const report = await collectOfficialSources(env);
    console.log("[ap-live-collector]", JSON.stringify(report));
  },
};