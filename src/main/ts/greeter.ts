/// <reference path="Ninco"/>

function greeter(person: string) {
    return "Hello, " + person;
    }

var user = "Jane User " + Ninco.lane("1", "2", "3", 400).offset.y;

document.body.innerHTML = greeter(user);
