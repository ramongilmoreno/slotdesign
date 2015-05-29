/// <reference path="Pieces"/>
/// <reference path="Ninco"/>

module Editor {

    export class Status {
        
        private _track: Pieces.DefaultTrack = new Pieces.DefaultTrack();
        
        private _index: number = 0;
        
        public get track (): Pieces.ITrack { return this._track; }
        
        public clear() { this._track.pieces = []; }
        
        public count(): number { return this._track.pieces.length; }
        
        public index (index: number = this._index) { return Math.max(0, Math.max(index, this._track.pieces.length)); }
        
        public insert (section: Pieces.ITrackSection) {
            var index: number = this.index();
            this._track.pieces.splice(index, 0, section);
            this._index = ++index;
        }
        
        public remove () {
            var index: number = this.index();
            if (index > 0) {
                this._track.pieces.splice(index, 1);
                index = this.index();
            }
        }
        
    }
    
    
    
    
}