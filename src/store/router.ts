import { defineStore } from "pinia";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
export const useRouterStore = defineStore("router", () => {
  const route = useRoute();
  const router = useRouter();

  const getCurrentPath = () => {
    return route.path;
  };
  const toPath = (path: string) => {
    router.push(path);
  };
  return {
    getCurrentPath,
    toPath,
  };
});
