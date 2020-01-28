//FP is expressive, hense void functions have no meaning
//Functions as first class citizens
//Higher Order Functions
//functions that take other functions as parameters
const applyOperation = (x, y, opt) => opt(x,y);

function add(a){
    return function(b){
        return a+b
    }
}

//in arrow syntax
const add2 = (a) => (b) => a+b;
let ans = add2(10)(11)

function retrive(arr, opt){
    return opt(arr)
}

// Since javascript functions can be used as values they can be treated as immutable "yet to be executed value" based on the function
//input

//Example:Print pppl from US
//Imperative approach
function printPeopleInTheUs(people) {
    for (let i = 0; i < people.length; i++) {
        var thisPerson = people[i];
        if(thisPerson.address.country === 'US')
            console.log(thisPerson);
        
    }
}
printPeopleInTheUs([p1, p2, p3]);

//Example functional approach
const printPeople = (people, action) => people.forEach(action); 


function action(person){
    if(person.address.country === 'US') {
        console.log(person);
    }
}

// further abstracted
function printPeople(people, selector, printer) {
        people.forEach(function (person) {
        if(selector(person)) {
            printer(person);
        }
    });
}

let inUs = person => person.address.country === 'US';
printPeople(people, inUs, console.log);

//The above example is much more flexible, we can supply different filter criteria 
// and choose how to print the out. eg console or file

const printPeople2 = (people, selector, printer) => people.fitler(selector).forEach(printer);

// By passing functions as values gives use futher flexibility.

//Closures and Scopes


function zipCode(code, location) {
    let _code = code;
    let _location = location || '';
    return {
        code: function () {
                return _code;
            },
        location: function () {
                return _location;
            },
        }
}


// afer the zipcode function has finished executing the result object will still have access to information in the enclosing function.
let botshabelo = zipCode('9781', 'free state')
console.log(botshabelo.code())

//closure is a data structure that binds a function to its enviroment when its declared.
//Its based on the textual location of where the function is been defined.
// its call lexical state because it gives functions access to its surround state.

//Example
function makeAddFunction(amount) {
    function add(number) {
        return number + amount;
    }
    return add;
}
// The add function is lexically bond to the makeAddFunction and has access to the amount variable

let addTenTo = makeAddFunction(10);
addTenTo(30)

function makeExponentialFunction(base) {
    function raise (exponent) {
        return Math.pow(base, exponent);
    }
    return raise;
}

var raiseThreeTo = makeExponentialFunction(3);
raiseThreeTo(2);

// It’s important to notice in this example that even though the amount and base variables
// in both functions are no longer in the active scope, they’re still accessible from the
// returned function when invoked.

//Problems with the global scope
//Any objects and variables declared in the outermost level of a script (not contained in any function) are
//part of the global scope and acccessible by all the javascript code.

//Global variable are shared by all the files loaded on the page leading to problems such as
// - namespace collisions if the modules are not packaged correctly
// - you run the risk of overrding global vairables and functions

//JavaScript’s function scope
// Any variables declared in the function are visible to only that function
//Javascript scoping mechanism works as follows
// 1. checks the variables function scope
// 2. If not in the local scope, it moves outward into the surrounding lexical scope,
//    searching for the variable reference until it reaches the global scope.
// 3. If the variable can’t be referenced, JavaScript returns undefined.

//Example

let test = "global"
function parent(){
    function child(){
        console.log(test);
    }
    return child;
}

var child = parent();
child();


//A pseudo-block scope
// javascript does not support block level scope, this means variables declared in if, loops switch states are accessible
// from the enclosing scope.

// example

function doWork() {
    if (!myVar) {
        var myVar = 10;
    }
    console.log(myVar);
}
doWork() 


//Practical applications of closures
// 1  Emulating private variables
// 2  Making asynchronous server-side calls
// 3  Creating artificial block-scoped variables

//EMULATING PRIVATE VARIABLES
// uses a single immediately invoked function expression (IIFE) to encapsulate
// internal variables while allowing you to export the necessary set of functionality to the
// outside world and severely reduce the number of global references.

// research - module pattern

//MAKING ASYNCHRONOUS SERVER-SIDE CALLS
// through the use of callbacks

//EMULATING BLOCKED-SCOPE VARIABLES
// By using a function scope instead of the traditional block scopes
