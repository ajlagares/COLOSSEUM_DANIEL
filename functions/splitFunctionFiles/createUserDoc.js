//Do not update firebase-functions past version 5.0.0. Version 6.0.0 breaks this function and theres
//not really any good documentation on how to reimport the auth.user() function. If they ever update it
//documentation should be here https://firebase.google.com/docs/functions/auth-events

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createUser=functions.auth.user().onCreate((user) => {
  // Get a reference to the Firestore database
  const db = admin.firestore();

  // Create a new document in the 'users' collection
  const userRef = db.collection('users').doc(user.uid);

  // Set the document data
  return userRef.set({
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    points:1000,
  });
});
