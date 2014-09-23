/*---a player entity---- */
game.PlayerEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {

        settings.image = "wolverine";
        // settings.spritewidth = 96;
        // settings.spriteheight = 74;

        settings.spritewidth = 72;
        settings.spriteheight = 72;

        this.parent(x, y, settings);

        this.vertical = settings.vertical;

        this.renderable.addAnimation('walk', [0, 1, 2, 3, 4]);
        this.renderable.addAnimation("punch", [6, 7, 8, 9]);
        this.renderable.addAnimation("jump", [11]);
        this.renderable.addAnimation("die", [12, 13, 14, 15]);
        this.renderable.addAnimation("idle", [16]);
        this.renderable.addAnimation("crawl", [17]);

        this.renderable.setCurrentAnimation("walk");

        this.attacking = false;
        this.dying = false;
        this.facing = 1;
        this.gameOver = false;
        this.walking = false;
        this.setFriction(0.25, 0);
        this.setMaxVelocity(6, 15);
        this.deathTimer = 0;

        this.spawnPosition = new me.Vector2d(x, y);


        this.vppos = new me.Vector2d(x, y);

        this.gravity = 0.6;

        this.setVelocity(7, 15);
        this.animationspeed = 60;

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    },

    /* -----update the player pos------ */
    update: function(dt) {

        if (this.gameOver) return;

        this.vppos.x = this.pos.x + this.renderable.hWidth;
        this.vppos.y = this.pos.y + this.renderable.hHeight;
        if (!this.dying) {

            if (me.input.isKeyPressed('left')) {
                // flip the sprite on horizontal axis
                this.flipX(true);
                this.facing = -1;
                // update the entity velocity
                this.vel.x -= this.accel.x * me.timer.tick;
            } else if (me.input.isKeyPressed('right')) {
                // unflip the sprite
                this.flipX(false);
                this.facing = 1;
                // update the entity velocity
                this.vel.x += this.accel.x * me.timer.tick;
            } else {
                this.vel.x = 0;

                if (game.data.life < 100) {
                    game.data.life += 0.01;
                }
            }

            // if (me.input.isKeyPressed('crawl')) {

            //     if (!this.jumping) {
            //         this.renderable.setAnimationFrame(6);

            //     } else
            //         this.renderable.setCurrentAnimation("walk");
            // }


            if (me.input.isKeyPressed('jump')) {

                if (!this.jumping && !this.falling) {
                    this.vel.y = -this.maxVel.y * me.timer.tick;

                    this.jumping = true;

                } else
                    this.renderable.setCurrentAnimation("idle");
            }

            if (me.input.isKeyPressed('punch')) {
                if (!this.attacking) {
                    this.attacking = true;
                    this.renderable.setCurrentAnimation("punch", (function() {

                        this.renderable.setCurrentAnimation("walk");
                        this.attacking = false;
                    }).bind(this));


                    this.renderable.setAnimationFrame(0);
                }
            }


            if ((this.jumping || this.falling) && !this.attacking) {
                this.renderable.setCurrentAnimation("jump");
            } else {
                if (!this.renderable.isCurrentAnimation("walk") && !this.attacking) {
                    this.renderable.setCurrentAnimation("walk");
                }
            }



        }

        this.updateMovement();

        if (this.pos.y + 100 > me.game.currentLevel.rows * me.game.currentLevel.tileheight && !this.dying) {
            this.vel.y = -this.maxVel.y;
            this.vel.x = 0;
            // this.die();
        }



        var res = me.game.world.collide(this);

        if (res) {
            if (res.obj.type == me.game.ENEMY_OBJECT) {
                game.data.life -= 1;
                if ((res.y > 0) && !this.jumping && game.data.life >= 0) {
                    //  if (game.data.life >= 0) {
                    this.falling = false;
                    this.vel.y = -this.maxVel.y * me.timer.tick;
                    this.jumping = true;
                } else if (game.data.life < 0) {
                    this.gameOver = true;
                    this.renderable.setCurrentAnimation("die");
                    this.renderable.flicker(60);

                    me.state.change(me.state.PLAY);
                    // me.game.viewport.fadeOut("#000", 3000, me.state.change(me.state.PLAY));
                    //game.data.life = 100;
                    return;
                }
            }
            // this.renderable.flicker(100);
            // game.data.life -= 1;


        }
        // if (game.data.life == 0) {
        //     this.gameOver = true;
        //     this.renderable.setCurrentAnimation("die");
        //     me.state.change(me.state.PLAY);
        //     me.game.viewport.fadeIn("#000", 1000, me.state.change(me.state.PLAY));

        //     return;







        if (this.dying && this.renderable.anim["die"].idx == 3) {
            this.renderable.animationpause = true;
            //this.deathTimer -= me.timer.tick;
            //if (this.deathTimer <= 0) {
            if (game.data.life < 0) {
                this.gameOver = true;
                // me.state.stop(true);
                me.state.change(me.state.PLAY);
                return;
            } else {
                me.game.viewport.fadeIn("#000000", 500, this.reset.bind(this));
            }
            //this.renderable.alpha -= 0.01;
            //if (this.renderable.alpha <= 0.01) me.game.remove(this);
        }


        // if (this.vel.x != 0 || this.vel.y != 0 || this.attacking || this.dying) {
        //     // update object animation
        //     this.parent(dt);
        //     return true;
        // }


        if (this.vel.x != 0 || this.vel.y != 0 || this.attacking || this.dying) {
            // update object animation
            this.parent(dt);
            return true;
        }

        return false;
    },
    die: function() {
        if (!this.dying) {
            this.dying = true;
            this.renderable.setCurrentAnimation("die");
            this.renderable.setAnimationFrame(0);
            this.deathTimer = 100;

        }
    },
    reset: function() {

        this.pos.x = this.spawnPosition.x;
        this.pos.y = this.spawnPosition.y;
        this.dying = false;
        this.attacking = false;
        this.falling = false;
        this.jumping = false;
        this.deathTimer = 0;
        this.renderable.animationpause = false;
        this.renderable.setCurrentAnimation("walk");
        this.renderable.setAnimationFrame(0);
        this.setVelocity(0.5, 1);
        // this.setFriction(0.25, 0);
        this.setMaxVelocity(5, 15);
        me.game.viewport.fadeIn("#FFFFFF", 500);

        //this.init(this.spawnPosition.x, this.spawnPosition.y, { image: "girl" });
    },
    gameOver: function() {
        me.state.change(me.state.MENU);
    }
});



