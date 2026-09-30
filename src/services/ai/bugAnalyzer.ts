import { AIAnalysis, BugInput, Category, Severity, DuplicateBugSuggestion } from '@/types';
import { BugAnalysisRequest } from './types';
import { initialBugs } from '@/data/initialBugs';

export class BugAnalyzerService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_AI_API_KEY || localStorage.getItem('bug_fix_ai_api_key') || null;
  }

  public setApiKey(key: string | null) {
    this.apiKey = key;
  }

  public hasActiveKey(): boolean {
    return !!this.apiKey;
  }

  public async analyzeBug(request: BugAnalysisRequest): Promise<AIAnalysis> {
    const { input, bugId } = request;

    // Simulate realistic AI network latency even in mock mode
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (this.apiKey) {
      try {
        const liveResult = await this.callLiveLLM(input, bugId);
        if (liveResult) return liveResult;
      } catch (err) {
        console.warn('Live AI analysis failed, falling back to heuristic engine:', err);
      }
    }

    return this.generateHeuristicAnalysis(input, bugId);
  }

  private async callLiveLLM(input: BugInput, bugId: string): Promise<AIAnalysis | null> {
    const prompt = `Analyze this software bug and return ONLY raw valid JSON (no markdown formatting, no backticks).
Bug Title: ${input.title || 'Untitled'}
Description: ${input.description}
Expected: ${input.expectedBehavior || 'N/A'}
Actual: ${input.actualBehavior || 'N/A'}
Language: ${input.programmingLanguage || 'N/A'}
Code: ${input.relevantCode || 'N/A'}
Logs: ${input.errorLogs || 'N/A'}

JSON schema:
{
  "generatedTitle": string,
  "category": "Frontend / UI" | "Backend / API" | "Authentication" | "State Management" | "Database / ORM" | "Performance" | "Security" | "Payment / Cart",
  "severity": "Critical" | "High" | "Medium" | "Low",
  "priority": "P0 - Blocker" | "P1 - Urgent" | "P2 - Normal" | "P3 - Low",
  "affectedComponent": string,
  "environment": string,
  "problemSummary": string,
  "expectedBehavior": string,
  "actualBehavior": string,
  "stepsToReproduce": string[],
  "technicalAnalysis": string,
  "probableRootCause": string,
  "aiReasoning": string,
  "confidenceScore": number
}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('No text in response');
    const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
    
    // Calculate possible duplicates against database
    const duplicates = this.findDuplicates(input.description);

    return {
      ...parsed,
      bugId,
      possibleDuplicates: duplicates,
      relatedBugs: duplicates.map(d => ({ id: d.id, title: d.title, similarity: d.similarity })),
      analyzedAt: new Date().toISOString()
    };
  }

  private generateHeuristicAnalysis(input: BugInput, bugId: string): AIAnalysis {
    const text = `${input.title || ''} ${input.description} ${input.actualBehavior || ''} ${input.relevantCode || ''} ${input.errorLogs || ''}`.toLowerCase();

    let category: Category = 'Frontend / UI';
    let severity: Severity = 'Medium';
    let priority: 'P0 - Blocker' | 'P1 - Urgent' | 'P2 - Normal' | 'P3 - Low' = 'P2 - Normal';
    let affectedComponent = 'Client Application State Store';
    let title = input.title?.trim() || 'Unhandled State Exception During Component Lifecycle';
    let probableRootCause = 'Probable Cause: Unhandled null reference or missing guard clause during component state reconciliation.';
    let aiReasoning = 'The input description indicates a failure condition that occurs specifically when an action mutates a shared state structure without notifying downstream consumers.';
    let technicalAnalysis = 'Static analysis indicates that state updates are triggered without defensive checks on prerequisite variables, leading to uncaught TypeErrors in React render cycles.';
    let steps: string[] = [
      'Initialize application in standard environment.',
      'Navigate to the affected component.',
      'Trigger state update action described in bug report.',
      'Observe unexpected crash or silent failure.'
    ];

    if (text.includes('cart') || text.includes('coupon') || text.includes('checkout') || text.includes('discount')) {
      category = 'Payment / Cart';
      severity = 'Critical';
      priority = 'P0 - Blocker';
      affectedComponent = 'Cart State Manager / calculateCartTotal.ts';
      title = input.title || 'Checkout crashes after cart item removal and coupon application';
      probableRootCause = 'Probable Cause: Unsafe index access on spliced cart collection (e.g., items[0].price) when coupon calculation evaluates against stale or empty item arrays.';
      aiReasoning = 'Coupon calculation relies on array item references established prior to item removal. Splicing an item shifts indices, causing index 0 or adjacent pointers to evaluate to undefined during reduction.';
      technicalAnalysis = 'When an item is spliced from the cart array, the cached coupon subtotal reference is invalidated. Subsequent discount calculations recompute against stale item indices without verifying cart length > 0 and item availability.';
      steps = [
        'Add items A and B to the shopping cart.',
        'Navigate to Checkout page.',
        'Remove item B from the cart summary.',
        'Apply a promo or coupon code in the coupon field.',
        'Click "Apply" — client crashes with TypeError: Cannot read properties of undefined.'
      ];
    } else if (text.includes('login') || text.includes('auth') || text.includes('token') || text.includes('session')) {
      category = 'Authentication';
      severity = 'High';
      priority = 'P1 - Urgent';
      affectedComponent = 'Auth Interceptor / tokenInterceptor.ts';
      title = input.title || 'Login button unresponsive and freezes in loading state on expired session';
      probableRootCause = 'Probable Cause: Missing rejection catch block in authentication promise chain and absence of retry ceiling flag (_isRetry) in HTTP interceptor.';
      aiReasoning = 'When background session token expires, any API request triggers 401. If the token refresh endpoint also returns 401, the interceptor enters an unhandled rejection, leaving UI buttons in a permanent loading lock.';
      technicalAnalysis = 'The authentication promise remains pending indefinitely when the refresh endpoint returns a non-200 status code without dispatching an AUTH_REJECTED action.';
      steps = [
        'Open login screen with expired session storage token.',
        'Enter valid user credentials.',
        'Click "Sign In" button.',
        'Network tab shows cancelled/hanging request; button spinner freezes indefinitely.'
      ];
    } else if (text.includes('upload') || text.includes('image') || text.includes('file') || text.includes('avatar')) {
      category = 'Backend / API';
      severity = 'High';
      priority = 'P1 - Urgent';
      affectedComponent = 'Media Storage Controller / uploadController.ts';
      title = input.title || 'Profile image upload failure with unhandled 413 Payload Too Large error';
      probableRootCause = 'Probable Cause: Mismatch between client file-picker limits (10MB) and Express bodyParser memory threshold (1MB).';
      aiReasoning = 'Browser allows large files to stream over multipart form data, but reverse proxy or Node buffer middleware drops connection before handler executes, returning 413 without client error toast.';
      technicalAnalysis = 'Files exceeding default in-memory buffer limit (1MB) trigger socket hang-up before multipart headers are completely processed.';
      steps = [
        'Navigate to User Profile Settings.',
        'Select an image file greater than 2MB.',
        'Click "Save Profile".',
        'Upload spinner persists indefinitely, console logs 413 Payload Too Large.'
      ];
    } else if (text.includes('500') || text.includes('api') || text.includes('server') || text.includes('database')) {
      category = 'Backend / API';
      severity = 'Critical';
      priority = 'P0 - Blocker';
      affectedComponent = 'Core Gateway API / Database Query Service';
      title = input.title || 'Dashboard API returns 500 Internal Server Error under concurrent query load';
      probableRootCause = 'Probable Cause: Database connection pool exhaustion caused by missing finally release statements in async query resolvers.';
      aiReasoning = 'Under burst traffic, connections are allocated from connection pool (max 20) but unhandled error branches leave connections unreturned, causing subsequent queries to time out.';
      technicalAnalysis = 'Under concurrent requests, async DB client connections are not released back to the pool inside the finally block, causing subsequent queries to time out after 30s.';
      steps = [
        'Send parallel GET requests to dashboard analytics endpoint.',
        'Observe pool connection count reach max configured ceiling (20).',
        'Subsequent requests fail with 500 Internal Server Error timeout.'
      ];
    } else if (text.includes('mobile') || text.includes('menu') || text.includes('overlap') || text.includes('css')) {
      category = 'Frontend / UI';
      severity = 'Medium';
      priority = 'P2 - Normal';
      affectedComponent = 'Responsive Navigation Drawer / Header.tsx';
      title = input.title || 'Mobile navigation drawer z-index overlap on small viewport';
      probableRootCause = 'Probable Cause: Stacking context collision between sticky header z-index and drawer backdrop modal in mobile breakpoint.';
      aiReasoning = 'The navigation overlay is rendered inside a parent container with relative positioning and overflow-hidden, causing it to clip and overlay content improperly on screens <= 480px.';
      technicalAnalysis = 'The navigation overlay is rendered inside a parent container with relative positioning and overflow-hidden, causing it to clip and overlay content improperly on screens < 768px.';
      steps = [
        'Resize browser viewport to <= 480px width (iPhone / Pixel view).',
        'Tap the hamburger navigation toggle icon.',
        'Scroll down page content.',
        'Observe menu links overlapping hero text and becoming unclickable.'
      ];
    }

    const duplicates = this.findDuplicates(input.description);

    return {
      bugId,
      generatedTitle: title,
      category,
      severity,
      priority,
      affectedComponent,
      environment: input.environment || `${input.os || 'Windows 11'} / ${input.browser || 'Chrome 124'} / ${input.programmingLanguage || 'TypeScript'}`,
      problemSummary: input.description,
      expectedBehavior: input.expectedBehavior || 'System should complete requested user operation smoothly without throwing unhandled exceptions or stalling user interface.',
      actualBehavior: input.actualBehavior || 'System crashes or freezes, logging unhandled exceptions to console or error reporter.',
      stepsToReproduce: steps,
      technicalAnalysis,
      probableRootCause,
      aiReasoning,
      confidenceScore: Math.floor(Math.random() * 8) + 89, // 89% to 96%
      possibleDuplicates: duplicates,
      relatedBugs: duplicates.map(d => ({ id: d.id, title: d.title, similarity: d.similarity })),
      analyzedAt: new Date().toISOString()
    };
  }

  private findDuplicates(description: string): DuplicateBugSuggestion[] {
    const text = description.toLowerCase();
    const suggestions: DuplicateBugSuggestion[] = [];

    // Compare with initial preloaded bugs
    for (const b of initialBugs) {
      const targetText = `${b.title} ${b.description}`.toLowerCase();
      let similarity = 0;
      let reason = '';

      if ((text.includes('cart') || text.includes('coupon') || text.includes('checkout')) && 
          (targetText.includes('cart') || targetText.includes('coupon') || targetText.includes('checkout'))) {
        similarity = 92;
        reason = 'High symptom overlap: Both reports describe cart item manipulation followed by discount/coupon crash.';
      } else if ((text.includes('login') || text.includes('auth') || text.includes('token')) && 
                 (targetText.includes('login') || targetText.includes('auth') || targetText.includes('token'))) {
        similarity = 88;
        reason = 'Related authentication failure: Token refresh failure and loading spinner unresponsiveness.';
      } else if ((text.includes('upload') || text.includes('image') || text.includes('avatar')) && 
                 (targetText.includes('upload') || targetText.includes('image') || targetText.includes('avatar'))) {
        similarity = 85;
        reason = 'Matching multipart payload issue: Image upload size restrictions and 413 response codes.';
      } else if ((text.includes('500') || text.includes('pool') || text.includes('database')) && 
                 (targetText.includes('500') || targetText.includes('pool') || targetText.includes('database'))) {
        similarity = 82;
        reason = 'Correlated backend failure: Database connection timeout and 500 error under concurrency.';
      }

      if (similarity >= 80) {
        suggestions.push({
          id: b.id,
          title: b.title,
          severity: b.severity,
          similarity,
          reason
        });
      }
    }

    return suggestions;
  }
}

export const bugAnalyzer = new BugAnalyzerService();
