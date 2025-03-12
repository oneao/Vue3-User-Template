import axiosInstance from "@/interceptors/http";


export function httpGet<T>(url: string, params?: Record<string, any>): Promise<IResData<T>> {
  return axiosInstance.get(url, { params });
}
export function httpPostJson<T>(url: string, data?: Record<string, any>): Promise<IResData<T>> {
  return axiosInstance.post(url, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export function httpPostForm<T>(url: string, data?: any): Promise<IResData<T>> {
  return axiosInstance.post(url, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}
