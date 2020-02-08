<template>
  <Stepper :steps="steps">
    <template #step-1-header="{ title }">Escanear Código QR</template>
    <template #step-1-body>
      <Qrscan v-on:qrDecoded="onQrDecoded"/>
    </template>
    <template #step-1-footer="{ buttons }">{{ ["next", "cancel", "close"] }}
    </template>
    <template #step-2-header="{ title }">Detalles</template>
    <template #step-2-body>
        <audio src="beep-07.wav" autoplay="true" ></audio>
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{detallesCompra._id}}</v-list-item-title>
              <v-list-item-subtitle>id</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                {{new Date(detallesCompra.fechaCreacion).toLocaleString()}}
              </v-list-item-title>
              <v-list-item-subtitle>Fecha</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{detallesCompra.comercioNombre}}</v-list-item-title>
              <v-list-item-subtitle>Comercio</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                {{(detallesCompra.monto+'.X')
                  .replace(/\d(?=(\d{3})+\.)/g, '$&.').replace('.X','')+' Gs.'}}
              </v-list-item-title>
              <v-list-item-subtitle>Valor</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
    </template>

    <template #step-3-header="{ title }">Cuotas</template>
    <template #step-3-body>
    </template>

    <template #step-4-header="{ title }">Autenticación</template>
    <template #step-4-body>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="password" type="password" label="Contraseña">
          </v-text-field>
        </v-col>
      </v-row>
    </template>

    <template #step-5-header="{ title }">Confirmación</template>
    <template #step-5-body>
      <v-container v-if="dialogMode == 'compra-confirmada'">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="headline">Compra Exitosa!</span>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else-if="dialogMode == 'compra-cancelada'">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="headline red-text">El usuario ha cancelado la operación</span>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else-if="dialogMode == 'compra-rechazada'">
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="headline red-text">Fondos insuficientes</span>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </Stepper>
</template>

<script>
import Qrscan from '@/components/Qrscan.vue';
import Api from '@/mixins/api';
import Stepper from '@/components/Stepper.vue';

const API_URL = '/compras';

export default {
  components: {
    Stepper,
    Qrscan,
  },
  mixins: [
    Api,
  ],
  data: () => ({
    steps: [
      { title: 'Escaneo QR', cancel: true },
      { title: 'Detalles', cancel: true },
      { title: 'Cuotas', next: true, cancel: true },
      { title: 'Autenticación', next: true, cancel: true },
      { title: 'Confirmación', close: true },
    ],
    step: 1,
    scanning: true,
    dialogMode: 'qr-scan',
    dialogTitle: 'Leer Código QR',
    qrval: null,
    detallesCompra: {},
    password: null,
    compras: [],
    editedIndex: -1,
    editedItem: {
      password: '',
    },
    defaultItem: {
      password: '',
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    close() {
      if (this.dialogMode === 'customer-confirm') {
        this.apiCommand({
          url: API_URL,
          command: 'cancel',
          args: { _id: this.detallesCompra._id, },
        })
          .then((result) => {
            if (result.result !== 200) {
              // there was an error...
              const error = result.details
                .map(detail => detail.message)
                .join('. ');
              this.error = error;
            } else {
              this.error = '';
              this.detallesCompra = null;
              this.dialogTitle = 'Operación Cancelada';
              this.dialogMode = 'compra-cancelada';
            }
          });
      } else {
        this.$emit('close',);
        this.dialogMode = 'qr-scan';
        this.dialogTitle = 'Leer Código QR';
        this.detallesCompra = null;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      }
    },
    onQrDecoded(id) {
      this.qrval = id;
      this.scanning = false;
      this.steps[0].next = true;
      this.apiCommand({
        url: API_URL,
        command: 'reserve',
        args: { _id: id, },
      })
        .then((result) => {
          switch (result.result) {
            case 255:
              this.dialogTitle = 'Confirmar Operación';
              this.dialogMode = 'customer-confirm';
              this.detallesCompra = result.data;
              break;
            case 450:
              this.dialogTitle = 'Operación Rechazada';
              this.dialogMode = 'compra-rechazada';
              break;
            default:
          }
        });
    },
    confirm() {
      this.dialogMode = 'ask-password';
    },
    send() {
      const command = {
        url: API_URL,
        command: 'confirm',
        args: {
          _id: this.detallesCompra._id,
          password: this.password,
        },
      };
      this.password = null;
      this.apiCommand(command)
        .then((result) => {
          if (result.result !== 250) {
            // there was an error...
            this.detallesCompra = null;
            this.dialogTitle = 'Operación Rechazada';
            this.dialogMode = 'compra-rechazada';
          } else {
            this.error = '';
            this.detallesCompra = null;
            this.dialogMode = 'compra-confirmada';
          }
        });
    },
  },
};
</script>
