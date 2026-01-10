/** 認証のレスポンス */
export interface AuthenticationResponse {
  RedirectURL: string;
}

/** タイプガード */
export const isAuthenticationResponse = (
  x: unknown
): x is AuthenticationResponse => {
  return (
    typeof x === "object" &&
    x !== null &&
    "RedirectURL" in x &&
    typeof (x as any).RedirectURL === "string"
  );
};
