<?php

// Script to locate stations near the route required.

// Author: Daniel Arlandis 
// Date: 2012-10-31

// Version: 0.1
//die("DEBUG");;
// Function that searches recursively in a multidimensional array
function in_array_r($needle, $haystack, $strict = true) {
    foreach ($haystack as $item) {
        if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && in_array_r($needle, $item, $strict))) {
            return true;
        }
    }

    return false;
}

function orderMultiDimensionalArray ($toOrderArray, $field, $inverse = false) {  
    $position = array();  
    $newRow = array();  
    foreach ($toOrderArray as $key => $row) {  
            $position[$key]  = $row[$field];  
            $newRow[$key] = $row;  
    }  
    if ($inverse) {  
        arsort($position);  
    }  
    else {  
        asort($position);  
    }  
    $returnArray = array();  
    foreach ($position as $key => $pos) {       
        $returnArray[] = $newRow[$key];  
    }  
    return $returnArray;  
}  

// Declarations
$eess = $es = $points = array();
$i=0;
$resultado = array("eess");

// Accuracy
(!isset( $_POST['accuracy']) ) ? $accuracy = 5 : $accuracy = $_POST['accuracy'];


// Get the points of rute polyline
$array=json_decode($_POST['points']);

foreach ($array as $value) {

    $points[]=substr(trim($value[0]),0,$accuracy).",".substr(trim($value[1]),0,$accuracy);

	$i++;
}
//echo "ARRAY $accuracy"; print_r($points); echo "FIN ARRAY";
// We look at the csv file that contains the service stations
if (($gestor = fopen("data/eess_".$_POST["tipo"].".csv", "r")) !== FALSE) {

    while (($datos = fgetcsv($gestor, 1000, ",")) !== FALSE) {
//echo substr($datos[1],0,$accuracy + 1) . "," . substr($datos[0],0,$accuracy + 1);

        // If we find an occurrence store it in the array to convert JSON to return the petition
        if( in_array(substr(trim($datos[1]),0,$accuracy).",".substr(trim($datos[0]),0,$accuracy), $points) )
        {
            // Now extract the price for the array sort by price
            $price = explode(" ", $datos[2]);

            $resultado["eess"][]=array("lat"=>$datos[1],"lng"=>$datos[0],"info"=>$datos[2],"price"=>str_replace(",", ".", $price[count($price) -2]) );
        }
    }
    fclose($gestor);
}

$resultado[] = orderMultiDimensionalArray($resultado,"price",true);

// Format the array to JSON
echo json_encode($resultado);


?>