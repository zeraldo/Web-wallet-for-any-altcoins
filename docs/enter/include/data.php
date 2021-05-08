<?php

date_default_timezone_set('America/Sao_Paulo');

 $numero_dia = date('w')*1;
    $dia_mes = date('d');
    $numero_mes = date('m')*1;
    $ano = date('Y');
    $dia = array('Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado');
    $mes = array('', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro');
	$hora = date('H:i:s');
	
	$dia = $dia[$numero_dia];
	//dia do mes
	//$dia_mes;
	//nome do mes
	$mes = $mes[$numero_mes];
?>