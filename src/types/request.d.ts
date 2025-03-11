interface BasePageParams {
  page: number;
  pageSize: number;
}

interface BasePageResult<T> {
  total: number; // 总条数
  record: T[]; // 当前页数据列表
}
