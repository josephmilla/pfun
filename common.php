<?php
function joinx($v1,$v2)
{
	return ($v1 . $v2);
}

function ispropersubset($super,$subset)
{	return ((count($super) > count($subset) && issubset($super,$subset)));
}

function issubset($super,$subset)
{
	return (count(array_intersect($super, $subset)) == count($subset));
}

/* Find the Closure of the Elements in relation */
function closure ($dependencies, $relation)
{
	$closure = array_unique($relation);
	for ($i=1; $i<=count($dependencies); $i++)
		foreach ($dependencies as $val)
			if (issubset($closure, $val[0]))
			{
				foreach ($val[1] as $ele)
					array_push($closure, $ele);
				$closure = array_unique($closure);
			}
	return $closure;
}

// Find the Power set of an Array
function array_power_set($array) {
    $results = array(array());
    foreach ($array as $element)
        foreach ($results as $combination)
            array_push($results, array_merge(array($element), $combination));
    return array_slice($results,1);
}
?>
