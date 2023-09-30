// firebaseListener.js

import RemoteListener from "./RemoteListener.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

class FirebaseListener extends RemoteListener {
  constructor(mobileObjectModel) {

    super();
    this.mobileObjectModel = mobileObjectModel;
    this.start();
  }

  start() {
    const firebaseConfig = {
        apiKey: "AIzaSyAtFQf2c8ohsCHXHJnYQB0pig82Lb-3F-Q",
        authDomain: "vixroader.firebaseapp.com",
        projectId: "vixroader",
        storageBucket: "vixroader.appspot.com",
        messagingSenderId: "445371639222",
        appId: "1:445371639222:web:b8607e42343fd0edca4d17",
        measurementId: "G-QE6S1YSDT4"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);
    this.myCollection = collection(db, "trips");

    onSnapshot(this.myCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const docData = change.doc.data();
        const docId = change.doc.id;

        if (change.type === "added" && docData.status === "active") {
          console.log("New Document Added:", docId, docData);
          this.mobileObjectModel.updateOrAddMobile(docId, docData);
        }

        if (change.type === "modified") {
          console.log("Document Modified:", docId, docData);
          if (docData.status === "active") {
            this.mobileObjectModel.updateOrAddMobile(docId, docData);
          } else {
            console.log("Document Removed", docId);
            this.mobileObjectModel.deleteMobile(docId);
          }
        }

        if (change.type === "removed") {
          console.log("Document Removed", docId);
          this.mobileObjectModel.deleteMobile(docId);
        }
      });
    });
  }
}

export default FirebaseListener;
