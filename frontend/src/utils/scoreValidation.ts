/**
 * Validation utilities for match scores
 */

export interface ScoreValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates match scores according to best-of-3 rules
 * @param score1 - Score for player 1
 * @param score2 - Score for player 2
 * @returns Validation result with error message if invalid
 */
export const validateScores = (score1: number, score2: number): ScoreValidationResult => {
  if (score1 < 0 || score2 < 0) {
    return { isValid: false, error: "Scores must be non-negative" };
  }
  
  if (score1 + score2 > 3) {
    return { isValid: false, error: "Total games cannot exceed 3 (best of 3)" };
  }
  
  return { isValid: true };
};
