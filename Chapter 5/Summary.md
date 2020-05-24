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
Maybe is used for potentaily null values

```javascript
const safeFindObject = R.curry(function(db, id) {
return Maybe.fromNullable(find(db, id));
});
```

OOP code
```javascript
function getCountry(student){
    const skool = student.school();
    if(skool !== null)
    {
        let addr = school.address();
        if(addr !== null) {
            return addr.country();
        }
    }
    return 'Country does not exist!';
}
```
functional solution using  the maybe monad

```javascript
const getCountry = (student) => student
                                    .map(R.prop('school'))
                                    .map(R.prop('address'))
                                    .map(R.prop('country'))
                                        .getOrElse('Country does not exist!');
```

The either monad is usd when you want to deal with the 


```javascript

class Either 
{
    constructor(value) {
        this._value = value;
    }

    get value() {
        return this._value;
    }
    static left(a) {
        return new Left(a);
    }

    static right(a) {
        return new Right(a);
    }

    static fromNullable(val) {
        return val !== null ? right(val): left(val);
    }

    static of(a){
        return right(a);
    }
}


class Left extends Either {

    map(_) {
        return this;
    }

    get value() {
        throw new TypeError('Cant extract the value of a Left(a).');
    }

    getOrElse(other) {
        return other;
    }

    orElse(f) {
        return f(this.value);
    }

    chain(f) {
        return this;
    }

    getOrElseThrow(a) {
        throw new Error(a);
    }

    filter(f) {
        return this;
    }
    
    toString() {
        return `Either.Left(${this.value})`;
    }
}

class Right extends Either {
    map(f) {
        return Either.of(f(this.value));
    }

    getOrElse(other) {
        return this.value;
    }

    orElse() {
        return this;
    }

    chain(f) {
        return f(this.value);
    }

    getOrElseThrow(_) {
        return this.value;
    }

    filter(f) {
        return Either.fromNullable(f(this.value) ? this.value : null);
    }

    toString() {
        return `Either.Right(${this.value})`;
    }
}
```
Examples using the Either monad

```javascript
const findStudent = safeFindObject(DB('student'));
findStudent('444-44-4444').getOrElse(new Student());
```

IO monad is for handling functions that have side effects in funtional manner.


```javascript
    class IO {
        constructor(effect) {
            if (!_.isFunction(effect)) {
                throw 'IO Usage: function required';
            }
            this.effect = effect;
        }

        static of(a) {
            return new IO(() => a);
        }

        static from(fn) {
            return new IO(fn);
        }

        map(fn) {
            var self = this;
            return new IO(function () {
                return fn(self.effect());
            });
        }

        chain(fn) {
            return fn(this.effect());
        }

        run() {
            return this.effect();
        }


    }
```

A common pattern that occurs with IO is to tuck the impure operation toward the end of the composition. This lets you build programs one step at a time, perform all the necessary business logic, and finally deliver the data on a silver platter for the IO monad to finish the job, declaratively and side effect–free.