import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { AddQuoteRequest, AddQuoteResponse } from "@shared/api";
import { useToast } from "@/components/ui/use-toast";

interface AddQuoteFormProps {
  onQuoteAdded?: () => void;
}

export function AddQuoteForm({ onQuoteAdded }: AddQuoteFormProps) {
  const [quote, setQuote] = useState("");
  const [character, setCharacter] = useState("");
  const [anime, setAnime] = useState("");
  const [tag, setTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quote.trim() || !character.trim() || !anime.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in quote, character, and anime fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const request: AddQuoteRequest = {
        quote: quote.trim(),
        character: character.trim(),
        anime: anime.trim(),
        tag: tag.trim() || undefined,
      };

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: AddQuoteResponse = await response.json();

      if (data.success) {
        toast({
          title: "Quote Added!",
          description: "Your anime quote has been added successfully.",
        });
        
        // Reset form
        setQuote("");
        setCharacter("");
        setAnime("");
        setTag("");
        
        // Notify parent component
        onQuoteAdded?.();
      } else {
        throw new Error(data.message || "Failed to add quote");
      }
    } catch (error) {
      console.error("Error adding quote:", error);
      toast({
        title: "Error",
        description: "Failed to add quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Quote
        </CardTitle>
        <CardDescription>
          Share your favorite anime quotes with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quote-text">Quote</Label>
            <Textarea
              id="quote-text"
              placeholder="Enter the anime quote..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="character">Character</Label>
              <Input
                id="character"
                placeholder="Character name"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anime">Anime</Label>
              <Input
                id="anime"
                placeholder="Anime title"
                value={anime}
                onChange={(e) => setAnime(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Tag (Optional)</Label>
            <Input
              id="tag"
              placeholder="e.g., motivation, friendship, philosophy"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Quote...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Quote
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
