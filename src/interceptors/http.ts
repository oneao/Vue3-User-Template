import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { Message } from "@arco-design/web-vue";
import { useRouterStore } from "@/store/router";
import { useUserStore } from "@/store/user";

const buildBaseUrl = () => {
  const isProxy = import.meta.env.VITE_APP_PROXY === "Y";
  const mode = import.meta.env.MODE;
  const proxyPrefix = import.meta.env.VITE_APP_PROXY_PREFIX;

  const baseURL = import.meta.env.VITE_SERVER_BASEURL;

  if (mode === "prod") {
    if (isProxy) {
      return baseURL + proxyPrefix;
    } else {
      return baseURL;
    }
  } else {
    if (isProxy) {
      return proxyPrefix;
    } else {
      return baseURL;
    }
  }
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: buildBaseUrl(),
  timeout: 0
});

type Response<T = unknown> = {
  code: number;
  message: string;
  data: T;
};

enum ResponseStatus {
  SUCCESS = 200,
  ERROR = 500,
  UNAUTHORIZED = 401,
  RESOURCE_CREATED_SUCCESS = 201,
  RESOURCE_CREATED_ERROR = 409
}

enum ErrorStatusMessage {
  NO_LOGIN = "尚未登录，请先登录！"
}

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    const noFreePaths = ["/imMessage/**"];
    const path = config.url || "";

    const needAuth = noFreePaths.some((pattern) => {
      const regex = new RegExp(
        pattern
          .replace(/(\/\*\*)/g, "(/.*)?")
          .replace(/(\/\*)/g, "(/[^/]*)?")
          .replace(/\./g, "\\.") + "$"
      );
      return regex.test(path);
    });

    if (needAuth) {
      userStore.clearUserInfo();
      return Promise.reject(new Error("尚未登录，请先登录！"));
    }

    // 如果 token 存在，添加到请求头
    config.headers["Authorization"] = `Bearer ${userStore.userInfo.token}`;
    config.headers["id"] = userStore.userInfo.id;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 判断响应是否为文件下载类型（例如 application/octet-stream）
    const isDownload = isDownloadResponse(response.headers);
    // 如果是文件下载，直接返回响应数据，不做其他处理
    if (isDownload) {
      return response;
    }

    // 如果不是文件下载，继续进行错误处理和数据解析
    if (response.status !== 200) {
      Message.error("请求错误");
      return Promise.reject();
    }

    const resData = response.data as Response;

    // 解析返回数据中的字段
    response.data.data = parseJsonOrReturnString(response.data.data);

    const routerStore = useRouterStore();
    const userStore = useUserStore();

    if (resData.code >= 200 && resData.code < 300) {
      return Promise.resolve(response.data);
    } else if (resData.code >= 400 && resData.code <= 500) {
      Message.error(resData.message || "请求错误");
      switch (resData.code) {
        case ResponseStatus.UNAUTHORIZED:
          if (routerStore.getCurrentPath() !== "/login") {
            userStore.clearUserInfo();
            routerStore.toPath("/login");
          }
      }
      return Promise.reject(resData);
    } else {
      Message.error(resData.message || "请求错误");
      return Promise.reject(resData);
    }
  },
  (error: AxiosError) => {
    // 网络错误处理
    switch (error.message) {
      case ErrorStatusMessage.NO_LOGIN:
        Message.error(ErrorStatusMessage.NO_LOGIN);
        break;
      default:
        // 其他情况提示网络错误
        Message.error("网络错误，请换个网络试试！");
    }
  }
);

function isDownloadResponse(headers: any): boolean {
  const contentType = headers["content-type"];
  return /application\/(octet-stream|force-download|pdf|vnd.ms-excel|msexcel|OCTET-STREAM)/.test(contentType || "");
}

function parseJsonOrReturnString(input: any) {
  try {
    // 尝试解析输入字符串
    return JSON.parse(input); // 如果成功，返回解析后的内容
  } catch {
    // 如果解析失败，则返回原始字符串
    return input;
  }
}

export default axiosInstance;
