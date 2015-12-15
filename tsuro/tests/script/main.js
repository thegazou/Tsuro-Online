//TODO 		: RESPONSIVE BACKGROUND IMAGE SIZE
//TODO 2	: TAILLE DES PIONS DES JOUEURS (Math.ceil(this.app.height/100)) ? 
var app = new PLAYGROUND.Application({
	
	
	boardSize : 7,
	tileSize : 60,
	scale:1,
	height: window.innerHeight,
	width: window.innerHeight,
	offsetX : 0,
	offsetY : 0,
	scale: 1,
	board: [],
	activePlayer: 0,
	numberOfPlayer: 8,
	playerList : [],
	stack: [],
	handTileMouseOver:0,
	colorList: ["#123456","#FF0000","#00FF00","#0000FF","#FFFFFF","#aa7700","#aa0077","#a0a0aa"],
	takenPoints : [],
	tempNumberOfTilesInStack : 64,
	
	create: function() {
	
	this.loadImage("tsuro");
	
	this.loadImage("tsuro6");
	
	this.loadImage("tsuro7");
	
	},
	
	 
	ready: function() { 
	
	this.setState(ENGINE.Menu);
	
	},
	resize: function() { 
	var size = Math.min(window.innerHeight,window.innerWidth);
	this.tileSize = size/(this.boardSize+3);
	this.height = (this.boardSize+3) * this.tileSize;
	this.width = (this.boardSize+2) * this.tileSize;
	
	},

	step: function(dt) { },
	render: function() { },
	
	keydown: function(data) {
		
	},
	keyup: function(data) { },

	mousedown: function(data) { 
	
	},
	mouseup: function(data) { },
	mousemove: function(data) { },

	touchstart: function(data) { },
	touchend: function(data) { },
	touchmove: function(data) { },

	gamepaddown: function(data) { },
	gamepadup: function(data) { },
	gamepadmove: function(data) { },
	
	
	displayBoard : function()
		{
			for (var i = 1; i<=this.boardSize;i++)
			{
				for (var j = 1; j<=this.boardSize;j++)
				{
					this.displayTile(this.board[[i,j]],i,j);
				}
			}
		},
	displayTile: function (tile, tilex, tiley)
		{
			this.layer.fillStyle("#000000");
			this.layer.strokeStyle("#ffffff");
			if(tile.length > 1)
			{
				this.layer.fillRect(tilex*this.tileSize,tiley*this.tileSize, this.tileSize, this.tileSize);
				this.displayRoads(tile,tilex,tiley);
			}
			this.layer.strokeRect(tilex*this.tileSize,tiley*this.tileSize, this.tileSize, this.tileSize);
			
		},
	displayRoads: function(tile, tilex, tiley)
		{
			for (var i = 0; i < 8; i+=2)
			{
				
				
				this.drawARoad(tilex,tiley,tile[i],tile[i+1]);
			}
		},	
	drawARoad : function(tilex,tiley, beginDoor, destinationDoor)
		{
			this.layer.strokeStyle("#818132");
			this.layer.lineWidth(3);
			//prendre comme points de controles : portes opposées
			var beginPoint = this.offsetFromDoor(beginDoor);
			var controlDoor1 = (beginDoor < 2 || beginDoor == 4 || beginDoor == 5) ? 5-beginDoor : 9-beginDoor;
			var controlPoint1 = (beginDoor < 2 || beginDoor == 4 || beginDoor == 5) ? this.offsetFromDoor(5-beginDoor) : this.offsetFromDoor(9-beginDoor);
			var controlDoor2 = (destinationDoor<2 || destinationDoor == 4 || destinationDoor == 5) ? 5-destinationDoor : 9-destinationDoor;
			var controlPoint2 = (destinationDoor < 2 || destinationDoor == 4 || destinationDoor == 5) ? this.offsetFromDoor(5-destinationDoor) : this.offsetFromDoor(9-destinationDoor);
			var endPoint = this.offsetFromDoor(destinationDoor);
			
			// placer le point de controle à 1/3 de la distance porte -> point de controle)
			
				if(controlDoor1 < 2) controlPoint1[1]=2*this.tileSize/3;
				else if(controlDoor1 == 4 || controlDoor1 == 5) controlPoint1[1]/=3;
				else if (controlDoor1 == 2 || controlDoor1 == 3)controlPoint1[0]/=3;
				else controlPoint1[0]=2*this.tileSize/3;
				if(controlDoor2 < 2) controlPoint2[1]=2*this.tileSize/3;
				else if(controlDoor2 == 4 || controlDoor2 == 5) controlPoint2[1]/=3;
				else if (controlDoor2 == 2 || controlDoor2 == 3)controlPoint2[0]/=3;
				else controlPoint2[0]=2*this.tileSize/3;

			
			//calculer la courbe de bézier, et la transférer sur la tuile
			//problème : le rendu des tuiles en main est mal fait, pourquoi  ? 
			// TODO : régler le problème de bézier et des offsets qui font que les tuiles ne sont pas toutes gérees de la même manière
			
				this.layer.beginPath();
				this.layer.moveTo((tilex * this.tileSize) + beginPoint[0],(tiley * this.tileSize) + beginPoint[1]);
				this.layer.bezierCurveTo((tilex * this.tileSize) + controlPoint1[0],(tiley * this.tileSize) + controlPoint1[1],(tilex * this.tileSize) + controlPoint2[0],(tiley * this.tileSize) + controlPoint2[1],(tilex * this.tileSize) + endPoint[0],(tiley * this.tileSize) + endPoint[1]);
				this.layer.stroke();
			this.layer.lineWidth(1);
		},
		
	displayHand: function (playerArray)
		{
			
			for (var i = 0; i<3;i++)
			{
				this.displayTile(this.playerList[this.activePlayer][i+3],((this.boardSize+2)/2)-1.75+(1.25*i),this.boardSize+1.5);
			}
		},
	displayPlayers : function()
		{
			for(var i=0; i<this.numberOfPlayer;i++)
			{
			
			this.layer.fillStyle(this.colorList[i]);
			var offset = this.offsetFromDoor(this.playerList[i][2]);
			
			this.layer.fillCircle((this.playerList[i][0]*this.tileSize)+offset[0],(this.playerList[i][1]*this.tileSize)+offset[1],5);
		
			}
		},
	shuffle : function(array)
	{
		for(var i=0; i<array.length*3;i++)
		{
		var j = Math.floor(Math.random()*64);
		var k = Math.floor(Math.random()*64);
		var temp = this.stack[j];
		this.stack[j] = this.stack[k];
		this.stack[k] = temp;
		}
	},
	offsetFromDoor : function(door)
	{
		offsetX = 0;
		offsetY = 0;
		switch (door)
		{
			case 0: offsetX = this.tileSize/3; break;
			case 1: offsetX = this.tileSize*2/3; break;
			case 2: offsetX = this.tileSize; offsetY = this.tileSize/3; break;
			case 3: offsetX = this.tileSize; offsetY = this.tileSize*2/3; break;
			case 4: offsetX = this.tileSize*2/3; offsetY = this.tileSize; break;
			case 5: offsetX = this.tileSize/3; offsetY = this.tileSize; break;
			case 6: offsetY = this.tileSize*2/3; break;
			case 7: offsetY = this.tileSize/3; break;
			default: break;
		}
		return [offsetX, offsetY];
	},
	rotateTile: function(tile, direction)
	{
		
		// les tuiles ont des tailles fixes
		for(var i=0; i<8; i++)
		{
			
			tile[i] = (8 + tile[i] + (direction*2)) %8;
			
		}
		
	},
	draw : function(playerNumber)
	{
		for (var i = 0; i<3;i++)
		{
			//format d'un joueur : [x,y,door,main1,main2,main3]
			
			if(this.playerList[playerNumber][i+3].length<1)
			{
				//this.playerList[playerNumber][i+3]=this.stack.pop;
				if (this.tempNumberOfTilesInStack>0)
				{
					this.tempNumberOfTilesInStack--;
					this.playerList[playerNumber][i+3] = this.stack[this.tempNumberOfTilesInStack];
				}
			}
		}
	}
	
	
	
});

