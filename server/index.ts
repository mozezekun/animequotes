import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGetQuotes, handleAddQuote, handleGetRandomQuote, handleLikeQuote } from "./routes/quotes";
import { handleSitemap } from "./routes/sitemap";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // SEO routes
  app.get("/sitemap.xml", handleSitemap);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Quotes API routes
  app.get("/api/quotes", handleGetQuotes);
  app.post("/api/quotes", handleAddQuote);
  app.get("/api/quotes/random", handleGetRandomQuote);
  app.post("/api/quotes/like", handleLikeQuote);

  return app;
}
