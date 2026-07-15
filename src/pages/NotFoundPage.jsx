import { Link } from 'react-router-dom';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';
import { usePageMeta } from '@/hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta({
    title: 'Page not found',
    description: 'This AyurSense route does not exist. Return home or start a patient intake.',
    path: '/404',
  });

  return (
    <main id="main-content" className="page-container py-24 text-center" tabIndex={-1}>
      <p className="text-label mb-3">404</p>
      <h1 className="font-display text-3xl font-light text-inkwell md:text-4xl">
        Page not found
      </h1>
      <p className="text-body-copy mx-auto mt-4 max-w-md text-dark-stone">
        This route does not exist. Return home or start a patient intake.
      </p>
      <div className="btn-row mt-8 justify-center">
        <Link to="/" className="btn-secondary">
          Home
        </Link>
        <PrimaryCtaLink variant="simple" />
      </div>
    </main>
  );
}
