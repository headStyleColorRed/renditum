<template>
  <div class="alquileres">
    <div class="alquileresWrapp">
      <h1>Propiedades</h1>

      <v-card hover position="relative" v-for="(piso, index) in propiedades" :key="index" class="propiedadThumbnail" v-on:click="haciaAlquiler(piso)">
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
         <v-btn
         v-if="piso.problemas"
         class="botonAlarma"
              small
              dark
              fab
              top
              right
              color="red"
            >
              <v-icon>notification_important</v-icon>
            </v-btn>
      </v-card>
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
    this.propiedades = this.$store.state.tenantModule.alquileres.propiedades;
  },
  methods: {
      haciaAlquiler(event){
        if (event.estado == "Alquilado") {
          this.$store.commit("setTemplate", event.nombre);
          this.$router.push("/template");
        }
      }
  },
  computed: {},
  components: {
    navbar
  }
};
</script>

<style scoped>
.alquileresWrapp h1 {
  padding-top: 1rem;
  text-align: center;
}
.alquileres {
  background-color: beige;
  height: 100vh;
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

.botonAlarma{
    position: absolute;
}
</style>
