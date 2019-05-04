import firebase from "firebase";

export default {
    state:{
        user: null,
        role: "Arrendador",
        logged: false,
    },
    actions:{
        firebaseRegister: ({commit}, user) =>{
            return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        },
        firebaseLogin: ({commit}, user) =>{
            return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        },
        firebaseLogout: () =>{
            return firebase.auth().signOut();
        }
    },
    mutations:{
        setUser:(state, user) => {
                state.user = {
                    uid: user.uid,
                    email: user.email,
                    nombre: user.nombre,
                };
                state.logged = true;
        },
        setRole: (state, role) =>{
            state.role = role;
        },
        resetAuthState (state) {
            state.user = null;
            state.role = null;
            state.logged = false;
         }
    },
    getters:{
        logged: (state) =>{
            return state.logged;
        },
        role: (state) =>{
            return state.role;
        },
        user: (state) =>{
            return state.user;
        }
    }
}