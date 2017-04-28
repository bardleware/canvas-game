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
        if (frames % 123 === 0) {
            this.add();
        }

        for (var i = 0, len = this.collection.length; i < len; i++) {
            var slime = this.collection[i];

            if (i === 0) {
                slime.detectCollision();
            }

            slime.x -= 2;
            if (slime.x < -slime.width) {
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
    this.y = 300 + Math.floor(Math.random() * 33);
    this.frame = 15;
    this.rotation = 0;
    this.width = slimeEnme.width;
    this.height = slimeEnme.height;

    this.detectCollision = function () {
        //console.log(this.x + "-the player is at : " + (thehero.x + thehero.width));
        console.log(thehero.y);
        if (this.x <= (thehero.x + thehero.width) && this.x >= thehero.x && thehero.y >= 135) {

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

    this.gravity = 0.25;
    this._jump = 6;
    this.jumpcount = 3;

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

        if (currentState === states.Splash) {
            this.updateIdleHero();
        }
        else {
            this.updatePlayingHero();
        }

    }

    this.updateIdleHero = function () {
        //this.y = 250;
    }

    this.updatePlayingHero = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // check to see if hit the ground and stay there
        if (this.y >= groundLevel) {
            //console.log("hit ground");
            this.y = groundLevel;
            this.jumpcount = 2;
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
    document.body.appendChild(canvas);

    loadGraphics();
    thehero = new Hero();
    sgroup = new SlimeGroup();
}

function windowSetup() {
    var inputEvent = "touchstart";
    var windowWidth = $(window).width();
    console.log(windowWidth);
    if (windowWidth < 500) {
        gameWidth = width = 320;
        height = 430;
    }
    else {
        gameWidth = width = 700;
        height = 500;
        inputEvent = "mousedown";
    }

    document.addEventListener(inputEvent, onpress);
}

function onpress(evt) {
    //console.log("click happened");

    switch (currentState) {
        case states.Splash:
            currentState = states.Game;
            foreGroundMove = 3;
            break;
        case states.Game:
            thehero.jump();
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
    img.src = "SpriteSheet.png";
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
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width*2, 451);
}