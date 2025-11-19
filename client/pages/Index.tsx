import { useEffect, useState } from "react";
import { Quote, QuotesResponse } from "@shared/api";
import { QuotesTable } from "@/components/QuotesTable";
import { AddQuoteForm } from "@/components/AddQuoteForm";
import { Header } from "@/components/Header";
import { SearchQuotes } from "@/components/SearchQuotes";
import { SEOHead } from "@/components/SEOHead";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 25;

export default function Index() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const { toast } = useToast();

  // Fetch quotes on component mount, page change, or search change
  useEffect(() => {
    fetchQuotes(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // Fetch random quote on mount
  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const fetchQuotes = async (page: number = 1, search: string = "") => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`/api/quotes?limit=${ITEMS_PER_PAGE}&offset=${offset}${searchParam}`);
      const data: QuotesResponse = await response.json();
      setQuotes(data.quotes);
      setTotalQuotes(data.total);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Error",
        description: "Failed to load quotes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRandomQuote = async () => {
    try {
      setIsLoadingRandom(true);
      const response = await fetch("/api/quotes/random");
      if (response.ok) {
        const data: Quote = await response.json();
        setRandomQuote(data);
      }
    } catch (error) {
      console.error("Error fetching random quote:", error);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const handleQuoteUpdated = () => {
    fetchQuotes(currentPage, searchQuery); // Refresh current page with search
    fetchRandomQuote(); // Also refresh random quote
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRefresh = () => {
    fetchQuotes(currentPage, searchQuery);
    fetchRandomQuote();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* SEO */}
      <SEOHead quotes={quotes} randomQuote={randomQuote} searchQuery={searchQuery} />

      {/* Header */}
      <Header onRandomQuote={fetchRandomQuote} />

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 max-w-6xl">
        
        {/* Featured Random Quote */}
        {randomQuote && (
          <section className="text-center mb-12">
            <div className="max-w-3xl mx-auto p-6 rounded-lg bg-gradient-to-br from-primary/10 via-card to-accent/5 border border-primary/30 shadow-lg">
              <blockquote className="text-xl font-medium leading-relaxed text-foreground mb-4">
                "{randomQuote.quote}"
              </blockquote>
              <div className="flex items-center justify-center gap-6 text-sm">
                <span className="font-semibold text-primary">
                  {randomQuote.character}
                </span>
                <span className="text-muted-foreground">
                  {randomQuote.anime}
                </span>
                <span className="text-muted-foreground">
                  ❤️ {randomQuote.likes || 0}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Search and Quotes Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <SearchQuotes
              onSearch={handleSearch}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading quotes...</p>
              </div>
            </div>
          ) : (
            <QuotesTable 
              quotes={quotes} 
              currentPage={currentPage}
              totalItems={totalQuotes}
              onQuoteUpdated={handleQuoteUpdated}
              onPageChange={handlePageChange}
            />
          )}
        </section>

        <Separator className="my-12" />

        {/* Add Quote Form - Centered */}
        <section className="text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Share Your Favorite Quote</h2>
            <p className="text-muted-foreground">Add a meaningful quote from your favorite anime</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <AddQuoteForm onQuoteAdded={handleQuoteUpdated} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="text-center">
          <p className="text-muted-foreground">
            Made with ❤️ for anime lovers everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}
