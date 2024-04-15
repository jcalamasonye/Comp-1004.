var showPasswords = false;

function saveCredentials() {
  var websiteName = document.getElementById("websiteName").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Check if local storage is supported
  if (typeof Storage !== "undefined") {
    // Get existing saved passwords or create an empty array
    var savedPasswords =
      JSON.parse(localStorage.getItem("savedPasswords")) || [];

    // Add new credentials to the array
    savedPasswords.push({
      websiteName: websiteName,
      username: username,
      password: password,
    });

    // Save the updated array back to local storage
    localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));

    // Clear input fields
    document.getElementById("websiteName").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    // Update displayed saved values
    displaySavedValues();
  } else {
    alert("Sorry, your browser does not support web storage...");
  }
}

function displaySavedValues() {
  var savedValuesList = document.getElementById("savedValues");
  savedValuesList.innerHTML = "";

  // Get values from local storage
  var savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];

  // Display saved values
  savedPasswords.forEach(function (savedPassword, index) {
    var listItem = document.createElement("li");
    listItem.className = "credentialItem";

    var websiteItem = document.createElement("div");
    websiteItem.textContent = `Website Name: ${savedPassword.websiteName}`;
    listItem.appendChild(websiteItem);

    var usernameItem = document.createElement("div");
    usernameItem.className = "show_username";
    usernameItem.textContent = `Username: ${savedPassword.username}`;
    listItem.appendChild(usernameItem);

    var passwordItem = document.createElement("div");
    passwordItem.className = "show_password";
    passwordItem.textContent = showPasswords
      ? `Password: ${savedPassword.password}`
      : "Password: *********";
    listItem.appendChild(passwordItem);

    // Delete button
    var deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      deleteCredential(index);
    };
    listItem.appendChild(deleteButton);

    // Copy password button
    var copyButton = document.createElement("button");
    copyButton.className = "copyButton";
    copyButton.textContent = "Copy Password";
    copyButton.onclick = function () {
      copyPassword(savedPassword.password);
    };
    listItem.appendChild(copyButton);

    savedValuesList.appendChild(listItem);
  });
}

function deleteCredential(index) {
  // Get saved passwords from local storage
  var savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];

  // Remove the credential at the specified index
  savedPasswords.splice(index, 1);

  // Save the updated array back to local storage
  localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));

  // Update displayed saved values
  displaySavedValues();
}

function copyPassword(password) {
  // Create a temporary input element
  var tempInput = document.createElement("input");
  tempInput.type = "text";
  tempInput.value = password;
  document.body.appendChild(tempInput);

  // Select the password text
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); /*For mobile devices*/

  // Copy the password to clipboard
  document.execCommand("copy");

  // Remove the temporary input
  document.body.removeChild(tempInput);

  // Alert user
  alert("Password copied to clipboard!");
}

function togglePasswordsVisibility() {
  showPasswords = !showPasswords;
  var button = document.getElementById("togglePasswordsButton");
  button.textContent = showPasswords ? "Hide Passwords" : "Show Passwords";
  displaySavedValues();
}

function checkPasswordStrength(password) {
  var strengthBar = document.getElementById("password-bar");
  var strengthDescription = document.getElementById("strength-description");

  var strength = 0;

  // Regular expressions to check password strength
  var regex = new Array();
  regex.push("[A-Z]"); // Uppercase letters
  regex.push("[a-z]"); // Lowercase letters
  regex.push("[0-9]"); // Numbers
  regex.push("[!@#$%^&*]"); // Special characters

  for (var i = 0; i < regex.length; i++) {
    if (new RegExp(regex[i]).test(password)) {
      strength++;
    }
  }

  if (password.length >= 8 && strength >= 3) {
    strengthDescription.textContent = "Strength: Very Strong";
    strengthBar.style.backgroundColor = "#0f0";
    strengthBar.style.width = "100%";
  } else if (password.length >= 8 && strength >= 2) {
    strengthDescription.textContent = "Strength: Strong";
    strengthBar.style.backgroundColor = "#ff0";
    strengthBar.style.width = "75%";
  } else if (password.length >= 8 && strength >= 1) {
    strengthDescription.textContent = "Strength: Good";
    strengthBar.style.backgroundColor = "#ff9900";
    strengthBar.style.width = "50%";
  } else {
    strengthDescription.textContent = "Strength: Weak";
    strengthBar.style.backgroundColor = "#f00";
    strengthBar.style.width = "25%";
  }
}

function importPasswords() {
  var input = document.createElement("input");
  input.type = "file";

  input.onchange = (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (readerEvent) => {
      var content = readerEvent.target.result;
      var passwords = JSON.parse(content);
      localStorage.setItem("savedPasswords", JSON.stringify(passwords));
      displaySavedValues();
      alert("Data imported successfully!");
    };
  };

  input.click();
}

// Function to export passwords to JSON file
function exportPasswords() {
  var savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
  var data = JSON.stringify(savedPasswords);
  var blob = new Blob([data], { type: "application/json" });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "saved_passwords.json";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  alert("Data exported successfully!");
}

// Display saved values when the page loads
displaySavedValues();
