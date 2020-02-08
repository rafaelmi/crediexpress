<template>
  <v-stepper-step
    :complete="currentStep > step"
    :step="step"
  >
    {{title}}
  </v-stepper-step>

  <v-stepper-content :step="step">
    <slot></slot>

    <v-btn v-if="next"
      color="primary"
      @click="$emit('next')"
    >
      Siguiente
    </v-btn>

    <v-btn v-if="cancel"
      text
      @click="$emit('cancel')"
    >
      Cancelar
    </v-btn>

    <v-btn v-if="close"
      text
      @click="$emit('close')"
    >
      Cerrar
    </v-btn>
  </v-stepper-content>

</template>

<script>
export default {
  props: {
    step: Number,
    currentStep: Number,
    title: String,
    next: Boolean,
    cancel: Boolean,
    close: Boolean,
  },
};
</script>
