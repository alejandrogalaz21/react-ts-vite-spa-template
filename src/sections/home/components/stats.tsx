import { useI18n } from '~/i18n';

import './stats.css';

/** Three headline numbers. A `<dl>`: each value is described by its label. */
export function Stats() {
  const { t } = useI18n();
  const copy = t.home.stats;

  return (
    <section className="section" aria-labelledby="stats-title">
      <div className="container">
        <h2 id="stats-title" className="visually-hidden">
          {copy.title}
        </h2>
        <dl className="stats">
          {copy.items.map((item) => (
            <div key={item.label} className="stats__item">
              <dt className="stats__label">{item.label}</dt>
              <dd className="stats__value">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
