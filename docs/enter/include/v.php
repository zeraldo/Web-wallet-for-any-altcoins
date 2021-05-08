<?php
//final do ip '.$user_ip.'
$url = 'http://ip-api.com/json/'.$user_ip.'?fields=country,city';

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);
$result=curl_exec($ch);

curl_close($ch);


$resposta = json_decode($result, true);
//Pegamos o pais
$pais = $resposta['country'];
//Pegamos a cidade
$cidade = $resposta['city'];

function getOS() {
    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    $os_array = array(
        'windows nt 10'      =>  'Windows 10',
        'windows nt 6\.3'     =>  'Windows 8.1',
        'windows nt 6\.2'     =>  'Windows 8',
        'windows nt 6\.1'     =>  'Windows 7',
        'windows nt 6\.0'     =>  'Windows Vista',
        'windows nt 5\.2'     =>  'Windows Server 2003/XP x64',
        'windows nt 5\.1'     =>  'Windows XP',
        'windows xp'         =>  'Windows XP',
        'windows nt 5\.0'     =>  'Windows 2000',
        'windows me'         =>  'Windows ME',
        'win98'              =>  'Windows 98',
        'win95'              =>  'Windows 95',
        'win16'              =>  'Windows 3.11',
        'macintosh|mac os x' =>  'Mac OS X',
        'mac_powerpc'        =>  'Mac OS 9',
        'linux'              =>  'Linux',
        'ubuntu'             =>  'Ubuntu',
        'iphone'             =>  'iPhone',
        'ipod'               =>  'iPod',
        'ipad'               =>  'iPad',
        'android'            =>  'Android',
        'blackberry'         =>  'BlackBerry',
        'webos'              =>  'Mobile'
    );

    foreach ($os_array as $regex => $value) {
        if (preg_match('/' . $regex . '/i', $user_agent)) {
            return $value;
        }
    }

    /*return 'Unknown OS Platform';*/
}


$sistema = getOS();

//Sistem Operacional do usuario $sistema 

$ip = $_SERVER['REMOTE_ADDR'];

$u_agent = $_SERVER['HTTP_USER_AGENT'];
$bname = 'Unknown';
$platform = 'Unknown';
$version= "";

if (preg_match('/linux/i', $u_agent)) {
    $platform = 'Linux';
}
elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
    $platform = 'Mac';
}
elseif (preg_match('/windows|win32/i', $u_agent)) {
    $platform = 'Windows';
}


if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent))
{
    $bname = 'Internet Explorer';
    $ub = "MSIE";
}
elseif(preg_match('/Firefox/i',$u_agent))
{
    $bname = 'Mozilla Firefox';
    $ub = "Firefox";
}
elseif(preg_match('/Chrome/i',$u_agent))
{
    $bname = 'Google Chrome';
    $ub = "Chrome";
}
elseif(preg_match('/AppleWebKit/i',$u_agent))
{
    $bname = 'AppleWebKit';
    $ub = "Opera";
}
elseif(preg_match('/Safari/i',$u_agent))
{
    $bname = 'Apple Safari';
    $ub = "Safari";
}

elseif(preg_match('/Netscape/i',$u_agent))
{
    $bname = 'Netscape';
    $ub = "Netscape";
}

$known = array('Version', $ub, 'other');
$pattern = '#(?<browser>' . join('|', $known) .')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
if (!preg_match_all($pattern, $u_agent, $matches)) {
}


$i = count($matches['browser']);
if ($i != 1) {
    if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
        $version= $matches['version'][0];
    }
    else {
        $version= $matches['version'][1];
    }
}
else {
    $version= $matches['version'][0];
}

// check if we have a number
if ($version==null || $version=="") {$version="?";}

$Browser = array(
        'userAgent' => $u_agent,
        'name'      => $bname,
        'version'   => $version,
        'platform'  => $platform,
        'pattern'    => $pattern
);

