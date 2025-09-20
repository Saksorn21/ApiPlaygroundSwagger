import 'react-i18next';
import en from '../locales/en.json';
import th from '../locales/th.json';

// สร้าง type จากไฟล์ JSON
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      en: typeof en;
      th: typeof th;
    };
  }
}
