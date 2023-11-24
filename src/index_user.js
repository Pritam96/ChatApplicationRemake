// * GETTING THE CURRENTLY LOGGED-IN USER INFO
async function getLoggedInUser() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) return JSON.parse(loggedInUser);

  try {
    const response = await axios.get(`${AUTH_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = response.data.data;
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.log(error);
  }
}
