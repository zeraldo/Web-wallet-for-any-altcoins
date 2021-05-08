<?php

$data_final = date("20y-m-d H:i:s");

$data = date("20y-m-d H:i:s");
//pegar o ip do usuario

function getUserIP()
{
    $client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = $_SERVER['REMOTE_ADDR'];

    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }

    return $ip;
}


//$user_ip = getUserIP();

$user_ip = '197.241.134.109';

// Verifar se o endereço ip já existe na base de dados
$result = $mysqli->query("SELECT * FROM viiew WHERE ip='$user_ip' ORDER BY ID DESC LIMIT 1") or die($mysqli->error());

if ( $result->num_rows > 0 ) {
	
      // Aqui ja existe, ou seja o usuario ja visitou o site nas últimas 24 horas

      //Verificamos se a ultima visita foi a 24 horas atras

       while ($row = $result->fetch_assoc()){
	
        $data_inicial = $row['data'];
	   
	   }
	      $entrada = strtotime( ''.$data_inicial.'' );
    $saida   = strtotime( ''.$data_final.'' );
    $diferenca = $saida - $entrada;
	
     $z = $diferenca/3600;

    //Verificando quanto tempo o plano já está ativo  (por hora)

if ( $z > 24 ) {
//Aqui ja foi a mais de 24 horas atras a ultima visita do mesmo endereço ip
require 'include/v.php';

  $mysqli->query("INSERT INTO viiew (ip, device, data, browser, cidade, pais) " 
            . "VALUES ('$user_ip','$sistema','$data','$navegador','$cidade','$pais')");
  
}

}

else
	{ 

require 'include/v.php';
//Aqui o endereço ip não existe na base de dados e por isso inserimos as informaçoes do usuario na base de dados

  $mysqli->query("INSERT INTO viiew (ip, device, data, browser, cidade, pais) " 
            . "VALUES ('$user_ip','$sistema','$data','$navegador','$cidade','$pais')");
  }