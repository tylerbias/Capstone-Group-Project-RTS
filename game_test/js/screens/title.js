game.TitleScreen = me.ScreenObject.extend({



    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
       	this.font = new me.Font("Arial", 20, "#FFD700");
    	this.font.textAlign = "right";


    	me.game.world.addChild(new me.ColorLayer("background", "#000000"), 1);



	    let start_btn = new (me.GUI_Object.extend({
	    	   init : function () {
			      var settings = {}
			      settings.image = "start_button";
			      settings.framewidth = 160;
			      settings.frameheight = 80;
			      // super constructor
			      this._super(me.GUI_Object, "init", [480, 250, settings]);
			      // define the object z order
			      this.pos.z = 0;
			      me.game.world.LOAD_FROM_COOKIE = false;
			   },

		    onClick : function (event) {
		        // Change to the PLAY state when the button is clicked
		        me.state.change(me.state.PLAY);
		        return false;
		    }
		}));



	    let ai_easy_btn = new (me.GUI_Object.extend({
	    	   init : function () {
			      var settings = {}
			      settings.image = "ai_easy_button";
			      settings.framewidth = 160;
			      settings.frameheight = 80;
			      me.game.world.AI_DIFFICULTY = "EASY";
			      // super constructor
			      this._super(me.GUI_Object, "init", [350, 100, settings]);
			      // define the object z order
			      this.pos.z = 0;
			      this.setAnimationFrame(1);
			   },

		    onClick : function (event) {
		    	me.game.world.AI_DIFFICULTY = "EASY";
		    	this.setAnimationFrame(1);
		    	ai_hard_btn.setAnimationFrame(0);
		    	//console.log('ai difficulty set to '+me.game.world.AI_DIFFICULTY);
		        return false;
		    }
		}));



	    let ai_hard_btn = new (me.GUI_Object.extend({
	    	   init : function () {
			      var settings = {}
			      settings.image = "ai_hard_button";
			      settings.framewidth = 160;
			      settings.frameheight = 80;
			      // super constructor
			      this._super(me.GUI_Object, "init", [615, 100, settings]);
			      // define the object z order
			      this.pos.z = 0;
			   },

		    onClick : function (event) {
		    	me.game.world.AI_DIFFICULTY = "HARD";
		    	this.setAnimationFrame(1);
		    	ai_easy_btn.setAnimationFrame(0);
				//console.log('ai difficulty set to '+me.game.world.AI_DIFFICULTY);
		        return false;
		    }
		}));


	    let load_saved_game_btn = new (me.GUI_Object.extend({
	    	   init : function () {
			      var settings = {}
			      settings.image = "load_saved_game_button";
			      settings.framewidth = 400;
			      settings.frameheight = 80;
			      // super constructor
			      this._super(me.GUI_Object, "init", [480, 450, settings]);
			      // define the object z order
			      this.pos.z = 0;
			   },

		    onClick : function (event) {
		        // Change to the PLAY state when the button is clicked
		        me.game.world.LOAD_FROM_COOKIE = true;
		        me.state.change(me.state.PLAY);
		        return false;
		    }
		}));



	    let wording = new (me.Renderable.extend({

            init : function() {
                this._super(me.Renderable, 'init', [480, 288, me.game.viewport.width, me.game.viewport.height]);
                this.font = new me.Font("Arial", 32, "#FFD700");
    			this.font.textAlign = "center";
            },

            draw : function(renderer) {
                this.font.draw(renderer, "OR", this.pos.x+480, this.pos.y+338);
                    
            },
            update : function(dt) {
                return true;
            },
        }));

        me.game.world.addChild(wording, 2);


        me.game.world.addChild(start_btn, 3);
        me.game.world.addChild(ai_easy_btn, 3);
        me.game.world.addChild(ai_hard_btn, 3);
      	me.game.world.addChild(load_saved_game_btn, 3);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        ; // TODO
    }
});
