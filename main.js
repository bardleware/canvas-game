var currentState,
  width,
  height,
  frames = 0,
  sgroup,
  slimeEnme,
  gameWidth,
  foregroundPosition = backgroundPosition = 0,
  foreGroundMove = 2,
  thehero;
var groundLevel = 180;
var score = 0;
var highScore = 0;
var g_jumpcount = 4;
var states = {
  Splash: 0,
  Game: 1,
  Score: 2
};
var canvas;
var renderingContext;

function SlimeGroup() {
  this.collection = [];

  this.reset = function () {
    this.collection = [];
  }

  this.add = function () {
    this.collection.push(new Slime());
  }

  this.update = function () {
    if (frames % 150 === 0) {
      this.add();
    }

    for (var i = 0, len = this.collection.length; i < len; i++) {
      var slime = this.collection[i];

      if (i === 0 ) {
        slime.detectCollision();
      }

      slime.x -= 3;
      if (slime.x < -slime.width) {
        score += 1;
        this.collection.splice(i, 1);
        i--;
        len--;
      }
    }
  }

  this.draw = function () {
    for (var i = 0, len = this.collection.length; i < len; i++) {
      var slime = this.collection[i];
      slime.draw();
    }
  }
}

function Slime() {
  this.x = gameWidth;
  this.y = 350 + Math.floor(Math.random() * 20);
  this.frame = 15;
  this.rotation = 0;
  this.width = slimeEnme.width;
  this.height = slimeEnme.height;

  this.detectCollision = function () {

    if (this.x <= (thehero.x + (thehero.width - 5) + (this.width - 10)) && this.x >= thehero.x && thehero.y - 10 >= 140) {

      //console.log("you're dead");
      currentState = states.Score;
    }
  }

  this.draw = function () {
    slimeEnme.draw(renderingContext, this.x, this.y);
  }
}

function Hero() {
  this.x = 60;
  this.y = groundLevel;
  this.width = 45;
  this.height = 55;

  this.frame = 0;
  this.velocity = 0;
  this.animation = [0, 1, 2, 1];

  this.rotation = 0;
  this.radius = 12;

  this.gravity = 0.10;
  this._jump = 2;
  this.jumpcount = g_jumpcount;

  this.jump = function () {
    if (this.jumpcount > 0) {
      this.velocity = -this._jump;
      this.jumpcount--;
    }
  }

  this.update = function () {
    var h = currentState === states.Splash ? 10 : 5;
    //console.log(h + "hero h rate");
    this.frame += frames % h === 0 ? 1 : 0;
    this.frame %= this.animation.length;
    //console.log(this.frame);

    if (currentState === states.Splash || currentState === states.Score) {
      this.updateIdleHero();
    }
    else {
      this.updatePlayingHero();
    }

  }

  this.updateIdleHero = function () {
    this.y = 250;
  }

  this.updatePlayingHero = function () {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // check to see if hit the ground and stay there
    if (this.y >= groundLevel) {
      //console.log("hit ground");
      this.y = groundLevel;
      this.jumpcount = g_jumpcount;
      this.velocity = this._jump;
    }

  }

  this.draw = function (renderingContext) {
    renderingContext.save();

    renderingContext.translate(this.x, this.y);
    renderingContext.rotate(this.rotation);

    var f = this.animation[this.frame];
    nolan[f].draw(renderingContext, 20, this.y);
    console.log(this.y);

    renderingContext.restore();
  }
}


function main() {
  windowSetup();
  canvasSetup();
  currentState = states.Splash;
  document.getElementById("wrapper").appendChild(canvas);
  if (localStorage.highScore) {
    highScore = localStorage.highScore;
  }


  loadGraphics();
  thehero = new Hero();
  sgroup = new SlimeGroup();
}

function windowSetup() {

  gameWidth = width = 700;
  height = 500;
  inputEvent = "mousedown";

  document.addEventListener(inputEvent, onpress);
}

function onpress(evt) {

  switch (currentState) {
    case states.Splash:
      currentState = states.Game;
      foreGroundMove = 3;
      break;
    case states.Game:
      thehero.jump();
      break;
    case states.Score:
      sgroup.reset();
      if (score > highScore) {
        highScore = score;
        localStorage.highScore = score;
      }
      score = 0;
      currentState = states.Splash;
      break;

  }
}

function canvasSetup() {
  canvas = document.createElement("canvas");
  canvas.style.border = "3px solid black";
  canvas.width = width;
  canvas.height = height;
  renderingContext = canvas.getContext("2d");
}

function loadGraphics() {
  var img = new Image();
  img.src = "https://s3-us-west-2.amazonaws.com/bardleware1/SpriteSheet.png";
  img.onload = function () {
    initSprites(img);
    renderingContext.fillStyle = "#cccccc";


    //link[0].draw(renderingContext, 100, 100);
    gameLoop();
  };


}

function gameLoop() {
  update();
  render();
  window.requestAnimationFrame(gameLoop);
}

function update() {
  frames++;

  if (currentState !== states.Score) {
    backgroundPosition = (backgroundPosition - 1) % 700;
    foregroundPosition = (foregroundPosition - foreGroundMove) % 350; // Move left two px each frame. Wrap every 14px.
  }

  if (currentState === states.Game) {
    sgroup.update();
  }
  thehero.update();
}

function render() {
  renderingContext.fillRect(0, 0, width, height);
  backgroundSprite.draw(renderingContext, backgroundPosition, 0);
  backgroundSprite.draw(renderingContext, backgroundPosition + backgroundSprite.width, 0);
  sgroup.draw(renderingContext);
  thehero.draw(renderingContext);

  foregroundSprite.draw(renderingContext, foregroundPosition, 451);
  foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, 451);
  foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width * 2, 451);

  if (currentState === states.Splash) {
    renderingContext.font = "90px Fascinate";
    renderingContext.fillStyle = "#00e0a5";
    renderingContext.textAlign = "center";
    renderingContext.fillText("Space Runner", canvas.width / 2, 100);
    if (highScore) {
      renderingContext.font = "30px Fascinate";
      renderingContext.fillStyle = "#00e0a5";
      renderingContext.textAlign = "center";
      renderingContext.fillText("High Score: " + highScore, canvas.width / 2, 160);

    }

    renderingContext.font = "30px Fascinate";
    renderingContext.fillStyle = "#0e0317";
    renderingContext.textAlign = "center";
    renderingContext.fillText("click to start", canvas.width / 2, canvas.height / 2);
  }

  if (currentState === states.Game) {
    renderingContext.font = "25px Fascinate";
    renderingContext.fillStyle = "#00e0a5";
    renderingContext.textAlign = "left";
    renderingContext.fillText("High Score: " + highScore, 20, 30);
    renderingContext.fillText("Score: " + score, 20, 60);

    if (score < 1) {
      renderingContext.font = "50px Fascinate";
      renderingContext.fillStyle = "#0e0317";
      renderingContext.textAlign = "center";
      renderingContext.fillText("Go!", canvas.width / 2, canvas.height / 2);
    }

  }

  if (currentState === states.Score) {
    renderingContext.font = "50px Fascinate";
    renderingContext.fillStyle = "#f86100";
    renderingContext.textAlign = "center";
    renderingContext.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);


  }
}

