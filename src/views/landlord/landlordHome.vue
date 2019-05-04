<template>
  <div class="landolordhome">
    <div v-if="loaded" class="landlordHomeWrapper">
      <!--    R E N T A S   -->
      <div class="rentas">
        <v-card color class="rentasCard">
          <h2>Rentas:</h2>
          <h3 v-on:click="retrieveMonthlyStats()" class="currentMonthRentas">{{currentMonth}}</h3>
          <h5>Porcentaje ingresado:</h5>
          <div class="progreso">
            <v-progress-linear
              class="lineaProgreso inprogresos"
              color="orange"
              height="1rem"
              :value="rentas.progresoRenta"
            ></v-progress-linear>
            <p class="porcentajeProgreso inprogresos">{{rentas.progresoRenta}}%</p>
          </div>
          <h5>Pisos alquilados:</h5>
          <div class="progreso">
            <v-progress-linear
              class="lineaProgreso inprogresos"
              color="purple"
              height="1rem"
              :value="rentas.progresoInquilinos"
            ></v-progress-linear>
            <p class="porcentajeProgreso inprogresos">{{rentas.progresoPisos}}</p>
          </div>
        </v-card>
      </div>

      <!--    I M P O R T A N T E   -->
      <div class="importante">
        <v-card class="importanteCard rentasCard">
          <h2>Notificaciones!</h2>
          <div>
            <ul v-for="(item, index) in importante" :key="index" class="uldelasli">
              <li>{{item.titulo}}</li>
              <v-icon
                v-on:click="toTemplate(item.key)"
                v-if="item.pendiente"
                color="red"
                class="lupa"
              >report_problem</v-icon>
              <v-icon v-else color="green" class="lupa">check_circle_outline</v-icon>
            </ul>
          </div>
        </v-card>
      </div>

      <!--    T A B L A   I N G R E S O S   -->
      <div class="tablaIngresos">
        <v-card class="tablaIngresosCard rentasCard">
          <v-card class="topPartTabla">
            <h2>
              {{currentMonth}}
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
    <navbar/>
  </div>
</template>

<script>
import navbar from "../../components/navbar.vue";
import "swiper/dist/css/swiper.css";
import firebase from "firebase";
import { db } from "../../main.js";
import axios from "axios";
import datejs from "datejs";
import mesActual from "../../assets/database/mesesDelAgno.json";
import { retrieveAlquileres } from "../../funcionalidades.js";
export default {
  data() {
    return {
      rentas: {
        progresoRenta: 0,
        progresoInquilinos: "0",
        progresoPisos: "2/3"
      },
      currentMonth: "Marzo",
      progresoRenta: "15",
      search: "report_problem",
      pisosTabla: {},
      notificaciones: {},
      notificacionesReal: false,
      loaded: false
    };
  },
  mounted() {
    if (this.$store.getters.alquileres == null) {
      this.lookForMyFoto();
      console.log("de internet");
      this.retreiveData();
    } else {
      this.pisosTabla = this.$store.getters.alquileres;
      this.loaded = true;
      console.log("from Store");
    }
    this.currentMonthFuction();
  },
  methods: {
    toTemplate(event) {
      this.$store.commit("setTemplate", event);
      this.$router.push("/template");
    },
    retreiveData() {
      retrieveAlquileres()
      .then(propiedades => {
        this.pisosTabla = propiedades;
        this.loaded = true;
      });
    },
    lookForMyFoto() {
      let fotoRef = db
        .collection("users")
        .doc(this.$store.getters.user.uid)
        .get()
        .then(snapshot => {
          this.$store.commit("setProfilePic", snapshot.data().imgPerfil);
        });
    },
    currentMonthFuction() {
      let date = new Date();
      let month = date.getMonth();
      this.currentMonth = mesActual.meses[month];
    }
  },
  computed: {
    importante() {
      let conNovedades = [];
      let hayONoHayNotificaciones = 0;
      let alquilado = this.$store.getters.alquileres;
      let lengthOfNotificaciones = 0;
      let sinNovedades = {
        0: {
          titulo: "Todo bajo control!"
        }
      };

      for (const vivienda in alquilado) {
        lengthOfNotificaciones += 1;
        conNovedades.push(alquilado[vivienda].notificaciones);
      }

      if (lengthOfNotificaciones <= 0) {
        return sinNovedades;
      } else {
        return conNovedades[0];
      }
    },
    alquilado() {
      //Returns only rented flats
      let alquilado = this.$store.getters.alquileres;
      let pisosAlquilados = new Object();
      let numeroDePisos = 0;
      let numeroDePisosAlquilados = 0;
      let lengthOfPisosAlquilados = Object.keys(this.$store.getters.alquileres)
        .length;
      if (lengthOfPisosAlquilados == 0) {
        numeroDePisos = 0;
        this.rentas.progresoRenta = 0;
      } else {
        for (const vivienda in alquilado) {
          if (alquilado[vivienda].estado == "Alquilado") {
            numeroDePisosAlquilados += 1;
            pisosAlquilados[alquilado[vivienda].nombre] = alquilado[vivienda];
          }
          numeroDePisos += 1;
        }
      }
      //Calcular total de porcentaje mensual
      let porcentajeTotalAIngresar = 0;
      for (const piso in pisosAlquilados) {
        porcentajeTotalAIngresar += parseInt(pisosAlquilados[piso].cantidad);
      }
      //console.log(Object.keys(this.$store.getters.alquileres).length);

      //Estadísticas Pisos
      let porcentajePisosAlquilados =
        (numeroDePisosAlquilados * 100) / numeroDePisos;
      this.rentas.progresoInquilinos = porcentajePisosAlquilados;

      this.rentas.progresoPisos = `${numeroDePisosAlquilados}/${numeroDePisos}`;

      return pisosAlquilados;
    }
  },
  components: {
    navbar
  }
};
</script>

<style scoped>
.landolordhome {
  background-image: url("../../assets/fotos/backgroundTemplate.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
}

.landlordHomeWrapper {
  display: grid;
  padding-top: 2rem;
}

.rentas {
  width: 100vw;
}

.rentasCard {
  margin: 0 2rem;
  padding: 1rem;
  display: grid;
  margin-bottom: 3rem;
}

.currentMonthRentas {
  text-align: center;
  margin-bottom: 1rem;
}
.rentasCard h5 {
  margin-bottom: -7px;
}

.progreso {
  margin: 1rem;
  display: grid;
  grid-template-columns: 6fr 1fr;
}

.inprogresos {
  margin: auto;
}

.masMeses {
  justify-self: center;
}

.enmesados {
  margin-bottom: -5px;
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
