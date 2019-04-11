<template>
  <div class="alquileres">
    <div class="alquileresWrapp">
      <v-card class="titulo">
        <h1>{{propiedad.nombre}}</h1>
      </v-card>

      <div class="cardwrapper">
        <!--   C O N T R A T O  -->

        <v-card v-if="alquilado" class="contrato vicard">
          <h2>Contrato</h2>
          <div class="duracionYmas">
            <h4>Comienzo:</h4>
            <p>{{propiedad.contrato.comienzo}}</p>
            <h4>Finalización:</h4>
            <p>{{propiedad.contrato.finalizacion}}</p>
            <h4>Fianza:</h4>
            <p>{{propiedad.contrato.fianza}} €</p>
          </div>
        </v-card>

        <!--  C A R A C T E R I S T I C A S  -->
        <v-card class="caracteristicas vicard">
          <h2>Dirección</h2>
          <h4>{{propiedad.direccion}}</h4>
        </v-card>

        <!--   I N Q U I L I N O S  -->
        <v-card v-if="alquilado" class="inquilinosYTal vicard">
          <h2 v-if="cuantosInquilinos">Inquilino</h2>
          <h2 v-else>Inquilinos</h2>
          <div class="inquilinos" v-for="(inquilino, index) in propiedad.inquilinos" :key="index">
            <h4>{{inquilino.nombre}}</h4>
            <div class="datosInquilinos">
              <h4 class="dni">Dni: {{inquilino.dni}}</h4>
              <h4 class="dni">
                Telf:
                <a :href="`tel:${inquilino.telf}`">{{inquilino.telf}}</a>
              </h4>
            </div>
          </div>
        </v-card>

        <!--   A L E R T A S  -->
        <v-card v-if="alquilado" class="Notificaciones vicard">
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
        <!--   D O C U M E N T O S -->
        <v-card class="añadirInquilino vicard">
          <h2>Añadir Inquilino</h2>
          <input type="email" placeholder="Introduce email" v-model="inquilinoAañadir">
          <v-progress-circular
            size="24"
            v-if="sendingRequest"
            class="progreso centrar"
            indeterminate
            color="orange"
          ></v-progress-circular>
          <v-icon
            v-if="requestNotSent"
            color="orange"
            class="iconoInquilino centrar"
            v-on:click="sendRequest()"
          >email</v-icon>
          <v-icon class="centrar" color="green" v-if="requestSent">check_circle_outline</v-icon>
        </v-card>
      </div>
    </div>
    <navbar/>
  </div>
</template>

<script>
import navbar from "../../components/navbar.vue";
import firebase from "firebase";
import { db } from "../../main.js";
export default {
  data() {
    return {
      propiedad: {},
      alquilado: false,
      inquilinoAañadir: "",
      requestNotSent: true,
      sendingRequest: false,
      requestSent: false
    };
  },
  mounted() {
    let pisoElegido = this.$store.state.landlordModule.template;
    this.propiedad = this.$store.getters.alquileres[pisoElegido];
    if (this.propiedad.estado == "alquilado") {
      this.alquilado = true;
    } else {
      this.alquilado = false;
    }
  },
  methods: {
    sendRequest() {
      if (this.inquilinoAañadir) {
      this.requestNotSent = false;
      this.sendingRequest = true;
        let usersIdRef = db
          .collection("users")
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              if (doc.data().email == this.inquilinoAañadir) {
                console.log("sending amitie request to" + doc.data().nombre);
              }
            });

            this.requestNotSent = false;
            this.sendingRequest = false;
            this.requestSent = true;
            setTimeout(() => {
              this.requestSent = false;
              this.requestNotSent = true;
            }, 2000);
          });
      }
    }
  },
  computed: {
    cuantosInquilinos() {
      //let numeroDeInquilinos = Object.keys(this.propiedad.inquilinos).length
      let numeroDeInquilinos = 1;
      if (numeroDeInquilinos <= 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  components: {
    navbar
  }
};
</script>

<style scoped>
.alquileres {
  background-image: url("../../assets/fotos/backgroundTemplate1.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100vh;
}

.alquileresWrapp {
  padding-top: 2rem;
}

.titulo {
  font-family: "Libre Baskerville", serif;
  margin-bottom: 1px;
}
.alquileresWrapp h1 {
  padding: 0.5rem 0;
  text-align: center;
  display: grid;
}

.alquileres {
  background-color: beige;
}

.cardwrapper {
  height: 80vh;
  overflow-y: scroll;
}

.vicard {
  margin: 0 1rem;
  margin-bottom: 2rem;
  margin-top: 1rem;
  padding: 1rem;
}

.caracteristicas {
  padding-top: 0.5rem;
}

.caracteristicas h2 {
  margin-top: 1rem;
}

.inquilinos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 1rem;
}

.dni {
  margin-left: 2rem;
}

.duracionYmas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 1rem;
}

.divAlertas h4 {
  margin-top: 1rem;
  margin-bottom: 3px;
}

.añadirInquilino {
  display: grid;
}

input:focus {
  outline: none;
}

.añadirInquilino input {
  margin-top: 1rem;
  justify-self: center;
  border: 1px solid black;
  padding: 0.5rem 1rem;
  border-radius: 5rem;
  width: 80%;
}

.botonInquilino {
  justify-self: center;
}

.iconoInquilino {
  margin-top: 1rem;
  font-size: 2rem;
}

.centrar{
  justify-self: center;
}
</style>
