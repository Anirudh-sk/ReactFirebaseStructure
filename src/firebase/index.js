import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

export const config = {};

const app = firebase.initializeApp(config);

const db = app.firestore();
const storage = app.storage();

export { db, storage };
