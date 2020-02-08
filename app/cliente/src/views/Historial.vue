<template>
  <Table
    :title="title"
    :headers="headers"
    :dateFields="dateFields"
    :moneyFields="moneyFields"
    v-model="tableUpdate"
    :apiUrl="apiUrl"
  >
  </Table>
</template>

<script>
import Table from '@/components/Table.vue';

const API_URL = '/';

export default {
  components: {
    Table,
  },
  model: {
    prop: 'update',
    event: 'updated',
  },
  props: {
    type: String,
    update: Boolean,
  },
  computed: {
    title() {
      return this.type === 'ventas' ? 'Mis Ventas' : 'Mis Compras';
    },
    headers() {
      const headers = [
        {
          text: 'Id',
          align: 'left',
          sortable: false,
          value: '_id',
        },
        { text: 'Fecha de Creación', value: 'fechaCreacion' },
        { text: 'Monto', align: 'end', value: 'monto' },
        { text: 'Estado', value: 'estado' },
      ];
      if (this.type === 'compras') {
        headers.push({ text: 'No. de Cuotas', align: 'end', value: 'cuotas' });
        headers.push({ text: 'Comercio', value: 'comercioNombre' });
      }
      return headers;
    },
    apiUrl() {
      return API_URL + this.type;
    },
    tableUpdate: {
      get() {
        return this.update;
      },
      set() {
        this.$emit('updated', false);
      }
    }
  },
  data: () => ({
    // apiUrl: API_URL,
    dateFields: [
      'fechaCreacion',
    ],
    moneyFields: [
      'monto',
    ],
  }),
};
</script>
