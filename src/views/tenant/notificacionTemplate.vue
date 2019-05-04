<template>
  <div class="notificacion">
    <div class="notificacionWrapper">
      <v-card class="notificacionCard">
        <h2>{{notificacion.titulo}}</h2>
        <p class="texto">{{notificacion.texto}}</p>
        <p class="fecha">{{notificacion.fecha}}</p>
        <v-btn to="/tenantHome" class="btn" color="error">Sin solucionar</v-btn>
        <v-btn v-on:click="solucionado()" class="btn" color="success">Solucionado</v-btn>
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
      notificacion: new Object(),
      loading: false
    };
  },
  methods: {
    solucionado() {
      //Crear objeto Con Notificación
      let notificacionObject = this.notificacion;
      notificacionObject["pendiente"] = false;
      notificacionObject["url"] = "Sin Documentos";

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
              this.$router.push("/tenantHome")
            });
        });
    }
  },
  mounted() {
    this.notificacion = this.$store.getters.notificaciones[
      this.$store.getters.notificacionTemplate
    ];
  }
};
</script>

<style scoped>
.notificacion {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/fotos/backgroundTemplate3.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding-top: 2rem;
}

.notificacionWrapper {
  height: 92vh;
  overflow-y: auto;
}

.notificacionCard {
  min-height: 90vh;
  margin: 0 1rem;
  padding: 1rem;
  text-align: center;
}

.texto {
  margin: 2rem 0;
  font-size: 1.2rem;
  text-align: left;
  line-height: 2rem;
}

.fecha {
  text-align: right;
  color: rgb(161, 161, 161);
}
</style>
