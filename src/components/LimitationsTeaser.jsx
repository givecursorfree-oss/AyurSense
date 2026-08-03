import { Link } from 'react-router-dom';
import { LIMITATIONS_SHORT, SCOPE_CAVEAT } from '@/data/brand-copy';
import { IconChevronRight } from '@/components/icons';

export function LimitationsTeaser() {
  return (
    <section
      id="trust"
      className="limitations-teaser section-block scroll-mt-24 border-b border-light-steel bg-canvas"
      aria-labelledby="trust-heading"
    >
      <div className="page-container">
        <p className="text-label mb-3">Trust</p>
        <h2 id="trust-heading" className="section-heading">
          Clear about what AyurSense{' '}
          <span className="section-heading__muted">does not claim</span>
        </h2>
        <p className="section-lede">{SCOPE_CAVEAT}</p>

        <ul className="limitations-teaser__grid mt-10">
          {LIMITATIONS_SHORT.map((item) => (
            <li key={item.title} className="limitations-teaser__card">
              <h3 className="limitations-teaser__title">{item.title}</h3>
              <p className="limitations-teaser__body text-body-sm">{item.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link to="/limitations" className="btn-secondary">
            Full limitations and ethics
            <IconChevronRight size={16} className="btn-icon" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
