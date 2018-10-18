game.Villian = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y) {
        // call the constructor
        var image = me.loader.getImage("villain");
        this._super(me.Entity, 'init', [550, 425, {
        	image: image,
        	width: 32,
        	height: 32}]);

        this.name = "testKnight";
		this.renderable.flipX(true);
		this.body.gravity = 0;
		console.log("VILLIAN COMIN");
	//	this.anchorPoint.set(10, 10);
		this.body.setVelocity(1, 1);
		this.body.collisionType = me.collision.types.ENEMY_OBJECT;
		this.alwaysUpdate = true;
	//	this.renderable.addAnimation('walk', [2, 3, 4, 5, 6], 100);
	//	this.renderable.addAnimation('walkV', [12], 100);
	//	this.renderable.addAnimation('stand', [0, 1], 300);
	//	this.renderable.addAnimation('standV', [1, 2], 300);
	//	this.renderable.addAnimation('fire', [14]);
	//	this.renderable.setCurrentAnimation('walk');
		this.needsMoveX = false;
		this.needsMovey = false;
		this.clickpos = null;
		//console.log(this);
   },

	movement: function(direction){
		if(direction === "n"){
			// update the entity velocity
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}else if(direction === "ne"){
			// unflip the sprite
	    	this.renderable.flipX(true);
	    	
	    	// update the entity velocity
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}else if (direction === "e") {
	      // unflip the sprite
	      this.renderable.flipX(true);

	      // update the entity velocity
	      this.body.vel.x += this.body.accel.x * me.timer.tick;
	    }else if(direction === "se"){
			// unflip the sprite
	    	this.renderable.flipX(true);
	    	
	    	// update the entity velocity
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.body.vel.y += this.body.accel.y * me.timer.tick;
		}else if (direction === "s") {
	      // update the entity velocity
	      this.body.vel.y += this.body.accel.y * me.timer.tick;
	    }else if(direction === "sw"){
			// unflip the sprite
	    	this.renderable.flipX(true);
	    	
	    	// update the entity velocity
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.body.vel.y += this.body.accel.y * me.timer.tick;
		}else if (direction === "w") {
	      // flip the sprite on horizontal axis
	      this.renderable.flipX(false);

	      // update the entity velocity
	      this.body.vel.x -= this.body.accel.x * me.timer.tick;
	    }else if(direction === "nw"){
			// unflip the sprite
	    	this.renderable.flipX(false);
	    	
	    	// update the entity velocity
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}
	},
		

    /**
     * update the entity
     */
    update : function (dt) {
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
       

        //return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    	return true;
    },

// onActivate function
 onActivateEvent: function () {
    // register on the 'pointerdown' event
    me.input.registerPointerEvent('pointerdown', me.game.viewport, this.pointerDown.bind(this));
    console.log("CLICK");
 },

 // pointerDown event callback
 pointerDown: function (pointer) {
   // do something
   console.log("CLICKPOINTERDOWN");
   // don"t propagate the event to other objects
   return false;
 },

   /**
     * collision handler
     * (called when colliding with other objects)
     */
//    onCollision : function (response, other) {
        // Make all other objects solid
//        return true;
//    }

});