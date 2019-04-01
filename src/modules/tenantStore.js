//import firebase from "firebase";
import dataBase from "../assets/database/landlordPisos.json"

export default {
    state:{
        alquileres: dataBase,
        template: "",
    },
    mutations:{
        setAlquileres: (state, alquileres) =>{
            state.alquileres = alquileres;
        },
        setTemplate: (state, template) =>{
            state.template = template;
        }
    },
    getters:{
        alquileres: (state) =>{
            return state.alquileres;
        },
        template: (state) =>{
            return state.template;
        },
    }
}