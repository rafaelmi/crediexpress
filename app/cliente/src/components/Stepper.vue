<template>
  <v-card>
    <v-toolbar color="blue darken-3" dark>
      <v-toolbar-title>
        {{title}}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>

    </v-toolbar>

    <template v-for="(s,i) in steps">
      <template v-if="step == i+1">
        <v-card-title :key="i">{{s.title}}</v-card-title>
        <v-card-text :key="i">
          <slot :name="'step-'+(i+1)"></slot>
        </v-card-text>
        <v-card-actions :key="i">
          <v-spacer></v-spacer>
          <v-btn v-if="s.next"
            color="green darken-1"
            dark
            @click="$emit('next')"
          >
            Siguiente >
          </v-btn>

          <v-btn v-if="s.close"
            color="warning"
            dark
            @click="$emit('close')"
          >
            Cerrar <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
      </template>
    </template>

    <template v-if="step == 'error'">
      <v-card-title>{{stepError.title}}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <span class="headline red-text">{{stepError.details}}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          dark
          @click="$emit('close')"
        >
          Cerrar <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
    </template>

  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    steps: Array,
    step: String,
    stepError: Object,
  },
  computed: {
  }
};
</script>
