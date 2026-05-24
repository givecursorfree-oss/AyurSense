import { Link } from 'react-router-dom';

export function Breadcrumbs({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="breadcrumbs__item">
              {index > 0 && (
                <span className="breadcrumbs__sep" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.to ? (
                <span
                  className="breadcrumbs__current"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="breadcrumbs__link">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
