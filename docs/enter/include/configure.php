<?php 
//Selecionar configurações do site

$resultado = $mysqli->query("SELECT * FROM configure");

    while ($row = $resultado->fetch_assoc()){   
    
$urlsite = $row['urlsite'];
$namesite = $row['namesite'];
$keyprivate = $row['keyprivate'];
$keypublic = $row['keypublic'];
}
?>