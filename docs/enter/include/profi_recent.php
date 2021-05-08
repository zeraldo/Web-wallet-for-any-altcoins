<div class="col-lg-6">
                    <section class="box">
                        <header class="panel_header">
						<center>
                            <h2 class="title"><?php
                       
$consulta1= "SELECT * FROM histor WHERE id_user='$id_one'";

$return1 = $mysqli->query( $consulta1);
if ( $return1 == false ) {
                echo $mysqli->error;
                }
        $result1 = 0 ;
while($registro1 = $return1->fetch_array()) {
            $result1++;
        }
        
if ( $result1 > 0 ) {
echo 'HISTORICO DE LUCRO ('.$result1.')</h4>';
} elseif ( $result1 == 0 ) {
echo "SEM LUCRO" ;
}
?></h2></center>
                           
                        </header>
                        <div class="content-body">
                            <div class="row">
                                <div class="col-xs-12">

                                    <div style="overflow-x: auto" data-pattern="priority-columns">
                                        <table id="tech-companies-1" class="table vm trans table-small-font no-mb table-bordered table-striped">
                                             <?php                                                 
if ( $result1 > 0 ) {
                           echo '
                                <thead>
                                <tr>
                                    <th>Natureza</th>
                                    <th>Quantidade</th>
                                    <th>Estado</th>
                                    <th>Data</th>
									
                                    <th>Hash</th>
                                </tr>
                                </thead>';
} elseif ( $result1 == 0 ) {
echo "<center><h4>Faça já o seu primero investimento</h4></center>" ;
}
?>
                                            <tbody>
											
											
											
											
											
											
											
											
											
											 <?php 
   
if (!$resultado1 = $mysqli->query($consulta1)) {
    echo ' Falha na consulta: '. $mysqli->error;
    $mysqli->close(); 
}

else { // User exists
       /* percorrer os registos (linhas) da tabela e mostrar na página */
    while ($row = $resultado1->fetch_assoc()){   
    
$status = $row['status'];

if ( $status > 0 ) {
    //Aqui o usuário tá ativo no sistema
    $status = '<strong>Processado</strong>';

} elseif ( $status  == 0 ) {
//Aqui não está ativo
    
    $status = '<strong>Pendente</strong>  success warning';

//Aqui tá logado no sistema como usuário
}

                                             echo
                                                 '<tr>
                                                    <td>
                                                        <div class="round img2">
                                                            <img src="data/crypto-dash/coin5.png" alt="">
                                                        </div>
                                                        <div class="designer-info">
                                                            <h6>Bitdash</h6>
                                                        </div>
                                                    </td>
                                                    <td><small class="text-muted">09:33:02</small></td>
                                                    <td><span class="badge w-70 round-success">Completed</span></td>
                                                    <td class="green-text boldy">+1,429DAH</td>
                                                </tr>';
}
}

?> </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>
                    
                </div>
