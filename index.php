<!DOCTYPE html>
<html>
<head>
	<title>Current Date/Time</title>
        <style>
           body
           {
              font-weight: bold;
              font-size: 19px;
           }
        </style>
</head>

<body>
	<?php
	echo "Current Date: " . date('j M Y');

	echo "<br/>";

	echo "Current Time: " . date('h:i A');
	?>
</body>
</html>