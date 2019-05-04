<template>
  <div class="alquileres">
    <div class="alquileresWrapp">
      <h1>Propiedades</h1>

      <v-card
        hover
        position="relative"
        v-for="(piso, index) in propiedades"
        :key="index"
        class="propiedadThumbnail"
        v-on:click="haciaAlquiler(piso)"
      >
        <h3>{{piso.nombre}}</h3>
        <div class="estado">
          <div class="innerstate">
            <h4>Estado:</h4>
            <p v-if="piso.estado == 'Alquilado'" style="color:green">{{piso.estado}}</p>
            <p v-else style="color:red">{{piso.estado}}</p>
          </div>
          <div class="outerstate">
            <h4>Renta:</h4>
            <p>{{piso.cantidad}} €</p>
          </div>
        </div>
        <!--   I C O N O S   I N D I C A D O R E S  -->
        <v-btn v-if="piso.problemas" class="botonAlarma" small dark fab top right color="red">
          <v-icon>notification_important</v-icon>
        </v-btn>
      </v-card>
      <div style="display:grid" class="iconWrap">
        <v-icon class="icono" color="orange" v-on:click="newHouse()">add</v-icon>
      </div>
    </div>
    <navbar/>
  </div>
</template>

<script>
import navbar from "../../components/navbar.vue";
export default {
  data() {
    return {
      propiedades: {}
    };
  },
  mounted() {

    if (this.$store.getters.alquileres == null) {
      this.propiedades = new Object();
    } else {
      this.propiedades = this.$store.getters.alquileres;
    }
  },
  methods: {
    haciaAlquiler(event) {
      this.$store.commit("setTemplate", event.nombre);
      this.$router.push("/template");
    },
    newHouse() {
      this.$router.push("/newHouse");
    }
  },
  computed: {},
  components: {
    navbar
  }
};
</script>

<style scoped>
.alquileres {
  background-image: url("../../assets/fotos/backgroundTemplate.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.alquileresWrapp {
  height: 100vh;
  overflow-y: scroll;
}
.alquileresWrapp h1 {
  padding-top: 1rem;
  text-align: center;
  border-bottom: 2px solid orange;
  padding-bottom: 0.5rem;
  margin: 0 7rem;
  font-family: "Libre Baskerville", serif;
}

.propiedadThumbnail {
  margin: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  cursor: pointer;
}

.propiedadThumbnail h4 {
  margin-top: 1rem;
}

.estado {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.botonAlarma {
  position: absolute;
}

.icono {
  justify-self: center;
  font-size: 2.5rem;
  margin-bottom: 5rem;
}
</style>
