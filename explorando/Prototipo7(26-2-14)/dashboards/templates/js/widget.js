
//**************************************//
//*******Basic widget for any use*******//
//**************************************//

//Basic widget for any use
function Widget(id,panel,color,x,y){
	var id=id;
	var color=color||getRandomColor();
	var panel= panel
	var buttons='<button onclick="deleteWidget('+panel+','+id+')" type="button" class="btn btn-xs btn-default">Delete</button>'
	var content='<img id="load'+id+'" src="/templates/images/cargando.gif" height="42" width="42">'
	var square='<div id= "graph'+id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'">'+buttons+'</div><div id="'+id+'" class="panel-body">'+content+'</div></div>';


	this.gridsterWidth=x||10;
	this.gridsterheight=y||10;

	this.getContent=function(){
		return content;
	}

	this.getButtons=function(){
		return buttons;
	}

	this.getSquare=function(){
		return square;
	}

	this.getId=function(){
		return id
	}

	this.changeContent= function(newContent){
		content=newContent;
		square='<div id= "graph'+id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'">'+buttons+'</div><div id="'+id+'" class="panel-body">'+content+'</div></div>';
	}

	this.changeColor=function(newColor){
		color=newColor;
		square='<div id= "graph'+id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'">'+buttons+'</div><div id="'+id+'" class="panel-body">'+content+'</div></div>';

	}
}

//**************************************//
//********Widgets of Highcharts*********//
//**************************************//

//Widget orientado al uso de Times con highcharts
//falta el aplanado, el moverse
function HighTimes(id,color,panel,from,to,size,title,series,json){
	this.from=from;
	this.to=to;
	this.size=size
    if((size)<=12 && (size)>=8){

    	Widget.call(this,id,color,15,12,panel)


    }else if((size)<8){

    	Widget.call(this,id,color,12,8,panel)


    }else{

    	Widget.call(this,id,color,34,13,panel)

    }
	this.title=title;
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsTimeGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.square='<div id="graph'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	this.series=series;
	this.json=json;
	this.flatten= function(){
		var objaux={}
		objaux.type="HighTimes";
		objaux.series=this.series;
		objaux.from= this.from;
		objaux.to=	this.to;
		objaux.id=this.id;
		objaux.title=this.title;
		objaux.color=this.color;
		objaux.jsons=this.json
		return objaux
	}
	this.changeSize=function(newSize){
		this.size=newSize;
		if((this.size)<=12 && (this.size)>=8){

	    	this.x=15
	    	this.y=12


	    }else if((this.size)<8){

			this.x=12
	    	this.y=8

	    }else{

			this.x=34
	    	this.y=13
	    }
	}
	this.changeId= function(newId){
		this.id=newId
		this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsTimeGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
		this.square='<div id="graph'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>'
	}
}

//Widget orientado al uso de Info con highcharts
//falta el aplanado, el moverse
function HighInfo(id,color,panel,title,series,json){
	Widget.call(this,id,color,12,8,panel)
	this.title=title;
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsInfoGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.square='<div id="graph'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	this.series=series;
	this.json=json;
	this.flatten= function(){
		var objaux={}
		objaux.type="HighInfo";
		objaux.series=this.series;
		objaux.id=this.id;
		objaux.title=this.title;
		objaux.color=this.color;
		objaux.jsons=this.jsons
		return objaux
	}
}

//Widget orientado al uso de Ages con highcharts
//falta el aplanado, el moverse
function HighAge(id,color,panel,title,series,jsons){
	Widget.call(this,id,color,16,15,panel)
	this.title=title;
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsDemoGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.square='<div id="graph'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	this.series=series;
	this.jsons=jsons;
	this.flatten=function(){
		var objaux={}
		objaux.type="HighAge";
		objaux.series=this.series;
		objaux.id=this.id;
		objaux.title=this.title;
		objaux.color=this.color;
		objaux.jsons=this.jsons
		return objaux
	}
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
  dashToSave["#panel"+panel]=[]
  var arrayAux=[]
  widgets.forEach(function(element){
  	if(element.panel!=panel){
  		arrayAux.push(element)
  	}
  })
  widgets=arrayAux
}
