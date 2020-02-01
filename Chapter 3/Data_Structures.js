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
// custom fitler function

function fitler(predicate, items){
    var result = []
    for(let index = 0; index< items.lenth; index++)
    {
        var value = items[index];
        if(predicate(value, index, items))
            result.push(value);
    }
    return result;
}

// custom reduce
function reduce(aggr, items, init) {
    var ans = init;
    for(let index = 0; index< items.lenth; index++)
    {
        ans = aggr(ans, items[index]) 
    }
    return ans;
}

// 3.4 Reasoning about your code
//Declarative and lazy function chains
// The downside of imperative code is that is made to solve one particular problem efficiently
// The lower the level of abstration the lower the probability of resuse and the greater complexity becomes and the more likely 
// errors are prone.
// the imperate=ive way to 
var names = ['alonzo church', 'Haskell curry', 'stephen_kleene', 'John Von Neumann', 'stephen_kleene'];
var result = [];
for (let i = 0; i < names.length; i++) {
    var n = names[i];
    if (n !== undefined && n !== null) {
        var ns = n.replace(/_/, ' ').split(' ');
        for(let j = 0; j < ns.length; j++) {
            var p = ns[j];
            p = p.charAt(0).toUpperCase() + p.slice(1);
            ns[j] = p;
        }
        if (result.indexOf(ns.join(' ')) < 0) {
            result.push(ns.join(' '));
        }
    }
}
result.sort();

// the functional way.
const isValid = n => !!n
_.chain(names)
    .filter(isValid)
    .map(s => s.replace(/_/, ' '))
    .uniq()
    .map(_.startCase)
    .sort()
    .value();


    // the functional way is far more cleaner, simpler and more intuitive.
    // return a country with the highest number of ppl
    const gatherStats = function (stat, country) {
        if(!isValid(stat[country])) {
            stat[country] = {'name': country, 'count': 0};
        }
        stat[country].count++;
        return stat;
    };

_.chain(persons)
    .filter(isValid)
    .map(_.property('address.country'))
    .reduce(gatherStats, {})
    .values()
    .sortBy('count')
    .reverse()
    .first()
    .value()
    .name;
// no varialbe created and no loops at all
// The above is a lazy funtion because nothing executes until the last value() function.
// Fp is great at absrtraction over imperative code

// They is a similarity between FP and Sql, they speak the same query language.

// SELECT p.firstname, p.birthYear FROM Person p
// WHERE p.birthYear > 1903 and p.country IS NOT 'US'
// GROUP BY p.firstname, p.birthYear

// from the above query is clear what you expect from your data.

_.mixin({'select': _.pluck,
         'from': _.chain,
         'where': _.filter,
         'groupBy': _.sortByOrder});


_.from(persons)
    .where(p => p.birthYear > 1900 && p.address.country !== 'US')
    .groupBy(['firstname', 'birthYear'])
    .select('firstname', 'birthYear')
    .value();


// same query in FP,  this is why in .net we have LINQ to SQL

// Recursive
// A recursive function has to main parts
// 1. Base cases/ terminating cases
// 2. Recursive cases

//Recursion and iteration are two sides of the same coin. In the absence of mutation,
//recursion offers a more expressive, powerful, and excellent alternative to iteration.
function sum(arr) {
    if(_.isEmpty(arr)) {
        return 0;
    }
    return _.first(arr) + sum(_.rest(arr));
}



class Node {
    constructor(val) {
        this._val = val;
        this._parent = null;
        this._children = [];
    }

    isRoot() {
        return isValid(this._parent);
    }

    get children() {
        return this._children;
    }

    hasChildren() {
        return this._children.length > 0;
    }

    get value() {
        return this._val;
    }

    set value(val) {
        this._val = val;
    }

    append(child) {
        child._parent = this;
        this._children.push(child);
        return this;
    }
        
    toString() {
        return `Node (val: ${this._val}, children: ${this._children.length})`;
    }
}


class Tree {
    constructor(root) {
        this._root = root;
    }

    static map(node, fn, tree = null) {
        node.value = fn(node.value);
        if(tree === null) {
            tree = new Tree(node);
        }

        if(node.hasChildren()) {
            _.map(node.children, function (child) {
                Tree.map(child, fn, tree);
            });
        }

        return tree;
    }

    get root() {
        return this._root;
    }
}


const church = new Node(new Person('Alonzo', 'Church', '111-11-1111'));
church.append(rosser).append(turing).append(kleene);
kleene.append(nelson).append(constable);
rosser.append(mendelson).append(sacks);
turing.append(gandy);


Tree.map(church, p => p.fullname);