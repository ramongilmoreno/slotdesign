/// <reference path="Pieces"/>
/// <reference path="Ninco"/>
/// <reference path="Editor"/>
/// <reference path="Solve"/>

var track = new Pieces.DefaultTrack("sample", "Sample track", "Early test of track");
var track2 = new Pieces.DefaultTrack("precision test", "Precision test", "Test accumulation of errors");


var plane40 = Pieces.section(Ninco.ByRef["10102"]);
var plane20 = Pieces.section(Ninco.ByRef["10103"]);
var plane10 = Pieces.section(Ninco.ByRef["10104"]);
var pright = Pieces.section(Ninco.ByRef["10105"]);
var pleft = Pieces.section(Ninco.ByRef["10105"], true);
var uright = Pieces.section(Ninco.ByRef["10115"]);
var uleft = Pieces.section(Ninco.ByRef["10115"], true);
var oright = Pieces.section(Ninco.ByRef["10107"]);
var ileft = Pieces.section(Ninco.ByRef["10106"], true);

var rawEditValue: string = "";

var editor: Editor.Status = new Editor.Status();

function render () {
    editor.track.pieces = [];
    for (var i = 0; i < rawEditValue.length; i++) {
        var c = rawEditValue[i];
        var section: Pieces.ITrackSection = undefined;
        switch (c) {
            case 'w': case 'W': section = plane40; break;
            case 'a': case 'A': section = pleft; break;
            case 's': case 'S': section = plane10; break;
            case 'd': case 'D': section = pright; break;
        }
        if (section != undefined) {
            editor.insert(section);
        }
    }
    slotdesign.followEditor = editor.track.follow();
}

function rawEdit (value: string) {
    if (rawEditValue != value) {
        rawEditValue = value;
        render();
        return true;
    } else {
        return false;
    }
}

function add (section: Pieces.ITrackSection, count: number = 1) {
    for (var i = 0; i < count; i++) {
        track.pieces.push(section);
    }
}

function add2 (section: Pieces.ITrackSection, count: number = 1) {
    for (var i = 0; i < count; i++) {
        track2.pieces.push(section);
    }
}

// Ninco Starter v4 track   
add(plane40);
add(pright, 4);
add(plane40, 5);
add(pright, 5);
add(plane40);
add(pright);
add(plane10);
add(pleft, 4);
add(plane40);
add(pright, 2);

// Track to test errors
add2(plane40);
add2(pright, 4);
add2(uleft, 32);
add2(pright, 4);
add2(plane40);
add2(pleft, 2);
add2(pright, 2);
add2(pleft);
add2(plane40);
add2(plane10);
add2(ileft, 8);
add2(plane20);
add2(plane10);
add2(pleft, 2);
add2(pright);
add2(pleft, 3);
add2(plane10, 4);
add2(oright, 16)
add2(plane40);
add2(pleft, 2);
add2(pright, 3);
add2(plane20);
add2(plane40);
add2(plane20);
add2(pleft, 4);


var slotdesign = {
    value: "Hello World",
    pieces: Ninco.Parts,
    track: track,
    follow: track.follow(),
    track2: track2,
    follow2: track2.follow(),
    editor: editor,
    followEditor: editor.track.follow()
};


var problem: Solve.Problem = new Solve.DefaultProblem();
var createVariable = function (name: string, problem: Solve.Problem): Solve.Variable {
    var r: Solve.Variable = new Solve.DefaultVariable();
    r.name = name;
    for (var i = 0; i < 10; i++) {
        r.scope.values.push(i.toString());
    }
    problem.variables.push(r);
    return r;
}
var variableA: Solve.Variable = createVariable("A", problem);
var variableB: Solve.Variable = createVariable("B", problem);

var heuristic = function (problem: Solve.Problem, status: Solve.Status): Solve.Status {
    return null;
}

var goal = function (problem: Solve.Problem, status: Solve.Status): boolean {
    return true;
}

var reportGoal = function (problem: Solve.Problem, status: Solve.Status, resume: Solve.Resume) {
}

var limit = function (problem: Solve.Problem, status: Solve.Status): boolean {
    return true;
}


var reportLimit = function (problem: Solve.Problem, status: Solve.Status, resume: Solve.Resume) {
}

var reportEnd = function (problem: Solve.Problem, status: Solve.Status, resume: Solve.Resume) {
}

Solve.solve(problem, new Solve.DefaultStatus(), heuristic, goal, reportGoal, limit, reportLimit, reportEnd);  