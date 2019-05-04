<template>
  <div class="landolordhome">
    <div v-if="loaded" class="landlordHomeWrapper">
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
            <button v-on:click="pagamientoShow = true">PAGAR</button>
          </div>
          <div v-if="haPagado" class="yahaspagado">
            <p>Ya Has pagado!</p>
          </div>
        </v-card>
      </div>

      <!--    P A G A D E R O S  -->
      <div v-if="alquilando" class="pagaderos">
        <v-card class="pagaderosCard rentasCard">
          <h2>Pagos</h2>
          <div class="pendienteDePagar">
            <h4>Alquiler ingresado</h4>
            <div v-for="(inquilino, index) in inquilinos" :key="index" class="pagaderosThumbnail">
              <p>{{inquilino.nombre}}</p>
              <p>{{inquilino.piso}} €</p>
              <div class="pagadoOno">
                <p v-if="inquilino.pagado" style="color:green">Pagado</p>
                <p v-else style="color:red">No pagado</p>
              </div>
            </div>
          </div>
        </v-card>
      </div>

      <!--    A R R E G L O S   -->
      <div class="importante">
        <v-card class="importanteCard rentasCard">
          <h2>Arreglos!</h2>
          <ul
            v-for="(item, index) in notificaciones"
            :key="index"
            class="uldelasli"
            v-on:click="toNotificacionTemplate(item.titulo)"
          >
            <li>{{item.titulo}}</li>
            <v-icon v-if="item.pendiente" color="red" class="lupa">report_problem</v-icon>
            <v-icon v-else color="green" class="lupa">check_circle_outline</v-icon>
          </ul>
          <div class="iconWrapper">
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
    <!-- D I A L O G O   P A G A M I E N T O -->
    <div class="text-xs-center">
      <v-dialog v-model="pagamientoShow" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Submitir Pago</v-card-title>
          <v-card-text>
            <div class="cardTex">
              <div class="cantidadIngresada">
                <v-text-field
                  label="Cantidad del Piso"
                  single-line
                  type="number"
                  v-model="pagos.piso"
                ></v-text-field>
                <p>€</p>
                <v-text-field
                  label="Cantidad de Comunidad"
                  single-line
                  type="number"
                  v-model="pagos.comunidad"
                ></v-text-field>
                <p>€</p>
              </div>
              <p>Total Ingresado: {{totalPagado}}</p>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="pagamientoShow = false">Cancelar</v-btn>
            <v-btn color="primary" flat @click="pagado()">Guardar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <tnavbar/>
  </div>
</template>

