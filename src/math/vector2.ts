export class Vector2 {
    data: Float32Array;
    constructor(data: number[] = [0, 0]) {
        this.data = new Float32Array(data);
    }
    getMethod() {
        return "uniform2f";
    }
    getData() {
        return this.data;
    }
    static byteSize: number = 2;
}