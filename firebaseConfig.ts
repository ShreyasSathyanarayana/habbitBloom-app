import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { API_KEY, PROJECT_ID, STORAGE_BUCKET, APP_ID } from "@env";

const firebaseConfig = {
  apiKey: API_KEY,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  appId: APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
