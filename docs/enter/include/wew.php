<?php
/* estabelece a ligação à base de dados */
$mysqli = new mysqli("localhost", "root", "","bot");

/* verifica se ocorreu algum erro na ligação */
if ($mysqli->connect_errno) {
    echo "Falha na ligação: " . $mysqli->connect_error; 
    exit();
}

/* definir o charset utilizado na liga??o */
$mysqli->set_charset("utf8");

?>