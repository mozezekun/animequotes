/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Quote interface for anime quotes - matches ArangoDB structure
 */
export interface Quote {
  _id?: string;
  quote: string;        // The actual quote text
  character: string;    // Character who said it
  anime: string;        // Anime title
  tag?: string;         // Optional tag/category
  likes: number;        // Number of likes
  createdAt?: string;   // When it was added
}

/**
 * Response type for quotes API
 */
export interface QuotesResponse {
  quotes: Quote[];
  total: number;
}

/**
 * Request type for adding new quotes
 */
export interface AddQuoteRequest {
  quote: string;
  character: string;
  anime: string;
  tag?: string;
}

/**
 * Response type for adding quotes
 */
export interface AddQuoteResponse {
  success: boolean;
  quote?: Quote;
  message?: string;
}

/**
 * Request type for liking a quote
 */
export interface LikeQuoteRequest {
  quoteId: string;
}

/**
 * Response type for liking a quote
 */
export interface LikeQuoteResponse {
  success: boolean;
  likes: number;
  message?: string;
}
