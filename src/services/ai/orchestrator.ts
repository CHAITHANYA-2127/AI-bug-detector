import { BugInput, BugRecord } from '@/types';
import { bugAnalyzer } from './bugAnalyzer';
import { fixGenerator } from './fixGenerator';
import { testGenerator } from './testGenerator';
import { verifier } from './verifier';

export type PipelineStep = 
  | 'reading' 
  | 'analyzing' 
  | 'root_cause' 
  | 'generating_fix' 
  | 'generating_tests' 
  | 'executing_verification' 
  | 'complete';

export interface PipelineProgressCallback {
  (step: PipelineStep, message: string, partialData?: Partial<BugRecord>): void;
}

export class PipelineOrchestrator {
  public async processBug(
    input: BugInput,
    onProgress?: PipelineProgressCallback
  ): Promise<BugRecord> {
    const bugId = `BUG-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Reading & Initializing
    onProgress?.('reading', 'Reading bug report and extracting symptoms...');
    await new Promise((r) => setTimeout(r, 600));

    // 2. Analyzing & Root Cause
    onProgress?.('analyzing', 'Analyzing failure patterns & correlating codebase context...');
    const analysis = await bugAnalyzer.analyzeBug({ input, bugId });

    onProgress?.('root_cause', 'Isolating probable root cause and failure mechanics...', {
      id: bugId,
      title: analysis.generatedTitle,
      description: input.description,
      input,
      severity: analysis.severity,
      category: analysis.category,
      status: 'Analyzing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analysis
    });

    // 3. Fix Generation
    onProgress?.('generating_fix', 'Synthesizing defensive fix and computing code diff...');
    const fix = await fixGenerator.generateFix({ bugId, analysis, input });

    // 4. Test Generation
    onProgress?.('generating_tests', 'Generating unit, edge case, and regression test suites...');
    const testCases = await testGenerator.generateTests({ bugId, analysis, fix });

    // 5. Verification Execution
    onProgress?.('executing_verification', 'Executing simulated test suite and checking regression coverage...');
    const { updatedTests, verificationResult } = await verifier.executeVerification({
      bugId,
      analysis,
      fix,
      testCases
    });

    const fullRecord: BugRecord = {
      id: bugId,
      title: analysis.generatedTitle,
      description: input.description,
      input,
      severity: analysis.severity,
      category: analysis.category,
      status: 'Verified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analysis,
      fix,
      testCases: updatedTests,
      verification: verificationResult
    };

    onProgress?.('complete', 'Pipeline completed! Verified fix ready for developer review.', fullRecord);

    return fullRecord;
  }
}

export const orchestrator = new PipelineOrchestrator();
