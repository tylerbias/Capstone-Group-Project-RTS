game.Camera = me.Renderable.extend({

    /**
     * constructor
     */
    init : function () {
        // call the constructor
        this._super(me.Renderable, "init", [480,288,10,10]);
        this.name = "camera";
        this.anchorPoint.set(0,0);
	//	this.anchorPoint.set(0.5, 0.5);
	//	this.body.setVelocity(1, 1);
		this.alwaysUpdate = true;

	//	var viewport = me.game.viewport;
	//	me.game.viewport.currentTransform.scale(2.0);
		// set the display to follow our position on both axis
    	me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    	//me.game.viewport.resize(960, 576);
    	console.log(me.game.viewport);
//this.floating = true;
    	            //publish the corresponding message
me.event.publish(me.event.VIEWPORT_ONCHANGE, [me.game.viewport.pos]);

       /* viewport.currentTransform.translate(
            960,
            576
        );
        viewport.currentTransform.scale(2.995);
        /*
        
        viewport.currentTransform.translate(
            -viewport.width * viewport.anchorPoint.x,
            -viewport.height * viewport.anchorPoint.y
        );*/
    },
/*
   draw : function(renderer) {
            renderer.setColor('#FF0000');
            renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    },*/
    /**
     * update the entity
     */
    update : function (dt) {

	//   	var pointerX = me.input.pointer.gameX;
	//	var pointerY = me.input.pointer.gameY;
	//	this.pos.x = me.input.pointer.gameX;
	//	this.pos.y = me.input.pointer.gameY;

		/*if(me.input.isKeyPressed('leftclick')){
			//console.log(me.input.pointer);
			console.log(me.input.globalToLocal(me.input.pointer.clientX, me.input.pointer.clientY));
		}*/




		if(me.input.pointer.clientX != undefined && me.input.pointer.clientY != undefined){
			//x goes 0-960
			//y goes 0-576
			var relativePointerPos = me.input.globalToLocal(me.input.pointer.clientX, me.input.pointer.clientY);
			//console.log(relativePointerPos);
			var gamePos = me.input.pointer;
			var camera = this;
		/*		camera.pos.x = gamePos.gameX;
				camera.pos.y = gamePos.gameY;
		/*	//only move camera if near edge of screen
			if(relativePointerPos.x < 25 ||
			relativePointerPos.x > 935 ||
			relativePointerPos.y < 25 ||
			relativePointerPos.y > 551){
				camera.pos.x = gamePos.gameX;
				camera.pos.y = gamePos.gameY;
			}
		}*/
		
			if(relativePointerPos.x < 40){
				me.game.viewport.move(-3,0);
			}
			else if(relativePointerPos.x > 920){
				me.game.viewport.move(3,0);
			}
			if(relativePointerPos.y < 40){
				me.game.viewport.move(0,-3);
			}
			else if(relativePointerPos.y > 536){
				me.game.viewport.move(0,3);
			}
		}
		else{
			console.log("caught undefined pointer pos!");
		}
	
    	return false;
    },





 

});
