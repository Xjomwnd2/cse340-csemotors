// public/js/registration.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    const password = document.getElementById("account_password").value;
    if (password.length < 12) {
      event.preventDefault();
      alert("Password must be at least 12 characters.");
    }
  });
});
