import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, RefreshCw } from "lucide-react";

interface SearchQuotesProps {
  onSearch: (query: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchQuotes({ 
  onSearch, 
  onRefresh, 
  isLoading = false,
  placeholder = "Search quotes, characters, anime, or tags..." 
}: SearchQuotesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button type="submit" disabled={isLoading} className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
        
        <Button 
          type="button"
          variant="outline" 
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </form>
      
      {searchQuery && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Searching for: "{searchQuery}"
        </p>
      )}
    </div>
  );
}
