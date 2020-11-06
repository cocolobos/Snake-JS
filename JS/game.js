var canvas = null;
    ctx = null;
    player = null;
    lastPress = null;
    food = null;
    pause = true;
    dir = 0;
    score = 0;
//Valores teclas
var keyLeft = 37;
    keyUp = 38;
    keyRight = 39;
    keyDown = 40;
    keyEnter = 13;

window.requestAnimationFrame = (function(){
    return window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback){
            window.setTimeout(callback,17);
        };
}());
document.addEventListener('keydown', function (evt){
    lastPress = evt.which;
}, false);
function paint (ctx){
    //clean Canvas
    ctx.fillStyle='#000';
    ctx.fillRect (0, 0, canvas.width, canvas.height);
    //draw player
    ctx.fillStyle = '#0f0';
    player.fill(ctx);
    //draw food
    ctx.fillStyle = '#f00';
    food.fill(ctx)
    //last key pressed
    ctx.fillStyle = '#fff';
    //ctx.fillText('Las Press: '+lastPress, 0, 20);
    //draw score
    ctx.fillText('Score: '+score, 0,10);
    // pause
    if (pause){
        ctx.textAlign = 'center';
        ctx.fillText('PAUSE', 150, 75);
        ctx.textAlign = 'left';
    }
}
function act(){
    if(!pause){
        //Change Direction
        if (lastPress == keyUp){
            dir = 0;
        }
        if (lastPress == keyRight){
            dir = 1;
        }
        if (lastPress == keyDown){
            dir = 2;
        }
        if (lastPress == keyLeft){
            dir = 3;
        }
        //Snake Movement
        if (dir == 0){
            player.y -= 10;
        }
        if (dir == 1){
            player.x += 10;
        }
        if (dir == 2){
            player.y += 10;
        }
        if (dir == 3){
            player.x -= 10;
        }
        //Snake OUT SCREEN
        if ( player.x > canvas.width){
            player.x = 0;
        }
        if ( player.y > canvas.height){
            player.y = 0;
        }
        if ( player.x < 0){
            player.x = canvas.width;
        }
        if ( player.y < 0){
            player.y = canvas.height;
        }
        //Food Intersects
        if(player.intersects(food)){
            score += 1;
            food.x = random(canvas.width / 10-1) * 10;
            food.y = random(canvas.height / 10 -1) * 10;
        }
    }
    if(lastPress == keyEnter){
        pause = !pause;
        lastPress = null;
    }
}
function repaint (){
    window.requestAnimationFrame (repaint);
    paint(ctx);
}
function run(){
    setTimeout(run, 50);
    act();
}
function init (){
    canvas= document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    player = new Rectangle(40, 40, 10, 10);
    food = new Rectangle(80, 80, 10, 10);
    run();
    repaint();
}
//Rectangle
function Rectangle(x, y, width, height){
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;
    this.intersects = function (rect){
        if(rect == null){
            window.console.warn('Missing parameters on function intersects');
        }
        else{
            return (this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y < rect.y + rect.height && this.y + this.height > rect.y);
        }
    };
    this.fill = function (ctx){
        if ( ctx == null){
            window.console.warn ('Missing parameter on function fill');
        }
        else{
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}
function random (max){
    return Math.floor(Math.random() * max);
}
window.addEventListener('load', init, false);
