class Person {
    constructor(firstname, lastname, ssn) {
            this._firstname = firstname;
            this._lastname = lastname;
            this._ssn = ssn;
            this._address = null;
            this._birthYear = null;
    }

    get ssn() {
        return this._ssn;
    }

    get firstname() {
        return this._firstname;
    }

    get lastname() {
        return this._lastname;
    }

    get address() {
        return this._address;
    }

    get birthYear() {
        return this._birthYear;
    }

    set birthYear(year) {
        this._birthYear = year;
    }
    set address(addr){
        this._address = addr;
    }

    toString() {
        return `Person(${this._firstname}, ${this._lastname})`;
    }
}


class Student extends Person {
    constructor(firstname, lastname, ssn, school) {
        super(firstname, lastname, ssn);
        this._school = school;
    }

    get school() {
        return this._school;
    }
}

var person = new Person('Haskell', 'Curry', '444-44-4444');
const immutable = Object.freeze(person);
immutable._lastname = "error";

//Object freeze does not freeze nested objects but can freeze all the inhereted properties
var isObject = (val) => val && typeof val === 'object';
function deepFreeze(obj) {
    if(isObject(obj) && !Object.isFrozen(obj)) {
        Object.keys(obj).forEach(name => deepFreeze(obj[name]));
        Object.freeze(obj);
    }
    return obj;
}

//If one where to create nob stateful updates I would have to create a setter that returns a new object for every attribute change.
// set lastname(lastname) {
//     return new Person(this._firstname, lastname, this._ssn);
// };



