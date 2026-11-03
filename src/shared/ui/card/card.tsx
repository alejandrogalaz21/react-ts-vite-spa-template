import type { ReactNode } from 'react';

import './card.css';

export interface CardProps {
  title: ReactNode;
  children?: ReactNode;
  /** Optional meta line above the title (date, category). */
  meta?: ReactNode;
  /** Actions or links under the body. */
  footer?: ReactNode;
  /** Heading level of the title, to keep the outline correct where the card is used. */
  headingLevel?: 2 | 3 | 4;
}

/** Content card: meta, title, body and footer on a raised surface. */
export function Card({ title, children, meta, footer, headingLevel = 3 }: CardProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article className="card">
      {meta && <p className="card__meta">{meta}</p>}
      <Heading className="card__title text-h3">{title}</Heading>
      {children && <div className="card__body">{children}</div>}
      {footer && <div className="card__footer">{footer}</div>}
    </article>
  );
}
