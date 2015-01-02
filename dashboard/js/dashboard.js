var actualDash=0;
var numDash=0;
var numGraph=0;

$(document).ready(function() {

  $("#addDash").click(function(){
    numDash+=1;
    $(".container-fluid").append('<div id="settings'+(numDash)+'"class="panel-body" hidden><ul><button onclick="showTimeSettings('+numDash+')" type="button" class="btn btn-xs btn-default">Time series chart</button><button onclick="showAgingSettings('+numDash+')" type="button" class="btn btn-xs btn-default">Aging chart</button><button onclick="showInfoSettings('+numDash+')" type="button" class="btn btn-xs btn-default">Info widget</button></ul></div><div id="dash'+(numDash)+'" class="gridster"><ul></ul></div> ')
    $("#dashboards").append('<li onclick="showDash('+numDash+')"><a href="javascript:;" data-toggle="collapse" data-target="#scrollDash'+numDash+'"><i class="fa fa-fw fa-edit"></i> Dashboard '+numDash+' <i class="fa fa-fw fa-caret-down"></i></a><ul id="scrollDash'+numDash+'" class="collapse"><li><a onclick="showSettings('+numDash+')" href="#">Add Graph</a></li><li><a onclick="deleteAllGraphs('+numDash+')" href="#">Delete all</a></li></ul></li>')
    if(actualDash==0){
      actualDash=1;
    }
  })

});

//Mostramos las opciones de creación de tipos de gráficas
function showSettings(dash){
  $("#settings"+dash).slideDown();

}

