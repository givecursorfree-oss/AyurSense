import {
  AYUR_CAPABILITY_CARDS,
  AYUR_CLASSICAL_FORMULATION_CARD,
} from '@/data/capability-cards';

function CapabilityCard({ card }) {
  return (
    <article className="capability-card">
      <div className="capability-card__icon-wrap" aria-hidden="true">
        <img
          className="capability-card__icon"
          src={card.icon.src}
          alt={card.icon.alt}
          width={160}
          height={160}
          loading="lazy"
          decoding="async"
        />
      </div>
      <h3 className="capability-card__title">{card.title}</h3>
      <p className="capability-card__description">{card.description}</p>
    </article>
  );
}

function ClassicalFormulationCard({ card }) {
  return (
    <article className="capability-card capability-card--featured">
      <p className="capability-card__badge">{card.badge}</p>
      <div className="capability-card__featured-body">
        <div
          className="capability-card__icon-wrap capability-card__icon-wrap--featured"
          aria-hidden="true"
        >
          <img
            className="capability-card__icon capability-card__icon--featured"
            src={card.icon.src}
            alt={card.icon.alt}
            width={180}
            height={180}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="capability-card__featured-copy">
          <h3 className="capability-card__title capability-card__title--featured">
            {card.title}
          </h3>
          <p className="capability-card__description capability-card__description--featured">
            {card.description}
          </p>
          <ul className="capability-card__highlights" aria-label="Classical text sources">
            {card.highlights.map((label) => (
              <li key={label}>
                <span className="capability-card__highlight">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function CapabilityCards({
  cards = AYUR_CAPABILITY_CARDS,
  featuredCard = AYUR_CLASSICAL_FORMULATION_CARD,
}) {
  return (
    <div className="capability-cards page-container pb-6 md:pb-8">
      <ul className="capability-cards__grid" role="list">
        {cards.map((card) => (
          <li key={card.id}>
            <CapabilityCard card={card} />
          </li>
        ))}
      </ul>

      {featuredCard && (
        <div className="capability-cards__featured">
          <ClassicalFormulationCard card={featuredCard} />
        </div>
      )}
    </div>
  );
}
