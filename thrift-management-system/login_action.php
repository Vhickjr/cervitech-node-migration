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
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        echo "All fields are required!";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format!";
    } else {
        $result = $conn->query("SELECT * FROM members WHERE email = '$email'");
        if ($result->num_rows == 1) {
            $member = $result->fetch_assoc();
            if (password_verify($password, $member['password'])) {
                $_SESSION['member_id'] = $member['id'];
                header("Location: member.php");
                exit();
            } else {
                echo "Invalid password!";
            }
        } else {
            echo "No member found with that email!";
        }
    }
}

$conn->close();
?>
