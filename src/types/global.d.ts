import { AdminStatusEnum } from "@/types/enums"

declare global {
  interface Window {
    /** NProgress instance */
    NProgress?: import("nprogress").NProgress
    // $message?: import("@arco-design/web-vue/es/Message/interface").MessageMethod;
  }

  /** Build time of the project */
  const BUILD_TIME: string

  type IUserInfo = {
    id: string
    account?: string
    email?: string
    name?: string
    token?: string
    avatar?: string
  }

  type IResData<T = unknown> = {
    code: number
    message: string
    data: T
  }
}

export {} // 确保 TypeScript 将此文件视为模块，防止全局污染
