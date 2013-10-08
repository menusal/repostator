 <?php

$origen = $_GET['origen'];
$destino = $_GET['destino'];

$origen = str_replace(' ','+',$origen);
$destino = str_replace(' ','+',$destino);
$destino = preg_replace("/\%7/", '|', $destino);
//echo $destino; die();
$geocode=file_get_contents('http://maps.googleapis.com/maps/api/directions/json?origin='.$origen.'&destination='.$destino.'&sensor=false');

echo json_encode($geocode);
?>