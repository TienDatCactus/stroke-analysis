export type PredictionErrorCode =
  | "MISSING_COLUMNS"
  | "INVALID_DATA_TYPE"
  | "FILE_FORMAT_ERROR"
  | "MODEL_ERROR"
  | "UNKNOWN_ERROR";

export type ErrorInfo = {
  title: string;
  message: string;
  renderDetails?: (error: PredictionError) => React.ReactNode;
  suggestion?: string;
};

interface BasePredictionError {
  success: false;
  error: string;
  errorCode: PredictionErrorCode;
  predictions: [];
  results: [];
}

interface MissingColumnsError extends BasePredictionError {
  errorCode: "MISSING_COLUMNS";
  missingColumns: string[];
}

interface InvalidDataTypeError extends BasePredictionError {
  errorCode: "INVALID_DATA_TYPE";
  dataTypeIssues: Array<{
    column: string;
    expectedType: string;
    receivedType: string;
  }>;
}

interface FileFormatError extends BasePredictionError {
  errorCode: "FILE_FORMAT_ERROR";
}

interface ModelError extends BasePredictionError {
  errorCode: "MODEL_ERROR";
}

interface UnknownError extends BasePredictionError {
  errorCode: "UNKNOWN_ERROR";
}

export type PredictionError =
  | MissingColumnsError
  | InvalidDataTypeError
  | FileFormatError
  | ModelError
  | UnknownError;

export const errorMap: Record<PredictionErrorCode, ErrorInfo> = {
  MISSING_COLUMNS: {
    title: "Missing Required Columns",
    message: "Some required columns are missing from your Excel file.",
    renderDetails: (error) => {
      const e = error as MissingColumnsError;
      return (
        <ul className="list-disc pl-5 text-sm space-y-1">
          {e.missingColumns.map((col, idx) => (
            <li key={idx}>{col}</li>
          ))}
        </ul>
      );
    },
    suggestion: "Check your file and ensure all required columns are included.",
  },

  INVALID_DATA_TYPE: {
    title: "Invalid Data Types",
    message: "Some columns contain incorrect data types.",
    renderDetails: (error) => {
      const e = error as InvalidDataTypeError;
      return (
        <ul className="list-disc pl-5 text-sm space-y-1">
          {e.dataTypeIssues.map((issue, idx) => (
            <li key={idx}>
              <code>{issue.column}</code>: expected {issue.expectedType}, got{" "}
              {issue.receivedType}
            </li>
          ))}
        </ul>
      );
    },
    suggestion: "Ensure all numerical fields contain only valid numbers.",
  },

  FILE_FORMAT_ERROR: {
    title: "Invalid File Format",
    message: "The uploaded Excel file could not be read.",
    suggestion: "Please re-save your file as a .xlsx and try again.",
  },

  MODEL_ERROR: {
    title: "Model Prediction Failed",
    message: "The model encountered an error processing your input.",
    suggestion:
      "Ensure the input structure matches the format expected by the model.",
  },

  UNKNOWN_ERROR: {
    title: "Unexpected Error",
    message: "An unknown error occurred during prediction.",
    suggestion: "Try again or contact support if the issue persists.",
  },
};
