import { TestCase } from '@/types';
import { TestGenerationRequest } from './types';

export class TestGeneratorService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_AI_API_KEY || localStorage.getItem('bug_fix_ai_api_key') || null;
  }

  public setApiKey(key: string | null) {
    this.apiKey = key;
  }

  public async generateTests(request: TestGenerationRequest): Promise<TestCase[]> {
    const { analysis, fix } = request;

    // Simulate generation time
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const text = `${analysis.generatedTitle} ${analysis.probableRootCause} ${fix.summary}`.toLowerCase();

    if (text.includes('cart') || text.includes('coupon') || text.includes('checkout')) {
      return [
        {
          id: 'TEST-101',
          scenario: 'Reproduction: Spliced item with active coupon trigger',
          category: 'Reproduction Test',
          input: 'cart: splice item [0], remaining [{ price: 40 }], coupon: { rate: 0.15 }',
          expectedResult: 'Asserts previous TypeError crash is cleanly prevented and no unhandled exceptions are thrown.',
          status: 'Not Run'
        },
        {
          id: 'TEST-102',
          scenario: 'Happy Path: Valid coupon applied to multi-item cart',
          category: 'Happy Path',
          input: 'cart: [{ id: "A", price: 50, qty: 1 }, { id: "B", price: 30, qty: 1 }], coupon: { percentage: 10 }',
          expectedResult: 'Subtotal $80.00, Discount $8.00, Final Total $72.00 correctly calculated.',
          status: 'Not Run'
        },
        {
          id: 'TEST-103',
          scenario: 'Negative: Coupon minimum subtotal threshold not reached',
          category: 'Negative Tests',
          input: 'cart: [{ price: 15, qty: 1 }], coupon: { percentage: 15, minSubtotal: 50 }',
          expectedResult: 'Discount clamped to $0.00; triggers informative message "Minimum order of $50 required".',
          status: 'Not Run'
        },
        {
          id: 'TEST-104',
          scenario: 'Edge Case: Empty cart array with active coupon discount',
          category: 'Edge Cases',
          input: 'cart: { items: [] }, coupon: { percentage: 20 }',
          expectedResult: 'Returns subtotal $0.00, discount $0.00, total $0.00 without undefined property access.',
          status: 'Not Run'
        },
        {
          id: 'TEST-105',
          scenario: 'Regression: Consecutive item additions & removals preserve total',
          category: 'Regression Tests',
          input: 'add item A, add item B, remove item A, apply coupon, add item C',
          expectedResult: 'Dynamic subtotal matches actual cart items count and discount calculates correctly on latest sum.',
          status: 'Not Run'
        }
      ];
    } else if (text.includes('login') || text.includes('auth') || text.includes('token')) {
      return [
        {
          id: 'TEST-201',
          scenario: 'Reproduction: Expired token refresh rejection resets button spinner',
          category: 'Reproduction Test',
          input: '401 Unauthorized returned by /api/auth/refresh during active login submit',
          expectedResult: 'Asserts button loading state clears to false; does not lock user in infinite loading spinner.',
          status: 'Not Run'
        },
        {
          id: 'TEST-202',
          scenario: 'Happy Path: Valid user credentials authentication',
          category: 'Happy Path',
          input: 'credentials: { email: "dev@bugfix.ai", password: "••••••••" }',
          expectedResult: 'Returns 200 OK with valid JWT session, redirects cleanly to /dashboard.',
          status: 'Not Run'
        },
        {
          id: 'TEST-203',
          scenario: 'Negative: Invalid password attempt with rate limiting',
          category: 'Negative Tests',
          input: 'password: "wrong_password"',
          expectedResult: 'Displays "Invalid username or password" toast without hanging UI.',
          status: 'Not Run'
        },
        {
          id: 'TEST-204',
          scenario: 'Edge Case: Simultaneous concurrent API calls during token refresh',
          category: 'Edge Cases',
          input: '3 simultaneous requests fired while token refresh is in flight',
          expectedResult: 'One-shot _isRetry guard prevents recursive token refresh loop and shares single token resolution.',
          status: 'Not Run'
        },
        {
          id: 'TEST-205',
          scenario: 'Regression: Manual logout resets cached authorization headers',
          category: 'Regression Tests',
          input: 'user clicks "Sign Out" from navigation drawer',
          expectedResult: 'Dispatches AUTH_LOGOUT and purges localStorage token, preventing stale session reuse.',
          status: 'Not Run'
        }
      ];
    } else if (text.includes('upload') || text.includes('image') || text.includes('file') || text.includes('avatar')) {
      return [
        {
          id: 'TEST-301',
          scenario: 'Reproduction: Oversized 8MB avatar triggers client validation',
          category: 'Reproduction Test',
          input: 'file: high_res_camera_photo.jpg (8.4MB, image/jpeg)',
          expectedResult: 'Rejects payload with 413 or client toast before memory buffer overflow occurs.',
          status: 'Not Run'
        },
        {
          id: 'TEST-302',
          scenario: 'Happy Path: Standard 1.5MB PNG profile image upload',
          category: 'Happy Path',
          input: 'file: profile.png (1.5MB, image/png)',
          expectedResult: 'Uploads successfully to blob storage, returns 200 OK with CDN url.',
          status: 'Not Run'
        },
        {
          id: 'TEST-303',
          scenario: 'Negative: Unsupported executable format disguised as image',
          category: 'Negative Tests',
          input: 'file: script.sh.png (mime: application/x-sh)',
          expectedResult: 'MIME validation blocks file with HTTP 415 Unsupported Media Type.',
          status: 'Not Run'
        },
        {
          id: 'TEST-304',
          scenario: 'Edge Case: Filename containing path traversal characters',
          category: 'Edge Cases',
          input: 'file: "../../etc/passwd%00.png"',
          expectedResult: 'Cryptographic UUID prefix and regex sanitization strip illegal directory traversal tokens.',
          status: 'Not Run'
        },
        {
          id: 'TEST-305',
          scenario: 'Regression: Thumbnail preview generated on successful upload',
          category: 'Regression Tests',
          input: 'upload avatar -> verify user navbar avatar element',
          expectedResult: 'Navbar immediately re-renders with new avatar without requiring hard page refresh.',
          status: 'Not Run'
        }
      ];
    }

    // Default universal suite containing the 5 categories
    return [
      {
        id: 'TEST-001',
        scenario: 'Reproduction: Reproduce original crash with invalid payload',
        category: 'Reproduction Test',
        input: 'payload: null or undefined nested properties',
        expectedResult: 'Validates that previous runtime crash no longer terminates process.',
        status: 'Not Run'
      },
      {
        id: 'TEST-002',
        scenario: 'Happy Path: Standard execution with nominal data schema',
        category: 'Happy Path',
        input: 'payload: { data: { items: [{ value: 10 }, { value: 20 }] } }',
        expectedResult: 'Completes successfully and returns valid mapped results.',
        status: 'Not Run'
      },
      {
        id: 'TEST-003',
        scenario: 'Negative: Malformed data types and unexpected schema shapes',
        category: 'Negative Tests',
        input: 'payload: { data: { items: "not_an_array" } }',
        expectedResult: 'Defensive guard clause catches non-array and safely returns fallback default.',
        status: 'Not Run'
      },
      {
        id: 'TEST-004',
        scenario: 'Edge Case: Empty boundary collection',
        category: 'Edge Cases',
        input: 'payload: { data: { items: [] } }',
        expectedResult: 'Handles 0-length collection with 0ms overhead.',
        status: 'Not Run'
      },
      {
        id: 'TEST-005',
        scenario: 'Regression: Concurrent handler invocations remain isolated',
        category: 'Regression Tests',
        input: 'multiple simultaneous payload events',
        expectedResult: 'State remains pure and free of cross-invocation mutation side effects.',
        status: 'Not Run'
      }
    ];
  }
}

export const testGenerator = new TestGeneratorService();
