<template>
  <cmpStepper
    :steps="steps"
    :step="step"
    :stepError="stepError"
    title="Nueva Compra"
    @close="close"
    @next="nextStep"
  >
    <template #step-1>
      <Qrscan v-on:qrDecoded="onQrDecoded"/>
    </template>
    <template #step-2>
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

    <template #step-3>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              type="number"
              max=48
              min=1
              v-model="args.cuotas"
              label="Numero de Cuotas"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template #step-4>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="args.password" type="password" label="Contraseña">
          </v-text-field>
        </v-col>
      </v-row>
    </template>

    <template #step-5>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <span class="headline">Compra Exitosa!</span>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </cmpStepper>
</template>

<script>
import Qrscan from '@/components/Qrscan.vue';
import Api from '@/mixins/api';
import cmpStepper from '@/components/Stepper.vue';

const API_URL = '/compras';

export default {
  components: {
    cmpStepper,
    Qrscan,
  },
  mixins: [
    Api,
  ],
  data: () => ({
    steps: [
      { title: 'Escanear Código QR', close: true },
      { title: 'Detalles de su Compra', next: true },
      { title: '¿Cuantas Cuotas Desea?', next: true },
      { title: 'Ingrese su Contraseña', next: true },
      { title: 'Resultado de la Operación', close: true },
    ],
    stepError: {},
    step: 1,
    args: {},
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
          args: this.args, // { _id: this.detallesCompra._id, },
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
              this.stepError = {
                title: 'Operación Cancelada',
                details: 'El usuario ha cancelado la operación',
              };
              this.step = 'error';
            }
          });
      } else {
        this.$emit('close',);
        this.dialogMode = 'qr-scan';
        this.dialogTitle = 'Leer Código QR';
        this.detallesCompra = null;
        this.step = 1;
        this.args = {};
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      }
    },
    nextStep() {
      if (this.step === 4) {
        this.send();
      }
      this.step += 1;
    },
    onQrDecoded(id) {
      this.qrval = id;
      this.args._id = id;
      this.scanning = false;
      this.nextStep();
      this.apiCommand({
        url: API_URL,
        command: 'reserve',
        args: this.args,
      })
        .then((result) => {
          switch (result.result) {
            case 255:
              this.dialogTitle = 'Confirmar Operación';
              this.dialogMode = 'customer-confirm';
              this.detallesCompra = result.data;
              break;
            case 450:
              this.stepError = {
                title: 'Operación Rechazada',
                details: 'Fondos Insuficientes',
              };
              this.step = 'error';
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
        args: this.args, /* {
          _id: this.detallesCompra._id,
          password: this.password,
          cuotas: this.cuotas,
        }, */
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
