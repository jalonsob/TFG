var actualDash=0;
var numDash=0;
var numGraph=0;
var allInfo=[];
var configuration={};
var takeinfo={}
$(document).ready(function() {

    //En esta zona obtengo todas las keys de manera rápida nada más empezar el programa, de esta forma
    //compruebo en un futuro si existen errores a la hora de obtenerlo y se que clase de grafica puedo pintar
    //de paso me ahorro unos cuantos getjson del futuro cuando necesite los datos a pintar

    $.getJSON("../templates/json/configurationfile.json").success(function(data){
      var objaux;
      Object.keys(data).forEach(function(element){
          objaux={
              from: element,
              inside: data[element]
          }
          configuration[element]=data[element]
      })
    })

    $.getJSON("../templates/json/referenceinfo.json").success(function(data){
      var objaux;
      Object.keys(data).forEach(function(element){
          objaux={
              from: element,
              inside: data[element]
          }
          takeinfo[element]=data[element]
      })
    })

    $.getJSON("../templates/json/scm-demographics-aging.json").success(function(data) {
            var objaux={
              from: "aging",
              inside: []
            }
            Object.keys(data.persons).forEach(function(element){
                objaux.inside.push(element)
            })
            allInfo.push(objaux)
    }).error(function(){
      var objaux={
              from: "scm-demographics-aging.json",
              inside: "error"
            }
            allInfo.push(objaux)
    });
    $.getJSON("../templates/json/scm-demographics-birth.json").success(function(data) {
            var objaux={
              from: "birth",
              inside: []
            }
            Object.keys(data.persons).forEach(function(element){
                objaux.inside.push(element)
            })
            allInfo.push(objaux)
    }).error(function(){
      var objaux={
              from: "scm-demographics-birth.json",
              inside: "error"
            }
            allInfo.push(objaux)
    });


  $("#save").click(function(){

    
   /* var gridster = $("#dash1 ul").gridster().data('gridster');
    var gridata=gridster.serialize()
    var content= $("#"+gridata[0].id)*/

    /*
    numGraph=1
    var chart = $('#1').highcharts();
    console.log(chart.title.textStr)
    chart.series.forEach(function(i, serie){
      
    })*/
    

  })


  $("#addDash").click(function(){
    numDash+=1;
    var color=getRandomColor()
    $(".container-fluid").append('<div id="settings'+(numDash)+'"class="panel-body" hidden><ul><button onclick="showTimeSettings('+numDash+')" type="button" class="btn btn-xs btn-default">Time series chart</button><button onclick="showAgingSettings('+numDash+')" type="button" class="btn btn-xs btn-default">Aging chart</button><button onclick="showInfoSettings('+numDash+')" type="button" class="btn btn-xs btn-default">Info widget</button></ul></div><div id="dash'+(numDash)+'" class="gridster ready" style="background-color:'+color+'"><ul></ul></div> ')
    $(".gridster ul").gridster({
      widget_margins: [6, 6],
      widget_base_dimensions: [10, 10],
      serialize_params: function($w, wgd) { 
          return { 
                 id: $($w).attr('id'), 
                 col: wgd.col, 
                 row: wgd.row, 
                 size_x: wgd.size_x, 
                 size_y: wgd.size_y 
          };
      }
    }).data('gridster');
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
    keys=configuration.static
    $("#settings"+dash).append('<div id="actualMenu"><p id="list" style="height: 200px; overflow-y: scroll;"></p></div>')
    $("#actualMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras  </p>');
    keys.forEach(function(element){
      $("#actualMenu #list").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
    })

    $("#actualMenu").append('<button onclick="takeDataInfo()" type="button" class="btn btn-xs btn-default">Create</button>')
    $("#actualMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
  
}

//funcion para recoger los datos para crear la grafica
function takeDataInfo(numGraph){
  var forma=$("#actualMenu input[type='radio']:checked").attr("value");
  if(forma!=undefined){
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
      makeGraphInfo(actualDash,selected,numGraph)
    }else{
      alert("¿Qué clase de gráfica pretende representar sin datos?")
    }
  }else{
    alert("Es indispensable que seleccione un tipo de forma a representar")
  }
}

function makeGraphInfo(dash,selected,graph){
  var where= takeinfo.static
  $.getJSON("../templates/json/"+where).success(function(data) {
  if(isNaN(graph)){
    numGraph+=1;
    graph=numGraph;
    var inDash= "dash"+dash.toString()
    var gridster = $("#"+inDash+" ul").gridster().data('gridster');
    color=($("#dash"+dash).css('background-color'))
    gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsInfoGraph('+numGraph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 17, 12);
  }else{
    var chart = $('#'+graph).highcharts();
    chart.destroy()
  }
    var serie= parserGraphInfo(selected,data);
    console.log(serie)
    var options={
              chart:{
                  renderTo:numGraph.toString(),
                  width: 340,
                  height: 180
              },

              xAxis: {
                categories: ["Total"]
              },
              title: {
                  text: where
              },
              series: serie
          }
    var chart= new Highcharts.Chart(options);
    $("#actualMenu").remove();
  }).error(function(){
    var inDash= "dash"+dash.toString()
    var gridster = $("#"+inDash+" ul").gridster().data('gridster');
    color=($("#dash"+dash).css('background-color'))
    gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div>No se ha podido cargar el json referente</div>', 10, 10);
    $("#actualMenu").remove();
  });

}

function parserGraphInfo(selected,data){
  var selection=[];
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
  
  console.log(selection[0])
  return selection
}


function settingsInfoGraph(numGraph){
  var chart = $('#'+numGraph).highcharts();
  var keys=configuration.static
  var auxseries;
  $("#settings"+ actualDash).append('<div id="actualMenu"><p id="list" style="height: 200px; overflow-y: scroll;"></p></div>')
  if(chart.series[0].type=="column"){
    $("#actualMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column" checked>Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras  </p>');
  }else{
    $("#actualMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar" checked>Barras  </p>');
  }
  keys.forEach(function(element){
    if(existLabel(chart,element)){
      $("#actualMenu #list").append('<p><input type="checkbox" value="'+element+'" checked> '+element+'</p>')
    }else{
      $("#actualMenu #list").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
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
  var title='';
  if($("#aging").is(':checked') && $("#birth").is(":checkbox:not(:checked)")){
      if($("#actualMenu #agingColor").val()==''){
        colorbar=($("#actualMenu #agingColor").attr("placeholder"))
      }else{
        colorbar=$("#actualMenu #agingColor").val()
      }
      var where= takeinfo.aging
      $.getJSON("../templates/json/"+where).success(function(data) {
        var dato=parserDemograph(data)
        max=dato.length
        var objaux={
              type: "bar",
              name: "aging",
              data: dato.reverse(),
              color: colorbar
        }
        series.push(objaux)
        title+=where.split(".")[0]
        var axisx=createAxisx(max).reverse()
        
        makeGraphDemograph(actualDash,series,axisx,title,numGraph)
      }).error(function(){
        title=""
        var axisx=""
        makeGraphDemograph(actualDash,series,axisx,title,numGraph)

      })
   
  }else if($("#birth").is(':checked') && $("#aging").is(":checkbox:not(:checked)")){
     if($("#actualMenu #birthColor").val()==''){
        colorbar=($("#actualMenu #birthColor").attr("placeholder"))
      }else{
        colorbar=$("#actualMenu #birthColor").val()
      }
      var where= takeinfo.birth
      $.getJSON("../templates/json/"+where).success(function(data) {
        var dato=parserDemograph(data)
        max=dato.length
        
        var objaux={
              type: "bar",
              name: "birth",
              data: dato.reverse(),
              color: colorbar
        }
        series.push(objaux)
        title+=where.split(".")[0]
        var axisx=createAxisx(max).reverse()
        makeGraphDemograph(actualDash,series,axisx,title,numGraph)
      }).error(function(){
        title=""
        var axisx=""
        makeGraphDemograph(actualDash,series,axisx,title,numGraph)

      })
  }else if ($("#birth").is(':checked') && $("#aging").is(':checked')){
      var graphicAging, graphicBirth;
      var whereaging=takeinfo.aging;
      var wherebirth=takeinfo.birth;
      $.when(
        $.getJSON("../templates/json/"+whereaging).success(function(data) { 
            graphicAging = data;
        }),
        $.getJSON("../templates/json/"+wherebirth).success(function(data) {
            graphicBirth = data;
        })
      ).then(function() {
        if(parserDemograph(graphicBirth).length>=parserDemograph(graphicAging).length){
          max=parserDemograph(graphicBirth).length
        }else{
          max=parserDemograph(graphicAging).length
        }

        if($("#actualMenu #agingColor").val()==''){
        colorbar=($("#actualMenu #agingColor").attr("placeholder"))
        }else{
          colorbar=$("#actualMenu #agingColor").val()
        }
        var dato=parserDemograph(graphicAging).reverse()
        
        var objaux={
              type: "bar",
              name: "aging",
              data: dato,
              color: colorbar
        }
        series.push(objaux)

        if($("#actualMenu #birthColor").val()==''){
        colorbar=($("#actualMenu #birthColor").attr("placeholder"))
        }else{
          colorbar=$("#actualMenu #birthColor").val()
        }
        var dato=parserDemograph(graphicBirth).reverse();
        
        var objaux={
              type: "bar",
              name: "birth",
              data: dato,
              color: colorbar
        }
        series.push(objaux)
        title+=whereaging.split(".")[0]+" "+wherebirth.split(".")[0]
        var axisx=createAxisx(max).reverse();
        makeGraphDemograph(actualDash,series,axisx,title,numGraph)
      }).error(function(){
        title=""
        var axisx=""
        makeGraphDemograph(actualDash,series,axisx,title,numGraph)

      })
  }else{
    alert("Para crear un tipo de gráfica de edades debe seleccionar una de las opciones anteriores")
  }
}

function makeGraphDemograph(dash,series,axis,titl,graph){
  if(series.length!=0){
    if(isNaN(graph)){
      numGraph+=1;
      graph=numGraph
      var inDash= "dash"+dash.toString()
      color=($("#dash"+dash).css('background-color'))
      var gridster = $("#"+inDash+" ul").gridster().data('gridster');
      gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsDemoGraph('+numGraph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 23, 22);
    }else{
      var chart = $('#'+graph).highcharts();
      chart.destroy()
    }
    var options={
              chart:{
                  renderTo:graph.toString(),
                  width: 460,
                  height: 395
              },

              xAxis: {
                categories: axis
              },

              plotOptions: {
                          series: {
                              cursor: 'pointer',
                              point: {
                                  events: {
                                      click: function () {
                                        makeAutorsGraph(this.category,titl);
                                        console.log(this)
                                      }
                                  }
                              }
                          }
                      },
             
              title: {
                  text: titl
              },
              series: series
    }
    chart= new Highcharts.Chart(options);
    $("#actualMenu").remove();
  }else{
    var inDash= "dash"+dash.toString()
    var gridster = $("#"+inDash+" ul").gridster().data('gridster');
    color=($("#dash"+dash).css('background-color'))
    gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div>No se ha podido cargar el json referente</div>', 10, 10);
    $("#actualMenu").remove();
  }
}

function makeAutorsGraph(categoria,title){
  var jsons= title.split(" ")
  var aux= categoria.split("-")
  var from= parseInt(aux[0])
  var to= parseInt(aux[1])

  var series= parseLookInfo(from,to,title)
  numGraph+=1;
  var inDash= "dash"+actualDash.toString()
  color=($("#dash"+actualDash).css('background-color'))
  var gridster = $("#"+inDash+" ul").gridster().data('gridster');
  gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 34, 24);

  var options={
            chart:{
                renderTo:numGraph.toString(),
                width: 700,
                height: 400
            },

            xAxis: {
              categories: ["Age"]
            },
            title: {
                text: "Usuarios entre "+from+"-"+to+" de "+title
            },
            series: parserAutorsData(series)
  }
  chart= new Highcharts.Chart(options);
}

function parserAutorsData(series){
  var result=[];
  for(i=0;i<=series.dato.length;i++){
    objaux={
          type: "column",
          name: series.xAxis[i],
          data: [series.dato[i]]
      }
    result.push(objaux)
  }
  return result
  }

function parseLookInfo(from,to,who){
  var result={
    xAxis: [],
    dato: []
  }
  var jsons= who.split(" ")
  var datos;
  var i=0
  alert(jsons)
  jsons.forEach(function (element){
      var path= "json/"+element+".json"
      datos=getDataJson(path)

      datos.persons.age.forEach(function(element){
        aux=Math.floor(element/181)
        if(aux>=Math.floor(from/181) && aux<Math.floor(to/181)){
          result.dato.push(element)
          result.xAxis.push(datos.persons.name[i])
               
        }
        i++
      })
      
  })
  return result
}

function createAxisx(max){
  var result=[];
  for (i = 0; i < max; i++) {
    result[i]= (i*181)+"-"+((i+1)*181)
  }
  return result
}

function parserDemograph(data){
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
    $("#settings"+dash).append('<div id="actualMenu"><div id="list" style="height: 200px; overflow-y: scroll;"></div></div>')
    configuration.evolutionary.forEach(function(element){
      $("#actualMenu #list").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column">Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline">Lineas    <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>')
    })
    $("#actualMenu").append('From')
    $("#actualMenu").append('<select id="from" class="form-control">')
    configuration.time.forEach(function(element){
      $("#actualMenu #from").append('<option value="'+element+'">'+element+'</option>')
    })
    $("actualMenu").append('</select>')
    $("#actualMenu").append('To')
    $("#actualMenu").append('<select id="to" class="form-control">')
    configuration.time.forEach(function(element){
      $("#actualMenu #to").append('<option value="'+element+'">'+element+'</option>')
    })
    $("actualMenu").append('</select>')
    $("#to").val(configuration.time[configuration.time.length-1])
    $("#actualMenu").append('<button onclick="takeDataTime()" type="button" class="btn btn-xs btn-default">Create</button>')
    $("#actualMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
}

//funcion para recoger los datos para crear la grafica
function takeDataTime(numGraph){
  //En esta zona obtengo los datos de forma sincrona, en este caso soy invulnerable a errores en la descarga
  //del json por si el nombre esta mal introducido dado queya lo he comprobado al principio
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
  from=configuration.time.indexOf(from.toString())
  to=configuration.time.indexOf(to.toString())
  makeGraphSeries(actualDash,selected,from,to,numGraph)

}

//funcion para cancelar la creacion de la grafica
function deleteCreation(){
  $("#actualMenu").remove();
}

//Creamos la gráfica correspondiente al tipo seleccionado
function makeGraphSeries(dash,selected,from,to,graph){
  var where= takeinfo.evolutionary
  $.getJSON('../templates/json/'+where).success(function(data){
    var series= parserGraph(from,to,data,selected);
    if(isNaN(graph)){
      numGraph+=1;
      graph=numGraph;
      var inDash= "dash"+dash.toString()
      var gridster = $("#"+inDash+" ul").gridster().data('gridster');
      color=($("#dash"+dash).css('background-color'))
      if((to-from)<=12 && (to-from)>8){
        gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsTimeGraph('+numGraph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 23, 22);
      }else if((to-from)<8){
        gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsTimeGraph('+numGraph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 17, 12);
      }else{
        gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsTimeGraph('+numGraph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 34, 22);

      }
    }else{
      var chart = $('#'+graph).highcharts();
      chart.destroy()
      if((to-from)<=12 && (to-from)>8){
        $("#graph"+graph).attr("data-sizex",23)
        $("#graph"+graph).attr("data-sizey",22)

      }else if((to-from)<8){
        $("#graph"+graph).attr("data-sizex",17)
        $("#graph"+graph).attr("data-sizey",12)

      }else{
        $("#graph"+graph).attr("data-sizex",34)
        $("#graph"+graph).attr("data-sizey",22)
      }
    } 
    if((to-from)<=12 && (to-from)>8){
      var options={
                chart:{
                    renderTo:graph.toString(),
                    width: 400,
                    height: 400
                },
                xAxis: {
                  categories: data.date.slice(from,to)
                },
                title: {
                    text: where
                },
                series: series
            }
    }else if((to-from)<8){
      var options={
          chart:{
              renderTo:graph.toString(),
              width: 340,
              height: 185
          },
          xAxis: {
            categories: data.date.slice(from,to)
          },
          title: {
              text: where
          },
          series: series
      }
    }else{
      var options={
          chart:{
              renderTo:graph.toString(),
              width: 700,
              height: 400
          },
          xAxis: {
            categories: data.date.slice(from,to)
          },
          title: {
              text: where
          },
          series: series
      }
    }
    var chart= new Highcharts.Chart(options);
    $("#actualMenu").remove();
  }).error(function(){
    $("#actualMenu").remove();
    var inDash= "dash"+dash.toString()
    var gridster = $("#"+inDash+" ul").gridster().data('gridster');
    color=($("#dash"+dash).css('background-color'))
    gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+inDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div>Hubo un error al cargar el archivo de de la evolución</div>', 10, 10);
  });
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
  var keys=configuration.evolutionary
  var auxseries;
  $("#settings"+actualDash).append('<div id="actualMenu"></div>')
  keys.forEach(function(element){
    if(existLabel(chart,element)){
      auxseries=getSeriesbyName(chart,element);
      if(auxseries.type=="column"){
        $("#actualMenu").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column" checked>Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline">Lineas <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>');
      }else{
        $("#actualMenu").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column" >Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline" checked>Lineas <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>');
      }
    }else{
      $("#actualMenu").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column">Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline">Lineas <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>');
    }
  })
  $("#actualMenu").append('From')
  $("#actualMenu").append('<select id="from" class="form-control">')
  configuration.time.forEach(function(element){
    $("#actualMenu #from").append('<option value="'+element+'">'+element+'</option>')
  })
  $("actualMenu").append('</select>')
  $("#actualMenu").append('To')
  $("#actualMenu").append('<select id="to" class="form-control">')
  configuration.time.forEach(function(element){
    $("#actualMenu #to").append('<option value="'+element+'">'+element+'</option>')
  })
  $("actualMenu").append('</select>')

  var position=chart.series[0].data.length-1;
  var position2= configuration.time.indexOf(chart.series[0].data[position].category)
  var month= configuration.time[position2+1]

  $("#from").val(chart.series[0].data[0].category)
  $("#to").val(configuration.time[position2+1])
  $("#actualMenu").append('<button onclick="takeDataTime('+numGraph+')" type="button" class="btn btn-xs btn-default">Redraw</button>')
  $("#actualMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')

}

function resetRatios(element1,element2){
  element1.checked=false;
  element2.checked=false;
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
function getKeysJson(from){
  var result;
  allInfo.forEach(function(element){
    if(from==element.from){
      result=element.inside
    }
  })
  return result;
}

//función que encuentra donde está situado un tipo de dato unico sin necesidad de descargarlo
function findKey(key){
  var result;
  allInfo.forEach(function(element){
    if(element.inside.indexOf(element)){
      result=element.from
    }
  });
  return result;
}

//funcion para obtener un dato de toda la info descargada
function findInfo(path){
  var result;
    allInfo.forEach(function(element){
    if(element.inside.indexOf(element)){
      result=element;
    }
  });
  return result
}

//función que filtra eliminando una key concreta para filtrar sin la fecha que es siempre igual
function filterKeyDate(element){
  return element != "date";
}

function filterKeyURL(element){
  return element != "url";
}

//funcion para obtener un color ramdon
function getRandomColor() {
    var colors= ["#EBA550","#95EB50","#5095EB","#745CDF","#DE5169","#9DE0DF","#E0E060"]
    return colors[Math.floor(Math.random() * 7)]
}

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