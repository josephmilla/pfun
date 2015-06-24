<!--
- Name: BCNF
- Authors: Joseph Milla
- Version: 0.0.0
- Comment: UIUC CS411 Fall 2013
-->

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "//www.w3.org/TR/html4/loose.dtd">
<html lang="en">
	<head>
		<title>PFun - BCNF Decomposition</title>
		<!-- IMPORTED LIBRARIES -->
		<link href='//fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'/>

		<!-- IMPORTED LIBRARIES:STYLESHEETS -->
		<!-- STYLESHEETS::BOOTSTRAP 3.0.2 -->
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css"/>
		<link href="css/bootstrap-select.min.css" rel="stylesheet">

		<!-- ICONS -->
		<link href="#" rel="image_src"/>
		<link href="#" rel="shortcut icon"/>
		<link href="#" rel="apple-touch-icon-precomposed"/>

	  <!-- STYLESHEETS -->
		<link href="css/override-bcnf.css" rel="stylesheet">
	</head>

	<body>
		<div class="container">
			<!-- FIRST ROW -->
			<br><br>
			<div class="row">
  			<div class="col-md-10">
  				<h1><a href="index.html" class="home-link">PFun</a> / BCNF Decomposition</h1>
  			</div>
			</div>

			Check if a given Relation is in BCNF, if not decompose it to BCNF.<br />
			Enter the FDs, in the format : AB->C,D->E.<br />
			Enter the Relation in the format: ABCDE<br />

		<form action="" method="post">
			<!-- # ROW -->
			<br><br>
			<div class="row">
				<!-- DEPENDENCY INPUT -->
				<div class="col-lg-12">
					<div class="input-group input-group-lg">
						<span class="input-group-addon">Dependencies:</span>
						<input type="text" name="dep" value="<?php echo $_REQUEST["dep"]?>" class="form-control" placeholder="Dependency Value">
					</div>
	    	</div>
	    </div>

	    <!-- # ROW -->
			<br><br>
			<div class="row">
				<!-- DEPENDENCY INPUT -->
				<div class="col-lg-12">
					<div class="input-group input-group-lg">
						<span class="input-group-addon">Relation:</span>
						<input type="text" name="rel" value="<?php echo $_REQUEST["rel"]?>" class="form-control" placeholder="Relation Value">
					</div>
	    	</div>
	    </div>

	    <br>

	    <button type="submit" value="Submit" class="btn btn-primary btn-lg btn-lg-o" role="button">
				Submit
			</button>
		</form>

		<br>

		<?php
		if(isset($_REQUEST["dep"]))
		{
			$dependencies = $_REQUEST["dep"];
			$relation = $_REQUEST["rel"];

			check_bcnf($dependencies, $relation);
		}

		function check_bcnf($dependencies, $relation)
		{
			///////////////////// Format the Inputs /////////////
			$dependencies_tmp = explode(",",str_replace(" ","", $dependencies));
			$dependencies = array();
			foreach ($dependencies_tmp as $element)
			{
				$single_dep = explode("->",$element);
				array_push($dependencies, array(str_split($single_dep[0]), str_split($single_dep[1])));
			}
			$relation = str_split(str_replace(" ","", $relation));
			//////////////////////////////////////////////////

			echo "<font color=red><b>Solution:</b></font><br>";
			// Check if the Relation is BCNF if not then Split it
			$bcnf_relations = check_bcnf_rec($dependencies, $relation);
			if (count($relation) > 0 && count($bcnf_relations) > 0)
			{
				$count=1;
				echo "<h4>Final Decomposition</h4>";
				foreach($bcnf_relations as $ele)
				{
					echo "<font size=\"+.5\">$count. $ele<br></font>";
					$count++;
				}
			}
		}

		// Check if a given set of attributes form a SuperKey
		function check_if_superkey($dependencies, $key, $relation)
		{
			$closure = closure($dependencies, $key);
			return issubset($closure,$relation);
		}

		// Recursively called to check if BCNF and split.
		function check_bcnf_rec($dependencies, $relation)
		{
			$bcnf_relations = array();
			$bcnf = true;
			foreach($dependencies as $dep)
			if (check_valid_dependencies($dep, $relation))
			{
				$issuperkey = check_if_superkey($dependencies, $dep[0], $relation);
				if (!$issuperkey)
				{
					$bcnf = false;
					$violate_dep = $dep;
					break;
				}
			}
			if ($bcnf)
			{
				$bcnf_relations = array(array_reduce($relation,"joinx"));
				echo "<b>$bcnf_relations[0]</b> relation is BCNF<br>";
			}
			else
			{
				echo "<b>";
				echo array_reduce($relation,"joinx");
				echo "</b> relation is not BCNF<br>";
				echo "The BCNF violation is : <b>";
				echo array_reduce($violate_dep[0],"joinx");
				echo "->";
				echo array_reduce($violate_dep[1],"joinx");
				echo "</b><br>";

				echo "Decompose the relation based on the dependency <br>";
				$bcnf_relations =
					decompose_relation($dependencies, $relation, $violate_dep);
			}
			return $bcnf_relations;
		}

		function decompose_relation($dependencies, $relation, $violate_dep)
		{
			$bcnf_relations = array();
			// Find the closure of the LHS of the voilating depedency
			$closure  = closure ($dependencies, $violate_dep[0]);
			// Make Sure the Closure only had attribues from the Relation
			$closure  = array_intersect($relation, 	$closure);


			echo   "The relation is decomposed into <b>";
			echo array_reduce($closure,"joinx");
			echo  "</b> and <b>";
			echo array_reduce(array_merge($violate_dep[0],
			array_diff($relation,$closure)),"joinx");
			echo   "</b> <BR>";

			$ret = check_bcnf_rec($dependencies, $closure);
			foreach($ret as $ele)
				array_push($bcnf_relations, $ele);
			$ret = check_bcnf_rec($dependencies, array_merge($violate_dep[0],
		        	array_diff($relation,$closure)));
			foreach($ret as $ele)
				array_push($bcnf_relations, $ele);
			return $bcnf_relations;
		}

		// Check if the depdndicies are valid.
		function check_valid_dependencies($dep, $relation)
		{
			foreach ($dep as $ele)
				if (!issubset($relation, $ele))
					return false;

			return true;
		}
		?>

		<!-- IMPORTED LIBRARIES:JAVASCRIPT -->
		<!-- JAVASCRIPT::JQUERY 2.0.3 -->
		<script src="//code.jquery.com/jquery-2.0.3.min.js"></script>
		<!-- JAVASCRIPT::BOOTSTRAP 3.0.2 -->
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>
		<!-- JAVASCRIPT::BOOTBOX 4.X.X -->
		<script src="js/bootbox.min.js"></script>
		<!-- JAVASCRIPT::BOOTSTRAP-SELECT -->
		<script src="js/bootstrap-select.min.js"></script>
		</div>
	</body>
</html>
