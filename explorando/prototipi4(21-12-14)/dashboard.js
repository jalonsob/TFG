var actualDash=1;
var numDash=1;
var numGraph=0;

$(document).ready(function() {


  /** CÓMO CREAR UN GRIDSTER Y AÑADIR COSAS  */
  $(".gridster ul").gridster({
    widget_margins: [5, 5],
    widget_base_dimensions: [300, 300]
  });

  var gridster = $("#dash1 ul").gridster().data('gridster');
  gridster.add_widget('<div id= "panel graph1" class="panel panel-primary"><div class="panel-heading">Aquí va el boto de edicion y el boton de eliminar</div><div id="1" class="panel-body"> </div></div>', 1, 1);
  gridster.add_widget('<div id= "panel graph1" class="panel panel-primary"><div class="panel-heading">Aquí va el boto de edicion y el boton de eliminar</div><div id="2" class="panel-body"> </div></div>', 1, 1);

  var series=[];
  obj={
          type: "column",
          name: "probando",
          data: [1,2,3,4,5,6,7]
        }
  series.push(obj)
  var options={
            chart:{
                renderTo:"1",
                width: 250,
                height: 220
            },
            title: {
                text: ''
            },
            series: series
        }
  var options2={
            chart:{
                renderTo:"2",
                width: 250,
                height: 220
            },
            title: {
                text: ''
            },
            series: series
        }
  var chart= new Highcharts.Chart(options);
  var chart2= new Highcharts.Chart(options2);

});

