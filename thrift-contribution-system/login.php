<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/styles.css">
    <script>
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

function validateEmail(email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}
    </script>

</head>
<body>
    <header>
        <h1>Member Login</h1>
    </header>
    <main>
        <section id="login">
            <h2>Login</h2>
            <form method="POST" action="login_action.php">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Login</button>
            </form>
        </section>
    </main>
</body>
</html>
