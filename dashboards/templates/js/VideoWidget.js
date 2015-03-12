//Widget oriented to make a charts with Highcharts

function VideoWidget(id,panel,color,direction,x,y){
	Widget.call(this,id,panel,color,x,y)
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button><button onclick="ShowValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.square='<div id= "widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	if(direction!=undefined){
		this.direction=direction
		direction="http://www.youtube.com/embed/"+(this.direction.split("/")[this.direction.split("/").length-1])
		this.content='<iframe src="'+direction+'" width="'+(this.gridsterWidth*27)+'" height="'+(this.gridsterheight*23)+'" frameborder="0" allowfullscreen></iframe>'
		this.square='<div id= "widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';

	}

	this.flatten= function(){
		var objaux={}
		objaux.type="VideoWidget";
		objaux.id= this.id;
		objaux.color= this.color;
		objaux.url= this.direction;
		objaux.width=this.gridsterWidth;
		objaux.height=this.gridsterheight;
		return objaux
	}

	//Function that creates a menu where we can select the data that we want represent.
	this.makeMenu= function(){

		if($("#currentCreation")){
			$("#currentCreation").remove();
		}
		$("#conten").append('<div id="currentCreation">')
		$("#currentCreation").append('<p>With : <input  width="10" placeholder="'+this.gridsterWidth+'" id="x" > Heigh: <input width="10" placeholder="'+this.gridsterheight+'" id="y"></div></p>')
		$("#currentCreation").append('<p>Playing <input id="play" type="checkbox"> Url : <input id="url" class="form-control"></p>')
		$("#currentCreation").append('<button onclick="FillWidget('+id+')" type="button" class="btn btn-xs btn-default">Create</button>')
		$("#currentCreation").append('<button onclick="deleteCreation('+id+')" type="button" class="btn btn-xs btn-default">Cancel</button>')
	   
	}
	//This function take the data from the menu created by this widget.
	this.takeData= function(state){
		var draw=false;
		var direction;
		if(state==undefined){
			state="Creation"
		}
		if(($("#current"+state+" #url").attr("placeholder")!=undefined)){
			draw=true
		}
		if(($("#current"+state+" #url").val()!="")){
			draw=true
		}
		if(draw){
			this.direction=(($("#current"+state+" #url").val() || $("#current"+state+" #url").attr("placeholder")))
			direction="http://www.youtube.com/embed/"+(this.direction.split("/")[this.direction.split("/").length-1])
			this.gridsterWidth=parseInt(($("#current"+state+" #x").val())) || parseInt(($("#current"+state+" #x").attr("placeholder"))) 
			this.gridsterheight=parseInt(($("#current"+state+" #y").val())) || parseInt(($("#current"+state+" #y").attr("placeholder")))
			if($('#play').is(':checked')){
				direction=direction+"?autoplay=1"
			}
			this.content='<iframe src="'+direction+'" width="'+(this.gridsterWidth*27)+'" height="'+(this.gridsterheight*23)+'" frameborder="0" allowfullscreen></iframe>'
			this.square='<div id= "widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';

			this.toDraw=true;
			$("#current"+state).remove();
		   	$("#making").slideUp("slow")
		}else{
			alert("Sorry, we cannot create a video widget without a video.")
		}
	}

	this.MakeWidget=function(){

		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
 		gridster.add_widget(this.square, this.gridsterWidth, this.gridsterheight);

	}


	//Function that creates a menu where we can select the data that we want represent.
	//In this case, there will be some checkbox selected with the data that the widget already has.
	this.settings= function(){

		if($("#currentSettings")){
			  $("#currentSettings").remove();
		}
		$("#conten").append('<div id="currentSettings">')
		$("#currentSettings").append('<p>With : <input  width="10" placeholder="'+this.gridsterWidth+'" id="x" > Heigh: <input width="10" placeholder="'+this.gridsterheight+'" id="y"></div></p>')
		$("#currentSettings").append('<p>Playing <input id="play" type="checkbox"> Url : <input id="url" class="form-control" placeholder="'+this.direction+'"></p>')
		$("#currentSettings").append('<button onclick="ChangeValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Create</button>')
		$("#currentSettings").append('<button onclick="deleteSettings()" type="button" class="btn btn-xs btn-default">Cancel</button>')
	   

	}

	this.redraw= function(){
    	this.takeData("Settings");
    	$("#"+this.id).html(this.content)

	}

}

VideoWidget.prototype = new Widget();
