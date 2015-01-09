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

	$arguments_for_hash = array('bucketsz' => $_REQUEST["bucketsz"],'hashdiv' => $_REQUEST["hashdiv"],'ele' => $element_list);
?>