import {defineCliConfig} from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || "bn5j0gt9",
    dataset: process.env.SANITY_DATASET || "production",
  },
});
