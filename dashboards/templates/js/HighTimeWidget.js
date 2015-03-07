//Widget oriented to make a chart of kind TIMES with Highcharts

function HighTime(id,panel,color,json,title,serie,from,to,size){

	var series=serie || [];
	if((Object.getOwnPropertyNames(takeinfo).length === 0) || (Object.getOwnPropertyNames(configuration).length === 0)){
		var json= "" ;

	}else{
		var json= takeinfo.evolutionary.inside;
	}

	if(size!=undefined){
		this.size=size
		if((this.size)<=12 && (this.size)>=8){
			this.gridsterWidth=15;
			this.gridsterheight=12;

		}else if((this.size)<8){
			this.gridsterWidth=12;
			this.gridsterheight=8;

		}else{
			this.gridsterWidth=31;
			this.gridsterheight=13;

		}
	}else{
		this.size=0
	}

	HighWidget.call(this,id,panel,color,this.gridsterWidth,this.gridsterheight)


	this.from=from || "";
	this.to=to || "";
	this.title=title || "Grafico "+this.id;
	
	this.square='<div id="widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body"><img id="load'+this.id+'" src="/templates/images/cargando.gif" height="42" width="42"></div></div>';

	this.flatten= function(){
		var objaux={}

		objaux.type="HighTime";
		objaux.series= series;
		objaux.id= this.id;
		objaux.title=this.title;
		objaux.color= this.color;
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

			configuration.evolutionary.forEach(function(element){
				$("#currentCreation #list").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column">Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline">Lineas    <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>')
			})

			$("#currentCreation").append('From')
			$("#currentCreation").append('<select id="from" class="form-control">')

			configuration.time.forEach(function(element){
				$("#currentCreation #from").append('<option value="'+element+'">'+element+'</option>')
			})

			$("currentCreation").append('</select>')

			$("#currentCreation").append('To')
			$("#currentCreation").append('<select id="to" class="form-control">')

			configuration.time.forEach(function(element){
			$("#currentCreation #to").append('<option value="'+element+'">'+element+'</option>')
			})

			$("#currentCreation").append('</select>')
			$("#to").val(configuration.time[configuration.time.length-1])

			$("#currentCreation").append('<p>Title</p><p><input placeholder="Time graph '+this.id+'" id="title" class="form-control"></div></p>')
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
			name:$(this).attr('name'),
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
		
		this.size= configuration.time.indexOf(this.to.toString()) - configuration.time.indexOf(this.from.toString()) +1;

		if((this.size)<=12 && (this.size)>=8){

			this.gridsterWidth=15;
			this.gridsterheight=12;

		}else if((this.size)<8){

			this.gridsterWidth=12;
			this.gridsterheight=8;

		}else{

			this.gridsterWidth=31;
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

		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
 		gridster.add_widget(this.square, this.gridsterWidth, this.gridsterheight);

		//In the right way i will draw the graph
		$("#"+this.id).on("DrawTimes",function(event,trigger,data,serie){
			var serieChart= parser(from,to,data,series);
		    var x= createX(data,from,to)
		    draw(serieChart,x,title,size,this.id)
			$("#"+this.id).off()
		})

		//In the wrong way i will draw an error widget
		$("#"+this.id).on("ErrorGraphTimes",function(){
			alert("pinto uno de error")
			$("#"+this.id).off()
		})

		//If we haven't the data in cache we will request them
		if(takeinfo.evolutionary.state==0){
			//We actualise the state of data
			takeinfo.evolutionary.state==1;
			//The request is on course

			$.getJSON(takeinfo.evolutionary.inside).success(function(data){

			  //We actualise the state of data again
			  takeinfo.evolutionary.saveData=data
			  takeinfo.evolutionary.state=2;

			  $("*").trigger("DrawTimes",["DrawTimes",data,serie])
			 
			}).error(function(){
			  //In case of error we will throw the error event
			  $("*").trigger("ErrorGraphTimes")
			  takeinfo.static.static=0;
			});
		}else if(takeinfo.evolutionary.state==2){
			//If we have the data in caché we will use it
		
			if(takeinfo.evolutionary.inside==json){
				var serieChart= parser(from,to,takeinfo.evolutionary.saveData,series);
			
			    var x= createX(takeinfo.evolutionary.saveData,from,to)
			    
			    draw(serieChart,x,title,size,this.id)
    		}
		}
	}

	//This function is useful to parse the data and flatten them to draw this widget.
	this.Parser=function(from,to,data,serie){
		var selection=[];
		var dataAux;
		serie.forEach(function(element){
		  dataAux=data[element.name].slice(data.date.indexOf(from),data.date.indexOf(to)+1)
		  obj={
		      type: element.form,
		      name: element.name,
		      data: dataAux
		  }
		  selection.push(obj)
		})

		return selection;
	}

	this.CreateX=function(data,from,to){

		return data.date.slice(data.date.indexOf(from),data.date.indexOf(to)+1)

	}

	this.Draw= function(serie,x,title,size,id){
		
  	  $("#load"+id).remove()

	  if((size)<=12 && (size)>=8){
	    var options={
	      chart:{
	          renderTo:id.toString(),
	          width: 430,
	          height: 307
	      },
	      xAxis: {
	        categories: x
	      },
	      title: {
	          text: title
	      },
	      series: serie,
	      exporting: {
				buttons: {
					contextButton: {
						menuItems: [{
							text: 'Settings',
							onclick: function () {
								ShowValuesGraph(id);
							}
						}]
					}
				}
			}
	    }

	  }else if((size)<8){
	    var options={
	      chart:{
	          renderTo:id.toString(),
	          width: 340,
	          height: 177
	      },
	      xAxis: {
	        categories: x
	      },
	      title: {
	          text: title
	      },
	      series: serie,
	      exporting: {
				buttons: {
					contextButton: {
						menuItems: [{
							text: 'Settings',
							onclick: function () {
								ShowValuesGraph(id);
							}
						}]
					}
				}
			}
	    }

	  }else{
	    var options={
	      chart:{
	          renderTo:id.toString(),
	          width: 900,
	          height: 337
	      },
	      xAxis: {
	        categories: x
	      },
	      title: {
	          text: title
	      },
	      series: serie,
	      exporting: {
				buttons: {
					contextButton: {
						menuItems: [{
							text: 'Settings',
							onclick: function () {
								ShowValuesGraph(id);
							}
						}]
					}
				}
			}
	      
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
		var keys=configuration.evolutionary
		var auxseries;
		var getSerie=this.getSerie
		var existLabel= this.existLabel
		$("#making").slideDown("slow")

		if($("#currentSettings")){
		$("#currentSettings").remove();
		}
		$("#conten").append('<div id="currentSettings"><div id="list" style="height: 200px; overflow-y: scroll;"></div></div>')

		keys.forEach(function(element){
			if(existLabel(chart,element)){
			  auxseries=getSerie(chart,element);
			  if(auxseries.type=="column"){
			    $("#currentSettings #list").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column" checked>Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline">Lineas <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>');
			  }else{
			    $("#currentSettings #list").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column" >Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline" checked>Lineas <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>');
			  }
			}else{
			  $("#currentSettings #list").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column">Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline">Lineas <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>');
			}
		})
		$("#currentSettings").append('From')
		$("#currentSettings").append('<select id="from" class="form-control">')
		configuration.time.forEach(function(element){
			$("#currentSettings #from").append('<option value="'+element+'">'+element+'</option>')
		})
		$("#currentSettings").append('</select>')
		$("#currentSettings").append('To')
		$("#currentSettings").append('<select id="to" class="form-control">')
		configuration.time.forEach(function(element){
			$("#currentSettings #to").append('<option value="'+element+'">'+element+'</option>')
		})
		$("#currentSettings").append('</select>')

		var position=chart.series[0].data.length-1;
		var position2= configuration.time.indexOf(chart.series[0].data[position-1].category)
		var month= configuration.time[position2+1]

		$("#from").val(chart.series[0].data[0].category)
		$("#to").val(configuration.time[position2+1])
		$("#currentSettings").append('<p>Title</p><p><input placeholder="'+chart.title.textStr+'" id="title" class="form-control"></div></p>')
		$("#currentSettings").append('<button onclick="ChangeValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Redraw</button>')
		$("#currentSettings").append('<button onclick="deleteSettings()" type="button" class="btn btn-xs btn-default">Cancel</button>')

	}

	this.redraw= function(){
		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');
  		gridster.remove_widget("#widget"+this.id);

  		this.id=numWidget+1
  		numWidget++

		this.buttons='<button onclick="deleteWidget('+this.panel+','+this.id+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="ChangePanelMenu('+this.id+')" type="button" class="btn btn-xs btn-default">Move to</button><button onclick="ShowValuesGraph('+this.id+')" type="button" class="btn btn-xs btn-default">Settings</button>'
		this.square='<div id="widget'+this.id+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body"><img id="load'+this.id+'" src="/templates/images/cargando.gif" height="42" width="42"></div></div>';

  		this.takeData("Settings");
  		this.MakeWidget()
	}
	
}

HighTime.prototype = new HighWidget();
