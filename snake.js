$(document).ready(function() {
	var snakeDimension = 30;
	var snake;
	var foodPositionX;
	var foodPositionY;
	var score;
	var snakeSpeed;
	var canvas;
	var canvasContext;
	var loserScreen;
	var snakeDirection;
	var nextSnakeDirection;
	var moveInverval;

	function init() {
		snake = [{
			x: 5,
			y: 6,
		}, {
			x: 4,
			y: 6,
		}, {
			x: 3,
			y: 6,
		}]

		foodPositionX = randomFood(20);;
		foodPositionY = randomFood(15);;
		snake[0].x = 5;
		snake[0].y = 6;
		snakeSpeed = 300;
		score = 0;
		loserScreen = false;
		snakeDirection = "RIGHT";
		nextSnakeDirection = "RIGHT";

		tick()
	}


	function onClick(event) {
		if(loserScreen) {
			init()
		}
	}

	function tick () {
		if (moveInverval) {
			clearInterval(moveInverval)
		}
		moveInverval = setInterval(function() {
			moveEverything();
		}, snakeSpeed);
	}

	window.onload = function () {
		canvas = document.getElementById("myCanvas");
		canvasContext = canvas.getContext("2d");
		canvas.addEventListener('mousedown', onClick);
		const framesPerSecond = 30;
		init()
		setInterval( function() {
			drawEverything();
		}, 1000 / framesPerSecond);
	}

	document.addEventListener('keydown', function(event){
		// LEFT
		if (event.keyCode == 37) {
			nextSnakeDirection = "LEFT";
		// RIGHT
		} else if (event.keyCode === 39) {
			nextSnakeDirection = "RIGHT";
		// DOWN
		} else if (event.keyCode === 40) {
			nextSnakeDirection = "DOWN";
		// UP
		} else if (event.keyCode === 38) {
			nextSnakeDirection = "UP";
		}
	})

	function moveEverything () {
		if(loserScreen){
			return;
		} else {

			const directions = {
				"UP": {
					x: 0,
					y: -1,
					excludedBy: "DOWN",
				},
				"DOWN": {
					x: 0,
					y: 1,
					excludedBy: "UP",
				},
				"LEFT": {
					x: -1,
					y: 0,
					excludedBy: "RIGHT",
				},
				"RIGHT": {
					x: 1,
					y: 0,
					excludedBy: "LEFT",
				},
			}

			if (directions[nextSnakeDirection].excludedBy !== snakeDirection) {
				snakeDirection = nextSnakeDirection;
			}

			var snakeDirectionX = directions[snakeDirection].x;
			var snakeDirectionY = directions[snakeDirection].y;

			var newHead = {
				x: snake[0].x + snakeDirectionX,
				y: snake[0].y + snakeDirectionY,
			}

			//var newHeadD = {
			//	x: snake[0].x + snakeDirectionX,
			//	y: snake[0].y + snakeDirectionY,
			//}
			snake.unshift(newHead);
			snake.pop();
			//collision with the edges
			if (
				snake[0].x + 1 > canvas.width / snakeDimension ||
				snake[0].x < 0 ||
				snake[0].y < 0 ||
				snake[0].y + 1 > canvas.height / snakeDimension
			){
			 	gameOver();
			}
			//collision with the food
			if(foodPositionX === snake[0].x && foodPositionY === snake[0].y) {
				snake.unshift({
					x: snake[0].x + snakeDirectionX,
					y: snake[0].y + snakeDirectionY,
				})

				foodPositionX = randomFood(20);
				foodPositionY = randomFood(15);
				snake.forEach(function (snakeSegment){
					if (
						foodPositionX === snakeSegment.x &&
						foodPositionY === snakeSegment.y
					) {
						foodPositionX = randomFood(20);
						foodPositionY = randomFood(15);
					}
				})

				//increasing the score and speed
				score++;
				snakeSpeed = snakeSpeed > 50 ? snakeSpeed - 10 : snakeSpeed;
				tick()
			}

			//collision with the snake itself
			snake.forEach(function(snakeSegment, index) {
				if (
					index !== 0 &&
					snake[0].x  === snakeSegment.x &&
					snake[0].y === snakeSegment.y
				) {
					gameOver();
					console.log("the game should be over");
				}
			});
		}
	}

	function gameOver() {
		loserScreen = true;
	}

	function randomFood(max) {
		return Math.floor(Math.random() * max);
	}

	function drawFood() {
		canvasContext.fillStyle = "red";
		canvasContext.beginPath();
		canvasContext.arc(foodPositionX * snakeDimension + snakeDimension / 2, foodPositionY * snakeDimension + snakeDimension / 2, snakeDimension / 2, 0, Math.PI * 2, true);
		canvasContext.fill();
	}

	function drawSnake() {
		//drawing the snake
		snake.forEach(function (snakeSegment) {
			if(snakeSegment === snake[0]){
				colorRect(snakeSegment.x * snakeDimension, snakeSegment.y * snakeDimension, snakeDimension, snakeDimension, "#FFFFFF");
			} else {
				colorRect(snakeSegment.x * snakeDimension, snakeSegment.y * snakeDimension, snakeDimension, snakeDimension, "#484848");
			}
		})
	}

	function drawEverything () {
		//drawing the canvas
		colorRect(0, 0, canvas.width, canvas.height, "#6B8E23");

		if(loserScreen) {
			canvasContext.font = "50px Arial";
			canvasContext.fillStyle = "white";
			var gameOverTextDimensions = canvasContext.measureText("Game Over");
			canvasContext.fillText("Game Over", canvas.width / 2 - gameOverTextDimensions.width / 2, canvas.height / 2 - 30);
			canvasContext.font = "30px Arial";
			var clickTextDimensions = canvasContext.measureText("Click anywhere to continue");
			canvasContext.fillText("Click anywhere to continue", canvas.width / 2 - clickTextDimensions.width / 2, canvas.height / 2 + 30);
			return;
		}

		drawSnake()
		drawFood()

		//drawing the score
		canvasContext.font = "20px Arial";
		canvasContext.fillStyle = "white";
		canvasContext.fillText(score, 50, 100);
	}

	function colorRect(leftX, topY, width, height, drawColor) {
		canvasContext.fillStyle = drawColor;
		canvasContext.fillRect(leftX, topY, width, height);
	}
});
