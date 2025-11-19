import { RequestHandler } from "express";
import { Database } from "arangojs";

// Initialize ArangoDB connection
const db = new Database({
  url: "https://dblala.taqi.my.id",
  databaseName: "aniquotes",
  auth: { username: "root", password: "kmzway87AAwkwkw" }
});

export const handleSitemap: RequestHandler = async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/xml');
    
    // Get all quotes for sitemap
    const cursor = await db.query(`
      FOR doc IN quotes
      SORT doc.createdAt DESC
      RETURN {
        _id: doc._id,
        anime: doc.anime,
        character: doc.character,
        createdAt: doc.createdAt
      }
    `);
    
    const quotes = await cursor.all();
    
    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>https://animequotes.sbs</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Search page -->
  <url>
    <loc>https://animequotes.sbs/search</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Popular anime series pages -->
  <url>
    <loc>https://animequotes.sbs/anime/naruto</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://animequotes.sbs/anime/one-piece</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://animequotes.sbs/anime/attack-on-titan</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://animequotes.sbs/anime/demon-slayer</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://animequotes.sbs/anime/my-hero-academia</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Quote category pages -->
  <url>
    <loc>https://animequotes.sbs/category/motivational</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://animequotes.sbs/category/inspirational</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://animequotes.sbs/category/friendship</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://animequotes.sbs/category/philosophy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

${quotes.slice(0, 1000).map(quote => `  <!-- Quote: ${quote._id} -->
  <url>
    <loc>https://animequotes.sbs/quote/${quote._id}</loc>
    <lastmod>${quote.createdAt ? new Date(quote.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}

</urlset>`;

    res.send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send('Error generating sitemap');
  }
};
