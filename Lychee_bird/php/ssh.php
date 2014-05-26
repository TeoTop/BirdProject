<?php

/**
 * @name        SSH Module
 * @author      Philipp Maurer
 * @author      Tobias Reich
 * @copyright   2014 by Philipp Maurer, Tobias Reich
 */

if (!defined('LYCHEE')) exit('Error: Direct access is not allowed!');

function turnOpenCV($address, $etat) {
	
	$result;
	
	if($adresse == 'all'){
		$raspberry = getRasp();
		
		if($etat == 0){
			foreach($raspberry as $rasp){
				$result = stopOpenCV($rasp['adresse']);
				if($result == false){
					return false;
				}
			}
		} else {
			foreach($raspberry as $rasp){
				stopOpenCV($rasp['adresse']);
				$result = startOpenCV($rasp['adresse']);
				if($result == false){
					return false;
				}
			}
		}
	} else {
		if($etat == 0){
			$result = stopOpenCV($address);
		} else {
			stopOpenCV($address);
			$result = startOpenCV($address);
		}
	}
	
	return $result;
}

function startOpenCV($address) {

	$ssh = new Net_SSH2($address);
	if(!$ssh->login('pi', 'raspberry')){
		return false;
	}
	$result = $ssh->exec("./opencv/Bird > /dev/null 2>&1 &");
    return true;

}

function stopOpenCV($address) {

	$ssh = new Net_SSH2($address);
	if(!$ssh->login('pi', 'raspberry')){
		return false;
	}
	$matched = array();
	do{
		$grep = $ssh->exec("ps -eaf");
		$match = preg_match('/.*?(\d+).*?Bird/', $grep,$matched);
		if($match){
			echo $ssh->exec("kill ".$matched[1]);
		}
	}while($match);
	return true;
}

function takePicture($rasp) {

	if($rasp == 'all'){
		$raspberry = getRasp();
		foreach($raspberry as $rasp){
			$ssh = new Net_SSH2($rasp['adresse']);
			if(!$ssh->login('pi', 'raspberry')){
				return false;
			}
			$result = $ssh->exec("raspistill -w 640 -h 480 -o /mnt/upload -t 1");
		}
	} else {
		$ssh = new Net_SSH2($address);
		if(!$ssh->login('pi', 'raspberry')){
			return false;
		}
		$result = $ssh->exec("raspistill -w 640 -h 480 -o /mnt/upload -t 1");
	}
    return true;
}

function setNetwork() {
	$ssh = new Net_SSH2($address);
	if(!$ssh->login('pi', 'raspberry')){
		return false;
	}
	$result = $ssh->exec("netstat -nt");
	
	/*deleteRasp();
	addRasp();*/
}
?>
