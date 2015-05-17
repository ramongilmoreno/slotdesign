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
    
    // http://www.ninco.com/product/5/0/0/1/2/2-X-STRAIGHT-40-CM.htm
    Parts.push(straight("10102", "STRAIGHT 40 CM", "Straight section of 400 millimeters", 400));
    
    // http://www.ninco.com/product/6/0/0/1/2/2-X-STRAIGHT-20-CM.htm
    Parts.push(straight("10103", "STRAIGHT 20 CM", "Straight section of 200 millimeters", 200));
    
    
    // http://www.ninco.com/product/8/0/0/1/2/2-X-STANDARD-CURVE.htm
    // Standard          24.15              28.65             37.65             42.15
    Parts.push(curve("10105", "STANDARD CURVE - RIGHT", "Regular curve 45 degrees", 2415, 45));
}
