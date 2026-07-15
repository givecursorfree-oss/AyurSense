import { HOME_FAQ } from '@/data/brand-copy';

export function HomeFaq() {
  return (
    <section
      id="faq"
      className="home-faq section-block scroll-mt-24 border-b border-light-steel"
      aria-labelledby="faq-heading"
    >
      <div className="page-container">
        <h2 id="faq-heading" className="section-heading">
          Straight answers for{' '}
          <span className="section-heading__muted">practitioners</span>
        </h2>

        <div className="home-faq__list mt-10">
          {HOME_FAQ.map((item) => (
            <details key={item.q} className="home-faq__item">
              <summary className="home-faq__summary">{item.q}</summary>
              <p className="home-faq__answer text-body-sm">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
