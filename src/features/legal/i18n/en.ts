import type { LegalText } from './es';

/** English texts of the legal feature. */
export const en: LegalText = {
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
    consentCurrent: 'Current status:',
    consentStates: { granted: 'accepted', denied: 'rejected', unset: 'not decided' },
    resetConsent: 'Ask me again',
  },
};
