//Widget oriented to make a chart of kind TIMES with Highcharts

function HighTime(id,panel,color,typeData,readingData,json,title,serie,from,to,size,x,y){
		
	var months =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var ages=[];

	var today = new Date();
	var month = today.getMonth();
	var firstAge=1970
	var lastAge= today.getFullYear();
	for(i=firstAge; i<=lastAge; i++){
		months.forEach(function(element){
			ages.push(element+" "+i)
		})
	}
	

	this.x=x||""
	this.y=y||""
	this.readingData=readingData
	var series=serie || [];
	if((Object.getOwnPropertyNames(configuration).length === 0)){
		var json= "" ;

	}else{
		if(typeData==this.readingData){
			var json= configuration["reference"]+typeData+"-evolutionary.json"
		}else{
			var json= configuration["reference"]+this.readingData+"-"+typeData+"-com-evolutionary.json"
		}
	}
	if(!(json in cacheData)){
		cacheData[json]={
			"state":0,
			"saveData":{}
		}
	}
	this.typeData=typeData;
	if(size!=undefined){
		this.size=size
		if((this.size)<=12 && (this.size)>=8){
			this.gridsterWidth=14;
			this.gridsterheight=12;

		}else if((this.size)<8){
			this.gridsterWidth=11;
			this.gridsterheight=10;

		}else{
			this.gridsterWidth=27;
			this.gridsterheight=13;

		}
	}else{
		this.size=0
	}

	HighWidget.call(this,id,panel,color,this.gridsterWidth,this.gridsterheight)

	this.from=from || "";
	this.to=to || "";
	if(typeData==this.readingData){
		this.title=title || "Graph "+typeData+" evolutionary "+this.id;

	}else{
		this.title=title || "Graph "+typeData+" from "+this.readingData+" info "+this.id;

	}
	
	this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button><button onclick="ShowValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
	this.square='<div id= "widget'+this.id+'" class="panel panel-primary widgetDrop" style="border-style: groove;border-color: black;border-width: 3px"><div id="header'+this.id+'" class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';

	this.flatten= function(){
		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
		var wid=$("#widget"+this.id)
		var wid=gridster.serialize(wid)
		var objaux={}

		objaux.type="HighTime";
		objaux.x=wid[0].col
		objaux.y=wid[0].row
		objaux.series= series;
		objaux.id= this.id;
		objaux.title=this.title;
		objaux.color= this.color;
		objaux.typeData=this.typeData
		objaux.readingData=this.readingData
		objaux.jsons= json
		objaux.from= this.from;
		objaux.to= this.to;
		objaux.size= this.size

		return objaux
	}

	//Function that creates a menu where we can select the data that we want represent.
	this.makeMenu= function(){

		if(json==""){
			$("#conten").append('<div id="currentCreation"></div>')
			$("#currentCreation").append('<p>Los ficheros de configuración no han sido cargados con normalidad. Compruebe su conexión<p>');
			$("#currentCreation").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Continue</button>')
		}else{

			if($("#currentCreation")){
				$("#currentCreation").remove();
			}

			$("#conten").append('<div id="currentCreation"><div id="list" style="height: 200px; overflow-y: scroll;"></div></div>')

			configuration["evolutionary-"+typeData].values.forEach(function(element){
				$("#currentCreation #list").append('<p><button onclick="resetRatios('+element.realName+'_$bar,'+element.realName+'_$line)" type="button" class="btn btn-xs btn-default">Reset </button>    '+element.nameUser+':   <input id="'+element.realName+'_$bar" type="radio" name="'+element.nameUser+'" class="radios" value="column">Barras<input id="'+element.realName+'_$line" type="radio" name="'+element.nameUser+'" class="radios" value="spline">Lineas</p>')
			})

			$("#currentCreation").append('From')
			$("#currentCreation").append('<select id="from" class="form-control">')

			for(i=firstAge; i<=lastAge; i++){
				months.forEach(function(element){
					$("#currentCreation #from").append('<option value="'+element+" "+i+'">'+element+" "+i+'</option>')
				})
			}		

			$("currentCreation").append('</select>')

			$("#currentCreation").append('To')
			$("#currentCreation").append('<select id="to" class="form-control">')

			for(i=firstAge; i<=lastAge; i++){
				months.forEach(function(element){
					$("#currentCreation #to").append('<option value="'+element+" "+i+'">'+element+" "+i+'</option>')
				})
			}
			$("#currentCreation").append('</select>')
			$("#to").val(months[month]+" "+lastAge)

			$("#currentCreation").append('<p>Title</p><p><input placeholder="'+this.title+'" id="title" class="form-control"></div></p>')
			$("#currentCreation").append('<button onclick="FillWidget('+this.id+')" type="button" class="btn btn-xs btn-default">Create</button>')
			$("#currentCreation").append('<button onclick="deleteCreation('+this.id+')" type="button" class="btn btn-xs btn-default">Cancel</button>')
    	}
	}

	//This function take the data from the menu created by this widget.
	this.takeData= function(state){

		if(state==undefined){
			state="Creation"
		}

		//Taking selected metrics 
		var selected = [];
		$("#current"+state+" input[type='radio']:checked").each(function() {
			objaux={
				name:$(this).attr("id").split("_"+$(this).attr("id").split("_")[$(this).attr("id").split("_").length-1])[0],
				nameUser:$(this).attr('name'),
				form: $(this).attr('value')
			}
			selected.push(objaux);
		});


		if($("#current"+state+" #title").val()==''){
			this.title=($("#current"+state+" #title").attr("placeholder"))
		}else{
			this.title=$("#current"+state+" #title").val()
		}
		this.to=$("#to option:selected").text()
		this.from=$("#from option:selected").text()

		this.size= ages.indexOf(this.to) - ages.indexOf(this.from) +1;

		if((this.size)<=12 && (this.size)>=8){

			this.gridsterWidth=14;
			this.gridsterheight=12;

		}else if((this.size)<8){

			this.gridsterWidth=11;
			this.gridsterheight=10;

		}else{

			this.gridsterWidth=27;
			this.gridsterheight=13;

		}
		if(selected.length!=0){
			if(this.size>0){
				series=selected
				
				this.toDraw=true;

				$("#current"+state).remove();
		    	$("#making").slideUp("slow")
			}else{
				alert("The interval between months should be increased.")
				this.toDraw=false;
			}
			
		}else{
			this.toDraw=false;
			alert("We can not represent a graph without data")
		}
	}

	this.MakeWidget=function(){
		var parser=this.Parser;
		var draw=this.Draw;
		var title= this.title;
		var from= this.from;
		var to= this.to;
		var size= this.size;
		var serie= this.series;
		var createX= this.CreateX
		var drawError = this.drawErrorWidget
		var id=this.id

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
			
		//In the right way i will draw the graph
		$("#"+this.id).on("DrawTimes"+typeData+json,function(event,trigger,data,serie){
			
			var serieChart= parser(from,to,data,series);
		    var x= createX(data,from,to)
		    draw(serieChart,x,title,size,this.id)
			$("#"+this.id).off()
		})

		//In the wrong way i will draw an error widget
		$("#"+this.id).on("ErrorGraphTimes"+typeData+json,function(){
		    drawError()
			$("#"+this.id).off()
		})

		//If we haven't the data in cache we will request them
		if(cacheData[json].state==0){
			//We actualise the state of data
			cacheData[json].state==1;
			//The request is on course

			$.getJSON(json).success(function(data){

			  //We actualise the state of data again
			  cacheData[json].saveData=data
			  cacheData[json].state=2;

			  $("*").trigger("DrawTimes"+typeData+json,["DrawTimes"+typeData+json,data,serie])
			 
			}).error(function(){
			  //In case of error we will throw the error event
			  $("*").trigger("ErrorGraphTimes"+typeData+json)
			  takeinfo.static.static=0;
			});
		}else if(cacheData[json].state==2){
			//If we have the data in caché we will use it
		
			$("#"+this.id).off()
			var serieChart= parser(from,to,cacheData[json].saveData,series);
		
		    var x= createX(cacheData[json].saveData,from,to)
		    
		    draw(serieChart,x,title,size,this.id)
		
		}
	}

	//This function is useful to parse the data and flatten them to draw this widget.
	this.Parser=function(from,to,data,serie){
		var selection=[];
		var dataAux;
		serie.forEach(function(element){
		  dataAux=data[element.name]
		  var arrayAux=[]
		  for(i=ages.indexOf(from);i<=ages.indexOf(to);i++){
		  	if(data.date.indexOf(ages[i])==-1){
		  		arrayAux.push(0)
		  	}else{
		  		arrayAux.push(dataAux[data.date.indexOf(ages[i])])
		  	}
		  }
		  obj={
		      type: element.form,
		      name: element.nameUser,
		      data: arrayAux
		  }
		  selection.push(obj)
		})

		return selection;
	}

	this.CreateX=function(data,from,to){		
		return ages.slice(ages.indexOf(from),ages.indexOf(to)+1)
	}

	this.Draw= function(serie,x,title,size,id){
		
  	  $("#load"+id).remove()

	  if((size)<=12 && (size)>=8){
	    var options={
	      chart:{
	          renderTo:id.toString(),
	          width: 415,
	          height: 307
	      },
	      credits: {
     		 enabled: false
  		  },
	      yAxis:{
	      	floor:0,
	      	title: {
                text: ''
            }
	      },
	      xAxis: {
	        categories: x,
	        tickInterval: 2

	      },
	      title: {
	          text: title
	      },
	      series: serie,
	      
	    }

	  }else if((size)<8){
	    var options={
	      chart:{
	          renderTo:id.toString(),
	          width: 315,
	          height: 240
	      },
	      credits: {
     		 enabled: false
  		  },
	      yAxis:{
	      	floor:0,
	      	title: {
                text: ''
            }
	      },
	      xAxis: {
	        categories: x
	      },
	      title: {
	          text: title
	      },
	      series: serie,
	    }

	  }else{
	    var options={
	      chart:{
	          renderTo:id.toString(),
	          width: 830,
	          height: 339
	      },
	      credits: {
     		 enabled: false
  		  },
	      yAxis:{
	      	floor:0,
	      	title: {
                text: ''
            }
	      },
	      xAxis: {
	        categories: x,
	        tickInterval: 20,
	        labels : { y : 20, rotation: -35, align: 'right' } 

	      },
	      title: {
	          text: title
	      },
	      series: serie,
	      
	    }
	  }
	  var chart= new Highcharts.Chart(options);

	}

	this.getSeries= function(){
		return series;
	}

	//Function that creates a menu where we can select the data that we want represent.
	//In this case, there will be some checkbox selected with the data that the widget already has.
	this.settings= function(){
		var chart = $('#'+this.id).highcharts();
		var keys=configuration["evolutionary-"+typeData].values
		var auxseries;
		var getSerie=this.getSerie
		var existLabel= this.existLabel
		var months =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		var firstAge=1970;
		var today = new Date();
		var lastAge = today.getFullYear();

		$("#making").slideDown("slow")

		if($("#currentSettings")){
		$("#currentSettings").remove();
		}
		$("#conten").append('<div id="currentSettings"><div id="list" style="height: 200px; overflow-y: scroll;"></div></div>')

		keys.forEach(function(element){
			if(existLabel(chart,element.nameUser)){
			  auxseries=getSerie(chart,element.nameUser);
			  if(auxseries.type=="column"){
			  	$("#currentSettings #list").append('<p><button onclick="resetRatios('+element.realName+'_$bar,'+element.realName+'_$line)" type="button" class="btn btn-xs btn-default">Reset </button>    '+element.nameUser+':   <input id="'+element.realName+'_$bar" type="radio" name="'+element.nameUser+'" class="radios" value="column" checked>Barras<input id="'+element.realName+'_$line" type="radio" name="'+element.nameUser+'" class="radios" value="spline">Lineas</p>')
			  }else{
			  	$("#currentSettings #list").append('<p><button onclick="resetRatios('+element.realName+'_$bar,'+element.realName+'_$line)" type="button" class="btn btn-xs btn-default">Reset </button>    '+element.nameUser+':   <input id="'+element.realName+'_$bar" type="radio" name="'+element.nameUser+'" class="radios" value="column" >Barras<input id="'+element.realName+'_$line" type="radio" name="'+element.nameUser+'" class="radios" value="spline" checked>Lineas</p>')
			  }
			}else{
			  	$("#currentSettings #list").append('<p><button onclick="resetRatios('+element.realName+'_$bar,'+element.realName+'_$line)" type="button" class="btn btn-xs btn-default">Reset </button>    '+element.nameUser+':   <input id="'+element.realName+'_$bar" type="radio" name="'+element.nameUser+'" class="radios" value="column" >Barras<input id="'+element.realName+'_$line" type="radio" name="'+element.nameUser+'" class="radios" value="spline">Lineas</p>')
			}
		})
		$("#currentSettings").append('From')
		$("#currentSettings").append('<select id="from" class="form-control">')
		for(i=firstAge; i<=lastAge; i++){
			months.forEach(function(element){
				$("#currentSettings #from").append('<option value="'+element+" "+i+'">'+element+" "+i+'</option>')
			})
		}
		
		$("#currentSettings").append('</select>')
		$("#currentSettings").append('To')
		$("#currentSettings").append('<select id="to" class="form-control">')
		for(i=firstAge; i<=lastAge; i++){
			months.forEach(function(element){
				$("#currentSettings #to").append('<option value="'+element+" "+i+'">'+element+" "+i+'</option>')
			})
		}
		$("#currentSettings").append('</select>')

		var position=chart.series[0].data.length-1;
		var position2= ages.indexOf(chart.series[0].data[position-1].category)
		var month= ages[position2+1]

		$("#from").val(chart.series[0].data[0].category)
		$("#to").val(ages[position2+1])
		$("#currentSettings").append('<p>Title</p><p><input placeholder="'+this.title+'" id="title" class="form-control"></div></p>')
		$("#currentSettings").append('<button onclick="ChangeValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Redraw</button>')
		$("#currentSettings").append('<button onclick="deleteSettings()" type="button" class="btn btn-xs btn-default">Cancel</button>')

	}

	this.redraw= function(){
		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
  		gridster.remove_widget("#widget"+this.id);

  		this.id=numWidget+1
  		numWidget++

		this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button><button onclick="ShowValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
		this.square='<div id= "widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div id="header'+this.id+'" class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';

  		this.takeData("Settings");
  		this.MakeWidget()
	}
	
}

HighTime.prototype = new HighWidget();
