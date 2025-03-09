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
    $first_name = trim($_POST['first_name']);
    $middle_name = trim($_POST['middle_name']);
    $last_name = trim($_POST['last_name']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $phone_number = trim($_POST['phone_number']);
    $address = trim($_POST['address']);
    $contribution_plan = trim($_POST['contribution_plan']);
    $rotation_order = 1; // Update based on your logic

    if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($phone_number) || empty($address) || empty($contribution_plan)) {
        echo "All fields are required!";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format!";
    } elseif (strlen($password) < 8) {
        echo "Password must be at least 8 characters long!";
    } elseif (!is_numeric($contribution_plan)) {
        echo "Contribution plan must be a numeric value!";
    } else {
        $password = password_hash($password, PASSWORD_DEFAULT);

        // Start a transaction
        $conn->begin_transaction();

        try {
            // Insert the new member
            $stmt = $conn->prepare("INSERT INTO members (first_name, middle_name, last_name, email, password, phone_number, address, rotation_order, contribution_plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssssid", $first_name, $middle_name, $last_name, $email, $password, $phone_number, $address, $rotation_order, $contribution_plan);

            if ($stmt->execute()) {
                $member_id = $conn->insert_id;

                // Find an incomplete group with the same contribution plan
                $result = $conn->query("SELECT * FROM groups WHERE current_number_of_members < 12 AND amount = $contribution_plan ORDER BY id LIMIT 1");

                if ($result->num_rows > 0) {
                    // Append the member to the incomplete group
                    $group = $result->fetch_assoc();
                    $group_id = $group['id'];
                    $conn->query("UPDATE groups SET current_number_of_members = current_number_of_members + 1 WHERE id = $group_id");
                } else {
                    // Create a new group with the specified contribution plan
                    $result = $conn->query("SELECT COUNT(*) AS count FROM groups");
                    $data = $result->fetch_assoc();
                    $group_number = $data['count'] + 1;
                    $group_name = "group " . $group_number;
                    $amount = $contribution_plan; // Set the initial amount based on the contribution plan
                    $date_created = date("Y-m-d");

                    $stmt = $conn->prepare("INSERT INTO groups (name, amount, current_number_of_members, date_created) VALUES (?, ?, ?, ?)");
                    $stmt->bind_param("sdis", $group_name, $amount, $initial_members, $date_created);

                    $initial_members = 1;

                    if ($stmt->execute()) {
                        $group_id = $conn->insert_id;
                    } else {
                        throw new Exception("Error creating group: " . $stmt->error);
                    }
                }

                // Commit the transaction
                $conn->commit();

                $_SESSION['member_id'] = $member_id;
                header("Location: member_dashboard.php");
                exit();
            } else {
                throw new Exception("Error: " . $stmt->error);
            }
        } catch (Exception $e) {
            // Rollback the transaction if any error occurs
            $conn->rollback();
            echo "Failed to register: " . $e->getMessage();
        } finally {
            $stmt->close();
        }
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Member Registration</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/styles.css"> <!-- Adjusted the path assuming css folder is outside html folder -->
</head>
<body>
    <header class="bg-primary text-white text-center py-4">
        <h1>Member Registration</h1>
    </header>
    <main class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <form action="registration.php" method="POST">
                    <div class="form-group">
                        <label for="first_name">First Name:</label>
                        <input type="text" class="form-control" id="first_name" name="first_name" required>
                    </div>
                    <div class="form-group">
                        <label for="middle_name">Middle Name:</label>
                        <input type="text" class="form-control" id="middle_name" name="middle_name">
                    </div>
                    <div class="form-group">
                        <label for="last_name">Last Name:</label>
                        <input type="text" class="form-control" id="last_name" name="last_name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Phone Number:</label>
                        <input type="text" class="form-control" id="phone_number" name="phone_number" required>
                    </div>
                    <div class="form-group">
                        <label for="address">Address:</label>
                        <input type="text" class="form-control" id="address" name="address" required>
                    </div>
                    <div class="form-group">
                        <label for="contribution_plan">Contribution Plan (Amount):</label>
                        <input type="number" class="form-control" id="contribution_plan" name="contribution_plan" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Register</button>
                </form>
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
