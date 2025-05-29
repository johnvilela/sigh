import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../services/firebase';

export async function uploadFile ({ destination, file, filename }: { destination: string, file: File, filename?: string }): Promise<string> {
  const storageRef = ref(storage, `${destination}/${filename}`);

  const res = await uploadBytes(storageRef, file);

  return getDownloadURL(res.ref);
}