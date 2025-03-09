document.getElementById('registration-form').addEventListener('submit', function(event) {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
        alert("All fields are required!");
        event.preventDefault();
    } else if (!validateEmail(email)) {
        alert("Please enter a valid email address!");
        event.preventDefault();
    } else if (password.length < 8) {
        alert("Password must be at least 8 characters long!");
        event.preventDefault();
    }
});

function validateEmail(email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}


document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (email === '' || password === '') {
        alert('All fields are required!');
        return;
    }

    // Add more validation as needed
    this.submit();
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (email.trim() === "" || password.trim() === "") {
        alert("All fields are required!");
        event.preventDefault();
    } else if (!validateEmail(email)) {
        alert("Please enter a valid email address!");
        event.preventDefault();
    }
});