/**
 * Created by ekoodi on 27/03/2017.
 */
function Player() {
    this.x = 0;
    this.y = 0;
    this.width = 32;
    this.height = 32;
    this.happy = new Image();
    this.happy.src = 'img/smiley.gif';
    this.angry = new Image();
    this.angry.src = 'img/angry.gif';
//    this.color = '#808080';
    this.ok = true;

    this.show = function(ctx) {
        ctx.drawImage(this.ok ? this.happy : this.angry, this.x, this.y);
    }
}

function Block(x, hole) {
    this.x = x;
    this.hole = hole;

    this.crashed = function(player) {
        if (player.y < this.hole) return true;
        if (player.y+player.height > this.hole+48) return true;
        return false;
    }

    this.show = function(ctx) {
        ctx.fillStyle = "#00FF00"; // green
        ctx.fillRect(this.x, 0, 10, this.hole);
        ctx.fillRect(this.x, this.hole+48, 10, ctx.canvas.height-this.hole-48);
    }
}

function Game() {
    this.stepSize = 5;
    this.minFrameCount = 200;
    this.maxFrameCount = 300;
    this.background = new Image();
    this.background.src = 'img/lpr.jpg';

    this.blocks = [];

    this.player = new Player();

    this.rePaint = function() {
        var canvas = document.getElementById('playground');
        var ctx = canvas.getContext("2d");
//        ctx.fillStyle = '#000000';
//        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.background, 0, 0);
        // show blocks
        this.blocks.forEach(function(block) { block.show(ctx) });
        // show player
        this.player.show(ctx);
    }

    this.startGame = function () {
        this.blocks = [];
        this.frameCount = 0;
        this.totalPoints = 0;
        this.ok = true;
        this.player.ok = true;
        this.newBlock();
        this.rePaint();
        this.interval = setInterval(this.tick, 10);
        document.getElementById('start').disabled = true;
    }

    this.setNextFrameCount = function() {
        this.nextFrameCount = Math.floor(Math.random()*(this.maxFrameCount-this.minFrameCount))+this.minFrameCount;
    }

    this.tick = function() {
        blockerGame.tack();
    }

    this.newBlock = function() {
       var hole = Math.floor(Math.random() * (document.getElementById('playground').height - 144)) + 48;
       var x = document.getElementById('playground').width - 1;
       this.blocks.push(new Block(x, hole));
    }

    this.tack = function() {
        if (!this.ok) {
            clearInterval(this.interval);
            document.getElementById('start').disabled = false;
            alert('Game Over!');
        }
        this.frameCount++;
        this.totalPoints++;
        document.getElementById("points").innerHTML = this.totalPoints;
        if (this.frameCount > this.nextFrameCount) {
           this.frameCount = 0;
           this.newBlock();
           this.setNextFrameCount();
        }
        // check first block
        if (this.blocks[0].x < -9) {
            this.blocks.splice(0,1);
        } else if (this.blocks[0].x < this.player.width) {
            if (this.blocks[0].crashed(this.player)) {
                this.player.ok = false;
                this.ok = false;
            }
        }
        // move blocks to right
        this.blocks.forEach(function(block) { block.x--; });

        this.rePaint();
    }

    this.keyDown = function (event) {
        if (this.blocks.length > 0) {
            switch (event.keyCode) {
            case 40: // arrow down
                if (this.player.y < document.getElementById('playground').height - this.player.height-this.stepSize) {
                    this.player.y += this.stepSize;
                    this.rePaint();
                }
                break;
            case 38: // arrow up
                if (this.player.y > 0) {
                    this.player.y -= this.stepSize;
                    this.rePaint();
                }
                break;
            }
        }
    }

    this.setNextFrameCount();

}

var blockerGame = new Game();

