import { Quote } from "@shared/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuoteCardProps {
  quote: Quote;
  className?: string;
}

export function QuoteCard({ quote, className }: QuoteCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      "bg-gradient-to-br from-card via-card to-accent/5",
      "border-border/50 hover:border-primary/30",
      className
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <blockquote className="text-lg font-medium leading-relaxed text-foreground">
            "{quote.text}"
          </blockquote>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <p className="font-semibold text-primary">
                {quote.character}
              </p>
              <Badge variant="secondary" className="text-xs">
                {quote.anime}
              </Badge>
            </div>
            
            {quote.createdAt && (
              <time className="text-xs text-muted-foreground">
                {new Date(quote.createdAt).toLocaleDateString()}
              </time>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
