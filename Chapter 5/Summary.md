# FP Design patterns against complexity


Throwing exceptions and returning nulls doesnt allow the chaining of functions

### Reasons for not throwing exceptions

* Stops function chaining
* Violates the referential transparency rule as the function becomes unpredictable
* Sides effects as the exeptions stack goes beyond the scope of the function

### Null Checking

The alternative is to return a null value rather than throwing an exception. This results in functions having to do null checks.

Example

```javascript
const Divide = (x, y) => (y === 0)? null : x / y;
let result = Divide(10, 0);
if(result !== null)
{
    // do something with ans
}
```
## Functors

Create a safe box around a exception prone 

### Wrapping Unsafe Values

Containerizing  values is a fundamental design pattern in functional
programming because it guards direct access to the values so they can be manipulated
safely and immutably in your programs.

Accessing a wrapped value can only be done by **mapping an operation to its container**.

```javascript
class Wrapper {
    constructor (value) { this._value = value; }
    map(func) { return func(this._value); }
    toString() { return `value: ${this._value}`; } 
}
```
fmap - Wraps the transformed value in the container before returning it to the caller.
fmap :: (A -> B) -> Wrapper(A) -> Wrapper(B)
fmap returns a new copy of teh value making it immutable.

```javascript
const wrap = (val) => new Wrapper(val);
Wrapper.prototype.fmap = func => wrap(func(this._value))
```
map and filer are functors that preverse the data type.

map :: (A -> B) : Array(A) -> Array(B)
fitler::  (A -> Boolean) : Array(A) -> Array(A)

### Functors Properties

* They must be side effect free
* They must be composable - the composotion of functions applied to fmap should be the same as chaining fmap functions together.

```javascript
const Add2 = x => x + 2;
const Power2 = x => x * 2;
const GetValue = value => value
const add2nPower = compose(GetValue,Power2, Add2);

const wrap = (val) => new Wrapper(val);
var threeWrapped = wrap(2);
const shouldBeTrue = threeWrapped.fmap(add2nPower) === threeWrapped.fmap(Add2)
                                                                    .fmap(Power2)
                                                                    .fmap(GetValue);
```
The purpose of functors is to create an abstration that allows for manipulation or application of operations to
values without changing them.


## Monads

Monads are same as functors except they delegate to special logic when dealing with specific cases


Let the function half only work with even numbers.
```javascript
const Empty = function (_) {;};
const empty = () => new Empty();
const isEven = (n) => Number.isFinite(n) && (n % 2 == 0);
const half = (val) => isEven(val) ? wrap(val / 2) : empty()
```

A monad exists when you create a whole data type around this idea of lifting values
inside containers and defining the rules of containment.

* Monad — Provides the abstract interface for monadic operations
* Monadic type — A particular concrete implementation of this interface

Monads should have the following:

* *Type Constructor* - Creates an instance of the monad.
* *Unit function* - Inserts a value into the monadic type.
* *Bind function* - Chains operations together (flatmap)
* *Join operation* - Flattens monadic structures

Wrapper Monad
```javascript
class Wrapper {
    constructor(value) {
        this._value = value;
    }

    static of(a) {
        return new Wrapper(a);
    }

    map(f) {
        return Wrapper.of(f(this.value));
    }

    join() {
        if(!(this.value instanceof Wrapper))
            return this;
        return this.value.join();
    }

    toString() {
        return `Wrapper (${this.value})`;
    }
}
```

##  Maybe and Either monads

### Maybe Monad

They focus on abstracting null checking logic.
Maybe is a base type with two concrete implements of **Just** and **Nothing**

Maybe Class
```javascript
class Maybe
{
    static just(value) => new Just(value);

    static nothing() => new Nothing();

    static fromNullable(value) => (value === null)? nothing(): Maybe(value);

    static of(value) => just(value);

    get isNothing() {
        return false;
    }

    get isJust() {
        return false;
    }
}

class Just extends Maybe
{
    constructor(value) {
        super();
        this._value = value;
    }

    get value() {
        return this._value;
    }

    map(func) {
        return of(func(this._value));
    }

    getOrElse() {
        return this.value;
    }

    filter(f) {
        Maybe.fromNullable(f(this.value) ? this.value : null);
    }

    get isJust() {
        return true;
    }

    toString () {
        return `Maybe.Just(${this.value})`;
    }
}

class Nothing extends Maybe {
    map(f) {
        return this;
    }

    get value() {
        throw new TypeError('Cant extract the valueof a Nothing.');
    }

    getOrElse(other) {
        return other;
    }

    filter() {
        return this.value;
    }

    get isNothing() {
        return true;
    }

    toString() {
        return 'Maybe.Nothing';
    }
}

```