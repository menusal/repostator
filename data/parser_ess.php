<?php

/**
* 
*/
class repostator
{
    // Tipos de combustible
    private $tipos = array("GPR","GOA","G98","NGO","BIO");
    // private $tipos = array("G95");

    public $fecha = null;
    public $procces = false;

    function __construct($fecha)
    {
        $this->descarga($fecha);
    }

    private function descarga($fecha)
    {
        $fecha_archivo = $fecha;
        $ano = substr($fecha, 4,4);
        $mes = substr($fecha, 2,2);
        $dia = substr($fecha, 0,2);

        $fecha = "$ano-$mes-$dia";
        $this->fecha = $fecha;
        //open the database
       // $db = new PDO('sqlite:dbrepostator.db');
        $db = new PDO('sqlite:/home/rwthyerc/www/repostator/data/db/dbrepostator.db');
        $db->beginTransaction();

        foreach ($this->tipos as $tipo) {

           // $archivo = "eess_{$tipo}_{$fecha_archivo}.csv";
            $archivo = "/home/rwthyerc/www/repostator/data/db/eess_{$tipo}_{$fecha_archivo}.csv";

            if (($gestor = fopen($archivo, "r")) !== FALSE) {

                $num=1;

                while (($datos = fgetcsv($gestor, 1000, ",")) !== FALSE) {
                    
                    $numero = count($datos);
                    $lng = trim($datos[0]);
                    $lat = trim($datos[1]);
                    $info = trim($datos[2]);
                    $infoa = explode(" ", $info);
                    $precio = trim($infoa[count($infoa) - 2]);
                    $precio = str_replace(",", ".", $precio);
                    $info = preg_replace("/" . $precio . " e/", "", $info);
                    $info = str_replace("'", "_", $info);

                    if ( is_numeric($precio))
                    {
                        try
                        {  
                            // ;

                            echo "$num :: INSERT INTO t_precios (es_ccid, es_rotulo, es_cp, es_fecha, es_lat, es_lng,es_precio, es_tipo) VALUES ('".$ccid."','".$info."',0,'".$fecha."','".$lat."','".$lng."',".$precio.",'".$tipo."'); \n";

                            $ccid = abs(substr($lat, 0,7)) . abs(substr($lng, 0,7));
                            $ccid = str_replace(".", "", $ccid);
                            $ccid = str_replace("'", "-", $ccid);
                            $ccid = str_replace("\"", "-", $ccid);
                            $ccid = substr($info,0,3) . $ccid;

                            $db->query("INSERT INTO t_precios (es_ccid, es_rotulo, es_cp, es_fecha, es_lat, es_lng,es_precio, es_tipo) VALUES ('".$ccid."','".$info."',0,'".$fecha."','".$lat."','".$lng."',".$precio.",'".$tipo."');");
                            //$db->exec();
                            
                        }
                        catch(PDOException $e)
                        {
                            print 'Exception : '.$e->getMessage();
                        }

                        $num++;
                    }
                    
                }

               

                $this->procces = true;

                fclose($gestor);
            }
            else
                mail("daniarlandis@gmail.com","ARCHIVOS NO DISP",$archivo);
        }
        // close the database connection
	    $db->commit();
        $db->exec("VACUUM FULL");
        $db = NULL;

    }
}

$e = new repostator(date("dmY"));

try
{  
    // Actualizamos las ess que no tienen id
    //$db = new PDO('sqlite:dbrepostator.db');
     $db = new PDO('sqlite:/home/rwthyerc/www/repostator/data/db/dbrepostator.db');
    // Actualizamos
    // $db->exec("update t_precios set es_cid = (select tes_cid from t_eess where SUBSTR(tes_lat,0,7) = SUBSTR(es_lat,0,7) and SUBSTR(abs(tes_lon),0,7) = SUBSTR(abs(es_lng),0,7) ) WHERE es_cid is null;");
    

    if ($e->procces)
    {

        $db->exec("DELETE FROM t_estaciones");
        
        // $db->exec("INSERT INTO t_estaciones SELECT tes_ccid, es_tipo as tes_tipo, tes_rot as tes_rotulo, tes_cpo, es_fecha as tes_fecha, tes_lat, tes_lon as tes_lng, es_precio as tes_precio, tes_dir, tes_loc, tes_pro from t_eess,t_precios WHERE es_ccid = tes_ccid and es_fecha like '".$e->fecha."%'");

        $db->exec("INSERT INTO t_estaciones SELECT es_ccid as tes_cid, es_tipo as tes_tipo, es_rotulo as tes_rotulo, es_cp as tes_cpo, es_fecha as tes_fecha, es_lat as tes_lat, es_lng as tes_lng, es_precio as tes_precio, '' as tes_dir, '' as tes_loc, '' as tes_pro from t_precios WHERE es_ccid = tes_ccid and es_fecha like '".$e->fecha."%'");

    }

    $db = NULL;

    // insertamos en la vista diaria

}    
catch(PDOException $e)
{
    print 'Exception : '.$e->getMessage();
}


?>