import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorBlockProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorBlock({ message = "Error al cargar los datos.", onRetry }: ErrorBlockProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardContent className="flex items-center gap-3 p-5">
        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
        <p className="flex-1 text-sm text-destructive">{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
