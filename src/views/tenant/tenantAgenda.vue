<template>
  <div class="agenda">
    <div class="agendaWrapper">
        <div v-if="friendRequest" class="friendRequest">
            <v-card class="friendRequestCard">
                <h3>Tienes una petición de amistad</h3>
                <div class="individuo">
                    <v-avatar
                        size="50"
                        color="red"
                    >
                    </v-avatar>
                    <p>Rodrigo Labrador Serrano</p>
                </div>
                <div class="botonesAceptacion">
                    
                <button class="aceptar" v-on:click="aceptar()">Aceptar</button>
                <button class="ignorar" v-on:click="ignorar()">Ignorar</button>
                </div>
            </v-card>
        </div>
      <div class="calendario">
        <v-card class="calendarioCard">
          <v-layout>
            <v-flex>
              <v-sheet height="400">
                <v-calendar :now="today" :value="today" color="primary">
                  <template v-slot:day="{ date }">
                    <template v-for="event in eventsMap[date]">
                      <v-menu :key="event.title" v-model="event.open" full-width offset-x>
                        <template v-slot:activator="{ on }">
                          <div
                            v-if="!event.time"
                            v-ripple
                            class="my-event"
                            v-on="on"
                            v-html="event.title"
                          ></div>
                        </template>
                        <v-card color="grey lighten-4" min-width="350px" flat>
                          <v-toolbar color="primary" dark>
                            <v-btn icon>
                              <v-icon>edit</v-icon>
                            </v-btn>
                            <v-toolbar-title v-html="event.title"></v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                              <v-icon>more_vert</v-icon>
                            </v-btn>
                          </v-toolbar>
                          <v-card-title primary-title>
                            <span v-html="event.details"></span>
                          </v-card-title>
                          <v-card-actions>
                            <v-btn flat color="secondary">Cancel</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </template>
                  </template>
                </v-calendar>
              </v-sheet>
            </v-flex>
          </v-layout>
        </v-card>
      </div>

      <v-btn  color="red" v-on:click="logout()">Log Out</v-btn>
    </div>
    <tnavbar/>
  </div>
</template>

<script>
import tnavbar from "../../components/tnavbar.vue";
export default {
  data() {
    return {
      today: "2019-01-08",
      events: [
        {
          title: "Vacation",
          details: "Going to the beach!",
          date: "2018-12-30",
          open: false
        },
        {
          title: "Vacation",
          details: "Going to the beach!",
          date: "2018-12-31",
          open: false
        },
        {
          title: "Vacation",
          details: "Going to the beach!",
          date: "2019-01-01",
          open: false
        },
        {
          title: "Meeting",
          details: "Spending time on how we do not have enough time",
          date: "2019-01-07",
          open: false
        },
        {
          title: "30th Birthday",
          details: "Celebrate responsibly",
          date: "2019-01-03",
          open: false
        },
        {
          title: "New Year",
          details: "Eat chocolate until you pass out",
          date: "2019-01-01",
          open: false
        },
        {
          title: "Conference",
          details:
            "Mute myself the whole time and wonder why I am on this call",
          date: "2019-01-21",
          open: false
        },
        {
          title: "Hackathon",
          details: "Code like there is no tommorrow",
          date: "2019-02-01",
          open: false
        }
      ],
      friendRequest: true,
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
      let finalUser = new Object();
      finalUser["uid"] = "";
      finalUser["email"] = "";
      finalUser["nombre"] = "";

      this.$store.dispatch("firebaseLogout").then(() => {
        this.$store.commit("setUser", finalUser);
        this.$store.commit("setRole", "arrendatario");
        this.$router.push("/");
      });
    },
    open(event) {
      alert(event.title);
    },
    aceptar(){
        
    },
    ignorar(){
        this.friendRequest = false;
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

.friendRequestCard{
    margin: 1rem;
    padding: 0.5rem;
}


.individuo{
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr 3fr;
}

.individuo p{
    margin-top: 1rem;
}


.botonesAceptacion{
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1rem 2rem;
    grid-gap: 1rem;
}


.friendRequestCard button{
    padding: 0.5rem 1rem;
    border-radius: 5rem;
}

.friendRequestCard button:focus{
    outline: none;
}

.aceptar{    
    border: 1px solid green;
    color: green;
}

.ignorar{    
    border: 1px solid red;
    color: red;
}




.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  width: 100%;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
}

.calendarioCard{
    margin: 1rem;
}


</style>
