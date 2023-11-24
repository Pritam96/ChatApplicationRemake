let currentlyLoggedUser;
const token = localStorage.getItem("auth_token");

if (!token) {
  window.location.href = "./login.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  currentlyLoggedUser = await getLoggedInUser();
  showChats();
  getCurrentChatInfo();
  accessChatMessages();
});

// * CREATING MESSAGE UI ELEMENT WHEN RESOURCE IS NOT AVAILABLE
function setNotFoundElement(target_location, text_content) {
  target_location.innerText = "";
  const p_element = document.createElement("p");
  p_element.classList.add("text-center");
  p_element.innerText = text_content;
  target_location.appendChild(p_element);
}

const sendMessage_button = document.getElementById("send-message-button");
sendMessage_button.addEventListener("click", sendMessage);
