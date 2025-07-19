import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export async function uploadMoveGif(file: File, moveName: string): Promise<string> {
  const timestamp = Date.now();
  const fileName = `moves/${moveName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.gif`;
  
  const storageRef = ref(storage, fileName);
  
  const snapshot = await uploadBytes(storageRef, file);
  
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
}

export async function uploadImageFromUrl(imageUrl: string, moveName: string): Promise<string> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  
  const file = new File([blob], `${moveName}.gif`, { type: 'image/gif' });
  
  return uploadMoveGif(file, moveName);
}