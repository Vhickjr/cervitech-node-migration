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

$currentDate = date("Y-m-d");
$lastDayOfMonth = date("Y-m-t");
$firstDayOfPaymentWindow = date("Y-m-", strtotime($lastDayOfMonth)) . (date("t") - 6);
$withinPaymentWindow = ($currentDate >= $firstDayOfPaymentWindow && $currentDate <= $lastDayOfMonth);

$contributedThisMonth = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($withinPaymentWindow) {
        $contribution_status = "Contributed";
        $conn->query("UPDATE members SET contribution_status = '$contribution_status' WHERE id = $member_id");
        echo "Contribution made successfully!";
    } 
}

// Check if the member has contributed within the current month
$firstDayOfMonth = date("Y-m-01");
$checkContribution = $conn->query("SELECT COUNT(*) AS count FROM contributions WHERE member_id = $member_id AND date_of_contribution >= '$firstDayOfMonth' AND date_of_contribution <= '$lastDayOfMonth'");
$contributionData = $checkContribution->fetch_assoc();
if ($contributionData['count'] > 0) {
    $contributedThisMonth = true;
}

$conn->close();
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Member Dashboard</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/styles.css"> <!-- Adjusted the path assuming css folder is outside html folder -->
</head>
<body>
    <header class="bg-success text-white text-center py-4">
        <h1>Welcome, <?php echo $member['first_name']; ?></h1>
    </header>
    <main class="container mt-5">
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Contribution Status</h5>
                        <p class="card-text">
                            Status: 
                            <?php
                            if ($contributedThisMonth) {
                                echo "Contributed this month";
                            } else {
                                echo "Pending";
                            }
                            ?>
                        </p>
                        <a href="contribute.php" class="btn btn-success">Make Contribution</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Profile Management</h5>
                        <p class="card-text">Update your profile information.</p>
                        <a href="profile_management.php" class="btn btn-primary">Update Profile</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Contribution History</h5>
                        <p class="card-text">View your past contributions.</p>
                        <a href="contribution_history.php" class="btn btn-info">View History</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Upcoming Payout</h5>
                        <p class="card-text">Next Payout Date: <!-- Example: 2025-03-31 --></p>
                        <p class="card-text">Amount: <!-- Example: $1200 --></p>
                    </div>
                </div>
            </div>
            <div class="col-md-8 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Group Activity</h5>
                        <p class="card-text">Latest activities in your group.</p>
                        <ul class="list-group">
                            <!-- Example activity items (Replace with dynamic data) -->
                            <li class="list-group-item">Member 1 made a contribution of $100 on 2025-03-01</li>
                            <li class="list-group-item">Member 2 made a contribution of $100 on 2025-03-01</li>
                            <li class="list-group-item">Member 3 made a contribution of $100 on 2025-03-01</li>
                            <!-- Add more activity items as needed -->
                        </ul>
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
