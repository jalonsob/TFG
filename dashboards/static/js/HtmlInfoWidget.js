//Widget oriented to make a charts with Highcharts

function HtmlInfoWidget(id,panel,color,typeData,readingData,json,serie){
	HighWidget.call(this,id,panel,color,12,7)
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button><button onclick="ShowValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.square='<div id= "widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	var series=serie || {up:[],down:[]};
	this.typeData=typeData
	this.readingData=readingData

	if((Object.getOwnPropertyNames(configuration).length === 0)){
		var json= "" ;

	}else{
		if(typeData==this.readingData){
			var json= configuration["reference"]+typeData+"-static.json"
		}else{
			var json=configuration["reference"]+this.readingData+"-"+typeData+"-com-static.json"
		}
	}

	if(!(json in cacheData)){
		cacheData[json]={
			"state":0,
			"saveData":{}
		}
	}
	this.flatten= function(){
		var objaux={}
		objaux.type="HtmlInfoWidget";
		objaux.series= series;
		objaux.id= id;
		objaux.typeData=this.typeData
		objaux.readingData=this.readingData
		objaux.color= color;
		objaux.jsons= json
		return objaux
	}

	//Function that creates a menu where we can select the data that we want represent.
	this.makeMenu= function(){
		var keys= configuration["static-"+typeData].values
		if(json==""){
			$("#conten").append('<div id="currentCreation"></div>')
			$("#currentCreation").append('<p>Configuration files have not been loaded well. Please check your internet connection.<p>');
			$("#currentCreation").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Continue</button>')
		}else{
			if($("#currentCreation")){
				$("#currentCreation").remove();
			}
			$("#conten").append('<div id="currentCreation"> Up: <div id="up" style="height: 150px; overflow-y: scroll;"><table id="tableUp" style="width:100%"></table></div>Down: <div id="down" style="height: 150px; overflow-y: scroll;"><table id="tableDown" style="width:100%"></table></div></div>')

			var titles="<tr><td>Periods</td>";
			configuration["static-"+typeData].periods.forEach(function(period){
				if(period==""){
					titles=titles+"<td>Total</td>"
				}else{
					titles=titles+"<td>"+period+"</td>"
				}
			})
			titles=titles+"</tr>"

			$("#currentCreation #tableUp").append(titles)
			$("#currentCreation #tableDown").append(titles)

			keys.forEach(function(element){
				var newDivUp="<tr><td>"+element.nameUser+"</td>"
				var newDivDown="<tr><td>"+element.nameUser+"</td>"

				configuration["static-"+typeData].periods.forEach(function(period){

					if(element.periods.indexOf(period)!=-1){
							newDivUp=newDivUp+'<td><input type="checkbox" name="'+element.nameUser+" "+period.split("_")[period.split("_").length-1]+'" value="'+element.realName+period+'"> </td>'
							newDivDown=newDivDown+'<td><input type="checkbox" name="'+element.nameUser+" "+period.split("_")[period.split("_").length-1]+'" value="'+element.realName+period+'"></td>'

					}else{
							newDivUp=newDivUp+'<td>  </td>'
							newDivDown=newDivDown+'<td>  </td>'

					}
				})
				newDivUp=newDivUp+"</tr>"
				newDivDown=newDivDown+"</tr>"

				$("#currentCreation #tableUp").append(newDivUp)
				$("#currentCreation #tableDown").append(newDivDown)

			})
			$("#currentCreation").append('<button onclick="FillWidget('+id+')" type="button" class="btn btn-xs btn-default">Create</button>')
			$("#currentCreation").append('<button onclick="deleteCreation('+id+')" type="button" class="btn btn-xs btn-default">Cancel</button>')
		}
		    
		    
	}
	//This function take the data from the menu created by this widget.
	this.takeData= function(state){
		var selected={up:[],down:[]}
		if(state==undefined){
			state="Creation"
		}
	    //Taking selected metrics 
	    
	    $("#current"+state+" #up input[type='checkbox']:checked").each(function() {
	      objaux={
	        name:$(this).attr('value'),
	        nameUser: $(this).attr('name')
	      }
	      selected.up.push(objaux);
    	});

    	$("#current"+state+" #down input[type='checkbox']:checked").each(function() {
	      objaux={
	        name:$(this).attr('value'),
	        nameUser: $(this).attr('name')
	      }
	      selected.down.push(objaux);
    	});
    	
	    
    	
	    if(selected.length!=0){
	      $("#current"+state).remove();
	      $("#making").slideUp("slow")
	      this.toDraw=true;
	      series=selected
	    }else{
	      alert("We can not represent a graph without data")
	      this.toDraw=false;
	    }
  	
	}

	this.MakeWidget=function(){
		var selected= series;
		var drawError = this.drawErrorWidget
		var readingData=this.readingData

		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
		gridster.add_widget(this.square, this.gridsterWidth, this.gridsterheight);
		//In the right way i will draw the graph
		$("#"+this.id).on("DrawInfoHTML"+typeData+json,function(event,trigger,data){
			var up="";
			selected.up.forEach(function(element){
				up=  up+'<div style="float: left; width: '+(100/selected.up.length)+'%;"><p><strong>'+element.nameUser+':</strong></p><p>'+data[element.name]+'</p></div>'
			})
			var down="";
			selected.down.forEach(function(element){
				down=  down+'<div style="float: left; width: '+(100/selected.down.length)+'%;"><p><strong>'+element.nameUser+':</strong></p><p>'+data[element.name]+'</p></div>'
			})
			if(readingData==typeData){
				result='<p>Stadistics from '+typeData+" "+this.id+'</p>'+up+"<hr>"+down

			}else{
				result='<p>Stadistics from '+typeData+' '+readingData+" "+this.id+'</p>'+up+"<hr>"+down

			}
			$("#"+this.id).html(result)
			$("#"+this.id).off()

		})

		//In the wrong way i will draw an error widget
		$("#"+this.id).on("ErrorGraphInfoHTML"+typeData+json,function(){
		  drawError()
		  $("#"+this.id).off()
		})

		//If we haven't the data in cache we will request them
		if(cacheData[json].state==0){
			//We actualise the state of data
			cacheData[json].state=1;
			//The request is on course

			$.getJSON(json).success(function(data) {
			    cacheData[json].saveData=data
			    cacheData[json].state=2;

			    $("*").trigger("DrawInfoHTML"+typeData+json,["DrawInfoHTML"+typeData+json,data])
			  }).error(function(){
			    //In case of error we will throw the error event
			    $("*").trigger("ErrorGraphInfoHTML"+typeData+json)
			    cacheData[json].state=0;

			});
		}else if(cacheData[json].state==2){
			data=cacheData[json].saveData
			$("*").trigger("DrawInfoHTML"+typeData+json,["DrawInfoHTML"+typeData+json,data])

		}		
	}

	//Function that creates a menu where we can select the data that we want represent.
	//In this case, there will be some checkbox selected with the data that the widget already has.
	this.settings= function(){
		var keys=configuration["static-"+typeData].values
		var existLabel=this.existLabel

		if($("#currentSettings")){
			$("#currentSettings").remove();
		}
		
		$("#conten").append('<div id="currentSettings"> Up: <div id="up" style="height: 150px; overflow-y: scroll;"><table id="tableUp" style="width:100%"></table></div>Down: <div id="down" style="height: 150px; overflow-y: scroll;"><table id="tableDown" style="width:100%"></table></div></div>')

			var titles="<tr><td>Periods</td>";
			configuration["static-"+typeData].periods.forEach(function(period){
				if(period==""){
					titles=titles+"<td>Total</td>"
				}else{
					titles=titles+"<td>"+period+"</td>"
				}
			})
			titles=titles+"</tr>"

			$("#currentSettings #tableUp").append(titles)
			$("#currentSettings #tableDown").append(titles)

			keys.forEach(function(element){
				var newDivUp="<tr><td>"+element.nameUser+"</td>"
				var newDivDown="<tr><td>"+element.nameUser+"</td>"

				configuration["static-"+typeData].periods.forEach(function(period){

					if(element.periods.indexOf(period)!=-1){
						if(existLabel("up",element.nameUser+" "+period.split("_")[period.split("_").length-1])){
							
							newDivUp=newDivUp+'<td><input checked type="checkbox" name="'+element.nameUser+" "+period.split("_")[period.split("_").length-1]+'" value="'+element.realName+period+'"> </td>'

						}else{
							newDivUp=newDivUp+'<td><input type="checkbox" name="'+element.nameUser+" "+period.split("_")[period.split("_").length-1]+'" value="'+element.realName+period+'"> </td>'

						}
						if(existLabel("down",element.nameUser+" "+period.split("_")[period.split("_").length-1])){
							newDivDown=newDivDown+'<td><input checked type="checkbox" name="'+element.nameUser+" "+period.split("_")[period.split("_").length-1]+'" value="'+element.realName+period+'"></td>'
						
						}else{
							newDivDown=newDivDown+'<td><input type="checkbox" name="'+element.nameUser+" "+period.split("_")[period.split("_").length-1]+'" value="'+element.realName+period+'"></td>'

						}

					}else{
							newDivUp=newDivUp+'<td>  </td>'
							newDivDown=newDivDown+'<td>  </td>'

					}
				})
				newDivUp=newDivUp+"</tr>"
				newDivDown=newDivDown+"</tr>"

				$("#currentSettings #tableUp").append(newDivUp)
				$("#currentSettings #tableDown").append(newDivDown)

			})
		$("#currentSettings").append('<button onclick="ChangeValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Create</button>')
		$("#currentSettings").append('<button onclick="deleteSettings()" type="button" class="btn btn-xs btn-default">Cancel</button>')
	}

	this.existLabel= function(where,label){
		var result=false;
		series[where].forEach(function(element){
			if(element.nameUser==label){
				result=true;
				return false;
			}
		})
		return result
	}

	this.redraw= function(){
		this.takeData("Settings");
		var up="";
		series.up.forEach(function(element){
			up=  up+'<div style="float: left; width: '+(100/series.up.length)+'%;"><p><strong>'+element.nameUser+':</strong></p><p>'+cacheData[json].saveData[element.name]+'</p></div>'
		})
		var down="";
		series.down.forEach(function(element){
			down=  down+'<div style="float: left; width: '+(100/series.down.length)+'%;"><p><strong>'+element.nameUser+':</strong></p><p>'+cacheData[json].saveData[element.name]+'</p></div>'
		})
		if(this.readingData==typeData){
			result='<p>Stadistics from '+typeData+" "+this.id+'</p>'+up+"<hr>"+down

		}else{
			result='<p>Stadistics from '+typeData+' '+this.readingData+" "+this.id+'</p>'+up+"<hr>"+down

		}
		$("#"+this.id).html(result)
	}
	

}

HtmlInfoWidget.prototype = new Widget();