game.PlayerEntity2 = me.ObjectEntity.extend({



    init: function(x, y, settings) {

        settings.image = "captain";
        // settings.spritewidth = 96;
        // settings.spriteheight = 74;

        settings.spritewidth = 72;
        settings.spriteheight = 72;

        this.parent(x, y, settings);

        this.vertical = settings.vertical;

        this.renderable.addAnimation('walk', [0, 1, 2, 3, 4]);
        this.renderable.addAnimation("punch", [6, 7, 8, 9]);
        this.renderable.addAnimation("jump", [11]);
        this.renderable.addAnimation("die", [12, 13, 14]);
        //this.renderable.addAnimation("idle", [16]);
        // this.renderable.addAnimation("crawl", [17]);

        this.renderable.setCurrentAnimation("walk");

        this.attacking = false;
        this.dying = false;
        this.facing = 1;
        this.gameOver = false;
        this.walking = false;
        this.setFriction(0.25, 0);
        this.setMaxVelocity(8, 15);
        this.deathTimer = 0;

        this.spawnPosition = new me.Vector2d(x, y);


        this.vppos = new me.Vector2d(x, y);

        this.gravity = 0.6;

        this.setVelocity(5, 15);
        this.animationspeed = 40;

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    },

    /* -----update the player pos------ */
    update: function(dt) {

        if (this.gameOver) return;

        this.vppos.x = this.pos.x + this.renderable.hWidth;
        this.vppos.y = this.pos.y + this.renderable.hHeight;
        if (!this.dying) {

            if (me.input.isKeyPressed('left')) {
                // flip the sprite on horizontal axis
                this.flipX(true);
                this.facing = -1;
                // update the entity velocity
                this.vel.x -= this.accel.x * me.timer.tick;
            } else if (me.input.isKeyPressed('right')) {
                // unflip the sprite
                this.flipX(false);
                this.facing = 1;
                // update the entity velocity
                this.vel.x += this.accel.x * me.timer.tick;
            } else {
                this.vel.x = 0;

                if (game.data.life < 150) {
                    game.data.life += 0.05;
                }
            }


            if (me.input.isKeyPressed('jump')) {

                if (!this.jumping && !this.falling) {
                    this.vel.y = -this.maxVel.y * me.timer.tick;

                    this.jumping = true;

                } else
                    this.renderable.setCurrentAnimation("walk");
            }

            if (me.input.isKeyPressed('punch')) {
                if (!this.attacking) {
                    this.attacking = true;
                    this.renderable.setCurrentAnimation("punch", (function() {

                        this.renderable.setCurrentAnimation("walk");
                        this.attacking = false;
                    }).bind(this));


                    this.renderable.setAnimationFrame(0);
                }
            }


            if ((this.jumping || this.falling) && !this.attacking) {
                this.renderable.setCurrentAnimation("jump");
            } else {
                if (!this.renderable.isCurrentAnimation("walk") && !this.attacking) {
                    this.renderable.setCurrentAnimation("walk");
                }
            }
        }

        this.updateMovement();

        if (this.pos.y + 100 > me.game.currentLevel.rows * me.game.currentLevel.tileheight && !this.dying) {
            this.vel.y = -this.maxVel.y;
            this.vel.x = 0;
            // this.die();
        }



        var res = me.game.world.collide(this);

        if (res) {
            if (res.obj.type == me.game.ENEMY_OBJECT) {
                game.data.life -= 1;
                if ((res.y > 0) && !this.jumping && game.data.life >= 0) {
                    //  if (game.data.life >= 0) {
                    this.falling = false;
                    this.vel.y = -this.maxVel.y * me.timer.tick;
                    this.jumping = true;
                } else if (game.data.life < 0) {
                    this.gameOver = true;
                    this.renderable.setCurrentAnimation("die");
                    this.renderable.flicker(600);

                    me.state.change(me.state.PLAY);
                    // me.game.viewport.fadeOut("#000", 3000, me.state.change(me.state.PLAY));
                    //game.data.life = 100;
                    return;
                }
            }
            // this.renderable.flicker(100);
            // game.data.life -= 1;


        }
        // if (game.data.life == 0) {
        //     this.gameOver = true;
        //     this.renderable.setCurrentAnimation("die");
        //     me.state.change(me.state.PLAY);
        //     me.game.viewport.fadeIn("#000", 1000, me.state.change(me.state.PLAY));

        //     return;







        if (this.dying && this.renderable.anim["die"].idx == 3) {
            this.renderable.animationpause = true;
            //this.deathTimer -= me.timer.tick;
            //if (this.deathTimer <= 0) {
            if (game.data.life < 0) {
                this.gameOver = true;
                // me.state.stop(true);
                me.state.change(me.state.PLAY);
                return;
            } else {
                me.game.viewport.fadeIn("#000000", 500, this.reset.bind(this));
            }
            //this.renderable.alpha -= 0.01;
            //if (this.renderable.alpha <= 0.01) me.game.remove(this);
        }


        // if (this.vel.x != 0 || this.vel.y != 0 || this.attacking || this.dying) {
        //     // update object animation
        //     this.parent(dt);
        //     return true;
        // }


        if (this.vel.x != 0 || this.vel.y != 0 || this.attacking || this.dying) {
            // update object animation
            this.parent(dt);
            return true;
        }

        return false;
    },
    die: function() {
        if (!this.dying) {
            this.dying = true;
            this.renderable.setCurrentAnimation("die");
            this.renderable.setAnimationFrame(0);
            this.deathTimer = 100;

        }
    },
    gameOver: function() {
        me.state.change(me.state.MENU);
    },
    reset: function() {

        this.pos.x = this.spawnPosition.x;
        this.pos.y = this.spawnPosition.y;
        this.dying = false;
        this.attacking = false;
        this.falling = false;
        this.jumping = false;
        this.deathTimer = 0;
        this.renderable.animationpause = false;
        this.renderable.setCurrentAnimation("walk");
        this.renderable.setAnimationFrame(0);
        this.setVelocity(0.5, 1);
        // this.setFriction(0.25, 0);
        this.setMaxVelocity(5, 15);
        me.game.viewport.fadeIn("#FFFFFF", 500);

        //this.init(this.spawnPosition.x, this.spawnPosition.y, { image: "girl" });
    }
});


