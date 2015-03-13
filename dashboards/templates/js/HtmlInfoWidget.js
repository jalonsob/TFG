//Widget oriented to make a charts with Highcharts

function HtmlInfoWidget(id,panel,color,json,serie){
	HighWidget.call(this,id,panel,color,12,7)
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button><button onclick="ShowValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.square='<div id= "widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	var series=serie || {up:[],down:[]};
	if((Object.getOwnPropertyNames(takeinfo).length === 0) || (Object.getOwnPropertyNames(configuration).length === 0)){
		var json= "" ;

	}else{
		var json= takeinfo.static.inside
	}
	this.flatten= function(){
		var objaux={}
		objaux.type="HtmlInfoWidget";
		objaux.series= series;
		objaux.id= id;
		objaux.color= color;
		objaux.jsons= json
		return objaux
	}

	//Function that creates a menu where we can select the data that we want represent.
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
			$("#conten").append('<div id="currentCreation"> Up: <p id="up" style="height: 150px; overflow-y: scroll;"></p>Down: <p id="down" style="height: 150px; overflow-y: scroll;"></p></div>')
			keys.forEach(function(element){
				$("#currentCreation #up").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
				$("#currentCreation #down").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')

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
	      }
	      selected.up.push(objaux);
    	});

    	$("#current"+state+" #down input[type='checkbox']:checked").each(function() {
	      objaux={
	        name:$(this).attr('value'),
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

		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
		gridster.add_widget(this.square, this.gridsterWidth, this.gridsterheight);
		//In the right way i will draw the graph
		$("#"+this.id).on("DrawInfoHTML",function(event,trigger,data){
			
			var up="";
			selected.up.forEach(function(element){
				up=  up+'<div style="float: left; width: '+(100/selected.up.length)+'%;"><p><strong>'+element.name+':</strong></p><p>'+data[element.name]+'</p></div>'
			})
			var down="";
			selected.down.forEach(function(element){
				down=  down+'<div style="float: left; width: '+(100/selected.down.length)+'%;"><p><strong>'+element.name+':</strong></p><p>'+data[element.name]+'</p></div>'
			})
			result=up+"<hr>"+down
			$("#"+this.id).html(result)
			$("#"+this.id).off()

		})

		//In the wrong way i will draw an error widget
		$("#"+this.id).on("ErrorGraphInfoHTML",function(){
		  drawError()
		  $("#"+this.id).off()
		})

		//If we haven't the data in cache we will request them
		if(takeinfo.static.state==0){
			//We actualise the state of data
			takeinfo.static.state=1;
			//The request is on course

			$.getJSON(takeinfo.static.inside).success(function(data) {
			    takeinfo.static.saveData=data
			    takeinfo.static.state=2;

			    $("*").trigger("DrawInfoHTML",["DrawInfoHTML",data])
			  }).error(function(){
			    //In case of error we will throw the error event
			    $("*").trigger("ErrorGraphInfoHTML")
			    takeinfo.static.static=0;

			});
		}else if(takeinfo.static.state==2){
			
			$("*").trigger("DrawInfoHTML",["DrawInfoHTML",takeinfo.static.saveData])

		}		
	}

	//Function that creates a menu where we can select the data that we want represent.
	//In this case, there will be some checkbox selected with the data that the widget already has.
	this.settings= function(){
		var keys=configuration.static
		var existLabel=this.existLabel

		if($("#currentSettings")){
			$("#currentSettings").remove();
		}
		
		$("#conten").append('<div id="currentSettings"> Up: <p id="up" style="height: 150px; overflow-y: scroll;"></p>Down: <p id="down" style="height: 150px; overflow-y: scroll;"></p></div>')
		keys.forEach(function(element){
			if(existLabel("up",element)){
				$("#currentSettings #up").append('<p><input checked type="checkbox" value="'+element+'"> '+element+'</p>')
			}else{
				$("#currentSettings #up").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')

			}
			if(existLabel("down",element)){
				$("#currentSettings #down").append('<p><input checked type="checkbox" value="'+element+'"> '+element+'</p>')

			}else{
				$("#currentSettings #down").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
			}
		})
		$("#currentSettings").append('<button onclick="ChangeValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Create</button>')
		$("#currentSettings").append('<button onclick="deleteSettings()" type="button" class="btn btn-xs btn-default">Cancel</button>')
	}

	this.existLabel= function(where,label){
		var result=false;
		series[where].forEach(function(element){
			if(element.name==label){
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
			up=  up+'<div style="float: left; width: '+(100/series.up.length)+'%;"><p><strong>'+element.name+':</strong></p><p>'+takeinfo.static.saveData[element.name]+'</p></div>'
		})
		var down="";
		series.down.forEach(function(element){
			down=  down+'<div style="float: left; width: '+(100/series.down.length)+'%;"><p><strong>'+element.name+':</strong></p><p>'+takeinfo.static.saveData[element.name]+'</p></div>'
		})
		var result=up+"<hr>"+down
		$("#"+this.id).html(result)
	}
	

}

HtmlInfoWidget.prototype = new Widget();