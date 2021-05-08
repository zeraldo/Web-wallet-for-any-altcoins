<?php
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


$user_ip = getUserIP();

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
//Nome e versao navegador 
#echo $navegador . "";