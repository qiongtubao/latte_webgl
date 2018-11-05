export class Vector1 {
  data: number;
  constructor(data: number) {
    this.data = data;
  }
  getMethod() {
    return parseInt(this.data + "") === this.data ? "uniform1i" : "uniform1f";
  }
  getData() {
    return [this.data];
  }
  static byteSize: number = 1;
}