export function isSpecial(c) {
    return /[<>\-|&!]/.test(c);
}

export function isWhiteSpace(c) {
    return /\s/.test(c);
}

export function isExpressionBoundary(c) {
    return /[\(\)]/.test(c);
}

export function operatorExists(op) {
    return ['!', '|', '&', '->', '<->'].indexOf(op) !== -1;
}

export function unrecognizedToken(token, position) {
    throw new Error('Unrecognized token "' + token + '" on position ' + position + '!');
}

export function isVariable(c) {
    return /[A-Za-z]/.test(c);
}

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function lex(input) {
    let pointer = 0;
    let tokens = [];
    let c;
    let operator = '';

    while (next()) {
        if (isSpecial(c)) {
            operator += c;
            if (operatorExists(operator)) {
                push('operator', operator);
                operator = '';
            }
        } else {
            if (operator.length) unrecognizedToken(operator, pointer - operator.length - 1);

            if (isWhiteSpace(c)) continue;
            else if (isVariable(c)) push('variable', c.toUpperCase());
            else if (isExpressionBoundary(c)) push('boundary', c);
            else unrecognizedToken(c, pointer - 2);
        }
    }

    return tokens;

    function next() {
        return (c = input[pointer++]);
    }

    function push(type, value) {
        tokens.push({
            type: type,
            value: value
        });
    }

}

//for n = 2 it returns
// [ 0, 0 ]
// [ 0, 1 ]
// [ 1, 0 ]
// [ 1, 1 ]
export function generateCombinations(n) {
    console.log('generating combinations ...');
    let combs = [];
    let comb;
    let str;

    for (let i = 0; i < Math.pow(2, n); i++) {
        str = i.toString(2);
        comb = [];

        for (let j = 0; j < n; j++)
            comb.push(j < n - str.length ? 0 : +str[j - n + str.length]);

        combs.push(comb.slice(0));
    }
    console.log('Combinations generated ...', combs);
    return combs;
}

/*
* token model  = {type:'variable|operator|boundary',value:'string'}
* tokens model = [token,token,]
*
* */
export function getVariables(tokens) {
    console.log(typeof tokens, tokens)
    tokens = clone(tokens);
    let token;
    let variables = [];

    while (next()) {
        if (token.type == 'variable') {
            variables.push(token.value);
        }
    }

    return variables.sort(function (a, b) {
        return a > b ? 1 : -1;
    }).filter(function (item, index, arr) {
        return arr.indexOf(item) == index;
    });

    function next() {
        //TODO: use pointer instead of shifting
        //(parse would not need to clone tokens array)
        return (token = tokens.shift());
    }
}


export function translate(operator) {
    let map = {
        '!': 'negation',
        '|': 'disjunction',
        '&': 'conjunction',
        '->': 'implication',
        '<->': 'equivalence'
    };

    return map[operator] || operator;
}

/*
* variables = ['P','Q']
*
* */
export function getInitializator(variables) {
    console.log('variables', variables);
    return function () {
        let substitutions = {};
        let values = arguments;

        variables.forEach(function (primitive, index) {
            substitutions[primitive] = !!values[index];
        });
        console.log('substitutions', substitutions);
        return substitutions;
    };
}

export function interpret(tree, substitutions) {
    console.log('tree', tree);
    tree = clone(tree);
    const actions = {
        substitution: function (args) {
            return substitutions[args[0]];
        },
        negation: function (args) {
            return !args[0];
        },
        disjunction: function (args) {
            return args[0] || args[1];
        },
        conjunction: function (args) {
            return args[0] && args[1];
        },
        implication: function (args) {
            return !args[0] || args[1];
        },
        equivalence: function (args) {
            return (args[0] && args[1]) || (!args[0] && !args[1]);
        }
    };

    return process(tree.action, tree.args);

    function process(action, args) {
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] == 'object') args[i] = process(args[i].action, args[i].args);
        }

        return actions[action](args);
    }
}


export function isUnary(op) {
    return op === '!';
}

export function parse(tokens) {
    console.log('parse tokens', tokens);
    tokens = clone(tokens);
    let token;
    return process();

    function process(operation) {
        operation = operation || null;
        let args = [];

        while (next()) {
            if (token.type == 'boundary') {
                if (token.value == '(') args.push(process());
                else if (token.value == ')') return node(operation, args);
            } else if (token.type == 'variable') {
                args.push(node('substitution', [token.value]));
                if (isUnary(operation)) return node(operation, args);
            } else if (token.type == 'operator') {
                if (isUnary(token.value)) {
                    args.push(process(token.value));
                    continue;
                }

                if (operation) {
                    var tmp = args.slice(0);
                    args = [];
                    args.push(node(operation, tmp));
                }

                operation = token.value;
            }
        }

        return node(operation, args);
    }

    function next() {
        //TODO: use pointer instead of shifting
        //(parse would not need to clone tokens array)
        return (token = tokens.shift());
    }

    function node(action, args) {
        return {
            action: translate(action),
            args: args
        };
    }


    function syntaxError() {
        throw new Error('Syntax error!');
    }
}

export const lang = {
    _evaluate: function (formula, evaluation, tokens, vars) {
        let tree = parse(tokens);
        let initializator = getInitializator(vars);
        return interpret(tree, initializator.apply(initializator, evaluation));
    },
    evaluate: function (formula, evaluation) {
        console.log('formula', formula, 'evaluation', evaluation);
        let tokens = lex(formula);
        return this._evaluate(formula, evaluation, tokens, getVariables(tokens));
    },
    evaluateAll: function (formula) {
        let tokens = lex(formula);
        let vars = getVariables(tokens);
        let n = vars.length;
        let result = [];
        let combinations = generateCombinations(n);

        for (let i = 0, count = Math.pow(2, n); i < count; i++) {
            result.push(this._evaluate(formula, combinations[i], tokens, vars));
        }

        return result;
    },
    _: {
        lex,
        parse,
        getInitializator,
        getVariables,
        interpret,
    }
};