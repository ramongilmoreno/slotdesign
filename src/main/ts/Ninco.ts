/// <reference path="Pieces"/>

module Ninco {
    
    export var NINCO: string = "Ninco";
    export var WIDTH: number = 180;
    export var LANE_FROM_CENTER: number = 45;
    
    export function straight(id: string, name: string, description: string, length: number): Pieces.ITrackPiece {
        return new Pieces.DefaultStraight(id, name, description, NINCO, length, WIDTH, LANE_FROM_CENTER);
    }
    
    export function curve(id: string, name: string, description: string, innerRadius: number, arc: number): Pieces.ITrackPiece {
        return new Pieces.DefaultCurve(id, name, description, NINCO, innerRadius, arc, WIDTH, LANE_FROM_CENTER);
    }
    
    export var Parts: Pieces.ITrackPiece[] = [];
    export var ByRef = {};
    
    function register (piece: Pieces.ITrackPiece) {
        Parts.push(piece);
        ByRef[piece.id] = piece;
    }
    
    // http://www.ninco.com/product/5/0/0/1/2/2-X-STRAIGHT-40-CM.htm
    register(straight("10102", "STRAIGHT 40 CM", "Straight section of 400 millimeters", 400));
    
    // http://www.ninco.com/product/6/0/0/1/2/2-X-STRAIGHT-20-CM.htm
    register(straight("10103", "STRAIGHT 20 CM", "Straight section of 200 millimeters", 200));
    
    // http://www.ninco.com/product/7/0/0/1/2/2-X-STRAIGHT-10-CM.htm?l=2
    register(straight("10104", "STRAIGHT 10 CM", "Straight section of 100 millimeters", 100));
    
    // http://www.armchairracer.com.au/track-systems/ninco/ninco-track-and-border-table
    // http://slotadictos.mforos.com/21954/7223571-medidas-pista-ninco/#70156625
    // Curva          Borde interior    Carril interior   Carril exterior   Borde exterior
    // Interior           6.15              10.65             19.65             24.15
    // Standard          24.15              28.65             37.65             42.15
    // Exterior          42.15              46.65             55.65             60.15
    // Super-exterior    60.15              64.65             73.65             78.15
    
    // http://www.ninco.com/product/9/0/0/1/2/2-X-INNER-CURVE.htm
    // Interior           6.15              10.65             19.65             24.15
//    var baseRadius: number = 61.5;
    var baseRadius: number = 60;
    register(curve("10106", "INNER CURVE", "Inner curve 45 degrees", baseRadius + (0 * WIDTH), Math.PI / 4));
    // http://www.ninco.com/product/8/0/0/1/2/2-X-STANDARD-CURVE.htm
    // Standard          24.15              28.65             37.65             42.15
    register(curve("10105", "STANDARD CURVE", "Regular curve 45 degrees", baseRadius + (1 * WIDTH), Math.PI / 4));
    // http://www.ninco.com/product/10/0/0/1/2/2-X-OUTER-CURVE.htm
    // Exterior          42.15              46.65             55.65             60.15
    register(curve("10107", "OUTER CURVE", "Outer curve 22.5 degrees", baseRadius + (2 * WIDTH), Math.PI / 8));
    // http://www.ninco.com/product/11/0/0/1/2/2-X-GRAND-CURVE.htm
    // Super-exterior    60.15              64.65             73.65             78.15
    register(curve("10108", "GRAND CURVE", "Next outer (grand) curve 22.5 degrees", baseRadius + (3 * WIDTH), Math.PI / 8));
    // http://www.ninco.com/product/17/0/0/1/2/2-X-ULTRA-EXTERIOR-CURVE.htm
    register(curve("10115", "ULTRA EXTERIOR CURVE", "Outmost curve 11.05 degrees", baseRadius + (4 * WIDTH), Math.PI / 16));
}