game.EnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "worm_enemy";
        //settings.image = "alien_enemy";

        // save the area size defined in Tiled
        var width = settings.width;
        var height = settings.height;;

        settings.spritewidth = settings.width = 72;
        settings.spritewidth = settings.height = 72;

        this.parent(x, y, settings);

        this.renderable.anim = {};

        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - settings.spritewidth
        this.pos.x = x + width - settings.spritewidth;

        this.setVelocity(3, 6);

        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;

        this.health = settings.hp;
        this.dying = false;

        this.canKnockback = true;
        this.knockbackTime = 0;

        this.alwaysUpdate = true;

    },


    onCollision: function(res, obj) {

        if (this.alive && !this.renderable.isFlickering() && !this.dying && this.knockbackTime <= 0) {
            if (obj.attacking) {
                if (this.canKnockback) this.knockback((this.pos.x + this.renderable.hWidth) - (obj.pos.x + obj.renderable.hWidth));
                this.health--;
                if (this.health > 0) {
                    this.renderable.flicker(45);
                } else {
                    // this.die();
                    me.game.viewport.shake(10, 500, me.game.viewport.AXIS.BOTH);
                    this.renderable.flicker(600);
                    me.game.world.removeChild(this);
                    game.data.score += 250;
                }

            } else if (obj instanceof game.PlayerEntity) {
                if (game.data.life < 0)
                    obj.die();
            }
        }

        // res.y >0 means touched by something on the bottom

        // if (this.alive && (res.y > 0) && obj.falling) {
        //     this.renderable.flicker(400);
        //     me.game.world.removeChild(this);
        //     game.data.score += 250;
        // }
    },

    // manage the enemy movement
    update: function(dt) {
        if (!this.inViewport)
            return false;

        if (this.alive && !this.dying && !this.knockbackTime > 0 && !this.spawning) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;

        } else {
            this.vel.x = 0;
        }

        this.updateMovement();

        if (this.vel.x != 0 || this.vel.y != 0 || this.dying || this.knockback > 0 || this.spawning) {
            this.parent(dt);
            return true;
        }
        return false;
    },
    knockback: function(dir) {
        if (dir > 0) dir = 1;
        if (dir < 0) dir = -1;
        this.maxVel.x = 20;
        this.vel.x = 5 * dir;
        this.knockbackTime = 45;
    }


});

