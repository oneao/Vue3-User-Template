import { httpGet } from "@/utils/http";

export interface AreaType {
  label: string;
  value: number;
  children?: AreaType[];
}

export const getAreaTreeDataApi = () => {
  return httpGet<AreaType[]>(`/area/getTreeData`);
};
