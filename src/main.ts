import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import '@radial-color-picker/vue-color-picker/dist/vue-color-picker.min.css';
import 'virtual:windi.css';
import TrendChart from "vue-trend-chart";

const app = createApp(App);

app.use(createPinia())
app.use(router);
app.use(TrendChart);
app.mount('#app')
