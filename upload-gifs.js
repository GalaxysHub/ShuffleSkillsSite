import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { readFileSync } from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyDJRx8nPOSi-qmHoqoBb20GPCy78Ci0WsM",
  authDomain: "shuffle-tut.firebaseapp.com",
  projectId: "shuffle-tut",
  storageBucket: "shuffle-tut.firebasestorage.app",
  messagingSenderId: "359852501217",
  appId: "1:359852501217:web:ba0be826f0430f80302fa0",
  measurementId: "G-6798K8L9Z5"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function uploadGif(localPath, fileName) {
  try {
    const fileBuffer = readFileSync(localPath);
    const blob = new Blob([fileBuffer], { type: 'image/gif' });
    
    const storageRef = ref(storage, `gifs/${fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log(`✅ ${fileName} uploaded successfully!`);
    console.log(`📎 URL: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting GIF upload...\n');
    
    // Upload t-step.gif
    await uploadGif('/Users/me/Movies/CapCut/t-step.gif', 't-step.gif');
    
    // Upload front-hook-kick.gif  
    await uploadGif('/Users/me/Movies/CapCut/front-hook-kick.gif', 'front-hook-kick.gif');
    
    console.log('\n🎉 All uploads completed successfully!');
  } catch (error) {
    console.error('💥 Upload failed:', error);
    process.exit(1);
  }
}

main();