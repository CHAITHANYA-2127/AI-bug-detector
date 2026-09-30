export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type BugStatus = 
  | 'Open'
  | 'Analyzing'
  | 'Fix Suggested'
  | 'Testing'
  | 'Verified'
  | 'Closed';

export type Category = 
  | 'Frontend / UI'
  | 'Backend / API'
  | 'Authentication'
  | 'State Management'
  | 'Database / ORM'
  | 'Performance'
  | 'Security'
  | 'Payment / Cart';

export interface CodeSnippet {
  language: string;
  filename?: string;
  code: string;
  highlightLines?: number[];
}

export interface BugInput {
  title?: string;
  description: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  environment?: string;
  browser?: string;
  os?: string;
  programmingLanguage?: string;
  relevantCode?: string;
  errorLogs?: string;
  attachments?: {
    name: string;
    type: 'screenshot' | 'log' | 'code';
    size: string;
    previewUrl?: string;
  }[];
}

export interface DuplicateBugSuggestion {
  id: string;
  title: string;
  severity: Severity;
  similarity: number; // percentage e.g. 85
  reason: string;
}

export interface AIAnalysis {
  bugId: string;
  generatedTitle: string;
  category: Category;
  severity: Severity;
  priority: 'P0 - Blocker' | 'P1 - Urgent' | 'P2 - Normal' | 'P3 - Low';
  affectedComponent: string;
  environment: string;
  problemSummary: string;
  expectedBehavior: string;
  actualBehavior: string;
  stepsToReproduce: string[];
  technicalAnalysis: string;
  probableRootCause: string;
  aiReasoning: string;
  confidenceScore: number; // 0 - 100
  possibleDuplicates: DuplicateBugSuggestion[];
  relatedBugs: {
    id: string;
    title: string;
    similarity: number;
  }[];
  analyzedAt: string;
}

export interface CodeDiff {
  filename: string;
  language: string;
  beforeCode: string;
  afterCode: string;
  lineChanges: {
    type: 'added' | 'removed' | 'neutral';
    lineNumber: number;
    content: string;
  }[];
}

export interface AIFix {
  fixId: string;
  bugId: string;
  summary: string;
  diff: CodeDiff;
  whyThisFixWorks: string;
  changesMade: string[];
  potentialSideEffects: string[];
  developerReviewRequired: boolean;
  developerNotes?: string;
  status: 'Pending Review' | 'Accepted' | 'Rejected' | 'Applied';
  generatedAt: string;
}

export type TestCategory = 
  | 'Reproduction Test'
  | 'Happy Path' 
  | 'Negative Tests' 
  | 'Edge Cases' 
  | 'Regression Tests';

export interface TestCase {
  id: string;
  scenario: string;
  category: TestCategory;
  input: string;
  expectedResult: string;
  status: 'Not Run' | 'Passed' | 'Failed';
  executionTimeMs?: number;
  outputLog?: string;
}

export type VerificationStatus = 'READY FOR REVIEW' | 'VERIFIED IN DEMO' | 'PASSED' | 'FAILED';

export interface VerificationResult {
  status: VerificationStatus;
  totalTests: number;
  testsPassed: number;
  testsFailed: number;
  testsNotRun: number;
  regressionCoveragePercent: number;
  readyForDeveloperReview: boolean;
  verificationNotes: string;
  checklist: {
    bugDocumented: boolean;
    rootCauseReviewed: boolean;
    fixGenerated: boolean;
    testsGenerated: boolean;
    regressionTestsConsidered: boolean;
    verificationCompleted: boolean;
    developerApproval: boolean;
    readyForDeployment: boolean;
  };
  verifiedAt?: string;
}

export interface BugRecord {
  id: string;
  title: string;
  description: string;
  input: BugInput;
  severity: Severity;
  category: Category;
  status: BugStatus;
  createdAt: string;
  updatedAt: string;
  analysis?: AIAnalysis;
  fix?: AIFix;
  testCases?: TestCase[];
  verification?: VerificationResult;
}

export type PipelineStage = 
  | 'report'
  | 'analysis'
  | 'diagnose'
  | 'fix'
  | 'tests'
  | 'verification';
