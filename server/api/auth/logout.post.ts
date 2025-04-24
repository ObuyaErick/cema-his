export default defineEventHandler((event) => {
  // Delete cookie
  deleteCookie(event, "session");
  // Set no-content status code
  setResponseStatus(event, 204);
  return null;
});
