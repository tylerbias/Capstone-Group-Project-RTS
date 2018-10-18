game.selectbox = me.Renderable.extend({

    /**
     * constructor
     */
    init : function () {
        // call the constructor
        this._super(me.Renderable, "init", [100,100,100,100]);

        this.name = "selectbox";

		this.anchorPoint.set(0, 0);
		this.alwaysUpdate = true;
		this.moved = false;
		this.clickpos = null;
		this.setOpacity(.4);
        },

        draw : function(renderer) {
            renderer.setColor('#FF0000');
            renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        },
    /**
     * update the entity
     */
    update : function (dt) {
    	//initial left click
	   	if(me.input.isKeyPressed('leftclick') && !this.moved){
	   		//console.log(this.pos.z);
		    this.clickpos = me.input.globalToLocal(me.input.pointer.clientX, me.input.pointer.clientY);
		    this.pos.x = this.clickpos.x;
	   		this.pos.y = this.clickpos.y;
	   		this.moved = true;
	   	}
	   	//drag while still holding left click
	   	else if(me.input.isKeyPressed('leftclick')){
	   		var dragpos = me.input.globalToLocal(me.input.pointer.clientX, me.input.pointer.clientY);
	   		this.height = dragpos.y - this.clickpos.y;
	   		this.width = dragpos.x - this.clickpos.x;
	   	}
	   	else{
	   		//releasing left click
	   		if(this.moved == true){
	   			var selectbox = this;

	   			//reposition selector box if width or height were negative
	   			//(w or h is negative if mouse moves up or left while dragging)
	   			if(selectbox.height < 0){
	   				selectbox.pos.y = selectbox.pos.y + selectbox.height;
	   				selectbox.height = Math.abs(selectbox.height);
	   			}
	   			if(selectbox.width < 0){
	   				selectbox.pos.x = selectbox.pos.x + selectbox.width;
	   				selectbox.width = Math.abs(selectbox.width);
	   			}

	   			
	   			//select army units
	   			this.playerContainerHandle.forEach(function (child){
	   				if(selectbox.overlaps(child) && child.type === 'armyUnit'){
	   					child.selected = true;
	   				}
	   				else if(child.type === 'armyUnit'){
	   					child.selected = false;
	   				}
	   			});

	   			//add building selection here?
	   			//condition = can't select army units and buildings at same time
	   			//or maybe for now just make buildings automatically create units every X seconds
	   			//to at least get something basic working

	   		}
	   		this.moved = false;
	   		this.height = 0;
	   		this.width = 0;
	   	}
	   	
    	return false;
    },






/*
// onActivate function
 onActivateEvent: function () {
    // register on the 'pointerdown' event
    me.input.registerPointerEvent('pointerup', me.game.viewport, this.pointerUp.bind(this));
    console.log("CLICK");
 },

 // pointerDown event callback
 pointerUp: function (pointer) {
   // do something
   this.anchorPoint.set(0,0);
   console.log("CLICKPOINTERUP");
   // don"t propagate the event to other objects
   return true;
 },

*/





   /**
     * colision handler
     * (called when colliding with other objects)
     */
//    onCollision : function (response, other) {
        // Make all other objects solid
//        return true;
//    }

 

});
