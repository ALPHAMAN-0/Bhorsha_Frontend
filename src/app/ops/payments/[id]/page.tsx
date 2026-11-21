import { PageHeader } from '@/components/layout/page-header';

/**
 * One payment for Support and Admin (GET /payments/{id}): its status, its ledger
 * entries and the RefundDialog.
 *
 * TODO(step 4): read params.id inside <Suspense>; with Cache Components, params are
 * runtime data. TODO(step 5): the refund.
 */
export default function OpsPaymentPage() {
  return (
    <PageHeader
      title="Payment"
      description="Not built yet."
      back={{ href: '/ops/payments', label: 'All payments' }}
    />
  );
}
