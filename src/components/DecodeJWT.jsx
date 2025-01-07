const decodeJWT = (token) => {
  if (!token) return null;

  try {
    const [header, payload, signature] = token.split(".");
    const base64UrlToJson = (base64Url) =>
      JSON.parse(
        decodeURIComponent(
          atob(base64Url.replace(/-/g, "+").replace(/_/g, "/"))
            .split("")
            .map(
              (char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`
            )
            .join("")
        )
      );

    return {
      header: base64UrlToJson(header),
      payload: base64UrlToJson(payload),
      signature,
    };
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};
export default decodeJWT;
