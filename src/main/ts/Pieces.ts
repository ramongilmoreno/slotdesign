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
        svgPath: string;
        box: IBox;
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
        get svgPath(): string {
            var w: number = this.width;
            var l: number = this.length;
            var w2: number = Math.round(w / 2.0);
            return "l -" + w2 + ",0 l 0,-" + l + " l " + w + ",0 l 0," + l + " l -" + w2 + ",0";
        }
        set svgPath(svgPath: string) { console.log("Unsupported"); }

        get box(): IBox {
            var w2: number = Math.round(this.width / 2.0);
            return new DefaultBox(new DefaultCoordinates(-w2, -this.length), new DefaultCoordinates(w2, 0));
        }
        set box(box: IBox) { console.log("Unsupported"); }
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

        get svgPath(): string {
            var arc = this._arc % (2 * Math.PI);
            if (arc < 0) {
                arc += (2 * Math.PI);
            }

            var w: number = this.width;
            var w2: number = Math.round(w / 2.0);
            var outerRadius = this._innerRadius + w;
            var outerSin: number = Math.sin(arc) * outerRadius;
            var outerCos: number = Math.cos(arc) * outerRadius;
            var innerSin: number = Math.sin(arc) * this._innerRadius;
            var innerCos: number = Math.cos(arc) * this._innerRadius;

            // inner vertex
            // innerCos
            // innerSin

            // outer vertex
            // outerCos
            // outerSin
            
            // a <x radius>,<y radius> 0 0,1 <end x>,<end y>
            var box = this.box;
            return "l " + (-w2) + ",0" +
                " a " + this._innerRadius + "," + this._innerRadius + " 0 0,0 " + (innerCos - this._innerRadius) + "," + (-innerSin) +
                " l " + (outerCos - innerCos) + "," + (-outerSin + innerSin) +
                " a " + outerRadius + "," + outerRadius + " 0 0,1 " + (outerRadius - outerCos) + "," + outerSin +
                " l " + (-w2) + ", 0"
                // reveal the bbox for debugging purposes
                // + " m " + box.topLeft.x + "," + box.topLeft.y + " l " + (box.bottomRight.x - box.topLeft.x) + "," + (box.bottomRight.y - box.topLeft.y)
                ;
        }
        set svgPath(svgPath: string) { console.log("Unsupported"); }
        get box(): IBox {
            var arc = this._arc % (2 * Math.PI);
            if (arc < 0) {
                arc += (2 * Math.PI);
            }

            var w: number = this.width;
            var w2: number = Math.round(w / 2.0);
            var outerRadius = this._innerRadius + w;
            var outerSin: number = Math.sin(arc) * outerRadius;
            var outerCos: number = Math.cos(arc) * outerRadius;
            var innerSin: number = Math.sin(arc) * this._innerRadius;
            var innerCos: number = Math.cos(arc) * this._innerRadius;

            // inner vertex
            // innerCos
            // innerSin

            // outer vertex
            // outerCos
            // outerSin

            var topLeft: ICoordinates = new DefaultCoordinates();
            var bottomRight: ICoordinates = new DefaultCoordinates();
            if (arc <= (Math.PI / 2)) {
                topLeft.x = innerCos - this._innerRadius - w2 ;
                topLeft.y = -outerSin;
                bottomRight.x = w2;
                bottomRight.y = 0;
            } else if (arc <= (Math.PI)) {
                topLeft.x = -w2 - this._innerRadius + outerCos;
                topLeft.y = -outerRadius;
                bottomRight.x = w2
                bottomRight.y = 0;
            } else if (arc <= (3 * Math.PI / 2)) {
                topLeft.x = -w2 - this._innerRadius - outerRadius;
                topLeft.y = -outerRadius;
                bottomRight.x = w2;
                bottomRight.y = -outerSin;
            } else if (arc <= (Math.PI * 2)) {
                topLeft.x = -w2 - this._innerRadius - outerRadius;
                topLeft.y = -outerRadius;
                bottomRight.x = w2;
                bottomRight.y = outerRadius;
            }
            return new DefaultBox(topLeft, bottomRight);
        }

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
        get piece(): ITrackPiece { return this._piece; }
        set piece(piece: ITrackPiece) { this._piece = piece; }
    }

    export interface ITrack extends IIdentified {
        pieces: ITrackSection[];
    }

    export class DefaultTrack extends DefaultIdentified {
        pieces: ITrackSection[] = [];
    }
}