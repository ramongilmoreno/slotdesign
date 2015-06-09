module Solve {
    
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

    
    export interface Scope {
        values: string[];
    }
    
    export class DefaultScope implements Scope {
        values: string[] = [];
    }
    
    export interface Variable {
        name: string;
        scope: Scope;
    }

    export class DefaultVariable implements Variable {
        private _name: string = uuid();
        private _scope: Scope = new DefaultScope();
        get name (): string { return this._name; }
        set name (name: string) { this._name = name; }
        get scope (): Scope { return this._scope; }
        set scope (scope: Scope) { this._scope = scope; }
    }

    export interface Problem {
        variables: Variable[];
        limit: number;
    }
    
    export class DefaultProblem implements Problem {
        variables: Variable[] = [];
        private _limit: number;
        get limit (): number { return this._limit; }
        set limit (limit: number) { this._limit = limit; }
    }

    export interface Assignation {
        variable: string;
        value: string;        
    }
    
    export class DefaultAssignation implements Assignation {
        private _variable: string;
        private _value: string;
        constructor (variable: string, value: string) {
            this._variable = variable;
            this._value = value;
        }
        get variable(): string { return this._variable; }
        get value(): string { return this._value; }
    }

    export interface Status {
        meta: Object;
        assignations: Assignation[];
    }
    
    export class DefaultStatus implements Status {
        private _meta: Object = {};
        assignations: Assignation[] = [];
        get meta (): Object { return this._meta; }
    }

    // http://stackoverflow.com/questions/14813804/typescript-function-interface
    export interface Heuristic {
        (problem: Problem, status: Status): Status;
    }
    
    export interface Check {
        (problem: Problem, status: Status): boolean;
    }
    
    export interface Resume {
        ()
    }
    
    export interface Report {
        (problem: Problem, status: Status, resume: Resume)
    }

    export var solve = function (
                problem: Problem,
                status: Status,
                heuristic: Heuristic,
                goal: Check,
                reportGoal: Report,
                limit: Check,
                reportLimit: Report,
                reportEnd: Report
            ) {
        var resumeFunction = function () {
            solve(problem, heuristic(problem, status), heuristic, goal, reportGoal, limit, reportLimit, reportEnd);
        };
        var f = undefined;
        if (goal(problem, status)) {
            f = function () { reportGoal(problem, status, resumeFunction); };
        } else if (limit(problem, status)) {
            f = function () { reportLimit(problem, status, resumeFunction); }
        } else {
            f = resumeFunction;
        }
        setTimeout(f, 0);
    }
}