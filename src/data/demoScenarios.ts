import { BugInput } from '@/types';

export interface DemoScenario {
  id: string;
  name: string;
  buttonLabel: string;
  tagline: string;
  category: string;
  input: BugInput;
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'checkout-bug',
    name: 'Checkout Bug (Hackathon Primary)',
    buttonLabel: 'Checkout Bug',
    tagline: 'Item removal + coupon recalculation triggers TypeError: undefined reading "price"',
    category: 'Payment / Cart',
    input: {
      title: 'Checkout crashes after cart item removal and coupon application',
      description: 'When I remove an item from the cart and then apply a coupon, checkout crashes.',
      expectedBehavior: 'The coupon discount should be applied to the remaining items in the cart and the total should recalculate smoothly.',
      actualBehavior: 'The application crashes immediately upon clicking "Apply Coupon", showing a blank screen with TypeError in the browser console.',
      environment: 'Staging / Chrome 124 / macOS',
      browser: 'Chrome 124',
      os: 'macOS Sonoma',
      programmingLanguage: 'TypeScript',
      relevantCode: `export function applyCouponToCart(cart: CartState, coupon: Coupon): CartTotal {
  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (cart.items[0].price * coupon.percentage) / 100;
  return { subtotal, discountAmount, finalTotal: subtotal - discountAmount };
}`,
      errorLogs: `Uncaught TypeError: Cannot read properties of undefined (reading 'price')
    at applyCouponToCart (calculateCartTotal.ts:4:32)
    at CheckoutSummary.tsx:48:15`
    }
  },
  {
    id: 'login-bug',
    name: 'Login Bug',
    buttonLabel: 'Login Bug',
    tagline: 'Expired session locks the Login button into an unrecoverable loading state',
    category: 'Authentication',
    input: {
      title: 'Login button unresponsive and freezes in loading state on expired token',
      description: 'When user session expires in the background, clicking the Login button results in an infinite spinner and no navigation occurs.',
      expectedBehavior: 'Login failure should reset the button and display a clear error message.',
      actualBehavior: 'Button remains disabled forever; no visual feedback is given to the user.',
      environment: 'Production / Windows 11 / Firefox',
      browser: 'Firefox 125',
      os: 'Windows 11',
      programmingLanguage: 'TypeScript / React',
      relevantCode: `const handleLogin = async (creds) => {
  setLoading(true);
  await api.login(creds);
  navigate('/dashboard');
};`,
      errorLogs: 'AxiosError: 401 Unauthorized at tokenInterceptor.ts:24 - Uncaught (in promise)'
    }
  },
  {
    id: 'api-500-error',
    name: 'API 500 Error',
    buttonLabel: 'API 500 Error',
    tagline: 'High concurrency queries cause 500 Internal Server Error timeout',
    category: 'Backend / API',
    input: {
      title: 'Dashboard API returns 500 Internal Server Error under concurrent query load',
      description: 'During peak morning reporting hours, the analytics dashboard throws 500 Internal Server Error due to pool timeout.',
      expectedBehavior: 'Queries should acquire pooled DB connections safely and release them within 200ms.',
      actualBehavior: 'DB pool runs out of connections and times out after 30,000ms.',
      environment: 'AWS ECS / PostgreSQL 15',
      programmingLanguage: 'Node.js / Prisma',
      relevantCode: `export async function getDashboardMetrics(req, res) {
  const client = await dbPool.connect();
  const data = await client.query('SELECT * FROM metrics');
  // Missing client.release() in error/early returns!
  return res.json(data.rows);
}`,
      errorLogs: 'Error: Connection pool timeout (30000ms exceeded). Max pool ceiling: 20'
    }
  },
  {
    id: 'image-upload-bug',
    name: 'Image Upload Bug',
    buttonLabel: 'Image Upload Bug',
    tagline: 'Uploading standard photos triggers silent 413 error and hangs UI',
    category: 'Backend / API',
    input: {
      title: 'Profile avatar upload fails silently with 413 Payload Too Large',
      description: 'Uploading images over 2MB causes the profile modal to fail silently with a 413 HTTP error in the network inspector.',
      expectedBehavior: 'Photos up to 5MB should upload cleanly, or a client warning should prompt the user to compress.',
      actualBehavior: 'Upload hangs indefinitely; network inspector shows 413 Payload Too Large.',
      environment: 'Production / iOS Safari & Android Chrome',
      browser: 'Safari Mobile 17',
      os: 'iOS 17',
      programmingLanguage: 'Node.js / Express',
      relevantCode: `app.use(express.json({ limit: '1mb' }));
app.post('/api/upload', uploadMiddleware, handleUpload);`,
      errorLogs: 'PayloadTooLargeError: request entity too large at readStream (body-parser/index.js)'
    }
  },
  {
    id: 'mobile-ui-bug',
    name: 'Mobile UI Bug',
    buttonLabel: 'Mobile UI Bug',
    tagline: 'Navigation drawer collides with page content on small screens',
    category: 'Frontend / UI',
    input: {
      title: 'Mobile navigation menu overlaps content on small viewports',
      description: 'On devices below 480px width, tapping the navigation drawer causes it to overlay page buttons without closing on tap.',
      expectedBehavior: 'Drawer smoothly slides in from right, covers background with backdrop blur, and closes upon link selection.',
      actualBehavior: 'Drawer renders inline with partial opacity, causing text overlap and unclickable buttons.',
      environment: 'Mobile / iPhone 15 Pro / iOS Safari',
      browser: 'Safari Mobile',
      os: 'iOS 17',
      programmingLanguage: 'React / Tailwind CSS',
      relevantCode: `<div className="relative overflow-hidden">
  {isOpen && <MobileMenu className="absolute top-0 z-10" />}
</div>`,
      errorLogs: 'Warning: Stacking context clipped by overflow-hidden on parent container'
    }
  }
];
