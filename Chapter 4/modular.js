//method chains and function pipelines

//Chaining methods together
//Unfortunately, it’s contrived and tightly coupled to the owning object
//that confines the number of methods you can apply in the chain
// limits you to usse the number of methods provided.

//4.1.2 Arranging functions in a pipeline

//A pipeline is a directional sequence of functions loosely arraged such that the outout of one function is the input
// of the function


/*
4.2 Requirements for compatible functions
    Functional programming relies solely on pipelines as a method of building programs
    The computation must be carried out in stages, this assumes that the functions input and output are ccompatible.


    Funtions must be compatible in two ways
    1. Type - The type returned by one function must match the input of the receiving function.
    2. Arity - The recieving function must declare at least one input to handle the outout of the previos function.
*/

//Example of two compatible functions.

// trim :: String -> String
const trim = (str) => str.replace(/^\s*|\s*$/g, '');

// normalize :: String -> String
const normalize = (str) => str.replace(/\-/g, '');

normalize(trim(' 444-44-4444 '));

/*
    4.2.2 Functions and arity: the case for tuples

    Arity can be defined as the number of arguments a function accepts; it’s also referred
    to as the function’s length.

    The number of arguments a function defines if directly proportional to its complexitiy
    Pure functions that expect a single argument are the simplest to use because the
    implication is that they serve a single purpose—

    When it comes to transferring data from one function to another tuples provide a better functionality than objects
    and arrays

    Tuples are immutable
    You dont need a predefined object/ class for pass data
    Arrays that contain different data types lead to poor implementations and a lot of validation code.
*/


const Tuple = function( /* types */ ) {
    const typeInfo = Array.prototype.slice.call(arguments, 0);
    const _T = function( /* values */ ) {
        const values = Array.prototype.slice.call(arguments, 0);
        if(values.some((val) =>
            val === null || val === undefined)) {
            throw new ReferenceError('Tuples may not have any null values');
        }
        if(values.length !== typeInfo.length) {
            throw new TypeError('Tuple arity does not match its prototype');
    }
    values.map(function(val, index) {
        this['_' + (index + 1)] = checkType(typeInfo[index])(val);
    }, this);
        Object.freeze(this);
    };
    _T.prototype.values = function() {
        return Object.keys(this).map(function(k) {
        return this[k];
    }, this);
    };
    return _T;
};


/*
    4.3 Curried function evaluation


    curried function is one where all arguments have been explicitly
    defined so that, when called with a subset of the arguments, it returns a new function
    that waits for the rest of the parameters to be supplied before running.

    Is the technique of  converting a multivariate function into a stepwise unary functions by suspending its excution
    until all the parameters have been supplied.

    curry(f) :: (a,b,c) -> f(a) -> f(b)-> f(c)

    Example: const  add = (a) => (b) => a + b;
*/
function curry2(fn) {
    return function(firstArg) {
        return function(secondArg) {
            return fn(firstArg, secondArg);
        };
    };
}

const curry3 = (fn) => (arg1) => (arg2) => (arg3) => fn(arg1, arg2, arg3)


const name = curry2(function (last, first) {
    return `${last} ${first}`;
});


const checkType = curry2(function(typeDef, actualType) {
    if(R.is(typeDef, actualType)) {
        return actualType;
    }
    else {
        throw new TypeError('Type mismatch.Expected [' + typeDef + '] but found [' + typeof actualType + ']');
    }
        
});

/* The number of arguments declared is then created into a number of nested functions */



/*
    4.3.1 Emulating function factories

    using currying to i,plement the factory pattern from OOP 

    // fetchStudentFromDb :: DB -> (String -> Student)
    const fetchStudentFromDb = R.curry(function (db, ssn) {
        return find(db, ssn);
    });


    // fetchStudentFromArray :: Array -> (String -> Student)
    const fetchStudentFromArray = R.curry(function (arr, ssn) {
    return arr[ssn];
    });

    Because functions are curried we can separate the function dfinition from evaluation 
    with the generic factory method findStudent.


    const findStudent = useDb ? fetchStudentFromDb(db)
                                :fetchStudentFromArray(arr);
    findStudent can be passed to other modules without the caller knowing the concrete implementation. 
    This will be useful regarding unit testing.



    4.3.2 Implementing reusable function templates


    Function templates define a family of related functions based on the number of arguments that are curried
    at the moment of creation.

    Creating a logger function template

*/


const logger = function(appender, layout, name, level, message) {
    const appenders = {
        'alert': new Log4js.JSAlertAppender(),
        'console': new Log4js.BrowserConsoleAppender()
        };

    const layouts = {
            'basic': new Log4js.BasicLayout(),
            'json': new Log4js.JSONLayout(),
            'xml' : new Log4js.XMLLayout()
            };

    const appender = appenders[appender];
    appender.setLayout(layouts[layout]);
    const logger = new Log4js.getLogger(name);
    logger.addAppender(appender);
    logger.log(level, message, null);
}

/*
    By currying logger you can manage and resue different configs of logger.
*/

const log = R.curry(logger)('alert', 'json', 'FJS');

log('ERROR', 'Error condition detected!!');

const logError = R.curry(logger)('console', 'basic', 'FJS', 'ERROR');
logError('Error code 404 detected!!');
logError('Error code 402 detected!!');

/*
    The fact that you’re able to create new functions from existing
    ones and pass any number of parameters to them leads to easily building functions in
    steps as arguments are defined.

    This leads to creating function template based on the number of arguments provided, it will make for quite 
    flexible code and great resue.
*/