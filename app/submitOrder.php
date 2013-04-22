<?php
// The request is a JSON request.
// We must read the input.
// $_POST or $_GET will not work!
 
$data = file_get_contents("php://input");
 
//$objData = json_decode($data);

$to = "orders@bedrocklearning.com";
//$to = "corinnaerin@gmail.com";

if (mail($to, "Purchase Order", "$data", "Content-Type: text/html; charset=ISO-8859-1\r\n")) {
    echo "Order submitted successfully";
} else {
    echo "An error occurred while submitting the order";
}

?>