/// <reference path="Geometry"/>

module Pieces {
    
    export var SLOT_WIDTH: number = 6;
    export var SLOT_METAL_WIDTH: number = 4;
    
    export interface IIdentified {
        id: string;
        name: string;
        description: string;
    }
    
    // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function uuid(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    export class DefaultIdentified {
        private _id: string;
        private _name: string;
        private _description: string;
        constructor(id: string = uuid(), name: string = "Unknown", description: string = "Unknown description") {
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
    
    export interface Lane {
        length: number;
        svgPath: string;
    }
    
    export class DefaultLane implements Lane {
        private _length: number;
        private _svgPath: string;
        get length (): number { return this._length; }
        set length (length: number) { this._length = length; }
        get svgPath (): string { return this._svgPath; }
        set svgPath (svgPath: string) { this._svgPath = svgPath; }
    }

    export interface ITrackPiece extends IIdentified {
        offset: Geometry.ICoordinates;
        rotation: number;
        manufacturer: string;
        svgPath: string;
        box: Geometry.IBox;
        lanes: Lane[];
    }

    export class AbstractTrackPiece extends DefaultIdentified {
        private _manufacturer: string;
        private _width: number;
        private _laneFromCenter: number;
        public lanes: Lane[] = [ new DefaultLane(), new DefaultLane() ];
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
            
            // Compute lanes
            var w2: number = laneFromCenter;
            var slotWidth2: number = SLOT_WIDTH / 2;
            this.lanes[0].svgPath =
                "m " + (-w2 - slotWidth2) + ",0 l " + (-SLOT_METAL_WIDTH) + ",0 l 0," + length + " l " +  SLOT_METAL_WIDTH  + ",0 l 0," + (-length) + "z m " + (w2 + slotWidth2) + ", 0 " +
                "m " + (-w2 + slotWidth2) + ",0 l " + (SLOT_METAL_WIDTH) + ",0 l 0," + length + " l " +  (-SLOT_METAL_WIDTH)  + ",0 l 0," + (-length) + "z m " + (w2 - slotWidth2) + ", 0 ";
            this.lanes[1].svgPath =
                "m " + (w2 - slotWidth2) + ",0 l " + (-SLOT_METAL_WIDTH) + ",0 l 0," + length + " l " +  SLOT_METAL_WIDTH  + ",0 l 0," + (-length) + "z m " + (-w2 + slotWidth2) + ", 0 " +
                "m " + (w2 + slotWidth2) + ",0 l " + (SLOT_METAL_WIDTH) + ",0 l 0," + length + " l " +  (-SLOT_METAL_WIDTH)  + ",0 l 0," + (-length) + "z m " + (-w2 - slotWidth2) + ", 0 ";
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
            return "l -" + w2 + ",0 l 0," + l + " l " + w + ",0 l 0," + (-l) + " l -" + w2 + ",0";
        }
        set svgPath(svgPath: string) { console.log("Unsupported"); }

        get box(): Geometry.IBox {
            var w2: number = Math.round(this.width / 2.0);
            return new Geometry.DefaultBox(new Geometry.DefaultCoordinates(-w2, 0), new Geometry.DefaultCoordinates(w2, this.length));
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
            
            function f (offset: number, innerRadius: number, width: number, arcarg: number) {
                var arc = arcarg % (2 * Math.PI);
                if (arc < 0) {
                    arc += (2 * Math.PI);
                }
    
                var w: number = width;
                var w2: number = Math.round(w / 2.0);
                var outerRadius = innerRadius + w;
                var outerSin: number = Math.sin(arc) * outerRadius;
                var outerCos: number = Math.cos(arc) * outerRadius;
                var innerSin: number = Math.sin(arc) * innerRadius;
                var innerCos: number = Math.cos(arc) * innerRadius;
    
                // inner vertex
                // innerCos
                // innerSin
    
                // outer vertex
                // outerCos
                // outerSin
                
                // a <x radius>,<y radius> 0 0,1 <end x>,<end y>
                return "m " + offset + ",0 l " + (-w2) + ",0" +
                    " a " + innerRadius + "," + innerRadius + " 0 0,1 " + (innerCos - innerRadius) + "," + innerSin +
                    " l " + (outerCos - innerCos) + "," + -(-outerSin + innerSin) +
                    " a " + outerRadius + "," + outerRadius + " 0 0,0 " + (outerRadius - outerCos) + "," + -outerSin +
                    " l " + (-w2) + ",0 m " + (-offset) + ",0"
                    // reveal the bbox for debugging purposes
                    // + " m " + box.topLeft.x + "," + box.topLeft.y + " l " + (box.bottomRight.x - box.topLeft.x) + "," + (box.bottomRight.y - box.topLeft.y)
                    ;
            }
            
            this.lanes[0].svgPath = "" + f(-laneFromCenter - (SLOT_WIDTH / 2) - (SLOT_METAL_WIDTH / 2), innerRadius + (width / 2) - laneFromCenter - (SLOT_WIDTH / 2) - SLOT_METAL_WIDTH, SLOT_METAL_WIDTH, arc) +
                    " " + f(-laneFromCenter + (SLOT_WIDTH / 2) + (SLOT_METAL_WIDTH / 2), innerRadius + (width / 2) - laneFromCenter + (SLOT_WIDTH / 2), SLOT_METAL_WIDTH, arc);
            this.lanes[1].svgPath = "" + f(laneFromCenter - (SLOT_WIDTH / 2) - (SLOT_METAL_WIDTH / 2), innerRadius + (width / 2) + laneFromCenter - (SLOT_WIDTH / 2) - SLOT_METAL_WIDTH, SLOT_METAL_WIDTH, arc) +
                    " " + f(laneFromCenter + (SLOT_WIDTH / 2) + (SLOT_METAL_WIDTH / 2), innerRadius + (width / 2) + laneFromCenter + (SLOT_WIDTH / 2), SLOT_METAL_WIDTH, arc);
        }
        get offset(): Geometry.ICoordinates {
            var rotation = Matrix.rotation(- this._innerRadius - (this.width / 2), 0, this._arc);
            var r: Matrix.Point2D = Matrix.apply2D(rotation, new Matrix.Point2D());
            return new Geometry.DefaultCoordinates(r.x, r.y);
        }
        get rotation(): number {
            return this._arc;
        }
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
                " a " + this._innerRadius + "," + this._innerRadius + " 0 0,1 " + (innerCos - this._innerRadius) + "," + innerSin +
                " l " + (outerCos - innerCos) + "," + -(-outerSin + innerSin) +
                " a " + outerRadius + "," + outerRadius + " 0 0,0 " + (outerRadius - outerCos) + "," + -outerSin +
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
                topLeft.y = 0;
                bottomRight.x = w2;
                bottomRight.y = outerSin;
            } else {
                throw new RangeError("Arc cannot be over " + (Math.PI / 2));
            }
            return new Geometry.DefaultBox(topLeft, bottomRight);
        }
    }

    export interface ITrackSection extends IIdentified {
        piece: ITrackPiece;
        rotate: boolean;
    }

    export class DefaultTrackSection extends DefaultIdentified implements ITrackSection {
        private _piece: ITrackPiece;
        private _rotate: boolean;
        constructor(piece: ITrackPiece = undefined, rotate: boolean = false) {
            super();
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
        follow (): RenderedTrack;
    }

    export class RenderedTrackSection {
        public matrix: Matrix.Matrix2D;
        public path: string;
        public leftLane: string;
        public rightLane: string;
    }
    
    export class RenderedTrack {
        public box: Geometry.IBox = new Geometry.DefaultBox();
        public sections: RenderedTrackSection[] = [];
        public error: Geometry.ICoordinates = new Geometry.DefaultCoordinates();
    }
    
    export class DefaultTrack extends DefaultIdentified {
        pieces: ITrackSection[] = [];
        
        public follow (): RenderedTrack {
            // Compute error at closing track 
            var matrix: Matrix.Matrix2D = new Matrix.Matrix2D();
            for (var i = 0; i < this.pieces.length; i++) {
                var section: ITrackSection = this.pieces[i];
                var piece: ITrackPiece = section.piece;
                var move: Matrix.Matrix2D = undefined;
                if (section.rotate) {
                    // Compose a rotation and translation of the piece
                    var rotation: Matrix.Matrix2D = Matrix.rotation(0, 0, Math.PI - piece.rotation);
                    var translatedPoint: Matrix.Point2D = Matrix.apply2D(rotation, new Matrix.Point2D(piece.offset.x, piece.offset.y));
                    var translation: Matrix.Matrix2D = Matrix.translation(-translatedPoint.x, -translatedPoint.y);
                    var composition: Matrix.Matrix2D = Matrix.compose2D(translation, rotation);
                    matrix = Matrix.compose2D(matrix, composition);
                    
                    // Apply composition to translated point
                    translatedPoint = Matrix.apply2D(composition, new Matrix.Point2D(piece.offset.x, piece.offset.y));
                    move = Matrix.translation(translatedPoint.x, translatedPoint.y);
                } else {
                    move = Matrix.translation(piece.offset.x, piece.offset.y);
                }
                
                // Apply the modifications of this piece: first move then rotate
                matrix = Matrix.compose2D(matrix, move);
                matrix = Matrix.compose2D(matrix, Matrix.rotation(0, 0, section.rotate ? Math.PI : piece.rotation));
            }
            var error: Matrix.Point2D = Matrix.apply2D(matrix, new Matrix.Point2D(0, 0));
            var dx: number = -error.x / (this.pieces.length - 1);
            var dy: number = -error.y / (this.pieces.length - 1);
            var applyd: boolean = (Math.abs(dx) < 2) && (Math.abs(dy) < 2);
            
            // Render 
            var result: RenderedTrack = new RenderedTrack();
            result.error.x = error.x;
            result.error.y = error.y;
            matrix = new Matrix.Matrix2D();
            for (var i = 0; i < this.pieces.length; i++) {
                var section: ITrackSection = this.pieces[i];
                var piece: ITrackPiece = section.piece;
                var move: Matrix.Matrix2D = undefined;
                if (section.rotate) {
                    // Compose a rotation and translation of the piece
                    var rotation: Matrix.Matrix2D = Matrix.rotation(0, 0, Math.PI - piece.rotation);
                    var translatedPoint: Matrix.Point2D = Matrix.apply2D(rotation, new Matrix.Point2D(piece.offset.x, piece.offset.y));
                    var translation: Matrix.Matrix2D = Matrix.translation(-translatedPoint.x, -translatedPoint.y);
                    var composition: Matrix.Matrix2D = Matrix.compose2D(translation, rotation);
                    matrix = Matrix.compose2D(matrix, composition);
                    
                    // Apply composition to translated point
                    translatedPoint = Matrix.apply2D(composition, new Matrix.Point2D(piece.offset.x, piece.offset.y));
                    move = Matrix.translation(translatedPoint.x, translatedPoint.y);
                } else {
                    move = Matrix.translation(piece.offset.x, piece.offset.y);
                }
                
                // Save into current
                var rts: RenderedTrackSection = new RenderedTrackSection();
                rts.matrix = matrix;
                rts.path = piece.svgPath;
                rts.leftLane = piece.lanes[0].svgPath;
                rts.rightLane = piece.lanes[1].svgPath;
                result.sections.push(rts);
                                
                // Apply the modifications of this piece: first move then rotate
                result.box = Geometry.addBoxes(result.box, Geometry.apply(piece.box, matrix));
                matrix = Matrix.compose2D(matrix, move);
                matrix = Matrix.compose2D(matrix, Matrix.rotation(0, 0, section.rotate ? Math.PI : piece.rotation));
                
                // Compose with error fix
                if (applyd) {
                    matrix = Matrix.compose2D(Matrix.translation(dx, dy), matrix);
                }
            }
            return result;
        }
    }
    
    export function section (piece: Pieces.ITrackPiece, rotate: boolean = false): ITrackSection {
        return new DefaultTrackSection(piece, rotate);
    }
}