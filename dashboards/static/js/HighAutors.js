//Widget oriented to make a chart of kind AGES with Highcharts

function HighAutors(id,panel,color,jsons,title,serie){
	HighWidget.call(this,id,panel,color,16,15)
	this.title= "Autors from "+title+" between ages "+serie || "Autors "+this.id;
	this.square='<div id= "widget'+this.id+'" class="panel panel-primary widgetDrop" style="border-style: groove;border-color: black;border-width: 3px"><div id="header'+this.id+'" class="panel-heading" style="background-color:'+this.color+'">'+this.buttons+'</div><div id="'+this.id+'" class="panel-body">'+this.content+'</div></div>';

	var series=serie || [];
	if((Object.getOwnPropertyNames(configuration).length === 0)){
		var json= "" ;

	}else{
		var json= jsons
	}
	this.flatten= function(){
		var objaux={}
		objaux.type="HighAutors";
		objaux.series= series;
		objaux.id= this.id;
		objaux.title=this.title;
		objaux.color= this.color;
		objaux.jsons= json
		return objaux
	}


	this.MakeWidget=function(){
	
		var aux= serie.split("-")
		var from= parseInt(aux[0])
		var to= parseInt(aux[1])
		var serieChart;

		var gridster = $("#panel"+this.panel+" ul").gridster().data('gridster');

		if(json.length==2){

			data= cacheData[json[0]].saveData
			var serieChart= this.ParseLookInfo(from,to,data)

			data= cacheData[json[1]].saveData
			
			serieChart=this.ParseLookInfo(from,to,data,serieChart)

			serieChart=this.ParserAutorsData(serieChart)

		}else{
			data= cacheData[json[0]].saveData

			var serieChart= this.ParseLookInfo(from,to,data)
			serieChart=this.ParserAutorsData(serieChart)

		}

		
			if((serieChart.length)<=12 && (serieChart.length)>=8){

			  gridster.add_widget(this.square, 15, 12);

			}else if((serieChart.length)<8){

			  gridster.add_widget(this.square, 12, 8);

			}else{

			  gridster.add_widget(this.square, 34, 13);

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

			this.Draw(this.id,serieChart,this.title)

	}

	this.ParseLookInfo=function(from,to,data,aux){
		if(aux==undefined){
			var result={
				xAxis: [],
				dato: []
			}
		}else{
			var result=aux;

		}
		var i=0;
		data.persons.age.forEach(function(element){
			aux=Math.floor(element.split(" days,")[0]/181)
			if(aux>=Math.floor(from/181) && aux<Math.floor(to/181)){
				result.dato.push(element.split(" days,")[0]/181)
				result.xAxis.push(data.persons.name[i])

			}
			i++
		})

		return result
	}

	this.ParserAutorsData=function(series){
		var result=[];
		for(i=0;i<series.dato.length;i++){
			objaux={
			      type: "column",
			      name: series.xAxis[i],
			      data: [series.dato[i]]
			  }
			result.push(objaux)
		}
		return result
	}

	this.CreateX=function(max){
		
		var result=[];
		for (i = 0; i < max; i++) {
			result[i]= (i*181)+"-"+((i+1)*181)
		}
		return result
	}

	this.Draw= function(id,serie,title){

  		if((serie.length)<=12 && (serie.length)>=8){

			var options={
			  chart:{
			      renderTo: id.toString(),
			      width: 430,
			      height: 307
			  },

			  xAxis: {
			    categories: ["Age"]
			  },
			  title: {
			      text: title
			  },
			  series: serie
			}

		}else if((serie.length)<8){

			var options={
			  chart:{
			      renderTo: id.toString(),
			      width: 340,
			      height: 177
			  },

			  xAxis: {
			    categories: ["Age"]
			  },
			  title: {
			      text: title
			  },
			  series: serie
			}

		}else{

			var options={
			  chart:{
			      renderTo: id.toString(),
			      width: 1050,
			      height: 337
			  },

			  xAxis: {
			    categories: ["Age"]
			  },
			  title: {
			      text: title
			  },
			  series: serie
			}

		}

		chart= new Highcharts.Chart(options);
	}


	this.getSeries= function(){
		return series;
	}


}

HighAutors.prototype = new HighWidget();
