import { AIFix, CodeDiff } from '@/types';
import { FixGenerationRequest } from './types';

export class FixGeneratorService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_AI_API_KEY || localStorage.getItem('bug_fix_ai_key') || null;
  }

  public setApiKey(key: string | null) {
    this.apiKey = key;
  }

  public async generateFix(request: FixGenerationRequest): Promise<AIFix> {
    const { bugId, analysis, input } = request;

    // Simulate AI generation time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (this.apiKey) {
      try {
        const liveFix = await this.callLiveLLM(bugId, analysis, input);
        if (liveFix) return liveFix;
      } catch (err) {
        console.warn('Live fix generator failed, using heuristic fix generator:', err);
      }
    }

    return this.generateHeuristicFix(bugId, analysis, input);
  }

  private async callLiveLLM(bugId: string, analysis: any, input: any): Promise<AIFix | null> {
    const prompt = `Given this bug analysis:
Title: ${analysis.generatedTitle}
Category: ${analysis.category}
Probable Cause: ${analysis.probableRootCause}
Provided Code: ${input.relevantCode || 'N/A'}

Generate a proposed software fix in JSON format:
{
  "summary": string,
  "diff": {
    "filename": string,
    "language": string,
    "beforeCode": string,
    "afterCode": string
  },
  "whyThisFixWorks": string,
  "changesMade": string[],
  "potentialSideEffects": string[]
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

    return {
      fixId: `FIX-${Math.floor(1000 + Math.random() * 9000)}`,
      bugId,
      summary: parsed.summary,
      diff: {
        filename: parsed.diff.filename || 'src/components/Checkout.tsx',
        language: parsed.diff.language || 'typescript',
        beforeCode: parsed.diff.beforeCode,
        afterCode: parsed.diff.afterCode,
        lineChanges: this.buildLineChanges(parsed.diff.beforeCode, parsed.diff.afterCode)
      },
      whyThisFixWorks: parsed.whyThisFixWorks,
      changesMade: parsed.changesMade || [],
      potentialSideEffects: parsed.potentialSideEffects || [],
      developerReviewRequired: true,
      status: 'Pending Review',
      generatedAt: new Date().toISOString()
    };
  }

  private generateHeuristicFix(bugId: string, analysis: any, input: any): AIFix {
    const text = `${analysis.generatedTitle} ${analysis.probableRootCause} ${input.description}`.toLowerCase();

    let filename = 'src/features/cart/calculateCartTotal.ts';
    let language = 'typescript';
    let beforeCode = '';
    let afterCode = '';
    let summary = 'Add defensive null-check guards, atomic discount recalculation, and graceful fallback states.';
    let whyThisFixWorks = 'Ensures that calculation cycles never attempt property access on items that were removed from the active session, maintaining a coherent state pipeline.';
    let changesMade = [
      'Added validation checking if items array is non-empty before coupon reduction.',
      'Protected subtotal access with optional chaining (?.) and default zero fallbacks.',
      'Reset coupon discount to 0 if total eligible cart value drops below threshold.'
    ];
    let potentialSideEffects = [
      'If cart is empty, discount badges will immediately reset to $0.00 rather than showing pending state.',
      'Requires unit tests to confirm multi-currency rounding precision remains intact.'
    ];

    if (text.includes('cart') || text.includes('coupon') || text.includes('checkout')) {
      filename = 'src/features/cart/calculateCartTotal.ts';
      language = 'typescript';
      beforeCode = `export function applyCouponToCart(cart: CartState, coupon: Coupon): CartTotal {
  // CRITICAL: Assumes cart.items is always populated with original references
  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Buggy: Does not check if item was spliced or if coupon minimum is still met
  const discountAmount = (subtotal * coupon.percentage) / 100;
  const taxableAmount = cart.items[0].taxable ? subtotal - discountAmount : subtotal;

  return {
    subtotal,
    discountAmount,
    finalTotal: subtotal - discountAmount
  };
}`;

      afterCode = `export function applyCouponToCart(cart: CartState, coupon?: Coupon | null): CartTotal {
  // Safe: Handle null/undefined cart or empty items array defensively
  if (!cart?.items || cart.items.length === 0) {
    return { subtotal: 0, discountAmount: 0, finalTotal: 0 };
  }

  const subtotal = cart.items.reduce((acc, item) => {
    const price = typeof item?.price === 'number' ? item.price : 0;
    const qty = typeof item?.quantity === 'number' ? item.quantity : 1;
    return acc + (price * qty);
  }, 0);

  // Validate coupon rules against active subtotal
  let discountAmount = 0;
  if (coupon && subtotal >= (coupon.minSubtotal ?? 0)) {
    discountAmount = Math.min((subtotal * coupon.percentage) / 100, coupon.maxDiscount ?? Infinity);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2))
  };
}`;
      summary = 'Safeguard cart reduction loop with optional chaining, empty item validation, and defensive coupon threshold enforcement.';
      whyThisFixWorks = 'Eliminates index access on cart.items[0] and recalculates the discount dynamically based on the updated items array, avoiding unhandled TypeErrors when items are spliced.';
      changesMade = [
        'Added early return for null or empty cart.items array.',
        'Sanitized price and quantity with defensive defaults to avoid NaN.',
        'Validated coupon against minimum subtotal threshold before applying discount.',
        'Clamped final total to never fall below 0.00 and rounded to 2 decimal places.'
      ];
      potentialSideEffects = [
        'Coupons with minimum order requirements will now automatically deactivate if cart value drops below threshold.',
        'Ensure downstream analytics hooks update their payload listeners when finalTotal changes to 0.'
      ];
    } else if (text.includes('login') || text.includes('auth') || text.includes('token')) {
      filename = 'src/services/auth/tokenInterceptor.ts';
      language = 'typescript';
      beforeCode = `export async function handleAuthRequest(requestConfig: AxiosRequestConfig) {
  const token = localStorage.getItem('access_token');
  requestConfig.headers['Authorization'] = \`Bearer \${token}\`;

  try {
    return await axios(requestConfig);
  } catch (error) {
    // Hangs if 401 occurs repeatedly without refreshing or clearing loading state
    return refreshTokenAndRetry(requestConfig);
  }
}`;

      afterCode = `export async function handleAuthRequest(requestConfig: AxiosRequestConfig) {
  const token = localStorage.getItem('access_token');
  if (token) {
    requestConfig.headers['Authorization'] = \`Bearer \${token}\`;
  }

  try {
    return await axios(requestConfig);
  } catch (error: any) {
    if (error.response?.status === 401 && !requestConfig._isRetry) {
      requestConfig._isRetry = true;
      try {
        const refreshedToken = await refreshAccessToken();
        requestConfig.headers['Authorization'] = \`Bearer \${refreshedToken}\`;
        return await axios(requestConfig);
      } catch (refreshErr) {
        authStore.dispatch({ type: 'AUTH_LOGOUT' });
        window.location.href = '/login?session_expired=1';
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
}`;
      summary = 'Implement one-shot retry flag (_isRetry) and fail-safe redirection on token refresh exhaustion.';
      whyThisFixWorks = 'Prevents recursive token refresh loops and guarantees that 401 errors resolve either with fresh credentials or an explicit session expiration redirect, resetting button loading states.';
      changesMade = [
        'Added _isRetry guard preventing infinite loop on repeated 401s.',
        'Dispatched AUTH_LOGOUT on refresh rejection to reset UI loading states.',
        'Gracefully redirected user with session_expired query parameter.'
      ];
      potentialSideEffects = [
        'Users with expired refresh tokens will immediately be directed to login instead of lingering on page.'
      ];
    } else if (text.includes('upload') || text.includes('image') || text.includes('avatar')) {
      filename = 'src/server/controllers/uploadController.ts';
      language = 'typescript';
      beforeCode = `export async function uploadAvatar(req: Request, res: Response) {
  const file = req.file;
  // Does not validate file size or mime-type before streaming to S3
  const buffer = file.buffer;
  const s3Result = await s3Client.upload({ Bucket: 'avatars', Key: file.originalname, Body: buffer }).promise();
  return res.json({ url: s3Result.Location });
}`;

      afterCode = `export async function uploadAvatar(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
    if (file.size > MAX_FILE_SIZE) {
      return res.status(413).json({ error: 'File size exceeds maximum 5MB threshold' });
    }

    const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return res.status(415).json({ error: 'Unsupported media format. Only JPEG, PNG, WEBP allowed.' });
    }

    const safeFilename = \`\${crypto.randomUUID()}-\${path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_')}\`;
    const s3Result = await s3Client.upload({
      Bucket: process.env.S3_BUCKET_NAME || 'avatars',
      Key: safeFilename,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise();

    return res.status(200).json({ url: s3Result.Location, status: 'success' });
  } catch (err: any) {
    logger.error('Failed to process avatar upload', { err });
    return res.status(500).json({ error: 'Internal upload processing error' });
  }
}`;
      summary = 'Add strict file size checks, MIME type whitelisting, sanitized filename hashing, and error boundaries.';
      whyThisFixWorks = 'Rejects files over 5MB with HTTP 413 before in-memory buffering exceeds capacity, and sanitizes filenames to prevent path traversal or special character upload crashes.';
      changesMade = [
        'Added size guard checking against 5MB maximum.',
        'MIME type validation against JPEG, PNG, WEBP.',
        'Generated cryptographically secure UUID prefix for filenames.',
        'Wrapped upload operation in try/catch block with explicit status codes.'
      ];
      potentialSideEffects = [
        'Users attempting to upload TIFF or animated GIF avatars will now receive a clean 415 error instead of hanging.'
      ];
    } else {
      // Generic high-quality fix
      filename = 'src/utils/safeExecutionHandler.ts';
      language = 'typescript';
      beforeCode = `export function processHandler(payload: any) {
  // Vulnerable to null / undefined payload
  const result = payload.data.items.map(x => x.value * 2);
  return result;
}`;
      afterCode = `export function processHandler(payload?: { data?: { items?: Array<{ value: number }> } }) {
  // Defensively validate nested structure before mapping
  if (!payload?.data?.items || !Array.isArray(payload.data.items)) {
    console.warn('[processHandler] Received invalid or empty payload structure, returning empty array.');
    return [];
  }

  return payload.data.items
    .filter(item => typeof item?.value === 'number' && !isNaN(item.value))
    .map(item => item.value * 2);
}`;
      summary = 'Add deep defensive object navigation and fallback defaults for unexpected undefined states.';
      whyThisFixWorks = 'Prevents uncaught TypeErrors from terminating runtime execution by validating schema invariants before iteration.';
      changesMade = [
        'Added optional chaining on deep properties.',
        'Added Array.isArray check on collection.',
        'Filtered out non-numeric values to prevent NaN propagation.'
      ];
      potentialSideEffects = [
        'Malformed inputs now return empty arrays rather than failing loud; ensure downstream consumers check length.'
      ];
    }

    return {
      fixId: `FIX-${Math.floor(1000 + Math.random() * 9000)}`,
      bugId,
      summary,
      diff: {
        filename,
        language,
        beforeCode,
        afterCode,
        lineChanges: this.buildLineChanges(beforeCode, afterCode)
      },
      whyThisFixWorks,
      changesMade,
      potentialSideEffects,
      developerReviewRequired: true,
      status: 'Pending Review',
      generatedAt: new Date().toISOString()
    };
  }

  private buildLineChanges(before: string, after: string) {
    const beforeLines = before.split('\n');
    const afterLines = after.split('\n');
    const changes: any[] = [];

    // Simple diff generator for visual line badges
    let lineNum = 1;
    beforeLines.forEach((line) => {
      if (!afterLines.includes(line)) {
        changes.push({ type: 'removed', lineNumber: lineNum++, content: line });
      }
    });

    afterLines.forEach((line) => {
      if (!beforeLines.includes(line)) {
        changes.push({ type: 'added', lineNumber: lineNum++, content: line });
      } else {
        changes.push({ type: 'neutral', lineNumber: lineNum++, content: line });
      }
    });

    return changes;
  }
}

export const fixGenerator = new FixGeneratorService();
