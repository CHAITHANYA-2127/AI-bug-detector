import { AIAnalysis, AIFix, TestCase, VerificationResult, BugInput } from '@/types';

export interface AIServiceConfig {
  apiKey?: string;
  provider?: 'gemini' | 'openai' | 'mock';
  model?: string;
  temperature?: number;
}

export interface BugAnalysisRequest {
  input: BugInput;
  bugId: string;
}

export interface FixGenerationRequest {
  bugId: string;
  analysis: AIAnalysis;
  input: BugInput;
}

export interface TestGenerationRequest {
  bugId: string;
  analysis: AIAnalysis;
  fix: AIFix;
}

export interface VerificationRequest {
  bugId: string;
  analysis: AIAnalysis;
  fix: AIFix;
  testCases: TestCase[];
}
