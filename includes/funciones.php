<?php

function obtenerServicios() {
    try {
        // importar uina conexion
        require 'databases.php';
        
        //Escribir codigo SQL
        $sql = "SELECT * FROM servicios;";

        $consulta = mysqli_query($db, $sql);

        //arreglo vacio
        $servicios = [];


        $i = 0;
        // Obtener los resultados
        while ( $row = mysqli_fetch_assoc($consulta) ){
            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];

            $i++;
        }

        echo "<pre>";
            var_dump( json_encode($servicios) );
            echo "</pre>";

    } catch (\Throwable $th) {

        var_dump($th);
    }
}

obtenerServicios();
?>