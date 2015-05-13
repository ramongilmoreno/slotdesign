/// <reference path="Pieces"/>

module Ninco {
    export function lane(id: string, name: string, description: string, length: number): Pieces.ITrackPiece {
        return new Pieces.DefaultTrackPiece(id, name, description, 0, length, 0);
    }
}
