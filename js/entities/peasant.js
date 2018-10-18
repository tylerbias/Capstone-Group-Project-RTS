game.Peasant = game.Troop.extend({

    /**
     * constructor
     */
    init : function(x, y, team, teamContainer) {
    	if (team === 'yellow') {
        	var image = me.loader.getImage("peasant_yellow");
        }
        else if (team === 'blue') {
        	var image = me.loader.getImage("peasant_blue");
        }
        else if (team === 'red') {
        	var image = me.loader.getImage("peasant_red");
        }
        else if (team === 'green') {
        	var image = me.loader.getImage("peasant_green");
        }
        // call the constructor
        this._super(me.Entity, 'init', [x, y, {
        	image: image,
        	width: 32,
        	height: 32,
            anchorPoint: {"x": 0.5, "y": 0.5}}]);
        this.team = team;
        this.name = "peasant";
		this.renderable.flipX(true);
		this.body.gravity = 0;
		//this.floating = true;
		this.body.collisionType = me.collision.types.PLAYER_OBJECT;
		this.alwaysUpdate = true;
	//	this.renderable.addAnimation('walk', [2, 3, 4, 5, 6], 100);
	//	this.renderable.addAnimation('walkV', [12], 100);
	//	this.renderable.addAnimation('stand', [0, 1], 300);
	//	this.renderable.addAnimation('standV', [1, 2], 300);
	//	this.renderable.addAnimation('fire', [14]);
	//	this.renderable.setCurrentAnimation('walk');
		this.needsMoveX = false;
		this.needsMoveY = false;
		this.autoTransform = true;
		//this.unit_sel_img = me.loader.getImage("unit_selected");
		this.selected = false;
		this.mining = false;
		this.miningId = null;

		this.type = 'armyUnit';


		// Unit Traits
		this.hp = 15;
		this.attack = 3;
		this.attackType = "melee";
		this.body.setVelocity(1, 1);
		this.armor = 0;

		this.lastBuildTimestamp = 0;

		//reset collision make smaller
		var bodyShape = this.body.getShape(0);
		this.body.addShape(new me.Rect(0,0,16,16));
        this.body.updateBounds();

        this.attackSquare = new me.Rect(-2,-2,20,20);


		this.teamContainer = teamContainer;
		this.myBox = this.teamContainer.addChild(me.pool.pull("unitSelected"));
		//this.anchorPoint.set(0.5, .5);
		this.clickpos = me.input.globalToLocal(0,0);
		this.goldmineHandle = null;
   },

    update : function (dt) {
    	if (this.selected === true && me.input.isKeyPressed('Bkey')) {
    		var okToBuild = this.checkBuildTimeout();
    		if(this.teamContainer.gold >= 150 && okToBuild){
    			this.teamContainer.addChild(me.pool.pull("barracks", this.pos.x+12, this.pos.y-100, this.team, this.teamContainer));
    			this.teamContainer.gold -= 150;
    		}
	    }
	    else if (this.selected === true && me.input.isKeyPressed('Tkey')) {
	    	var okToBuild = this.checkBuildTimeout();
    		if(this.teamContainer.gold >= 100 && okToBuild){
    			this.teamContainer.addChild(me.pool.pull("tavern", this.pos.x+12, this.pos.y-100, this.team, this.teamContainer));
    			this.teamContainer.gold -= 100;
    		}
	    }
	    else if (this.selected === true && me.input.isKeyPressed('Rkey')) {
	    	var okToBuild = this.checkBuildTimeout();
    		if(this.teamContainer.gold >= 200 && okToBuild){
    			this.teamContainer.addChild(me.pool.pull("range", this.pos.x+12, this.pos.y-100, this.team, this.teamContainer));
    			this.teamContainer.gold -= 200;
    		}
	    }
	    else if (this.selected === true && me.input.isKeyPressed('Hkey')) {
			var okToBuild = this.checkBuildTimeout();
    		if(this.teamContainer.gold >= 250 && okToBuild){
    			this.teamContainer.addChild(me.pool.pull("stables", this.pos.x+12, this.pos.y-100, this.team, this.teamContainer));
    			this.teamContainer.gold -= 250;
    		}
	    }


	    //gold mining checks
    	if(this.mining === true && !(this.goldmineHandle.overlaps(this))){
    		this.disableMining();
    	}


    	//call regular troop update
    	this._super(game.Troop, 'update', [dt]);
    },


    givePlayerGold : function(goldPerFiveSeconds, goldmineHandle) {
    	this.goldmineHandle = goldmineHandle;
    	var team = this.teamContainer;

    	var id = me.timer.setInterval(function(){
    		//console.log('giving ' + goldPerFiveSeconds + ' gold!');
    		team.gold += goldPerFiveSeconds;
    	}, 5000, false);

    	return id;
    },


    disableMining : function(){
		//console.log('mining disabled');
		this.mining = false;
		this.goldmineHandle = null;
		me.timer.clearInterval(this.miningId);

    },

    //'hack' to prevent accidentally building multiple buildings stacked on each other if enough gold for multiple
    checkBuildTimeout : function(){
    	var date = new Date();
		var timestamp = date.getTime();
    	var timeSinceLastBuild = timestamp - this.lastBuildTimestamp;
    	//3 second cooldown after building
    	if(timeSinceLastBuild > 3000){
    		this.lastBuildTimestamp = timestamp;
    		return true;
    	}
    	else{
    		return false;
    	}
    }
});