<!--
- Name: Externsible Hash
- Authors: Joseph Milla
- Version: 0.0.0
- Comment: UIUC CS411 Fall 2013
-->

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
	<head>
		<title>PFun - Extensible Hash</title>
		<!-- IMPORTED LIBRARIES -->
		<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'/>

		<!-- IMPORTED LIBRARIES:STYLESHEETS -->
		<!-- STYLESHEETS::BOOTSTRAP 3.0.2 -->
		<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css"/>
		<link href="css/bootstrap-select.min.css" rel="stylesheet">

		<!-- ICONS -->
		<link href="#" rel="image_src"/>
		<link href="#" rel="shortcut icon"/>
		<link href="#" rel="apple-touch-icon-precomposed"/>

	  <!-- STYLESHEETS -->
		<link href="css/override-hash.css" rel="stylesheet">
	</head>

	<body>
		<div class="container">
			<!-- FIRST ROW -->
			<br><br>
			<div class="row">
  			<div class="col-md-10">
  				<h1><a href="index.html" class="home-link">PFun</a> / Extensible Hash</h1>
  			</div>
			</div>

			Enter elements one at a time or seperated by comma.<br />
			Example : 1, 2, 3<br />

			<form action="" method="post">
				<!-- # ROW -->
				<br><br>
				<div class="row">
					<!-- BUCKET-SIZE INPUT -->
					<div class="col-lg-12">
						<div class="input-group input-group-lg">
							<span class="input-group-addon">Bucket Size</span>
							<input type="text" name="bucketsz" value="<?php echo $_REQUEST["bucketsz"]?>" class="form-control" placeholder="Bucket Size Value">
						</div>
	    		</div>
	  		</div>

	  		<!-- # ROW -->
				<br><br>
				<div class="row">
					<!-- HASH DIVISOR INPUT -->
					<div class="col-lg-12">
						<div class="input-group input-group-lg">
							<span class="input-group-addon">Hash Divisor</span>
							<input type="text" name="hashdiv" value="<?php echo $_REQUEST["hashdiv"]?>" class="form-control" placeholder="Hash Divisor Value">
						</div>
	    		</div>
	  		</div>			

				<?php include("php/joincomma.php") ?>

				<input type="hidden" name="elementlist"
					value="<?php echo array_reduce($element_list,"joincomma")?>" />

				<!-- # ROW -->
				<br><br>
				<div class="row">
					<!-- ELEMENT INPUT -->
					<div class="col-lg-12">
						<div class="input-group input-group-lg">
							<span class="input-group-addon">Element</span>
							<input type="text" name="element" value="" class="form-control" placeholder="Element Value">
						</div>
	    		</div>
	  		</div>

	  		<div class="row">
		  		<div class="col-md-2" style="margin: 40px 0 0 0;">
						<button type="submit" name="add" value="Add" class="btn btn-primary btn-lg btn-lg-o" role="button">
							<span class="glyphicon glyphicon-plus"></span>
						</button>
						<button type="submit" name="delete" value="Delete" class="btn btn-primary btn-lg btn-lg-o" role="button">
							<span class="glyphicon glyphicon-trash"></span>
						</button>
						<button type="submit" name="clear" value="Clear List" class="btn btn-primary btn-lg btn-lg-o" role="button">
							<span class="glyphicon glyphicon-refresh"></span>
						</button>
					</div>
				</div>

				<br><br>

			</form>

			<?php
			if (count($element_list) > 0
					&& $_REQUEST["bucketsz"] > 0
					&& $_REQUEST["hashdiv"] > 0)
			{
			?>

			<table>
				<tr bgcolor="#AAAAAA">
					<th><span class="input-group-addon">Element</span></th>
					<th><span class="input-group-addon">Hash = Element mod <?php echo $_REQUEST["hashdiv"] ?></span></th>
					<th><span class="input-group-addon">Binary</span></th>
				</tr>
				<?php
				foreach ($element_list as $element)
				{
					echo "<tr>";
					echo "<td>$element</td>";
					echo "<td>" . ($element % $_REQUEST["hashdiv"]) . "</td>";
					echo "<td>" .str_pad(decbin($element % $_REQUEST["hashdiv"]), ceil(log($_REQUEST["hashdiv"],2)),'0', STR_PAD_LEFT) . "</td>";
					echo "</tr>";

				}
				?>
			</table>

			<?php
			}
			?>
		</div>

		<!-- IMPORTED LIBRARIES:JAVASCRIPT -->
		<!-- JAVASCRIPT::JQUERY 2.0.3 -->
		<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
		<!-- JAVASCRIPT::BOOTSTRAP 3.0.2 -->
		<script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>
		<!-- JAVASCRIPT::BOOTBOX 4.X.X -->
		<script src="js/bootbox.min.js"></script>
		<!-- JAVASCRIPT::BOOTSTRAP-SELECT -->
		<script src="js/bootstrap-select.min.js"></script>
	</body>
</html>