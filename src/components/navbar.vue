<template>
  <v-card flat>
    <v-bottom-nav fixed :active.sync="bottomNav" :value="true">
      <v-btn to="/landlordHome" color="orange darken-1" flat value="inicio">
        <span>Inicio</span>
        <v-icon>bar_chart</v-icon>
      </v-btn>

      <v-btn to="alquileres" color="orange darken-1" flat value="favorites">
        <span>Alquileres</span>
        <v-icon>home</v-icon>
      </v-btn>

      <v-btn color="orange darken-1" flat value="nearby">
        <span>Agenda</span>
        <v-icon>book</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      bottomNav: "recent"
    };
  }
};
</script>