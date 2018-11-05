export class Vector3 {
    data: Float32Array;
    constructor(data: number[] = [0, 0, 0]) {
        this.data = new Float32Array(data);
    }
    normalize() {
        var v = this.data;
        var c = v[0], d = v[1], e = v[2], g = Math.sqrt(c * c + d * d + e * e);
        if (g) {
            if (g == 1)
                return this;
        } else {
            v[0] = 0; v[1] = 0; v[2] = 0;
            return this;
        }
        g = 1 / g;
        v[0] = c * g; v[1] = d * g; v[2] = e * g;
        return this;
    }
    getMethod() {
        return "uniform3f";
    }
    getData() {
        return [this.data[0], this.data[1], this.data[2]];
    }
    static byteSize: number = 3;
}