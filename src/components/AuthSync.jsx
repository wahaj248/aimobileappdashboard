import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useStore } from "react-redux";
import { auth } from "../firebase";
import { setLoginSuccess, logoutManual } from "../store/authSlice";
import { buildAuthPayloadFromFirebaseUser } from "../lib/firebaseAuthPayload";
import { getCurrentUserData } from "../lib/getCurrentUserData";

/**
 * Keeps Redux (persisted) auth in sync with Firebase Auth session.
 */
const AuthSync = () => {
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          const idTokenResult = await fbUser.getIdTokenResult();
          const payload = buildAuthPayloadFromFirebaseUser(fbUser, idToken, idTokenResult);
          console.log("AuthSync — Firebase session restored / updated:", payload);
          dispatch(setLoginSuccess(payload));

          const userData = await getCurrentUserData();
          console.log("getCurrentUserData() [AuthSync]:", userData);
          console.log("userData.role:", userData?.role);
        } catch (err) {
          console.log("AuthSync — token error:", err);
        }
      } else {
        const wasAuthed = store.getState().auth?.isAuthenticated;
        if (wasAuthed) {
          console.log("AuthSync — Firebase signed out; clearing Redux persist");
          dispatch(logoutManual());
        }
      }
    });
    return () => unsub();
  }, [dispatch, store]);

  return null;
};

export default AuthSync;
