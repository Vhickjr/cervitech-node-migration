<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "thrift_management";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $admin_email = $_POST['email'];
    $admin_password = $_POST['password'];

    $result = $conn->query("SELECT * FROM admin WHERE email = '$admin_email'");
    if ($result->num_rows == 1) {
        $admin = $result->fetch_assoc();
        if (password_verify($admin_password, $admin['password'])) {
            $_SESSION['admin_id'] = $admin['id'];
            header("Location: admin.php");
            exit();
        } else {
            echo "Invalid password!";
        }
    } else {
        echo "No admin found with that email!";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <h1>Admin Login</h1>
    </header>
    <main>
        <section id="login">
            <h2>Login</h2>
            <form method="POST" action="admin_login.php">
                <label for="admin_email">Email:</label>
                <input type="email" id="admin_email" name="admin_email" required>
                <label for="admin_password">Password:</label>
                <input type="password" id="admin_password" name="admin_password" required>
                <button type="submit">Login</button>
            </form>
        </section>
    </main>
</body>
</html>
