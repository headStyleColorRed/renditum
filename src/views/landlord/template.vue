<template>
  <div class="alquileres">
    <div class="alquileresWrapp">
      <h1>{{propiedad.nombre}}</h1>

      
        <!--   C O N T R A T O  -->
        
      <v-card class="contrato vicard">
        <h2>Contrato</h2>
        <div class="duracionYmas">
          <h4>Comienzo: </h4>
          <p>{{propiedad.contrato.comienzo}}</p>
          <h4>Finalización: </h4>
          <p>{{propiedad.contrato.finalizacion}}</p>
          <h4>Fianza: </h4>
          <p>{{propiedad.contrato.fianza}} €</p>
        </div>
      </v-card>
      
        <!--  C A R A C T E R I S T I C A S  -->
      <v-card class="caracteristicas vicard">
        <h2>Dirección</h2>
        <h4>C/ Alcalde Sainz de Baranda 84 5º D</h4>
      </v-card>

      
        <!--   I N Q U I L I N O S  -->
      <v-card class="inquilinosYTal vicard">
        
        <h2 v-if="cuantosInquilinos">Inquilino</h2>
        <h2 v-else>Inquilinos</h2>
        <div class="inquilinos" v-for="(inquilino, index) in propiedad.inquilinos" :key="index">
          
        <h4 >{{inquilino.nombre}}</h4>
        <h4 class="dni">Dni: {{inquilino.dni}}</h4>
        </div>
      </v-card>
      
        <!--   A L E R T A S  -->
      <v-card class="Notificaciones vicard">
        <h2>Alertas</h2>
        <div v-for="(alerta, index) in propiedad.alertas" :key="index" class="divAlertas">
          <h4>{{alerta.titulo}}</h4>
          <p>{{alerta.contenido}}</p>
          <p>{{alerta.fecha}}</p>
        </div>
      </v-card>
      
        <!--   D O C U M E N T O S -->
      <v-card class="documentos vicard">
        <h2>Documentos</h2>
        
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
      propiedad: {}
    };
  },
  mounted() {
    let pisoElegido = this.$store.state.tenantModule.template;
    this.propiedad = this.$store.state.tenantModule.alquileres.propiedades[
      pisoElegido
    ];
  },
  methods: {},
  computed: {
    cuantosInquilinos(){
      //let numeroDeInquilinos = Object.keys(this.propiedad.inquilinos).length
      let numeroDeInquilinos = 1;
      if (numeroDeInquilinos <= 1) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    navbar
  }
};
</script>

<style scoped>
.alquileresWrapp{
  padding-bottom: 5rem;
}
.alquileresWrapp h1 {
  padding-top: 1rem;
  text-align: center;
  display: grid;
}

.alquileres {
  background-color: beige;
}

.vicard{
  margin: 0 1rem;
  margin-top: 2rem;
  padding: 1rem;
}

.caracteristicas{
  padding-top: 0.5rem;
}

.caracteristicas h2{
  margin-top: 1rem;
}

.inquilinos{
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 1rem;
}

.dni{
  margin-left: 2rem;
}

.duracionYmas{
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 1rem;
}

.divAlertas h4{
  margin-top: 1rem;
  margin-bottom: 3px;
}

</style>
