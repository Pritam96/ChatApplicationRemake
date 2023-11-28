const sendMessage_button = document.getElementById("send-message-button");
sendMessage_button.addEventListener("click", sendMessage);

// * GETTING ALL MESSAGES FOR THE CURRENTLY SELECTED CHAT
async function accessChatMessages() {
  const chat = getCurrentChatInfo();
  if (!chat) {
    return console.log("Current chat not found in the localStorage");
  }

  try {
    const response = await axios.get(`${MESSAGE_URL}/${chat._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.count > 0) {
      createMessageElements(response.data.data);
    } else {
      setNotFoundElement(
        document.getElementById("chat-section"),
        "No messages available"
      );
    }

    // Creating new chat room using socket
    socket.emit("joinChat", chat._id);
  } catch (error) {
    console.log(error);
  }
}

// * SENDING MESSAGE ITEMS ONE BY ONE TO THE MESSAGE ELEMENT
function createMessageElements(messages, receiverName) {
  const chatSection = document.getElementById("chat-section");
  chatSection.innerText = "";

  messages.forEach((message) => {
    const div_element__message_container = document.createElement("div");
    div_element__message_container.classList.add("message-container");
    chatSection.appendChild(div_element__message_container);

    const div_element__message_content = document.createElement("div");
    div_element__message_content.classList.add("message-content");

    if (message.sender._id.toString() === currentlyLoggedUser._id.toString()) {
      div_element__message_container.classList.add("right");
      div_element__message_content.style.backgroundColor = "#d9fdd3";
    } else {
      div_element__message_container.classList.add("left");
    }

    div_element__message_container.appendChild(div_element__message_content);

    const p_element__message_content_name = document.createElement("p");
    p_element__message_content_name.classList.add("message-content__name");
    p_element__message_content_name.innerText = message.sender.name;
    div_element__message_content.appendChild(p_element__message_content_name);

    const p_element__message_content_message = document.createElement("p");
    p_element__message_content_message.classList.add(
      "message-content__message"
    );
    p_element__message_content_message.innerText = message.content;
    div_element__message_content.appendChild(
      p_element__message_content_message
    );
  });
}

// * POST A MESSAGE
async function sendMessage(e) {
  e.preventDefault();
  const chat = getCurrentChatInfo();
  const message_content = document.getElementById("message-input");

  if (!chat || message_content.value === "") {
    return;
  }

  try {
    const response = await axios.post(
      MESSAGE_URL,
      {
        chatId: chat._id,
        content: message_content.value.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    message_content.value = "";
    socket.emit("newMessage", response.data.data);
    await accessChatMessages();
    await showChats();
    scrollToBottom();
  } catch (error) {
    console.log(error);
  }
}
