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
          <input
            class="nombreYdireccion"
            type="text"
            v-model="nombreDelDocumento"
            maxlength="15"
            placeholder="nombre del Documento"
          >
          <input type="file" name="documentos" id="documentos" @change="processFile($event)">
        </div>
        <div class="inputs">
          <h3>Fotos:</h3>
          <input type="file" name="documentos" id="documentos" @change="processPIc($event)">
        </div>

        <v-progress-circular v-if="loading" indeterminate color="red"></v-progress-circular>
        <v-btn
          v-else
          class="white--text"
          v-on:click="validateRegister()"
          color="blue lighten-1"
        >Guardar</v-btn>
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
      descripcionProblema: null,
      nombreDelDocumento: null,
      loading: false
    };
  },
  methods: {
    validateRegister() {
      console.log("validando");
      if (this.tituloProblema == "" || this.descripcionProblema == null) {
        this.snackText = "Rellene todos los campos!";
        this.showSnack = true;
      } else {
        this.loading = true;
        this.registerarreglo();
      }
    },
    registerarreglo() {
      let user = this.$store.getters.user.uid;
      let event = this.fileEvent;
      let eventPic = this.fileEventPic;

      if (event == null) {
        console.log("Sin documentos");
        this.registerComent();
      } else if (eventPic == null) {
        console.log("Sin Fotos");
        this.registerComent();
      } else {
        let ref = firebase.storage().ref();
        let documentosAlquiler = new Object();
        documentosAlquiler["documentos"] = event.target.files[0];
        documentosAlquiler["fotos"] = eventPic.target.files[0];
        let metadata = { contentType: documentosAlquiler.type };

        const task = ref
          .child(`notificaciones/${this.$store.getters.chatRoom}`)
          .put(documentosAlquiler, metadata);

        task
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            console.log("documento guardado");
            this.registerComent(url);
          })
          .catch(console.error);
      }
    },
    processFile(event) {
      this.fileEvent = event;
    },
    processPIc(eventPic) {
      this.fileEventPic = eventPic;
    },
    registerComent(url) {
      console.log("registrando documento");
      let definitiveUrl = url;
      if (url == null) {
        console.log("no es na");
        definitiveUrl = "Sin Documentos";
      }
      console.log(definitiveUrl);
      //Crear objeto Con Notificación
      let date = new Date();
      let dayDate = date.getDate();
      let monthDate = date.getMonth();
      let yearDate = date.getFullYear();
      let fecha = `${dayDate}/${monthDate}/${yearDate}`;
      let notificacionObject = new Object();
      notificacionObject["titulo"] = this.tituloProblema;
      notificacionObject["texto"] = this.descripcionProblema;
      notificacionObject["fecha"] = fecha;
      notificacionObject["pendiente"] = true;
      notificacionObject["url"] = definitiveUrl;

      //Bajar objecto de propiedad con Notificaciones
      let notificacionesObject = new Object();
      let objetoPropiedadRef = db
        .collection(`propiedades`)
        .doc(this.$store.getters.chatRoom)
        .get()
        .then(snapshot => {
          notificacionObject["key"] = snapshot.data().nombre;
          notificacionesObject = snapshot.data().notificaciones;
        })
        .then(() => {
          console.log("pusheando");
          //Push nueva notificación en propiedad.notificaciones
          notificacionesObject[notificacionObject.titulo] = notificacionObject;
        })
        .then(() => {
          //Upload notificaciones object to its original place
          let notificacionActualizada = db
            .collection(`propiedades`)
            .doc(this.$store.getters.chatRoom)
            .update({ notificaciones: notificacionesObject })
            .then(() => {
              console.log("Notificación registrada y atualizada");
            });

          //Actualizado el campo problemas
          let problemasRef = db
            .collection("propiedades")
            .doc(this.$store.getters.chatRoom)
            .update({ problemas: true })
            .then(() => {
              console.log("problemas Actualizados también");
              this.retrieveNotificaciones();
            });
        });
    },
    retrieveNotificaciones() {
      let notificacionesRef = db
        .collection("propiedades")
        .doc(this.$store.getters.chatRoom)
        .get()
        .then(snapshot => {
          this.$store.commit(
            "setNotificaciones",
            snapshot.data().notificaciones
          );
          this.$router.push("/tenantHome");
        });
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
