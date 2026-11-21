/**
 * Mirrors the backend's ledger module (bhorsha/src/modules/ledger): payments,
 * driver earnings and dues. Amounts are Tk; show them with formatTk (lib/format.ts).
 * The build steps in the TODOs are listed in the backend's ledger.module.ts.
 *
 * Planned calls, all through lib/api/client.ts:
 *   startRidePayment(rideId)    POST /rides/{id}/payment          Idempotency-Key
 *   confirmPayment(id, input)   POST /payments/{id}/confirm       Idempotency-Key
 *   getPayment(id)              GET  /payments/{id}
 *   myPayments(query)           GET  /payments/my
 *   listPayments(query)         GET  /payments                    Support+
 *   refundPayment(id, input)    POST /payments/{id}/refund        Support+, Idempotency-Key
 *   getEarnings(cursor)         GET  /drivers/me/earnings
 *   settleDues()                POST /drivers/me/dues/settle      Idempotency-Key
 *
 * The gateway (app/api/v1/[...path]/route.ts) forwards only accept, content-type
 * and authorization today, so it must also forward Idempotency-Key.
 *
 * TODO(step 4): write them once the backend routes exist.
 */
export {};
