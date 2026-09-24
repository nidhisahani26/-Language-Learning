 const firebaseConfig = {
  apiKey: "AIzaSyCHS2mKjrsU8gXTjmBQlcz_RNBFThN52-Y",
  authDomain: "horizontechx-fe47f.firebaseapp.com",
  projectId: "horizontechx-fe47f",
  storageBucket: "horizontechx-fe47f.firebasestorage.app",
  messagingSenderId: "793271918805",
  appId: "1:793271918805:web:595e0dbe139ebad402025c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const useFirebase = false;