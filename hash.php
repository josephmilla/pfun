<html>
<title>Extensible hash table Demo</title>
<?php include("style.php") ?>

<body>
<?php include("leftmenu.php") ?>
<h3>Extensible hash table Demo</h3>
Enter hash table parameters and elements.
<br/>

Enter elements one at a time or seperated by comma.<br />
Example : 1,2,3<br />

<table  border="0" cellspacing="0" cellpadding="0" bordercolor=black bordercolordark="red">
<tr>
<td style="background:none;border-right: 0px;border-bottom: 0px;" valign=top>

<form action="" method="post">
<table border="0" cellspacing="5" cellpadding="5">
<tr>
	<td>Bucket Size:</td>
	<td><input type="text" name="bucketsz" value="<?php echo $_REQUEST["bucketsz"]?>" /></td>
</tr>
<tr>
	<td>Hash function divisor:</td>
	<td><input type="text" name="hashdiv" value="<?php echo $_REQUEST["hashdiv"]?>" /></td>
</tr>
</table>
<?php
function joincomma($v1,$v2)
{
	return ($v1 . "," . $v2);
}

  $element_list = explode(",", $_REQUEST["elementlist"]);

  if ($_REQUEST['add'])
  {
   	$new_element_list = explode(",", $_REQUEST["element"]);
   	foreach($new_element_list as $ele)
   		if (is_numeric($ele))
	   		array_push($element_list, $ele);
  }

  if ($_REQUEST['delete'])
  {
   	$new_element_list = explode(",", $_REQUEST["element"]);
   	foreach ($element_list as $key=>$ele1)
   	{
	   	foreach($new_element_list as $ele2)
			if ($ele1 == $ele2)
				unset($element_list[$key]);
   	}
   	$element_list = array_values($element_list);
  }

  if ($_REQUEST['clear'])
  {
  	$element_list = array();
  }

   $tmp_element_list = $element_list;
   $element_list = array();
	foreach($tmp_element_list as $ele)
   		if (is_numeric($ele))
	   		array_push($element_list, $ele);

  $arguments_for_hash = array('bucketsz' => $_REQUEST["bucketsz"],
  			             'hashdiv' => $_REQUEST["hashdiv"],
			  			 'ele' => $element_list);
?>
<input type="hidden" name="elementlist"
	value="<?php echo array_reduce($element_list,"joincomma")?>" />

<table border="0" cellspacing="5" cellpadding="5">
<tr>
	<td>Element:</td>
	<td><input type="text" name="element" value="" /></td>
</tr>
<tr>
	<td colspan="2" align="center">
		<input type="submit" name="add"    value="Add" class=lsb/>
		<input type="submit" name="delete" value="Delete" class=lsb/>
		<input type="submit" name="clear"  value="Clear List" class=lsb/>
	</td>
</tr>
</table>
</form>

<?php
if (count($element_list) > 0
		&& $_REQUEST["bucketsz"] > 0
		&& $_REQUEST["hashdiv"] > 0)
{?>

<table>
<tr bgcolor="#AAAAAA">
	<th>Element</th>
	<th>Hash=Element%<?php echo $_REQUEST["hashdiv"] ?></th>
	<th>Binary</th>
</tr>
<?php
foreach ($element_list as $element)
{	echo "<tr>";
	echo "<td>$element</td>";
	echo "<td>" . ($element % $_REQUEST["hashdiv"]) . "</td>";
	echo "<td>" .str_pad(decbin($element % $_REQUEST["hashdiv"]), ceil(log($_REQUEST["hashdiv"],2)),'0', STR_PAD_LEFT) . "</td>";
	echo "</tr>";

}
?>
</table>
</td>
<td style="background:none;border-right: 0px;border-bottom: 0px;" valign=top>
<img src="diagram.php?<?php echo  http_build_query($arguments_for_hash);?>"
	alt="Hash table daigram">
<!-- <a href="diagram.php?<?php echo  http_build_query($arguments_for_hash);?>"> Click here </a> -->
<?php
}
?>
</td>
</tr>
</table>

</body>
</html>