// * GETTING CURRENT CHAT INFO
function getCurrentChatInfo() {
  const chat = JSON.parse(localStorage.getItem("CurrentChat"));
  if (!chat) {
    return null;
  }
  document.getElementById("user-input-section").classList.remove("hidden");
  return chat;
}

// * GETTING ALL CHATS FOR THAT CURRENT USER
async function showChats() {
  try {
    const response = await axios.get(CHAT_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.count > 0) {
      createChatElements(response.data.data);
    } else {
      setNotFoundElement(
        document.getElementById("usersWindow"),
        "No chats available"
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// * CREATING CHAT UI ELEMENTS
function createChatElements(chats) {
  const usersWindow = document.getElementById("usersWindow");
  usersWindow.innerText = "";

  chats.forEach(async (chat) => {
    let chatName;
    if (chat.isGroupChat) {
      chatName = chat.title;
    } else {
      chat.members.forEach((member) => {
        if (member._id !== currentlyLoggedUser._id) {
          chatName = member.name;
        }
      });
    }

    let content;
    if (!chat.latestMessage) {
      content = "No messages available";
    } else {
      content = chat.latestMessage.content;
    }

    const li_element = document.createElement("li");
    li_element.classList.add("list-user");
    li_element.addEventListener("click", async () => {
      localStorage.setItem("CurrentChat", JSON.stringify(chat));
      await accessChatMessages();
    });
    usersWindow.appendChild(li_element);

    const div_element = document.createElement("div");
    div_element.classList.add("card-user");
    li_element.appendChild(div_element);

    const p_element_name = document.createElement("p");
    p_element_name.classList.add("card-user__name");
    p_element_name.innerText = chatName;
    div_element.appendChild(p_element_name);

    const p_element_message = document.createElement("p");
    p_element_message.classList.add("card-user__email");
    p_element_message.innerText = content;
    div_element.appendChild(p_element_message);
  });
}
