const admin = require("firebase-admin");
const { v4: uuidv4 } = require('uuid')

// path to service account keys
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET
});
bucket = admin.storage().bucket();

async function firebaseUpload(filePath='./images/test.jpeg') {
    
    try {
        const uuid = uuidv4();
        const resp = await bucket.upload(filePath, {
          uploadType: "media",
          metadata: {
            contentType: 'image/png',
            metadata: {
              firebaseStorageDownloadTokens: uuid
            }
          }
        })

        // console.log(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`)

        return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(resp[0].name)}?alt=media&token=${uuid}`
    } catch (err) {
        throw new Error(err)
    }
  }

module.exports = firebaseUpload