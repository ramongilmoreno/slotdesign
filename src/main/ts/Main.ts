/// <reference path="Pieces"/>
/// <reference path="Ninco"/>

var track = new Pieces.DefaultTrack("sample", "Sample track", "Early test of track");
var track2 = new Pieces.DefaultTrack("precision test", "Precision test", "Test accumulation of errors");

var plane40 = Pieces.section(Ninco.ByRef["10102"]);
var plane20 = Pieces.section(Ninco.ByRef["10103"]);
var plane10 = Pieces.section(Ninco.ByRef["10104"]);
var pright = Pieces.section(Ninco.ByRef["10105"]);
var pleft = Pieces.section(Ninco.ByRef["10105"], true);
var uright = Pieces.section(Ninco.ByRef["10115"]);
var uleft = Pieces.section(Ninco.ByRef["10115"], true);


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
add2(plane20);
add2(plane10);
add2(pleft, 2);
add2(pright);
add2(pleft, 3);
add2(plane10, 4);
add2(uright, 32)
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
    follow2: track2.follow()
};
