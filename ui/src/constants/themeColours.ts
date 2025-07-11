import i18n from 'i18next';


export const themeColors = () => [
  {
    id: 1,
    name: i18n.t('account.preferenceTab.blue'),
    code: '#1259FF',
    background: '#EEF3FF',
    image: 'https://app-background.s3.us-east-1.amazonaws.com/BG+3.webp',
  },
  {
    id: 2,
    name: i18n.t('account.preferenceTab.red'),
    code: '#D7355C',
    background: '#FDEDF1',
    image: 'https://app-background.s3.us-east-1.amazonaws.com/BG+5.webp',
  },
  {
    id: 3,
    name: i18n.t('account.preferenceTab.green'),
    code: '#5EAC4A',
    background: '#EAFEE4',
    image: 'https://app-background.s3.us-east-1.amazonaws.com/BG+1.webp',
  },
  {
    id: 4,
    name: i18n.t('account.preferenceTab.purple'),
    code: '#8C60A2',
    background: '#F8F0FC',
    image: 'https://app-background.s3.us-east-1.amazonaws.com/BG+7.webp',
  },
  {
    id: 5,
    name: i18n.t('account.preferenceTab.brown'),
    code: '#AF4A1A',
    background: '#FDEEE7',
    image: 'https://app-background.s3.us-east-1.amazonaws.com/BG+8.webp',
  },
  {
    id: 6,
    name: i18n.t('account.preferenceTab.orange'),
    code: '#F17E11',
    background: '#FDEEE7',
    image: 'https://app-background.s3.us-east-1.amazonaws.com/BG+4.webp',
  },
];

export const DEFAULT_COLOR= '#5EAC4A';