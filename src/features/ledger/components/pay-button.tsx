/**
 * "Pay with bKash" for a booked seat: POST /rides/{id}/payment, then send the
 * browser to the checkout URL. Make one Idempotency-Key when the rider clicks and
 * reuse it on retry, so a double click can't start two payments.
 *
 * TODO(step 4).
 */
export function PayButton() {
  return null;
}
