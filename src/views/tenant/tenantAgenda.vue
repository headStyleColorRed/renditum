<template>
  <div class="agenda">
    <div class="agendaWrapper">
      <div v-if="friendRequest" class="friendRequest">
        <v-card class="friendRequestCard">
          <h3>Tienes una petición de amistad de</h3>
          <div class="individuo">
            <p>Rodrigo Labrador Serrano</p>
          </div>
          <div class="botonesAceptacion">
            <button class="aceptar" v-on:click="aceptar()">Aceptar</button>
            <button class="ignorar" v-on:click="ignorar()">Ignorar</button>
          </div>
        </v-card>
      </div>
      <div class="toDoList">
        <v-card class="toDoListCard">
          <h2>Lista de Quehaceres</h2>
          <div class="listaDeQuehaceres"></div>
        </v-card>
        <v-btn color="success" v-on:click="añadirAPagos()">upload</v-btn>
      </div>

      <v-btn color="red" v-on:click="logout()">Log Out</v-btn>
    </div>
    <tnavbar/>
  </div>
</template>

<script>
import tnavbar from "../../components/tnavbar.vue";
import firebase from "firebase";
import { db } from "../../main.js";
export default {
  data() {
    return {
      friendRequest: false,
      chatRoom: "",
      arrendatarioData: new Object()
    };
  },
  computed: {
    // convert the list of events into a map of lists keyed by date
    eventsMap() {
      const map = {};
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e));
      return map;
    }
  },
  methods: {
    logout() {
      this.$store.commit("resetStoreState");
      this.$store.commit("resetTstoreState");
      this.$store.commit("resetAuthState");

      this.$store.dispatch("firebaseLogout").then(() => {
        this.$router.push("/");
        localStorage.clear();
      });
    },
    open(event) {
      alert(event.title);
    },
    aceptar() {
      this.$store.commit("setChatRoom", this.chatRoom);
      //this.friendRequest = false;

      let viviendaRef = db
        .collection("users")
        .doc(this.$store.getters.user.uid)
        .update({ chatRoomAccept: true });

      //Recupera objeto Inquilino
      let inquilino = new Object();
      let inquilinoRef = db
        .collection("propiedades")
        .doc(this.chatRoom)
        .get()
        .then(snapshot => {
          inquilino = snapshot.data().inquilinos;
          return inquilino;
        })
        .then(listaInquilinos => {
          // Merge los existentes inquilinos con el nuevo;
          listaInquilinos[this.arrendatarioData.uid] = this.arrendatarioData;

          let viviendaRef = db
            .collection("propiedades")
            .doc(this.chatRoom)
            .update({ inquilinos: listaInquilinos });
        })
        .then(() => {
          this.añadirAPagos();
        });

      let estadoRef = db
        .collection("propiedades")
        .doc(this.chatRoom)
        .update({ estado: "Alquilado" });
    },
    añadirAPagos() {
          this.$router.push("/tenantChat");
          console.log("updateado");
    },
    ignorar() {
      this.friendRequest = false;
    },
    notificacionesAmistad() {
      let ref = db
        .collection("users")
        .doc(this.$store.getters.user.uid)
        .get()
        .then(snapshot => {
          this.arrendatarioData = snapshot.data();
          console.log(snapshot.data());
          if (snapshot.data().chatRoom) {
            this.friendRequest = true;
            this.chatRoom = snapshot.data().chatRoom;
          } else {
          }
        });
    }
  },
  mounted() {
    if (this.$store.getters.chatRoom == null) {
      this.notificacionesAmistad();
    }
  },
  components: {
    tnavbar
  }
};
</script>

<style scoped>
.agenda {
  background-image: url("../../assets/fotos/backgroundTemplate.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100vh;
  overflow-y: scroll;
}

.agendaWrapper {
  display: grid;
  padding-top: 2rem;
  margin-bottom: 5rem;
}

.friendRequestCard {
  margin: 1rem;
  padding: 0.5rem;
}

.individuo {
  margin-top: 1rem;
}

.individuo p {
  margin-top: 1rem;
}

.botonesAceptacion {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 1rem 2rem;
  grid-gap: 1rem;
}

.friendRequestCard button {
  padding: 0.5rem 1rem;
  border-radius: 5rem;
}

.friendRequestCard button:focus {
  outline: none;
}

.aceptar {
  border: 1px solid green;
  color: green;
}

.ignorar {
  border: 1px solid red;
  color: red;
}

.toDoListCard {
  margin: 1rem;
  padding: 1rem;
}
</style>
