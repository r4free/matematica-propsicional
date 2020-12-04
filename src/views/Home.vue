<template>
    <div class="home">
        <div>
            <h1 class="h4 font-weight-bold mb-2">Testador de proposições</h1>
        </div>

        p:
        <el-checkbox v-model="p.value" class="ml-2">
            {{p.value ? 'Verdadeiro':'Falso'}}
        </el-checkbox>

        q:
        <el-checkbox v-model="q.value" class="ml-2">
            {{q.value ? 'Verdadeiro':'Falso'}}
        </el-checkbox>

        r:
        <el-checkbox v-model="r.value" class="ml-2">
            {{r.value ? 'Verdadeiro':'Falso'}}
        </el-checkbox>

        <div class="d-flex justify-content-center ">
            <div class="mt-4 text-uppercase">
                Expressão:
                <el-input v-model="expression" class="w-50 text-uppercase" clearable></el-input>
            </div>
        </div>
        <p class="mt-4" v-if="expression.length>4">Resultado da expressão:
            <span :class="evaluation?'text-success':'text-danger'">
                {{evaluation?'Verdadeira':'Falsa'}}
                <i class="ml-2" :class="evaluation?'el-icon-check':'el-icon-close'"></i>
            </span>
        </p>
        <p class="text-muted text-lowercase">
            Expressão matemática: {{translateExpression}}
        </p>
        <p class="text-muted text-lowercase" v-if="showHumanRead">
            Em linguagem escrita: {{translateForHumans}}
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
                        <p title="dizer que uma proposição não pode ser simultaneamente verdadeira e falsa é sempre verdadeiro">
                            Princípio da não contradição:
                            <el-button @click="expression = '! p|!p'">~(p ^ ~p)</el-button>
                        </p>
                        <p title="dizer que uma proposição ou é verdadeira ou é falsa é sempre verdadeiro">Princípio do
                            terceiro excluído:
                            <el-button @click="expression = ' p | !p'">p | ~p</el-button>
                        </p>

                        <p title="dizer que uma proposição não pode ser simultaneamente verdadeira e falsa é sempre verdadeiro">
                            contradição:
                            <el-button @click="expression = 'p & !p'">p ^ ~p</el-button>
                        </p>

                        <p title="dizer que uma proposição não pode ser simultaneamente verdadeira e falsa é sempre verdadeiro">
                            contradição 1:
                            <el-button @click="expression = '!p & p & !q'">~p ^ (p ^ ~q)</el-button>
                        </p>

                        <p title="É toda proposição composta cuja a última coluna da sua tabela-verdade figuram as letras V e F cada uma pelo menos uma vez.">
                            Contingencia:
                            <el-button @click="expression = 'p -> !p'">p -> ~p</el-button>
                        </p>

                        <p title="É toda proposição composta cuja a última coluna da sua tabela-verdade figuram as letras V e F cada uma pelo menos uma vez.">
                            Contingencia 2:
                            <el-button @click="expression = 'p -> q | !p'">p -> q | ~p</el-button>
                        </p>

                    </el-collapse-item>
                    <el-collapse-item title="Tabela verdade" name="3">
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col" v-if="variables.includes('P')">P</th>
                                <th scope="col" v-if="variables.includes('Q')">Q</th>
                                <th scope="col" v-if="variables.includes('R')">R</th>
                                <th scope="col" v-if="variables.includes('P') && variables.includes('Q')">P & Q</th>
                                <th scope="col" v-if="variables.includes('P') && variables.includes('Q')">P | Q</th>
                                <th scope="col" v-if="variables.includes('P') && variables.includes('Q')">P -> Q</th>
                                <th scope="col" v-if="variables.includes('P') && variables.includes('R')">P & R</th>
                                <th scope="col" v-if="variables.includes('P') && variables.includes('R')">P | R</th>
                                <th scope="col" v-if="variables.includes('P') && variables.includes('R')">P -> R</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="combination in combinations">
                                <th v-if="variables.includes('P')">{{!!combination[0]}}</th>
                                <th v-if="variables.includes('Q')">{{!!combination[1]}}</th>
                                <th v-if="variables.includes('R')">{{!!combination[2]}}</th>
                                <!--p q-->
                                <th v-if="variables.includes('P') && variables.includes('Q')">
                                    {{!!(combination[0]&&combination[1])}}
                                </th>
                                <th v-if="variables.includes('P') && variables.includes('Q')">
                                    {{!!(combination[0]||combination[1])}}
                                </th>
                                <th v-if="variables.includes('P') && variables.includes('Q')">{{!!(combination[0] &&
                                    combination[1]) || (!combination[0] && !combination[1])}}
                                </th>
                                <!-- pr-->
                                <th v-if="variables.includes('P') && variables.includes('R')">
                                    {{!!(combination[0]&&combination[2])}}
                                </th>
                                <th v-if="variables.includes('P') && variables.includes('R')">
                                    {{!!(combination[0]||combination[2])}}
                                </th>
                                <th v-if="variables.includes('P') && variables.includes('R')">{{!!(combination[0] &&
                                    combination[2]) || (!combination[0] && !combination[2])}}
                                </th>

                            </tr>
                            </tbody>
                        </table>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>

        <p class="text-muted" v-if="showHumanRead">
            {{translateForHumans}}
        </p>

        <!--DEBUG -->
        <el-button @click="showDev=true">Desenvolvimento</el-button>
        <el-dialog
                title="Warning"
                :visible.sync="showDev"
                :fullscreen="true"
                center
        >
            p:
            <el-checkbox v-model="p.value" class="ml-2">
                {{p.value ? 'Verdadeiro':'Falso'}}
            </el-checkbox>

            q:
            <el-checkbox v-model="q.value" class="ml-2">
                {{q.value ? 'Verdadeiro':'Falso'}}
            </el-checkbox>

            r:
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

            <div>
                Tokens (lex):
                <vue-json-pretty :data="tokens"/>
            </div>
            <div>
                Parse:
                <vue-json-pretty :data="parse"/>
            </div>
            <div>
                Variables:
                <vue-json-pretty :data="variables"/>
            </div>
            <div>
                Combinations:
                <vue-json-pretty :data="combinations"/>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {generateCombinations, getInitializator, getVariables, interpret, lang, lex, parse} from "../utils"

    import VueJsonPretty from 'vue-json-pretty'
    import 'vue-json-pretty/lib/styles.css'

    export default {
        components: {
            VueJsonPretty,
        },
        name: 'Home',
        data() {
            return {
                showDev: false,
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
        methods: {
            getVariables,
            lex,
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

                    .replaceAll('!Q ', this.q.text.replace("é", " não é ").replace("são", " não são"))
                    .replace('Q ', this.q.text)

                    .replace('!R ', this.r.text.replace("é", " não é ").replace("são", " não são"))
                    .replace('R ', this.r.text)

                    .replace('|', ' ou ')
                    .replace('->', ' então ')
            },
            evaluation() {
                let ev;
                const values = [];
                if (this.p.value)
                    values.push(this.p.value);
                if (this.q.value)
                    values.push(this.q.value);
                if (this.r.value)
                    values.push(this.r.value);
                try {
                    ev = this.lang.evaluate(this.expression, values);
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
            },
            /*DEBUG*/
            evaluate() {
                return this.lang._evaluate()
            },
            tokens() {
                return this.lex(this.expression);
            },
            parse() {
                return parse(this.tokens);
            },
            variables() {
                return this.getVariables(this.tokens)
            },
            substitutions() {
                return {}
                // return getInitializator(this.variables)
            },
            combinations() {
                return generateCombinations(this.variables.length)
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
        text-transform: lowercase;
    }
</style>