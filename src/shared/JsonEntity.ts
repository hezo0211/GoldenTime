export class JsonEntity<T> {
  result = 'entity';
  data = {};
  constructor(data: T) {
    this.data = data;
  }
}
