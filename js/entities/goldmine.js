game.Goldmine = game.BasicProductionBuilding.extend({

    /**
     * constructor
     */
    init : function(x, y) {
        // call the constructor
        var image = me.loader.getImage("goldmine");
        this._super(me.Entity, 'init', [x, y, {
        	image: image,
        	width: 64,
        	height: 64}]);

        this.name = "goldmine";


	
		

		//reset collision make smaller
		this.body.removeShape(this.body.getShape(0));
		this.body.addShape(new me.Rect(0,0,40,40));
		this.body.getShape(0).translate(0,20);

		//this.spawnId = this._super(game.BasicProductionBuilding, 'spawnUnit', ['testKnight', 3000, 10, this.pos.x, this.pos.y]);
		//console.log(this.spawnId);
   },



    update : function (dt) {
    	var gmine = this;

    	if(this.playerContainerHandle === undefined){
    		return false;
    	}

		this.playerContainerHandle.forEach(function (child){
   			if(child.name === 'peasant'){
   				if(gmine.overlaps(child)){
	   				if(child.mining === false){
		   				child.mining = true;
		   				//console.log('peasant mining +2 gold!');
		   				child.miningId = child.givePlayerGold(2, gmine);
		   			}
		   		}
   			}
   		})
		
		this.aiContainerHandle.forEach(function (child){
   			if(child.name === 'peasant'){
   				if(gmine.overlaps(child)){
	   				if(child.mining === false){
		   				child.mining = true;
		   				//console.log('peasant mining +2 gold!');
		   				child.miningId = child.givePlayerGold(2, gmine);
		   			}
		   		}
   			}
   		})


    	return false;
    },





});