function greeter(person: string) {
    return "Hello, " + person;
}

var user = "Jane User";

document.body.innerHTML = greeter(user);

export interface ICoordinates {
    x: number;
    y: number;
}

export class DefaultCoordinates implements ICoordinates {
    private _x: number = 0;
    private _y: number = 0;
    constructor(x: number, y: number) { this._x = x; this._y = y; }
    get x(): number { return this._x; }
    get y(): number { return this._y; }
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
    direction: number;
}

export class DefaultTrackPiece extends DefaultIdentified implements ITrackPiece {
    private _offset: ICoordinates;
    private _direction: number = 0;
    constructor(id: string, name: string, description: string, x: number, y: number, direction: number) {
        super(id, name, description);
        this._offset = new DefaultCoordinates(x, y);
    }
    get offset(): ICoordinates { return this._offset; }
    get direction(): number { return this._direction; }
}

export interface ITrack extends IIdentified {
    pieces: ITrackPiece[];
}

export class DefaultTrack extends DefaultIdentified {
    pieces: ITrackPiece[] = [];   
}

