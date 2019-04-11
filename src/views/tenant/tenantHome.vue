<template>
  <div class="landolordhome">
    <div class="landlordHomeWrapper">
      <!--    C U R R E N T   P A Y M E N T   -->
      <div class="pagosCorrientes">
        <v-card class="pagosCorrientesCard rentasCard">
          <h2>Alquiler {{currentMonth}}</h2>
          <div class="progressWrapper">
            <radial-progress-bar
              style="justifySelf:center"
              :diameter="180"
              :completed-steps="diasRestantes"
              :total-steps="diasTotales"
              :startColor="startColor"
              :stopColor="stopColor"
              :innerStrokeColor="innerStrokeColor"
            >
              <p>Días restantes: {{ diasRestantes }}</p>
            </radial-progress-bar>
          </div>
          <div v-if="pagar" class="botonPagar">
            <button v-on:click="pagado()">PAGAR</button>
          </div>
        </v-card>
      </div>

      <!--    P A G A D E R O S  -->
      <div class="pagaderos">
        <v-card class="pagaderosCard rentasCard">
          <h2>Pagos</h2>
          <div class="pendienteDePagar">
            <h4>Alquiler ingresado</h4>
            <div v-for="(inquilino, index) in inquilinos" :key="index" class="pagaderosThumbnail">
              <p>{{inquilino.nombre}}</p>
              <p>{{inquilino.pisoAmount}}€</p>
              <div class="pagadoOno">
                <p v-if="inquilino.pisoPagado" style="color:green">Pagado</p>
                <p v-else style="color:red">No pagado</p>
              </div>
            </div>
          </div>

          <div class="pendienteDePagar">
            <h4>Gastos de Comunidad</h4>
            <div v-for="(inquilino, index) in inquilinos" :key="index" class="pagaderosThumbnail">
              <p>{{inquilino.nombre}}</p>
              <p>{{inquilino.comunidadAmount}}€</p>
              <div class="pagadoOno">
                <p v-if="inquilino.comunidadPagado" style="color:green">Pagado</p>
                <p v-else style="color:red">No pagado</p>
              </div>
            </div>
          </div>
        </v-card>
      </div>

      <!--    I M P O R T A N T E   -->
      <div class="importante">
        <v-card class="importanteCard rentasCard">
          <h2>Arreglos!</h2>
          <ul v-for="(item, index) in notificaciones" :key="index" class="uldelasli">
            <li>{{item.titulo}}</li>
            <v-icon
              v-on:click="showProblema(item)"
              v-if="item.pendiente"
              color="red"
              class="lupa"
            >report_problem</v-icon>
            <v-icon v-else color="green" class="lupa">check_circle_outline</v-icon>
          </ul>
          <div class="iconWrapper" >
            <v-icon color="orange" style="justifySelf:center" v-on:click="nuevoProblema()">add</v-icon>
          </div>
        </v-card>
      </div>

            <!--    T A B L A   I N G R E S O S   -->
      <div class="tablaIngresos">
        <v-card class="tablaIngresosCard rentasCard">
          <v-card class="topPartTabla">
            <h2>
              {{pastMonth}}
              <v-icon class="expandirMasMeses" color="black">expand_more</v-icon>
            </h2>
            <img src="../../assets/fotos/pdf.png">
          </v-card>
          <div class="bottomPartTabla">
            <div class="tablaHeaders">
              <h4>Nombre</h4>
              <h4>Fecha</h4>
              <h4>Cantidad</h4>
            </div>
            <div v-for="(piso, index) in alquilado" :key="index" class="wrapperTabla">
              <div class="contenidoTabla">
                <p>{{piso.nombre}}</p>
                <p>{{piso.fecha}}</p>
                <p>{{piso.cantidad}} €</p>
              </div>
              <hr>
            </div>
          </div>
        </v-card>
      </div>
    </div>
    <tnavbar/>
  </div>
</template>

