import { Link } from 'react-router-dom';
import { PrimaryCtaLink } from '@/components/PrimaryCtaLink';

export function NotFoundPage() {
  return (
    <main id="main-content" className="page-container py-24 text-center" tabIndex={-1}>
      <p className="text-label mb-3">404</p>
      <h1 className="font-display text-3xl font-light text-inkwell md:text-4xl">
        Page not found
      </h1>
      <p className="text-body-copy mx-auto mt-4 max-w-md text-dark-stone">
        This route does not exist. Return home or start a clinical analysis.
      </p>
      <div className="btn-row mt-8 justify-center">
        <Link to="/" className="btn-secondary">
          Home
        </Link>
        <PrimaryCtaLink />
      </div>
    </main>
  );
}
