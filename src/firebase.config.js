import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCuJt-AQmjqzqfiKzkklGyg50pBuf0pVNE',
	authDomain: 'task-4-f50c2.firebaseapp.com',
	projectId: 'task-4-f50c2',
	storageBucket: 'task-4-f50c2.appspot.com',
	messagingSenderId: '314147943421',
	appId: '1:314147943421:web:3c20318c8eb2c1f23ddf94',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