$navegador = "" . $Browser['name'] . " V." . $Browser['version'];
$so = "SO: " . $Browser['platform'];
$email = 'zuacandido@gmail.com';
//Nome e versao navegador 
//echo $navegador . "";




  $headers = "MIME-Version: 1.1\r\n";
 
  $headers .= "Content-type: text/html; charset=UTF-8\r\n";
  $headers .= "From: no-reply@vexterior.com\r\n"; // remetente
  $headers .= "Return-Path: no-reply@vexterior.com\r\n"; // return-path
  
  $subject = "Visualização no site Vexterior | Vexterior" ;
 
  $mensagem = '
 
 <html><head><style>body{margin: 0;padding: 0;}@media only screen and (max-width: 640px){table{ width:100% !important; min-width: 200px !important; } img[class="partial-image"]{ width:100% !important; min-width: 120px !important; }}</style></head><body topmargin="0" leftmargin="0"><!--?xml encoding="utf-8" ?--><table style="border-collapse: collapse; border-spacing: 0; min-height: 418px;" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f2f2f2"><tbody><tr><td align="center" style="border-collapse: collapse; padding-top: 30px; padding-bottom: 30px;"><table cellpadding="5" cellspacing="5" width="600" bgcolor="white" style="border-collapse: collapse; border-spacing: 0;"><tbody><tr><td style="border-collapse: collapse; width: 600px; padding: 0px; text-align: center;"><table style="border-collapse: collapse; border-spacing: 0; position: relative; min-height: 40px; width: 100%; box-sizing: border-box; font-family: Arial; font-size: 25px; text-align: center; padding-top: 20px; padding-bottom: 20px; vertical-align: middle;"><tbody><tr><td style="border-collapse: collapse; padding: 10px 15px; font-family: Arial;"><table width="100%" style="border-collapse: collapse; border-spacing: 0; font-family: Arial;"><tbody><tr><td style="border-collapse: collapse;"><h2 style="font-weight: normal; padding: 0px; margin: 0px; color: #0a3041; word-wrap: break-word;"><a style="text-decoration: none; display: inline-block; font-family: arial; box-sizing: border-box; font-size: 25px; word-wrap: break-word; width: 100%; text-align: center; color: rgb(102,102,102);" target="_blank"><span style="font-size: inherit; width: 100%; text-align: center; color: #0a3041;"> Alerta de segurança</span></a></h2></td></tr></tbody></table></td></tr></tbody></table>
 
 <table style="border-collapse: collapse; border-spacing: 0; position: relative; min-height: 40px; width: 100%; box-sizing: border-box; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; max-width: 600px; text-align: center;"><tbody><tr><td style="border-collapse: collapse; font-family: Arial; line-height: 0px; mso-line-height-rule: exactly; padding: 0px;"><table width="100%" style="border-collapse: collapse; border-spacing: 0; font-family: Arial;"><tbody><tr><td align="center" style="border-collapse: collapse; padding: 0; line-height: 0px; mso-line-height-rule: exactly;"><p target="_blank" style="text-decoration: none; font-family: arial; box-sizing: border-box; display: block;"><img class="partial-image" src="https://www.vexterior.com/mail/notification-warning.png" width="600" style="min-width: 160px; box-sizing: border-box; display: block; max-width: 600px;"></a></td></tr></tbody></table></td></tr></tbody></table>
 
 <table style="border-collapse: collapse; border-spacing: 0; position: relative; min-height: 40px; width: 100%; box-sizing: border-box;"><tbody><tr><td style="border-collapse: collapse; padding: 10px 15px; font-family: Arial;"><table width="100%" style="border-collapse: collapse; border-spacing: 0; text-align: left; font-family: Arial;"><tbody><tr><td style="border-collapse: collapse;"><div style="font-family: Arial; font-size: 15px; line-height: 170%; text-align: left; font-weight: normal; color: #0a3041; word-wrap: break-word;"><font color="#0a3041">Olá<span style="line-height: 0; display: none;"></span><span style="line-height: 0; display: none;"></span> <strong>Zeraldo Zua </strong><br/>   
O site Vexterior foi acessado. Anexamos mais informaçoes nesse email
<hr/>  
Data: '.$data.'.<br/>

Navegador: '.$navegador.'<br>

Dispositivo: '.$sistema.'<br>

Localizaçao: '.$cidade.', '.$pais.'. <br/>
</font></div></td></tr></tbody></table></td></tr></tbody></table>

<table style="border-collapse: collapse; border-spacing: 0; position: relative; min-height: 40px; width: 100%; box-sizing: border-box; padding-top: 10px; padding-bottom: 10px; text-align: center;"><tbody><tr><td style="border-collapse: collapse; padding: 10px 15px; font-family: Arial;"><div style="font-family: Arial; text-align: center;"><table style="border-collapse: collapse; border-spacing: 0; font-family: Arial; font-size: 15px; background-color: #0a3041; color: rgb(255,255,255); font-weight: bold; border-radius: 10px; display: inline-block; text-align: center;">

