<template>
  <div class="alquileres">
    <div v-if="loaded" class="alquileresWrapp">
      <v-card class="titulo">
        <h1>{{propiedad.nombre}}</h1>
      </v-card>

      <div class="cardwrapper">
        <!--  C A R A C T E R I S T I C A S  -->
        <v-card class="caracteristicas vicard">
          <h2>Dirección</h2>
          <h4>{{propiedad.provincia}}</h4>
          <h4>{{propiedad.localidad}}</h4>
          <h4>{{propiedad.cp}}</h4>
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
                <a :href="`tel:${inquilino.tlf}`">{{inquilino.tlf}}</a>
              </h4>
            </div>
          </div>
        </v-card>

        <!--   A L E R T A S  -->
        <v-card v-if="alquilado" class="Notificaciones vicard">
          <h2>Alertas</h2>
          <div v-for="(alerta, index) in propiedad.notificaciones" :key="index" class="divAlertas">
            <div class="alertasTextoWrapper" v-if="alerta.pendiente">
              <h4>{{alerta.titulo}}</h4>
              <p>{{alerta.texto}}</p>
              <p>{{alerta.fecha}}</p>
            </div>
          </div>
        </v-card>

        <!--   D O C U M E N T O S -->
        <v-card class="documentos vicard">
          <div class="topPartWrapper">
            <h2>Documentos</h2>
            <img src="../../assets/fotos/pdf.png">
          </div>
          <div class="documentosWrapper">
            <div v-for="(documento, index) in documentos" :key="index" class="documentosThumbnail">
              <a :href="documento.url" download>
                <img src="../../assets/fotos/pdf.png">
              </a>
              <p>{{documento.nombre}}.pdf</p>
            </div>
            <div class="documentosThumbnail">
              <v-icon v-on:click="nuevoDocumentoShow = true" class="icono">add</v-icon>
              <p>Nuevo documento</p>
            </div>
          </div>
        </v-card>

        <!--   C O N T R A T O  -->
        <v-card v-if="alquilado" class="contrato vicard">
          <h2>Contrato</h2>
          <div v-if="contratoAñadido" class="duracionYmas">
            <h4>Comienzo:</h4>
            <p>{{propiedad.contrato.comienzo.dia}}/{{propiedad.contrato.comienzo.mes}}/{{propiedad.contrato.comienzo.ano}}</p>
            <h4>Finalización:</h4>
            <p>{{propiedad.contrato.comienzo.dia}}/{{propiedad.contrato.comienzo.mes}}/{{parseInt(propiedad.contrato.comienzo.ano) + parseInt(propiedad.contrato.finalizacion)}}</p>
            <h4>Fianza:</h4>
            <p>{{propiedad.contrato.fianza}} €</p>
          </div>

          <v-icon
            v-if="!contratoAñadido"
            color="orange darken-2"
            v-on:click="nuevoContratoShow = true"
            class="iconoContrato"
          >add</v-icon>
        </v-card>

        <!--   N U E V O I N Q U I L I N O -->
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
            v-on:click="searchForFriend()"
          >email</v-icon>
          <v-icon class="checked centrar" color="green" v-if="requestSent">check_circle_outline</v-icon>
        </v-card>
        <v-btn v-if="alquilado" fixed class="chatIcon" fab to="/landLordChat" color="success">
          <v-icon>chat</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- D I A L O G O   N U E V O   D O C U M E N T O-->
    <div class="text-xs-center">
      <v-dialog v-model="nuevoDocumentoShow" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Añadir Documento</v-card-title>

          <v-card-text>
            <div class="cardTex">
              <v-text-field
                label="Nombre del Documento..."
                single-line
                v-model="nombreDocumentoNuevo"
                :counter="8"
                maxlength="8"
              ></v-text-field>
              <input type="file" name="documentos" id="documentos" @change="processFile($event)">
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="validateNuevoDocumento()">Subir a la nube</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- D I A L O G O   C O N T R A T O-->
    <div class="text-xs-center">
      <v-dialog v-model="nuevoContratoShow" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Añadir Contrato</v-card-title>

          <v-card-text>
            <div class="cardTex">
              <p style="marginBottom: -0.7rem">Comienzo del Contrato</p>
              <div class="contratoBegining">
                <v-text-field label="Día" single-line type="number" v-model="contrato.comienzo.dia"></v-text-field>
                <v-text-field label="Mes" single-line type="number" v-model="contrato.comienzo.mes"></v-text-field>
                <v-text-field label="Año" type="number" single-line v-model="contrato.comienzo.ano"></v-text-field>
              </div>
              <v-text-field
                label="Años de duración del Contrato"
                single-line
                type="number"
                v-model="contrato.finalizacion"
              ></v-text-field>
              <v-text-field label="Fianza" single-line type="number" v-model="contrato.fianza"></v-text-field>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="nuevoContratoShow = false">Cancelar</v-btn>
            <v-btn color="primary" flat @click="validateNuevoContrato()">Guardar Contrato</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- S N A C K B A R -->
    <div class="laSnackbar">
      <v-snackbar v-model="showSnack" top>
        {{ snackText }}
        <v-btn color="orange" flat @click="showSnack = false">Cerrar</v-btn>
      </v-snackbar>
    </div>
    <div class="loadingDiv">
      <v-progress-circular size="40" v-if="!loaded" indeterminate color="orange"></v-progress-circular>
    </div>
    <navbar/>
  </div>
