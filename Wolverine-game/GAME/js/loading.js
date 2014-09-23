myLoadingScreen = me.ScreenObject.extend({
    /*---

        constructor
        
        ---*/
    init: function() {
        this.parent(true);

        this.invalidate = false;

        this.handle = null;

    },

    onResetEvent: function() {
        // logo
        this.logo1 = new me.Font('impact', 32, 'white', 'middle');
        this.logo1.textBaseline = "alphabetic";

        this.handle = me.event.subscribe(me.event.LOADER_PROGRESS, this.onProgressUpdate.bind(this));

        this.loadPercent = 0;
    },

    onDestroyEvent: function() {
        this.logo1 = null;
        if (this.handle) {
            me.event.unsubscribe(this.handle);
            this.handle = null;
        }
    },

    onProgressUpdate: function(progress) {
        this.loadPercent = progress;
        this.invalidate = true;
    },

    update: function() {
        if (this.invalidate === true) {
            this.invalidate = false;
            return true;
        }
        return false;
    },



    draw: function(context) {

        var logo1_width = this.logo1.measureText(context, "loading...").width;
        var xpos = (me.video.getWidth() - logo1_width) / 2;
        var ypos = me.video.getHeight() / 2;

        me.video.clearSurface(context, "black");

        this.logo1.draw(context, 'loading...', xpos, ypos);
        xpos += logo1_width;

        ypos += this.logo1.measureText(context, "loading...").height / 2;

        var progress = Math.floor(this.loadPercent * 300);

        context.strokeStyle = "silver";
        context.strokeRect((me.video.getWidth() / 2) - 150, ypos, 300, 6);
        context.fillStyle = "#89b002";
        context.fillRect((me.video.getWidth() / 2) - 148, ypos + 2, progress - 4, 2);
    }

});