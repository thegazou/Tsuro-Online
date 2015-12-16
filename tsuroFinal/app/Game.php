<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
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
    public function Lasttileplay()
    {
        return $this->hasOne('App\Lasttileplay');
    }
	
}
