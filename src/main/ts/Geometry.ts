module Geometry {

    export interface ICoordinates {
        x: number;
        y: number;
    }

    export class DefaultCoordinates implements ICoordinates {
        private _x: number = 0;
        private _y: number = 0;
        constructor(x: number = 0, y: number = 0) { this._x = x; this._y = y; }
        get x(): number { return this._x; }
        set x(x: number) { this._x = x; }
        get y(): number { return this._y; }
        set y(y: number) { this._y = y; }
    }

    export interface IBox {
        topLeft: ICoordinates;
        bottomRight: ICoordinates;
    }

    export class DefaultBox implements IBox {
        private _topLeft: ICoordinates;
        private _bottomRight: ICoordinates;
        constructor(topLeft: ICoordinates = new DefaultCoordinates(), bottomRight: ICoordinates = new DefaultCoordinates()) { this._topLeft = topLeft; this._bottomRight = bottomRight; }
        get topLeft(): ICoordinates { return this._topLeft; }
        set topLeft(topLeft: ICoordinates) { this._topLeft = topLeft; }
        get bottomRight(): ICoordinates { return this._bottomRight; }
        set bottomRight(bottomRight: ICoordinates) { this._bottomRight = bottomRight; }
    }
}