<template>
  <div class="login">
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
    password: "",
    contraseñaConf: "",
    email: "",
    color: "primary",
    registering: false,
    loading: false
  }),

  methods: {
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
              this.$store.commit("setRole", snapshot.data().role);
              this.$router.push("/landlordHome");
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
        this.register(this.email, this.password);
      }
    },
    register(email, password) {
      let user = new Object();
      user["email"] = email;
      user["password"] = password;

      this.$store
        .dispatch("firebaseRegister", user)
        .then(userRegistered => {
          const DATA = {
            uid: userRegistered.user.uid,
            email: userRegistered.user.email,
            role: "tenant"
          };

          db.collection("users")
            .doc(DATA.uid)
            .set(DATA)
            .then(() => {
              this.$store.commit("setRole", DATA.role);
              this.$router.push("/landlordHome");
            });
        })
        .catch(err => {
          this.loading = false;
          if (err.code == "auth/email-already-in-use") {
            this.snackText = "This email is already in use.";
            this.showSnack = true;
          }
        });
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  background: #fff;
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
