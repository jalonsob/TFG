//Widget oriented to make a chart of kind INFO with Highcharts

function HighInfo(id,panel,json,title,series,color){
	Widget.call(this,id,panel,color,12,8)
	this.title=title||"Grafico "+id;
	var buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsInfoGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	var square='<div id="graph'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	var series=series||[];
	var json=json;
	this.flatten= function(){
		var objaux={}
		objaux.type="HighInfo";
		objaux.series=this.series;
		objaux.id= id;
		objaux.title=this.title;
		objaux.color= color;
		objaux.jsons= json
		return objaux
	}

	this.putElement= function(element){
		series.push(element)
	}

	this.makeMenu= function(){
		var keys= configuration.static

		$("#making").slideDown("slow")

	    if($("#currentMenu")){
	      $("#currentMenu").remove();
	    }

	    $("#conten").append('<div id="currentMenu"><p id="list" style="height: 200px; overflow-y: scroll;"></p></div>')
	    if(chart.series[0].type=="column"){
	      $("#currentMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column" checked>Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras  </p>');
	    }else{
	      $("#currentMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar" checked>Barras  </p>');
	    }
	    keys.forEach(function(element){
	      if(existLabelHigh(chart,element)){
	        $("#currentMenu #list").append('<p><input type="checkbox" value="'+element+'" checked> '+element+'</p>')
	      }else{
	        $("#currentMenu #list").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
	      }
	    })
	    $("#currentMenu").append('<p>Title</p><p><input placeholder="'+chart.title.textStr+'" id="title" class="form-control"></div></p>')
	    $("#currentMenu").append('<button onclick="takeDataInfo('+numGraph+')" type="button" class="btn btn-xs btn-default">Create</button>')
	    $("#currentMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
	    }else{
	    	alert("This graph does not exist or has errors")
	    }
	}
}

HighInfo.prototype = new Widget();
