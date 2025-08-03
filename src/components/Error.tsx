import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PredictionError, errorMap } from "@/types/error";

type Props = {
  error: PredictionError;
};

export function PredictionErrorDisplay({ error }: Props) {
  const { title, message, renderDetails, suggestion } =
    errorMap[error.errorCode];
  console.log(error.errorCode);
  return (
    <div className="w-full ">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle />
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>

      <div className="mt-1 text-sm">{message}</div>

      {renderDetails && (
        <div className="mt-2 p-3 bg-red-50 rounded-md">
          {renderDetails(error)}
        </div>
      )}

      {suggestion && (
        <div className="mt-4 pt-3 border-t border-red-100 text-sm">
          <p className="font-medium mb-2">Suggestions:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>{suggestion}</li>
            <li>Compare your data to the example format</li>
            <li>Ensure all numerical values are valid</li>
          </ul>

          <div className="mt-4">
            <a href="/examples/example.xlsx" download>
              <Button variant="outline" size="sm">
                Download Example File
              </Button>
            </a>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-muted-foreground line-clamp-3">
        {error.error || "An unknown error occurred."}
      </div>
    </div>
  );
}
