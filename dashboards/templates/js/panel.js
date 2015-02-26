//**************************************//
//*************Oject panel**************//
//**************************************//

function Panel(idPanel){

	var id=idPanel;
	var widgets=[];
	var color=getRandomColor();
	var settings= '<div id="settings'+id+'"class="panel-body" hidden><ul><button onclick="showTimeSettings('+id+')" type="button" class="btn btn-xs btn-default">Time series chart</button><button onclick="showAgingSettings('+id+')" type="button" class="btn btn-xs btn-default">Aging chart</button><button onclick="showInfoSettings('+id+')" type="button" class="btn btn-xs btn-default">Info widget</button></ul></div>'
	var gridster= '<div id="panel'+id+'" class="gridster ready" style="background-color:'+color+'"><ul></ul></div>'
	var content= settings+gridster

	this.getSettings=function(){
		return settings
	}

	this.getContent=function(){
		return content
	}

	this.getGrister=function(){
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
		objaux["panel"+id]=[];
		widgets.forEach(function(element){
			objaux["#panel"+id].push(element.flatten)
		})
		return objaux
	}
	this.changeColor=function(newColor){
		color=newColor;
	}

	this.pushElement= function(widget){
		widgets.push(widget)
	}
}