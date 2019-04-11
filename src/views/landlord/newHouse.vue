<template>
  <div class="newHouse">
    <div class="newHouseWrapper">
      <v-card class="newHouseCard">
        <div class="inputs">
          <h3>Nombre de la vivienda:</h3>
          <input class="nombreYdireccion" type="text" v-model="nombreAlquiler" maxlength="25">
          <p class="alquilerLength">{{nombreAlquiler.length}}/25</p>
        </div>
        <div class="inputs">
          <h3>Dirección:</h3>
          <input class="nombreYdireccion" type="text" v-model="direccionAlquiler">
        </div>
        <div class="inputs">
          <h3>Provincia:</h3>
          <input class="nombreYdireccion" type="text" v-model="provinciaAlquiler">
        </div>
        <div class="inputs">
          <h3>Localidad:</h3>
          <input class="nombreYdireccion" type="text" v-model="localidadAlquiler">
        </div>
        <div class="inputs">
          <h3>Código Postal:</h3>
          <input class="nombreYdireccion" type="number" v-model="codigoPostalAlquiler">
        </div>
        <div class="inputs">
          <h3>Precio del Alquiler:</h3>
          <input class="nombreYdireccion" type="number" v-model="precioAlquiler">
        </div>
        <div class="inputs">
          <h3>Documentos de la vivienda:</h3>
          <input type="file" name="documentos" id="documentos" @change="processFile($event)">
        </div>

        <v-btn class="white--text" v-on:click="validateRegister()" color="blue lighten-1">Guardar</v-btn>
      </v-card>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "../../main.js";
export default {
  data() {
    return {
      nombreAlquiler: "",
      direccionAlquiler: "",
      provinciaAlquiler: "",
      localidadAlquiler: "",
      nameLength: 0,
      codigoPostalAlquiler: 28002,
      precioAlquiler: ""
    };
  },
  methods: {
    validateRegister() {
      if (
        this.nombreAlquiler == "" ||
        this.direccionAlquiler == "" ||
        this.provinciaAlquiler == "" ||
        this.localidadAlquiler == "" ||
        this.codigoPostalAlquiler <= 0
      ) {
        this.snackText = "Rellene todos los campos!";
        this.showSnack = true;
      } else {
        this.loading = true;
        this.registerNewHouse();
      }
    },
    registerNewHouse() {
      let user = this.$store.getters.user;
      let userId = user.uid;    
      let userUidCortado = userId.slice(0,5);
      let event = this.fileEvent;
      let uniqid = require("uniqid");
      let cifrado = uniqid.time();

      if (event == null) {
        console.log("Sin documentos");
      } else {
        let ref = firebase.storage().ref();
        let documentosAlquiler = event.target.files[0];
        let nombreDeVivienda = documentosAlquiler.name;
        let metadata = { contentType: documentosAlquiler.type };

        const task = ref
          .child(`${userUidCortado}/${nombreDeVivienda}`)
          .put(documentosAlquiler, metadata);

        task
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            console.log(url);
          })
          .catch(console.error);
      }

      let DATA = new Object();
      DATA["nombre"] = this.nombreAlquiler;
      DATA["direccion"] = this.direccionAlquiler;
      DATA["provincia"] = this.provinciaAlquiler;
      DATA["localidad"] = this.localidadAlquiler;
      DATA["cp"] = this.codigoPostalAlquiler;
      DATA["fecha"] = null;
      DATA["cantidad"] = this.precioAlquiler;
      DATA["problemas"] = false;
      DATA["estado"] = "Desocupado";
      DATA["notificaciones"] = new Object();
      DATA["contrato"] = new Object();
      DATA["inquilinos"] = new Object();
      DATA["alertas"] = new Object();
      DATA["notificaciones"] = new Object();
      DATA["chatRoom"] = cifrado;


      db.collection(`compartido/propiedades/${userUidCortado}`)
        .doc(DATA.nombre)
        .set(DATA)
        .then(() => {
          let empty = {
            loadIt: true
          }
          this.$store.commit("setAlquileres", empty);
          this.$router.push("/landlordHome");

          console.log("Casa registrada!");
        });
    },
    processFile(event) {
      this.fileEvent = event;
    }
  }
};
</script>

<style scoped>
.newHouse {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/fotos/backgroundTemplate3.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding-top: 2rem;
}

.newHouseWrapper {
  height: 92vh;
  overflow-y: auto;
}

.newHouseCard {
  margin: 0 1rem;
  padding: 1rem;
  text-align: center;
}

.inputs {
  margin: 2rem;
  position: relative;
}

.nombreYdireccion {
  border-bottom: 1px solid rgb(20, 135, 170);
}

input:focus {
  outline: none;
}

input {
  margin: 1rem;
}

.alquilerLength {
  position: absolute;
  top: 30px;
  right: 15px;
  font-size: 0.8rem;
}
</style>
