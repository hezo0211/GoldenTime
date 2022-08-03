export class JsonCollection<T> {
  result = 'collection';
  data = [];
  offset = 0;
  limit = 0;
  total = 0;

  constructor(data: T[]) {
    this.data = data;
  }

  setOffset(offset: number) {
    this.offset = offset;
    return this;
  }
  setLimit(limit: number) {
    this.limit = limit;
    return this;
  }
  setTotal(total: number) {
    this.total = total;
    return this;
  }
}
