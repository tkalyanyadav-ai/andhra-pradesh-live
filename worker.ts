// @ts-ignore OpenNext creates this module during the Cloudflare build.
import openNextWorker from "./.open-next/worker.js";
import { collectOfficialSources } from "./lib/collector";

type Env = { DB: any; GEMINI_API_KEY?: string };

export default {
  fetch: openNextWorker.fetch,
  async scheduled(_controller: unknown, env: Env, _ctx: unknown) {
    const report = await collectOfficialSources(env);
    console.log("[ap-live-collector]", JSON.stringify(report));
  },
};