<tbody style="display: inline-block;"><tr style="display: inline-block;"><td align="center" style="border-collapse: collapse; display: inline-block; padding: 15px 20px;"><a href="https://vexterior.com/login/login.php" target="" style="text-decoration: none; font-family: arial; box-sizing: border-box; color: #fff; font-weight: bold; margin: 0px; padding: 0px; text-align: center; font-size: 15px; display: inline-block; word-wrap: break-word; width: 100%;">Aumentar segurança</a></td></tr></tbody></table></div></td></tr></tbody></table>

<table style="border-collapse: collapse; border-spacing: 0; position: relative; min-height: 40px; width: 100%; box-sizing: border-box; display: table;"><tbody><tr><td style="border-collapse: collapse; padding: 10px 15px; font-family: Arial;"><table width="100%" style="border-collapse: collapse; border-spacing: 0; font-family: Arial;"><tbody><tr><td style="border-collapse: collapse;"><hr style="border-color: #BBB; border-style: dashed;"></td></tr></tbody></table></td></tr></tbody></table>

<table style="border-collapse: collapse; border-spacing: 0; position: relative; min-height: 40px; width: 100%; box-sizing: border-box;"><tbody><tr><td style="border-collapse: collapse; padding: 10px 15px; font-family: Arial;"><table width="170" align="left" style="border-collapse: collapse; border-spacing: 0; font-family: Arial; margin-right: 10px;"><tbody><tr><td align="center" style="border-collapse: collapse; padding-right: 10px;"><p target="_blank" style="text-decoration: none; display: inline-block; font-family: arial; box-sizing: border-box; width: 100%;"><img width="130" height="130px" style="min-width: 130px!important; display: block; box-sizing: border-box; padding-left: 0px!important; width: 240px; height: 240px; border-radius: 130px;" class="partial-image signature-partial-image" src="https://www.vexterior.com/img/logo1.png"></p></td></tr></tbody></table>

<table width="300" align="left" style="border-collapse: collapse; border-spacing: 0; font-family: Arial;"><tbody><tr><td style="border-collapse: collapse;"><table style="border-collapse: collapse; border-spacing: 0;"><tbody><tr><td style="border-collapse: collapse; font-family: Arial; font-size: 20px; line-height: 25px; text-align: left; font-weight: normal; color: #0a3041; padding-top: 20px;"><div><a target="_blank" style="text-decoration: none; display: inline-block; box-sizing: border-box; font-size: 20px; font-weight: normal; font-family: Arial; color: #9e9e9e; margin-bottom: 5px; text-align: left; word-wrap: break-word; width: auto!important; line-height: 30px;">www.vexterior.com</a></div><span style="word-wrap: break-word; font-size: 15px; font-family: Arial; line-height: 25px;">Invista no exterior sem teres que viajar e lucra em sua própria casa.
Faça parte da nossa comunidade em redes sociais e esteja a par das novidades, enquanto se realizas financeiramente.</span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>

<table style="border-collapse: collapse; border-spacing: 0; position: relative; min-height: 40px; width: 100%; box-sizing: border-box; padding: 30px 0px;"><tbody><tr><td style="border-collapse: collapse; padding: 10px 15px; font-family: Arial;"><table width="100%" style="border-collapse: collapse; border-spacing: 0; font-family: Arial;"><tbody><tr><td align="center" style="border-collapse: collapse;"><a href="http://www.facebook.com/vexterior" target="_blank" style="text-decoration: none; display: inline-block; font-family: arial; box-sizing: border-box; width: auto!important;">                                    &nbsp;                                    <img src="https://vexterior.com/img/facebook.png" style="width: 30px; height: auto;">                                    &nbsp;                                </a><a href="https://www.youtube.com/channel/UCLMsHNuw63z5602FtrT_KPQ/about" target="_blank" style="text-decoration: none; display: inline-block; font-family: arial; box-sizing: border-box; width: auto!important;">                                    &nbsp;                                    <img src="https://vexterior.com/img/youtube.png" style="width: 70px; height: auto;">                                    &nbsp;                                </a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>';
  
$envio = mail($email, $subject, $mensagem, $headers);