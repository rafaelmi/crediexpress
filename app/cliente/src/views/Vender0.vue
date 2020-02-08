<template>
  <v-card>
    <v-card-title>
      <span class="headline">Nueva Venta</span>
    </v-card-title>

    <v-card-text>
      <v-container v-if="dialogMode == 'form'">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="editedItem.monto" label="Monto">
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else-if="dialogMode == 'qrcode'">
        <qrcode v-bind:value="qrval.toString()" v-bind:scale="10"/>
      </v-container>
      <v-container v-else-if="dialogMode == 'venta-confirmada'">
        <audio src="beep-07.wav" autoplay="true" ></audio>
        <span class="headline">Operación Aprobada!</span>
      </v-container>
      <v-container v-else-if="dialogMode == 'venta-cancelada'">
        <audio src="beep-07.wav" autoplay="true" ></audio>
        <span class="headline">Operación Cancelada!</span>
      </v-container>
      <v-container v-else-if="dialogMode == 'venta-rechazada'">
        <audio src="beep-07.wav" autoplay="true" ></audio>
        <span class="headline">Operación Rechazada!</span>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="dialogMode == 'form'"
        color="blue darken-1"
        text
        @click="close"
      >
        Cancelar
      </v-btn>
      <v-btn v-else
        color="blue darken-1"
        text
        @click="close"
      >
        Cerrar
      </v-btn>
      <v-btn v-if="dialogMode == 'form'"
        color="blue darken-1" text @click="save">Solicitar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// const API_URL = 'http://localhost:4000/contratos';
import Qrcode from 'vue-qrcode';
import Api from '@/mixins/api';

const API_URL = '/ventas';

export default {
  components: {
    Qrcode,
  },
  mixins: [
    Api,
  ],
  data: () => ({
    dialogMode: 'form',
    qrval: null,
    waitingConfirmation: false,
    ventas: [],
    editedIndex: -1,
    editedItem: {
      monto: '',
    },
    defaultItem: {
      valor: '',
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      setInterval(() => {
        if (this.waitingConfirmation) {
          this.apiCommand({
            url: API_URL,
            command: 'get',
            args: { _id: this.qrval },
          })
            .then((result) => {
              switch (result.data.estado) {
                case 'Aprobado':
                  this.dialogMode = 'venta-confirmada';
                  this.waitingConfirmation = false;
                  break;
                case 'Cancelado':
                  this.dialogMode = 'venta-cancelada';
                  this.waitingConfirmation = false;
                  break;
                case 'Rechazado':
                  this.dialogMode = 'venta-rechazada';
                  this.waitingConfirmation = false;
                  break;
                default:
              }
            });
        }
      }, 5000);
    },
    close() {
      this.$emit('close',);
      this.dialogMode = 'form';
      this.waitingConfirmation = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      // this.editedItem.comercio = 'Farmacia El Alivio';
      /*
      const command = {
        command: 'create',
        args: this.editedItem,
      };
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(command),
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(response => response.json())
        */
      this.apiCommand({
        url: API_URL,
        command: 'create',
        args: this.editedItem,
      })
        .then((result) => {
          if (result.result !== 251) {
            // there was an error...
            const error = result.details
              .map(detail => detail.message)
              .join('. ');
            this.error = error;
          } else {
            this.error = '';
            this.qrval = result.data._id;
            this.dialogMode = 'qrcode';
            this.waitingConfirmation = true;
          }
        });
      // this.close();
    },
  },
};
</script>
