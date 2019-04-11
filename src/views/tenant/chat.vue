<template>
  <div class="chat">
    <div class="chatWrapper">
      <div class="iconBackWrapper" style="display:grid">
        <v-icon color="yellow" class="backIcon" v-on:click="paTras()">arrow_back</v-icon>
      </div>
      <div v-chat-scroll="{always: false, smotth:true}" class="chatTextArea">
        <div v-if="loaded" class="messagesWrap">
          <div v-for="(mensaje, index) in mensajes" :key="index" class="chatThumbnail">
            <!--if message received-->
            <div v-if="mensaje.origin" class="headerReceived">
              <div class="avatarWrapper">
                <v-avatar class="avatar" size="40" color="red">
                  <img src="../../assets/fotos/avatar.jpg" alt="alt">
                </v-avatar>
              </div>
              <h4>{{mensaje.nombre}}</h4>
            </div>

            <!--if message sent-->
            <div v-else class="headerSent">
              <h4>{{mensaje.nombre}}</h4>
              <div class="avatarWrapper">
                <v-avatar class="avatar" size="40" color="red">
                  <img src="../../assets/fotos/avatar.jpg" alt="alt">
                </v-avatar>
              </div>
            </div>

            <p>{{mensaje.texto}}</p>
            <p
              style="textAlign:right; fontSize:0.85rem; color:gray; marginBottom: -0.5rem"
            >{{mensaje.fecha}}</p>
          </div>
        </div>
      </div>
      <div class="inputArea">
        <input type="text" placeholder="Escribe un mensaje" v-model="inputChat">
        <v-icon v-if="messageReceived" v-on:click="configureMessage()">send</v-icon>
        <v-progress-circular size="24" v-else class="progreso" indeterminate color="orange"></v-progress-circular>
      </div>
    </div>
    <tnavbar style="display:none"/>
  </div>
</template>

<script>
import tnavbar from "../../components/tnavbar.vue";
import meses from "../../assets/database/meses.json";
import firebase from "firebase";
import { db } from "../../main.js";
export default {
  data() {
    return {
      mensajes: {},
      inputChat: null,
      loaded: false,
      lengthOfMessage: 0,
      messageReceived: true,
      addLandlord: true,
    };
  },
  methods: {
    paTras() {
      this.$router.push("/tenantHome");
    },
    configureMessage() {
      if (this.$store.getters.chatRoom) {
        if (this.inputChat) {
          this.messageReceived = false;
          let nuevoMensaje = new Object();
          let date = new Date();
          let day = date.getDate();
          let month = date.getMonth();
          let year = date.getFullYear();

          nuevoMensaje["nombre"] = this.$store.getters.user.nombre;
          nuevoMensaje["fecha"] = `${day}/${month}/${year}`;
          nuevoMensaje["texto"] = this.inputChat;
          nuevoMensaje["origin"] = false;
          nuevoMensaje["timestamp"] = date;
          this.newMessage(nuevoMensaje);
        }
      };
    },
    newMessage(nuevoMensaje) {
      this.lengthOfMessage = Object.keys(this.mensajes).length;
      let chatRoom = this.$store.getters.chatRoom;
      db.collection(`compartido/chatRoom/${chatRoom}`)
        .doc(JSON.stringify(nuevoMensaje.timestamp))
        .set(nuevoMensaje)
        .catch(err => {
          console.log(err);
        });
      this.inputChat = "";
      this.retreiveMessages();
    },
    retreiveMessages() {
      let chatRoom = this.$store.getters.chatRoom;
      let chatsRef = db.collection(`compartido/chatRoom/${chatRoom}`); //.orderBy("timestamp");
      let chats = chatsRef
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.mensajes[doc.id] = doc.data();
          });
          this.loaded = false;
          this.loaded = true;
          this.messageReceived = true;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.retreiveMessages();
    if (this.$store.getters.chatRoom == null) {
      this.addLandlord = true;
    }
  },
  components: {
    tnavbar
  }
};
</script>

<style scoped>
.chat {
  background-image: url("../../assets/fotos/backgroundTemplate3.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100vh;
}

.chatWrapper {
  display: grid;
  padding-top: 1rem;
}

.backIcon {
  justify-self: left;
  margin-left: 1rem;
  font-size: 2rem;
}

.chatTextArea {
  overflow-y: scroll;
  height: 83vh;
  margin-bottom: 3vh;
}

.chatThumbnail {
  background-color: whitesmoke;
  margin: 1rem 1rem;
  padding: 1rem;
  border-radius: 10px;
}

.headerReceived {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 9fr;
}

.headerReceived h4 {
  margin-top: 0.7rem;
  margin-left: 1rem;
}

.headerSent {
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 9fr 1fr;
}

.headerSent h4 {
  margin-top: 0.7rem;
  margin-right: 1rem;
  justify-self: right;
}

.headerSent div {
  justify-self: right;
}

.inputArea {
  display: grid;
}

.inputArea {
  display: grid;
  grid-template-columns: 1fr 9fr 1fr;
  margin: 0 2rem;
  background-color: whitesmoke;
  justify-self: center;
  width: 75vw;
  padding: 0.5rem 1rem;
  border-radius: 5rem;
}

.inputArea input {
  justify-self: right;
  margin-right: 3rem;
}

.inputArea input:focus {
  outline: none;
}

.progreso {
  justify-self: right;
  margin-right: 1rem;
}
</style>
