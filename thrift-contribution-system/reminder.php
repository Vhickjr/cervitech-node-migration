<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

$conn = new mysqli("localhost", "root", "", "thrift_management");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$mail = new PHPMailer(true);

try {
    $result = $conn->query("SELECT email FROM members WHERE contribution_status = 'Pending'");

    while ($row = $result->fetch_assoc()) {
        $mail->isSMTP();
        $mail->Host = 'smtp.example.com'; // Set the SMTP server to send through
        $mail->SMTPAuth = true;
        $mail->Username = 'your_email@example.com'; // SMTP username
        $mail->Password = 'your_password'; // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('admin@thriftmanagement.com', 'Thrift Management');
        $mail->addAddress($row['email']);

        $mail->isHTML(true);
        $mail->Subject = 'Contribution Reminder';
        $mail->Body = 'Dear member, please remember to make your contribution this month.';

        $mail->send();
    }
    echo "Reminders sent successfully!";
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

$conn->close();
?>
