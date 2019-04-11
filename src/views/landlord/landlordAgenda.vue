<template>
  <div class="agenda">
    <div class="agendaWrapper">
      <v-btn color="success" v-on:click="logout()">Log Out</v-btn>
    </div>
    <navbar/>
  </div>
</template>

<script>
import navbar from "../../components/navbar.vue";
export default {
  methods: {
    logout() {
      let finalUser = new Object();
      finalUser["uid"] = "";
      finalUser["email"] = "";
      finalUser["nombre"] = "";

      this.$store.dispatch("firebaseLogout").then(() => {
      this.$store.commit("setUser", finalUser);
        this.$store.commit("setRole", "arrendatario");
        this.$router.push("/");
      });
    }
  },
  components: {
    navbar
  }
};
</script>

<style>
</style>
