/// <reference path="Geometry"/>

module Pieces {
    
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
        offset: Geometry.ICoordinates;
        rotation: number;
        manufacturer: string;
        svgPath: string;
        box: Geometry.IBox;
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

        get offset(): Geometry.ICoordinates {
            return new Geometry.DefaultCoordinates(0, this.length);
        }
        set offset(offset: Geometry.ICoordinates) { console.log("Unsupported"); }
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

        get box(): Geometry.IBox {
            var w2: number = Math.round(this.width / 2.0);
            return new Geometry.DefaultBox(new Geometry.DefaultCoordinates(-w2, -this.length), new Geometry.DefaultCoordinates(w2, 0));
        }
        set box(box: Geometry.IBox) { console.log("Unsupported"); }
    }

    export class DefaultCurve extends AbstractTrackPiece implements ITrackPiece {

        private _innerRadius: number;
        private _arc: number;

        constructor(id: string, name: string, description: string, manufacturer: string, innerRadius: number, arc: number, width: number, laneFromCenter: number) {
            super(id, name, description, manufacturer, width, laneFromCenter);
            this._innerRadius = innerRadius;
            this._arc = arc;
        }
        get offset(): Geometry.ICoordinates {
            var radius: number = this._innerRadius + (this.width / 2);
            return new Geometry.DefaultCoordinates(Math.cos(this._arc) * radius, Math.sin(this._arc) * radius);
        }
        set offset(offset: Geometry.ICoordinates) { console.log("Unsupported"); }
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
        get box(): Geometry.IBox {
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

            var topLeft: Geometry.ICoordinates = new Geometry.DefaultCoordinates();
            var bottomRight: Geometry.ICoordinates = new Geometry.DefaultCoordinates();
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
            return new Geometry.DefaultBox(topLeft, bottomRight);
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

    export class RenderedTrackSection {
        public matrix: Matrix.Matrix2D;
        public path: string;
    }
    
    export class RenderedTrack {
        public box: Geometry.IBox = new Geometry.DefaultBox();
        public sections: RenderedTrackSection[] = [];
    }
    
    export class DefaultTrack extends DefaultIdentified {
        pieces: ITrackSection[] = [];
        
        public follow (): RenderedTrack {
            var result: RenderedTrack = new RenderedTrack();
            var matrix: Matrix.Matrix2D = new Matrix.Matrix2D();
            for (var i = 0; i < this.pieces.length; i++) {
                var section: ITrackSection = this.pieces[i];
                var piece: ITrackPiece = section.piece;
                var move: Matrix.Matrix2D = undefined;
                if (section.rotate) {
                    // Compose a rotation and translation of the piece
                    var rotation: Matrix.Matrix2D = Matrix.rotation(0, 0, -(Math.PI - piece.rotation));
                    var translatedPoint: Matrix.Point2D = Matrix.apply2D(rotation, new Matrix.Point2D(piece.offset.x, piece.offset.y));
                    var translation: Matrix.Matrix2D = Matrix.translation(-translatedPoint.x, -translatedPoint.y);
                    matrix = Matrix.compose2D(Matrix.compose2D(translation, rotation), matrix);
                    move = translation;
                } else {
                    move = Matrix.translation(piece.offset.x, piece.offset.y);
                }
                
                // Save into current
                var rts: RenderedTrackSection = new RenderedTrackSection();
                rts.matrix = matrix;
                rts.path = piece.svgPath;
                result.sections.push(rts);
                                
                // Apply the modifications of this piece: first move then rotate
                result.box = Geometry.addBoxes(result.box, Geometry.apply(piece.box, matrix));
                matrix = Matrix.compose2D(move, matrix);
                matrix = Matrix.compose2D(Matrix.rotation(0, 0, piece.rotation), matrix);
            }
            return result;
        }
    }
    
    export function section (piece: Pieces.ITrackPiece, rotate: boolean = false): ITrackSection {
        return new DefaultTrackSection(piece, rotate);
    }
}