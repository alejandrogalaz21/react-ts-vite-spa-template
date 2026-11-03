import type { Dictionary } from './es';

/** English dictionary. Typed with `Dictionary`, so it must mirror every key of `es`. */
export const en: Dictionary = {
  nav: {
    skipToContent: 'Skip to content',
    primary: 'Main navigation',
    home: 'Home',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    services: 'Services',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
  },
  theme: {
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },
  consent: {
    title: 'Your consent',
    message: 'We use analytics to learn which content is useful. Do you accept measurement cookies?',
    accept: 'Accept',
    reject: 'Reject',
    learnMore: 'Learn more',
  },
  footer: {
    rights: 'All rights reserved.',
    privacy: 'Privacy',
    version: 'Version',
  },
};
