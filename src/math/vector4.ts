export class Vector4 {
    data: Float32Array;
    constructor(data: number[] = [0, 0, 0, 0]) {
        this.data = new Float32Array(data);
    }
    getMethod() {
        return "uniform4f";
    }
    getData() {
        return [this.data[0], this.data[1], this.data[2], this.data[3]];
    }
    static byteSize: number = 4;
}