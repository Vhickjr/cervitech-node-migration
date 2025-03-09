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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['change_plan'])) {
        $group_id = $_POST['group_id'];
        $new_plan = $_POST['new_plan'];
        $conn->query("UPDATE groups SET amount = $new_plan WHERE id = $group_id");
    } elseif (isset($_POST['reassign_member'])) {
        $member_id = $_POST['member_id'];
        $new_group_id = $_POST['new_group_id'];
        $conn->query("UPDATE group_members SET group_id = $new_group_id WHERE id = $member_id");
    } else {
        $group_name = $_POST['group_name'];
        $conn->query("INSERT INTO groups (name) VALUES ('$group_name')");
        $group_id = $conn->insert_id;
        foreach ($_POST['member_ids'] as $member_id) {
            $conn->query("INSERT INTO group_members (group_id, member_id) VALUES ($group_id, $member_id)");
        }
    }
}

$members_result = $conn->query("SELECT * FROM members");
$groups_result = $conn->query("
    SELECT g.id AS group_id, g.name AS group_name, g.amount, gm.first_name, gm.date_joined
    FROM groups g
    LEFT JOIN group_members gm ON g.id = gm.group_id
    ORDER BY g.id, gm.date_joined
");

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Manage Groups</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header>
        <h1>Group Management</h1>
    </header>
    <main>
        <section id="existing-groups">
            <h2>Existing Groups</h2>
            <ul>
                <?php
                $current_group_id = null;
                while ($group = $groups_result->fetch_assoc()) {
                    if ($current_group_id !== $group['group_id']) {
                        if ($current_group_id !== null) {
                            echo "</ul></li>";
                        }
                        $current_group_id = $group['group_id'];
                        echo "<li><strong>" . $group['group_name'] . " (Plan: " . $group['amount'] . ")</strong>";
                        echo "<form method='POST'>
                                <input type='hidden' name='group_id' value='" . $group['group_id'] . "'>
                                <input type='number' name='new_plan' placeholder='New Plan' required>
                                <button type='submit' name='change_plan'>Change Plan</button>
                              </form>";
                        
                    }
                    echo "<li>" . $group['first_name'] . " (Joined: " . $group['date_joined'] . ")";
                    echo "<form method='POST' style='display:inline; margin-left:10px;'>
                            <input type='hidden' name='member_id' value='" . $group['group_id'] . "'>
                            <select name='new_group_id' required>
                                <option value=''>Select New Group</option>";
                    // Fetch all groups for reassignment
                    $all_groups = $conn->query("SELECT id, name FROM groups");
                    while ($g = $all_groups->fetch_assoc()) {
                        echo "<option value='" . $g['id'] . "'>" . $g['name'] . "</option>";
                    }
                    echo "</select>
                            <button type='submit' name='reassign_member'>Reassign</button>
                          </form></li>";
                }
                if ($current_group_id !== null) {
                    echo "</ul></li>";
                }
                ?>
            </ul>
        </section>
    </main>
</body>
</html>
