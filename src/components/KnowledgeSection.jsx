import { Link } from 'react-router-dom';
import { IconChevronRight } from '@/components/icons';

export function KnowledgeSection() {
  return (
    <section
      id="knowledge"
      className="knowledge-section section-block scroll-mt-24 border-b border-light-steel bg-canvas"
      aria-labelledby="knowledge-heading"
    >
      <div className="page-container">
        <p className="text-label mb-3">Classical knowledge</p>
        <h2 id="knowledge-heading" className="section-heading">
          Citation-backed formulations,{' '}
          <span className="section-heading__muted">not generic herb lists</span>
        </h2>
        <p className="section-lede">
          V9.2 matches formulations with grantha references and grounds herbs
          in rasa, virya, and vipaka for practitioner review.
        </p>

        <div className="mt-8">
          <Link to="/model" className="btn-secondary">
            Read V9.2 model overview
            <IconChevronRight size={16} className="btn-icon" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
