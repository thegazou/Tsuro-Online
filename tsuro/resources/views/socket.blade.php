@extends('app')

@section('content')
	<div class="container">
        <div class="row">
            <div class="col-md-10 col-md-offset-1">
                <div class="panel panel-default">
                    <div class="panel-heading">game 1</div>
                    <form id="play" action="sendmessage" method="POST">
                        <!--<input type="text" name="message" >
                        <input type="submit" value="send">-->
						<input type="submit" value="ping" id="ping" disabled="disabled">
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    <script src="https://cdn.socket.io/socket.io-1.3.7.js"></script>
	{!! Html::script('http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js') !!}

    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2" >
              <div id="messages" >en attente d'un adversaire</div>
            </div>
        </div>
    </div>
	
    <script type="text/javascript">
        var socket = io.connect('http://localhost:8890');

        /*socket.on('message', function (data) {
            $( "#messages" ).append( "<p>"+data+"</p>" );
          });*/
		socket.on('message', function (data) {
		  
		  var dataTab = data.split("_");
		  console.log(dataTab[0],dataTab[1]);
		  if(dataTab[0] == "start"){
			
		    var keyValue = <?php echo $_SESSION['key']; ?>;
					    
		    console.log(keyValue);			
			console.log(parseInt(dataTab[1]))
			if(parseInt(dataTab[1]) == keyValue){
			  console.log("hooo");
			  $( "#ping" ).attr("disabled", false);
			  $( "#messages" ).text("C'est votre tour de jouer");
			}
			else{
			  $( "#messages" ).text("Un adversaire est en train de jouer");
			}
		  }
		  else if(dataTab[0] == "played"){
			var played = parseInt(dataTab[1]);
			var keyValue = <?php echo $_SESSION['key']; ?>;
			
			if(played%2 == 0){
				if((played+1)== keyValue){
					$( "#messages" ).text("Nice");
				}
			}
			else{
				if((played+1)== keyValue){
					$( "#messages" ).text("Nice2");
				}
			}
				
		  }
          
        });

		$(function(){
			
			$('form#play').submit(function(e) {
				e.preventDefault();
				$.post($(this).attr('action'), $(this).serialize()).done(function(data) {
					if(data.response == 'ok') {//par défault réponse == ok
						//$('ul.nav').removeClass('hidden');
						//$('form#log').addClass('hidden');
					}
					else{
					
					}
				});
			});
		}); 
    </script>


@endsection