game.Stables = game.BasicProductionBuilding.extend({

    /**
     * constructor
     */
    init : function(x, y, team, teamContainer) {
    	if (team === 'yellow') {
        	var image = me.loader.getImage("stables_yellow");
        }
        else if (team === 'blue') {
        	var image = me.loader.getImage("stables_blue");
        }
        else if (team === 'red') {
        	var image = me.loader.getImage("stables_red");
        }
        else if (team === 'green') {
        	var image = me.loader.getImage("stables_green");
        }
        // call the constructor
        this._super(me.Entity, 'init', [x, y, {
        	image: image,
        	width: 128,
        	height: 128}]);

        this.name = "stables";
        this.type = 'building';

		// Unit Traits
		this.hp = 100;
		this.attack = 3;
		this.attackType = "melee";

		this.armor = 0;

		

		//reset collision make smaller
		this.body.removeShape(this.body.getShape(0));
		this.body.addShape(new me.Rect(0,0,128,93));
		this.body.getShape(0).translate(0,20);
		this.team = team;
		this.teamContainer = teamContainer;
		this.teamContainer.numStables++;

		this.spawnId = this._super(game.BasicProductionBuilding, 'spawnUnit', ['Cavalry', 10000, 8*this.teamContainer.numStables, 
																				this.pos.x, this.pos.y, this.team, this.teamContainer, "numStables"]);
   },



    update : function (dt) {


		if (this.hp <= 0) {
			this.alive = false;
			this.teamContainer.aiBldgIdx[this.aiIdx] = false;
			//stop spawning units since the building is dead
			me.timer.clearInterval(this.spawnId);
			if(this.teamContainer.hasChild(this)){
				this.teamContainer.removeChild(this);
			}
			this.teamContainer.numStables--;
			var deadUnit = this;
			this.teamContainer.forEach(function (child){
	   			if(child.type === 'armyUnit' && child.attacker === deadUnit){
	   					child.attacker = null;
	   					child.beingAttacked = false;
	   					child.engaged = false;
	   			}
	   		})
			
		}


    	return true;
    },


});