<?php
session_start();
if (!isset($_SESSION['member_id'])) {
    header("Location: login.php");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "thrift_management";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$member_id = $_SESSION['member_id'];
$result = $conn->query("SELECT * FROM members WHERE id = $member_id");
$member = $result->fetch_assoc();

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Member Profile</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/styles.css"> <!-- Adjusted the path assuming css folder is outside html folder -->
</head>
<body>
    <header class="bg-primary text-white text-center py-4">
        <h1>Member Profile</h1>
    </header>
    <main class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Personal Information</h5>
                        <p class="card-text"><strong>First Name:</strong> <?php echo $member['first_name']; ?></p>
                        <p class="card-text"><strong>Middle Name:</strong> <?php echo $member['middle_name']; ?></p>
                        <p class="card-text"><strong>Last Name:</strong> <?php echo $member['last_name']; ?></p>
                        <p class="card-text"><strong>Email:</strong> <?php echo $member['email']; ?></p>
                        <p class="card-text"><strong>Phone:</strong> <?php echo $member['phone']; ?></p>
                        <p class="card-text"><strong>Address:</strong> <?php echo $member['address']; ?></p>
                        <a href="update_profile.php" class="btn btn-primary">Edit Profile</a>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <footer class="bg-light text-center py-4 mt-5">
        <p>&copy; 2025 Thrift Management System. All rights reserved.</p>
    </footer>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
