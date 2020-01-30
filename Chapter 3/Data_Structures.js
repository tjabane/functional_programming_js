// The path a program takes to arrive at a solution is known as its control flow.

//Method Chaining
// Is a pattern that all allows multiple methods to be called on the same statement

//example: 

"I am going ".toUpperCase().trim();

// A lot of javascipt functional code is used for handling list because of the origianl FP language LISP (List Processing)

// will use the functional library lodash
// _.map function


_.map(n => n*n, [1,2,3,4,5,6,7,8]); // square all the results

// custom map function

function map(f, items) {
    let results = [];
    for(let i = 0; i< items.lenth; i++)
        result.push(f(i, items[i], items));
    return results;
}



