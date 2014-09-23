/* Game namespace */
var game = {

    data: {
        // score
        score: 0,
        life: 100
    },


    "onload": function() {
        if (!me.video.init("screen", 800, 600, true, 'auto')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        if (document.location.hash === "#debug") {
            window.onReady(function() {
                me.plugin.register.defer(this, debugPanel, "debug");
            });
        }

        // me.audio.init("mp3,ogg");

        me.loader.onload = this.loaded.bind(this);

        me.loader.preload(game.resources);

        me.state.set(me.state.LOADING, new myLoadingScreen());
        me.state.change(me.state.LOADING);
    },

    "loaded": function() {

        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        me.state.transition("fade", "#000000", 250);

        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("mainPlayer2", game.PlayerEntity2);

        me.pool.register("EnemyEntity", game.EnemyEntity);
        me.pool.register("AlienEnemyEntity", game.AlienEnemyEntity);
        me.pool.register("CreditsEntity", game.CreditsEntity);
        me.pool.register("EventEntity", game.EventEntity);

        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "jump", true);
        // me.input.bindKey(me.input.KEY.X, "crawl");
        me.input.bindKey(me.input.KEY.Z, "punch", true);

        me.state.change(me.state.MENU);
    }
};