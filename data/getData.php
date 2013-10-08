<?php 

require_once('repostator.php');

$lat = $_REQUEST['lat'];
$lon = $_REQUEST['lon'];
$acc = $_REQUEST['acc'];
$tip = $_REQUEST['tip'];

if ( empty($lat) || empty($lat) || empty($acc) || empty($tip) )
	die("Incomplete params");

$data = new RepostatorMovil();
$result = $data->GetDataForAccuracy($lat,$lon,$acc,$tip);

if ( count( json_decode( $result ) ) == 0)
	echo "Incorrect params";
else
	echo $result; 

?>
