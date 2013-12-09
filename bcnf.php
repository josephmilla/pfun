<?php require_once("common.php") ?>
<html>
<title>BCNF</title>
<?php include("style.php") ?>
<body>
<?php include("leftmenu.php") ?>
<h3>BCNF Decomposition</h3>

Check if a given Relation is in BCNF, if not decompose it to BCNF.<br />
Enter the FDs, in the format : AB->C,D->E.<br />
Enter the Relation in the format: ABCDE<br />

<form action="" method="post">
<table border="0" cellspacing="5" cellpadding="5">
<tr>
	<td>Dependencies:</td>
	<td><input type="text" name="dep" value="<?php echo $_REQUEST["dep"]?>" /></td>
</tr>
<tr>
	<td>Relation:</td>
	<td><input type="text" name="rel" value="<?php echo $_REQUEST["rel"]?>" /></td>
</tr>
<tr>
	<td colspan="2" align="center">
		<input type="submit" value="Submit" class=lsb/>
	</td>
</tr>
</table>
</form>

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
</body>
</html>
