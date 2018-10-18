game.Troop = me.Entity.extend({

    init : function() {
		this.clickpos = me.input.globalToLocal(0,0);
		this.team = team;
		this.myTarget = null;
		this.attacking = false;
		this.beingAttacked = false;
		this.attacker = null;
		this.alive = true;
		this.engagedInCombat = false;
		this.nextAttackTick = 999999999;
		this.alwaysUpdate = true;
		this.teamContainer = null;
		this.targetWidth = 0;
		this.targetHeight = 0;
   },


    update : function (dt) {
		// TODO: Make it possible for units to kite each other. This would probably be implemented by locking a unit in place if it
		// has an attack queued.

		if (this.hp <= 0) {
			this.alive = false;
			if(this.teamContainer.hasChild(this.myBox)){
				this.teamContainer.removeChild(this.myBox);
			}
			if(this.teamContainer.hasChild(this)){
				this.teamContainer.removeChild(this);
			}
			var deadUnit = this;
			this.teamContainer.forEach(function (child){
	   			if(child.type === 'armyUnit' && child.attacker === deadUnit){
	   					child.attacker = null;
	   					child.beingAttacked = false;
	   					child.engagedInCombat = false;
	   			}
	   		})
			
		}
		// First attempt at making the targeted unit begin to counterattack. Currently the original attacker gets locked in combat
		// even after its target has been killed. Needs revision. -tb 5/9/18
		// Fixed by implementing a living/dead check on the unit registered as the 'attacker' of the unit in question. -tb 5/14/18
		if (this.attacker != null) {
			if (!this.attacking && this.beingAttacked && this.attacker.alive) {
				this.attacking = true;
				this.beingAttacked = false;
				this.myTarget = this.attacker;
				this.targetWidth = (this.myTarget.width/2);
	   			this.targetHeight = (this.myTarget.height/2);
	   			this.clickpos.x = 0;
				this.clickpos.y = 0;
				this.clickpos.x += this.myTarget.pos.x;
				this.clickpos.y += this.myTarget.pos.y;
				this.clickpos.x += this.targetWidth;
				this.clickpos.y += this.targetHeight;
	   			//console.log(this);
				//this.clickpos = this.myTarget.pos;
			}
		}

		// Some checks to handle unit death and clear flags -tb 5/14/18
		if (this.attacking) {
			if (!this.myTarget.alive) {
				this.attacking = false;
				this.attackTarget = false;
				this.engagedInCombat = false;
			}
			else{
				this.targetWidth = (this.myTarget.width/2);
	   			this.targetHeight = (this.myTarget.height/2);
	   			this.clickpos.x = 0;
				this.clickpos.y = 0;
				this.clickpos.x += this.myTarget.pos.x;
				this.clickpos.y += this.myTarget.pos.y;
				this.clickpos.x += this.targetWidth;
				this.clickpos.y += this.targetHeight;
			}
		}
		if (this.attacker != null) {
			if (!this.attacker.alive) {
				this.attacker = null;
			}
		}

		// Handles distance from target calculations for attack purposes. Differentiates between combat styles -tb 5/14/18
		if (this.attacking) {
			if (this.attackType === 'melee') {
				var distanceToTargetX = Math.abs((this.pos.x+16) - (this.clickpos.x + this.targetWidth));
				var distanceToTargetY = Math.abs((this.pos.y+16) - (this.clickpos.y + this.targetHeight));
				//console.log(distanceToTargetX);
				//console.log(distanceToTargetY);
				if (distanceToTargetX >= ((this.targetWidth*2)+2) || distanceToTargetY >= ((this.targetHeight*2)+2)) {
					this.needsMoveX = true;
					this.needsMoveY = true;
					this.engagedInCombat = false;
					//console.log("loop?");
				}
			}
			if (this.attackType === 'ranged') {
				var distanceToTargetX = Math.abs((this.pos.x+16) - (this.clickpos.x + this.targetWidth));
				var distanceToTargetY = Math.abs((this.pos.y+16) - (this.clickpos.y + this.targetHeight));
				//console.log(distanceToTargetX);
				//console.log(distanceToTargetY);
				if (distanceToTargetX > this.attackRange || distanceToTargetY > this.attackRange) {
					this.needsMoveX = true;
					this.needsMoveY = true;
					this.engagedInCombat = false;
				}
			}
		}



	   // else if (me.input.isKeyPressed('leftclick')) DEPRECATED
	   	if(me.input.isKeyPressed('rightclick') && this.selected === true){
	   		// Need to make sure that these flags are cleared whenever a new right click is registered -tb
	   		this.attacking = false;
	   		this.attackTaget = false;
	   		this.engagedInCombat = false;
	   		this.beingAttacked = false;
	   		// Using these local variables because I was running into scope issues inside of the forEach function below when trying
	   		// to directly assign values to class variables using the 'this' keyword -tb
	   		var pointerX = me.input.pointer.gameX;
	   		var pointerY = me.input.pointer.gameY;
	   		var clickSpot = new me.Renderable(pointerX, pointerY, 0, 0);
	   		var attackRegistered = false;
	   		var attackTarget = null;
	   		var myself = this;
	   		// This is ugly and I'm sure there is a better way to pick a unit than spawning a 0x0 rect and seeing what overlaps it.
	   		// But it is all I've been able to get to work so far. -tb
	   		// note: commented out team check below for now, since the new containers will only iterate over the enemy
			this.teamContainer.otherTeamReference.forEach(function (child){
				if(child.getBounds() != null){
		   			if(clickSpot.overlaps(child.getBounds()) && (child.type === 'armyUnit' || child.type ==='building') ){//&& (child != myself) && (child.team != myself.team)){
		   					attackRegistered = true;
		   					attackTarget = child;
		   					//console.log("attacking");
		   			}
		   		}
	   		})
	   		if (attackRegistered) {
	   			// Here the scope has changed so I can refer to the unit using the keyword -tb
	   			this.attacking = true;
	   			this.myTarget = attackTarget;
	   			// Target width and height is taken in and divided by two. this sets the outer bounds when attacking.
	   			this.targetWidth = (this.myTarget.width/2);
	   			this.targetHeight = (this.myTarget.height/2);
	   			console.log(this.myTarget.name);
	   		}
			if(this.attacking === true){
				// If attacking is true, set the destination to be equal to the location of the targeted unit -tb
				this.clickpos.x = 0;
				this.clickpos.y = 0;
				this.clickpos.x += this.myTarget.pos.x;
				this.clickpos.y += this.myTarget.pos.y;
				this.clickpos.x += this.targetWidth;
				this.clickpos.y += this.targetHeight;
			}
			else {
	   		this.clickpos = me.input.globalToLocal(me.input.pointer.clientX, me.input.pointer.clientY);
	   		}

	   		
	   		this.needsMoveX = true;
	   		this.needsMoveY = true;
	   	}
	   	else if (this.needsMoveY || this.needsMoveX) {
	   		// I set up these vars to track whether criteria is met for ending movement on both axes and only turn off movement when both are satisfied. -tb
	   		var Xcontinue = true;
	   		var Ycontinue = true;
			if(this.attacking === true){
				// If attacking is true, set the destination to be equal to the location of the targeted unit -tb
				this.clickpos.x = 0;
				this.clickpos.y = 0;
				this.clickpos.x += this.myTarget.pos.x;
				this.clickpos.y += this.myTarget.pos.y;
				this.clickpos.x += (this.myTarget.width / 2);
				this.clickpos.y += (this.myTarget.height / 2);
			}
		    //X MOVEMENT
	   		if(this.needsMoveX && (this.pos.x+16) < this.clickpos.x-1){
		    	this.renderable.flipX(true);
		    	this.body.vel.x += this.body.accel.x * me.timer.tick;

		    	//stop moving if close
		    	// Changed 15 to 10 in these lines. Seemed to resolve an issue where unit would get stuck on corner and flip back and forth indefinitely. -tb
/*		    	if(this.attacking === true){
			    	if(this.pos.x < (this.clickpos.x + (this.targetWidth)) && this.pos.x > (this.clickpos.x - (this.targetWidth))){
			    		console.log("from left stop");
			    		Xcontinue = false;
			    		//console.log("x fin");
			    		this.body.vel.x = 0;
			    	}
			    }*/
		    }
		  	else if(this.needsMoveX && (this.pos.x+16) > this.clickpos.x+1){
	    	    this.renderable.flipX(false);
		    	this.body.vel.x -= this.body.accel.x * me.timer.tick;

/*				if(this.attacking === true){
			    	if(this.pos.x < (this.clickpos.x + (this.targetWidth)) && this.pos.x > (this.clickpos.x - (this.targetWidth))){
			    		console.log("from right stop");
			    		Xcontinue = false;
			    		//console.log("x fin");			    		
			    		this.body.vel.x = 0;
			    	}
			    }*/
		    }
		    else{
		    	Xcontinue = false;
		    	this.body.vel.x = 0;
		    }


		    //Y MOVEMENT
	   		if(this.needsMoveY && (this.pos.y+16) < this.clickpos.y-1){
		    	this.body.vel.y += this.body.accel.y * me.timer.tick;

/*		    	if(this.attacking === true){
			    	if(this.pos.y < (this.clickpos.y + (this.targetHeight)) && this.pos.y > (this.clickpos.y - (this.targetHeight))){
			    		Ycontinue = false;
			    		console.log("above stop");
			    		//console.log("y fin");
			    		this.body.vel.y = 0;
			    	}
			    }*/
		    }
		  	else if(this.needsMoveY && (this.pos.y+16) > this.clickpos.y+1){
		    	this.body.vel.y -= this.body.accel.y * me.timer.tick;


/*		    	if(this.attacking === true){
			    	if(this.pos.y < (this.clickpos.y+5) && this.pos.y > (this.clickpos.y - (this.targetHeight))){
			    		console.log("below stop");
			    		Ycontinue = false;
			    		//console.log("y fin");
			    		this.body.vel.y = 0;
			    	}
			    }*/
		    }		  
		    else{
		    	Ycontinue = false;
		    	this.body.vel.y = 0;
		    }

		    // Stopping conditions for ranged units must be handled differently from those of melee units, but movement calculations are
		    // identical, so the check can be performed here at the end of the block -tb 5/14/18
		    if (this.attackType === 'ranged' && this.attacking) {
		    	var distanceToTargetX = Math.abs((this.pos.x+16) - this.clickpos.x);
				var distanceToTargetY = Math.abs((this.pos.y+16) - this.clickpos.y);
				//console.log(distanceToTargetX);
				//console.log(distanceToTargetY);
				if (distanceToTargetX <= this.attackRange && distanceToTargetY <= this.attackRange) {
					this.needsMoveX = false;
					this.needsMoveY = false;
			    }
			}
	    	
	    	// Unit has satisfied the movement criteria for both axes. -tb
		    if (!Ycontinue && !Xcontinue){
			    	this.needsMoveY = false;
			    	this.needsMoveX = false;
			    	//console.log('triggered');
			    }
	  		}
	  	
	    if (!this.needsMoveX && !this.needsMoveY) {
	      this.body.vel.x = 0;
	      this.body.vel.y = 0;
	    }

	    // The attacking flag is triggered if the unit is targeting another unit and has been pursuing it.
	    // There is a check to make sure that the attacker has reached its target before inflicting any damage.
	    // The engagedInCombat flag is just there to handle the initial strike. It is used to trigger the collection of a baseline timestamp.
	    // Once the current time reaches the baseline timestamp plus the attack delay, the attack handler is called. -tb
    	if (this.attacking && !this.needsMoveX && !this.needsMoveY) {
    		var tick = me.timer.getTime();
    		if (!this.engagedInCombat) {
    			this.nextAttackTick = (tick + 1000);
    			this.engagedInCombat = true;
    		}
    		else if (tick > this.nextAttackTick) {
    			this.attackHandler(this, this.myTarget);
    			this.nextAttackTick = tick + 1000;
    		}
    	}


	    //me.video.renderer.drawImage(this.unit_sel_img, 10,10,10,10);

	    if(this.selected === true){
	    	//console.log(me.video.renderer);
   			this.myBox.width = this.width;
   			this.myBox.height = this.height;
   			this.myBox.pos.x = this.pos.x;
   			this.myBox.pos.y = this.pos.y;
   			//console.log('drawin img');
   			//me.CanvasRenderer.drawImage(this.unit_sel_img, this.pos.x, this.pos.y,0,0,0,0,0,0);
   		}
   		else{
   			this.myBox.width = 0;
   			this.myBox.height = 0;
   		}



        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
       

        //return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    	return false;
    },

    // The attack handler takes both entities engaged in combat as its parameters
    // It deducts the 'attack strength' value of the attacking unit from the hp pool of the defending unit. -tb
    attackHandler : function (attacker, target) {
    	// The next line is currently unused but will enable the targeted unit to fight back -tb
    	target.attacker = attacker;
    	target.beingAttacked = true;
    	target.hp = target.hp - attacker.attack;
    	console.log(target.hp);
    	if (target.hp <= 0) {
    		attacker.myTarget = null;
    		attacker.engagedInCombat = false;
    		attacker.attacking = false;
    	}
    	return true;
    },
    
    
    
    
	/// colision handler
	onCollision : function (response) {
		//response.a = entity that is moving
		//response.b = entity that a collided with
		//stop moving if colliding with b &&
		// a is trying to move to a point that is inside b
		//console.log(response.a.clickpos.x);
		if(response.b.containsPoint(response.a.clickpos.x, response.a.clickpos.y)){
	   		response.a.needsMoveY = false;
	   		response.a.needsMoveX = false;
	   	}
		//else if(response.a.containsPoint(response.b.clickpos.x, response.b.clickpos.y)){
	   	//	response.b.needsMoveY = false;
	   	//	response.b.needsMoveX = false;
	   	//}
	
	   	//NOTE: currently slightly buggy with cavalry/fast units
		//BUILDING/WORLD COLLISION
		else if(response.a.type === 'building' || response.b.type === 'building'){
		    //X AXIS COLLISION
		    //UNIT IS ON BOTTOM OF BUILDING
		    if(response.overlapV.y < 0){
		    	if(response.a.type === 'armyUnit'){
		    		response.a.pos.y++;
		    		//console.log('col1');
		    	}
		    	else{
		    		response.b.pos.y--;
		    	}
		    }
		    //UNIT IS ON TOP OF BUILDING
		    else if(response.overlapV.y > 0){
		    	if(response.a.type === 'armyUnit'){
		    		response.a.pos.y--;
		    		//console.log('col2');
		    	}
		    	else{
		    		response.b.pos.y++;
		    	}
		    }
		    //Y AXIS COLLISION
		    //UNIT IS TO RIGHT OF BUILDING
		    if(response.overlapV.x < 0){
		    	if(response.a.type === 'armyUnit'){
		    		response.a.pos.x++;
		    		//console.log('col3');
		    	}
		    	else{
		    		response.b.pos.x--;
		    	}
		    }
		    //UNIT IS TO LEFT OF BUILDING
		    else if(response.overlapV.x > 0){
		    	if(response.a.type === 'armyUnit'){
		    		response.a.pos.x--;
		    		//console.log('col4');
		    	}
		    	else{
		    		response.b.pos.x++;
		    	}
		    }
		}




	   	//UNIT COLLISION
		//ONE COLLISION ALTERNATIVE: PUSH EACH OTHER
		else if(response.a.type === 'armyUnit' && response.b.type === 'armyUnit')

			if(response.a.team === response.b.team) {
			    //X AXIS COLLISION
			    //a's bottom edge collided with b (a is on top)
			    if(response.overlapV.y < 0){
			   		//a move up and b move down
			   		response.a.pos.y++;
			   		response.b.pos.y--;
			    }
			    //a's top edge collided with b (a is on bottom)
			    else if(response.overlapV.y > 0){
			   		//a move down and b move up
			   		response.a.pos.y--;
			   		response.b.pos.y++;
			    }
			    //Y AXIS COLLISION
			    //a's right edge collided with b (a is on b's left)
			    if(response.overlapV.x < 0){
			   		//a move left and b move right
			   		response.a.pos.x--;
			   		response.b.pos.x++;
			    }
			    //a's left edge collided with b (a is on b's right)
			    else if(response.overlapV.x > 0){
			   		//a move right and b move left
			   		response.a.pos.x++;
			   		response.b.pos.x--;
			    }
			}
			else if (response.a.attacking && (!response.b.needsMoveX || !response.b.needsMoveY)) {
				response.a.attacking = true;
				response.b.attacking = true;
				response.a.myTarget = response.b;
				response.b.myTarget = response.a;
				//console.log(response.a);
				//console.log(response.b);
			}
		

		
		//for ai: automatically attack anything colliding with
		if((response.a.type === 'armyUnit' && response.a.teamContainer.PLAYER_OR_AI === 'AI')
			 && ((response.b.type === 'armyUnit' || response.b.type === 'building') && response.b.teamContainer.PLAYER_OR_AI === 'PLAYER')){
			response.a.attacking = true;
			response.a.myTarget = response.b;
			response.a.attacker = response.b;
		}
		else if	((response.b.type === 'armyUnit' && response.b.teamContainer.PLAYER_OR_AI === 'AI')
			 	&& ((response.a.type === 'armyUnit' || response.a.type === 'building') && response.a.teamContainer.PLAYER_OR_AI === 'PLAYER')){
			response.b.attacking = true;
			response.b.myTarget = response.a; // FIXED
			response.b.attacker = response.a;
		}
		



	    // Make the object solid
	    // false because this is only the illusion of collision
	    // returning true causes strange teleporting behavior
	    return false;
	},

	
	
});