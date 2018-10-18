game.Castle = game.BasicProductionBuilding.extend({

    /**
     * constructor
     */
    init : function(x, y, team, teamContainer) {
    	if (team === 'yellow') {
        	var image = me.loader.getImage("castle_yellow");
        }
        else if (team === 'blue') {
        	var image = me.loader.getImage("castle_blue");
        }
        else if (team === 'red') {
        	var image = me.loader.getImage("castle_red");
        }
        else if (team === 'green') {
        	var image = me.loader.getImage("castle_green");
        }
        // call the constructor
        this._super(me.Entity, 'init', [x, y, {
        	image: image,
        	width: 128,
        	height: 128,
        	anchorPoint: {"x": .5, "y": .5}}]);

        this.name = "castle";
        this.type = 'building';
        this.team = team;
        this.autoTransform = true;
		// Unit Traits
		this.hp = 15;
		this.attack = 3;
		this.attackType = "melee";

		this.armor = 0;
		

		//reset collision make smaller
		this.body.removeShape(this.body.getShape(0));
		this.body.addShape(new me.Rect(0,0,110,80));
		this.body.updateBounds();
		this.renderable.updateBounds();
		this.body.getShape(0).translate(0,20);
		//this.body.updateBounds();
		this.teamContainer = teamContainer;
		this.teamContainer.numCastle++;
		this.spawnId = this._super(game.BasicProductionBuilding, 'spawnUnit', ['peasant', 10000, 8, 
																				this.pos.x, this.pos.y, 
																				this.team, this.teamContainer, 
																				"numCastle"]);
   },



    update : function (dt) {


		if (this.hp <= 0) {
			this.alive = false;
			//stop spawning units since the building is dead
			me.timer.clearInterval(this.spawnId);
			this.teamContainer.removeChild(this);
			this.teamContainer.numCastle--;
			var deadUnit = this;
			this.teamContainer.forEach(function (child){
	   			if(child.type === 'armyUnit' && child.attacker === deadUnit){
	   					child.attacker = null;
	   					child.beingAttacked = false;
	   					child.engaged = false;
	   			}
	   		})
			//SPECIAL CONDITION: end game when castle is destroyed
			if(this.teamContainer.name === "playerContainer"){
				me.game.world.endState = "DEFEAT";
			}
			else{
				me.game.world.endState = "VICTORY";
			}
			me.state.change(me.state.GAMEOVER);
		}

    	return true;
    }


});