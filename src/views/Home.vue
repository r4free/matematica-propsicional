<template>
    <div class="home">
        <div>
            <h1 class="h4 font-weight-bold mb-2">Testador de proposições</h1>
        </div>

        P:
        <el-checkbox v-model="p.value" class="ml-2">
            {{p.value ? 'Verdadeiro':'Falso'}}
        </el-checkbox>

        Q:
        <el-checkbox v-model="q.value" class="ml-2">
            {{q.value ? 'Verdadeiro':'Falso'}}
        </el-checkbox>

        R:
        <el-checkbox v-model="r.value" class="ml-2">
            {{r.value ? 'Verdadeiro':'Falso'}}
        </el-checkbox>

        <div class="d-flex justify-content-center ">
            <div class="mt-4 text-uppercase">
                Expressão:
                <el-input v-model="expression" class="w-50 text-uppercase"></el-input>
            </div>
        </div>
        <p class="mt-4">Resultado da expressão:
            <span :class="evaluation?'text-success':'text-danger'">
                {{evaluation?'Verdadeira':'Falsa'}}
                <i class="ml-2" :class="evaluation?'el-icon-check':'el-icon-close'"></i>
            </span>
        </p>
        <p class="text-muted">
            Expressão matemática: {{translateExpression}}
        </p>

        <div class="d-flex justify-content-center ">
            <div class="w-50">
                <el-collapse v-model="ActiveTab">
                    <el-collapse-item title="Tradutor" name="1">
                        Expressão de P:
                        <el-input v-model="p.text" class="border rounded "
                                  :class="p.value?'border-success':'border-danger'"></el-input>
                        Expressão de Q:
                        <el-input v-model="q.text" class="border rounded "
                                  :class="q.value?'border-success':'border-danger'"></el-input>
                        Expressão de R:
                        <el-input v-model="r.text" class="border rounded "
                                  :class="r.value?'border-success':'border-danger'"></el-input>
                        <el-checkbox v-model="showHumanRead" class="ml-2">
                            Mostrar para humanos (LOL)
                        </el-checkbox>
                    </el-collapse-item>
                    <el-collapse-item title="Tautologia, Contradição e Contingência" name="2">

                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <p>
            {{evaluationAll}}
        </p>

        <p class="text-muted" v-if="showHumanRead">
            {{translateForHumans}}
        </p>

    </div>
</template>

<script>
    import {generateCombinations, getInitializator, getVariables, interpret, lang, lex, parse} from "../utils"

    export default {
        name: 'Home',
        data() {
            return {
                ActiveTab: 0,
                showHumanRead: false,
                p: {
                    value: false,
                    text: 'são poucos trabalhos'
                },
                q: {
                    value: false,
                    text: 'o político é honesto'
                },
                r: {
                    value: false,
                    text: 'a terra é plana'
                },
                expression: 'P | Q',
                lang: {
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
                        interpret
                    }
                },
            }
        },
        computed: {
            translateExpression() {
                return this.expression
                    .replaceAll('&', '^')
                    .replaceAll('|', 'v')
                    .replaceAll('!', '~')
            },
            translateForHumans() {
                return this.expression
                    .replaceAll('&', ' e ')

                    .replaceAll('!P ', this.p.text.replace("é", " não é ").replace("são", " não são"))
                    .replace('P ', this.p.text)

                    .replace('!Q ', this.q.text.replace("é", " não é ").replace("são", " não são"))
                    .replace('Q ', this.q.text)

                    .replace('!R ', this.r.text.replace("é", " não é ").replace("são", " não são"))
                    .replace('R ', this.r.text)

                    .replace('|', ' ou ')
                    .replace('->', ' então ')
            },
            evaluation() {
                let ev;
                try {
                    ev = this.lang.evaluate(this.expression, [this.p.value, this.q.value, this.r.value]);
                } catch (e) {
                    ev = false;
                }
                return ev;
            },
            evaluationAll() {
                let ev;
                try {
                    ev = this.lang.evaluateAll(this.expression);
                } catch (e) {
                    ev = [];
                }
                return ev;
            }
        },
        // watch: {
        //     expression(value, old) {
        //         this.expression =  ['P','Q','R',' ','!', '|', '&', '->', '<->'].indexOf(value[value.length-1]) !== -1 ? value:old;
        //     }
        // }
    }
</script>
<style>
    input {
        text-transform: capitalize;
    }
</style>