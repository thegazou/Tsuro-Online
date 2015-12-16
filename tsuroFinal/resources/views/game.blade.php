@extends('template')

@section('content')
	<div class="container">
        <div class="row">
            <div class="col-md-10 col-md-offset-1">
                <div class="panel panel-default">
                    <div class="panel-heading">game 1</div>
					
						<script src="js/playground.js"></script>
						<script src="js/main.js"></script>
					<?php
					/*
					{!! Form::open(['id' => 'play','url' => 'play']) !!}
						{!! Form::submit('Ping !',['id' => 'ping', 'disabled' => 'disabled']) !!}
					{!! Form::close() !!}*/
					?>
                </div>
            </div>
        </div>
    </div>

    <!--<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script src="https://cdn.socket.io/socket.io-1.3.7.js"></script>-->
	
	<?php
					/*

    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2" >
              <div id="messages" >en attente d'un adversaire</div>
			  <p>
			  {{ session('gamekey') }}
			  </p>
            </div>
        </div>
    </div>
	
    <script type="text/javascript">
		var played = 'false';
		$(function(){
			console.log("0.0");
			$('form#play').submit(function(e) {
				e.preventDefault();
				played = 'true';
				$( "#ping" ).attr("disabled", true);
				$( "#messages" ).text("L'adversaire est en train de jouer");
				/*console.log("0.1");
				console.log($(this).attr('action'),$(this).serialize());
				$.post($(this).attr('action'), $(this).serialize()).done(function(data) {
					
					console.log(data);
					if(data.response == 'ok') {//par défault réponse == ok
						console.log("0.3a");						
					}
					else{
						console.log("0.3b");
					}
				});*/
			/*});
		});
		
		function poll() {
			$.ajax({
				url: 'question',
				dataType: 'json',
				type: 'POST',
				data: { '_token': '{{ csrf_token() }}', 'played' : played }
			}).done(function(json) {
				// traiter les données.
				if(played == json.played){ 
					played = 'false';
					if(json.state == {{session('gamekey')}} ){
						$( "#ping" ).attr("disabled", false);
						$( "#messages" ).text("C'est votre tour de jouer");
					}
					else if(json.state != 0){
						$( "#messages" ).text("L'adversaire est en train de jouer");
					}
				}
				else{ // si on a joué pendant le pool (cas spécial rare)
					console.log("cas spécial pooling");
				}
				console.log(json);
				
				
				
				
				
				// puis on retourne demander de l'info dans une seconde. 
				setTimeout(poll, 1000);
			}).error(function(xhr) {
				document.body.innerHTML = xhr.responseText
			});
		}

		$(document).ready(poll);
		
    </script>
	*/?>


@endsection