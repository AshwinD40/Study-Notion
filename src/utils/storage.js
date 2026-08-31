// Tokens are stored as plain strings. This also supports tokens written by
// older versions of the app that used JSON.stringify before saving them.
export function getStoredToken() {
  const rawToken = localStorage.getItem("token");

  if (!rawToken) return null;

  try {
    const parsedToken = JSON.parse(rawToken);
    return typeof parsedToken === "string" ? parsedToken : rawToken;
  } catch {
    return rawToken;
  }
}
