game.unitSelected = me.Renderable.extend({

    /**
     * constructor
     */
    init : function () {
        // call the constructor
        //this._super(me.Renderable, "init", [0,0,0,0]);
        //var image = me.loader.getImage("unit_selected");
        this._super(me.Renderable, 'init', [0, 0, 0, 0]);
        this.alwaysUpdate = true;
        this.name = "unitSelected";
		this.anchorPoint.set(0, 0);
//		this.body.vel.x = 0;
//		this.body.vel.y = 0;
		this.setOpacity(.4);
        },


        draw : function(renderer) {
            renderer.setColor('#FF0000');
            // Originally this was fillRect, changed to stroke to give a more subtle visual indicator
            renderer.strokeRect(this.pos.x, this.pos.y, this.width, this.height);

        },
/*
    draw : function(renderer) {
        me.game.world.forEach(function (child){
        	if(child.type === 'armyUnit' && child.selected === true){
        		renderer.drawImage(this.image, child.pos.x, child.pos.y); 
        		console.log('drew');
            }
        });
    },*/
    /**
     * update the entity
     */
  /*  update : function (dt) {

/*
    	var box = this;
    	    me.game.world.forEach(function (child){
        	if(child.type === 'armyUnit' && child.selected === true){
        		if(child.hasSelectBox === false){
        			var box = makeNewBox(child);
        			child.myBox = box;
        		}
        		child.myBox.width = child.width;
        		child.myBox.height = child.height;
        		child.myBox.pos.x = child.pos.x;
        		child.myBox.pos.y = child.pos.y; 
        		//console.log('drew');
            }
            else if(child.type === 'armyUnit'){
            	child.myBox.width = 0;
            	child.myBox.height = 0;
            }
        });


	*/

  //  	return false;
   // },




});
