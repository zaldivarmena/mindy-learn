import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials:{
    url:'postgresql://neondb_owner:npg_eIKFl46xPSZp@ep-plain-credit-a5ocqf0o-pooler.us-east-2.aws.neon.tech/mindy-study?sslmode=require'
  }
});
