import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';

import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';

const i18n = createI18n({
  locale: 'en',
  messages: {
    pt,
    en,
    es,
  },
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
