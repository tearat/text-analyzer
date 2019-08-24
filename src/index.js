import Vue from 'vue';

import router from './router/default.js';

import Root from './components/Root.vue';

require('./public/style/main.less');

new Vue({
    el: '#app',
    router,
    components: { Root },
    template: '<Root/>'
})

console.log("Frontend (DEV) server started on port: 9001");