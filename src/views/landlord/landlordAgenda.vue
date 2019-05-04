<template>
  <div class="agenda">
    <div class="agendaWrapper">
      <v-btn color="success" v-on:click="logout()">Log Out</v-btn>
      <v-btn v-on:click="showStore()" color="error">Show store</v-btn>
      
    </div>
    <navbar/>
  </div>
</template>

<script>
import navbar from "../../components/navbar.vue";
import { db } from "../../main.js";
export default {
  data() {
    return {
    }
  },
  methods: {
    logout() {

      this.$store.commit("resetStoreState");
      this.$store.commit("resetTstoreState");
      this.$store.commit("resetAuthState");
      this.$store.commit("resetLandlordState");

      this.$store.dispatch("firebaseLogout").then(() => {
        this.$router.push("/");
        localStorage.clear();
      });
    },
  },
  components: {
    navbar
  },
  mounted() {
    console.log(this.$store.state);
  },
};
</script>

<style>
</style>
