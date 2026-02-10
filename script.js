function validateForm() {
    let name = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (name === "" || email === "" || phone === "" || password === "" || confirmPassword === "") {
        alert("All fields are mandatory");
        return false;
    }

    if (phone.length !== 10 || isNaN(phone)) {
        alert("Phone number must be 10 digits");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
    }

    alert("Form submitted successfully!");
    return false;
}

/* DOM manipulation */
function changeHeading() {
    let heading = document.getElementById("mainHeading");
    heading.innerHTML = "Welcome to My Portfolio!";
    heading.style.color = "#ffeb3b";
}
