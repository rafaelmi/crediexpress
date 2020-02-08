<template>
  <v-card>
    <v-toolbar color="blue darken-3" dark>
      <v-toolbar-title>
        {{title}}
      </v-toolbar-title>
      <v-spacer></v-spacer>

<v-btn icon>
  <v-icon>mdi-magnify</v-icon>
</v-btn>

    </v-toolbar>

      <v-stepper v-model="step" vertical>

        <template v-for="(s,i) in steps">
          <v-stepper-step
            :key="`${i+1}-step`"
            :complete="step > i+1"
            :step="i+1"
          >
            {{s.title}}
          </v-stepper-step>

          <v-stepper-content :step="i+1" :key="i">
            <slot :name="'step-'+(i+1)"></slot>
            <v-btn v-if="s.next"
              color="primary"
              @click="$emit('next')"
            >
              Siguiente
            </v-btn>

            <v-btn v-if="s.cancel"
              text
              @click="$emit('cancel')"
            >
              Cancelar
            </v-btn>

            <v-btn v-if="s.close"
              text
              @click="$emit('close')"
            >
              Cerrar
            </v-btn>
          </v-stepper-content>
        <!-- </v-stepper-items> -->
        </template>
      </v-stepper>
  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    steps: Array,
    step: String,
  },
  computed: {
  }
};
</script>
