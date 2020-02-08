import Vue from 'vue';
import VueRouter from 'vue-router';
import Afiliados from '@/views/Afiliados.vue';
import Comercios from '@/views/Comercios.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/afiliados',
    name: 'afiliados',
    component: Afiliados,
  },
  {
    path: '/comercios',
    name: 'comercios',
    component: Comercios,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
