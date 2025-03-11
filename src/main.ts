import { createApp } from "vue";
import "./plugins/assets";
import { setupNProgress } from "./plugins/index";
import { setupPinia } from "./store";
import { setupRouter } from "./router/index";
import App from "./App.vue";

async function setupApp() {
  setupNProgress();

  const app = createApp(App);
  setupPinia(app);
  setupRouter(app);
  app.mount("#app");
}

setupApp();
