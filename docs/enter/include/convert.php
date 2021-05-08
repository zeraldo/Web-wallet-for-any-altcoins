<?php 

	///////////converter btc///////////
$options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "spider", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 2,       // stop after 10 redirects
        CURLOPT_SSL_VERIFYPEER => false     // Disabled SSL Cert checks
    );

    $ch      = curl_init( "https://api.coingate.com/v2/rates/merchant/BTC/USD" ); // You can change this to other crypto trade currency rate provider
    curl_setopt_array( $ch, $options );
    $convert_btc = curl_exec( $ch ); // Gets the page's content
    $err     = curl_errno( $ch ); // Gets the CURL error number if there is error
    $errmsg  = curl_error( $ch ); // Gets the CURL error text if there is error
    curl_close( $ch );
	///////////converter ethreum///////////
	 $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "spider", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 2,       // stop after 10 redirects
        CURLOPT_SSL_VERIFYPEER => false     // Disabled SSL Cert checks
    );

    $ch      = curl_init( "https://api.coingate.com/v2/rates/merchant/ETH/USD" ); // You can change this to other crypto trade currency rate provider
    curl_setopt_array( $ch, $options );
    $convert_eth = curl_exec( $ch ); // Gets the page's content
    $err     = curl_errno( $ch ); // Gets the CURL error number if there is error
    $errmsg  = curl_error( $ch ); // Gets the CURL error text if there is error
    curl_close( $ch );
	
	
	///////////converter dogcoin///////////
	 $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "spider", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 2,       // stop after 10 redirects
        CURLOPT_SSL_VERIFYPEER => false     // Disabled SSL Cert checks
    );

    $ch      = curl_init( "https://api.coingate.com/v2/rates/merchant/DGC/USD" ); // You can change this to other crypto trade currency rate provider
    curl_setopt_array( $ch, $options );
    $convert_dgc = curl_exec( $ch ); // Gets the page's content
    $err     = curl_errno( $ch ); // Gets the CURL error number if there is error
    $errmsg  = curl_error( $ch ); // Gets the CURL error text if there is error
    curl_close( $ch );
	
	
	
	///////////converter dash///////////
	 $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "spider", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 2,       // stop after 10 redirects
        CURLOPT_SSL_VERIFYPEER => false     // Disabled SSL Cert checks
    );

    $ch      = curl_init( "https://api.coingate.com/v2/rates/merchant/DASH/USD" ); // You can change this to other crypto trade currency rate provider
    curl_setopt_array( $ch, $options );
    $convert_dash = curl_exec( $ch ); // Gets the page's content
    $err     = curl_errno( $ch ); // Gets the CURL error number if there is error
    $errmsg  = curl_error( $ch ); // Gets the CURL error text if there is error
    curl_close( $ch );
	
	
	///////////converter bitcoin cash///////////
	 $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "spider", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 2,       // stop after 10 redirects
        CURLOPT_SSL_VERIFYPEER => false     // Disabled SSL Cert checks
    );

    $ch      = curl_init( "https://api.coingate.com/v2/rates/merchant/BCH/USD" ); // You can change this to other crypto trade currency rate provider
    curl_setopt_array( $ch, $options );
    $convert_bch = curl_exec( $ch ); // Gets the page's content
    $err     = curl_errno( $ch ); // Gets the CURL error number if there is error
    $errmsg  = curl_error( $ch ); // Gets the CURL error text if there is error
    curl_close( $ch );
	
	
	
	
	///////////converter ltc///////////
	 $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "spider", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 2,       // stop after 10 redirects
        CURLOPT_SSL_VERIFYPEER => false     // Disabled SSL Cert checks
    );

    $ch      = curl_init( "https://api.coingate.com/v2/rates/merchant/LTC/USD" ); // You can change this to other crypto trade currency rate provider
    curl_setopt_array( $ch, $options );
    $convert_ltc = curl_exec( $ch ); // Gets the page's content
    $err     = curl_errno( $ch ); // Gets the CURL error number if there is error
    $errmsg  = curl_error( $ch ); // Gets the CURL error text if there is error
    curl_close( $ch );
	
	?>