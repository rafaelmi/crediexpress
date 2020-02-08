<template>
  <v-card
    class="mx-auto"
    max-width="600"
  >
    <v-card-text class="text-justify">
      <span class="title text--primary font-weight-bold">
        CrediExpress es la plataforma que te permite acceder a créditos
        rápidos y sencillos, con las facilidades que otorga una App.
      </span>
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        color="pink"
        dark
        x-large
        rounded
        class="headline font-weight-bold"
        @click="$emit('login')"
      >
        INGRESAR
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: [],
  components: {
  },
  data: () => ({
  }),
  methods: {
  }
};
</script>
