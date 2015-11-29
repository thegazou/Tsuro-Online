<?php namespace App\Http\Controllers;

//use App\Http\Requests;
use App\Http\Controllers\Controller;
//use Request;
//use LRedis;
use Redis;
use Illuminate\Http\Request;

class GameController extends Controller {

	//private $nbMaxPlayer = 2;

	public function __construct()
	{
		
		//$this->middleware('guest');
		//$this->middleware('ajax', ['only' => ['postPlay','postQuestion']]);
	}
	
	public function index()
	{
		$nbPlayer = 0;
		if(Redis::exists('nbPlayer')){
			$nbPlayer = Redis::get('nbPlayer');
		}
		
		if($nbPlayer < 2){
			
			
			if($nbPlayer < 1){ // pas encore suffisamment de joueur connectés
				Redis::set('state', 0);
			}
			else{
				Redis::set('state', 1); // le joueur 1 peut commencer la partie (1er joueur connecté à la partie)
			}
			
			$nbPlayer++;
			Redis::set('nbPlayer', $nbPlayer);			
			session(['gamekey' => $nbPlayer]);
			
			return view('game');
		}
		else if($nbPlayer == 1){
			$nbPlayer++;
			Redis::set('nbPlayer', $nbPlayer);
			Redis::set('state', 1);
			session(['gamekey' => $nbPlayer]);
			
			return view('game');
		}
		else{
			return view('home');//with ('error' => 'server full');
		}
		
		
	}
	
	public function postPlay(Request $request)
	{
		
		
		
		return response()->json(['response' => 'ok']);

	}
	
	public function postQuestion(Request $request) // pour obtenir l'état du jeu (à qui de jouer)
	{
		if($request->input('played')=='true'){
			$state = Redis::get('state');
			/*if($state != $request.gamekey){
				return response()->json(['response' => 'error']);
			}*/
			if($state == 2){
				$state = 1;
			}
			else{
				$state++;
			}
			Redis::set('state', $state);
		}

		return response()->json(['response' => 'ok', 'state' => Redis::get('state')]);

	}


}
