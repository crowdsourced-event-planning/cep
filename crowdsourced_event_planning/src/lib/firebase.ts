import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "API_KEY_KAMU",
  authDomain: "collabora-795b9.firebaseapp.com",
  databaseURL: "https://collabora-795b9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "collabora-795b9",
  storageBucket: "collabora-795b9.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };