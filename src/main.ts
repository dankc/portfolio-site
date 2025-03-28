import '@/styles/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVueMatomo } from 'vue3-matomo';

import App from './App.vue';
import router from './router';

const isDev = process.env.NODE_ENV === 'development';

const app = createApp(App);

app.use(
  createVueMatomo({
    host: 'https://kiser.codes/analytics/',
    siteId: 1,
    router,
    enableLinkTracking: true,
    disableCookies: true,
    enableHeartBeatTimer: true,
    heartBeatTimerInterval: 10,
    debug: isDev,
  })
);

app.use(createPinia());
app.use(router);

app.mount('#app');
