import { initializeApp,getApps,getApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {

  apiKey: "",
  authDomain: "instagram-demo-220a8.firebaseapp.com",
  projectId: "instagram-demo-220a8",
  storageBucket: "instagram-demo-220a8.appspot.com",
  messagingSenderId: "433810088782",
  appId: "1:433810088782:web:3d9c8a877a1dd7f1cc741f"

};

const app = !getApps().length?initializeApp(firebaseConfig):getApp();
const db = getFirestore();
const storage = getStorage();

export {app,db,storage};
