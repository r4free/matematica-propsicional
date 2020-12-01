import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        propositions: [
            {
                text: 'O programa é bonito',
                value: true,
            }
        ],
    },
    mutations: {},
    actions: {},
    modules: {}
})
