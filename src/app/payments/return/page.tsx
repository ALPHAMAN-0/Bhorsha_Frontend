import { PageHeader } from '@/components/layout/page-header';

/**
 * bKash sends the payer back here (PAYMENT_RETURN_URL on the backend). The page
 * calls POST /payments/{id}/confirm, and the backend asks bKash for the real
 * status, so the query string is only a hint. Then it shows PaymentResult, with a
 * link to the ride (rider) or to /driver/earnings (driver).
 *
 * Every logged-in role can open it: add '/payments/:path*' to the matcher in
 * src/proxy.ts. If the 15-minute token expires while paying, the proxy sends the
 * payer to /login and keeps the query string in ?next=, so the payment isn't lost.
 *
 * TODO(step 4): read the query string inside <Suspense> (Cache Components) and
 * render PaymentResult.
 */
export default function PaymentReturnPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <PageHeader title="Payment" description="Not built yet." />
    </main>
  );
}
