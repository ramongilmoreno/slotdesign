module Pieces {
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

    export interface IIdentified {
        id: string;
        name: string;
        description: string;
    }

    export class DefaultIdentified {
        private _id: string;
        private _name: string;
        private _description: string;
        constructor(id: string, name: string, description: string) {
            this._id = id;
            this._name = name;
            this._description = description;
        }
        get id(): string { return this._id }
        set id(id: string) { this._id = id }
        get name(): string { return this._name; }
        set name(name: string) { this._name = name; }
        get description(): string { return this._description; }
        set description(description: string) { this._description = description; }
    }

    export interface ITrackPiece extends IIdentified {
        offset: ICoordinates;
        rotation: number;
        manufacturer: string;
    }

    export class AbstractTrackPiece extends DefaultIdentified {
        private _manufacturer: string;
        private _width: number;
        private _laneFromCenter: number;
        constructor(id: string, name: string, description: string, manufacturer: string, width: number, laneFromCenter: number) {
            super(id, name, description);
            this._manufacturer = manufacturer;
            this._width = width;
            this._laneFromCenter = laneFromCenter;
        }
        get manufacturer(): string { return this._manufacturer; }
        set manufacturer(manufacturer: string) { this._manufacturer = manufacturer; }
        get width(): number { return this._width; }
        set width(width: number) { this._width = width; }
        get laneFromCenter(): number { return this._laneFromCenter; }
        set laneFromCenter(laneFromCenter: number) { this._laneFromCenter = laneFromCenter; }
    }

    export class DefaultStraight extends AbstractTrackPiece implements ITrackPiece {

        private _length: number;

        constructor(id: string, name: string, description: string, manufacturer: string, length: number, width: number, laneFromCenter: number) {
            super(id, name, description, manufacturer, width, laneFromCenter);
            this._length = length;
        }

        get length(): number { return this._length; }
        set length(length: number) { this._length = length; }

        get offset(): ICoordinates {
            return new DefaultCoordinates(0, this.length);
        }
        set offset(offset: ICoordinates) { console.log("Unsupported"); }
        get rotation(): number {
            return 0;
        }
        set rotation(rotation: number) { console.log("Unsupported"); }
    }

    export class DefaultCurve extends AbstractTrackPiece implements ITrackPiece {

        private _innerRadius: number;
        private _arc: number;

        constructor(id: string, name: string, description: string, manufacturer: string, innerRadius: number, arc: number, width: number, laneFromCenter: number) {
            super(id, name, description, manufacturer, width, laneFromCenter);
            this._innerRadius = innerRadius;
            this._arc = arc;
        }
        get offset(): ICoordinates {
            var radius: number = this._innerRadius + (this.width / 2);
            return new DefaultCoordinates(Math.cos(this._arc) * radius, Math.sin(this._arc) * radius);
        }
        set offset(offset: ICoordinates) { console.log("Unsupported"); }
        get rotation(): number {
            return this._arc;
        }
        set rotation(rotation: number) { console.log("Unsupported"); }
    }

    export interface ITrackSection {
        piece: ITrackPiece;
        rotate: boolean;
    }

    export class DefaultTrackSection implements ITrackSection {
        private _piece: ITrackPiece;
        private _rotate: boolean;
        constructor(piece: ITrackPiece = undefined, rotate: boolean = false) {
            this._piece = piece;
            this._rotate = rotate;
        }
        get rotate(): boolean { return this._rotate; }
        set rotate(rotate: boolean) { this._rotate = rotate; }
        get piece (): ITrackPiece { return this._piece; }
        set piece (piece: ITrackPiece) { this._piece = piece; }
    }

    export interface ITrack extends IIdentified {
        pieces: ITrackSection[];
    }

    export class DefaultTrack extends DefaultIdentified {
        pieces: ITrackSection[] = [];
    }
}