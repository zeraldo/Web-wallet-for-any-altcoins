<?php

//Iniciar processo para gerar saldo do usuário


require_once 'wew.php';

$zd =0;
// saldo do usuário 
$fresultado = $mysqli->query("SELECT * FROM invest_ativo WHERE  status='1'");

    while ($row = $fresultado->fetch_assoc()){   
    
$depositado = $row['depositado'];

$dia = $row['hora'];

$diario = $row['diario'];

$id = $row['id'];

$data_inicial = $row['data_a'];

$user = $row['id_user'];

$data_final = date("y-m-d H:i");

$id_user = $row['id_user'];

$plan = $row['id_plan'];
//Pegar a carteira do usuário 

//Pegando o saldo do usuário
$iresultado = $mysqli->query("SELECT * FROM users WHERE id_one='$id_user'");

    while ($irow = $iresultado->fetch_assoc()){    
$wallet = $irow['id_one'];
//termina
//Pegando o saldo do usuário
$cresultado = $mysqli->query("SELECT * FROM saldo WHERE id_user='$id_user'");

    /* percorrer os registos (linhas) da tabela e mostrar na página */
    while ($crow = $cresultado->fetch_assoc()){    
$saldo = $crow['saldo'];

/*Termina de pegar o saldo do usuário*/
 
// calculadora de lucro

//segundo valor é lucro diário
//primeiro valor é a quantidade investido

    $entrada = strtotime( ''.$data_inicial.'' );
    $saida   = strtotime( ''.$data_final.'' );
    $diferenca = $saida - $entrada;
/*  printf( '%d', $diferenca/3600, $diferenca/60%60 ); */
$z = $diferenca/3600;

//Verificando quanto tempo o plano já está ativo  (por hora)

$zz = $z;
 if ( $zz > $dia) {/*
echo '<br/>Expirou: '.$id;*/

//Atualizar o saldo se o plano expirou 

$lc =$lucro;
$lc*=1;
$saldo+=$lc;
//Atualiza o saldo do usuário
/*$depositado *=10;*/
$saldo;/*+= $depositado; */

$depositado*=2;

$quantidade = $depositado;

//Desativar o plano se expirou 
$mysqli->query("UPDATE invest_ativo SET status='0' WHERE id='$id'") ;

   //Sacando bitcoin
require 'saq.php';

}  else 
{

$zp = $z;

$zd+=$z;

//Aq ui o plan não expirou

$saldo_b = round(($depositado*$diario) ,2);

$saldo += $saldo_b;
//Atualiza o saldo do usuário
$mysqli->query("UPDATE saldo SET saldo='$saldo' WHERE id_user='$id_user'");


    }
   }
  }
 }

?>