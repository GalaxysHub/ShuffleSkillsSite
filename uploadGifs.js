const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize admin SDK
const serviceAccount = require('./path-to-service-account-key.json'); // You'll need to add your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'shuffle-tut.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function uploadFile(localPath, destinationPath) {
  try {
    const file = bucket.file(destinationPath);
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'image/gif',
      }
    });

    return new Promise((resolve, reject) => {
      fs.createReadStream(localPath)
        .pipe(stream)
        .on('error', reject)
        .on('finish', async () => {
          // Make the file public
          await file.makePublic();
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destinationPath)}?alt=media`;
          console.log(`File uploaded successfully: ${publicUrl}`);
          resolve(publicUrl);
        });
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

async function uploadGifs() {
  try {
    // Upload t-step.gif
    const tStepUrl = await uploadFile(
      '/Users/me/Movies/CapCut/t-step.gif',
      'gifs/t-step.gif'
    );
    console.log('T-Step GIF URL:', tStepUrl);

    // Upload front-hook-kick.gif
    const frontHookKickUrl = await uploadFile(
      '/Users/me/Movies/CapCut/front-hook-kick.gif',
      'gifs/front-hook-kick.gif'
    );
    console.log('Front Hook Kick GIF URL:', frontHookKickUrl);

    console.log('\nUpload complete! Update these URLs in ShuffleSkillTree.tsx:');
    console.log('T-Step:', tStepUrl);
    console.log('Front Hook Kick:', frontHookKickUrl);
  } catch (error) {
    console.error('Failed to upload GIFs:', error);
  }
}

uploadGifs();