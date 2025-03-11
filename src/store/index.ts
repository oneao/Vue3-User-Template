import type { App } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate"; // 数据持久化

export function setupPinia(app: App) {
  const store = createPinia();
  store.use(createPersistedState());
  app.use(store);
}
