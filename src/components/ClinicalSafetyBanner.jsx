export function ClinicalSafetyBanner({ redFlags = [] }) {
  if (!redFlags.length) return null;

  return (
    <div className="clinical-safety-banners" role="alert">
      {redFlags.map((flag) => (
        <article
          key={flag.title}
          className={`clinical-safety-banner clinical-safety-banner--${flag.level}`}
        >
          <p className="clinical-safety-banner__title">{flag.title}</p>
          <p className="clinical-safety-banner__text">{flag.message}</p>
        </article>
      ))}
    </div>
  );
}
