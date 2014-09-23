game.HUD = game.HUD || {};


game.HUD.Container = me.ObjectContainer.extend({

    init: function() {
        this.parent();

        this.isPersistent = true;

        this.collidable = false;

        this.z = Infinity;

        this.name = "HUD";

        this.addChild(new game.HUD.ScoreItem(40, 50));
        this.addChild(new game.HUD.LivesItem(500, 50));

        // var spr = new me.SpriteObject(250, 50, me.loader.getImage("slash"), 100, 100);
        // spr.floating = true;
        // spr.z = 2;
        // this.addChild(spr);

        this.alwaysUpdate = true;
    }
});


/** 
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({

    init: function(x, y) {


        this.parent(new me.Vector2d(x, y), 10, 10);

        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("left");
        this.score = -1;

        this.floating = true;
    },


    update: function() {
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },


    draw: function(context) {
        this.font.draw(context, "RAGE PTS:" + game.data.score, this.pos.x, this.pos.y);
    }

});

game.HUD.LivesItem = me.Renderable.extend({
    init: function(x, y) {
        this.parent(new me.Vector2d(x, y), 10, 10);

        this.font = new me.BitmapFont("32x32_font", 32);
        //this.font.alignText = "bottom";
        this.font.set("left");

        this.lives = 1;

        this.floating = true;
    },

    update: function() {

        if (this.life !== game.data.life) {
            this.life = game.data.life;
            return true;
        }
        return false;
    },

    draw: function(context) {
        this.font.draw(context, "HP :" + Math.floor(game.data.life), this.pos.x, this.pos.y);

    }
});


// game.PlayScreen = me.ScreenObject.extend({

//     onResetEvent: function() {

//         // load a level
//         me.levelDirector.loadLevel("level1");

//         // reset the score
//         game.data.score = 0;

//         // add our HUD to the game world
//         this.HUD = new game.HUD.Container();
//         me.game.world.addChild(this.HUD);

//     },



//     onDestroyEvent: function() {
//         // remove the HUD from the game world
//         me.game.world.removeChild(this.HUD);
//     }
// });