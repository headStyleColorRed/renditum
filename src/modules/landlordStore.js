//import firebase from "firebase";

export default {
    state:{
        template: "",
    },
    mutations:{
        setTemplate: (state, template) =>{
            state.template = template;
        },
        resetLandlordState (state) {
            state.template = null;
         }
    },
    getters:{
        template: (state) =>{
            return state.template;
        },
    }
}