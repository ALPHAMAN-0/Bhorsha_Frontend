'use client';

import { useMutation } from '@tanstack/react-query';
import { Siren } from 'lucide-react';
import { useState } from 'react';
import { Alert, ErrorAlert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { formatDateTime } from '@/lib/format';
import { currentPosition } from '@/lib/geo';
import { sendRideSos, sendSos } from '../api';

/**
 * Emergency button. Sends the device location (when the browser allows it) to
 * the safety team, about a ride when `rideId` is given.
 */
export function SosButton({ rideId, size = 'sm' }: { rideId?: number; size?: 'sm' | 'md' }) {
  const [open, setOpen] = useState(false);
  const sos = useMutation({
    mutationFn: async () => {
      const position = (await currentPosition()) ?? {};
      return rideId ? sendRideSos(rideId, position) : sendSos(position);
    },
  });

  function close() {
    setOpen(false);
    sos.reset();
  }

  return (
    <>
      <Button variant="danger" size={size} onClick={() => setOpen(true)}>
        <Siren className="size-4" aria-hidden />
        SOS
      </Button>
      <Dialog
        open={open}
        onClose={close}
        title={sos.isSuccess ? 'SOS sent' : rideId ? `Send an SOS about ride #${rideId}?` : 'Send an SOS?'}
        footer={
          sos.isSuccess ? (
            <Button onClick={close}>Close</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={close} disabled={sos.isPending}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => sos.mutate()} loading={sos.isPending}>
                Send SOS now
              </Button>
            </>
          )
        }
      >
        {sos.isSuccess ? (
          <Alert tone="success" title={`Sent to ${sos.data.sent_to}`}>
            The safety team got your alert at {formatDateTime(sos.data.sent_at)}
            {sos.data.lat !== null ? ' with your location.' : ' (your location was not available).'} If you are in
            danger right now, also call <strong>999</strong>.
          </Alert>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Bhorsha&apos;s safety team is emailed at once with your current location
              {rideId ? ' and this ride' : ''}. Your browser may ask for permission to share the location.
            </p>
            <ErrorAlert error={sos.error} />
          </>
        )}
      </Dialog>
    </>
  );
}
