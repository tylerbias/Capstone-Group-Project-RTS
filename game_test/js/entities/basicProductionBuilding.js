game.BasicProductionBuilding = me.Entity.extend({

    init : function() {
		this.clickpos = me.input.globalToLocal(0,0);
		this.myTarget = null;
		this.attacking = false;
		this.beingAttacked = false;
		this.attacker = null;
		this.alive = true;
		this.engaged = false;

		this.body.gravity = 0;
		this.body.collisionType = me.collision.types.WORLD_SHAPE;
		this.alwaysUpdate = true;
		this.autoTransform = true;
		this.body.setVelocity(0, 0);

    	this.spawnUnit = null;
    	this.spawnTime = null;
    	this.maxSpawn = null;
    	this.aiIdx = -1;
   },



    
    spawnUnit : function(unitNameInPool, spawnTime, maxSpawnNumber, buildingX, buildingY, teamColor, teamContainer, buildingCountRef) {

    	// console.log('my spawn unit will be '+unitNameInPool);
    	// console.log('my spawn time will be '+spawnTime);
    	// console.log('my max spawn will be '+maxSpawnNumber);
    	// console.log('spawn location is '+buildingX+', '+buildingY);
    	// console.log('my team container name is ' +teamContainer.name);
    	// console.log('my team color is '+teamColor);
    	// console.log('my buildingCountRef is '+buildingCountRef);

    	var id = me.timer.setInterval(function(){
    		var spawnCount = 0;
    		teamContainer.forEach(function (child){
    			if(child.name === unitNameInPool && child.team === teamColor){
    				spawnCount++;
    				//console.log('counted ' + spawnCount + ' ' + unitNameInPool);
    			}
    		})
	    	//update maxSpawn in case new buildings were built after this one
	    	if(buildingCountRef === "numCastle"){
	    		if(teamColor === "red" && me.game.world.AI_DIFFICULTY === "EASY"){
	    			maxSpawnNumber = 4 * teamContainer.numCastle;
	    		}
	    		else {
	    			maxSpawnNumber = 8 * teamContainer.numCastle;
	    		}
	    	}else if(buildingCountRef === "numBarracks"){
	    		maxSpawnNumber = 8 * teamContainer.numBarracks;
	    	}else if(buildingCountRef === "numTavern"){
	    		maxSpawnNumber = 8 * teamContainer.numTavern;
	    	}else if(buildingCountRef === "numRange"){
	    		maxSpawnNumber = 8 * teamContainer.numRange;
	    	}else if(buildingCountRef === "numStables"){
	    		maxSpawnNumber = 8 * teamContainer.numStables;
	    	}
    		if(spawnCount < maxSpawnNumber){
    			teamContainer.addUnitToContainer(unitNameInPool, buildingX, buildingY);
    		}
    	}, spawnTime, false);

    	return id;
    }
	
	
});