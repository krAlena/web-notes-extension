declare const closeBtn: HTMLButtonElement;

closeBtn.onclick = () => {
  window.close();
};

document.addEventListener('DOMContentLoaded', ( ) => {
  chrome.storage.local.get("user", ({ user }) => {
    if (user) {
      document.getElementById("avatar").src = user.picture;
      // document.getElementById("name").innerText = user.name;
    }
  });
});