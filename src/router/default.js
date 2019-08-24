import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Analyze from '../components/pages/Analyze.vue';

export default new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Analyze },
    ]
})
