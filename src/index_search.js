const searchInput = document.getElementById("search_user");
const searchResults = document.getElementById("searchResults");
const searchResultsList = document.getElementById("searchResultsList");

searchInput.addEventListener("input", handleSearch);

document.addEventListener("click", (event) => {
  const isSearchInput = event.target.matches("#search_user");
  const isSearchResult = event.target.closest(".search-result");

  if (!isSearchInput && !isSearchResult) {
    // Clicked outside the search input and search results
    searchInput.value = "";
    searchResultsList.innerHTML = "";
    searchResults.style.display = "none";
  }
});

async function handleSearch() {
  const query = searchInput.value.toLowerCase();

  try {
    const response = await axios.get(`${USER_URL}?search=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear previous results
    searchResultsList.innerHTML = "";

    if (response.data.count > 0) {
      // Display the results
      response.data.data.forEach((user) => {
        const li = document.createElement("li");
        li.className = "search-result";
        const span = document.createElement("span");
        span.className = "search-result__email";
        span.textContent = user.email;
        li.textContent = user.name;
        li.appendChild(span);
        li.addEventListener("click", () => handleResultClick(user));
        searchResultsList.appendChild(li);
      });

      // Show the sidebar
      searchResults.style.display = response.data.count > 0 ? "block" : "none";
    } else {
      console.log("currently not available");
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleResultClick(user) {
  try {
    const response = await axios.post(
      CHAT_URL,
      { userId: user._id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    searchInput.value = "";
    searchResults.style.display = "none";
    await showChats();
    localStorage.removeItem("CurrentChat");
    await accessChatMessages();
  } catch (error) {
    console.log(error);
  }
}
