import type {NextConfig} from "next";
import {initOpenNextCloudflareForDev} from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
const config:NextConfig={poweredByHeader:false,images:{unoptimized:true}};
export default config;