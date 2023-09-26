 // firebaseListener.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";


export function initializeFirebase(mobileObjectModel) {



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtFQf2c8ohsCHXHJnYQB0pig82Lb-3F-Q",
    authDomain: "vixroader.firebaseapp.com",
    projectId: "vixroader",
    storageBucket: "vixroader.appspot.com",
    messagingSenderId: "445371639222",
    appId: "1:445371639222:web:b8607e42343fd0edca4d17",
    measurementId: "G-QE6S1YSDT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const myCollection = collection(db, "trips");


const dataDisplayDiv = document.getElementById("dataDisplay");

onSnapshot(myCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        const docData = change.doc.data();
        const docId = change.doc.id;
        
        if (change.type === "added") {
            // Handle new document added
             
           
            console.log("New Document Added:", docId, docData);
            mobileObjectModel.updateOrAddMobile(docId, docData);
   
            
       
        }
        if (change.type === "modified") {
            // Handle document changed
            
             
            console.log("Document Modified:", docId, docData);
            mobileObjectModel.updateOrAddMobile(docId, docData);
   
           
     
        }
        if (change.type === "removed") {
            // Handle document removed (if needed)
            console.log("Document Removed",docId);
            mobileObjectModel.deleteMobile(docId);
           
        }
    });
});

function displayMessage(element, message) {
    // Create a new paragraph element to display the message
    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    // Append the paragraph to the specified div
    element.appendChild(paragraph);
}

}

function handleButtonClick() {
    initializeFirebase();
}