game.AlienEnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "alien_enemy";

        // save the area size defined in Tiled
        var width = settings.width;
        var height = settings.height;;

        settings.spritewidth = settings.width = 72;
        settings.spritewidth = settings.height = 72;

        this.parent(x, y, settings);

        this.renderable.anim = {};

        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - settings.spritewidth
        this.pos.x = x + width - settings.spritewidth;

        this.setVelocity(2, 6);
        this.setMaxVelocity(4, 10);
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;

        this.health = settings.hp;
        this.dying = false;

        this.canKnockback = true;
        this.knockbackTime = 0;

        this.alwaysUpdate = true;

    },


    onCollision: function(res, obj) {

        if (this.alive && !this.renderable.isFlickering() && !this.dying && this.knockbackTime <= 0) {
            if (obj.attacking) {
                if (this.canKnockback) this.knockback((this.pos.x + this.renderable.hWidth) - (obj.pos.x + obj.renderable.hWidth));
                this.health--;
                if (this.health > 0) {
                    this.renderable.flicker(45);
                } else {
                    // this.die();
                    me.game.world.removeChild(this);
                    me.game.viewport.shake(10, 500, me.game.viewport.AXIS.BOTH);

                    game.data.score += 250;
                }

            } else if (obj instanceof game.PlayerEntity) {
                if (game.data.life < 0)
                    obj.die();
            }
        }

        // res.y >0 means touched by something on the bottom

        // if (this.alive && (res.y > 0) && obj.falling) {
        //     this.renderable.flicker(400);
        //     me.game.world.removeChild(this);
        //     game.data.score += 250;
        // }
    },

    // manage the enemy movement
    update: function(dt) {
        if (!this.inViewport)
            return false;

        if (this.alive && !this.dying && !this.knockbackTime > 0 && !this.spawning) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
            // this.vel.y -= this.maxVel.x * me.timer.tick; 
            this.flipY(this.walkLeft);
            this.vel.y += (this.walkLeft) ? -this.accel.y * me.timer.tick : this.accel.y * me.timer.tick;




        } else {
            this.vel.x = 0;
        }

        this.updateMovement();

        if (this.vel.x != 0 || this.vel.y != 0 || this.dying || this.knockback > 0 || this.spawning) {
            this.parent(dt);
            return true;
        }
        return false;
    },
    knockback: function(dir) {
        if (dir > 0) dir = 1;
        if (dir < 0) dir = -1;
        this.maxVel.x = 20;
        this.vel.x = 5 * dir;
        this.knockbackTime = 45;
    }


});

