<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['member_id'])) {
    header("Location: login.php");
    exit();
}

$conn = new mysqli("localhost", "root", "", "thrift_management");
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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($withinPaymentWindow) {
        $contribution_status = "Contributed";
        $amount = $_POST['amount'];
        $date_of_contribution = date("Y-m-d H:i:s");

        $stmt = $conn->prepare("INSERT INTO contributions (member_id, member_name, amount, date_of_contribution) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("issd", $member_id, $member['name'], $amount, $date_of_contribution);
        $stmt->execute();
        $stmt->close();

        $conn->query("UPDATE members SET contribution_status = '$contribution_status' WHERE id = $member_id");
        $message = "Contribution made successfully!";
    } else {
        $message = "CANNOT CONTRIBUTE OUTSIDE OF PAYMENT WINDOW";
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Make Contribution</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../css/styles.css"> <!-- Adjusted the path assuming css folder is outside html folder -->
</head>
<body>
    <header class="bg-warning text-white text-center py-4">
        <h1>Make Contribution</h1>
    </header>
    <main class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <h2>Contribution Form</h2>
                <p>Status: <?php echo $withinPaymentWindow ? "Contributed/Pending" : "Outside Payment Window"; ?></p>
                <form action="contribute.php" method="POST">
                    <div class="form-group">
                        <label for="amount">Contribution Amount:</label>
                        <input type="number" class="form-control" id="amount" name="amount" required>
                    </div>
                    <button type="submit" class="btn btn-warning">Submit Contribution</button>
                </form>
                <?php if (isset($message)): ?>
                    <div class="alert alert-danger mt-3" role="alert">
                        <?php echo $message; ?>
                    </div>
                <?php endif; ?>
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
