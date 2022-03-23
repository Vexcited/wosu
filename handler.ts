/*import type { Handler } from "vite-plugin-mix";

export const handler: Handler = (req, res, next) => {
  const path = req.path;

  // Check if we are in an API route.
  if (!req.path.startsWith("/api")) return next();

  const api_path = path.replace("/api", "");
}
*/

import express from 'express';
const app = express();

app.get("/api", (req, res) => {
	res.json({});
});

export const handler = app