<script>
import tnavbar from "../../components/tnavbar.vue";
import datejs from "datejs";
import RadialProgressBar from "vue-radial-progress";
import firebase from "firebase";
import { db } from "../../main.js";
import { retrieveAlquiler } from "../../funcionalidades.js";
import mesActual from "../../assets/database/mesesDelAgno.json";
export default {
  data() {
    return {
      pagos: {
        piso: null,
        comunidad: null
      },
      pagamientoShow: false,
      alquilado: {},
      currentMonth: "Marzo",
      pastMonth: "Febrero",
      notificaciones: {},
      startColor: "#32CD32",
      stopColor: "#228B22",
      innerStrokeColor: "#696969",
      diasRestantes: 0,
      diasTotales: 0,
      pagar: false,
      notificaciones: {},
      haPagado: false,
      loaded: false,
      pagosDeEsteMes: null,
      totalPagadoEsteMes: 0
    };
  },
  methods: {
    progressBar() {
      let date = new Date();
      let dayDate = date.getDate();
      let monthDate = date.getMonth();
      let yearDate = date.getFullYear();
      //let diaDelContrato = this.$store.getters.alquileres.contrato.comienzo.dia;
      let diaDelContrato = 5;
      let diasPorMesCorriente = Date.getDaysInMonth(yearDate, monthDate);
      let diasPorMesSiguiente = Date.getDaysInMonth(yearDate, monthDate + 1);
      let diasHastaFinDeMes = diasPorMesCorriente - dayDate;
      let diasRestantesParaPagar = parseInt(diaDelContrato) + diasHastaFinDeMes;

      if (diasRestantesParaPagar > diasPorMesCorriente) {
        this.diasRestantes = diasRestantesParaPagar - diasPorMesCorriente;
      } else if (diasRestantesParaPagar == diasPorMesCorriente) {
        this.diasRestantes = 0;
      } else {
        this.diasRestantes = diasRestantesParaPagar;
      }

      if (this.diasRestantes <= 10 && this.diasRestantes >= 6) {
        this.startColor = "#ffa500";
        this.stopColor = "#e59400";
      } else if (this.diasRestantes <= 5) {
        this.startColor = "#ff0000";
        this.stopColor = "#cc0000";
        this.pagar = true;
        this.siHaPagado();
      }

      this.diasTotales = diasPorMesCorriente;
      this.loaded = true;
    },
    siHaPagado() {
      if (this.pagosDeEsteMes == null) {
        return;
      } else {
        this.pagosDeEsteMes.forEach(element => {
          if (element.uid == this.$store.getters.user.uid) {
            this.haPagado = true;
            this.pagar = false;
          } else {
            return;
          }
        });
      }
    },
    pagado() {
      let date = new Date();
      let month = date.getMonth();
      let currentMonth = mesActual.meses[month];
      let pagoObjeto = new Object();
      let fechaSubida = `${date.getFullYear()}/${currentMonth}`;
      pagoObjeto["piso"] = this.numerizadora(this.pagos.piso);
      pagoObjeto["comunidad"] = this.numerizadora(this.pagos.comunidad);
      pagoObjeto["nombre"] = this.$store.getters.user.nombre;
      pagoObjeto["uid"] = this.$store.getters.user.uid;
      pagoObjeto["pagado"] = true;
      let listaPagosMensual = new Object();
      let pagoTotal = null;

      let inquilinoRef = db
        .collection("propiedades")
        .doc(this.$store.getters.chatRoom)
        .get()
        .then(snapshot => {
          listaPagosMensual = snapshot.data().progresoPagoInquilinos;

          this.actualizarPagoTotal(snapshot.data().progresoPagoTotal);
          return listaPagosMensual;
        })
        .then(listaPagosMensual => {
          let mesEnCurso = new Array();

          //Guardamos el Mes actual en variable
          for (const mes in listaPagosMensual) {
            if (mes == fechaSubida) {
              const element = listaPagosMensual[mes];
              mesEnCurso = element;
            }
          }

          // Merge los existentes pagos con el nuevo;
          mesEnCurso.push(pagoObjeto);
          listaPagosMensual[fechaSubida] = mesEnCurso;

          let viviendaRef = db
            .collection("propiedades")
            .doc(this.$store.getters.chatRoom)
            .update({ progresoPagoInquilinos: listaPagosMensual })
            .then(() => {
              console.log("updateado");
              this.pagamientoShow = false;
              this.retreiveData();
            });
        });
    },
    actualizarPagoTotal(pagoActual) {
      let piso = this.numerizadora(this.pagos.piso);
      let comunidad = this.numerizadora(this.pagos.comunidad);
      let usuarioTotal = piso + comunidad;
      let total = this.numerizadora(pagoActual) + usuarioTotal;

      let viviendaRef = db
        .collection("propiedades")
        .doc(this.$store.getters.chatRoom)
        .update({ progresoPagoTotal: this.numerizadora(total) })
        .then(() => {
          console.log("updateado pago Total");
        });
    },
    numerizadora(numero) {
      let a = Number(numero);
      let b = a.toFixed(2);
      let c = Number(b);
      return c;
    },
    showProblema(item) {
      console.log(item);
    },
    nuevoProblema() {
      this.$router.push("/arregloTemplate");
    },
    retreiveData() {
      this.loaded = false;
      let date = new Date();
      let month = date.getMonth();
      let currentMonth = mesActual.meses[month];
      let fechaSubida = `${date.getFullYear()}/${currentMonth}`;
      retrieveAlquiler().then(res => {
        if (this.$store.getters.chatRoom == null) {
          this.pagosDeEsteMes = new Array();
        } else {
          this.pagosDeEsteMes = this.$store.getters.alquileres.progresoPagoInquilinos[
            fechaSubida
          ];
          this.totalPagadoEsteMes = this.$store.getters.alquileres.progresoPagoTotal;
        }
        this.progressBar();
      });
    },
    toNotificacionTemplate(notificacion) {
      if (this.$store.getters.notificaciones[notificacion].pendiente == false) {
        return;
      } else {
        this.$store.commit("setNotificacionTemplate", notificacion);
        this.$router.push("/notificacionTemplate");
      }
    }
  },
  mounted() {
    if (this.$store.getters.alquileres == null) {
      console.log("internet");
      this.retreiveData();
    } else {
      console.log("store");
      this.retreiveData();
      //this.progressBar();
    }
    this.notificaciones = this.$store.getters.notificaciones;
  },
  computed: {
    totalPagado() {
      if (this.pagos.piso == null || this.pagos.comunidad == null) {
        return null;
      } else {
        let total = Number(this.pagos.piso) + Number(this.pagos.comunidad);
        return total.toFixed(2);
      }
    },
    inquilinos() {
      let objetoConPagos = new Object();
      let arrayDeNombresInquilinosSinPagar = new Array();
      let arrayDeNombresInquilinos = new Array();
      let arrayDeNombresPagaderos = new Array();

      //Guardamos nombres de inquilinos en Array
      for (const inquilino in this.$store.getters.alquileres.inquilinos) {
        let element = this.$store.getters.alquileres.inquilinos[inquilino];
        arrayDeNombresInquilinos.push(element.uid);
        for (const pago in this.pagosDeEsteMes) {
          if (this.pagosDeEsteMes[pago].uid == element.uid) {
            let nuevoPago = {
              nombre: this.pagosDeEsteMes[pago].nombre,
              pagado: this.pagosDeEsteMes[pago].pagado,
              piso:
                this.pagosDeEsteMes[pago].piso +
                this.pagosDeEsteMes[pago].comunidad
            };
            objetoConPagos[this.pagosDeEsteMes[pago].uid] = nuevoPago;
          }
        }
      }

      //Guardamos nombres de gente que ha pagado en array
      for (const pago in this.pagosDeEsteMes) {
        const element = this.pagosDeEsteMes[pago];
        arrayDeNombresPagaderos.push(element.uid);
      }

      //Guardamos nombre de gente que no ha pagado aún y mergeamos en objeto
      for (const inquilino in this.$store.getters.alquileres.inquilinos) {
        let element = this.$store.getters.alquileres.inquilinos[inquilino];
        if (arrayDeNombresPagaderos.includes(element.uid) == false) {
           let nuevoPago = {
              nombre: element.nombre,
              pagado: false,
              piso: 0,
            };
            objetoConPagos[element.uid] = nuevoPago;
        }
      }

      console.log(objetoConPagos);

      return objetoConPagos;
    },
    alquilando() {
      if (this.$store.getters.chatRoom == null) {
        return false;
      } else {
        return true;
      }
    }
  },
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
  margin-bottom: 1rem;
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

.iconWrapper {
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

.cantidadIngresada {
  display: grid;
  grid-template-columns: 5fr 1fr;
}

.cantidadIngresada p {
  margin: auto;
}

.yahaspagado {
  text-align: center;
}
</style>
