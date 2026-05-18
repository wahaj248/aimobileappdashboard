import { auth } from "../firebase";

/**
 * Logged-in Firebase user + custom claims (e.g. role from Firebase Admin SDK).
 * Uses same `auth` instance as the rest of the app.
 */
export const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const tokenResult = await user.getIdTokenResult(true);

    return {
      uid: user.uid,
      email: user.email,
      role: tokenResult.claims.role || "user",
      claims: tokenResult.claims,
    };
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};
