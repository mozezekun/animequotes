import { Button } from "@/components/ui/button";
import { Quote, Sparkles } from "lucide-react";

interface HeaderProps {
  onRandomQuote?: () => void;
}

export function Header({ onRandomQuote }: HeaderProps) {
  return (
    <header className="text-center py-8">
      {/* Logo and Title */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Quote className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AnimeQuotes
        </h1>
      </div>
      
      {/* Random Quote Button */}
      <Button 
        onClick={onRandomQuote} 
        variant="outline"
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Random Quote
      </Button>
    </header>
  );
}
