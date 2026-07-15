/** Skeleton matching clinical report layout while inference runs */
export function ReportSkeleton() {
  return (
    <section
      className="report-panel report-skeleton"
      aria-busy="true"
      aria-label="Generating clinical report"
    >
      <div className="report-panel__shell">
        <div className="report-skeleton__block report-skeleton__title" />
        <div className="report-skeleton__block report-skeleton__line" />
        <div className="report-skeleton__metrics">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="report-skeleton__block report-skeleton__metric" />
          ))}
        </div>
        <div className="report-skeleton__block report-skeleton__section" />
        <div className="report-skeleton__block report-skeleton__section" />
      </div>
      <p className="sr-only">Analysis in progress. Please wait.</p>
    </section>
  );
}