</template>

<script>
import navbar from "../../components/navbar.vue";
import firebase from "firebase";
import { db } from "../../main.js";
import axios from "axios";
import { retrieveAlquileres } from "../../funcionalidades.js";
export default {
  data() {
    return {
      loaded: false,
      showSnack: false,
      snackText: null,
      nombreDocumentoNuevo: "",
      propiedad: {},
      alquilado: false,
      inquilinoAañadir: "",
      requestNotSent: true,
      sendingRequest: false,
      requestSent: false,
      nuevoDocumentoShow: false,
      nuevoContratoShow: false,
      documentos: {},
      contrato: {
        comienzo: {
          dia: null,
          mes: null,
          ano: null
        },
        finalizacion: "",
        fianza: ""
      }
    };
  },
  mounted() {
    let pisoElegido = this.$store.state.landlordModule.template;
    this.propiedad = this.$store.getters.alquileres[pisoElegido];
    if (this.propiedad.estado == "Alquilado") {
      this.alquilado = true;
      this.$store.commit("setChatRoom", this.propiedad.chatRoom);
      if (this.$store.getters.documentos == null) {
        this.retreiveDocuments();
      } else {
        this.loaded = true;
        return;
      }
    } else {
      this.loaded = true;
      return;
    }
  },
  methods: {
    searchForFriend() {
      let friendUid = "";
      if (this.inquilinoAañadir) {
        this.requestNotSent = false;
        this.sendingRequest = true;
        let usersIdRef = db
          .collection("users")
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              if (doc.data().email == this.inquilinoAañadir) {
                friendUid = doc.data().uid;
              }
            });

            this.sendRequest(friendUid);
            this.requestNotSent = false;
            this.sendingRequest = false;
            this.requestSent = true;
            setTimeout(() => {
              this.requestSent = false;
              this.requestNotSent = true;
            }, 3000);
          })
          .catch(err => {
            this.snackText = "No existe este usuario";
            this.showSnack = true;
            this.sendingRequest = false;
            this.requestSent = false;
            this.requestNotSent = true;
          });
      }
    },
    sendRequest(friendUid) {
      let ref = db
        .collection(`users`)
        .doc(`${friendUid}`)
        .update({
          chatRoom: this.$store.getters.alquileres[this.propiedad.nombre]
            .chatRoom
        })
        .then(yes => {
          console.log("Request Sent");
          this.inquilinoAañadir = "";
        })
        .catch(err => {
          console.log(err);
        });
    },
    validateNuevoDocumento() {
      if (
        this.nombreDocumentoNuevo == null ||
        this.nombreDocumentoNuevo.lenth <= 2
      ) {
        this.snackText = "Rellene el nombre del documento";
        this.showSnack = true;
      } else {
        this.nuevoDocumentoShow = false;
        this.nuevoDocumento();
      }
    },
    nuevoDocumento() {
      let userId = this.$store.getters.user.uid;
      let ref = firebase.storage().ref();
      let event = this.fileEvent;
      let documentosAlquiler = event.target.files[0];
      let metadata = { contentType: documentosAlquiler.type };

      const task = ref
        .child(
          `${userId}/${this.propiedad.nombre}/${this.nombreDocumentoNuevo}`
        )
        .put(documentosAlquiler, metadata);

      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          this.registerUrl(url);
        })
        .catch(console.error);
    },
    registerUrl(url) {
      let urlObject = new Object();
      urlObject[this.nombreDocumentoNuevo] = url;
      axios
        .post(
          `https://rendita-37714.firebaseio.com/documentos/${
            this.$store.getters.user.uid
          }/${this.propiedad.chatRoom}.json`,
          urlObject
        )
        .then(result => {
          this.retreiveDocuments();
        })
        .catch(err => {
          console.log(err);
        });
    },
    retreiveDocuments() {
      let documentos = new Object();
      axios
        .get(
          `https://rendita-37714.firebaseio.com/documentos/${
            this.$store.getters.user.uid
          }/${this.propiedad.chatRoom}.json`
        )
        .then(result => {
          for (const doc in result.data) {
            if (result.data.hasOwnProperty(doc)) {
              const element = result.data[doc];
              let elementObject = new Object();
              let elementNombre = Object.keys(element)[0];
              elementObject["nombre"] = elementNombre;
              elementObject["url"] = element[Object.keys(element)];
              documentos[Object.keys(element)] = elementObject;
            }
          }
          this.documentos = documentos;
          this.$store.commit("setDocumentos", documentos);
          this.loaded = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    processFile(event) {
      this.fileEvent = event;
    },
    validateNuevoContrato() {
      if (
        this.contrato.comienzo == "" ||
        this.contrato.finalizacion == "" ||
        this.contrato.fianza == ""
      ) {
        this.snackText = "Rellene todos los campos";
        this.showSnack = true;
      } else {
        this.uploadNuevoContrato();
      }
    },
    uploadNuevoContrato() {
      db.collection("propiedades")
        .doc(this.propiedad.chatRoom)
        .update({
          contrato: {
            comienzo: this.contrato.comienzo,
            finalizacion: this.contrato.finalizacion,
            fianza: this.contrato.fianza,
            diaDeComienzo: 3
          }
        })
        .then(() => {
          console.log("new contrato");
          this.contrato.comienzo = "";
          this.contrato.finalizacion = "";
          this.contrato.fianza = "";
          this.nuevoContratoShow = false;
        });
    }
  },
  computed: {
    cuantosInquilinos() {
      let numeroDeInquilinos = Object.keys(this.propiedad.inquilinos).length;
      if (numeroDeInquilinos <= 1) {
        return true;
      } else {
        return false;
      }
    },
    contratoAñadido() {
      if (this.propiedad.contrato == null) {
        console.log("entra");
        return false;
      } else {
        return true;
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

.centrar {
  justify-self: center;
}

.progreso {
  margin-top: 1.3rem;
}

.checked {
  margin-top: 1rem;
  font-size: 2rem;
}

.chatIcon {
  bottom: 6rem;
  right: 1rem;
}

.topPartWrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid black;
}

.topPartWrapper img {
  height: 2rem;
  justify-self: right;
  margin-right: 1rem;
}

.documentosWrapper {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.documentosThumbnail {
  justify-self: center;
  display: grid;
  grid-template-rows: 1fr 1fr;
}

.documentosThumbnail img {
  height: 5rem;
  justify-self: center;
  margin-bottom: 1rem;
}

.icono {
  font-size: 5rem;
  justify-self: center;
}

.cardTex {
  display: grid;
}

.nombreDocumentoNuevo {
  justify-self: center;
  border: 1px solid black;
  border-radius: 5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  width: 70vw;
}

.alertasTextoWrapper {
  display: grid;
}
.contrato {
  display: grid;
}

.iconoContrato {
  justify-self: center;
  font-size: 2rem;
}

.Notificaciones {
  max-height: 30rem;
  overflow: scroll;
}

.loadingDiv {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.contratoBegining {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5px;
}
</style>
