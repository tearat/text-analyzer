import Vue from 'vue';

import router from './router/router.js';

import Root from './components/Root.vue';

new Vue({
    el: '#app',
    router,
    components: { Root },
    template: '<Root/>'
})
