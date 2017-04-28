var link;
var slimeEnme;

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
    new Sprite(img, 0, 245, 73, 91),
    new Sprite(img, 73, 245, 73, 91),
    new Sprite(img, 146, 245, 73, 91)
  ];
  slimeEnme = [
    new Sprite(img, 0, 47, 50, 27),
    new Sprite(img, 0, 97, 51, 25),
  ]

}