import type { ReactNode } from 'react';

import './section-header.css';

export interface SectionHeaderProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  lead?: ReactNode;
  /** `h1` on the page that owns the section, `h2` everywhere else. One h1 per page. */
  as?: 'h1' | 'h2';
  /** Id of the heading, for `aria-labelledby` on the surrounding `<section>`. */
  id?: string;
  align?: 'start' | 'center';
}

/** Eyebrow, heading and lead paragraph that open a section. */
export function SectionHeader({
  title,
  eyebrow,
  lead,
  as: Heading = 'h2',
  id,
  align = 'start',
}: SectionHeaderProps) {
  return (
    <header className={`section-header section-header--${align}`}>
      {eyebrow && <p className="section-header__eyebrow text-eyebrow">{eyebrow}</p>}
      <Heading id={id} className={Heading === 'h1' ? 'text-display' : 'text-h2'}>
        {title}
      </Heading>
      {lead && <p className="section-header__lead text-lead">{lead}</p>}
    </header>
  );
}