//************************************** Crear una gráfica del tipo Info chart *************************//
function showInfoSettings(dash){
  var keys=getKeysJson('json/scm-static.json').filter(filterKeyURL)
  $("#settings"+dash).append('<div id="actualMenu"></div>')
  $("#actualMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras  </p>');
  keys.forEach(function(element){
    $("#actualMenu").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
  })

  $("#actualMenu").append('<button onclick="takeDataInfo()" type="button" class="btn btn-xs btn-default">Create</button>')
  $("#actualMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
}

//funcion para recoger los datos para crear la grafica
function takeDataInfo(numGraph){
  var forma=$("#actualMenu input[type='radio']:checked").attr("value");
  if(forma!=undefined){
    var data=getDataJson('json/scm-static.json')//DE MOMENTO ME HACE FALTA HASTA QUE DEFINA DE DONDE LO SACO
    var selected = [];
    var forma=$("#actualMenu input[type='radio']:checked").attr("value");
    $("#actualMenu input[type='checkbox']:checked").each(function() {
      objaux={
        name:$(this).attr('value'),
        form: forma
      }
      selected.push(objaux);
    });
    if(selected.length!=0){
      makeGraphInfo(actualDash,selected,"scm-static",numGraph)
    }else{
      alert("¿Qué clase de gráfica pretende representar sin datos?")
    }
  }else{
    alert("Es indispensable que seleccione un tipo de forma a representar")
  }
}

function makeGraphInfo(dash,selected,titl,numGraph){
  if(numGraph==undefined){
    numGraph+=1;
    var inDash= "dash"+dash.toString()
    var gridster = $("#"+inDash+" ul").gridster().data('gridster');
    gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary"><div class="panel-heading"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsInfoGraph('+numGraph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 1, 1);
  }else{
    var chart = $('#'+numGraph).highcharts();
    chart.destroy()
  }
  var data=getDataJson('json/scm-static.json')
  var series= parserGraphInfo(data,selected);
  var options={
            chart:{
                renderTo:numGraph.toString(),
                width: 370,
                height: 160
            },

            xAxis: {
              categories: ["Total"]
            },
            title: {
                text: titl
            },
            series: series
        }
  var chart= new Highcharts.Chart(options);
  $("#actualMenu").remove();

}

function parserGraphInfo(data,selected){
    var selection=[];
    var dataAux;
    var arrayAux;
    selected.forEach(function(element){
      dataAux=data[element.name];
      arrayAux=[dataAux]
      obj={
          type: element.form,
          name: element.name,
          data: arrayAux
      }
      selection.push(obj)
    })
    return selection;
}


function settingsInfoGraph(numGraph){
  var chart = $('#'+numGraph).highcharts();
  var keys=getKeysJson('json/'+chart.title.textStr+'.json').filter(filterKeyURL)
  var auxseries;
  $("#settings"+actualDash).append('<div id="actualMenu"></div>')
  if(chart.series[0].type=="column"){
    $("#actualMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column" checked>Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras  </p>');
  }else{
    $("#actualMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar" checked>Barras  </p>');
  }
  keys.forEach(function(element){
    if(existLabel(chart,element)){
      $("#actualMenu").append('<p><input type="checkbox" value="'+element+'" checked> '+element+'</p>')
    }else{
      $("#actualMenu").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
    }
  })
  $("#actualMenu").append('<button onclick="takeDataInfo('+numGraph+')" type="button" class="btn btn-xs btn-default">Create</button>')
  $("#actualMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
}

//************************************** Crear una gráfica del tipo Aging chart *************************//

function showAgingSettings(dash){
  $("#settings"+dash).append('<div id="actualMenu"></div>')
  $("#actualMenu").append('<p><div class="form-group"><label><input id="aging" type="checkbox" value="aging">Aging</label><input placeholder="#4D8FB8" id="agingColor" class="form-control"></div></p>')
  $("#actualMenu").append('<p><div class="form-group"><label><input id="birth" type="checkbox" value="birth">Birth</label><input placeholder="#081923" id="birthColor" class="form-control"></div></p>')
  $("#actualMenu").append('<button onclick="takeDataAging()" type="button" class="btn btn-xs btn-default">Create</button>')
  $("#actualMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
}

function takeDataAging(numGraph){
  var colorbar;
  var data;
  var series=[];
  var max=0;
  if($("#aging").is(':checked')){
    if($("#actualMenu #agingColor").val()==''){
      colorbar=($("#actualMenu #agingColor").attr("placeholder"))
    }else{
      colorbar=$("#actualMenu #agingColor").val()
    }
    var data1=parserDemograph("json/scm-demographics-aging.json")
    if(max<data1.length){
      max=data1.length
    }
    var objaux={
          type: "bar",
          name: "aging",
          data: data1,
          color: colorbar
    }
    series.push(objaux)
  }
  if($("#birth").is(':checked')){
   if($("#actualMenu #birthColor").val()==''){
      colorbar=($("#actualMenu #birthColor").attr("placeholder"))
    }else{
      colorbar=$("#actualMenu #birthColor").val()
    }
    var data2=parserDemograph("json/scm-demographics-birth.json")
    if(max<data2.length){
      max=data2.length
    }
    var objaux={
          type: "bar",
          name: "birth",
          data: data2,
          color: colorbar
    }
    series.push(objaux)
  }
  var axisx=createAxisx(max)
  makeGraphDemograph(actualDash,series,axisx,"scm-demographics",numGraph)
}

function makeGraphDemograph(dash,series,axis,titl,numGraph){
  if(numGraph==undefined){
    numGraph+=1;
    var inDash= "dash"+dash.toString()
    var gridster = $("#"+inDash+" ul").gridster().data('gridster');
    gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary"><div class="panel-heading"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsDemoGraph('+numGraph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 2, 2);
  }else{
    var chart = $('#'+numGraph).highcharts();
    chart.destroy()
  }
  var options={
            chart:{
                renderTo:numGraph.toString(),
                width: 700,
                height: 400
            },

            xAxis: {
              categories: axis
            },
            title: {
                text: titl
            },
            series: series
  }
  chart= new Highcharts.Chart(options);
  $("#actualMenu").remove();
}

function createAxisx(max){
  var result=[];
  for (i = 0; i < max; i++) {
    result[i]= (i*181)+"-"+((i+1)*181)
  }
  return result
}

function parserDemograph(path){
  var data=getDataJson(path)
  var aux=0;
  var result=[];

  data.persons.age.forEach(function(element){
    aux=Math.floor(element/181);
    if(result[aux]==undefined){
      result[aux]=1;
    }else{
      result[aux]+=1;
    }
  })
  return result;
}

function settingsDemoGraph(numGraph){
  var chart = $('#'+numGraph).highcharts();
  var auxseries;
  $("#settings"+actualDash).append('<div id="actualMenu"></div>')
  if(existLabel(chart,"aging")){
    auxseries=getSeriesbyName(chart,"aging");
    $("#actualMenu").append('<p><div class="form-group"><label><input id="aging" type="checkbox" value="aging" checked>Aging</label><input placeholder="'+auxseries.color+'" id="agingColor" class="form-control"></div></p>')
  }else{
    $("#actualMenu").append('<p><div class="form-group"><label><input id="aging" type="checkbox" value="aging">Aging</label><input placeholder="#4D8FB8" id="agingColor" class="form-control"></div></p>')
  }
  if(existLabel(chart,"birth")){
    auxseries=getSeriesbyName(chart,"birth");
    $("#actualMenu").append('<p><div class="form-group"><label><input id="birth" type="checkbox" value="birth" checked>Birth</label><input placeholder="'+auxseries.color+'" id="birthColor" class="form-control"></div></p>')
  }else{
    $("#actualMenu").append('<p><div class="form-group"><label><input id="birth" type="checkbox" value="birth">Birth</label><input placeholder="#081923" id="birthColor" class="form-control"></div></p>')
  }
  $("#actualMenu").append('<button onclick="takeDataAging('+numGraph+')" type="button" class="btn btn-xs btn-default">Redraw</button>')
  $("#actualMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
}

//************************************** Crear una gráfica del tipo Time series chart *******************//
//personalizacion de la gráfica desde 0
function showTimeSettings(dash){
  var keys=getKeysJson('json/scm-evolutionary.json').filter(filterKeyDate)
  $("#settings"+dash).append('<div id="actualMenu"></div>')
  keys.forEach(function(element){
    $("#actualMenu").append('<p>'+element+':   <input type="radio" name="'+element+'" class="radios" value="column">Barras<input type="radio" name="'+element+'" class="radios" value="spline">Lineas</p>')
  })
  var data=getDataJson('json/scm-evolutionary.json')
  $("#actualMenu").append('From')
  $("#actualMenu").append('<select id="from" class="form-control">')
  data.date.forEach(function(element){
    $("#actualMenu #from").append('<option value="'+element+'">'+element+'</option>')
  })
  $("actualMenu").append('</select>')
  $("#actualMenu").append('To')
  $("#actualMenu").append('<select id="to" class="form-control">')
  data.date.forEach(function(element){
    $("#actualMenu #to").append('<option value="'+element+'">'+element+'</option>')
  })
  $("actualMenu").append('</select>')
  $("#to").val(data.date[data.date.length-1])
  $("#actualMenu").append('<button onclick="takeDataTime()" type="button" class="btn btn-xs btn-default">Create</button>')
  $("#actualMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')

}

//funcion para recoger los datos para crear la grafica
function takeDataTime(numGraph){
  var data=getDataJson('json/scm-evolutionary.json')//DE MOMENTO ME HACE FALTA HASTA QUE DEFINA DE DONDE LO SACO
  var selected = [];
  $("#actualMenu input[type='radio']:checked").each(function() {
    objaux={
      name:$(this).attr('name'),
      form: $(this).attr('value')
    }
    selected.push(objaux);
  });
  var to=$("#to option:selected").text()
  var from=$("#from option:selected").text()
  from=data.date.indexOf(from.toString())
  to=data.date.indexOf(to.toString())
  makeGraphSeries(actualDash,selected,from,to,"scm-evolutionary",numGraph)

}

//funcion para cancelar la creacion de la grafica
function deleteCreation(){
  $("#actualMenu").remove();
  $("#settings"+actualDash).slideUp("slow");
}

//Creamos la gráfica correspondiente al tipo seleccionado
function makeGraphSeries(dash,selected,from,to,titl,numGraph){
  if(numGraph==undefined){
    numGraph+=1;
    var inDash= "dash"+dash.toString()
    var gridster = $("#"+inDash+" ul").gridster().data('gridster');
    gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary"><div class="panel-heading"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsTimeGraph('+numGraph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 2, 2);
  }else{
    var chart = $('#'+numGraph).highcharts();
    chart.destroy()
  }
  var data=getDataJson('json/scm-evolutionary.json')
  var series= parserGraph(from,to,data,selected);
  var options={
            chart:{
                renderTo:numGraph.toString(),
                width: 700,
                height: 400
            },
            xAxis: {
              categories: data.date.slice(from,to)
            },
            title: {
                text: titl
            },
            series: series
        }
  var chart= new Highcharts.Chart(options);
  $("#actualMenu").remove();
}

//funcion para interpretar los datos
function parserGraph(from,to,data,selected){
    var selection=[];
    var dataAux;
    selected.forEach(function(element){
      dataAux=data[element.name].slice(from,to)
      obj={
          type: element.form,
          name: element.name,
          data: dataAux
      }
      selection.push(obj)
    })
    return selection;
}

function settingsTimeGraph(numGraph){
  var chart = $('#'+numGraph).highcharts();
  var data=getDataJson('json/'+chart.title.textStr+'.json')
  var keys=getKeysJson('json/'+chart.title.textStr+'.json').filter(filterKeyDate)
  var auxseries;
  $("#settings"+actualDash).append('<div id="actualMenu"></div>')
  keys.forEach(function(element){
    if(existLabel(chart,element)){
      auxseries=getSeriesbyName(chart,element);
      if(auxseries.type=="column"){
        $("#actualMenu").append('<p>'+element+':   <input type="radio" name="'+element+'" class="radios" value="column" checked>Barras<input type="radio" name="'+element+'" class="radios" value="spline">Lineas</p>');
      }else{
        $("#actualMenu").append('<p>'+element+':   <input type="radio" name="'+element+'" class="radios" value="column" >Barras<input type="radio" name="'+element+'" class="radios" value="spline" checked>Lineas</p>');
      }
    }else{
      $("#actualMenu").append('<p>'+element+':   <input type="radio" name="'+element+'" class="radios" value="column">Barras<input type="radio" name="'+element+'" class="radios" value="spline">Lineas</p>');
    }
  })
  $("#actualMenu").append('From')
  $("#actualMenu").append('<select id="from" class="form-control">')
  data.date.forEach(function(element){
    $("#actualMenu #from").append('<option value="'+element+'">'+element+'</option>')
  })
  $("actualMenu").append('</select>')
  $("#actualMenu").append('To')
  $("#actualMenu").append('<select id="to" class="form-control">')
  data.date.forEach(function(element){
    $("#actualMenu #to").append('<option value="'+element+'">'+element+'</option>')
  })
  $("actualMenu").append('</select>')

  var position=chart.series[0].data.length-1;
  var position2= data.date.indexOf(chart.series[0].data[position].category)
  var month= data.date[position2+1]

  $("#from").val(chart.series[0].data[0].category)
  $("#to").val(data.date[position2+1])

  $("#actualMenu").append('<button onclick="takeDataTime('+numGraph+')" type="button" class="btn btn-xs btn-default">Create</button>')
  $("#actualMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')

}

//************************************************ FUNCIONES DE MOVIMIENTOS DEL DASH Y DEMÁS************

//funcion para mostrar el dash en el que estamos trabajando
function showDash(dash){
  if(actualDash!=dash){
    $("#dash"+actualDash).slideUp("slow");
    $("#settings"+actualDash).slideUp("slow");
    $("#actualMenu").remove();
    $("#dash"+dash).slideDown("slow");
    actualDash=dash;
  }

}

//funcion para eliminar todas las graficas del dash de donde estamos trabajando
function deleteAllGraphs(dash){
  var inDash= "dash"+dash.toString()
  var gridster = $("#"+inDash+" ul").gridster().data('gridster');
  gridster.remove_all_widgets();
}

//funcion para eliminar una grafica concreta
function deleteGraph(dash,num){
  var inDash= dash.id
  var gridster = $("#"+inDash+" ul").gridster().data('gridster');
  gridster.remove_widget("#graph"+num)

}

//**********************************  FUNCIONES DE FILTRADO Y SELECCION DE DATOS ********************////
//función que obtiene todas las keys de un json
function getKeysJson(path){
  var jsonfile = path;
    var data = jQuery.parseJSON(
        jQuery.ajax({
            url: jsonfile, 
            async: false,
            dataType: 'json'
        }).responseText
    );
    var keys=Object.keys(data)
    return keys;
};

//función que filtra eliminando una key concreta para filtrar sin la fecha que es siempre igual
function filterKeyDate(element){
  return element != "date";
}

function filterKeyURL(element){
  return element != "url";
}

//funcion para obtener todos los nombres de los elementos de un chart

//función para saber si un elemento está dentro e un chart
function existLabel(chart,label){
  var result=false;
  chart.series.forEach(function (element){
    if(element.name==label){
      result=true;
    }
  })
  return result;
}

//función para obtener una serie y sus opciones por el nombre
function getSeriesbyName(chart,label){
  var result='';
  chart.series.forEach(function (element){
    if(element.name==label){
      result=element;
    }
  })
  return result;
}

//función que recoge solo los datos de un json
function getDataJson(path){
      var jsonfile = path;
        var data = jQuery.parseJSON(
            jQuery.ajax({
                url: jsonfile, 
                async: false,
                dataType: 'json'
            }).responseText
        );
        return data;
    };