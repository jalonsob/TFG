
//**************************************//
//*******Basic widget for any use*******//
//**************************************//

//Basic widget for any use
function Widget(id,color,x,y,panel){
	this.id=id;
	this.color=color;
	this.x=x;
	this.y=y;
	this.ChangeColor=function(newColor){
		this.color=newColor || getRandomColor();
	}
	this.panel=panel;
	this.square='<div id= "graph'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'"><button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+this.id+'" class="panel-body"> </div></div>';
}

//**************************************//
//********Widgets of Highcharts*********//
//**************************************//

//Widget orientado al uso de Times con highcharts
//falta el aplanado, el moverse
function HighTimes(id,color,x,y,panel,title){
	Widget.call(this,id,color,x,y,panel)
	this.title=title;
	this.buttons='<button onclick="settingsTimeGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.series=[];
}

//Widget orientado al uso de Info con highcharts
//falta el aplanado, el moverse
function HighInfo(id,color,x,y,panel,title){
	Widget.call(this,id,color,x,y,panel)
	this.title=title;
	this.buttons='<button onclick="settingsInfoGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.series=[];
}

//Widget orientado al uso de Ages con highcharts
//falta el aplanado, el moverse
function HighAge(id,color,x,y,panel,title){
	Widget.call(this,id,color,x,y,panel)
	this.title=title;
	this.buttons='<button onclick="settingsDemoGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.series=[];
}

//******************************//
//*******Heritage area**********//
//******************************//

HighAge.prototype = new Widget();
HighInfo.prototype = new Widget();
HighTimes.prototype = new Widget();

//*************************************************//
//********Funciones generales de widgets***********//
//*************************************************//

//Function to remove a widget
function deleteWidget(panel,graph){
  var gridster = $("#panel"+panel+" ul").gridster().data('gridster');
  gridster.remove_widget("#graph"+graph)

}

//Function that removes all widgets from a panel
function deleteAllWidgets(panel){
  var gridster = $("#panel"+panel+" ul").gridster().data('gridster');
  gridster.remove_all_widgets();
}
