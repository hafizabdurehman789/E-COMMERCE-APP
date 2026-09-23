import express from "express";
import "dotenv/config";
import cors from 'cors'

import { clerkMiddleware } from "@clerk/express";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { getEnv } from "./lib/env";

const app = express();
const PORT = process.env.PORT || 3001;
const env = getEnv()

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

const rawJson = express.raw({ type: "application/json", limit: "1mb" });

// it's important that you don't parse the webhook event data, it should be in the raw format
app.post("/webhooks/clerk", rawJson, (req, res) => {
  void clerkWebhookHandler(req, res);
});

app.listen(env.PORT, () => {
  console.log(`server is running on ${PORT}`);
});


