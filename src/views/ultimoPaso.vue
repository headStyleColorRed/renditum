<template>
  <div class="ultimo">
    <div class="ultimoWrapper">
      <v-card class="newHouseCard">
        <div class="inputs">
          <h3>Teléfono:</h3>
          <input class="nombreYdireccion" type="text" v-model="telefono">
        </div>
        <div class="inputs">
          <h3>Dni:</h3>
          <input class="nombreYdireccion" type="text" v-model="dni">
        </div>

        <div class="inputs">
          <h3>Foto:</h3>
          <image-uploader
            :preview="false"
            :className="['fileinput', { 'fileinput--loaded': hasImage }]"
            capture="environment"
            :debug="1"
            :autoRotate="true"
            outputFormat="string"
            @input="setImage"
            :maxWidth="100"
            :maxHeight="100"
          >
            <label for="fileInput" slot="upload-label">
              <figure>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path
                    class="path1"
                    d="M9.5 19c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5zM30 8h-7c-0.5-2-1-4-3-4h-8c-2 0-2.5 2-3 4h-7c-1.1 0-2 0.9-2 2v18c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-18c0-1.1-0.9-2-2-2zM16 27.875c-4.902 0-8.875-3.973-8.875-8.875s3.973-8.875 8.875-8.875c4.902 0 8.875 3.973 8.875 8.875s-3.973 8.875-8.875 8.875zM30 14h-4v-2h4v2z"
                  ></path>
                </svg>
              </figure>
              <span class="upload-caption">
                {{
                hasImage ? "Cambiar Foto" : "Click para subir una Foto"
                }}
              </span>
            </label>
          </image-uploader>
        </div>

        <v-btn v-if="loading" class="white--text" color="blue lighten-1">
          <v-progress-circular indeterminate color="amber" size="30"></v-progress-circular>
        </v-btn>
        <v-btn
          v-else
          class="white--text"
          v-on:click="validateRegister()"
          color="blue lighten-1"
        >Guardar</v-btn>
      </v-card>
    </div>
    <!-- S N A C K B A R -->
    <div class="laSnackbar">
      <v-snackbar v-model="showSnack" top>
        {{ snackText }}
        <v-btn color="orange" flat @click="showSnack = false">Cerrar</v-btn>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import { db } from "../main.js";
import fotoPerfilStandard from "../assets/database/fotoPerfil.json";
export default {
  data() {
    return {
      showSnack: false,
      snackText: "",
      telefono: null,
      dni: null,
      hasImage: false,
      image: null,
      loading: false
    };
  },
  methods: {
    setImage: function(output) {
      this.hasImage = true;
      this.image = output;
      console.log(this.image);
    },
    validateRegister() {
      //this.loading = true;
      if (this.telefono <= 5 || this.dni <= 5) {
        this.snackText = "Formato de Teléfono o Dni incorrectos";
        this.showSnack = true;
      } else if (this.image == null) {
        this.image = fotoPerfilStandard.fotoPerfil;
        this.uploadData();
      } else {
        this.uploadData();
      }
    },
    uploadData() {
      let fotoRef = db
        .collection("users")
        .doc(this.$store.getters.user.uid)
        .update({
          dni: this.dni,
          tlf: this.telefono,
          imgPerfil: this.image
        })
        .then(nosVamos => {
          if (this.$store.getters.role == "Arrendador") {
            this.$router.push("/landlordHome");
            console.log("como arrendador");
          } else {
            console.log("como arrendatario");
            this.$router.push("/tenantHome");
          }
        });
    }
  },
  components: {
  }
};
</script>

<style scoped>
.ultimo {
  background-image: url("../assets/fotos/backgroundTemplate3.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 100vh;
}

.ultimoWrapper {
  display: grid;
  padding-top: 1rem;
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

#fileInput {
  background-color: red;
  height: 10rem;
}
</style>
