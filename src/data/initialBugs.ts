import { BugRecord } from '@/types';

export const initialBugs: BugRecord[] = [
  {
    id: 'BUG-1001',
    title: 'Login button not responding on token expiration',
    description: 'When user session expires in the background, clicking the Login button results in an infinite spinner and no navigation occurs.',
    severity: 'High',
    category: 'Authentication',
    status: 'Fix Suggested',
    createdAt: '2026-09-28T09:15:00Z',
    updatedAt: '2026-09-29T14:20:00Z',
    input: {
      title: 'Login button not responding on token expiration',
      description: 'When user session expires in the background, clicking the Login button results in an infinite spinner and no navigation occurs.',
      expectedBehavior: 'Login button should submit credentials or prompt session expired message and redirect cleanly.',
      actualBehavior: 'Button enters loading state forever; console logs 401 unhandled rejection.',
      environment: 'Production / Chrome 124 / Windows 11',
      browser: 'Chrome 124',
      os: 'Windows 11',
      programmingLanguage: 'TypeScript / React',
      relevantCode: `const handleLogin = async (creds) => {
  setLoading(true);
  await api.login(creds);
  navigate('/dashboard');
};`,
      errorLogs: 'Uncaught (in promise) AxiosError: Request failed with status code 401 at tokenInterceptor.ts:18'
    },
    analysis: {
      bugId: 'BUG-1001',
      generatedTitle: 'Login button unresponsiveness caused by missing rejection handler in auth interceptor',
      category: 'Authentication',
      severity: 'High',
      priority: 'P1 - Urgent',
      affectedComponent: 'Auth Interceptor / LoginButton.tsx',
      environment: 'Production / Chrome 124 / Windows 11',
      problemSummary: 'The login handler does not catch or clear the loading state when token refresh returns 401 Unauthorized.',
      expectedBehavior: 'Failed authentication clears spinner and reveals an alert banner to re-enter credentials.',
      actualBehavior: 'Loading state remains true permanently, disabling further interaction.',
      stepsToReproduce: [
        'Allow session cookie to expire or clear localStorage auth token.',
        'Enter valid user credentials in /login form.',
        'Click "Sign In" button.',
        'Observe infinite spinner; button remains disabled.'
      ],
      technicalAnalysis: 'The auth interceptor attempts token refresh on 401. If refresh also rejects, the promise chain fails without resetting the component state.',
      probableRootCause: 'Probable Cause: Missing try/catch/finally block in handleLogin component and missing reject delegation in Axios interceptor.',
      aiReasoning: 'Axios interceptor promise chain does not propagate token refresh failure to component catch blocks, leaving state variables un-updated.',
      confidenceScore: 92,
      possibleDuplicates: [
        {
          id: 'BUG-1004',
          title: 'Password reset email not received by enterprise users',
          severity: 'Medium',
          similarity: 48,
          reason: 'Both involve authentication and user session workflows.'
        }
      ],
      relatedBugs: [
        { id: 'BUG-1004', title: 'Password reset email not received', similarity: 48 }
      ],
      analyzedAt: '2026-09-28T09:20:00Z'
    },
    fix: {
      fixId: 'FIX-8012',
      bugId: 'BUG-1001',
      summary: 'Wrap auth execution in try/finally to guarantee loading state reset and dispatch auth error notification.',
      diff: {
        filename: 'src/components/auth/LoginForm.tsx',
        language: 'typescript',
        beforeCode: `const handleLogin = async (creds: LoginCredentials) => {
  setLoading(true);
  await api.login(creds);
  navigate('/dashboard');
};`,
        afterCode: `const handleLogin = async (creds: LoginCredentials) => {
  setLoading(true);
  setError(null);
  try {
    await api.login(creds);
    navigate('/dashboard');
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
};`,
        lineChanges: []
      },
      whyThisFixWorks: 'The finally block guarantees that setLoading(false) executes regardless of network error, 401 rejection, or promise timeout.',
      changesMade: [
        'Added try/catch/finally structure.',
        'Extracted human-readable error messages from response.',
        'Reset loading state in finally block.'
      ],
      potentialSideEffects: [
        'Invalid credential attempts will immediately clear button spinner and render red notification alert.'
      ],
      developerReviewRequired: true,
      status: 'Pending Review',
      generatedAt: '2026-09-28T09:25:00Z'
    },
    testCases: [
      {
        id: 'TEST-1001',
        scenario: 'Reproduction: 401 token refresh rejection clears loading lock',
        category: 'Reproduction Test',
        input: '{ user: "alice@example.com", pass: "wrong" } -> 401',
        expectedResult: 'Loading state resets to false and displays "Authentication failed"',
        status: 'Passed',
        executionTimeMs: 18
      },
      {
        id: 'TEST-1002',
        scenario: 'Happy Path: Valid credentials authenticate successfully',
        category: 'Happy Path',
        input: '{ user: "alice@example.com", pass: "secret123" }',
        expectedResult: '200 OK, redirects to /dashboard, loading state becomes false',
        status: 'Passed',
        executionTimeMs: 24
      }
    ],
    verification: {
      status: 'READY FOR REVIEW',
      totalTests: 2,
      testsPassed: 2,
      testsFailed: 0,
      testsNotRun: 0,
      regressionCoveragePercent: 92,
      readyForDeveloperReview: true,
      verificationNotes: 'Simulated auth error cases passed. Requires developer approval before branch merge.',
      checklist: {
        bugDocumented: true,
        rootCauseReviewed: true,
        fixGenerated: true,
        testsGenerated: true,
        regressionTestsConsidered: true,
        verificationCompleted: true,
        developerApproval: false,
        readyForDeployment: false
      },
      verifiedAt: '2026-09-28T09:30:00Z'
    }
  },
  {
    id: 'BUG-1002',
    title: 'Checkout crashes after coupon removal',
    description: 'When a user removes an item from the shopping cart and then applies a coupon, the checkout page crashes with an unhandled TypeError.',
    severity: 'Critical',
    category: 'Payment / Cart',
    status: 'Verified',
    createdAt: '2026-09-29T11:00:00Z',
    updatedAt: '2026-09-29T15:45:00Z',
    input: {
      title: 'Checkout crashes after coupon removal',
      description: 'When a user removes an item from the shopping cart and then applies a coupon, the checkout page crashes with an unhandled TypeError.',
      expectedBehavior: 'Coupon discount is recalculated against the updated cart items smoothly without throwing errors.',
      actualBehavior: 'Screen turns blank (white screen of death) with TypeError: Cannot read properties of undefined (reading "subtotal").',
      environment: 'Staging / Safari 17 & Chrome 124 / macOS & Windows',
      programmingLanguage: 'TypeScript',
      relevantCode: `export function calculateCart(items, coupon) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const discount = (items[0].price * coupon.rate);
  return subtotal - discount;
}`,
      errorLogs: 'TypeError: Cannot read properties of undefined (reading "price") at calculateCart (cart.ts:4)'
    },
    analysis: {
      bugId: 'BUG-1002',
      generatedTitle: 'Checkout crash from unsafe index access in coupon calculation on spliced cart items',
      category: 'Payment / Cart',
      severity: 'Critical',
      priority: 'P0 - Blocker',
      affectedComponent: 'Cart State Manager / calculateCart.ts',
      environment: 'Staging / Safari 17 & Chrome 124 / macOS & Windows',
      problemSummary: 'The coupon reduction logic directly accesses items[0].price without verifying that items array contains elements or has valid references.',
      expectedBehavior: 'Cart recalculates dynamically, handles empty cart, and validates coupon applicability safely.',
      actualBehavior: 'Accessing index [0] on an empty or modified cart array throws TypeError, triggering React error boundary.',
      stepsToReproduce: [
        'Add items to cart.',
        'Remove item from cart table.',
        'Enter coupon code "SAVE20" and hit Apply.',
        'Page crashes with white screen.'
      ],
      technicalAnalysis: 'Array splice mutates cart state asynchronously, while coupon calculation hook evaluates synchronously using stale item references.',
      probableRootCause: 'Probable Cause: Direct index property access (items[0].price) without boundary checking and lack of defensive fallback when items array length changes.',
      aiReasoning: 'When cart items are modified, the array reference length changes, causing index 0 to point to an undefined memory offset if the array was cleared or re-indexed.',
      confidenceScore: 96,
      possibleDuplicates: [
        {
          id: 'BUG-1005',
          title: 'Dashboard API returns 500 error under high concurrent load',
          severity: 'Critical',
          similarity: 32,
          reason: 'Both involve asynchronous collection state updates.'
        }
      ],
      relatedBugs: [
        { id: 'BUG-1005', title: 'Dashboard API returns 500 error', similarity: 31 }
      ],
      analyzedAt: '2026-09-29T11:05:00Z'
    },
    fix: {
      fixId: 'FIX-4491',
      bugId: 'BUG-1002',
      summary: 'Safeguard cart discount calculation with array guard clauses, optional chaining, and dynamic subtotal reduction.',
      diff: {
        filename: 'src/features/cart/calculateCartTotal.ts',
        language: 'typescript',
        beforeCode: `export function applyCouponToCart(cart: CartState, coupon: Coupon): CartTotal {
  // CRITICAL: Assumes cart.items is always populated with original references
  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Buggy: Direct index access causes crash if items changed
  const discountAmount = (cart.items[0].price * coupon.percentage) / 100;
  return { subtotal, discountAmount, finalTotal: subtotal - discountAmount };
}`,
        afterCode: `export function applyCouponToCart(cart: CartState, coupon?: Coupon | null): CartTotal {
  // Guard against null/empty cart
  if (!cart?.items || cart.items.length === 0) {
    return { subtotal: 0, discountAmount: 0, finalTotal: 0 };
  }

  const subtotal = cart.items.reduce((acc, item) => {
    const price = typeof item?.price === 'number' ? item.price : 0;
    const qty = typeof item?.quantity === 'number' ? item.quantity : 1;
    return acc + (price * qty);
  }, 0);

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
}`,
        lineChanges: []
      },
      whyThisFixWorks: 'Replaces unsafe cart.items[0] access with a safe subtotal-based percentage discount, and returns zero total gracefully if the cart is emptied.',
      changesMade: [
        'Added cart.items null/empty guard clause.',
        'Replaced items[0] index reference with dynamic subtotal discount.',
        'Enforced coupon minSubtotal and maxDiscount limits.',
        'Added Math.max(0, ...) boundary to prevent negative totals.'
      ],
      potentialSideEffects: [
        'Zero items cart will display $0.00 subtotal and $0.00 discount.'
      ],
      developerReviewRequired: true,
      status: 'Accepted',
      generatedAt: '2026-09-29T11:12:00Z'
    },
    testCases: [
      {
        id: 'TEST-101',
        scenario: 'Reproduction: Spliced item with coupon applied',
        category: 'Reproduction Test',
        input: 'cart: splice item "B", remaining [{ id: "A", price: 50, qty: 1 }], coupon: 10%',
        expectedResult: 'Asserts previous TypeError is prevented and recalculates cleanly to Final Total $45.00',
        status: 'Passed',
        executionTimeMs: 22
      },
      {
        id: 'TEST-102',
        scenario: 'Happy Path: Valid coupon applied to multi-item cart',
        category: 'Happy Path',
        input: 'cart: [{ id: "A", price: 50, qty: 1 }, { id: "B", price: 30, qty: 1 }], coupon: 10%',
        expectedResult: 'Subtotal $80.00, Discount $8.00, Final Total $72.00',
        status: 'Passed',
        executionTimeMs: 14
      },
      {
        id: 'TEST-103',
        scenario: 'Negative: Coupon minimum threshold not reached',
        category: 'Negative Tests',
        input: 'cart: [{ price: 10, qty: 1 }], coupon: { percentage: 10, minSubtotal: 50 }',
        expectedResult: 'Discount clamped to 0 without throwing error',
        status: 'Passed',
        executionTimeMs: 11
      },
      {
        id: 'TEST-104',
        scenario: 'Edge Case: Empty cart with coupon applied',
        category: 'Edge Cases',
        input: 'cart: { items: [] }, coupon: 20%',
        expectedResult: 'Returns subtotal 0, discount 0, total 0 without throwing error',
        status: 'Passed',
        executionTimeMs: 9
      },
      {
        id: 'TEST-105',
        scenario: 'Regression: Total retains precision across currency rounding',
        category: 'Regression Tests',
        input: 'cart: [{ price: 33.333, qty: 3 }]',
        expectedResult: 'Rounded strictly to 2 decimal places ($99.99)',
        status: 'Passed',
        executionTimeMs: 15
      }
    ],
    verification: {
      status: 'VERIFIED IN DEMO',
      totalTests: 5,
      testsPassed: 5,
      testsFailed: 0,
      testsNotRun: 0,
      regressionCoveragePercent: 98,
      readyForDeveloperReview: true,
      verificationNotes: 'All 5 reproduction, unit and regression suites passed. Fix is verified in demo sandbox and ready for developer sign-off.',
      checklist: {
        bugDocumented: true,
        rootCauseReviewed: true,
        fixGenerated: true,
        testsGenerated: true,
        regressionTestsConsidered: true,
        verificationCompleted: true,
        developerApproval: true,
        readyForDeployment: true
      },
      verifiedAt: '2026-09-29T15:45:00Z'
    }
  },
  {
    id: 'BUG-1003',
    title: 'Profile image upload fails with 413 payload error',
    description: 'Uploading images over 2MB causes the profile modal to fail silently with a 413 HTTP error in the network inspector.',
    severity: 'High',
    category: 'Backend / API',
    status: 'Testing',
    createdAt: '2026-09-29T16:00:00Z',
    updatedAt: '2026-09-30T10:15:00Z',
    input: {
      title: 'Profile image upload fails with 413 payload error',
      description: 'Uploading images over 2MB causes the profile modal to fail silently with a 413 HTTP error in the network inspector.',
      expectedBehavior: 'Upload handles images up to 5MB or shows clear client-side validation message for oversized files.',
      actualBehavior: 'Upload spinner spins forever; browser console displays 413 Payload Too Large.',
      environment: 'Production / All Browsers',
      programmingLanguage: 'Node.js / Express'
    },
    analysis: {
      bugId: 'BUG-1003',
      generatedTitle: 'Client/Server body size limit mismatch during multipart file upload',
      category: 'Backend / API',
      severity: 'High',
      priority: 'P1 - Urgent',
      affectedComponent: 'API Gateway / uploadController.ts',
      environment: 'Production / All Browsers',
      problemSummary: 'The backend Express body-parser limit is configured to 1MB while the frontend accepts up to 10MB.',
      expectedBehavior: 'Validation occurs before upload or server handles standard 5MB avatar size.',
      actualBehavior: 'Reverse proxy drops request with 413 before route handler receives file.',
      stepsToReproduce: [
        'Open profile settings.',
        'Choose a 3.5MB PNG file.',
        'Click "Upload Picture".',
        'Observe network tab returning 413.'
      ],
      technicalAnalysis: 'Client lacks pre-upload file.size check, and server body-parser limit is restricted to default 1MB.',
      probableRootCause: 'Probable Cause: Missing client-side file size constraint and overly strict express.json/urlencoded payload limit.',
      aiReasoning: 'Express body parser middleware encounters stream size exceeding 1MB limit prior to Multer processing.',
      confidenceScore: 89,
      possibleDuplicates: [],
      relatedBugs: [],
      analyzedAt: '2026-09-29T16:10:00Z'
    },
    testCases: [
      {
        id: 'TEST-301',
        scenario: 'Reproduction: Oversized 8MB file exceeds 5MB ceiling',
        category: 'Reproduction Test',
        input: 'file: 8.2MB image',
        expectedResult: 'Client validation prevents upload and shows friendly warning',
        status: 'Passed',
        executionTimeMs: 25
      },
      {
        id: 'TEST-302',
        scenario: 'Happy Path: Valid 1.5MB PNG image upload',
        category: 'Happy Path',
        input: 'file: profile.png (1.5MB)',
        expectedResult: 'Uploads successfully to storage, returns 200 OK',
        status: 'Passed',
        executionTimeMs: 45
      }
    ]
  },
  {
    id: 'BUG-1004',
    title: 'Password reset email not received by enterprise users',
    description: 'Users on specific corporate email domains do not receive the automated password recovery link.',
    severity: 'Medium',
    category: 'Authentication',
    status: 'Open',
    createdAt: '2026-09-30T08:00:00Z',
    updatedAt: '2026-09-30T08:30:00Z',
    input: {
      title: 'Password reset email not received by enterprise users',
      description: 'Users on specific corporate email domains do not receive the automated password recovery link.',
      expectedBehavior: 'Password reset email arrives within 2 minutes for all corporate domains.',
      actualBehavior: 'Emails bounce or trigger SPF/DKIM validation failures on Microsoft Exchange servers.'
    }
  },
  {
    id: 'BUG-1005',
    title: 'Dashboard API returns 500 error under high concurrent query load',
    description: 'During peak traffic, GET /api/v1/analytics/metrics fails with 500 Internal Server Error due to pool timeout.',
    severity: 'Critical',
    category: 'Backend / API',
    status: 'Analyzing',
    createdAt: '2026-09-30T11:20:00Z',
    updatedAt: '2026-09-30T11:45:00Z',
    input: {
      title: 'Dashboard API returns 500 error under high concurrent query load',
      description: 'During peak traffic, GET /api/v1/analytics/metrics fails with 500 Internal Server Error due to pool timeout.',
      expectedBehavior: 'Database connections are released back to the pool immediately upon query completion.',
      actualBehavior: 'Connection leaks cause pool exhaustion, throwing ConnectionTimeoutError after 30 seconds.'
    }
  },
  {
    id: 'BUG-1006',
    title: 'Mobile navigation menu overlaps content on small viewports',
    description: 'On devices below 480px width, tapping the navigation drawer causes it to overlay page buttons without closing on tap.',
    severity: 'Low',
    category: 'Frontend / UI',
    status: 'Open',
    createdAt: '2026-09-30T13:00:00Z',
    updatedAt: '2026-09-30T13:00:00Z',
    input: {
      title: 'Mobile navigation menu overlaps content on small viewports',
      description: 'On devices below 480px width, tapping the navigation drawer causes it to overlay page buttons without closing on tap.',
      expectedBehavior: 'Drawer smoothly slides in from right, covers background with backdrop blur, and closes upon link selection.',
      actualBehavior: 'Drawer renders inline with partial opacity, causing text overlap and unclickable buttons.'
    }
  }
];
