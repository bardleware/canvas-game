var link;
var slimeEnme;
var bgModifierX= 1280;

function Sprite(img, x, y, width, height){
  this.img = img;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Sprite.prototype.draw = function(context, x, y){
  context.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
}

function initSprites(img){
  //link = new Sprite(img, 105, 0, 45, 55);
  nolan = [
    new Sprite(img, 1280, 245, 73, 91),
    new Sprite(img, 1353, 245, 73, 91),
    new Sprite(img, 1426, 245, 73, 91)
  ];
  slimeEnme = new Sprite(img, 1280, 0, 48, 147);

  backgroundSprite = new Sprite(img, 400, 100, 700, 500);
  foregroundSprite = new Sprite(img, 0, 720, 350, 60);

}
// if (windowWidth < 500) {
//         gameWidth = width = 320;
//         height = 430;
//     }
//     else {
//         gameWidth = width = 700;
//         height = 500;
//         inputEvent = "mousedown";
//     }


// class Octorok {
//     constructor() {
//         this.x = 400;
//         this.y = 300; //+ Math.floor(Math.random()*50);
//         this.frame = 0;
//         this.animation = [0, 1, 2, 1];
//         this.rotation = 0;
//         this.width = octorokSprite[0].width;
//         this.height = octorokSprite[0].height;

//         this.detectCollision = function () {
//             if (this.x <= (hero.x + hero.width - 3) && this.x >= hero.x && (this.height + 153) <= (hero.y + hero.height)) {
//                 console.log("You're dead");
//                 currentState = states.Splash;
//             }
//         }

//         this.draw = function () {
//             var h = this.animation[this.frame];


//             octorokSprite[h].draw(renderingContext, this.x, this.y);
//         }
//     }
// }