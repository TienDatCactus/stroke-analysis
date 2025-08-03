/**
 * Types for stroke prediction API responses
 */

import { PredictionErrorCode } from "./error";

export interface PredictionResult {
  index: number;
  prediction: string;
}

export interface PredictionResponse {
  success: boolean;
  predictions: string[];
  results?: PredictionResult[];
  error?: string;
  errorCode?: PredictionErrorCode;
  missingColumns?: string[]; // If error is due to missing columns
  dataTypeIssues?: {
    column: string;
    expectedType: string;
    receivedType: string;
  }[]; // If error is due to invalid data types
}

export type StrokeAnalysisData = {
  strokeCount: number;
  noStrokeCount: number;
  totalCount: number;
  strokePercentage: number;
  noStrokePercentage: number;
};
