import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbq9XQcnp6D9-Su8NoN2-P8oHo3wuLX6M",
  authDomain: "r6gtodoapp.firebaseapp.com",
  projectId: "r6gtodoapp",
  storageBucket: "r6gtodoapp.appspot.com",
  messagingSenderId: "433654877028",
  appId: "1:433654877028:web:944908385b1d67f6118871"
}

class Fire {
  constructor(callback) {
    this.init(callback)
  }

  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        callback(null, user)
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch(error => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    let ref = this.ref.orderBy('name');

    this.unsubscribe = ref.onSnapshot(snapshot => {
      lists = []

      snapshot.forEach(doc => {
        lists.push({id: doc.id, ...doc.data()});
      })

      callback(lists);
    });
  }

  addList(list) {
    let ref = this.ref;

    ref.add(list);
  }

  updateList(list) {
    let ref = this.ref;

    ref.doc(list.id).update(list)
  }

  get userId() {
    return firebase.auth().currentUser.uid
  }

  get ref() {
    return firebase
      .firestore()
      .collection('users')
      .doc(this.userId)
      .collection('lists');
  }

  detach() {
    this.unsubscribe();
  }
}

export default Fire;