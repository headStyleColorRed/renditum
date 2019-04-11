//import firebase from "firebase";
import dataBase from "../assets/database/landlordPisos.json"

export default {
    state:{
        template: "",
    },
    mutations:{
        setTemplate: (state, template) =>{
            state.template = template;
        }
    },
    getters:{
        template: (state) =>{
            return state.template;
        },
    }
}