import { PageHeader } from '@/components/layout/page-header';

/**
 * The driver's earnings and dues (GET /drivers/me/earnings): EarningsSummary,
 * LedgerEntriesTable, and SettleDuesButton while dues are above zero.
 *
 * TODO(step 2): summary and entries. TODO(step 5): settling dues.
 * Add an "Earnings" item to the driver menu in components/layout/nav-config.ts.
 */
export default function DriverEarningsPage() {
  return <PageHeader title="Earnings" description="Not built yet." />;
}
