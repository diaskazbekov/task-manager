export interface IFilter {
  mine?: boolean;
  important?: boolean;
  completed?: boolean;
  deleted?: boolean;
  search?: boolean;
  searchValue?: string;
  tagIds?: number[];
}
