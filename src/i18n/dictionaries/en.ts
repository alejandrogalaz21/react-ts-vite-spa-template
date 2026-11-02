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
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
  },
  theme: {
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },
  home: {
    meta: {
      title: 'Lorem Studio · Lorem ipsum dolor sit amet',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
    },
    hero: {
      eyebrow: 'Lorem ipsum',
      title: 'Dolor sit amet, consectetur adipiscing elit',
      lead: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
      primaryCta: 'Contact us',
      secondaryCta: 'Read the blog',
      imageAlt: 'Abstract illustration of geometric shapes',
    },
    features: {
      eyebrow: '01 · Services',
      title: 'Ut enim ad minim veniam',
      lead: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      items: [
        {
          title: 'Lorem ipsum',
          body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
        },
        {
          title: 'Dolor sit',
          body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
        },
        {
          title: 'Amet consectetur',
          body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
        },
        {
          title: 'Adipiscing elit',
          body: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
        },
        {
          title: 'Tempor incididunt',
          body: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.',
        },
        {
          title: 'Magna aliqua',
          body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.',
        },
      ],
    },
    stats: {
      title: 'Lorem in numbers',
      items: [
        { value: '120+', label: 'Lorem ipsum' },
        { value: '98%', label: 'Dolor sit amet' },
        { value: '15', label: 'Consectetur' },
      ],
    },
    cta: {
      title: 'Lorem ipsum dolor sit amet?',
      lead: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.',
      button: 'Write to us',
    },
  },
  about: {
    meta: {
      title: 'About · Lorem Studio',
      description: 'Lorem ipsum dolor sit amet: who we are and how we work.',
    },
    eyebrow: '02 · About',
    title: 'Temporibus autem quibusdam',
    lead: 'Et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint.',
    paragraphs: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.',
      'Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent.',
    ],
    valuesTitle: 'Our values',
    values: [
      { title: 'Curabitur', body: 'Sodales ligula in libero. Sed dignissim lacinia nunc.' },
      { title: 'Vestibulum', body: 'Curabitur tortor. Pellentesque nibh. Aenean quam.' },
      {
        title: 'Maecenas',
        body: 'Mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.',
      },
    ],
  },
  blog: {
    meta: {
      title: 'Blog · Lorem Studio',
      description: 'Lorem ipsum articles about dolor sit amet and consectetur.',
    },
    eyebrow: '03 · Blog',
    title: 'Notes and articles',
    lead: 'Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.',
    readMore: 'Read article',
    publishedOn: 'Published on',
    backToBlog: 'Back to the blog',
    minutesRead: 'min read',
    empty: 'No articles yet.',
  },
  contact: {
    meta: {
      title: 'Contact · Lorem Studio',
      description: 'Write to us: lorem ipsum dolor sit amet.',
    },
    eyebrow: '04 · Contact',
    title: "Let's talk",
    lead: 'Fusce nec tellus sed augue semper porta. We reply within 48 hours.',
    directTitle: 'Direct email',
    form: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send message',
      sending: 'Sending…',
      success: 'Thank you. We received your message and will reply soon.',
      error: 'We could not send the message. Try again in a few minutes.',
      errors: {
        nameRequired: 'Enter your name.',
        emailInvalid: 'Enter a valid email, for example name@domain.com.',
        messageTooShort: 'The message needs at least 20 characters.',
      },
    },
  },
  privacy: {
    meta: {
      title: 'Privacy · Lorem Studio',
      description: 'How we handle your data and how to change your analytics consent.',
    },
    title: 'Privacy notice',
    paragraphs: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. This site only uses analytics if you accept it. Without your consent, measurement is cookieless.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. We never send personal data to third parties.',
    ],
    consentTitle: 'Your consent',
    consentCurrent: 'Current status:',
    consentStates: { granted: 'accepted', denied: 'rejected', unset: 'not decided' },
    resetConsent: 'Ask me again',
  },
  consent: {
    message: 'We use analytics to learn which content is useful. Do you accept measurement cookies?',
    accept: 'Accept',
    reject: 'Reject',
    learnMore: 'Learn more',
  },
  notFound: {
    metaTitle: 'Page not found · Lorem Studio',
    title: 'Page not found',
    body: 'The page you are looking for does not exist or has moved.',
    backHome: 'Go home',
  },
  error: {
    title: 'Something went wrong',
    body: 'An unexpected error occurred. Reload the page or go back home.',
  },
  footer: {
    rights: 'All rights reserved.',
    privacy: 'Privacy',
    version: 'Version',
  },
};
