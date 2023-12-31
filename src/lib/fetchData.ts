import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { updateTheme } from "./themeStore";
import { db, userData } from "./firebase";
import { error } from "@sveltejs/kit";
import type { CustomTheme } from "./theme";
import type { UserData } from "./firebase";

export async function fetchUserData(username: string): Promise<UserData> {
  const collectionRef = collection(db, "users");

  const q = query(collectionRef, where("username", "==", username), limit(1));

  const snapshot = await getDocs(q);
  const exists = snapshot.docs[0]?.exists();
  const data = snapshot.docs[0]?.data();

  if (!exists) {
    throw error(404, "that user does not exist!");
  }

  if (!data.published) {
    throw error(403, `the profile of @${data.username} is not public`);
  }

  if (data && data.customTheme) {
    updateTheme(data.customTheme);
  }

  return {
    username: data.username,
    photoURL: data.photoURL,
    bio: data.bio,
    links: data.links ?? [],
    theme: data.theme,
    customTheme: data.customTheme,
  };
}
