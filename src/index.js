let currentlyLoggedUser;
const token = localStorage.getItem("auth_token");
const socket = io(ENDPOINT);

if (!token) {
  window.location.href = "./login.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    currentlyLoggedUser = await getLoggedInUser();
    createSocketRoom();
    await showChats();
    getCurrentChatInfo();
    await accessChatMessages();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

// * CREATING MESSAGE UI ELEMENT WHEN RESOURCE IS NOT AVAILABLE
function setNotFoundElement(target_location, text_content) {
  // Check if target_location exists before manipulating
  if (target_location) {
    target_location.innerText = "";
    const p_element = document.createElement("p");
    p_element.classList.add("text-center");
    p_element.innerText = text_content;
    target_location.appendChild(p_element);
  }
}

// * CREATE SOCKET ROOM ONLY ONE TIME
function createSocketRoom() {
  // sent the currently logged user info to the server
  socket.emit("setup", currentlyLoggedUser);

  // receives from server socket.emit('connected')
  socket.on("connected", () => localStorage.setItem("isSocketConnected", true));
}

socket.on("messageReceived", async (newMessage) => {
  const currentChat = getCurrentChatInfo();
  if (!currentChat || currentChat._id !== newMessage.chat._id) {
    console.log("notification received");
    await showChats();
  } else {
    console.log("new message received");
    await accessChatMessages();
    await showChats();
    scrollToBottom();
  }
});

function scrollToBottom() {
  var chat_section = document.getElementById("chat-section");
  if (chat_section) {
    chat_section.scrollTop = chat_section.scrollHeight;
  }
}

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("connect_timeout", () => {
  console.error("Socket connection timeout");
});
