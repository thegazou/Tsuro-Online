<?php namespace App\Http\Controllers;

//use App\Http\Requests;
use App\Http\Controllers\Controller;
//use Request;
//use LRedis;
use Redis;
use Illuminate\Http\Request;
use DB;
use App\Lasttileplay;
use App\Game;

class GameController extends Controller {

	

	public function __construct()
	{
		
		$this->middleware('guest');
	}
	
	public function index()
	{
		//DB::table('game_table')->insert(['nb_of_players' => 8, 'current_player_nb' => 1, 'last_move' => "dont know"]);
		
		/*DB::transaction(function () {
			$line = DB::table('game_table')->where('nb_of_players', 9)->where('isFull', 0)->first();
			if($line){
				$id = $line->game_id;
				DB::table('game_table')->where('game_id', $id)->update(['current_player_nb' => 4]);
			}
			else{
				echo "hello";
			}
		});
		
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
		else{
			return redirect('/'); // redirect('error_full') ok => home;
		}
		
		*/
		session(['gamekey' => 1]);
		echo session('gamekey');
		//return view('game');
	}
	
	public function postCreateAGame(Request $request)
	{
		
		$game = new Game();
		$game->state = 0;
		$game->nbPlayers = $request->input('numberOfPlayer');
		$game->boardSize = $request->input('boardSize');
		$game->activePlayer = 0;
		$game->indexStack = 64;
		$game->seedStack = $request->input('seedStack');
		$game->save();
		
		$lasttileplay = new Lasttileplay();
		$lasttileplay->game()->associate($game);
		$lasttileplay->save();
		
		
		return response()->json(['gameId' => $game->id]);

	}
	
	public function postSendGameId(Request $request)
	{	
		if($request){
			echo "hello";
		}
		DB::transaction(function()
		{
			$game_id = $request->input('gameId');
			if($game_id)
			{
				$game = Game::find($game_id);
				if($game->state == 0)
				{
					$actualNbOfPl = $game->activePlayer + 1;				
					
					if($actualNbOfPl == $game->nbPlayer)
					{
						$game->state = 1;
						$game->activePlayer = 0;						
					}
					else
					{
						$game->increment('activePlayer');						
					}
					$game->save();	
					return response()->json(['boardSize' => $game->boardSize, 'nbPlayers' => $game->nbPlayers, 'seedStack' => $game->seedStack, 'activePlayer' => $actualNbOfPl]);
				}
				else
				{
					return response()->json(['error' => 'game full']);
				}
			}
			else
			{
				return response()->json(['error' => 'unknown game id']);
			}
		});		
	}
	
	//TODO
	public function postIdrewThoseTiles(Request $request)
	{
		//$lasttileplay = Game::find(1)->lasttileplay;
		
		
		
		return response()->json(['response' => 'ok']);

	}
	
	//TODO
	public function postPlaceAFirstPawn(Request $request)
	{
		
		return response()->json(['response' => 'ok']);

	}
	
	//TODO
	public function postPlayThisTile(Request $request)
	{
		
		return response()->json(['response' => 'ok']);

	}
	
	//Polling
	public function postQuestion(Request $request)
	{
		$game_id = $request->input('gameId');
		if($game_id == -1){
			return response()->json(['gameState' => 404]);
		}
		else{
			$game = Game::find($game_id);
			switch($game->state){
				case 0:
					echo "0";
					return response()->json();	
					break;
				case 1:
					echo "1";
					return response()->json(['activePlayer' => $game->activePlayer]);
					break;
				case 2:
				
					break;
				case 3:
				
					break;
				case 4:
				
					break;
				case 5:
				
					break;
				default:
					return response()->json(['gameState' => 404]);
			}
		}

		
	}


}
