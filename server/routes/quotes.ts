import { RequestHandler } from "express";
import { Database } from "arangojs";
import { Quote, QuotesResponse, AddQuoteRequest, AddQuoteResponse, LikeQuoteRequest, LikeQuoteResponse } from "@shared/api";

// Initialize ArangoDB connection
const db = new Database({
  url: "https://dblala.taqi.my.id",
  databaseName: "aniquotes",
  auth: { username: "root", password: "kmzway87AAwkwkw" }
});

const collection = db.collection("quotes");

// Get all quotes with optional search
export const handleGetQuotes: RequestHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = req.query.search as string || '';

    // Ensure collection exists
    try {
      if (!(await collection.exists())) {
        await collection.create();
      }
    } catch (error) {
      console.log("Collection may already exist or permission issue:", error);
    }

    let query = '';
    let countQuery = '';
    const bindVars: any = { offset, limit };

    if (search && search.trim()) {
      // Search in quote text, character, anime, and tag
      const searchTerm = search.trim().toLowerCase();
      bindVars.search = searchTerm;

      query = `
        FOR doc IN quotes
        FILTER LOWER(doc.quote) LIKE CONCAT('%', @search, '%')
               OR LOWER(doc.character) LIKE CONCAT('%', @search, '%')
               OR LOWER(doc.anime) LIKE CONCAT('%', @search, '%')
               OR LOWER(doc.tag) LIKE CONCAT('%', @search, '%')
        SORT doc.likes DESC, doc.createdAt DESC
        LIMIT @offset, @limit
        RETURN doc
      `;

      countQuery = `
        FOR doc IN quotes
        FILTER LOWER(doc.quote) LIKE CONCAT('%', @search, '%')
               OR LOWER(doc.character) LIKE CONCAT('%', @search, '%')
               OR LOWER(doc.anime) LIKE CONCAT('%', @search, '%')
               OR LOWER(doc.tag) LIKE CONCAT('%', @search, '%')
        COLLECT WITH COUNT INTO length
        RETURN length
      `;
    } else {
      // No search, get all quotes
      query = `
        FOR doc IN quotes
        SORT doc.likes DESC, doc.createdAt DESC
        LIMIT @offset, @limit
        RETURN doc
      `;

      countQuery = `
        FOR doc IN quotes
        COLLECT WITH COUNT INTO length
        RETURN length
      `;
    }

    // Get quotes with pagination
    const cursor = await db.query(query, bindVars);
    const quotes: Quote[] = await cursor.all();

    // Get total count
    const countCursor = await db.query(countQuery, search ? { search: bindVars.search } : {});
    const total = (await countCursor.all())[0] || 0;

    const response: QuotesResponse = {
      quotes,
      total
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
};

// Add new quote
export const handleAddQuote: RequestHandler = async (req, res) => {
  try {
    const { quote, character, anime, tag }: AddQuoteRequest = req.body;

    if (!quote || !character || !anime) {
      return res.status(400).json({ 
        success: false, 
        message: "Quote, character, and anime are required" 
      });
    }

    // Ensure collection exists
    try {
      if (!(await collection.exists())) {
        await collection.create();
      }
    } catch (error) {
      console.log("Collection may already exist or permission issue:", error);
    }

    const newQuote: Quote = {
      quote: quote.trim(),
      character: character.trim(),
      anime: anime.trim(),
      tag: tag?.trim() || "",
      likes: 0,
      createdAt: new Date().toISOString()
    };

    const result = await collection.save(newQuote);
    const savedQuote: Quote = { ...newQuote, _id: result._id };

    const response: AddQuoteResponse = {
      success: true,
      quote: savedQuote
    };

    res.json(response);
  } catch (error) {
    console.error("Error adding quote:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add quote" 
    });
  }
};

// Get random quote
export const handleGetRandomQuote: RequestHandler = async (req, res) => {
  try {
    // Ensure collection exists
    try {
      if (!(await collection.exists())) {
        await collection.create();
        // Add some sample quotes if collection is empty
        const sampleQuotes = [
          {
            quote: "Believe in yourself. Not in the you who believes in me. Not the me who believes in you. Believe in the you who believes in yourself.",
            character: "Kamina",
            anime: "Gurren Lagann",
            tag: "motivation",
            likes: 0,
            createdAt: new Date().toISOString()
          },
          {
            quote: "I am not alone. Not anymore.",
            character: "Naruto Uzumaki",
            anime: "Naruto",
            tag: "friendship",
            likes: 0,
            createdAt: new Date().toISOString()
          },
          {
            quote: "The world isn't perfect. But it's there for us, doing the best it can. That's what makes it so damn beautiful.",
            character: "Roy Mustang",
            anime: "Fullmetal Alchemist",
            tag: "philosophy",
            likes: 0,
            createdAt: new Date().toISOString()
          }
        ];
        
        for (const quote of sampleQuotes) {
          await collection.save(quote);
        }
      }
    } catch (error) {
      console.log("Collection setup error:", error);
    }

    // Get random quote
    const cursor = await db.query(`
      FOR doc IN quotes
      SORT RAND()
      LIMIT 1
      RETURN doc
    `);
    
    const quotes: Quote[] = await cursor.all();
    const randomQuote = quotes[0];

    if (!randomQuote) {
      return res.status(404).json({ error: "No quotes found" });
    }

    res.json(randomQuote);
  } catch (error) {
    console.error("Error fetching random quote:", error);
    res.status(500).json({ error: "Failed to fetch random quote" });
  }
};

// Like a quote
export const handleLikeQuote: RequestHandler = async (req, res) => {
  try {
    const { quoteId }: LikeQuoteRequest = req.body;

    if (!quoteId) {
      return res.status(400).json({ 
        success: false, 
        message: "Quote ID is required" 
      });
    }

    // Update the quote by incrementing likes
    const updateResult = await db.query(`
      FOR doc IN quotes
      FILTER doc._id == @quoteId
      UPDATE doc WITH { likes: doc.likes + 1 } IN quotes
      RETURN NEW
    `, { quoteId });

    const updatedQuotes = await updateResult.all();
    const updatedQuote = updatedQuotes[0];

    if (!updatedQuote) {
      return res.status(404).json({ 
        success: false, 
        message: "Quote not found" 
      });
    }

    const response: LikeQuoteResponse = {
      success: true,
      likes: updatedQuote.likes
    };

    res.json(response);
  } catch (error) {
    console.error("Error liking quote:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to like quote" 
    });
  }
};
