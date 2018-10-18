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
		//this.army = [];
		//this.peasants = [];
		if(PLAYER_OR_AI === "PLAYER"){
			this.name = "playerContainer";
		}
		else if(PLAYER_OR_AI === "AI"){
			this.name = "aiContainer";
		}
   },

   initializeTeam : function() {
   		//THEN DO LIKE addUnitToContainer GET UNIT AND CHANGE RELEVANT PROPS WITH UNIT.PROP
   		//PROBABLY A FOR LOOP FOR THE ONES THAT ACTUALLY MATTER (POS, HP)

   		//load saved buildings and units
   		if(me.game.world.LOAD_FROM_COOKIE){
   			//prevent bug when loading game after victory/defeat
   			//this will force a fresh restart if that is attempted
   			var okToLoad = this.makeSureBothCastlesExist();
   			if(okToLoad){
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
   },

   addUnitToContainer : function(unitName, x, y) {
   		var unit = me.pool.pull(unitName, x, y, this.team, this);
   		this.addChild(unit);  
   		unit.teamContainer = this;
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

   			bldgNum++;
   			thisCookieName = cookieName+bldgNum;
   		}
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

