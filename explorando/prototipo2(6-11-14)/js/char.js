$(document).ready(function() {

    var jsonfile = '/Users/jesus/Desktop/prototipo2(6-11-14)/datos.json';
    var data = jQuery.parseJSON(
        jQuery.ajax({
            url: jsonfile, 
            async: false,
            dataType: 'json'
        }).responseText
    );

    var string="";
    var keys=Object.keys(data)
    keys.forEach(function(x){
        string= string+" "+x;
    })
    $("body").append(string+"\n");

  
    var options={
        chart:{
            renderTo:"container"
        },
        title: {
            text: 'Ejemplo de renderizacion'
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'changed',
            data: data.changed
        }]
    }
    var chart= new Highcharts.Chart(options);
});
