import { Link } from 'react-router-dom';
import { PIPELINE_STEPS } from '@/data/brand-copy';
import { IconChevronRight } from '@/components/icons';

export function PipelineOverview() {
  return (
    <section
      id="pipeline"
      className="pipeline-overview section-block border-b border-light-steel scroll-mt-24"
      aria-labelledby="pipeline-heading"
    >
      <div className="page-container">
        <div className="section-header flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="pipeline-heading" className="section-heading">
              Five stages to a{' '}
              <span className="section-heading__muted">reviewable report</span>
            </h2>
            <p className="section-lede">
              From intake text through clinical analysis, formulation matching,
              and safety screening.
            </p>
          </div>
          <Link to="/model" className="btn-secondary shrink-0 self-start sm:self-auto">
            Model overview
            <IconChevronRight size={16} className="btn-icon" aria-hidden />
          </Link>
        </div>

        <ol className="pipeline-overview__list">
          {PIPELINE_STEPS.map((item) => (
            <li key={item.step} className="pipeline-overview__item">
              <span className="pipeline-overview__step font-data">{item.step}</span>
              <h3 className="pipeline-overview__title">{item.title}</h3>
              <p className="pipeline-overview__body text-body-sm">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
