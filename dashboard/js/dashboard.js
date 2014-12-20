var actualDash=1;

$(document).ready(function() {


  /** CÓMO CREAR UN GRIDSTER Y AÑADIR COSAS  */
  $(".gridster ul").gridster({
    widget_margins: [10, 10],
    widget_base_dimensions: [400, 400]
  });

  var gridster = $(".gridster ul").gridster().data('gridster');
  /* DENTRO DE LA CLASE DEL CLASS PUEDO DEFINIR EL RECUADRO DE LA GRÁFICA
  gridster.add_widget('<li class="new">The HTML of the widget...</li>', 1, 1);
  gridster.add_widget('<li class="new">The HTML of the widget...</li>', 1, 2);

  gridster.add_widget('<li class="new">The HTML of the widget...</li>', 1, 3);
  */

  gridster.add_widget('<div id="1" class="new"></div>', 1, 1);

  var series=[];
  obj={
          type: "column",
          name: "probando",
          data: [1,2,3,4,5,6,7]
        }
  series.push(obj)
  var options={
            chart:{
                renderTo:"1"
            },
            title: {
                text: ''
            },
            series: series
        }
  var chart= new Highcharts.Chart(options);

});

