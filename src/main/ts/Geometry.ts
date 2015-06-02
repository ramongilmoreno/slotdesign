/// <reference path="Matrices"/>

module Geometry {

    export interface Coordinates {
        x: number;
        y: number;
    }

    export class DefaultCoordinates implements Coordinates {
        private _x: number = 0;
        private _y: number = 0;
        constructor(x: number = 0, y: number = 0) { this._x = x; this._y = y; }
        get x(): number { return this._x; }
        set x(x: number) { this._x = x; }
        get y(): number { return this._y; }
        set y(y: number) { this._y = y; }
        public toString () { return "(" + this.x + ", " + this.y + ")"; }
    }

    export interface Box {
        topLeft: Coordinates;
        bottomRight: Coordinates;
    }

    export class DefaultBox implements Box {
        private _topLeft: Coordinates;
        private _bottomRight: Coordinates;
        constructor(topLeft: Coordinates = new DefaultCoordinates(), bottomRight: Coordinates = new DefaultCoordinates()) { this._topLeft = topLeft; this._bottomRight = bottomRight; }
        get topLeft(): Coordinates { return this._topLeft; }
        set topLeft(topLeft: Coordinates) { this._topLeft = topLeft; }
        get bottomRight(): Coordinates { return this._bottomRight; }
        set bottomRight(bottomRight: Coordinates) { this._bottomRight = bottomRight; }
         public toString () { return "[" + this.topLeft + ", " + this.bottomRight + "]"; }
    }

    export function addCoordinatesToBox(box: Box, coordinates: Coordinates): Box {
//        console.log("Box before: ", box.toString());
//        console.log("Coordinates before", coordinates.toString());
        var r: Box = new DefaultBox(box.topLeft, box.bottomRight);
        var x: number = coordinates.x;
        var y: number = coordinates.y;
        
        r.topLeft.x = Math.min(r.topLeft.x, x);
        r.topLeft.y = Math.min(r.topLeft.y, y);
        r.bottomRight.x = Math.max(r.bottomRight.x, x);
        r.bottomRight.y = Math.max(r.bottomRight.y, y);
        
//        console.log("Box after: ", r.toString());
        return r;
    }
    
    export function addBoxes(a: Box, b: Box): Box {
        var minX: number = a.topLeft.x;
        var minY: number = a.topLeft.y;
        var maxX: number = a.topLeft.x;
        var maxY: number = a.topLeft.y;
        var coords: Coordinates[] = [a.bottomRight, b.topLeft, b.bottomRight];
        for (var i = 0; i < coords.length; i++) {
            var c: Coordinates = coords[i];
            minX = Math.min(c.x, minX);
            minY = Math.min(c.y, minY);
            maxX = Math.max(c.x, maxX);
            maxY = Math.max(c.y, maxY);
        }

        return new DefaultBox(new DefaultCoordinates(minX, minY), new DefaultCoordinates(maxX, maxY));
    }

    export function apply(box: Box, matrix: Matrices.Matrix2D): Box {
        var coords: Matrices.Point2D[] = [
            new Matrices.Point2D(box.topLeft.x, box.topLeft.y),
            new Matrices.Point2D(box.bottomRight.x, box.topLeft.y),
            new Matrices.Point2D(box.bottomRight.x, box.bottomRight.y),
            new Matrices.Point2D(box.topLeft.x, box.bottomRight.y)
        ];

        for (var i = 0; i < coords.length; i++) {
//            console.log("Coordinates before rotation: ", coords[i].toString());
            coords[i] = Matrices.apply2D(matrix, coords[i]);
//            console.log("Coordinates after rotation: ", coords[i].toString());
        }

        var r: Box = new DefaultBox(new DefaultCoordinates(coords[0].x, coords[0].y),
                new DefaultCoordinates(coords[0].x, coords[0].y));
        for (var i = 1; i < coords.length; i++) {
            r = addCoordinatesToBox(r, new DefaultCoordinates(coords[i].x, coords[i].y));
        }

        return r;
    }

    export function rotate(box: Box, center: Coordinates, phi: number): Box {
        return apply(box, Matrices.rotation(center.x, center.y, phi));
    }
}