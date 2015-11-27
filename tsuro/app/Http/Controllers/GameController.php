<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Request;
use LRedis;
use Illuminate\Http\Request;

class GameController extends Controller {

	public function __construct()
	{
		$this->middleware('ajax', ['only' => 'play']);
	}

	public function play()
	{
		$redis = LRedis::connection();
		//$redis->publish('message', Request::input('message'));
		echo "hey";
		$redis->publish('message', "played_".$_SESSION['key']);
		
		/*$doc = new DOMDocument();
		$node = $doc->getElementById("ping");
		$node->setAttribute ( "disabled" , "disabled" );
		$node = $doc->getElementById("messages");
		$node->loadHTML("En attente des autres joueurs");*/
		
		

		return response()->json(['response' => 'ok']);

	}


}
