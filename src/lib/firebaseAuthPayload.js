/**
 * Maps Firebase User + ID token result into Redux-safe session payload
 * (aligned with identitytoolkit-style fields where possible).
 */
export function buildAuthPayloadFromFirebaseUser(fbUser, idToken, idTokenResult) {
  const email = fbUser.email ?? "";
  const displayName = fbUser.displayName ?? "";

  const claims = idTokenResult?.claims ?? {};
  const roleFromClaims = claims.role || "user";

  return {
    user: {
      id: fbUser.uid,
      name: displayName || email.split("@")[0] || "User",
      email,
      status: "active",
      role_id: 1,
      role: roleFromClaims,
      photoURL: fbUser.photoURL || null,
      creationTime: fbUser.metadata?.creationTime ?? null,
      lastSignInTime: fbUser.metadata?.lastSignInTime ?? null,
    },
    token: idToken,
    firebaseAuth: {
      kind: "identitytoolkit#VerifyPasswordResponse",
      localId: fbUser.uid,
      email,
      displayName,
      emailVerified: fbUser.emailVerified ?? false,
      idToken,
      registered: true,
      expiresIn:
        idTokenResult?.expirationTime != null
          ? String(
              Math.max(
                0,
                Math.round((new Date(idTokenResult.expirationTime).getTime() - Date.now()) / 1000)
              )
            )
          : "3600",
      idTokenExpiresAt: idTokenResult?.expirationTime ?? null,
      authTime: idTokenResult?.authTime ?? null,
      signInProvider: idTokenResult?.signInProvider ?? fbUser.providerData?.[0]?.providerId ?? "password",
      claims,
    },
  };
}
