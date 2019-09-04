/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

window.Vue = require("vue");
window.Form = Form;

import { Form, HasError, AlertError } from 'vform'
import moment from 'moment';
import VueProgressBar from 'vue-progressbar'
// Sweet Alert
import Swal from 'sweetalert2'

import Gate from './Gate'
Vue.prototype.$gate = new Gate(window.user);
Vue.component('pagination', require('laravel-vue-pagination'));

window.Swal = Swal;

const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 3000
})

window.Toast = Toast;
window.evt = new Vue();
// End of Sweet Alert

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

import VueRouter from "vue-router";

Vue.use(VueRouter);

let routes = [{
        path: "/dashboard",
        component: require("./components/Dashboard.vue").default
    },
    {
        path: "/profile",
        component: require("./components/Profile.vue").default
    },
    {
        path: "/users",
        component: require("./components/Users.vue").default
    },
    {
        path: "/developer",
        component: require("./components/Developer.vue").default
    }

];

const router = new VueRouter({
    mode: "history",
    routes // short for `routes: routes`
});

const vueProgressBar = {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '3px'
  }

Vue.use(VueProgressBar, vueProgressBar)

Vue.filter('ProperCase', function(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter('customDate', function(date){
    return moment(date).format('MMMM Do YYYY');
});

Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

Vue.component(
    'not-found',
    require('./components/NotFound.vue').default
);

const app = new Vue({
    el: "#app",
    router
});
