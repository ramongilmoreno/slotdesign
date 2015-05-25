/// <reference path="Pieces"/>
/// <reference path="Ninco"/>

var track = new Pieces.DefaultTrack("sample", "Sample track", "Early test of track");

var plane40 = Pieces.section(Ninco.ByRef["10102"]);
var plane10 = Pieces.section(Ninco.ByRef["10104"]);
var pright = Pieces.section(Ninco.ByRef["10105"], true);
var pleft = Pieces.section(Ninco.ByRef["10105"]);

function add (section: Pieces.ITrackSection) {
    track.pieces.push(section);
}
    
add(plane40);
add(pright);
add(pright);
add(pright);
add(pright);
add(plane40);
add(plane40);
add(plane40);
add(plane40);
add(plane40);
add(pright);
add(pright);
add(pright);
add(pright);
add(pright);
add(plane40);
add(pright);
add(plane10);
add(pleft);
add(pleft);
add(pleft);
add(pleft);
add(plane40);
add(pright);
add(pright);

var slotdesign = {
    value: "Hello World",
    pieces: Ninco.Parts,
    track: track,
    follow: track.follow()
};
