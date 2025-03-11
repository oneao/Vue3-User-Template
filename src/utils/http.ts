import axiosInstance from "@/interceptors/http";

type Response<T = unknown> = {
  code: number;
  message: string;
  data: T;
};
export function httpGet<T>(url: string, params?: Record<string, any>): Promise<Response<T>> {
  return axiosInstance.get(url, { params });
}
export function httpPostJson<T>(url: string, data?: Record<string, any>): Promise<Response<T>> {
  return axiosInstance.post(url, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export function httpPostForm<T>(url: string, data?: any): Promise<Response<T>> {
  return axiosInstance.post(url, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}
