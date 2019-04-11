<template>
  <div class="login">
    <!-- L O G I N   C A R D -->
    <div class="flip-card">
      <div class="flip-card-inner" v-bind:style="{transform:giramelo}">
        <div v-if="noGirado" class="flip-card-front">
          <div class="loginWrapper">
            <div class="welcomeText">
              <div class="welcome">Bienvenido!</div>
              <div class="subtitle" v-if="registering">La mejor plataforma de alquiler</div>
              <div v-else class="subtitle">Échale un vistazo a tu contrato</div>
            </div>

            <div class="input-fields">
              <div class="email-bundle bundle">
                <label for="email" class="input-labels">Email</label>
                <div class="inputAndicon">
                  <input
                    autocomplete="off"
                    name="email"
                    type="text"
                    v-model="email"
                    required
                    class="input-line"
                  >
                  <v-icon color="orange">email</v-icon>
                </div>
              </div>

              <div class="password-bundle bundle">
                <label for="password" class="input-labels">Contraseña</label>

                <div class="inputAndicon">
                  <input
                    autocomplete="off"
                    name="password"
                    type="password"
                    v-model="password"
                    required
                    class="input-line"
                  >
                  <v-icon color="orange">lock</v-icon>
                </div>
              </div>

              <div v-if="registering" class="password-bundle bundle">
                <label for="confContraseña" class="input-labels">Confirme Contraseña</label>
                <div class="inputAndicon">
                  <input
                    autocomplete="off"
                    name="confContraseña"
                    type="password"
                    v-model="contraseñaConf"
                    required
                    class="input-line"
                  >
                  <v-icon color="orange">lock</v-icon>
                </div>
              </div>
            </div>

            <div class="links-to-register-login">
              <div v-if="!registering" class="spacing">
                O regístrate
                <span v-on:click="registering = true" class="highlight">aquí!</span>
              </div>

              <div v-if="registering" class="spacing">
                O vuelve al
                <span v-on:click="registering = false" class="highlight">login</span>
              </div>
            </div>

            <div class="loginAndRegisterButtons">
              <div v-if="registering" class="recuadro">
                <div v-if="loading" class="lds-roller">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <button v-else v-on:click="validateRegistering()" class="login-register">Regístrate</button>
              </div>

              <div v-else class="recuadro">
                <div v-if="loading" class="lds-roller">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <button v-else v-on:click="validateLogin()" class="login-register">Log in</button>
              </div>
            </div>
          </div>
        </div>

        <!-- B A C K   P A R T-->
        <div class="flip-card-back">
          <div class="welcome">Último Paso</div>
          <div class="inputsSecondPart">
            <div class="inputSP">
              <label for="nombre" class="input-labels-Back">Nombre</label>
              <div class="inputAndicon">
                <input
                  autocomplete="off"
                  name="nombre"
                  type="text"
                  v-model="nombre"
                  required
                  class="input-line"
                >
              </div>
            </div>
            <div class="inputSP">
              <label for="apellidos" class="input-labels-Back">Apellidos</label>
              <div class="inputAndicon">
                <input
                  autocomplete="off"
                  name="apellidos"
                  type="text"
                  v-model="apellidos"
                  required
                  class="input-line"
                >
              </div>
            </div>
            <div class="seleccionDeRol">
              <v-select :items="tenantOrLandlord" box label="Rol" v-model="role" dark></v-select>
            </div>
          </div><div class="recuadro">
          <div v-if="loading" class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <button v-else v-on:click="validateInfo()" class="login-register">Regístrate</button>
        </div>
        </div>
      </div>
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
export default {
  data: () => ({
    snackText: "",
    showSnack: false,
    password: "123456",
    contraseñaConf: "123456",
    email: "irlandesmajere@hotmail.com",
    color: "primary",
    registering: false,
    loading: false,
    giramelo: "",
    noGirado: true,
    nombre: "",
    apellidos: "",
    tenantOrLandlord: ["Arrendador", "Arrendatario"],
    role: "",
    user: {}
  }),

  methods: {
    onChange(image) {
      console.log("New picture selected!");
      if (image) {
        console.log("Picture loaded.");
        this.image = image;
      } else {
        console.log("FileReader API not supported: use the <form>, Luke!");
      }
    },
    validateLogin() {
      if (this.password == "" || this.email == "") {
        this.snackText = "Please fill in all fields";
        this.showSnack = true;
      } else if (!this.email.includes("@")) {
        this.snackText = "That's not a valid email.";
        this.showSnack = true;
      } else if (!this.email.includes(".com")) {
        this.snackText = "That's not a valid email.";
        this.showSnack = true;
      } else {
        this.loading = true;
        this.loginUser();
      }
    },
    loginUser() {
      let user = new Object();
      user["email"] = this.email;
      user["password"] = this.password;

      this.$store
        .dispatch("firebaseLogin", user)
        .then(loggedUser => {
          db.collection("users")
            .doc(loggedUser.user.uid)
            .onSnapshot(snapshot => {
              console.log(snapshot.data());
              let finalUser = new Object();
              finalUser["uid"] = snapshot.data().uid;
              finalUser["email"] = snapshot.data().email;
              finalUser["nombre"] = snapshot.data().nombre;

              this.$store.commit("setUser", finalUser)
              this.$store.commit("setRole", snapshot.data().role);

              if (snapshot.data().role == "Arrendador") {
                this.$router.push("/landlordHome");
              } else {
                this.$router.push("/tenantHome");
              }
              console.log("login succesfull");
              this.loading = false;
            });
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          if (err.code == "auth/user-not-found") {
            this.snackText = "This user doesn't exist!";
            this.showSnack = true;
          } else if (err.code == "auth/wrong-password") {
            this.snackText = "Email or Password wrong.";
            this.showSnack = true;
          }
        });
    },
    validateRegistering() {
      if (this.password == "" || this.email == "") {
        this.snackText = "Please fill in all fields";
        this.showSnack = true;
      } else if (!this.email.includes("@")) {
        this.snackText = "That's not a valid email.";
        this.showSnack = true;
        console.log("bien");
      } else if (!this.email.includes(".com")) {
        this.snackText = "That's not a valid email.";
        this.showSnack = true;
      } else if (this.password.length < 6) {
        this.snackText = "Password must be at least 6 characters long";
        this.showSnack = true;
      } else if (this.password !== this.contraseñaConf) {
        this.snackText = "Passwords don't match, try again.";
        this.showSnack = true;
      } else {
        this.loading = true;
        this.register();
      }
    },
    register() {
      let user = new Object();
      user["email"] = this.email;
      user["password"] = this.password;

      this.$store
        .dispatch("firebaseRegister", user)
        .then(userRegistered => {
          const DATA = {
            uid: userRegistered.user.uid,
            email: userRegistered.user.email
          };
          this.loading = false;
          this.giramelo = "rotateY(180deg)";
          this.user = DATA;
          console.log(DATA);
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          if (err.code == "auth/email-already-in-use") {
            this.snackText = "This email is already in use.";
            this.showSnack = true;
            this.giramelo = "";
          }
        });
    },
    validateInfo() {
      if (this.nombre == "" || this.apellidos == "" || this.role == "") {
        this.snackText = "Please fill in all fields";
        this.showSnack = true;
      } else {
        this.registerInfo();
      }
    },
    registerInfo() {
      this.loading = true;
      let DATA = new Object();
      DATA["uid"] = this.user.uid;
      DATA["email"] = this.user.email;
      DATA["nombre"] = this.nombre;
      DATA["apellidos"] = this.apellidos;
      DATA["role"] = this.role;
      db.collection("users")
        .doc(DATA.uid)
        .set(DATA)
        .then(() => {
          this.$store.commit("setRole", DATA.role);
          if (DATA.role === "Arrendador") {
            this.$router.push("/landlordHome");
          } else {
            this.$router.push("/tenantHome");
          }
          console.log("Ya estás registrado!");
        });
    },
    girar() {
      this.giramelo = "rotateY(180deg)";
    }
  },
  components: {}
};
</script>

