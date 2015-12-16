<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGameTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {		
		Schema::create('games', function($table) {
			$table->increments('id');
			$table->tinyInteger('state');
			$table->tinyInteger('nbPlayers');
			$table->tinyInteger('boardSize');
			$table->tinyInteger('activePlayer');
			$table->tinyInteger('indexStack');
			$table->tinyInteger('seedStack');		
			
			$table->tinyInteger('posxLast');
			$table->tinyInteger('posyLast');
			$table->tinyInteger('doorLast');
		});
		
		Schema::create('lasttileplays', function($table) {
			$table->increments('id');
			$table->tinyInteger('posx');
			$table->tinyInteger('posy');
			$table->tinyInteger('door0');
			$table->tinyInteger('door1');
			$table->tinyInteger('door2');
			$table->tinyInteger('door3');
			$table->tinyInteger('door4');
			$table->tinyInteger('door5');
			$table->tinyInteger('door6');
			$table->tinyInteger('door7');
			
			$table->integer('game_id')->unsigned();
			$table->foreign('game_id')
				  ->references('id')
				  ->on('games')
				  ->onDelete('cascade')
				  ->onUpdate('cascade');
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('lasttileplays');
		Schema::drop('games');
    }
}
