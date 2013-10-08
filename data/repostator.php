<?php

class RepostatorMovil
{

    private $db;
    private $db_day;

    function __construct()
    {
        //$this->db = new PDO('sqlite:db/dbrepostator.db');
        $this->db = new PDO('sqlite:/home/rwthyerc/www/repostator/data/db/dbrepostator.db');
    }

    function __destruct()
    {
        $this->db = NULL;
    }

    public function GetDataForAccuracy($lat,$lon,$distance,$tipo)
    {
        
        try
        { 
            

            // Sqlite no implementa funciones de sin(), cos(), radians(), acos() así que lo hacemos al vuelo por no compilar y generarlas con C++ en la base de datos sqlite3
            // FIXME:: compilar en un futuro pero antes hacer prueba de rendimento
            function custom_cos($arg) {
                return cos($arg);
            }

            function custom_sin($arg) {
                return sin($arg);
            }
            
            function custom_acos($arg) {
                return acos($arg);
            }
            
            function custom_radians($arg) {
                return deg2rad($arg);
            }

            $this->db->sqliteCreateFunction('cos', 'custom_cos');
            $this->db->sqliteCreateFunction('sin', 'custom_sin');
            $this->db->sqliteCreateFunction('radians', 'custom_radians');
            $this->db->sqliteCreateFunction('acos', 'custom_acos');

            // To search by kilometers instead of miles, replace 3959 with 6371
            // Ref: https://developers.google.com/maps/articles/phpsqlsearch_v3?hl=es#findnearsql
            $result = $this->db->query("SELECT tes_cid as id, tes_rotulo as rotulo, tes_tipo as tipo, tes_precio as precio, tes_lat as lat, tes_lng as lon, tes_loc as localidad, tes_pro as provincia, tes_fecha as fecha, tes_cp as cp, tes_dir as dir, ( 6371 * acos( cos( radians(".$lat.") ) * cos( radians( tes_lat ) ) * cos( radians( tes_lng ) - radians(".$lon.") ) + sin( radians(".$lat.") ) * sin( radians( tes_lat ) ) ) ) AS distance FROM t_estaciones WHERE tes_tipo='".$tipo."' AND distance < ".$distance." ORDER BY tes_precio, distance"); //es_fecha='".$fecha."' AND

            // Si falla la tabla diaria la query en la base del histórico
            if (!$result) {

                $result = $this->db->query("SELECT max(es_fecha) FROM t_precios");
                $fecha = $result->fetch();
                $fecha = $fecha[0];

                $result = $this->db->query("SELECT id, rotulo, tipo, precio, lat, lon, localidad, provincia, cp, ( 6371 * acos( cos( radians(".$lat.") ) * cos( radians( lat ) ) * cos( radians( lon ) - radians(".$lon.") ) + sin( radians(".$lat.") ) * sin( radians( lat ) ) ) ) AS distance FROM precios WHERE fecha='".$fecha."' AND tipo='".$tipo."' AND distance < ".$distance." ORDER BY precio, distance"); //es_fecha='".$fecha."' AND
                
                $row = array();

            }

            if ($result)
                $row = $result->fetchAll();
            else
                die("Broken query");

            $estaciones = array();

            foreach ($row as $key => $ess) {

                $estaciones[$key][ "id" ] = $ess["id"];
                $estaciones[$key][ "rotulo" ] = $ess["rotulo"];
                $estaciones[$key][ "dir" ] = $ess["dir"];
                $estaciones[$key][ "localidad" ] = $ess["localidad"];
                $estaciones[$key][ "provincia" ] = $ess["provincia"];
                $estaciones[$key][ "cp" ] = $ess["cp"];
                $estaciones[$key][ "tipo" ] = $ess["tipo"];
                $estaciones[$key][ "precio" ] = $ess["precio"];
                $estaciones[$key][ "lat" ] = $ess["lat"];
                $estaciones[$key][ "lon" ] = $ess["lon"];
                $estaciones[$key][ "fecha" ] = $ess["fecha"];
                $estaciones[$key][ "distance" ] = $ess["distance"];

            }

            return json_encode($estaciones);

        }    
        catch(Exception $e)
        {
            print 'Exception : '.$e->getMessage();
        }

    }
}



?>