var ENGINE = {};
	ENGINE.Game = {
		create: function() {
			mouseOverHand : 42
				/* this is called when the state is entered for the very first time */
				
			  },

		step: function(delta) {

			  },
		render: function(delta) 
		{
			this.app.layer.clear(this.app.colorList[this.app.activePlayer]);
			
			this.app.layer.drawImage(this.app.images.tsuro7,0,0,this.app.width,this.app.height);
			this.app.displayBoard();
			this.app.displayHand(this.app.playerList[this.app.activePlayer]);
			for(var i = 0; i<this.app.takenPoints.length; i++)
			{
				this.app.layer.fillStyle(this.app.colorList[i]);
				this.app.layer.fillCircle(this.app.takenPoints[i].x,this.app.takenPoints[i].y,5);
			}
			this.displayHoveredTileInHand();
			this.app.displayPlayers();
		},
		mousemove : function(data)
		{
			// vérifier si la souris est sur une des tuiles de la main
			
			if (data.y > (this.app.boardSize + 1.5)*this.app.tileSize && data.y < (this.app.boardSize+2.5)*this.app.tileSize)
			{
				//on est sur la bonne ligne
				if (data.x>(((this.app.boardSize+2)/2)-1.75)*this.app.tileSize && data.x <(((this.app.boardSize+2)/2)-0.75)*this.app.tileSize) this.mouseOverHand = 0;
				else if (data.x >(((this.app.boardSize+2)/2)-0.5)*this.app.tileSize && data.x <(((this.app.boardSize+2)/2)+0.5)*this.app.tileSize) this.mouseOverHand = 1;
				else if (data.x >(((this.app.boardSize+2)/2)+0.75)*this.app.tileSize && data.x <(((this.app.boardSize+2)/2)+1.75)*this.app.tileSize) this.mouseOverHand = 2;
				else  this.mouseOverHand = 42;
			}
		},
		mousedown : function(data)
		{
			//jouer la tuile survolee : TODO : ne pas entrer si la tuile n'existe pas
			var player = this.app.playerList[this.app.activePlayer];
			switch (this.mouseOverHand)
			{
					
				case 0: this.playTile(player[3], player[0], player[1] );this.drawNewTile(this.app.activePlayer, 0); this.changeActivePlayer(); break;
				case 1: this.playTile(player[4], player[0], player[1] );this.drawNewTile(this.app.activePlayer, 1); this.changeActivePlayer(); break;
				case 2: this.playTile(player[5], player[0], player[1] );this.drawNewTile(this.app.activePlayer, 2); this.changeActivePlayer(); break;
				default: break;
			}
		},
		keydown : function(data)
		{
			var direction = 0;
			if (data.key == "left")
			{
				direction = -1;
			}
			else if (data.key == "right")
			{
				direction = 1;
			}
			switch (this.mouseOverHand)
			{
					
				case 0: this.app.rotateTile(this.app.playerList[this.app.activePlayer][3], direction); break;
				case 1: this.app.rotateTile(this.app.playerList[this.app.activePlayer][4], direction); break;
				case 2: this.app.rotateTile(this.app.playerList[this.app.activePlayer][5], direction); break;
				default: break;
			}
		},
		displayHoveredTileInHand : function()
		{
			var player = this.app.playerList[this.app.activePlayer];
			switch (this.mouseOverHand)
			{
				case 0: this.app.displayTile(player[3], player[0], player[1] ); break;
				case 1: this.app.displayTile(player[4], player[0], player[1] ); break;
				case 2: this.app.displayTile(player[5], player[0], player[1] ); break;
				default: break;
			}
		},
		playTile : function(tile, tileX, tileY)
		{
			this.app.board[[tileX,tileY]] = tile;
			for (var i= 0; i<this.app.numberOfPlayer;i++)
			{
				this.followRoads(i);
			}
		},
		drawNewTile : function(playerIndex, tileToReplaceIndex)
		{
			
			this.app.playerList[playerIndex][3+tileToReplaceIndex] = [];
			this.app.draw(playerIndex);
		},
		followRoads : function(playerIndex)
		{
			
			if(this.isStillInGame(playerIndex))
			{
				var tileX = this.app.playerList[playerIndex][0];
				var tileY = this.app.playerList[playerIndex][1];
				if(this.app.board[[tileX,tileY]].length > 1)
				{
					// trouver la nouvelle porte, puis aller à cette porte, changer de tuile, recommencer
					var nextDoor = this.findNextDoor(this.app.board[[tileX,tileY]],this.app.playerList[playerIndex][2]);
					switch (nextDoor)
					{
						case 0:
						case 1:
							this.app.playerList[playerIndex][1]-= 1;
							this.app.playerList[playerIndex][2] = 5-nextDoor;
							break;
						case 2:
						case 3:
							this.app.playerList[playerIndex][0]+= 1;
							this.app.playerList[playerIndex][2] = 9-nextDoor;
							break;
						case 4:
						case 5:
							this.app.playerList[playerIndex][1]+= 1;
							this.app.playerList[playerIndex][2] = 5-nextDoor;
							break;
						case 6:
						case 7:
							this.app.playerList[playerIndex][0]-= 1;
							this.app.playerList[playerIndex][2] = 9-nextDoor;
							break;
					}
					this.followRoads(playerIndex);
				}
					
			}
		},
		isStillInGame : function(playerIndex)
		{	//return true si le joueur est encore en jeu
			return this.app.playerList[playerIndex][0] > 0 && this.app.playerList[playerIndex][0] < this.app.boardSize+1 && this.app.playerList[playerIndex][1] > 0 && this.app.playerList[playerIndex][1] < this.app.boardSize+1; 
		},
		findNextDoor : function(tile, initialDoor)
		{
			var doorIndex = 0; 
			var i = 0;
			while(i<8)
			{
				if(tile[i] == initialDoor)
				{
					doorIndex = i;
				}
				i++;
			}
			
			return tile[doorIndex+(Math.pow(-1,doorIndex%2))];
		},
		changeActivePlayer: function()
		{
			var i = 1;
			var j = 0;
			var nextActivePlayerFound = -1;
			while (i <= this.app.numberOfPlayer )
			{
				if(this.isStillInGame((this.app.activePlayer+i)%this.app.numberOfPlayer)&& nextActivePlayerFound == -1)
				{
					nextActivePlayerFound = (this.app.activePlayer+i) % this.app.numberOfPlayer;
					j++;
					
				}
				else if(this.isStillInGame((this.app.activePlayer+i)%this.app.numberOfPlayer))j++;
				i++;
				
			}
			//TODO : si quelqu'un a gagné, le mentionner:p
			this.app.activePlayer = nextActivePlayerFound;
			if (j > 1) {} 
			else if (j >0) this.declareWinner();
			else this.declareDraw();
			
		},
		declareWinner: function(indexOfPlayer)
		{
			console.log("win");
			this.app.setState(ENGINE.AWinnerIsYou);
		},
		declareDraw: function(indexOfPlayer)
		{
			console.log("draw");
			this.app.setState(ENGINE.Menu);
		}
		
			
			  
		
	};
	ENGINE.AWinnerIsYou ={
		create : function(){
			
		},
		render : function(){
			this.app.layer.clear(this.app.colorList[this.app.activePlayer]);
		},
		keydown: function()
		{
			this.app.setState(ENGINE.Menu);
		}
		
	}
	//TODO : faire plus joli, logique en ordre; TODO 2: gameOver --> fermer l'onglet; TODO 3: menu option
	ENGINE.Menu = {
		
		selectedMenu:  ["Start a new Game","Options","Credits", "Quitter"],
		menuIndex : 0,
		create: function(){
		},
		
		step : function(delta) {
			
		},
		render : function(delta) {
			
		this.app.layer.clear("#aaaaaa");
		
		this.app.layer.strokeStyle("#000000");
		this.app.layer.lineWidth(1);
		
		this.app.layer.fillStyle("#00ffff");
		this.app.layer.font("30px Arial");
		for (var i=0;i<this.selectedMenu.length;i++)
		{
			this.app.layer.fillText(this.selectedMenu[i],this.app.center.x - this.app.width/4, (this.app.height/5)*(i+1));
		}
		switch (this.menuIndex)
		{
			case 0:this.app.layer.strokeText(this.selectedMenu[this.menuIndex],this.app.center.x -this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1)); break;
			case 1:this.app.layer.strokeText(this.selectedMenu[this.menuIndex],this.app.center.x -this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1)); break;
			case 2:this.app.layer.strokeText(this.selectedMenu[this.menuIndex],this.app.center.x -this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1)); break;
			case 3:this.app.layer.strokeText(this.selectedMenu[this.menuIndex],this.app.center.x-this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1));break;
		}
		
		},
		
	keydown : function(data)
	{
		
		
		if (data.key == "down")
		{
			if(this.menuIndex != this.selectedMenu.length-1)
			{
				this.menuIndex++;
			}
			else
			{
				this.menuIndex = 0;
			}
		}
		else if (data.key == "up")
		{
			if(this.menuIndex != 0)
			{
				this.menuIndex--;
			}
			else
			{
				this.menuIndex = this.selectedMenu.length-1;
			}
		}
		else if (data.key == "enter")
		{
			switch (this.menuIndex)
			{
				case 0: this.app.setState(ENGINE.InitGame); break;
				case 1: this.app.setState(ENGINE.Options); break;
				case 2: this.app.setState(ENGINE.Credits); break;
				case 3: this.app.setState(ENGINE.Quit); break;
			}
		}
	}
		
	};
	
	//Initialise la partie. 
	ENGINE.InitGame = {
		freeStartingPoints :[],
		nearestFreeStartingPoint : {x :this.app.tileSize*4/3,y: this.app.tileSize, door:-1},

		create: function(){
			
			this.initStack();
	
			
			},
		enter: function(){
			this.freeStartingPoints = [];
			this.initFreeStartingPoints();
			
			this.app.tempNumberOfTilesInStack=this.app.stack.length;
			this.app.activePlayer = 0;
			this.initBoard();
			
			this.app.shuffle(this.app.stack);
			for (var i = 0; i<this.app.numberOfPlayer;i++)
			{
				
				this.app.playerList[i]=([-5,-5,-1,[],[],[]]);
			
				this.app.draw(i);
			}
			for (var i = this.app.numberOfPlayer; i<8;i++)
			{
				this.app.playerList[i] = []; // on met à vide les joueurs suivants.
			}
			
			
			
		},
		
		step : function(delta) {
			
		},
		render : function(delta) {
		this.app.layer.clear(this.app.colorList[this.app.activePlayer]);
		this.app.layer.drawImage(this.app.images.tsuro6,0,0,this.app.width,this.app.height);
		// tracé du plateau de jeu : TODO : placer ça dans une méthode à part
		this.app.displayBoard();
		//placer les emplacements où l'on peut se placer en début de partie

		this.displayFreeStartingPoints();
		this.displayNearestStartingPoint();
		this.app.displayPlayers();
		this.app.displayHand(this.app.playerList[this.app.activePlayer]);
		
		
				
		},
		initBoard : function()
		{
			for(var i = 1;i<=this.app.boardSize;i++)
			{
				for (var j = 1; j<=this.app.boardSize;j++)
				{
					this.app.board[[i,j]] = [];
				}
			}
		},
		initStack: function()
		{
			
	this.app.stack[0]	= [0,1,2,3,4,6,5,7];
	this.app.stack[1]	= [0,1,2,3,4,6,5,7];
	this.app.stack[2]	= [0,1,2,3,4,7,5,6];
	this.app.stack[3]	= [0,1,2,3,4,7,5,6];
	this.app.stack[4]	= [0,1,2,4,3,6,5,7];
	this.app.stack[5]	= [0,1,2,4,3,6,5,7];
	this.app.stack[6]	= [0,1,2,4,3,7,5,6];
	this.app.stack[7]	= [0,1,2,4,3,7,5,6];
	this.app.stack[8]	= [0,1,2,5,3,6,4,7];
	this.app.stack[9]	= [0,1,2,5,3,6,4,7];
	this.app.stack[10]	= [0,1,2,5,3,7,4,6];
	this.app.stack[11]	= [0,1,2,5,3,7,4,6];
	this.app.stack[12]	= [0,1,2,6,3,4,5,7];
	this.app.stack[13]	= [0,1,2,6,3,4,5,7];
	this.app.stack[14]	= [0,1,2,6,3,5,4,7];
	this.app.stack[15]	= [0,1,2,6,3,5,4,7];
	this.app.stack[16]	= [0,1,2,6,3,7,4,5];
	this.app.stack[17]	= [0,1,2,6,3,7,4,5];
	this.app.stack[18]	= [0,1,2,7,3,4,5,6];
	this.app.stack[19]	= [0,1,2,7,3,4,5,6];
	this.app.stack[20]	= [0,1,2,7,3,5,4,6];
	this.app.stack[21]	= [0,1,2,7,3,5,4,6];
	
	// tuiles ne contenant pas de demi tour, mais contenant un "virage cavalier" --> 0 -> 2
	this.app.stack[22]	= [0,2,1,3,4,6,5,7];
	this.app.stack[23]	= [0,2,1,3,4,6,5,7];
	this.app.stack[24]	= [0,2,1,3,4,7,5,6];
	this.app.stack[25]	= [0,2,1,3,4,7,5,6];
	this.app.stack[26]	= [0,2,1,4,3,6,5,7];
	this.app.stack[27]	= [0,2,1,4,3,6,5,7];
	this.app.stack[28]	= [0,2,1,4,3,7,5,6];
	this.app.stack[29]	= [0,2,1,4,3,7,5,6];
	this.app.stack[30]	= [0,2,1,5,3,6,4,7];
	this.app.stack[31]	= [0,2,1,5,3,6,4,7];
	this.app.stack[32]	= [0,2,1,5,3,7,4,6];
	this.app.stack[33]	= [0,2,1,5,3,7,4,6];
	this.app.stack[34]	= [0,2,1,6,3,4,5,7];
	this.app.stack[35]	= [0,2,1,6,3,4,5,7];
	this.app.stack[36]	= [0,2,1,6,3,5,4,7];
	this.app.stack[37]	= [0,2,1,6,3,5,4,7];
	this.app.stack[38]	= [0,2,1,7,3,4,5,6];
	this.app.stack[39]	= [0,2,1,7,3,4,5,6];
	this.app.stack[40]	= [0,2,1,7,3,5,4,6];
	this.app.stack[41]	= [0,2,1,7,3,5,4,6];
	// tuiles contenant des longs virages --> 0 -> 3
	this.app.stack[42]	= [0,3,1,2,4,7,5,6];
	this.app.stack[43]	= [0,3,1,2,4,7,5,6];
	this.app.stack[44]	= [0,3,1,4,2,6,5,7];
	this.app.stack[45]	= [0,3,1,4,2,6,5,7];
	this.app.stack[46]	= [0,3,1,4,2,7,5,6];
	this.app.stack[47]	= [0,3,1,4,2,7,5,6];
	this.app.stack[48]	= [0,3,1,5,2,6,4,7];
	this.app.stack[49]	= [0,3,1,5,2,6,4,7];
	// tuiles à squiggelli --> 0-> 4
	this.app.stack[50]	= [0,4,1,2,3,7,5,6];
	this.app.stack[51]	= [0,4,1,2,3,7,5,6];
	this.app.stack[52]	= [0,4,1,3,2,6,5,7];
	this.app.stack[53]	= [0,4,1,3,2,6,5,7];
	this.app.stack[54]	= [0,4,1,3,2,7,5,6];
	this.app.stack[55]	= [0,4,1,3,2,7,5,6];
	this.app.stack[56]	= [0,4,1,5,3,7,2,6];
	this.app.stack[57]	= [0,4,1,5,3,7,2,6];
	// tuiles uniques
	this.app.stack[58]	= [0,1,2,3,4,5,6,7];
	this.app.stack[59]	= [0,1,2,7,3,6,4,5];
	this.app.stack[60]	= [0,4,1,7,2,6,3,5];
	this.app.stack[61]	= [0,4,1,5,2,6,3,7];
	this.app.stack[62]	= [0,5,1,4,2,7,3,6];
	this.app.stack[63]	= [0,7,1,2,3,4,5,6];
	
		},
		
	mousemove :function(data)
	{
		if(this.isInABorderTile(data.x,data.y))
		{
			this.findNearestPoint(data.x, data.y);
		}
		
	},
	
	mousedown: function(data)
	{
		if(this.isInABorderTile(data.x,data.y))
		{
		var isItfree = true;
		var i = 0;
		while(isItfree == true && i < this.app.numberOfPlayer)
		{
				isItfree = this.nearestFreeStartingPoint.x != this.app.playerList[i][0] || this.nearestFreeStartingPoint.y != this.app.playerList[i][1] || this.nearestFreeStartingPoint.door != this.app.playerList[i][2];
				i++;
		}
		if (isItfree)
		{
		this.app.playerList[this.app.activePlayer][0] = this.nearestFreeStartingPoint.x;
		this.app.playerList[this.app.activePlayer][1] = this.nearestFreeStartingPoint.y;
		this.app.playerList[this.app.activePlayer][2] = this.nearestFreeStartingPoint.door;
		
		this.app.activePlayer = (this.app.activePlayer+1 )%this.app.numberOfPlayer;
		}
		
		if(this.app.activePlayer==0)
		{
			this.app.setState(ENGINE.Game);
		}
		
		}
	},
	initFreeStartingPoints: function()
	{
		for (var i= 0;i<2;i++)
			{
				for(var j=1; j<=this.app.boardSize;j++)
				{
					//TODO : transformer ça en tilex,tiley,door --> pour responsive Design
					// points de départ horizonzaux
					this.freeStartingPoints.push({x: j, y: ((this.app.boardSize-1)*i )+1, door:0+(4*i)});
					this.freeStartingPoints.push({x: j, y: ((this.app.boardSize-1)*i )+1, door:1+(4*i)});
					//points de départ verticaux
					this.freeStartingPoints.push({x: ((this.app.boardSize-1)*i )+1, y: j, door:7-(5*i)});
					this.freeStartingPoints.push({x: ((this.app.boardSize-1)*i )+1, y: j, door:6-(3*i)});
				}
			}
	},
	displayFreeStartingPoints: function()
	{
		for(var i = 0; i<this.freeStartingPoints.length;i++)
		{
			var offsetFromDoor = this.app.offsetFromDoor(this.freeStartingPoints[i].door)
			this.app.layer.fillCircle((this.freeStartingPoints[i].x*this.app.tileSize)+offsetFromDoor[0],(this.freeStartingPoints[i].y*this.app.tileSize)+offsetFromDoor[1],5);
			this.app.layer.strokeCircle((this.freeStartingPoints[i].x*this.app.tileSize)+offsetFromDoor[0],(this.freeStartingPoints[i].y*this.app.tileSize)+offsetFromDoor[1],5);
		}
	},
	findNearestPoint : function(x,y)
	{
	//ASSERTION : nous avons vérifié que nous sommes sur un bord en entrant ici
		var tilex = Math.floor(x/this.app.tileSize);
		var tiley = Math.floor(y/this.app.tileSize);
		var tileDoor = 0;
			//tuile sur le bord vertical, ou un coin
			if (tilex <2 || tilex>this.app.boardSize-1)
			{
				//verifier si c'est un coin
				if(tiley<2 || tiley>this.app.boardSize-1)
				{
					
					
					this.nearestPointInCorner(tilex,tiley,x%this.app.tileSize,y%this.app.tileSize);
				}
				else // sinon : bord vertical simple 
				{
					tileDoor = tilex==1 ? 7-this.treshold(y%this.app.tileSize) : 2+this.treshold(y%this.app.tileSize);
					this.nearestFreeStartingPoint = {x : tilex, y: tiley, door: tileDoor};
				}
				
					
			}
			else if (tiley<2 ||tiley > this.app.boardSize-1)
			{
					tileDoor = tiley==1 ? this.treshold(x%this.app.tileSize) : 5-this.treshold(x%this.app.tileSize);
					this.nearestFreeStartingPoint = {x : tilex, y: tiley, door: tileDoor};
			}	
		
			
		},
		
		isInABorderTile: function(x,y)
	{
		return (x>=this.app.tileSize && y>=this.app.tileSize && x<(this.app.boardSize+1)*this.app.tileSize && y<(this.app.boardSize+1)*this.app.tileSize) && (x<(2 * this.app.tileSize)||x>this.app.boardSize*this.app.tileSize||y>this.app.boardSize*this.app.tileSize||y<(2 * this.app.tileSize));
	},
	
	treshold : function(x)
	{
		
		var door = x < ( this.app.tileSize/2) ? 0 : 1;
		
		return door;
	},
	nearestPointInCorner: function (tilex,tiley, posxInTile,posyInTile)
	{
		
		var door = 0;
		
		if(tilex==1 && tiley==1)
		{
			door = posxInTile > posyInTile ? this.treshold(posxInTile) : 7-this.treshold(posyInTile);
		}
		else if(tilex == 1 && tiley == this.app.boardSize)
		{
			door = posxInTile > this.app.tileSize-posyInTile ? 5-this.treshold(posxInTile) : 7-this.treshold(posyInTile);
		}
		else if(tiley == 1 && tilex == this.app.boardSize)
		{
			door = posxInTile < this.app.tileSize-posyInTile ? this.treshold(posxInTile) : 2+this.treshold(posyInTile);
		}
		else
		{
			door = posxInTile < posyInTile ? 5-this.treshold(posxInTile) : 2+this.treshold(posyInTile);			
		}
		
		this.nearestFreeStartingPoint = {x:tilex, y:tiley, door:door}
	},
	displayNearestStartingPoint: function()
	{
		this.app.layer.fillStyle("#ff5566");
		var offsets = this.app.offsetFromDoor(this.nearestFreeStartingPoint.door);
		this.app.layer.fillCircle((this.nearestFreeStartingPoint.x*this.app.tileSize)+offsets[0], (this.nearestFreeStartingPoint.y* this.app.tileSize)+offsets[1], 5);
	}
	
	},
	
	
	ENGINE.Credits ={
		create: function(){
		},
		
		step : function(delta) {
			
		},
		render : function(delta) {
			/*
				LOGO HE-ARC
				Developing Team : 
				Martin Kunzi
				Mathieu Bandelier
				Nicolas Gonin
				images
				swandog @deviantArt
				(link)
				ohnios @deviantArt
				(link)
			*/
			
		},
		step : function(dt){
			
		},
		keydown : function(data){
			this.app.setState(ENGINE.Menu);
		},
		mousedown : function (data){
			this.app.setState(ENGINE.Menu);
		}
	};
	//TODO : RENDER THIS MORE PRETTY
	ENGINE.Options ={
		selectedMenu : ["Controles","Taille du Plateau","Nombre de Joueurs","Retour"],
		menuIndex : 0,
		create: function(){
		
		},
		
		step : function(delta) {
			
		},
		render : function(delta) {
			
			this.app.layer.clear("#aaaaaa");
		
		this.app.layer.strokeStyle("#000000");
		this.app.layer.lineWidth(1);
		
		this.app.layer.fillStyle("#00ffff");
		this.app.layer.font("30px Arial");
		for (var i=0;i<this.selectedMenu.length;i++)
		{
			this.app.layer.fillText(this.selectedMenu[i],this.app.center.x - this.app.width/4, (this.app.height/5)*(i+1));
		}
		this.app.layer.fillStyle("#bbbb44");
		switch (this.menuIndex)
		{
			case 0: this.app.layer.fillText(this.selectedMenu[this.menuIndex],this.app.center.x -this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1));
			this.app.layer.strokeText(this.selectedMenu[this.menuIndex],this.app.center.x -this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1)); break;
			case 1:this.app.layer.fillText(this.selectedMenu[this.menuIndex]+ " : " +this.app.boardSize,this.app.center.x -this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1));
			this.app.layer.strokeText(this.selectedMenu[this.menuIndex]+ " : " +this.app.boardSize,this.app.center.x -this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1)); break;
			case 2: this.app.layer.fillText(this.selectedMenu[this.menuIndex]+ " : " +this.app.numberOfPlayer,this.app.center.x -this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1));
			this.app.layer.strokeText(this.selectedMenu[this.menuIndex]+ " : " +this.app.numberOfPlayer,this.app.center.x -this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1)); break;
			case 3:this.app.layer.fillText(this.selectedMenu[this.menuIndex],this.app.center.x-this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1));
			this.app.layer.strokeText(this.selectedMenu[this.menuIndex],this.app.center.x-this.app.width/4, (this.app.height/(this.selectedMenu.length+1))*(this.menuIndex+1));break;
		}
			
		},
		keydown : function(data){
			if(data.key == "up")
			{
				this.menuIndex = (this.menuIndex -1+this.selectedMenu.length)%this.selectedMenu.length;
			}
			else if(data.key =="down")
			{
				this.menuIndex = (this.menuIndex +1)%this.selectedMenu.length;
			}
			else if (data.key == "right")
			{
				if (this.selectedMenu[this.menuIndex]=="Taille du Plateau" && this.app.boardSize < 7)
				{
					this.app.boardSize++;
				}
				else if (this.selectedMenu[this.menuIndex] =="Nombre de Joueurs" && this.app.numberOfPlayer < 8)
				{
					this.app.numberOfPlayer++;
				}
			}
			else if (data.key == "left")
			{
				if (this.selectedMenu[this.menuIndex]=="Taille du Plateau" && this.app.boardSize > 6)
				{
					this.app.boardSize--;
				}
				else if (this.selectedMenu[this.menuIndex] =="Nombre de Joueurs" && this.app.numberOfPlayer >2)
				{
					this.app.numberOfPlayer--; 
				}
			}
			else if (data.key == "enter")
			{
				if (this.selectedMenu[this.menuIndex] =="Retour")
				{
					this.app.setState(ENGINE.Menu); 
				}
				else if(this.selectedMenu[this.menuIndex] == "Controles")
				{
					this.app.setState(ENGINE.ConfigTouches);
				}
			}
		}
	};
	ENGINE.ConfigTouches={
		//TODO eventually
	}
	ENGINE.Quit ={
		create: function(){
			
		},
		
		step : function(delta) {
			
		},
		render : function(delta) {
			
			this.app.layer.clear("#000000");
			this.app.layer.fillStyle("#ffffff");
			this.app.layer.fillText("GAME OVER", this.app.tileSize*5/3, this.app.tileSize*5/3);
			
		}
	},
	
	/*
		QU'est ce qui est côté serveur ?
		la pioche, les mains, le plateau
	*/
	//clone de engine.initgame, pour l'hote d'une partie en réseau
	ENGINE.Host={
		
	},
	//initGame pour une partie en réseau sans être l'hote
	ENGINE.Client={
		
	},
	// choisir les emplacements de départs en réseau
	ENGINE.OnlineBeginPosition={
		
	},
	//clone de game pour les parties en réseau
	ENGINE.OnlineGame={
		
	};
