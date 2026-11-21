import { KeyRound, Scale, ShieldCheck, Siren, Users } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { ButtonLink } from '@/components/ui/button';

const PROMISES = [
  {
    icon: ShieldCheck,
    title: 'Never above the legal fare',
    text: 'Every fare is capped at the BRTA ceiling and locked when you book. No haggling at the door.',
  },
  {
    icon: Users,
    title: 'Share the ride, split the cost',
    text: 'Join a car going your way, or let others join yours, and pay less for the same trip.',
  },
  {
    icon: KeyRound,
    title: 'A PIN for every pickup',
    text: 'Your driver starts the trip only with your 4-digit PIN, so you always get into the right car.',
  },
  {
    icon: Siren,
    title: 'SOS in one tap',
    text: 'An alert with your location goes straight to the safety team, on a ride or off it.',
  },
  {
    icon: Scale,
    title: 'Fair to drivers too',
    text: 'Complaints are reviewed by a person, strikes expire after 90 days, and every strike can be appealed.',
  },
];

/** The public landing page. Signed-in users never see it: proxy.ts sends them to their own area. */
export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Log in
          </ButtonLink>
          <ButtonLink href="/register" size="sm">
            Sign up
          </ButtonLink>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 md:grid-cols-[1.2fr_1fr] md:pt-20">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 ring-1 ring-teal-200">
              ভরসা means trust
            </p>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Fair rides across Dhaka, at a price you know before you go.
            </h1>
            <p className="max-w-xl text-lg text-slate-600">
              Book a bike, car or CNG, share a seat with someone going your way, and pay a fare that can never
              exceed the legal ceiling.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/register" size="lg">
                Book your first ride
              </ButtonLink>
              <ButtonLink href="/register?role=DRIVER" variant="secondary" size="lg">
                Drive with Bhorsha
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Dhanmondi 27 → Gulshan 1 · Car · 5.5 km</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Your fare, locked at booking</dt>
                <dd className="font-semibold text-slate-900">Tk 172.50</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">BRTA legal ceiling</dt>
                <dd className="text-slate-900">Tk 238</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">If you share the car</dt>
                <dd className="text-emerald-700">Tk 129.38 (25% off)</dd>
              </div>
            </dl>
            <p className="mt-6 rounded-lg bg-white p-3 text-sm text-slate-600 ring-1 ring-slate-200">
              Your pickup PIN <span className="ml-2 font-mono text-lg font-semibold tracking-[0.3em] text-teal-800">4821</span>
            </p>
            <p className="mt-3 text-xs text-slate-400">Example figures, worked out from the default car fare rule.</p>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
            {PROMISES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="space-y-2">
                <Icon className="size-6 text-teal-700" aria-hidden />
                <h2 className="font-semibold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-8 text-sm text-slate-500">
        <span>Bhorsha · Fair ride-hailing and ride-sharing for Dhaka</span>
        <Link href="/login" className="hover:text-slate-900">
          Staff login
        </Link>
      </footer>
    </div>
  );
}
