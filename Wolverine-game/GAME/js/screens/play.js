game.PlayScreen = me.ScreenObject.extend({

    onResetEvent: function() {

        me.levelDirector.loadLevel("level1");

        game.data.score = 0;
        game.data.life = 100;
        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },



    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});