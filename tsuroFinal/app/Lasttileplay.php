<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lasttileplay extends Model
{
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
	
	/**
     * Get the lasttileplay record associated with the game.
     */
    public function Game()
    {
        return $this->belongsTo('App\Game');
    }
}
