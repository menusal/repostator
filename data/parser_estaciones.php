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
        // $db = new PDO('sqlite:repostator.db');
        $db = new PDO('sqlite:/home/rwthyerc/www/repostator/data/db/repostator.db');

        foreach ($this->tipos as $tipo) {

            // $archivo = "eess_{$tipo}_{$fecha_archivo}.csv";
            $archivo = "/home/rwthyerc/www/repostator/data/db/eess_{$tipo}_{$fecha_archivo}.csv";

            if (($gestor = fopen($archivo, "r")) !== FALSE) {
                $archivos=0;
                $num=1;

                $db->exec("DELETE FROM t_estaciones WHERE tes_tipo = '".$tipo."'");
                $db->beginTransaction();

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

                            // echo "$num :: INSERT INTO t_estaciones (tes_cid, tes_rotulo, tes_cp, tes_fecha, tes_lat, tes_lng,tes_precio, tes_tipo,tes_dir, tes_loc, tes_pro) VALUES ('".$ccid."','".$info."',0,'".$fecha."','".$lat."','".$lng."',".$precio.",'".$tipo."','','','');'); \n";

                            // Absoluto formateado a 0x a menores de 10
                            $ilat = abs(substr($lat, 0,7));
                            if ($ilat < 10) 
                                $ilat = "0" . $ilat;

                            $ilng = abs(substr($lng, 0,7));
                            if ($ilng < 10) 
                                $ilng = "0" . $ilng;

                            $ccid = $ilat . $ilng;

                            // Sustituimos punto de decimales
                            $ccid = str_replace(".", "", $ccid);
                            // Los tres primeros carácteres del rótulo
                            $ccid = substr($info,0,3) . $ccid;
                            // Sustituimos ',\ y espacios en blanco
                            $ccid = str_replace("'", "-", $ccid);
                            $ccid = str_replace("\"", "-", $ccid);
                            $ccid = str_replace(" ", "", $ccid);
                            $ccid = str_replace("(", "", $ccid);
                            $ccid = str_replace(")", "", $ccid);
                            $ccid = str_replace(".", "", $ccid);
                            $ccid = str_replace("#", "", $ccid);
                            $ccid = str_replace(">", "", $ccid);
                            $ccid = str_replace("<", "", $ccid);
                            $ccid = str_replace("!", "", $ccid);
                            $ccid = str_replace(",", "", $ccid);
                            $ccid = str_replace(array(' '),'',$ccid);
                            

                            // es_cid NUMERIC, tes_tipo TEXT, tes_rotulo TEXT, tes_cp NUMERIC, tes_fecha TEXT, tes_lat TEXT, tes_lng TEXT, tes_precio NUMERIC, tes_dir TEXT, tes_loc TEXT, tes_pro TEXT
                            // 
                            $db->query("INSERT INTO t_estaciones (tes_cid, tes_rotulo, tes_cp, tes_fecha, tes_lat, tes_lng,tes_precio, tes_tipo,tes_dir, tes_loc, tes_pro) VALUES ('".$ccid."','".$info."',0,'".$fecha."','".$lat."','".$lng."',".$precio.",'".$tipo."','','','');");
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
                $db->commit();
                mail("daniarlandis@gmail.com","$tipo procesado con éxito",$archivo);

                fclose($gestor);
            }
            else
                mail("daniarlandis@gmail.com","ARCHIVOS NO DISP",$archivo);
            $archivos++;
            
        }
        // close the database connection
      
        $db->exec("VACUUM FULL");
        $db = NULL;

    }
}

//$e = new repostator("28082013");
$e = new repostator(date("dmY"));

?>