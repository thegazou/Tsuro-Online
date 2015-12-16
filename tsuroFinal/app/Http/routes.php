<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('home');
});

Route::post('createAGame', 'GameController@postCreateAGame');
Route::post('sendGameId', 'GameController@postSendGameId');
Route::post('IdrewThoseTiles', 'GameController@postIdrewThoseTiles');
Route::post('placeAFirstPawn', 'GameController@postPlaceAFirstPawn');
Route::post('playThisTile', 'GameController@postPlayThisTile');

//Polling
Route::post('question', 'GameController@postQuestion');
