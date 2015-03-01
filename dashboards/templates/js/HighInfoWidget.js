//Widget oriented to make a chart of kind INFO with Highcharts

function HighInfo(id,panel,color,json,title,serie){
	Widget.call(this,id,panel,color,12,8)
	this.title=title || "Grafico "+id;
	var buttons='<button onclick="deleteWidget('+panel+','+id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ShowValuesGraph('+id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	var square='<div id="widget'+id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'">'+buttons+'</div><div id="'+id+'" class="panel-body"><img id="load'+id+'" src="/templates/images/cargando.gif" height="42" width="42"></div></div>';
	var series=serie || [];
	if((Object.getOwnPropertyNames(takeinfo).length === 0) || (Object.getOwnPropertyNames(configuration).length === 0)){
		var json= "" ;

	}else{
		var json= takeinfo.static.inside
	}
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


	this.makeMenu= function(){
		var keys= configuration.static
		if(json==""){
			$("#conten").append('<div id="currentCreation"></div>')
			$("#currentCreation").append('<p>Configuration files have not been loaded well. Please check your internet connection.<p>');
			$("#currentCreation").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Continue</button>')
		}else{
			if($("#currentCreation")){
				$("#currentCreation").remove();
			}
			$("#conten").append('<div id="currentCreation"><p id="list" style="height: 200px; overflow-y: scroll;"></p></div>')
			$("#currentCreation").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras </p>');
			keys.forEach(function(element){
				$("#currentCreation #list").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
			})
			$("#currentCreation").append('<p>Title</p><p><input placeholder="'+this.title+'" id="title" class="form-control"></div></p>')
			$("#currentCreation").append('<button onclick="FillWidget('+id+')" type="button" class="btn btn-xs btn-default">Create</button>')
			$("#currentCreation").append('<button onclick="deleteCreation('+id+')" type="button" class="btn btn-xs btn-default">Cancel</button>')
		}
		    
	}

	this.takeData= function(state){
		if(state==undefined){
			state="Creation"
		}
		var form=$("#current"+state+" input[type='radio']:checked").attr("value");
	  	if(form!=undefined){
		    //Taking selected metrics 
		    var selected = [];
		    var form=$("#current"+state+" input[type='radio']:checked").attr("value");
		    $("#current"+state+" input[type='checkbox']:checked").each(function() {
		      objaux={
		        name:$(this).attr('value'),
		        type: form
		      }
		      selected.push(objaux);
	    	});
	    	
		    if($("#current"+state+" #title").val()==''){
		      this.title=($("#current"+state+" #title").attr("placeholder"))
		    }else{
		      this.title=$("#current"+state+" #title").val()
		    }
	    	
		    if(selected.length!=0){
		      //makeGraphInfo(actualPanel,selected,title,jsons,color,numGraph)
		      $("#current"+state).remove();
		      $("#making").slideUp("slow")
		      this.toDraw=true;
		      this.series=selected
		    }else{

		      alert("We can not represent a graph without data")
		      this.toDraw=false;
		    }
	  	}else{
	   	 alert("We need that you select a style to represent the data")
	   	 this.toDraw=false;
	  	}
	}

	this.MakeWidget=function(){

		var parser=this.Parser;
		var selected= this.series;
		var auxTitle= this.title
		var draw=this.Draw
		var title= this.title
		
		var gridster = $("#panel"+panel+" ul").gridster().data('gridster');
		gridster.add_widget(square, this.gridsterWidth, this.gridsterheight);
		//In the right way i will draw the graph
		$("#"+id).on("DrawInfo",function(event,trigger,data){
			var serie= parser(selected,data)
			draw(serie,title)
			$("#"+id).off()
		})

		//In the wrong way i will draw an error widget
		$("#"+id).on("ErrorGraphInfo",function(){
		  console.log("hay error")
		  $("#"+id).off()
		})

		//If we haven't the data in cache we will request them
		if(takeinfo.static.state==0){
			//We actualise the state of data
			takeinfo.static.state=1;
			//The request is on course

			$.getJSON(takeinfo.static.inside).success(function(data) {
			    takeinfo.static.saveData=data
			    takeinfo.static.state=2;

			    $("*").trigger("DrawInfo",["DrawInfo",data])
			  }).error(function(){
			    //In case of error we will throw the error event
			    $("*").trigger("ErrorGraphInfo")
			    takeinfo.static.static=0;

			});
		}else if(takeinfo.static.state==2){
			//If we have the data in caché we will use it
			if(takeinfo.static.inside==json){
				var serie= parser(selected,takeinfo.static.saveData)
				draw(serie,title)
			}
		}
	}

	this.Parser=function(selected,data){
		
		var selection=[];
		selected.forEach(function(element){
			dataAux=data[element.name];
			arrayAux=[dataAux]
			obj={
			  type: element.type,
			  name: element.name,
			  data: arrayAux
			}
			selection.push(obj)
		})

		return selection
	}

	this.Draw= function(serie,title){
		
		$("#load"+id).remove()

		var options={
			chart:{
			  renderTo: id.toString(),
			  width: 350,
			  height: 177
			},

			xAxis: {
			categories: ["Total"]
			},
			title: {
			  text: title
			},
			series: serie
	  	}

	  	var chart = new Highcharts.Chart(options);
	}

	this.getSeries= function(){
		return this.series;
	}

	this.settings= function(){
		var chart = $('#'+id).highcharts();
		if(chart!=undefined){
			var keys=configuration.static

			if($("#currentSettings")){
			  $("#currentSettings").remove();
			}

			$("#conten").append('<div id="currentSettings"><p id="list" style="height: 200px; overflow-y: scroll;"></p></div>')
			if(chart.series[0].type=="column"){
			  $("#currentSettings").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column" checked>Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras  </p>');
			}else{
			  $("#currentSettings").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar" checked>Barras  </p>');
			}
			keys.forEach(function(element){
			  if(existLabelHigh(chart,element)){
			    $("#currentSettings #list").append('<p><input type="checkbox" value="'+element+'" checked> '+element+'</p>')
			  }else{
			    $("#currentSettings #list").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
			  }
			})
			$("#currentSettings").append('<p>Title</p><p><input placeholder="'+this.title+'" id="title" class="form-control"></div></p>')
			$("#currentSettings").append('<button onclick="ChangeValuesGraph('+id+')" type="button" class="btn btn-xs btn-default">Create</button>')
			$("#currentSettings").append('<button onclick="deleteSettings()" type="button" class="btn btn-xs btn-default">Cancel</button>')
		}else{
			alert("This graph does not exist or has errors")
		}
	}

	this.redraw= function(){
		this.takeData("Settings");
		var chart = $('#'+id).highcharts();
    	chart.destroy()
    	if(takeinfo.static.inside==json){
    		var series= this.Parser(this.series,takeinfo.static.saveData)
    		this.Draw(series,this.title)
    	}else{
    		alert("cuidado que hemos cambiado")
    	}
    	
	}
	
}

HighInfo.prototype = new Widget();
