import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {visionTool} from "@sanity/vision";
import {schemaTypes} from "./sanity/schemaTypes";

const projectId = process.env.SANITY_PROJECT_ID || "bn5j0gt9";
const dataset = process.env.SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Template Portfolio",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
