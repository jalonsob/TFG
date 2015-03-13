//**************************************//
//*************Object panel**************//
//**************************************//

function Panel(idPanel,color,wid){
	var id=idPanel;
	var widgets=wid || [];
	var color=color || getRandomColor();
	var settings= '<div id="settings"><ul><button onclick="'+"showConfiguration("+id+",'HighTime')"+'" type="button" class="btn btn-xs btn-default">Time series chart</button><button onclick="'+"showConfiguration("+id+",'HighDemo')"+'" type="button" class="btn btn-xs btn-default">Aging chart</button><button onclick="'+"showConfiguration("+id+",'HighInfo')"+'" type="button" class="btn btn-xs btn-default">Info widget</button><button onclick="'+"showConfiguration("+id+",'VideoWidget')"+'" type="button" class="btn btn-xs btn-default">Video Widget</button><button onclick="'+"showConfiguration("+id+",'HtmlInfoWidget')"+'" type="button" class="btn btn-xs btn-default">HtmlInfoWidget</button></ul></div>'
	var gridster= '<div id="panel'+id+'" class="gridster ready" style="background-color:'+color+'"><ul></ul></div>'
	
	this.writeSettings=function(){
		$("#widgetButtons").html(settings)
	}

	this.getSettings=function(){
		return settings
	}

	this.getContent=function(){
		return gridster
	}

	this.getId= function(){
		return id
	}

	this.getWidgets= function(){
		return widgets
	}

	this.flatten=function(){
		var objaux={};
		objaux["panel"+id]={};
		objaux["panel"+id].panel={
			color: color,
			id: id
		};
		objaux["panel"+id].widgets=[];
		widgets.forEach(function(element){
			objaux["panel"+id].widgets.push(element.flatten())
		})
		return objaux
	}
	this.changeColor=function(newColor){
		color=newColor;
	}

	this.pushElement= function(widget){
		widgets.push(widget)
	}

	this.deleteElement=function(element){
		widgets.splice(widgets.indexOf(element), 1);
	}

	this.deleteAll=function(){
		widgets=[]
	}
}