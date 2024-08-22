import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import "./assets/css/home.css";
import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

// ElementPlus
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// ElementPlus

app.mount("#app");
