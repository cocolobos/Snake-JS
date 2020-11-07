/*jslint bitwise:true, es5: true */
(function (window, undefined) {
    'use stric';
    //Valores teclas
    var keyLeft = 37;
        keyUp = 38;
        keyRight = 39;
        keyDown = 40;
        keyEnter = 13;
    var canvas = null;
        ctx = null;
        lastPress = null;
        food = null;
        pause = true;
        gameover = true;
        dir = 0;
        score = 0;
    var wall = [];
    var body = [];
    var iSnake = new Image ();
    var iFood = new Image ();
    var aEat = new Audio ();
    var aDie = new Audio ();
    //New Variables
    var lastUpdate = 0,
        FPS = 0,
        frames = 0,
        acumDelta = 0;
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
        var i = 0;
        var l = 0;
        //clean Canvas
        ctx.fillStyle='#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //draw player
        ctx.strokeStyle = '#0f0';
        for ( i = 0, l = body.length; i < l; i += 1){
            body[i].drawImage(ctx, iSnake);
        }
        //draw walls
        ctx.fillStyle = '#999';
        for ( i = 0, l = wall.length; i < l; i += 1){
            wall[i].fill(ctx);
        }
        //draw food
        ctx.strokeStyle = '#f00';
        food.drawImage(ctx, iFood);
        //last key pressed
        ctx.fillStyle = '#fff';
        //draw score
        ctx.fillText('Score: '+score, 0,10);
        //draw fps
        ctx.fillText('FPS: ' + FPS, 10, 10);
        // pause
        if (pause){
            ctx.textAlign = 'center';
            if (gameover){
                ctx.fillText('GAME OVER', 150, 75);
            }else{
                ctx.fillText('PAUSE', 150, 75);
            }
            ctx.textAlign = 'left';
        }
    }
    function act(){
        var i = 0;
        var l = 0;
        if(!pause){
            if(gameover){
                reset();
            }
            //Move Body
            for (i = body.length - 1; i > 0; i -= 1){
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            }
            //Change Direction
            if (lastPress === keyUp && dir != 2){
                dir = 0;
            }
            if (lastPress === keyRight && dir != 3){
                dir = 1;
            }
            if (lastPress === keyDown && dir != 0){
                dir = 2;
            }
            if (lastPress === keyLeft && dir != 1){
                dir = 3;
            }
            //Move Head
            if(dir === 0){
                body[0].y -= 10;
            }
            if(dir === 1){
                body[0].x += 10;
            }
            if(dir === 2){
                body[0].y += 10;
            }
            if(dir === 3){
                body[0].x -= 10;
            }
            //Snake OUT SCREEN
            if ( body[0].x > canvas.width - body[0].width){
                body[0].x = 0;
            }
            if ( body[0].y > canvas.height - body[0].height){
                body[0].y = 0;
            }
            if ( body[0].x < 0){
                body[0].x = canvas.width - body[0].width;
            }
            if ( body[0].y < 0){
                body[0].y = canvas.height - body[0].height;
            }
            //Wall Intersects
            for (i = 0, l = wall.length; i < l; i += 1){
                if (food.intersects(wall[i])){
                    food.x = random(canvas.width / 10 - 1) * 10;
                    food.y = random(canvas.height / 10 - 1) * 10;
                }
                if (body[0].intersects(wall[i])){
                    gameover = true;
                    pause = true;
                    aDie.play();
                }
            }
            //Body Intersects
            for (i = 2, l = body.length; i < l; i += 1){
                if(body[0].intersects(body[i])){
                    gameover = true;
                    pause = true;
                    aDie.play();
                }
            }
            //Food Intersects
            if(body[0].intersects(food)){
                body.push (new Rectangle(food.x, food.y, 10, 10));
                score += 1;
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
                aEat.play();      
        }   }
        if(lastPress === keyEnter){
            pause = !pause;
            lastPress = null;
        }
    }
    function repaint (){
        window.requestAnimationFrame (repaint);
        paint(ctx);
    }
    function run(){
        window.requestAnimationFrame(run);
        var now = Date.now();
        var deltaTime = (now - lastUpdate) / 1000;
        if (deltaTime > 1) {
            deltaTime = 0;
        }
        lastUpdate = now;
        frames += 1;
        acumDelta += deltaTime;
        if (acumDelta > 1) {
            FPS = frames;
            frames = 0;
            acumDelta -= 1;
        }
        act();
    }
    function init (){
        canvas= document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        body[0] = new Rectangle(40, 40, 10, 10);
        food = new Rectangle(80, 80, 10, 10);
        //load assets
        iSnake.src = 'img/snake.png';
        iFood.src = 'img/apple.png';
        aEat.src = 'snd/check.oga.ogg';
        aDie.src = 'snd/death.oga.ogg';
        //create walls
        wall.push(new Rectangle(100,50,10,10));
        wall.push(new Rectangle(100,100,10,10));
        wall.push(new Rectangle(200,50,10,10));
        wall.push(new Rectangle(200,100,10,10));
        run();
        repaint();
    }
    //Rectangle
    function Rectangle(x, y, width, height){
        this.x = (x === undefined) ? 0 : x;
        this.y = (y === undefined) ? 0 : y;
        this.width = (width === undefined) ? 0 : width;
        this.height = (height === undefined) ? this.width : height;
    }
    Rectangle.prototype = {
        constructor: Rectangle,
        intersects: function (rect){
            if (rect === undefined){
                window.console.warn('Missing parameter on function intersects');
            }
            else{
                return(this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y < rect.y + rect.height && this.y + this.height > rect.y);
            }
        },
        fill: function (ctx) {
            if (ctx === undefined) {
                window.console.warn('Missing parameters on function fill');
            } else {
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        },
        drawImage: function (ctx, img) {
            if (img === undefined) {
                window.console.warn('Missing parameters on function drawImage');
            } else {
                if (img.width) {
                    ctx.drawImage(img, this.x, this.y);
                } else {
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                }
            }
        }
    };
    function random (max){
        return ~~(Math.random() * max);
    }
    function canPlayOgg() {
        var aud = new Audio();
        if (aud.canPlayType('audio/ogg').replace(/no/, '')) {
            return true;
        } else {
            return false;
        }
    }
    function reset (){
        score = 0;
        dir = 1;
        body.length = 0;
        body.push(new Rectangle(40,40,10,10));
        body.push(new Rectangle(0,0,10,10));
        body.push(new Rectangle(0,0,10,10));
        food.x = random(canvas.width / 10 - 1) * 10;
        food.y = random(canvas.height / 10 - 1) * 10;
        gameover = false;
    }
    window.addEventListener('load', init, false);
}(window));
