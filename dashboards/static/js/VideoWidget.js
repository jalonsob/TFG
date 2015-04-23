//Widget oriented to make a charts with Highcharts

function VideoWidget(id,panel,color,direction,content,width,height,x,y){
	Widget.call(this,id,panel,color,width,height)
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button><button onclick="ShowValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.content=content||'<img id="load'+id+'" src="/templates/images/cargando.gif" height="42" width="42">'
	this.square='<div id= "widget'+this.id+'" class="panel panel-primary widgetDrop" style="border-style: groove;border-color: black;border-width: 3px"><div id="header'+this.id+'" class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	if(direction!=undefined){
		this.direction=direction
		direction="http://www.youtube.com/embed/"+(this.direction.split("/")[this.direction.split("/").length-1])
		this.square='<div id= "widget'+this.id+'" class="panel panel-primary widgetDrop" style="border-style: groove;border-color: black;border-width: 3px"><div id="header'+this.id+'" class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';

	}
	this.x=x||""
	this.y=y||""

	this.flatten= function(){
		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
		var wid=$("#widget"+this.id)
		var wid=gridster.serialize(wid)

		var objaux={}
		objaux.x=wid[0].col
		objaux.y=wid[0].row
		objaux.type="VideoWidget";
		objaux.id= this.id;
		objaux.color= this.color;
		objaux.url= this.direction;
		objaux.content= this.content
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
		$("#currentCreation").append('<p>With : <input  width="5" placeholder="'+this.gridsterWidth+'" id="x" ></p> <p>Heigh: <input width="5" placeholder="'+this.gridsterheight+'" id="y"></div></p>')
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
			if(this.direction.split("https://")[1].split("/")[0]=="youtu.be"){
				direction="http://www.youtube.com/embed/"+(this.direction.split("/")[this.direction.split("/").length-1])

			}else if(this.direction.split("https://")[1].split("/")[0]=="vimeo.com"){
				direction="https://player.vimeo.com/video/"+(this.direction.split("/")[this.direction.split("/").length-1])

			}
			this.gridsterWidth=parseInt(($("#current"+state+" #x").val())) || parseInt(($("#current"+state+" #x").attr("placeholder"))) 
			this.gridsterheight=parseInt(($("#current"+state+" #y").val())) || parseInt(($("#current"+state+" #y").attr("placeholder")))
			if($('#play').is(':checked')){
				direction=direction+"?autoplay=1"
			}
			this.content='<iframe src="'+direction+'" width="'+(this.gridsterWidth*27)+'" height="'+(this.gridsterheight*23)+'" frameborder="0" allowfullscreen></iframe>'
			this.square='<div id= "widget'+this.id+'" class="panel panel-primary widgetDrop" style="border-style: groove;border-color: black;border-width: 3px"><div id="header'+this.id+'" class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';

			this.toDraw=true;
			$("#current"+state).remove();
		   	$("#making").slideUp("slow")
		}else{
			alert("Sorry, we cannot create a video widget without a video.")
		}
	}

	this.MakeWidget=function(){

		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
		if(this.x!="" && this.y!=""){
			gridster.add_widget(this.square, this.gridsterWidth, this.gridsterheight,this.x,this.y);

			this.x="";
			this.y="";
		}else{
			gridster.add_widget(this.square, this.gridsterWidth, this.gridsterheight);

		} 		
		$("#header"+this.id).hide()
		$("#widget"+this.id).click(function(){
			$("#header"+id).slideDown("slow")
		})
		$(document).mouseup(function (e)
			{
			    var container = $("#header"+id);

			    if (!container.is(e.target) // if the target of the click isn't the container...
			        && container.has(e.target).length === 0) // ... nor a descendant of the container
			    {
			        container.slideUp("slow");
			    }
		});
			
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
    	var square=this.square;
    	var width= this.gridsterWidth;
    	var height= this.gridsterheight;
    	var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
    	gridster.remove_widget("#widget"+this.id,function(){
    		gridster.add_widget(square, width, height);

    	})

    	$("#"+this.id).html(this.content)

	}

}

VideoWidget.prototype = new Widget();
