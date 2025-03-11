import { RouteRecordRaw } from "vue-router";

import BaseLayout from "@/layouts/base-layout/index.vue";
import Home from "@/pages/home/index.vue";
import AboutUs from "@/pages/aboutUs/index.vue";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: BaseLayout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: Home
      },
      {
        path: "/aboutUs",
        component: AboutUs
      },
     
    ]
  },
  
];

export default routes;
