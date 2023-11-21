const token = localStorage.getItem("auth_token");
if (!token) {
  window.location.href = "./login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  showChatUsers();
});

async function showChatUsers() {
  try {
    const response = await axios.get(USER_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.count > 0) createChatUsersElements(response.data.data);
    else {
      createChatUsersNotFoundElement();
    }
  } catch (error) {
    console.log(error);
  }
}

function createChatUsersElements(users) {
  // console.log(users);
  const usersWindow = document.getElementById("usersWindow");
  usersWindow.innerText = "";

  const ul_element = document.createElement("ul");
  usersWindow.appendChild(ul_element);

  users.forEach((user) => {
    const li_element = document.createElement("li");
    li_element.classList.add("list-user");
    li_element.addEventListener("click", () => {
      accessCreateChat(user);
    });
    ul_element.appendChild(li_element);

    const div_element = document.createElement("div");
    div_element.classList.add("card-user");
    li_element.appendChild(div_element);

    const p_element_name = document.createElement("p");
    p_element_name.classList.add("card-user__name");
    p_element_name.innerText = user.name;
    div_element.appendChild(p_element_name);

    const p_element_email = document.createElement("p");
    p_element_email.classList.add("card-user__email");
    p_element_email.innerText = user.email;
    div_element.appendChild(p_element_email);
  });
}

function createChatUsersNotFoundElement() {
  const usersWindow = document.getElementById("usersWindow");
  usersWindow.innerText = "";
  console.log("No users found.");
}

async function accessCreateChat(user) {
  // console.log(user);
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

    console.log(response.data.data);
  } catch (error) {
    console.log(error);
  }
}