<script>
import tnavbar from "../../components/tnavbar.vue";
import meses from "../../assets/database/meses.json";
import datejs from "datejs";
import RadialProgressBar from "vue-radial-progress";
export default {
  data() {
    return {
      alquilado:{},
      currentMonth: "Marzo",
      pastMonth: "Febrero",
      notificaciones: {},
      startColor: "#32CD32",
      stopColor: "#228B22",
      innerStrokeColor: "#696969",
      diasRestantes: 0,
      diasTotales: 0,
      pagar: false,
      inquilinos: {
        0: {
          nombre: "Rodrigo",
          pisoPagado: true,
          pisoAmount: 250,
          comunidadPagado: false,
          comunidadAmount: 250
        },
        1: {
          nombre: "Matt",
          pisoPagado: true,
          pisoAmount: 250,
          comunidadPagado: 20,
          comunidadAmount: 20
        },
        2: {
          nombre: "Isabell",
          pisoPagado: true,
          pisoAmount: 250,
          comunidadPagado: true,
          comunidadAmount: 20
        }
      },
      notificaciones: {
        "0": {
          titulo: "Grifo de la cocina necesita reparación.",
          key: "Paseo de la Habana",
          texto:
            "Hace un mes el grifo de la cocina empezó a moverse como si estuviese suelto y ayer mientras estaba lavando los platos se salío la parte de arriba entera y empezó a salir agua por todos lados. ¿Podría venir un fontanero a cambiarme el grifo? Muchas gracias, Antonio",
          fotos: {},
          documentos: {},
          fecha: "01/16/2019",
          pendiente: true
        }
      },
      haPagado: true
    };
  },
  methods: {
    progressBar() {
      let date = new Date();
      let dayDate = date.getDate();
      let yearDate = date.getFullYear();
      let diasPorMes = Date.getDaysInMonth(yearDate, dayDate);
      let diasRestantes = diasPorMes - dayDate;

      if (diasRestantes <= 10 && diasRestantes >= 6) {
        this.startColor = "#ffa500";
        this.stopColor = "#e59400";
      } else if (diasRestantes <= 5) {
        this.startColor = "#ff0000";
        this.stopColor = "#cc0000";
        this.pagar = true;
      }
      this.diasRestantes = diasRestantes;
      this.diasTotales = diasPorMes;
    },
    pagado() {},
    showProblema(item) {
      console.log(item);
    },
    nuevoProblema(){
      this.$router.push("/arregloTemplate")
    }
  },
  mounted() {
    this.progressBar();
  },
  computed: {},
  components: {
    tnavbar,
    RadialProgressBar
  }
};
</script>

<style scoped>
.landolordhome {
  background-image: url("../../assets/fotos/backgroundTemplate.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100vh;
  overflow-y: scroll;
}

.landlordHomeWrapper {
  display: grid;
  padding-top: 2rem;
  margin-bottom: 5rem;
}

.rentasCard {
  margin: 0 2rem;
  padding: 1rem;
  display: grid;
  margin-bottom: 3rem;
}

.importanteCard li {
  margin-top: 1.3rem;
}

.noticiero {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.uldelasli {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.lupa {
  margin-left: 20vw;
  margin-bottom: -4px;
}

.progressWrapper {
  display: grid;
  margin-bottom: 1rem;
}

.botonPagar {
  display: grid;
}

.botonPagar button {
  justify-self: center;
  border: 1px solid black;
  border-radius: 2px;
  padding: 0.5rem 2rem;
  cursor: pointer;
  outline: none;
  margin-bottom: 1rem;
}

.pagaderosThumbnail {
  margin: 0 2rem;
  margin-top: 0.5rem;
  text-align: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.pendienteDePagar {
  margin-top: 1rem;
}

.pendienteDePagar h4 {
  margin-bottom: 1rem;
}

.iconWrapper{
  display: grid;
  margin-top: 1rem;
}


.tablaIngresosCard {
  padding: 0;
  margin-bottom: 5rem;
}

.topPartTabla {
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-sizing: border-box;
  padding: 1rem;
}

.topPartTabla img {
  height: 2rem;
  justify-self: right;
  margin-right: 1rem;
}

.expandirMasMeses {
  margin: -2px;
}

.bottomPartTabla {
  display: grid;
  padding: 1rem;
}

.tablaHeaders {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  text-align: center;
}

.contenidoTabla {
  padding-top: 1rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  text-align: center;
}
</style>
