game.Cavalry = game.Troop.extend({

    /**
     * constructor
     */
    init : function(x, y, team, teamContainer) {
        // call the constructor
        if (team === 'blue') {
        	var image = me.loader.getImage("cavalry_blue");
        }
        else if (team === 'green') {
        	var image = me.loader.getImage("cavalry_green");
        }
        else if (team === 'red') {
        	var image = me.loader.getImage("cavalry_red");
        }
        else if (team === 'yellow') {
        	var image = me.loader.getImage("cavalry_yellow");
        }
        this._super(me.Entity, 'init', [x, y, {
        	image: image,
        	width: 32,
        	height: 32}]);

		this.team = team;
        this.name = "Cavalry";
        this.teamContainer = teamContainer;
		this.renderable.flipX(true);
		this.body.gravity = 0;
		this.renderable.addAnimation('stand', [0]);
		this.renderable.addAnimation('attack', [1]);
		this.renderable.setCurrentAnimation('stand');
		//this.floating = true;
	//	this.anchorPoint.set(10, 10);
		this.body.collisionType = me.collision.types.PLAYER_OBJECT;
		this.alwaysUpdate = true;
	//	this.renderable.addAnimation('walk', [2, 3, 4, 5, 6], 100);
	//	this.renderable.addAnimation('walkV', [12], 100);
	//	this.renderable.addAnimation('stand', [0, 1], 300);
	//	this.renderable.addAnimation('standV', [1, 2], 300);
	//	this.renderable.addAnimation('fire', [14]);
	//	this.renderable.setCurrentAnimation('walk');
		this.needsMoveX = false;
		this.needsMovey = false;
		this.autoTransform = true;
		//this.unit_sel_img = me.loader.getImage("unit_selected");
		this.selected = false;
		//console.log(this);

		this.type = 'armyUnit';
		this.myBox = this.teamContainer.addChild(me.pool.pull("unitSelected"));

		// Unit Traits
		this.hp = 25;
		this.attack = 4;
		this.attackType = "melee";
		this.body.setVelocity(1, 1);
		this.armor = 0;



		//reset collision make smaller
		this.body.removeShape(this.body.getShape(0));
		this.body.addShape(new me.Rect(0,0,13,13));
		this.body.updateBounds();
		//this.anchorPoint.set(0.5, .5);
		this.clickpos = me.input.globalToLocal(0,0);
   },


    update : function (dt) {
    	if(this.attacking && (!this.renderable.isCurrentAnimation("attack"))){
    		this.renderable.setCurrentAnimation("attack");
    		//console.log('set to attacking');
    	}
    	else if(!this.renderable.isCurrentAnimation("stand") && (this.attacking === false)){
    		this.renderable.setCurrentAnimation("stand");
    		//console.log('set to standing');
    	}

    	//call regular troop update
    	this._super(game.Troop, 'update', [dt]);
    },
});