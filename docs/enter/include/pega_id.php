
<?php 
 
/* texto sql da consulta*/
$consulta = ("SELECT * FROM users WHERE email='$user'");

/* executar a consulta e testar se ocorreu erro */
if (!$resultado = $mysqli->query($consulta)) {
    echo ' Falha na consulta: '. $mysqli->error;
    $mysqli->close();  /* fechar a liga??o */
}
else{
    /* percorrer os registos (linhas) da tabela e mostrar na p��gina */
    while ($row = $resultado->fetch_assoc()){   
    $id_one = $row['id_one'];
    $id_user = $id_one;
	$user_mail = $user;
    }

}


?>  