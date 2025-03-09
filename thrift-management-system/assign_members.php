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

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['group_id']) && isset($_POST['member_id'])) {
    $group_id = $_POST['group_id'];
    $member_id = $_POST['member_id'];
    
    // Check the number of members in the group
    $group_size_result = $conn->query("SELECT COUNT(*) as count FROM group_members WHERE group_id = $group_id");
    $group_size = $group_size_result->fetch_assoc()['count'];

    if ($group_size < 12) {
        $conn->query("INSERT INTO group_members (group_id, member_id) VALUES ('$group_id', '$member_id')");
        echo "Member assigned to group successfully!";
    } else {
        echo "Error: This group already has 12 members.";
    }
}

$groups = $conn->query("SELECT * FROM groups");
$members = $conn->query("SELECT * FROM members");

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assign Members to Groups</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <h1>Assign Members to Groups</h1>
    </header>
    <main>
        <section id="assign-members">
            <h2>Assign Member to Group</h2>
            <form method="POST">
                <label for="group_id">Select Group:</label>
                <select id="group_id" name="group_id" required>
                    <?php while ($group = $groups->fetch_assoc()) { ?>
                        <option value="<?php echo $group['id']; ?>"><?php echo $group['name']; ?></option>
                    <?php } ?>
                </select>
                <label for="member_id">Select Member:</label>
                <select id="member_id" name="member_id" required>
                    <?php while ($member = $members->fetch_assoc()) { ?>
                        <option value="<?php echo $member['id']; ?>"><?php echo $member['name']; ?></option>
                    <?php } ?>
                </select>
                <button type="submit">Assign Member</button>
            </form>
        </section>
    </main>
</body>
</html>
