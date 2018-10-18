game.teamContainer = me.Container.extend({

    init : function(PLAYER_OR_AI, team) {
    	this._super(me.Container, "init");
    	//"PLAYER" or "AI"
    	this.PLAYER_OR_AI = PLAYER_OR_AI;
		this.team = team;
		this.gold = 50;
		this.otherTeamReference = null;
		this.numBarracks = 0;
		this.numTavern = 0;
		this.numCastle = 0;
		this.numRange = 0;
		this.numStables = 0;
		this.curBldgIdx = 0;
		//this.army = [];
		//this.peasants = [];
		this.aiBldgIdx = [false,false,false,false,
							false,false,false,false,
							false,false,false,false];
		this.aiMinerCount = 4;
		this.aiMaxMiners = 4;
		this.skipFirstAiUnits = true;
		this.aiAttackCooldown = 25000;
		if(me.game.world.AI_DIFFICULTY === "HARD"){
			//this.aiMaxMiners = 7;
			this.aiAttackCooldown = 10000;
			this.aiMaxMiners = 4;
		}
		if(PLAYER_OR_AI === "PLAYER"){
			this.name = "playerContainer";
		}
		else if(PLAYER_OR_AI === "AI"){
			this.name = "aiContainer";
			this.aiBldgCoordArr = [[50,170],[220,50],[220,170],[390,50],[560,50],
									[730,50],[390,170],[560,170],[730,170],[50,290],
									[220,290],[50,410]];
		}
   },

   initializeTeam : function() {
   		//load saved buildings and units
   		if(me.game.world.LOAD_FROM_COOKIE){
   			//prevent bug when loading game after victory/defeat
   			//this will force a fresh restart if that is attempted
   			var okToLoad = this.makeSureBothCastlesExist();
   			if(okToLoad){
   				this.skipFirstAiUnits = false;
	   			this.loadInitFromCookie();
	   			this.loadBuildingsFromCookie();
	   			this.loadUnitsFromCookie();
	   		}
	   		else{
		   		if(this.PLAYER_OR_AI == "PLAYER") {
					this.addUnitToContainer("castle", 760, 410);
		   			this.addUnitToContainer("peasant", 770, 515);
		   			this.addUnitToContainer("peasant", 800, 515);
		   			this.addUnitToContainer("peasant", 830, 515);
		   			this.addUnitToContainer("peasant", 860, 515);
		   		}
		   		else if(this.PLAYER_OR_AI == "AI") {
					this.addUnitToContainer("castle", 50, 50);
		   			this.addUnitToContainer("peasant", 60, 155);
		   			this.addUnitToContainer("peasant", 90, 155);
		   			this.addUnitToContainer("peasant", 120, 155);
		   			this.addUnitToContainer("peasant", 150, 155);
		   		}
		   		else{
		   			console.log("init team error : team is " + this.team);
		   		}
	   		}
   		}
   		//start fresh game if not loading from saved cookie
   		else{
	   		if(this.PLAYER_OR_AI == "PLAYER") {
				this.addUnitToContainer("castle", 760, 410);
	   			this.addUnitToContainer("peasant", 770, 515);
	   			this.addUnitToContainer("peasant", 800, 515);
	   			this.addUnitToContainer("peasant", 830, 515);
	   			this.addUnitToContainer("peasant", 860, 515);
	   		}
	   		else if(this.PLAYER_OR_AI == "AI") {
				this.addUnitToContainer("castle", 50, 55);
	   			var peasant1 = this.addUnitToContainer("peasant", 60, 155);
	   			var peasant2 = this.addUnitToContainer("peasant", 90, 155);
	   			var peasant3 = this.addUnitToContainer("peasant", 120, 155);
	   			var peasant4 = this.addUnitToContainer("peasant", 150, 155);
	   			this.aiMoveUnit(peasant1, 22, 2);
	   			this.aiMoveUnit(peasant2, 22, 2);
	   			this.aiMoveUnit(peasant3, 42, 2);
	   			this.aiMoveUnit(peasant4, 42, 2);
	   			peasant1.isAiMiner = true;
	   			peasant2.isAiMiner = true;
	   			peasant3.isAiMiner = true;
	   			peasant4.isAiMiner = true;
	   			this.skipFirstAiUnits = false;
	   		}
	   		else{
	   			console.log("init team error : team is " + this.team);
	   		}
	   	}
   },

   addUnitToContainer : function(unitName, x, y) {
   		var unit = me.pool.pull(unitName, x, y, this.team, this);
   		this.addChild(unit);  
   		unit.teamContainer = this;
   		if(this.PLAYER_OR_AI === "AI"){
   			if(!this.skipFirstAiUnits){
   				this.handleAiUnit(unit);
   			}
   		}
   		return unit;
   },

   loadInitFromCookie : function() {
   		var pgold = getCookie("playergold");
   		var aigold = getCookie("aigold");
   		var aidiff = getCookie("aidifficulty");

   		//set saved gold
   		if(this.PLAYER_OR_AI === "PLAYER"){
			this.gold = Number(pgold);
			//console.log('set player cookie gold to '+pgold);
		}
		else if(this.PLAYER_OR_AI === "AI"){
			this.gold = Number(aigold);
			//console.log('set ai cookie gold to '+aigold);
		}

		//set saved ai difficulty
		me.game.world.AI_DIFFICULTY = aidiff;
		//console.log('set cookie ai difficulty to '+aidiff);
   },

   loadBuildingsFromCookie : function() {
		//example cookie format:
		//playerbldg1=castle/15/123/456;
   		var bldgNum = 1;
   		var cookieName;
   		if(this.PLAYER_OR_AI === "PLAYER"){
   			cookieName = "playerbldg";
   		}
   		else if(this.PLAYER_OR_AI === "AI"){
   			cookieName = "aibldg";
   		}

   		var thisCookieName = cookieName+bldgNum;
   		var data;
   		while((data = getCookie(thisCookieName)) != ""){
   			//console.log(data);

   			//split into array with individual data at each idx
   			var dataArray = data.split("/");
   			// var i;
   			// for(i = 0; i < dataArray.length; i++){
   			// 	console.log(dataArray[i]);
   			// }

			//example array format:
			//[name, hp, pos.x, pos.y]
			//[castle, 15, 123, 456]
   			var addedBldg = this.addUnitToContainer(dataArray[0], Number(dataArray[2]), Number(dataArray[3]));
   			addedBldg.hp = dataArray[1];

   			if(this.PLAYER_OR_AI === "AI"){
   				//console.log(dataArray[4]);
   				addedBldg.aiIdx = dataArray[4];
   			}

   			bldgNum++;
   			thisCookieName = cookieName+bldgNum;
   		}
   		this.updateBldgIdx();
   },

   loadUnitsFromCookie : function() {
		//example cookie format:
		//playerunit1=peasant/15/123/456;
   		var unitNum = 1;
   		var cookieName;
   		if(this.PLAYER_OR_AI === "PLAYER"){
   			cookieName = "playerunit";
   		}
   		else if(this.PLAYER_OR_AI === "AI"){
   			cookieName = "aiunit";
   		}

   		var thisCookieName = cookieName+unitNum;
   		var data;
   		while((data = getCookie(thisCookieName)) != ""){
   			//console.log(data);

   			//split into array with individual data at each idx
   			var dataArray = data.split("/");
   			// var i;
   			// for(i = 0; i < dataArray.length; i++){
   			// 	console.log(dataArray[i]);
   			// }

			//example array format:
			//[name, hp, pos.x, pos.y]
			//[peasant, 15, 123, 456]
   			var addedUnit = this.addUnitToContainer(dataArray[0], Number(dataArray[2]), Number(dataArray[3]));
   			addedUnit.hp = dataArray[1];

   			unitNum++;
   			thisCookieName = cookieName+unitNum;
   		}
   },

   //prevent loading saved game if it was already a victory/loss
   makeSureBothCastlesExist : function() {
   		var playerCastleExists = false;
   		var aiCastleExists = false;
   		var playerBldgNum = 1;
   		var aiBldgNum = 1;
   		var playerCookieName = "playerbldg";
   		var aiCookieName = "aibldg";
   		

   		var thisPlayerCookieName = playerCookieName+playerBldgNum;
   		var playerData;
   		while((playerData = getCookie(thisPlayerCookieName)) != ""){
   			//console.log(data);

   			//split into array with individual data at each idx
   			var dataArray = playerData.split("/");
   			// var i;
   			// for(i = 0; i < dataArray.length; i++){
   			// 	console.log(dataArray[i]);
   			// }

			//example array format:
			//[name, hp, pos.x, pos.y]
			//[castle, 15, 123, 456]
			if(dataArray[0] == "castle" && dataArray[1] > 0){
				playerCastleExists = true;
				break;
			}


   			playerBldgNum++;
   			thisPlayerCookieName = playerCookieName+playerBldgNum;
   		}


   		var thisAiCookieName = aiCookieName+aiBldgNum;
   		var aiData;
   		while((aiData = getCookie(thisAiCookieName)) != ""){
   			//console.log(data);

   			//split into array with individual data at each idx
   			var dataArray = aiData.split("/");
   			// var i;
   			// for(i = 0; i < dataArray.length; i++){
   			// 	console.log(dataArray[i]);
   			// }

			//example array format:
			//[name, hp, pos.x, pos.y]
			//[castle, 15, 123, 456]
			if(dataArray[0] == "castle" && dataArray[1] > 0){
				aiCastleExists = true;
				break;
			}


   			aiBldgNum++;
   			thisAiCookieName = aiCookieName+aiBldgNum;
   		}

   		//continue if both castles exist
   		if(playerCastleExists && aiCastleExists){
   			return true;
   		}
   		//force start fresh if game was already over
   		else{
   			me.game.world.LOAD_FROM_COOKIE = false;
   			deleteAllCookies();
   			return false;
   		}
   },





    /**********************/
	/***   AI FUNCTIONS ***/
	/**********************/

   runAiBrains : function(){
   		this.checkMoneyAndBuild();
   		this.attackTowardsPlayerCastleEveryOnceInAWhile();
   		this.defendCastle();
   },


   handleAiUnit : function(unit){
   		//console.log('handing '+unit.name);
   		if(unit.name === 'peasant'){
   			this.getMiningPeasantCount();
   			if(this.aiMinerCount < this.aiMaxMiners){
   				this.aiMoveUnit(unit, 62, 2);
   				unit.isAiMiner = true;
   			}
   			else{
   				this.aiMoveUnit(unit, 180, 240);
   			}
   		}
   		//could add other special stuff for other units here
   },

   aiMoveUnit(unit, x, y){
   		unit.clickpos.x = x;
   		unit.clickpos.y = y;
   		unit.needsMoveX = true;
   		unit.needsMoveY = true;
   },

   getMiningPeasantCount : function(){
   		this.aiMinerCount = 0;
   		this.forEach(function (child){
   			if(child.name === 'peasant' && child.isAiMiner){
   				this.aiMinerCount++;
   			}
   		})
   },

   //get position to build next ai building
   getNextAiBldgPos : function(){
   		var nextBldgIdx = 13;
   		var nextCoords = {x:0, y:0};
   		var i;
   		for(i = 0; i < 12; i++){
   			if(this.aiBldgIdx[i] === false){
   				nextBldgIdx = i;
   				break;
   			}
   		}
   		if(nextBldgIdx != 13){
   			nextCoords.x = this.aiBldgCoordArr[nextBldgIdx][0];
   			nextCoords.y = this.aiBldgCoordArr[nextBldgIdx][1];
   			this.curBldgIdx = nextBldgIdx;
   		}
   		//console.log(nextCoords);
   		return nextCoords;
   },

   //main function to build ai buildings
   checkMoneyAndBuild : function(){
   		var ai = this;
   		me.timer.setInterval(function(){
   			var nextBldgCoords = ai.getNextAiBldgPos();
   			var costArr = [100,150,200,250];
   			var bldgNameArr = ['tavern','barracks','range','stables'];
   			var cost = costArr[(ai.curBldgIdx % 4)];
   			var bldgName = bldgNameArr[(ai.curBldgIdx % 4)];

   			console.log('ai building '+bldgName+' at cost of '+cost+'; current money is '+ai.gold);
   			//prevent building if all building slots are currently full (i.e. if coords 0,0 were returned)
   			if(ai.gold >= cost && !(nextBldgCoords.x === 0 && nextBldgCoords.y === 0)){
   				var newBldg = ai.addUnitToContainer(bldgName, nextBldgCoords.x, nextBldgCoords.y);
   				ai.gold -= cost;
   				newBldg.aiIdx = ai.curBldgIdx;
   				ai.aiBldgIdx[ai.curBldgIdx] = true;
   			}    		
    	}, 10000, false);
   },


   //keeps track of which buildings have been built on cookie load
   updateBldgIdx : function(){
   		this.forEach(function (child){
   			if(child.aiIdx != undefined && child.aiIdx != -1){
   				this.aiBldgIdx[child.aiIdx] = true;
   			}
   		})
   	},

   	attackTowardsPlayerCastleEveryOnceInAWhile : function(){
   		var ai = this;
   		me.timer.setInterval(function(){
   			ai.forEach(function (child){
   				if((child.type === 'armyUnit') && (child.name != 'peasant')){
   					ai.aiMoveUnit(child, 830, 470);
   				}
   			})
    	}, ai.aiAttackCooldown, false);
   	},
   	
   	defendCastle : function(){
   		var ai = this;
   		var enemyUnit = null;
   		me.timer.setInterval(function(){
   			var arrayOfAttackers = [];
   			var arrayOfIdle = [];
   			me.game.world.forEach(function (team){
   				if(team.team === "blue"){
   					team.forEach(function (unit){
   						if(unit.type != "building" && unit.attacking){
   		   					arrayOfAttackers.push(unit);
   						}
   					})
   				}
   				if(team.team === "red"){
   					team.forEach(function (unit){
		   				if(unit.type === "armyUnit" && unit.name != "peasant" && unit.team === "red" && !unit.attacking && !unit.needsMoveX){
		   					arrayOfIdle.push(unit);
		   				}
	   				})
  					team.forEach(function (unit){
		   				if(unit.name === "peasant" && !unit.attacking && !unit.needsMoveX && !unit.mining){
		   					arrayOfIdle.push(unit);
		   				}
	   				})
   				}
   			})
   			if(arrayOfAttackers.length != 0){
   	  			arrayOfIdle.forEach(function (unit){
   					unit.myTarget = arrayOfAttackers[Math.floor(Math.random() * arrayOfAttackers.length)];
   					unit.attacking = true;
   				})
   			}
   		}, 5000, false);
   	}

});



//source: https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


//clear all cookies
//source : https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

