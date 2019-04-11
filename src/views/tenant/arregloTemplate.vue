<template>
  <div class="arreglo">
    <div class="arregloWrapper">
      <v-card class="arregloCard">
        <div class="inputs">
          <h3>Título del Problema:</h3>
          <input class="nombreYdireccion" type="text" v-model="tituloProblema" maxlength="25">
          <p class="alquilerLength">{{tituloProblema.length}}/25</p>
        </div>
        <div class="inputs">
          <h3>Descripción del problema:</h3>
          <v-textarea box name="input-7-4" label v-model="descripcionProblema"></v-textarea>
        </div>
        <div class="inputs">
          <h3>Documentos:</h3>
          <input type="file" name="documentos" id="documentos" @change="processFile($event)">
        </div>
        <div class="inputs">
          <h3>Fotos:</h3>
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
      tituloProblema: "",
      descripcionProblema: "",
    };
  },
  methods: {
    validateRegister() {
      if (
        this.tituloProblema == "" ||
        this.direccionAlquiler == "" ||
        this.provinciaAlquiler == "" ||
        this.localidadAlquiler == "" ||
        this.codigoPostalAlquiler <= 0
      ) {
        this.snackText = "Rellene todos los campos!";
        this.showSnack = true;
      } else {
        this.loading = true;
        this.registerarreglo();
      }
    },
    registerarreglo() {
      let user = this.$store.getters.user;
      let userId = user.uid;
      let userUidCortado = userId.slice(0, 5);
      let event = this.fileEvent;

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
      DATA["nombre"] = this.tituloProblema;
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

      db.collection(`compartido/propiedades/${userUidCortado}`)
        .doc(DATA.nombre)
        .set(DATA)
        .then(() => {
          let empty = {
            loadIt: true
          };
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
.arreglo {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/fotos/backgroundTemplate3.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding-top: 2rem;
}

.arregloWrapper {
  height: 92vh;
  overflow-y: auto;
}

.arregloCard {
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
