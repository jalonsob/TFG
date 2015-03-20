//Widget oriented to make a chart of kind INFO with Highcharts

function HighInfo(id,panel,color,from,json,title,serie){
	HighWidget.call(this,id,panel,color,12,8)
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button><button onclick="ShowValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.square='<div id= "widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	this.title=title || "Graph "+from+" info "+this.id;
	this.from=from;
	var series=serie || [];
	if((Object.getOwnPropertyNames(configuration).length === 0)){
		var json= "" ;

	}else{
		var json= configuration["static-"+from].inside
	}
	this.flatten= function(){
		var objaux={}
		objaux.type="HighInfo";
		objaux.series= series;
		objaux.from= from;
		objaux.id= id;
		objaux.title=this.title;
		objaux.color= color;
		objaux.jsons= json
		return objaux
	}

	//Function that creates a menu where we can select the data that we want represent.
	this.makeMenu= function(){
		var keys= configuration["static-"+from].values
		if(json==""){
			$("#conten").append('<div id="currentCreation"></div>')
			$("#currentCreation").append('<p>Configuration files have not been loaded well. Please check your internet connection.<p>');
			$("#currentCreation").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Continue</button>')
		}else{
			if($("#currentCreation")){
				$("#currentCreation").remove();
			}
			$("#conten").append('<div id="currentCreation"><div id="list" style="height: 200px; overflow-y: scroll;"><table id="table" style="width:100%"></table></div></div>')
			$("#currentCreation").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras </p>');

			var titles="<tr><td>Periods</td>";
			configuration["static-"+from].periods.forEach(function(period){
				if(period==""){
					titles=titles+"<td>Total</td>"
				}else{
					titles=titles+"<td>"+period+"</td>"
				}
			})
			titles=titles+"</tr>"
			$("#currentCreation #table").append(titles)

			keys.forEach(function(element){
				var newDiv="<tr><td>"+element.nameUser+"</td>"
				configuration["static-"+from].periods.forEach(function(period){
					
					if(element.periods.indexOf(period)!=-1){
						newDiv=newDiv+'<td><input name="'+element.nameUser+" "+period.split("_")[period.split("_").length-1]+'" value="'+element.realName+period+'" type="checkbox"></td>'
					}else{
						newDiv=newDiv+'<td>  </td>'
					}

				})
				newDiv=newDiv+"</tr>"
				$("#currentCreation #table").append(newDiv)

			})

			$("#currentCreation").append('<p>Title</p><p><input placeholder="'+this.title+'" id="title" class="form-control"></div></p>')
			$("#currentCreation").append('<button onclick="FillWidget('+id+')" type="button" class="btn btn-xs btn-default">Create</button>')
			$("#currentCreation").append('<button onclick="deleteCreation('+id+')" type="button" class="btn btn-xs btn-default">Cancel</button>')
		}
		    
	}
	//This function take the data from the menu created by this widget.
	this.takeData= function(state){
		var selected=[]
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
		        nameUser: $(this).attr('name'),
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
		      $("#current"+state).remove();
		      $("#making").slideUp("slow")
		      this.toDraw=true;
		      series=selected
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
		var selected= series;
		var draw=this.Draw
		var title= this.title
		var drawError = this.drawErrorWidget

		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
		gridster.add_widget(this.square, this.gridsterWidth, this.gridsterheight);
		//In the right way i will draw the graph
		$("#"+this.id).on("DrawInfo"+from,function(event,trigger,data){
			var serieChart= parser(selected,data)
			draw(serieChart,title)
			$("#"+this.id).off()
		})

		//In the wrong way i will draw an error widget
		$("#"+this.id).on("ErrorGraphInfo"+from,function(){
		  drawError()
		  $("#"+this.id).off()
		})

		//If we haven't the data in cache we will request them
		if(configuration["static-"+from].state==0){
			//We actualise the state of data
			configuration["static-"+from].state=1;
			//The request is on course

			$.getJSON(configuration["static-"+from].reference).success(function(data) {
			    configuration["static-"+from].saveData=data
			    configuration["static-"+from].state=2;

			    $("*").trigger("DrawInfo"+from,["DrawInfo"+from,data])
			  }).error(function(){
			    //In case of error we will throw the error event
			    $("*").trigger("ErrorGraphInfo"+from)
			    configuration["static"+from].state=0;

			});
		}else if(configuration["static-"+from].state==2){
			//If we have the data in caché we will use it

			$("#"+this.id).off()
			var serieChart= parser(selected,configuration["static-"+from].saveData)
			draw(serieChart,title)
		}
	}

	//This function is useful to parse the data and flatten them to draw this widget.
	this.Parser=function(selected,data){
		
		var selection=[];
		selected.forEach(function(element){
			dataAux=data[element.name];
			arrayAux=[dataAux]
			obj={
			  type: element.type,
			  name: element.nameUser,
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
			series: serie,
	  	}

	  	var chart = new Highcharts.Chart(options);
	}

	this.getSeries= function(){
		return series;
	}

	//Function that creates a menu where we can select the data that we want represent.
	//In this case, there will be some checkbox selected with the data that the widget already has.
	this.settings= function(){
		var chart = $('#'+id).highcharts();
		var existLabel= this.existLabel
		if(chart!=undefined){
			var keys=configuration["static-"+from].values

			if($("#currentSettings")){
			  $("#currentSettings").remove();
			}

			$("#conten").append('<div id="currentSettings"><div id="list" style="height: 200px; overflow-y: scroll;"><table id="table" style="width:100%"></table></div></div>')

			var titles="<tr><td>Periods</td>";
			configuration["static-"+from].periods.forEach(function(period){
				if(period==""){
					titles=titles+"<td>Total</td>"
				}else{
					titles=titles+"<td>"+period+"</td>"
				}
			})
			titles=titles+"</tr>"
			$("#currentSettings #table").append(titles)

			keys.forEach(function(element){
				var newDiv="<tr><td>"+element.nameUser+"</td>"
				configuration["static-"+from].periods.forEach(function(period){
					
					if(element.periods.indexOf(period)!=-1){
						if(existLabel(chart,element.nameUser+" "+period.split("_")[period.split("_").length-1])){
							newDiv=newDiv+'<td><input checked name="'+element.nameUser+" "+period.split("_")[period.split("_").length-1]+'" value="'+element.realName+period+'" type="checkbox"></td>'
						}else{
							newDiv=newDiv+'<td><input name="'+element.nameUser+" "+period.split("_")[period.split("_").length-1]+'" value="'+element.realName+period+'" type="checkbox"></td>'
						}
					}else{
						newDiv=newDiv+'<td>  </td>'
					}

				})
				newDiv=newDiv+"</tr>"
				$("#currentSettings #table").append(newDiv)

			})

			if(chart.series[0].type=="column"){
			  $("#currentSettings").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column" checked>Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras  </p>');
			}else{
			  $("#currentSettings").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar" checked>Barras  </p>');
			}
			
			$("#currentSettings").append('<p>Title</p><p><input placeholder="'+this.title+'" id="title" class="form-control"></div></p>')
			$("#currentSettings").append('<button onclick="ChangeValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Create</button>')
			$("#currentSettings").append('<button onclick="deleteSettings()" type="button" class="btn btn-xs btn-default">Cancel</button>')
		}else{
			alert("This graph does not exist or has errors")
		}
	}

	this.redraw= function(){
		this.takeData("Settings");
		var chart = $('#'+id).highcharts();
    	chart.destroy()
		var serieChart= this.Parser(series,configuration["static-"+from].saveData)
		this.Draw(serieChart,this.title)
    	
    	
	}
	
}

HighInfo.prototype = new HighWidget();
