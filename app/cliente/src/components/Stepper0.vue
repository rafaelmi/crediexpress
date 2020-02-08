<template>
  <v-stepper vertical>
    <!-- <v-stepper-header>
      <template v-for="(s,i) in steps">
        <v-stepper-step
          :key="`${i+1}-step`"
          :complete="step > i+1"
          :step="i+1"
        >
          {{s.title}}
        </v-stepper-step>
        <v-divider
          v-if="i+1 !== steps.length"
          :key="i"
        ></v-divider>
      </template>
    </v-stepper-header> -->

    <template v-for="(s,i) in steps">
      <v-stepper-step
        :key="`${i+1}-step`"
        :complete="step > i+1"
        :step="i+1"
      >
        <slot :name="'step-'+(i+1)+'-header'" :title="title">
          {{title}}
        </slot>
      </v-stepper-step>

    <!-- <v-stepper-items> -->
      <!-- <v-stepper-content v-for="(s,i) in steps" :step="i+1" :key="i"> -->
      <v-stepper-content :step="i+1" :key="i">
        <slot :name="'step-'+(i+1)+'-body'"></slot>

        <slot :name="'step-'+(i+1)+'-footer'" :buttons="buttons"/>
        <v-btn v-if="$slots.${'step-'+(i+1)+'-footer'}.next"
          color="primary"
          @click="$emit('next')"
        >
          Siguiente
        </v-btn>

        <v-btn v-if="$slots.${'step-'+(i+1)+'-footer'}.cancel"
          text
          @click="$emit('cancel')"
        >
          Cancelar
        </v-btn>

        <v-btn v-if="$slots.${'step-'+(i+1)+'-footer'}.close"
          text
          @click="$emit('close')"
        >
          Cancelar
        </v-btn>
      </v-stepper-content>
    <!-- </v-stepper-items> -->
    </template>
  </v-stepper>
</template>

<script>
export default {
  props: {
    steps: Array,
    step: String,
  },
  computed: {
  }
};
</script>
