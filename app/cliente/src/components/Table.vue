<template>
  <v-data-table
    :headers="headers"
    :items="updatedItems"
    item-key="_id"
    sort-by="_id"
    sort-desc
    class="elevation-1 blue lighten-5"
  >
    <!--<template v-slot:item.monto="{ value }">
      {{ (value+'.X').replace(/\d(?=(\d{3})+\.)/g, '$&.').replace('.X','')+' Gs.' }}
    </template> -->

    <template v-slot:top>
      <v-toolbar flat color="blue lighten-4">
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      <span style="color:red">No hay registros</span>
    </template>
  </v-data-table>
</template>

<script>
import Api from '@/mixins/api';

export default {
  components: {
    // Qrcode,
  },
  mixins: [
    Api,
  ],
  model: {
    prop: 'update',
    event: 'updated'
  },
  props: {
    headers: Array,
    dateFields: Array,
    moneyFields: Array,
    title: String,
    update: Boolean,
    apiUrl: String,
  },
  computed: {
    updatedItems() {
      if (this.update) {
        this.$emit('updated', false);
        this.getAll();
      }
      return this.items;
    },
  },
  created() {
    this.initialize();
  },
  data: () => ({
    items: [],
  }),
  methods: {
    initialize() {
      this.getAll();
    },
    getAll() {
      /*
      const command = {
        command: 'getAll',
        args: {},
      };
      fetch(this.apiUrl, {
        method: 'POST',
        body: JSON.stringify(command),
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(response => response.json())
        */
      this.apiCommand({
        url: this.apiUrl,
        command: 'getAll',
        args: {},
      })
        .then((result) => {
          this.items = result.data.map((item) => {
            this.dateFields.forEach((field) => {
              item[field] = new Date(item[field]).toLocaleString();
            });
            this.moneyFields.forEach((field) => {
              item[field] = `${item[field]}.X`
                .replace(/\d(?=(\d{3})+\.)/g, '$&.')
                .replace('.X', '') + ' Gs.';
            });
            return item;
          });
        });
    }
  },
};
</script>
