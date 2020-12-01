import {clone,lex,generateCombinations,getVariables,translate,getInitializator,interpret,isUnary,parse} from './utils'
(function () {
    'use strict';
    // let llang = {
    //     _evaluate: function (formula, evaluation, tokens, vars) {
    //         let tree = parse(tokens);
    //         let initializator = getInitializator(vars);
    //         return interpret(tree, initializator.apply(initializator, evaluation));
    //     },
    //     evaluate: function (formula, evaluation) {
    //         console.log('formula',formula,'evaluation',evaluation);
    //         let tokens = lex(formula);
    //         return this._evaluate(formula, evaluation, tokens, getVariables(tokens));
    //     },
    //     evaluateAll: function (formula) {
    //         let tokens = lex(formula);
    //         let vars = getVariables(tokens);
    //         let n = vars.length;
    //         let result = [];
    //         let combinations = generateCombinations(n);
    //
    //         for (let i = 0, count = Math.pow(2, n); i < count; i++) {
    //             result.push(this._evaluate(formula, combinations[i], tokens, vars));
    //         }
    //
    //         return result;
    //     },
    //     _: {
    //         lex: lex,
    //         parse: parse,
    //         getInitializator: getInitializator,
    //         getVariables: getVariables,
    //         interpret: interpret
    //     }
    // };

    if (typeof window != 'undefined') {
        window.llang = llang;
    }

    else {
        module.exports = llang;
    }
})();