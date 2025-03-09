<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header("Location: admin_login.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "thrift_management");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Define the variables for checking the payment window
$currentDate = date("Y-m-d");
$lastDayOfMonth = date("Y-m-t");

if ($_SERVER["REQUEST_METHOD"] == "POST" && $currentDate == $lastDayOfMonth) {
    // Logic to determine the next member in rotation
    $next_member_query = $conn->query("SELECT id FROM members ORDER BY rotation_order LIMIT 1");
    $next_member = $next_member_query->fetch_assoc()['id'];

    // Fetch and reset contributions
    $total_funds = 0;
    $result = $conn->query("SELECT * FROM members WHERE contribution_status = 'Contributed'");
    while ($row = $result->fetch_assoc()) {
        $total_funds += 100; // Example contribution amount
        $conn->query("UPDATE members SET contribution_status = 'Pending' WHERE id = " . $row['id']);
    }

    // Update the next member's rotation order to the end and adjust other members' orders
    $conn->query("UPDATE members SET rotation_order = rotation_order + 1 WHERE id != $next_member");
    $conn->query("UPDATE members SET rotation_order = 1 WHERE id = $next_member");

    echo "Funds forwarded to member ID: $next_member. Total collected: $" . $total_funds;
} else {
    echo "Funds can only be forwarded at the end of the payment window.";
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fund Distribution</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../css/styles.css"> <!-- Adjusted the path assuming css folder is outside html folder -->
</head>
<body>
    <header class="bg-warning text-white text-center py-4">
        <h1>Fund Distribution</h1>
    </header>
    <main class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <h2>Distribute Collected Funds</h2>
                <form action="../distribute_funds.php" method="POST">
                    <p class="lead">Total Collected Funds: <!-- Example amount (replace with dynamic data) --> $1200</p>
                    <p class="lead">Next Member in Line: <!-- Example member name (replace with dynamic data) --> John Doe</p>
                    <button type="submit" class="btn btn-warning">Distribute Funds</button>
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
