
//**************************************//
//*******Basic widget for any use*******//
//**************************************//

//Basic widget for any use
function Widget(id,panel,color,x,y){
	this.id=id;
	this.color=color||getRandomColor();
	this.panel= panel
	this.content='<img id="load'+id+'" src="/templates/images/cargando.gif" height="42" width="42">'
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button>'
	this.square='<div id= "widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';


	this.gridsterWidth=x||10;
	this.gridsterheight=y||10;
	this.toDraw= false;


	this.changeContent= function(newContent){
		content=newContent;
		square='<div id= "graph'+id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'">'+buttons+'</div><div id="'+id+'" class="panel-body">'+content+'</div></div>';
	}

	this.changeColor=function(newColor){
		color=newColor;
		square='<div id= "graph'+id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'">'+buttons+'</div><div id="'+id+'" class="panel-body">'+content+'</div></div>';

	}

	this.drawErrorWidget=function(){
	  $("#load"+id).remove()
	  $("#"+id).html("Error to load data")
	}
}

//*************************************************//
//********Funciones generales de widgets***********//
//*************************************************//

//Function to remove a widget
function deleteWidget(panel,id){

  var gridster = $("#panel"+panel+" ul").gridster().data('gridster');
  gridster.remove_widget("#widget"+id);

  var widget=GetWidget(id);
  if(widget!=""){
	  var panel=GetPanel(panel)
	  panel.deleteElement(widget)
  }
}

//Function that removes all widgets from a panel
function deleteAllWidgets(panel){
  var gridster = $("#panel"+panel+" ul").gridster().data('gridster');
  gridster.remove_all_widgets();
  var panel=GetPanel(panel)

  panel.deleteAll()
}
