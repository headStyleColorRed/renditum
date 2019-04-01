<template>
  <div class="landolordhome">
    <div class="landlordHomeWrapper">
      <!--    Imagen y avatar   -->
      <div class="imagen">
        <v-avatar size="60" color="grey lighten-4" class="avatar">
          <img src="../../assets/fotos/avatar.jpg" alt="avatar">
        </v-avatar>
      </div>

      <!--    R E N T A S   -->
      <div class="rentas">
        <v-card class="rentasCard">
          <h2>Rentas:</h2>
          <h3 class="currentMonthRentas">{{currentMonth}}</h3>
          <h5>Porcentaje ingresado:</h5>
          <div class="progreso">
            <v-progress-linear
              class="lineaProgreso inprogresos"
              color="orange"
              height="1rem"
              :value="progresoRenta"
            ></v-progress-linear>
            <p class="porcentajeProgreso inprogresos">{{progresoRenta}}%</p>
          </div>
          <h5>Pisos pagados:</h5>
          <div class="progreso">
            <v-progress-linear
              class="lineaProgreso inprogresos"
              color="purple"
              height="1rem"
              :value="progresoInquilinos"
            ></v-progress-linear>
            <p class="porcentajeProgreso inprogresos">2/5</p>
          </div>
          <div class="masMeses">
            <h5>
              Más meses
              <v-icon class="enmesados">add</v-icon>
            </h5>
          </div>
        </v-card>
      </div>

      <!--    I M P O R T A N T E   -->
      <div class="importante">
        <v-card class="importanteCard rentasCard">
          <h2>Importante!</h2>
          <div>
            <ul v-for="(item, index) in notificaciones" :key="index" class="uldelasli">
              <li>{{item.texto}}</li>
              <v-icon v-on:click="toTemplate(item.key)"  v-if="notificacionesReal" color="red" class="lupa">report_problem</v-icon>
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
            <div v-for="(piso, index) in pisosTabla" :key="index" class="wrapperTabla">
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
export default {
  data() {
    return {
      currentMonth: "Marzo",
      progresoRenta: "15",
      progresoInquilinos: "50",
      search: "report_problem",
      pisosTabla: {},
      notificaciones: {},
      notificacionesReal: false
    };
  },
  methods: {
    toTemplate(event) {
      this.$store.commit("setTemplate", event);
      this.$router.push("/template");
    }
  },
  mounted() {
    this.pisosTabla = this.$store.state.tenantModule.alquileres.propiedades;

    if (
      this.$store.state.tenantModule.alquileres.notificaciones[0].texto ==
      "Todo bajo control!"
    ) {
      this.notificaciones = this.$store.state.tenantModule.alquileres.notificaciones;
    } else {
      (this.notificacionesReal = true),
        (this.notificaciones = this.$store.state.tenantModule.alquileres.notificaciones);
    }
    console.log(this.notificaciones);
  },
  computed: {
    importante() {
      let sinNovedades = {
        0: "Todo está bajo control!"
      };
      let habemusNotificacion = Object.keys(
        this.$store.state.tenantModule.alquileres.notificaciones
      ).length;
      let notificaciones = this.$store.state.tenantModule.alquileres
        .notificaciones;
      let counter = 0;
      if (habemusNotificacion >= 1) {
        for (const notificacion in notificaciones) {
          if (notificaciones.hasOwnProperty(notificacion)) {
            sinNovedades[counter] = notificaciones[notificacion];
            counter++;
          }
        }
        return sinNovedades;
        this.search = "report_problem";
      } else {
        this.search = "check_circle_outline";
        return sinNovedades;
      }
    }
  },
  components: {
    navbar
  }
};
</script>

<style scoped>
.landolordhome {
  background-color: beige;
}

.landlordHomeWrapper {
  display: grid;
}

.imagen {
  height: 6rem;
  background-image: url("../../assets/fotos/edificio.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  margin-bottom: 3rem;
}

.avatar {
  position: absolute;
  bottom: -2em;
  left: 1rem;
}

.rentasCard {
  margin: 0 2rem;
  padding: 1rem;
  display: grid;
  margin-bottom: 2rem;
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
