module Matrix {

    export interface IMatrix<T> {
        rows: number;
        columns: number;
        getValue(row: number, column: number): T;
        setValue(row: number, column: number, value: T);
    }

    export class DefaultMatrix<T> implements IMatrix<T> {
        private _rows: number;
        private _columns: number;
        private _data: T[][] = [];
        constructor(rows: number = 1, columns: number = 1) {
            this._rows = rows;
            this._columns = columns;
            for (var i = 0; i < rows; i++) {
                var c = [];
                for (var j = 0; j < columns; j++) {
                    c.push(this.defaultValue(i, j));
                }
                this._data.push(c);
            }

        }
        protected defaultValue(row: number, column: number): T { return undefined; }
        get rows() { return this._rows; }
        get columns() { return this._columns; }
        getValue(row: number, column: number): T {
            return this._data[row][column];
        }
        setValue(row: number, column: number, value: T) {
            this._data[row][column] = value;
        }
        public toString() {
            var r = "";
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (j != 0) {
                        r += "\t";
                    }
                    r += this.getValue(i, j);
                }
                r += "\n";
            }
            return r;
        }
    }

    export class NumberMatrix extends DefaultMatrix<number> {
        protected defaultValue(row: number, column: number): number { return 0; }
    }

    export interface MatrixCreator<T extends NumberMatrix> { (rows: number, columns: number): T };

    export function compose<T1 extends NumberMatrix, T2 extends NumberMatrix, T3 extends NumberMatrix>
            (a: T1, b: T2, creator: MatrixCreator<T3>): T3 {
        var rows: number = a.rows;
        var columns: number = b.columns;
        var range: number = a.columns;

        if (a.columns != b.rows) {
            throw new RangeError("Matrices cannot be composed: (" + a.rows + ", " + a.columns + ") x (" + b.rows + ", " + b.columns + ")");
        }

        var r: T3 = creator(rows, columns);
        for (var i: number = 0; i < rows; i++) {
            for (var j: number = 0; j < columns; j++) {
                var v: number = 0;
                for (var k: number = 0; k < range; k++) {
                    v += (a.getValue(i, k) * b.getValue(k, j));
                }
                r.setValue(i, j, v);
            }
        }
        return r;
    }

    // http://web.cse.ohio-state.edu/~parent/classes/581/Lectures/5.2DtransformsAhandout.pdf
    export class Matrix2D extends NumberMatrix {
        constructor() { super(3, 3); this.setValue(2, 2, 1); }
        protected defaultValue(row: number, column: number): number {
            if (row == column) {
                return 1;
            } else {
                return super.defaultValue(row, column);
            }
        }
        public get a(): number { return this.getValue(0, 0); }
        public get b(): number { return this.getValue(1, 0); }
        public get c(): number { return this.getValue(0, 1); }
        public get d(): number { return this.getValue(1, 1); }
        public get e(): number { return this.getValue(0, 2); }
        public get f(): number { return this.getValue(1, 2); }
    }
    
    export function compose2D (a: Matrix2D, b: Matrix2D): Matrix2D {
        return compose(a, b, function (rows: number, columns: number): Matrix2D { return new Matrix2D(); });
    }

    export class Point2D extends NumberMatrix {
        constructor(x: number = 0, y: number = 0) {
            super(3, 1);
            this.setValue(0, 0, x);
            this.setValue(1, 0, y);
            this.setValue(2, 0, 1);
        }
        get x (): number { return this.getValue(0, 0); }
        get y (): number { return this.getValue(1, 0); }
    }
    
    export function apply2D (a: Matrix2D, p: Point2D): Point2D {
        return compose(a, p, function (rows: number, columns: number): Point2D { return new Point2D(); });
    }

    export function translation(dx: number, dy: number): Matrix2D {
        var r: Matrix2D = new Matrix2D();
        r.setValue(0, 2, dx);
        r.setValue(1, 2, dy);
        return r;
    }

    export function rotation(x: number, y: number, phi: number): Matrix2D {
        var a:Matrix2D = translation(-x, -y);
        
        var b:Matrix2D = new Matrix2D();
        var cos:number = Math.cos(phi);
        var sin:number = Math.sin(phi);
        b.setValue(0, 0, cos);
        b.setValue(0, 1, -sin);
        b.setValue(1, 0, sin);
        b.setValue(1, 1, cos);
        
        var c:Matrix2D = translation(x, y);
        
        return compose2D(compose2D(c, b), a);
    }
    
    export function scale(sx: number, sy: number): Matrix2D {
        var r: Matrix2D = new Matrix2D();
        r.setValue(0, 0, sx);
        r.setValue(1, 1, sy);
        return r;
    }
}