<template>
  <v-card
    class="mx-auto"
    max-width="600"
  >
    <v-card-title>
      <span class="headline font-weight-bold">Bienvenido/a {{user.username}}</span>
    </v-card-title>
    <v-card-text>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>{{user.nombre}}</v-list-item-title>
          <v-list-item-subtitle>Nombre</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>{{user.tipo}}</v-list-item-title>
          <v-list-item-subtitle>Tipo</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>{{(user.cedula+'.X')
              .replace(/\d(?=(\d{3})+\.)/g, '$&.').replace('.X','')}}
          </v-list-item-title>
          <v-list-item-subtitle v-if="user.tipo == 'Comercio'">RUC</v-list-item-subtitle>
          <v-list-item-subtitle v-else>Cédula</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="user.tipo == 'Socio'" two-line>
        <v-list-item-content>
          <v-list-item-title class="headline font-weight-bold">
              {{(user.saldo+'.X')
              .replace(/\d(?=(\d{3})+\.)/g, '$&.').replace('.X','')+' Gs.'}}
          </v-list-item-title>
          <v-list-item-subtitle>Saldo</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    user: Object
  },
  data: () => ({
    error: ''
  }),
  methods: {
  }
};
</script>