<style scoped>
.login {
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/fotos/fotoCasa.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}

.loginWrapper {
  background-color: rgb(66, 66, 66);
  width: 80vw;
  color: whitesmoke;
  display: grid;
  border-radius: 3px;
}

.welcome {
  font-weight: 200;
  margin-top: 1rem;
  text-align: center;
  font-size: 40px;
  font-size: 2.5rem;
  letter-spacing: 0px;
  letter-spacing: 0.05rem;
}

.subtitle {
  text-align: center;
  line-height: 1em;
  font-weight: 100;
  letter-spacing: 0px;
  letter-spacing: 0.02rem;
}

.subtitleBack {
  text-align: center;
  line-height: 1em;
  font-weight: 100;
  letter-spacing: 0px;
  letter-spacing: 0.02rem;
  margin-top: 1rem;
}

.input-fields {
  padding: 3rem 1rem;
  display: grid;
  grid-gap: 1rem;
}

.input-line {
  border-bottom: 1px solid white;
}

.bundle {
  display: grid;
  grid-template-rows: 1fr 1fr;
}

.input-labels {
  font-size: 0.8rem;
  font-weight: 300;
  text-align: left;
}

.inputAndicon {
  display: grid;
  grid-template-columns: 5fr 1fr;
}

textarea:focus,
input:focus {
  outline: none;
}

.loginAndRegisterButtons {
  justify-self: center;
  margin-bottom: 2rem;
}

.login-register {
  border: 1px solid white;
  padding: 0.5rem 2rem;
  cursor: pointer;
}

.login-register:active {
  background-color: rgb(148, 148, 148);
  color: rgb(56, 56, 56);
  transform: translateY(2px);
}

.login-register:focus {
  outline: none;
}

.highlight {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  cursor: pointer;
  transition: color 0.2s ease;
}

.spacing {
  height: 3rem;
  margin-bottom: 1rem;
  font-weight: 300;
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
}

.recuadro {
  height: 4rem;
}

.inputSP {
  display: grid;
  margin: 1rem;
  margin-top: 2rem;
}

.input-labels-Back {
  font-size: 0.8rem;
  font-weight: 300;
  justify-self: left;
}
.seleccionDeRol {
  margin: 1rem;
  margin-top: 2rem;
  margin-bottom: 0;
}

.imagen {
  margin: 0 1rem;
}

.boton {
  margin: 1rem;
}
/*  F  L  I  P     C  A  R  D */

/*  F  L  I  P     C  A  R  D */

.flip-card {
  background-color: transparent;
  width: 300px;
  height: 200px;
  perspective: 1000px;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Position the front and back side */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 70%;
  backface-visibility: hidden;
}

/* Style the back side */
.flip-card-back {
  background-color: rgb(66, 66, 66);
  height: 72vh;
  color: white;
  transform: rotateY(180deg);
}

.flip-card-back h3 {
  margin-top: 2rem;
}

/*    S P I N E L L I    */
.lds-roller {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 32px 32px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffa500;
  margin: -3px 0 0 -3px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 50px;
  left: 50px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 54px;
  left: 45px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 57px;
  left: 39px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 58px;
  left: 32px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 57px;
  left: 25px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 54px;
  left: 19px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 50px;
  left: 14px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 45px;
  left: 10px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
