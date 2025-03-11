export function toJson(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error("JSON 转换失败", error);
    return "";
  }
}
export function toObject<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error("JSON 解析失败", error);
    return null;
  }
}