game.CreditsEntity = me.ObjectEntity.extend({
    init: function(x, y) {
        var self = this;
        // Need to set an image even though we don't use it
        // Set this up wrong originally and didn't feel like fixing it
        // since it works
        self.parent(x, y, {
            image: "slash",
            spritewidth: 100,
            spriteheight: 107
        });

        self.credits1 = "         The End";
        self.credits2 = "   By: Sriram AND Ganesh Aravind";
        self.credits3 = "  You Saved the planet from evil alien forces!!!";
        self.credits4 = "  Refresh to smash the aliens again!";

        self.creditsSize = 24;

        self.creditsX = this.pos.x - me.game.viewport.pos.x - 100;
        self.creditsY = this.pos.y - me.game.viewport.pos.y - 100;

        self.credits = new me.Font('century gothic', self.creditsSize, 'black');

        var tween = new me.Tween(self)
            .to({
                creditsX: self.creditsX,
                creditsY: -200,
                creditsSize: 24
            }, 15000);
        tween.start();

    },

    draw: function(context) {
        this.credits.draw(context, this.credits1, this.creditsX, this.creditsY);
        this.credits.draw(context, this.credits2, this.creditsX, this.creditsY + 50);
        this.credits.draw(context, this.credits3, this.creditsX, this.creditsY + 100);
        this.credits.draw(context, this.credits4, this.creditsX, this.creditsY + 350);
        this.credits.set('century gothic', this.creditsSize, 'black');
    }
});

game.EventEntity = me.LevelEntity.extend({

    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.item = settings.item;
        this.event = settings.event;
    },

    onCollision: function(res, obj) {

        if (this.event === 'theend') {
            var credits = new game.CreditsEntity(obj.pos.x, obj.pos.y);
            me.game.add(credits);
            me.game.sort();
            me.input.unbindKey(me.input.KEY.LEFT, "left");
            me.input.unbindKey(me.input.KEY.RIGHT, "right");
            me.input.unbindKey(me.input.KEY.UP, "jump", true);
            me.input.unbindKey(me.input.KEY.Z, "attack");
        }
        this.collidable = false;
        me.game.remove(this);
    }
});