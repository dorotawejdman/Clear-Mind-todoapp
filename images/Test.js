const Obj = {
    name:"John",
    getName: function () {
        console.log(this.name);

    },
};

const newObj = {name: "Alice"};
newObj.getName = Obj.getName;

const getName = Obj.getName;

newObj.getName();
Obj.getName();
getName()


var x=5;
(function () {
    console.log(x);
    var x=10;
    console.log(x);

})();


for( var i=0; i<4; ++i){
    setTimeout( function () {
        console.log(i);
        },0);
}

const obj = {a:"first", b:"second", a:"third"};
console.log(obj)

function multiplier(n){
    return n*this.modifier;
}

const x2 = {modifier:2}
const x5 = {modifier:5}

console.log(
    multiplier.apply(x2, [1, x5, 10])
);
var b = 0.1+0.2;

console.log((b))


// function getAmount(){
//     "use strict";
//     amount = 11;
//     console.log(age);

// }
// getAmount();1

