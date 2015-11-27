<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Request;
use LRedis;

class SocketController extends Controller {

	public function __construct()
	{
		$this->middleware('guest');
		ini_set('session.cookie_lifetime', 60 * 60 * 24 * 7);  // 7 day cookie lifetime
		session_start();

		$redis = LRedis::connection();
		//restore
		/*
		for ($i = 2; $i <= 10; $i++) {
			$redis->del($i);
		}
		*/
		
		$key = 10; //key 0-9 = reserved keys (for tests or future purpose)
		
		while($redis->exists($key)){//find free spot
			$key++;
		}
		// ! dont forget to $redis->del($key) when game is over !
		
		$redis->set($key,session_id());
		
		$_SESSION['key'] = $key;
		echo "game key : ".$_SESSION['key'];
		
		if($key%2 == 1){
			$redis->publish('message', "start_".($key-1));
		}	
		
		
	}

	public function index()
	{

		return view('socket');

	}

	/*public function writemessage()
	{

		//return view('');

	}*/

	public function sendMessage(){

		$redis = LRedis::connection();
		//$redis->publish('message', Request::input('message'));
		echo "hey";
		$redis->publish('message', "played_".$_SESSION['key']);
		
		/*$doc = new DOMDocument();
		$node = $doc->getElementById("ping");
		$node->setAttribute ( "disabled" , "disabled" );
		$node = $doc->getElementById("messages");
		$node->loadHTML("En attente des autres joueurs");*/
		
		

		return view('socket');

	}


}
