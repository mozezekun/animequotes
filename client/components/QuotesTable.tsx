import { useState } from "react";
import { Quote, LikeQuoteRequest, LikeQuoteResponse } from "@shared/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Pagination } from "@/components/Pagination";
import { cn } from "@/lib/utils";

interface QuotesTableProps {
  quotes: Quote[];
  currentPage: number;
  totalItems: number;
  onQuoteUpdated?: () => void;
  onPageChange?: (page: number) => void;
}

export function QuotesTable({ quotes, currentPage, totalItems, onQuoteUpdated, onPageChange }: QuotesTableProps) {
  const [likingQuotes, setLikingQuotes] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleLike = async (quoteId: string) => {
    if (!quoteId || likingQuotes.has(quoteId)) return;

    setLikingQuotes(prev => new Set(prev).add(quoteId));

    try {
      const request: LikeQuoteRequest = { quoteId };
      
      const response = await fetch("/api/quotes/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: LikeQuoteResponse = await response.json();

      if (data.success) {
        toast({
          title: "Quote Liked!",
          description: `This quote now has ${data.likes} likes.`,
        });
        
        // Refresh the quotes list
        onQuoteUpdated?.();
      } else {
        throw new Error(data.message || "Failed to like quote");
      }
    } catch (error) {
      console.error("Error liking quote:", error);
      toast({
        title: "Error",
        description: "Failed to like quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLikingQuotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(quoteId);
        return newSet;
      });
    }
  };

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No quotes found yet.</p>
        <p className="text-sm text-muted-foreground">Be the first to add a quote!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Quote</TableHead>
              <TableHead className="font-semibold">Character</TableHead>
              <TableHead className="font-semibold">Anime</TableHead>
              <TableHead className="font-semibold">Tag</TableHead>
              <TableHead className="font-semibold text-center">Likes</TableHead>
              <TableHead className="font-semibold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote, index) => (
              <TableRow
                key={quote._id || index}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="max-w-md">
                  <blockquote className="text-sm leading-relaxed">
                    "{quote.quote}"
                  </blockquote>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-primary">
                    {quote.character}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-foreground">
                    {quote.anime}
                  </span>
                </TableCell>

                <TableCell>
                  {quote.tag && (
                    <Badge variant="secondary" className="text-xs">
                      {quote.tag}
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{quote.likes || 0}</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(quote._id!)}
                    disabled={!quote._id || likingQuotes.has(quote._id)}
                    className={cn(
                      "gap-1 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950",
                      "transition-colors duration-200"
                    )}
                  >
                    {likingQuotes.has(quote._id!) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart className="h-4 w-4" />
                    )}
                    Like
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={25}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
