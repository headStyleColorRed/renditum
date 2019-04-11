<template>
  <div class="landolordhome">
    <div v-if="loaded" class="landlordHomeWrapper">
      <!--    R E N T A S   -->
      <div class="rentas">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in rentas" :key="index">
            <v-card color class="rentasCard">
              <h2>Rentas:</h2>
              <h3 class="currentMonthRentas">{{item.currentMonth}}</h3>
              <h5>Porcentaje ingresado:</h5>
              <div class="progreso">
                <v-progress-linear
                  class="lineaProgreso inprogresos"
                  color="orange"
                  height="1rem"
                  :value="item.progresoRenta"
                ></v-progress-linear>
                <p class="porcentajeProgreso inprogresos">{{item.progresoRenta}}%</p>
              </div>
              <h5>Pisos pagados:</h5>
              <div class="progreso">
                <v-progress-linear
                  class="lineaProgreso inprogresos"
                  color="purple"
                  height="1rem"
                  :value="item.progresoInquilinos"
                ></v-progress-linear>
                <p class="porcentajeProgreso inprogresos">{{item.progresoPisos}}</p>
              </div>
            </v-card>
          </swiper-slide>
          <!-- Optional controls -->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>

      <!--    I M P O R T A N T E   -->
      <div class="importante">
        <v-card class="importanteCard rentasCard">
          <h2>Importante!</h2>
          <div>
            <ul v-for="(item, index) in importante" :key="index" class="uldelasli">
              <li>{{item.texto}}</li>
              <v-icon
                v-on:click="toTemplate(item.key)"
                v-if="notificacionesReal"
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
import { swiper, swiperSlide } from "vue-awesome-swiper";
import firebase from "firebase";
import { db } from "../../main.js";
export default {
  data() {
    return {
      rentas: {
        marzo: {
          currentMonth: "Marzo",
          progresoRenta: "15",
          progresoInquilinos: "66",
          progresoPisos: "2/3"
        },
        Febrero: {
          currentMonth: "Febrero",
          progresoRenta: "95",
          progresoInquilinos: "100",
          progresoPisos: "3/3"
        },
        Enero: {
          currentMonth: "Enero",
          progresoRenta: "100",
          progresoInquilinos: "100",
          progresoPisos: "3/3"
        }
      },
      currentMonth: "Marzo",
      progresoRenta: "15",
      progresoInquilinos: "50",
      search: "report_problem",
      pisosTabla: {},
      notificaciones: {},
      notificacionesReal: false,
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          spaceBetween: "200"
        }
      },
      loaded: false
    };
  },
  methods: {
    toTemplate(event) {
      this.$store.commit("setTemplate", event);
      this.$router.push("/template");
    },
    retreiveData() {
      let userId = this.$store.getters.user.uid;
      let userUidCortado = userId.slice(0, 5);
      let propiedadesRef = db.collection(
        `compartido/propiedades/${userUidCortado}`
      );
      let allPropiedades = propiedadesRef
        .get()
        .then(snapshot => {
          let propiedades = new Object();
          snapshot.forEach(doc => {
            propiedades[doc.id] = doc.data();
          });

          this.$store.commit("setAlquileres", propiedades);
          this.pisosTabla = this.$store.getters.alquileres;
          this.loaded = true;
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    }
  },
  mounted() {
    if (this.$store.getters.alquileres.loadIt) {
      this.retreiveData();
      console.log("internet");
    } else {
      this.pisosTabla = this.$store.getters.alquileres;
      console.log("store");
      this.loaded = true;
    }
  },
  computed: {
    importante() {
      let sinNovedades = {
        0: {
          texto: "Todo bajo control!",
        }
      };
      let hayONoHayNotificaciones = 0;

      let alquilado = this.$store.getters.alquileres;
      let notificacionesSi = new Object();
      for (const vivienda in alquilado) {
        let lengthOfNotificaciones = Object.keys(
          alquilado[vivienda].notificaciones
        ).length;
        console.log(lengthOfNotificaciones);
      }
      if (hayONoHayNotificaciones == 0) {
        return sinNovedades
      } else {
        return
      }

    },
    alquilado() {
      //Returns only rented flats
      let alquilado = this.$store.getters.alquileres;
      let pisosAlquilados = new Object();
      for (const vivienda in alquilado) {
        if (alquilado[vivienda].estado == "Alquilado") {
          pisosAlquilados[alquilado[vivienda].nombre] = alquilado[vivienda];
        }
      }
      return pisosAlquilados;
    }
  },
  components: {
    navbar,
    swiper,
    swiperSlide
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
