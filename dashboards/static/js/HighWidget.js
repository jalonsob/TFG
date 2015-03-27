//Widget oriented to make a charts with Highcharts

function HighWidget(id,panel,color,x,y){
	Widget.call(this,id,panel,color,x,y)

	//función para obtener una serie y sus opciones por el nombre
	//no se usa en info
	this.getSerie= function(chart,label){
	  var result='';
	  chart.series.forEach(function (element){
	    if(element.name==label){
	      result=element;
	    }
	  })
	  return result;
	}


	//Function that leave us to know if an element is selected in a highchart
	this.existLabel= function(chart,label){
	  var result=false;
	  chart.series.forEach(function (element){
	    if(element.name==label){
	      result=true;
	    }
	  })
	  return result;
	}

}

HighWidget.prototype = new Widget();
