<?php 
ini_set('display_errors', 0 );
error_reporting(-0);

require '../include/wew.php';

require 'obterid.php';
//Pegar o id do perfi do usuario

 echo '
 {

    "refer_url": [
        {
			"urlrefer": "'.$id_user.'"
        } 
    ]
}';
     
?>