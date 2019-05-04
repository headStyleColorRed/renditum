import { db } from "./main"
import store from "./store"

//Recogemos la documentación del alquiler para el inquilino de la Base de Datos
export async function retrieveAlquiler() {
    let promise = new Promise((resolve, reject) => {

        //Cogemos el Chat Id
        let userId = store.getters.user.uid;
        let propiedad = null;
        let chatRoomId = null;

        let userRef = db
            .collection("users")
            .doc(userId)
            .get()
            .then(snapshot => {
                if (snapshot.data().chatRoom == null) {
                    store.commit("setChatRoom", null);
                    resolve(null)
                } else {
                    if (snapshot.data().chatRoomAccept == true) {
                        store.commit("setChatRoom", snapshot.data().chatRoom);

                        //Bajamos el objeto Propiedad con todos sus campos
                        let alquiler = new Object();
                        let inquilinoRef = db
                            .collection("propiedades")
                            .doc(snapshot.data().chatRoom)
                            .get()
                            .then(snapshot => {
                                propiedad = snapshot.data();
                                resolve(propiedad);
                            })
                    } else {
                        resolve(null)
                    }

                }
                store.commit("setProfilePic", snapshot.data().imgPerfil);
            });




    });
    let result = await promise;
    store.commit("setAlquileres", result);
    return result;
};


//Recogemos alquileres de la Base de Datos
export async function retrieveAlquileres() {
    let promise = new Promise((resolve, reject) => {

        let propiedades = new Object();
        let userId = store.getters.user.uid;

        //Guarda en un objeto los chatRoom del arrendatario
        let chatRoomRef = db
            .collection(`arrendador/${userId}/propiedades/`)
            .get()
            .then(snapshot => {
                if (snapshot.empty == false) {
                    snapshot.forEach(doc => {
                        //Itera en la shared Propiedades por la información total de los pisos
                        let nombrePropiedadIterando = doc.data().chatRoom;
                        let propiedadesRef = db
                            .collection("propiedades")
                            .get()
                            .then(snapshot => {
                                snapshot.forEach(property => {
                                    if (property.data().chatRoom === nombrePropiedadIterando) {
                                        propiedades[property.data().nombre] = property.data();
                                    }
                                });
                            })
                            .then(() => {
                                console.log(propiedades);
                                resolve(propiedades)
                            });
                    });
                } else {
                    let loaded = true;
                    resolve(loaded)
                }
            })
            .catch(err => {
                console.log("Error getting documents", err);
            });
    });
    let result = await promise;
    store.commit("setAlquileres", result);
    return result;
};

