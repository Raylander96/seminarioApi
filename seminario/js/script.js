window.onload = function () {
	//Constantes que armazenam o código de cada seta do teclado
	var SPACE = 32; LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	var floorHeight = 0;
	var time = 0;
	var counter = 1;
	var cnv = document.querySelector("canvas");

	var ctx = cnv.getContext("2d");

	var spriteSheet = new Image();
	var spriteSheetCoin = new Image();
	spriteSheet.src = "img/character.png";
	spriteSheetCoin.src = "img/coin.png";
	var background = new Image();
	background.src = "img/BG.png"
	var zezim = new Sprite(spriteSheet);
	var coin = [];



	coin.push(new Coin(spriteSheetCoin, cnv.width, counter))

	coin.forEach(function (item, indice, array) {
		console.log(item, indice);
	});
	var maxWidth = cnv.width - zezim.width;
	var minWidth = 0;




	window.addEventListener("keydown", keydownHandler, false);
	window.addEventListener("keyup", keyupHandler, false);

	function keydownHandler(e) {
		switch (e.keyCode) {
			case RIGHT:
				zezim.mvLastRight = true;
				zezim.mvRight = true;
				zezim.mvLeft = false;
				zezim.mvUp = false;
				zezim.mvDown = false;

				break;
			case LEFT:
				zezim.mvLastRight = false;
				zezim.mvRight = false;
				zezim.mvLeft = true;
				zezim.mvUp = false;
				zezim.mvDown = false;

				break;
			case UP:
				zezim.mvRight = false;
				zezim.mvLeft = false;
				zezim.mvUp = true;
				zezim.mvDown = false;
				break;
			case DOWN:
				zezim.mvRight = false;
				zezim.mvLeft = false;
				zezim.mvUp = false;
				zezim.mvDown = true;
				break;
			case SPACE:
				zezim.mvRight = false;
				zezim.mvLeft = false;
				zezim.mvUp = false;
				zezim.mvDown = false;
				zezim.atack = true;
				break;

		}

	}

	function keyupHandler(e) {
		switch (e.keyCode) {
			case RIGHT:
				zezim.mvRight = false;
				break;
			case LEFT:
				zezim.mvLeft = false;
				break;
			case UP:
				zezim.mvUp = false;
				break;
			case DOWN:
				zezim.mvDown = false;
				break;
			case SPACE:
				zezim.atack = false;
				break;
		}
	}

	function gamePadHandler(){
		var gp = navigator.getGamepads()[0];
		if (gp) {
			console.log(gp);
			if (gp.axes[0] > 0.001) {
				zezim.mvLastRight = true;
				zezim.mvRight = true;
				zezim.mvLeft = false;
				zezim.mvUp = false;
				zezim.mvDown = false;
			} else if (gp.axes[0] < -0.001) {
				zezim.mvLastRight = false;
				zezim.mvRight = false;
				zezim.mvLeft = true;
				zezim.mvUp = false;
				zezim.mvDown = false;
			} else {
				zezim.mvLastRight = false;
				zezim.mvRight = false;
				zezim.mvLeft = false;
				zezim.mvUp = false;
				zezim.mvDown = false;
			}

			console.log(gp.buttons[2].pressed)
			

		}
		if(gp){
			if (gp.buttons[2].pressed) {
				zezim.atack = true;
			} else {
				zezim.atack = false;
			}
		}
	}

	//Quano a imagem é carregada, o programa é iniciado
	spriteSheet.onload = function () {
		init();
		zezim.posX = (cnv.width - zezim.width) / 2; // personagem nasce no meio da tela
		zezim.posY = cnv.height - zezim.height;

		coin.forEach(function (item, indice, array) {
			item.posX = Math.floor(((Math.random() * (cnv.width - item.width)) + item.width));
			item.posY = Math.floor(((Math.random() * -60)) - 20);
		});
	}

	function init() {
		loop();
	}

	function update() {
		var gp = navigator.getGamepads()[0];
		zezim.move(minWidth, maxWidth, time, floorHeight);
		coin.forEach(function (item, indice, array) {
			item.move();
			//Colisao
			if ((item.posY) <= zezim.posY + zezim.height && zezim.posY <= (item.posY + item.height)) {
				if ((item.posX) <= zezim.posX + zezim.width && zezim.posX <= (item.posX + item.width)) {
					item.posY = -100;
					if (counter < 10) {
						navigator.vibrate([500]);
						if (gp)
							if (gp.vibrationActuator) {
								gp.vibrationActuator.playEffect("dual-rumble", {
									duration: 1000,
									strongMagnitude: 1.0,
									weakMagnitude: 1.0
								});
							}

						coin.push(new Coin(spriteSheetCoin, cnv.width, counter));
						//Colisao
					}
					counter++;
				}
			}		
			// passar da tela
			if (item.posY > cnv.height) {
				item.posY = -100;
			}
		});
	}

	function draw() {

		ctx.clearRect(0, 0, cnv.width, cnv.height);
		ctx.drawImage(background, //Imagem de origem
			//Captura da imagem
			0, //Origem da captura no eixo X
			0, //Origem da captura no eixo Y
			2000, //Largura da imagem que será capturada
			1143, //Altura da imagem que será capturada
			//Exibição da imagem
			0, //Posição no eixo X onde a imagem será exibida 
			0, //Posição no eixo Y onde a imagem será exibida 
			cnv.width, //Largura da imagem a ser exibida 
			cnv.height //Altura da imagem a ser exibida 
		);
		coin.forEach(function (item, indice, array) {
			item.draw(ctx);
		});
		zezim.draw(ctx);


	}

	function loop() {
		var gp = navigator.getGamepads()[0];
		window, requestAnimationFrame(loop, cnv);
		time += 1;
		gamePadHandler();
		update();
		draw();
	}
}
