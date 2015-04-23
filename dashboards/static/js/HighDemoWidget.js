//Widget oriented to make a chart of kind AGES with Highcharts

function HighDemo(id,panel,color,typeData,jsons,title,serie,x,y){
	HighWidget.call(this,id,panel,color,16,15)
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button><button onclick="ShowValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.square='<div id= "widget'+this.id+'" class="panel panel-primary widgetDrop" style="border-style: groove;border-color: black;border-width: 3px"><div id="header'+this.id+'" class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';
	this.title=title || "Grafico "+typeData+" "+this.id;
	this.typeData=typeData;
	this.x=x||""
	this.y=y||""
	var series=serie || [];
	if((Object.getOwnPropertyNames(configuration).length === 0)){
		var json= "" ;

	}else{
		var json= jsons || []
		if(jsons!=undefined){
			if(!(jsons[0] in cacheData)){
				cacheData[jsons[0]]={
					"state":0,
					"saveData":{}
				}
			}

			if(!(jsons[1] in cacheData)){
				cacheData[jsons[1]]={
					"state":0,
					"saveData":{}
				}
			}
		}
	}
	this.flatten= function(){
		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
		var wid=$("#widget"+this.id)
		var wid=gridster.serialize(wid)
		var objaux={}
		objaux.x=wid[0].col
		objaux.y=wid[0].row
		objaux.type="HighDemo";
		objaux.series= series;
		objaux.id= this.id;
		objaux.typeData=this.typeData
		objaux.title=this.title;
		objaux.color= this.color;
		objaux.jsons= json
		return objaux
	}

	this.putElement= function(element){
		this.series.push(element)
	}

	//Function that creates a menu where we can select the data that we want represent.
	this.makeMenu= function(){
		if(json!=""){
		  $("#conten").append('<div id="currentCreation"></div>')
		  $("#currentCreation").append('<p>Los ficheros de configuración no han sido cargados con normalidad. Compruebe su conexión<p>');
		  $("#currentCreation").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Continue</button>')
		}else{
		if($("#currentCreation")){
		  $("#currentCreation").remove();
		}
		$("#conten").append('<div id="currentCreation"></div>')
		$("#currentCreation").append('<p><div class="form-group"><label><input id="aging" type="checkbox" value="aging">Aging</label><input placeholder="#4D8FB8" id="agingColor" class="form-control"></div></p>')
		$("#currentCreation").append('<p><div class="form-group"><label><input id="birth" type="checkbox" value="birth">Birth</label><input placeholder="#081923" id="birthColor" class="form-control"></div></p>')
		$("#currentCreation").append('<p>Title</p><p><input placeholder="Demograph graph '+this.typeData+" "+this.id+'" id="title" class="form-control"></div></p>')
		$("#currentCreation").append('<button onclick="FillWidget('+this.id+')" type="button" class="btn btn-xs btn-default">Create</button>')
		$("#currentCreation").append('<button onclick="deleteCreation('+this.id+')" type="button" class="btn btn-xs btn-default">Cancel</button>')
		}
		    
	}

	//This function take the data from the menu created by this widget.
	this.takeData= function(state){
		series=[]
		json=[]
		if(state==undefined){
			state="Creation"
		}
		
		if($("#current"+state+" #title").val()==''){
			this.title=($("#current"+state+" #title").attr("placeholder"))
		}else{
			this.title=$("#current"+state+" #title").val()
		}

		if($("#aging").is(':checked')){

			json.push(configuration.reference+typeData+"-demographics-aging.json")

			if(!(json[json.length-1] in cacheData)){
				cacheData[json[json.length-1]]={
					"state":0,
					"saveData":{}
				}
			}

			
			var colorbar;

			if($("#current"+state+" #agingColor").val()==''){
				colorbar=($("#current"+state+" #agingColor").attr("placeholder"))
			}else{
				colorbar=$("#current"+state+" #agingColor").val()
			}

			var objaux={
			type: "bar",
			name: "aging",
			color: colorbar
			}
			series.push(objaux)
		}

		if($("#birth").is(':checked')){

			json.push(configuration.reference+typeData+"-demographics-birth.json")
			var colorbar;

			if(!(json[json.length-1] in cacheData)){
				cacheData[json[json.length-1]]={
					"state":0,
					"saveData":{}
				}
			}

			if($("#current"+state+" #birthColor").val()==''){
				colorbar=($("#current"+state+" #birthColor").attr("placeholder"))
			}else{
				colorbar=$("#current"+state+" #birthColor").val()
			}

			var objaux={
				type: "bar",
				name: "birth",
				color: colorbar
			}

			series.push(objaux)

		}
		if(series.length==0){
			this.toDraw=false;
			alert("Select one of this options or cancel the creation of widget please")
		}else{
			this.toDraw=true;
			$("#current"+state).remove();
			$("#making").slideUp("slow")
		}
	}

	this.MakeWidget=function(mode){

		var parser= this.Parser
		var createX=this.CreateX
		var draw= this.Draw
		var title= this.title
		var panel= this.panel
		var color= this.color
		var jsons= json
		var drawError = this.drawErrorWidget

		if(mode!="remake"){
			var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
			if(this.x!="" && this.y!=""){
				gridster.add_widget(this.square, this.gridsterWidth, this.gridsterheight,this.x,this.y);

				this.x="";
				this.y="";
			}else{
				gridster.add_widget(this.square, this.gridsterWidth, this.gridsterheight);

			}
			$("#header"+this.id).hide()
			$("#widget"+this.id).click(function(){
				$("#header"+id).slideDown("slow")
			})
			$(document).mouseup(function (e)
				{
				    var container = $("#header"+id);

				    if (!container.is(e.target) // if the target of the click isn't the container...
				        && container.has(e.target).length === 0) // ... nor a descendant of the container
				    {
				        container.slideUp("slow");
				    }
			});
			
		}

		if(series.length==1){

		    //En caso de que la llamada sea positiva serializo con lso datos obtenidos
		    $("#"+id).on("DrawAges"+typeData,function(event,trigger,data){
		      //parseamos los datos
		      var serieChart=[]
			  var dato= parser(data)

			  max=dato.length
			  var objaux={
			        type: "bar",
			        name: series[0].name,
			        data: dato.reverse(),
			        color: series[0].color
			  }

			  serieChart.push(objaux)
			  var axisx=createX(max).reverse()
			  draw(serieChart,axisx,title,panel,color,jsons)
		      $("#"+id).off()
		    })

		    //En caso negativo dibujo un widget roto
		    $("#"+id).on("ErrorGraphAges"+typeData,function(){
		      drawError()
		      $("#"+id).off()
		    })

			//If we haven't the data in cache we will request them
		    if(cacheData[json[0]].state==0){
		      //We actualise the state of data
		      cacheData[json[0]].state.state=1

		      	//The request is on course

		      $.getJSON(json[0]).success(function(data) {
		        cacheData[json[0]].state.state=2
		        cacheData[json[0]].saveData=data

		        //In case of error we will throw the error event
		        $("*").trigger("DrawAges"+typeData,["DrawAges"+typeData,data])
		      }).error(function(){
		        $("*").trigger("ErrorGraphAges"+typeData)

		      })

			//If we have the data in caché we will use it
		    }else if(cacheData[json[0]].state==2){
		      $("#"+this.id).off()
		      var data=cacheData[json[0]].saveData

		      var serieChart=[]
			  var dato= parser(data)

			  max=dato.length
			  var objaux={
			        type: "bar",
			        name: series[0].name,
			        data: dato.reverse(),
			        color: series[0].color
			  }

			  serieChart.push(objaux)
			  var axisx=createX(max).reverse()

			  draw(serieChart,axisx,title,panel,color,jsons)
		    }

		}else if(series.length==2){
			var save=[];
		    $("#"+this.id).on("DrawAgesD"+typeData,function(event,trigger){

		      	var serieChart=[]

				if(parser(save[0]).length>=parser(save[1]).length){
					max=parser(save[0]).length
				}else{
					max=parser(save[1]).length
				}

				var dato=parser(save[0]).reverse()

				var objaux={
				    type: "bar",
				    name: series[0].name,
				    data: dato,
				    color: series[0].color
				}
				serieChart.push(objaux)

				var dato=parser(save[1]).reverse()

				var objaux={
				    type: "bar",
				    name: series[1].name,
				    data: dato,
				    color: series[1].color
				}

				serieChart.push(objaux)

				var axisx=createX(max).reverse();

				draw(serieChart,axisx,title,panel,color,jsons)

		      	$("#"+this.id).off()
		    })

		    $("#"+this.id).on("ErrorGraphAgesD"+typeData,function(){
		      drawError()
		      $("#"+this.id).off()
		    })

			if((cacheData[json[0]].state==0) || (cacheData[json[1]].state==0)){
				cacheData[json[0]].state=1
				cacheData[json[1]].state=1
				$.when(

					$.getJSON(json[0]).success(function(data) { 
					    save[0] = data;
					}),
					$.getJSON(json[1]).success(function(data) {
					    save[1] = data;
					})
				).done(function() {
			        cacheData[json[0]].state=2
			        cacheData[json[0]].saveData=save[0]

			        cacheData[json[1]].state=2
			        cacheData[json[1]].saveData=save[1]

			        $("*").trigger("DrawAgesD"+typeData,["DrawAgesD"+typeData,data])

				}).fail(function(){
					cacheData[json[0]].state=0
					cacheData[json[1]].state=0

					$("*").trigger("ErrorGraphAgesD"+typeData)

				})

		    }else if((cacheData[json[0]].state==2) && (cacheData[json[1]].state)){
		    	$("#"+this.id).off()
				var serieChart=[]

				if(parser(cacheData[json[0]].saveData).length>=parser(cacheData[json[1]].saveData).length){
					max=parser(cacheData[json[0]].saveData).length
				}else{
					max=parser(cacheData[json[1]].saveData).length
				}

				var dato=parser(cacheData[json[0]].saveData).reverse()

				var objaux={
				    type: "bar",
				    name: series[0].name,
				    data: dato,
				    color: series[0].color
				}

				serieChart.push(objaux)

				var dato=parser(cacheData[json[1]].saveData).reverse()

				var objaux={
				    type: "bar",
				    name: series[1].name,
				    data: dato,
				    color: series[1].color
				}
				serieChart.push(objaux)

				var axisx=createX(max).reverse();

				draw(serieChart,axisx,title,panel,color,jsons)
				      
		    }
		}
	}

	this.Parser=function(data){
		
		var aux=0;
		var result=[];

		data.persons.age.forEach(function(element){
			aux=Math.floor(element.split(" days,")[0]/181);
			if(result[aux]==undefined){
			  result[aux]=1;
			}else{
			  result[aux]+=1;
			}
		})
		return result;
	}

	this.CreateX=function(max){
		
		var result=[];
		for (i = 0; i < max; i++) {
			result[i]= (i*181)+"-"+((i+1)*181)
		}
		return result
	}

	this.Draw= function(serie,axisx,title,panel,color,json){
		$("#load"+id).remove()

		var options={
			chart:{
			    renderTo:id.toString(),
			    width: 460,
			    height: 405
			},
			credits: {
     		 enabled: false
  		  	},
			xAxis: {
			  categories: axisx
			},

			plotOptions: {
			            series: {
			                cursor: 'pointer',
			                point: {
			                    events: {
			                        click: function () {
			                        	numWidget++
			                       		var widget= new HighAutors(numWidget,panel,color,json,title,this.category);
			                       		widget.MakeWidget();
			                        }
			                    }
			                }
			            }
			        },

			title: {
			    text: title
			},
			series: serie,
		}

		chart= new Highcharts.Chart(options);
	}

	this.getSeries= function(){
		return series;
	}
	
	//Function that creates a menu where we can select the data that we want represent.
	//In this case, there will be some checkbox selected with the data that the widget already has.
	this.settings= function(){
		var chart = $('#'+id).highcharts();
		var getSerie= this.getSerie
		var existLabel= this.existLabel
		if(chart!=undefined){

			$("#conten").append('<div id="currentSettings"></div>')

			if(existLabel(chart,"aging")){
				auxseries=getSerie(chart,"aging");
				$("#currentSettings").append('<p><div class="form-group"><label><input id="aging" type="checkbox" value="aging" checked>Aging</label><input placeholder="'+auxseries.color+'" id="agingColor" class="form-control"></div></p>')
			}else{
				$("#currentSettings").append('<p><div class="form-group"><label><input id="aging" type="checkbox" value="aging">Aging</label><input placeholder="#4D8FB8" id="agingColor" class="form-control"></div></p>')
			}

			if(existLabel(chart,"birth")){
				auxseries=getSerie(chart,"birth");
				$("#currentSettings").append('<p><div class="form-group"><label><input id="birth" type="checkbox" value="birth" checked>Birth</label><input placeholder="'+auxseries.color+'" id="birthColor" class="form-control"></div></p>')
			}else{
				$("#currentSettings").append('<p><div class="form-group"><label><input id="birth" type="checkbox" value="birth">Birth</label><input placeholder="#081923" id="birthColor" class="form-control"></div></p>')
			}
			$("#currentSettings").append('<p>Title</p><p><input placeholder="'+chart.title.textStr+'" id="title" class="form-control"></div></p>')
			$("#currentSettings").append('<button onclick="ChangeValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Create</button>')
			$("#currentSettings").append('<button onclick="deleteSettings()" type="button" class="btn btn-xs btn-default">Cancel</button>')
		}else{
			alert("This graph does not exist or has errors")
		}

	}

	this.redraw= function(){
		var chart = $('#'+id).highcharts();
    	chart.destroy()

    	this.takeData("Settings");
		this.MakeWidget("remake")
    
	}

}

HighDemo.prototype = new HighWidget();
