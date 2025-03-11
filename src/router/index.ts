import type { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach((to, from, next) => {
  window.NProgress?.start?.();

  next();
});

router.afterEach(() => {
  window.NProgress?.done?.();
});

export function setupRouter(app: App) {
  app.use(router);
}
