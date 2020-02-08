<template>
  <cmpStepper
    :steps="steps"
    :step="step"
    title="Nueva Venta"
    @close="close"
    @next="nextStep"
  >
    <template #step-1>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="editedItem.monto" label="Monto">
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template #step-2>
      <qrcode v-bind:value="qrval.toString()" v-bind:scale="10"/>
    </template>
    <template #step-3>
      <audio src="beep-07.wav" autoplay="true" ></audio>
      <span class="headline">{{resMsg}}</span>
    </template>
  </cmpStepper>
</template>

<script>
// const API_URL = 'http://localhost:4000/contratos';
import Qrcode from 'vue-qrcode';
import Api from '@/mixins/api';
import cmpStepper from '@/components/Stepper.vue';

const API_URL = '/ventas';

export default {
  components: {
    Qrcode,
    cmpStepper,
  },
  mixins: [
    Api,
  ],
  data: () => ({
    steps: [
      { title: '¿Cual es el Valor de la Venta?', next: true },
      { title: 'Escanear Código QR Desde el Dispositivo del Cliente' },
      { title: 'Resultado de la Operación', close: true },
    ],
    step: 1,
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
  computed: {
    resMsg() {
      switch (this.dialogMode) {
        case 'venta-confirmada':
          return 'Operación Aprobada!';
        case 'venta-cancelada':
          return 'Operación Cancelada!';
        case 'venta-rechazada':
          return 'Operación Rechazada!';
        default:
      }
      return '';
    }
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
                  break;
                case 'Cancelado':
                  this.dialogMode = 'venta-cancelada';
                  break;
                case 'Rechazado':
                  this.dialogMode = 'venta-rechazada';
                  break;
                default:
                  return;
              }
              this.waitingConfirmation = false;
              this.nextStep();
            });
        }
      }, 5000);
    },
    nextStep() {
      if (this.step === 1) {
        this.save();
      }
      this.step += 1;
    },
    close() {
      this.$emit('close',);
      this.dialogMode = 'form';
      this.waitingConfirmation = false;
      this.step = 1;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
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
