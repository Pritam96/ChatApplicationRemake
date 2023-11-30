const searchInput = document.getElementById("search_user");
const searchResults = document.getElementById("searchResults");
const searchResultsList = document.getElementById("searchResultsList");

const selected_users = [];
const create_group_section = document.getElementById("create-group-section");
const create_group_check = document.getElementById("create-group-check");
const create_group_title = document.getElementById("create-group-title");
const create_group_button = document.getElementById("create-group-button");

searchInput.addEventListener("input", handleSearch);

document.addEventListener("click", (event) => {
  const isSearchInput = event.target.matches("#search_user");
  const isSearchResult = event.target.closest(".search-result");
  const isGroupSection = event.target.closest("#create-group-section");
  const isGroupCheck = event.target.matches("#create-group-check");
  const isGroupButton = event.target.matches("#create-group-button");

  if (
    !isSearchInput &&
    !isSearchResult &&
    !isGroupSection &&
    !isGroupCheck &&
    !isGroupButton
  ) {
    // Clicked outside the search input and search results
    searchInput.value = "";
    searchResultsList.innerHTML = "";
    searchResults.style.display = "none";
    create_group_check.checked = false;
    create_group_title.value = "";
    create_group_title.style.display = "none";
    selected_users.length = 0;
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
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (selected_users.indexOf(user._id) > -1) {
          checkbox.checked = true;
        } else {
          checkbox.checked = false;
        }
        checkbox.className = "search-result__check";
        li.appendChild(checkbox);

        li.addEventListener("click", () => {
          if (!create_group_check.checked) {
            createOneToOneChat(user);
          } else {
            if (checkbox.checked) {
              checkbox.checked = false;
              selected_users.pop(user._id);
            } else {
              checkbox.checked = true;
              selected_users.push(user._id);
            }
            if (selected_users.length > 1) {
              create_group_button.disabled = false;
              create_group_title.disabled = false;
            } else {
              create_group_button.disabled = true;
              create_group_title.disabled = true;
            }
            console.log(selected_users);
          }
        });
        searchResultsList.appendChild(li);
      });

      // Show the sidebar
      searchResults.style.display = response.data.count > 0 ? "block" : "none";
      create_group_section.style.display =
        response.data.count > 0 ? "flex" : "none";
    } else {
      console.log("user not found for this search keyword");
    }
  } catch (error) {
    console.log(error);
  }
}

function clickCheckboxHandler() {
  if (!create_group_check.checked) {
    createOneToOneChat(user);
  } else {
    if (checkbox.checked) {
      checkbox.checked = false;
      selected_users.pop(user._id);
    } else {
      checkbox.checked = true;
      selected_users.push(user._id);
    }

    if (selected_users.length > 1) {
      create_group_button.disabled = false;
      create_group_title.disabled = false;
    } else {
      create_group_button.disabled = true;
      create_group_title.disabled = true;
    }
    console.log(selected_users);
  }
}

async function createOneToOneChat(user) {
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
    localStorage.setItem("CurrentChat", JSON.stringify(response.data.data));
    getCurrentChatInfo();
    await accessChatMessages();
  } catch (error) {
    console.log(error);
  }
}

create_group_check.addEventListener("change", () => {
  if (create_group_check.checked) {
    create_group_button.style.display = "block";
    create_group_title.style.display = "block";
  } else {
    create_group_button.style.display = "none";
    create_group_title.style.display = "none";
  }
});

create_group_button.addEventListener("click", async () => {
  const group_name = document.getElementById("create-group-title").value.trim();
  if (group_name === "" || selected_users.length < 2) {
    console.log("Please provide a group name");
    return;
  }

  try {
    const response = await axios.post(
      `${CHAT_URL}/group`,
      {
        title: group_name,
        members: JSON.stringify(selected_users),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log("Group Created:", response.data.data.title);

    searchInput.value = "";
    searchResultsList.innerHTML = "";
    searchResults.style.display = "none";
    create_group_check.checked = false;
    create_group_title.value = "";
    create_group_title.style.display = "none";
    selected_users.length = 0;

    await showChats();
    localStorage.setItem("CurrentChat", JSON.stringify(response.data.data));
    getCurrentChatInfo();
    await accessChatMessages();
  } catch (error) {
    console.log(error);
  }
});
