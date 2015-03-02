//Jesús Alonso Barrionuevo. Degree in Engineering Technologies Telecommunications

//Events of state:
//-ErrorGraphInfo: Creation of div of error
//-ErrorGraphTimes: Creation of div of error
//-ErrorGraphAges: Creation of div of error
//-ErrorGraphAgesD: Creation of div of error
//*Nota: Events of error uses the same function to create an error div
//-DrawInfo: Creation of a graph of type Info
//-DrawTimes: Creation of a graph of type Time
//-DrawAges: Creation of a graph of type Age
//-DrawAgesD: Creation of a graph of type Ages that uses two jsons


//Variables

//variables to count widgets and panels
var actualPanel=0;
var numPanel=0;
var numWidget=0;
//variables to get the configuration from a dashboard
var dashConfiguration={};
//configuration of files where we will read
var configuration={};
var takeinfo={};
//Caché that has all widgets
var panels=[]


$(document).ready(function() {
    //Request of configuration keys

    $.when(
      $.getJSON("templates/json/configurationfile.json").success(function(data){
        Object.keys(data).forEach(function(element){
            configuration[element]=data[element]
        })
      }),

      //Request of files of configuration to know where to read our data
      //Each kind of data has three states:
      // --0: not, --1: in demand, --2: is there

      $.getJSON("templates/json/referenceinfo.json").success(function(data){
        var objaux;
        Object.keys(data).forEach(function(element){
            objaux={
                saveData: '',
                state: 0,
                inside: data[element]
            }
            takeinfo[element]=objaux
        })
      })
    ).done(function(){

      //Zone of loading of a json configuration of a determinate personalized dashboard
      if(document.URL.split("/")[document.URL.split("/").length-1]!=''){

          var N= document.URL.split("/")[document.URL.split("/").length-1]

          //We make a request to our server for the personalized json
          $.ajax({
            type: "GET",
            url: "/db/"+N,
            data: N.toString(),
            dataType: "json",
            success: function(data){

              dashConfiguration=data;
              //Before to begin we make the dashboards to put in each of them their widgets
              Object.keys(dashConfiguration).forEach(function(element){
                DashCreation()
              })

              
              //To make a save we have to have a panel as minimum.
              //That means that we can try to draw a panel if we have one.
    
              numGraphActual(dashConfiguration)
              makeDashboardContent(1)
              actualDash= 1
              $("#dash1").slideDown("slow");
            }
          });
      }else{
        /*
        //en otro caso solicito la descarga del fichero por defecto
        $.ajax({
            type: "GET",
            url: "/db/0",
            data: 0,
            dataType: "json",
            success: function(data){

              dashConfiguration=data;

              //Antes de empezar creo todos los dashboards para evitarme problemas de dibujar
              Object.keys(data).forEach(function(element){
                DashCreation()
              })

              
              //Para guardar como mínimo debo tener 1 dashboard, dash1 va a existir, esto significa
              //que al menos puedo intentar pintarlo, y solo pinto este y lo muestro
              //Cada dashboard se pinta cuando se desea ver
              numGraphActual(dashConfiguration)
              makeDashboardContent(1)
              actualDash= 1
              
              $("#dash1").slideDown("slow");
            }
          });
        */
      }

    }).fail(function(){
      alert("Los archivos de configuración no se han cargado correctamente. Sus gráficas no pueden ser reproducidas")
    })
  
/*

  //Save button
  $("#save").click(function(){

    var finalObj={}
 
    //Antes de empezar compruebo que al menos existe 1 dashboard del que guardar algo
    if(numDash>0){
      
      for (i=1; i<=numDash;i++){
       //paseándome dashboard por dashboard
        if($("#dash"+i+" ul")){

          //creo un objeto único para cada uno con id la misma que la de su div
          finalObj["#dash"+i]=[]
          var gridster = $("#dash"+i+" ul").gridster().data('gridster');
          //obtengo y serializo el gridster que tiene en su interior para conseguir acceder a todas sus graficas
          var gridata=gridster.serialize()

          for(j=0; j<gridata.length; j++){

            //consigo el chart de cada una y creo un nuevo objeto con las caracteristicas de objaux
            content= $("#"+gridata[j].id)
            var chart = $("#"+content.selector.split("#graph")[1]).highcharts()
            var objaux={
              graph: content.selector.split("#graph")[1],
              xAxis:chart.series[0].xAxis.categories,
              title: chart.title.textStr,
              series: []
            }

            //dentro de objaux relleno las opciones de series
            chart.series.forEach(function(serie){
              var name= serie.name
              var type= serie.options.type
              if(serie.options.color==undefined){
                var color=""
              }else{
                var color= serie.options.color
              }
              var objaux2={
                name: name,
                type: type,
              }
              objaux.series.push(objaux2)
            })

            //y finalmente lo añado al objeto final donde queda un objeto de indices cada dashboard,
            //de cada indice de propiedad un array con las propiedades de cada una de las gráficas para 
            //pintarlas
            finalObj["#dash"+i].push(objaux)
          }
        }
      }

      //Para guardar comprobamos que no nos encontramos ya en un dashboard guardado
      if(document.URL.split("/")[document.URL.split("/").length-1]==""){

        $.ajax({
          type: "GET",
          url: "/db/",
          success: function(data){
            var idList= data.split(",")
            if(idList.length==1000000000000000){
              alert("Lo sentimos el servidor está lleno.")
            }else{

              var id= Math.floor((Math.random() * 1000000000000000) + 1)
              
              while((idList.indexOf(id)!=-1) && id!=0000000000000000){
                id= Math.floor((Math.random() * 1000000000000000) + 1)
              }

              var send={
                N: id,
                C: finalObj
              }

              //y creamos uno nuevo con un post al recurso /db/
              $.ajax({
                type: "POST",
                url: "/db/",
                data: JSON.stringify(send),
                success: function(data){
                  alert(data)
                }
              });

              window.history.replaceState("object or string", "Title", id);
            }
          }
        });

      }else{
        //en otro caso se realiza un put al recurso /db/<integer>
        var send={
          N: document.URL.split("/")[document.URL.split("/").length-1],
          C: finalObj
        }
        $.ajax({
          type: "PUT",
          url: "/db/"+document.URL.split("/")[document.URL.split("/").length-1].toString(),
          data: JSON.stringify(send),
          success: function(data){
            alert(data)
          }
        });
      }

    }

  })
*/
  $("#addDash").click(function(){
    DashCreation()
  })

});

//Function to show the settings to create new widgets
function showSettings(panel){
  $("#settings"+panel).slideDown();

}

//******************************************************************************************************//
//************************************** Create a graph of kind "Info chart" ***************************//
//******************************************************************************************************//


/*

//Function to get the selected options to create the graph
function takeDataInfo(numGraph){
  var form=$("#currentMenu input[type='radio']:checked").attr("value");
  if(form!=undefined){
    //Taking selected metrics 
    var selected = [];
    var form=$("#currentMenu input[type='radio']:checked").attr("value");
    $("#currentMenu input[type='checkbox']:checked").each(function() {
      objaux={
        name:$(this).attr('value'),
        type: form
      }
      selected.push(objaux);
    });
    if($("#currentMenu #title").val()==''){
      var title=($("#currentMenu #title").attr("placeholder"))
    }else{
      var title=$("#currentMenu #title").val()
    }
    //taking jsons
    var jsons= takeinfo.static.inside
    //taking background color
    var color=($("#panel"+actualPanel).css('background-color'))

    if(selected.length!=0){
      makeGraphInfo(actualPanel,selected,title,jsons,color,numGraph)
    }else{
      alert("We can not represent a graph without data")
    }
  }else{
    alert("We need that you select a style to represent the data")
  }
}


//This function tries to take the real data to draw an actualized graph. 
//In case of error, it calls other function to transform the final result in an error widget.
function makeGraphInfo(panel,selected,title,jsons,color,graph){

  //If the variable graph is undefined we have to create a new graph. 
  //In other case we have to change the variables of an existing graph.
  if(isNaN(graph)){
    numGraph+=1;
    graph=numGraph;
    var gridster = $("#panel"+panel+" ul").gridster().data('gridster');
    var chart= new HighInfo(graph,color,panel,title,selected,jsons)
    gridster.add_widget(chart.square, chart.x, chart.y);
    widgets.push(chart)
    dashToSave["#panel"+panel].push(chart.flatten())
  }else{
    //In other case i take the created chart, i destroy it, and then i build it again
    var chart = $('#'+graph).highcharts();
    chart.destroy()
    var wid=GetWidget(graph)
    wid.series=selected
    wid.title=title;
    var flatten=GetElementFromDash(panel,graph)
    flatten.series=selected;
    flatten.title=title;
  }

  //I destroy the current menu
  $("#currentMenu").remove();
  $("#making").slideUp("slow")

  //In the right way i will draw the graph
  $("#"+graph).on("DrawInfo",function(event,trigger,data){
    var serie= parserGraphInfoHigh(selected,data)
    drawGraphInfoHigh(graph,serie,title)
    $("#"+this.id).off()
  })

  //In the wrong way i will draw an error widget
  $("#"+graph).on("ErrorGraphInfo",function(){
    drawErrorWidget(this.id)
    $("#"+this.id).off()
  })

  //If we haven't the data in cache we will request them
  if(takeinfo.static.state==0){

    //We actualise the state of data
    takeinfo.static.state=1;
    //The request is on course

    $.getJSON(takeinfo.static.inside).success(function(data) {

        takeinfo.static.saveData=data
        takeinfo.static.state=2;

        $("*").trigger("DrawInfo",["DrawInfo",data])
      }).error(function(){
        //In case of error we will throw the error event
        $("*").trigger("ErrorGraphInfo")
        takeinfo.static.static=0;

    });
  }else if(takeinfo.static.state==2){
    //If we have the data in caché we will use it
    var serie= parserGraphInfoHigh(selected,takeinfo.static.saveData);
    drawGraphInfoHigh(graph,serie,title)
  }
}

//it massages the info to draw a graph in highchart
function parserGraphInfoHigh(selected,data){
  var selection=[];
  selected.forEach(function(element){
    dataAux=data[element.name];
    arrayAux=[dataAux]
    obj={
      type: element.type,
      name: element.name,
      data: arrayAux
    }
    selection.push(obj)
  })
  
  return selection
}


//This function shows a new menu with the metrics of a specific graph created selected
//It leaves to draw an existing graph with new metrics
function settingsInfoGraph(numGraph){
  var chart = $('#'+numGraph).highcharts();
  if(chart!=undefined){
    var keys=configuration.static
    var auxseries;
    $("#making").slideDown("slow")

    if($("#currentMenu")){
      $("#currentMenu").remove();
    }

    $("#conten").append('<div id="currentMenu"><p id="list" style="height: 200px; overflow-y: scroll;"></p></div>')
    if(chart.series[0].type=="column"){
      $("#currentMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column" checked>Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar">Barras  </p>');
    }else{
      $("#currentMenu").append('<p><input type="radio" name="toSeeOptions" class="radios" value="column">Columnas  <input type="radio" name="toSeeOptions" class="radios" value="bar" checked>Barras  </p>');
    }
    keys.forEach(function(element){
      if(existLabelHigh(chart,element)){
        $("#currentMenu #list").append('<p><input type="checkbox" value="'+element+'" checked> '+element+'</p>')
      }else{
        $("#currentMenu #list").append('<p><input type="checkbox" value="'+element+'"> '+element+'</p>')
      }
    })
    $("#currentMenu").append('<p>Title</p><p><input placeholder="'+chart.title.textStr+'" id="title" class="form-control"></div></p>')
    $("#currentMenu").append('<button onclick="takeDataInfo('+numGraph+')" type="button" class="btn btn-xs btn-default">Create</button>')
    $("#currentMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
  }else{
    alert("This graph does not exist or has errors")
  }
}
*/
//*******************************************************************************************************//
//************************************** Create a graph of kind "Aging chart" ***************************//
//*******************************************************************************************************//
/*
//Enseñamos las opciones si estan todos los archivos correctos
function showAgingSettings(dash){
  $("#settings"+dash).slideUp("slow");
  $("#making").slideDown("slow")
  if((Object.getOwnPropertyNames(takeinfo).length === 0) || (Object.getOwnPropertyNames(configuration).length === 0)){
      $("#conten").append('<div id="actualMenu"></div>')
      $("#currentMenu").append('<p>Los ficheros de configuración no han sido cargados con normalidad. Compruebe su conexión<p>');
      $("#currentMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Continue</button>')
  }else{
    if($("#currentMenu")){
      $("#currentMenu").remove();
    }
    $("#conten").append('<div id="currentMenu"></div>')
    $("#currentMenu").append('<p><div class="form-group"><label><input id="aging" type="checkbox" value="aging">Aging</label><input placeholder="#4D8FB8" id="agingColor" class="form-control"></div></p>')
    $("#currentMenu").append('<p><div class="form-group"><label><input id="birth" type="checkbox" value="birth">Birth</label><input placeholder="#081923" id="birthColor" class="form-control"></div></p>')
    $("#currentMenu").append('<p>Title</p><p><input placeholder="Demograph graph" id="title" class="form-control"></div></p>')
    $("#currentMenu").append('<button onclick="takeDataDemo()" type="button" class="btn btn-xs btn-default">Create</button>')
    $("#currentMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
  }
}

//tomamos los datos seleccionados 

function takeDataDemo(graph){
  var jsons=[];
  var selected=[];
  if($("#currentMenu #title").val()==''){
    var title=($("#currentMenu #title").attr("placeholder"))
  }else{
    var title=$("#currentMenu #title").val()
  }

  //taking background color
  var color=($("#panel"+actualPanel).css('background-color'))

  //Miramos si cada dato está seleccionado, y en caso de estarlo
  //miramos si se ha seleccionado un color específico
  if($("#aging").is(':checked')){
    jsons.push(takeinfo.aging.inside)
    var colorbar;
    if($("#currentMenu #agingColor").val()==''){
      colorbar=($("#currentMenu #agingColor").attr("placeholder"))
    }else{
      colorbar=$("#currentMenu #agingColor").val()
    }

    var objaux={
      type: "bar",
      name: "aging",
      color: colorbar
    }
    selected.push(objaux)
  }
  if($("#birth").is(':checked')){
    jsons.push(takeinfo.birth.inside)
    var colorbar;
    if($("#currentMenu #birthColor").val()==''){
      colorbar=($("#currentMenu #birthColor").attr("placeholder"))
    }else{
      colorbar=$("#currentMenu #birthColor").val()
    }
    var objaux={
      type: "bar",
      name: "birth",
      color: colorbar
    }
    selected.push(objaux)

  }

  //El producto final será un array con cada parte seleccionada

  if(selected.length==0){
    alert("We can not represent a graph without data")
  }else{
    makeGraphAges(actualPanel,selected,title,color,jsons,graph)
  }
}

//Función que crea lo básico para que la gráfica se dibuje
function makeGraphAges(panel,selected,title,color,jsons,graph){
  //dibujamos su posible div o elminamos la gráfica anterior
  if(isNaN(graph)){
    numGraph+=1;
    graph=numGraph
    var gridster = $("#panel"+panel+" ul").gridster().data('gridster');
    var chart= new HighAge(graph,color,panel,title,selected,jsons)
    gridster.add_widget(chart.square, chart.x, chart.y);
    widgets.push(chart)
    dashToSave["#panel"+panel].push(chart.flatten())
  }else{
    var chart = $('#'+graph).highcharts();
    chart.destroy()
    var wid=GetWidget(graph)
    wid.series=selected
    wid.title=title;
    var flatten=GetElementFromDash(panel,graph)
    flatten.series=selected;
    flatten.title=title;
  }

  //Destruyo el actual menú de seleccion
  $("#currentMenu").remove();
  $("#making").slideUp("slow")

  //Si toDraw es solo 1 hemos elegido un único dato, en otro caso debemos hacer referencia a todos los
  //seleccionados
  if(selected.length==1){
    //En caso de que la llamada sea positiva serializo con lso datos obtenidos
    $("#"+graph).on("DrawAges",function(event,trigger,data){
      
      var series=[];

      //parseamos los datos
      var dato=parserDemograph(data)
      max=dato.length
      var objaux={
            type: "bar",
            name: selected[0].name,
            data: dato.reverse(),
            color: selected[0].color
      }
      series.push(objaux)

      var axisx=createAxisx(max).reverse()

      drawDemograph(series,axisx,title,graph)
      $("#"+this.id).off()
    })

    //En caso negativo dibujo un widget roto
    $("#"+graph).on("ErrorGraphAges",function(){
      drawErrorWidget(this.id)
      $("#"+this.id).off()
    })

    //Si nunca he pedido esta información significa que debo pedirla
    if(takeinfo[selected[0].name].state==0){

      takeinfo[selected[0].name].state=1

      //hago la llamada para obtener el dato
      $.getJSON(takeinfo[selected[0].name].inside).success(function(data) {

        takeinfo[selected[0].name].state=2
        takeinfo[selected[0].name].saveData=data

        //desatamos el evento de dibujar posibles gráficas en curso
        $("*").trigger("DrawAges",["DrawAges",data])
      }).error(function(){
          $("*").trigger("ErrorGraphAges")

      })

    //El otro caso es que ya lo tenga
    }else if(takeinfo[selected[0].name].state==2){
      var data=takeinfo[selected[0].name].saveData
      var series=[];

      //parseamos los datos
      var dato=parserDemograph(data)
      max=dato.length
      var objaux={
            type: "bar",
            name: selected[0].name,
            data: dato.reverse(),
            color: selected[0].color
      }
      series.push(objaux)

      var axisx=createAxisx(max).reverse()
      //Si ya lo tenemos parseamos los datos y dibujamos
      drawDemograph(series,axisx,title,graph)
    }

  //El otro caso es que seleccionara los 2 posibles casos
  }else if(selected.length==2){

    //En caso positivo lo dibujo
    $("#"+graph).on("DrawAgesD",function(event,trigger){
      var series=[]

      if(parserDemograph(selected[0].save).length>=parserDemograph(selected[1].save).length){
        max=parserDemograph(selected[0].save).length
      }else{
        max=parserDemograph(selected[1].save).length
      }

      var dato=parserDemograph(selected[0].save).reverse()
      
      var objaux={
            type: "bar",
            name: selected[0].name,
            data: dato,
            color: selected[0].color
      }
      series.push(objaux)

      var dato=parserDemograph(selected[1].save).reverse()
      
      var objaux={
            type: "bar",
            name: selected[1].name,
            data: dato,
            color: selected[1].color
      }
      series.push(objaux)

      var axisx=createAxisx(max).reverse();
      drawDemograph(series,axisx,title,graph)
      $("#"+this.id).off()
    })

    //En caso negativo dibujo un widget roto
    $("#"+graph).on("ErrorGraphAges",function(){
      drawErrorWidget(this.id)
      $("#"+this.id).off()
    })

    //Si cualquiera de los dos widgets falla debo hacer un allamada, lo mismo da que se haga a dos cosas
    //si la que ya he pedido funcionó volverá a hacerlo
    if((takeinfo[selected[0].name].state==0) || (takeinfo[selected[1].name].state==0)){
      //establezco pautas de partes con jquery y coloco mi estado a "pedido"
      takeinfo[selected[0].name].state=1
      takeinfo[selected[1].name].state=1

      $.when(
        $.getJSON(takeinfo[selected[0].name].inside).success(function(data) { 
            selected[0].save = data;
        }),
        $.getJSON(takeinfo[selected[1].name].inside).success(function(data) {
            selected[1].save = data;
        })
      ).done(function() {
        //si lo hemos conseguido actualizamos nuestros datos
        takeinfo[selected[0].name].state=2
        takeinfo[selected[0].name].saveData=selected[0].save

        takeinfo[selected[1].name].state=2
        takeinfo[selected[1].name].saveData=selected[1].save

        $("*").trigger("DrawAgesD",["DrawAgesD",data])

      }).fail(function(){
        //en caso de equivocarnos no nos olvidemos de colocar todo a 0
        takeinfo[selected[0].name].state=0
        takeinfo[selected[1].name].state=0

        $("*").trigger("ErrorGraphAgesD")

      })

    }else if((takeinfo[selected[0].name].state==2) && (takeinfo[selected[1].name].state==2)){

      //Si ya lo tenemos todo nos limitamos a dibujar como hacemos arriba
      var series=[]

      if(parserDemograph(takeinfo[selected[0].name].saveData).length>=parserDemograph(takeinfo[selected[1].name].saveData).length){
        max=parserDemograph(takeinfo[selected[0].name].saveData).length
      }else{
        max=parserDemograph(takeinfo[selected[1].name].saveData).length
      }

      var dato=parserDemograph(takeinfo[selected[0].name].saveData).reverse()
      
      var objaux={
            type: "bar",
            name: selected[0].name,
            data: dato,
            color: selected[0].color
      }
      series.push(objaux)

      var dato=parserDemograph(takeinfo[selected[1].name].saveData).reverse()
      
      var objaux={
            type: "bar",
            name: selected[1].name,
            data: dato,
            color: selected[1].color
      }
      series.push(objaux)

      var axisx=createAxisx(max).reverse();

      drawDemograph(series,axisx,title,graph)
    }
  }
}


//Con esta función dibujo una gráfica de tipo edades con los datos que me pasen
function drawDemograph(series,axisx,title,graph){
  var options={
    chart:{
        renderTo:graph.toString(),
        width: 460,
        height: 395
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
                              makeAutorsGraph(this.category,title);
                            }
                        }
                    }
                }
            },
   
    title: {
        text: title
    },
    series: series
    }
    chart= new Highcharts.Chart(options);
}

//función que me clasifica las edades
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

//función que crea las categorias de una gráfica de edades
function createAxisx(max){
  var result=[];
  for (i = 0; i < max; i++) {
    result[i]= (i*181)+"-"+((i+1)*181)
  }
  return result
}



function makeAutorsGraph(categoria,title){
  var jsons= title.split(" ")
  var aux= categoria.split("-")
  var from= parseInt(aux[0])
  var to= parseInt(aux[1])
  if(jsons.length==2){
    var graphicAging, graphicBirth;
    var whereaging=takeinfo.aging;
    var wherebirth=takeinfo.birth;
    
    graphicAging=takeinfo[jsons[0].split("-")[2]].saveData
    graphicBirth=takeinfo[jsons[1].split("-")[2]].saveData
    var series= parseLookInfo(from,to,graphicAging)
    series=parseLookInfo(from,to,graphicBirth,series)
    series=parserAutorsData(series)

    numGraph+=1;
    var inDash= "dash"+actualDash.toString()
    color=($("#dash"+actualDash).css('background-color'))
    var gridster = $("#"+inDash+" ul").gridster().data('gridster');
    var title="Usuarios entre "+from+"-"+to+" de "+title


    if((series.length)<=12 && (series.length)>=8){

      gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+actualDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 15, 12);

    }else if((series.length)<8){

      gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+actualDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 12, 8);

    }else{

      gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+actualDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 34, 13);

    }

    drawAutorsGraph(numGraph,series)
  
  }else{
    data=takeinfo[title.split("-")[2]].saveData
    var series= parseLookInfo(from,to,data)
    numGraph+=1;
    var inDash= "dash"+actualDash.toString()
    color=($("#dash"+actualDash).css('background-color'))
    var gridster = $("#"+inDash+" ul").gridster().data('gridster');
    series=parserAutorsData(series)
    var title="Usuarios entre "+from+"-"+to+" de "+title


    if((series.length)<=12 && (series.length)>=8){

      gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+actualDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 15, 12);

    }else if((series.length)<8){

      gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+actualDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 12, 8);

    }else{

      gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+actualDash+','+numGraph+')" type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 34, 13);

    }

    drawAutorsGraph(numGraph,series)
  
  }
}


//funcion para dibujar la grafica de autores de manera que sea mas facil
//y agradable a la vista el representarla
function drawAutorsGraph(id,serie,title){

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
          renderTo:numGraph.toString(),
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

function parserAutorsData(series){
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

function parseLookInfo(from,to,data,aux){
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
    aux=Math.floor(element/181)
    if(aux>=Math.floor(from/181) && aux<Math.floor(to/181)){
      result.dato.push(element)
      result.xAxis.push(data.persons.name[i])
           
    }
    i++
  })

  return result
}

function settingsDemoGraph(numGraph){
  var chart = $('#'+numGraph).highcharts();
  var auxseries;

  $("#making").slideDown("slow")

  if($("#currentMenu")){
    $("#currentMenu").remove();
  }

  $("#conten").append('<div id="currentMenu"></div>')
  if(existLabelHigh(chart,"aging")){
    auxseries=getSeriesbyName(chart,"aging");
    $("#currentMenu").append('<p><div class="form-group"><label><input id="aging" type="checkbox" value="aging" checked>Aging</label><input placeholder="'+auxseries.color+'" id="agingColor" class="form-control"></div></p>')
  }else{
    $("#currentMenu").append('<p><div class="form-group"><label><input id="aging" type="checkbox" value="aging">Aging</label><input placeholder="#4D8FB8" id="agingColor" class="form-control"></div></p>')
  }
  if(existLabelHigh(chart,"birth")){
    auxseries=getSeriesbyName(chart,"birth");
    $("#currentMenu").append('<p><div class="form-group"><label><input id="birth" type="checkbox" value="birth" checked>Birth</label><input placeholder="'+auxseries.color+'" id="birthColor" class="form-control"></div></p>')
  }else{
    $("#currentMenu").append('<p><div class="form-group"><label><input id="birth" type="checkbox" value="birth">Birth</label><input placeholder="#081923" id="birthColor" class="form-control"></div></p>')
  }
  $("#currentMenu").append('<p>Title</p><p><input placeholder="'+chart.title.textStr+'" id="title" class="form-control"></div></p>')
  $("#currentMenu").append('<button onclick="takeDataDemo('+numGraph+')" type="button" class="btn btn-xs btn-default">Redraw</button>')
  $("#currentMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
}
*/
//*******************************************************************************************************//
//************************************** Create a graph of kind "Time series chart" *********************//
//*******************************************************************************************************//
/*
//This function creates the configuration menu to draw an Time graph. In the menu will be the metrics to select what we want to draw.
function showTimeSettings(dash){
  $("#settings"+dash).slideUp("slow");
  $("#making").slideDown("slow")
  if((Object.getOwnPropertyNames(takeinfo).length === 0) || (Object.getOwnPropertyNames(configuration).length === 0)){
    $("#conten").append('<div id="currentMenu"></div>')
    $("#currentMenu").append('<p>Los ficheros de configuración no han sido cargados con normalidad. Compruebe su conexión<p>');
    $("#currentMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Continue</button>')
  }else{
    if($("#currentMenu")){
        $("#currentMenu").remove();
    }
    $("#conten").append('<div id="currentMenu"><div id="list" style="height: 200px; overflow-y: scroll;"></div></div>')
    configuration.evolutionary.forEach(function(element){
      $("#currentMenu #list").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column">Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline">Lineas    <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>')
    })
    $("#currentMenu").append('From')
    $("#currentMenu").append('<select id="from" class="form-control">')
    configuration.time.forEach(function(element){
      $("#currentMenu #from").append('<option value="'+element+'">'+element+'</option>')
    })
    $("currentMenu").append('</select>')
    $("#currentMenu").append('To')
    $("#currentMenu").append('<select id="to" class="form-control">')
    configuration.time.forEach(function(element){
      $("#currentMenu #to").append('<option value="'+element+'">'+element+'</option>')
    })
    $("#currentMenu").append('</select>')
    $("#to").val(configuration.time[configuration.time.length-1])
    $("#currentMenu").append('<p>Title</p><p><input placeholder="'+takeinfo.evolutionary.inside+'" id="title" class="form-control"></div></p>')
    $("#currentMenu").append('<button onclick="takeDataTime()" type="button" class="btn btn-xs btn-default">Create</button>')
    $("#currentMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')
  }
}

//Function to get the selected options to create the graph
function takeDataTime(numGraph){

  //Taking selected metrics 
  var selected = [];
  $("#currentMenu input[type='radio']:checked").each(function() {
    objaux={
      name:$(this).attr('name'),
      form: $(this).attr('value')
    }
    selected.push(objaux);
  });
  var to=$("#to option:selected").text()
  var from=$("#from option:selected").text()

  if($("#currentMenu #title").val()==''){
    var title=($("#currentMenu #title").attr("placeholder"))
  }else{
    var title=$("#currentMenu #title").val()
  }
  //taking jsons
  var jsons= takeinfo.evolutionary.inside
  //taking background color
  var color=($("#panel"+actualPanel).css('background-color'))

  var size= configuration.time.indexOf(to.toString()) - configuration.time.indexOf(from.toString())

  if(selected.length!=0){

    makeGraphSeries(actualPanel,selected,from,to,size,jsons,color,title,numGraph)
  }else{
    alert("We can not represent a graph without data")
  }

}

//This function tries to take the real data to draw an actualized graph. 
//In case of error, it calls other function to transform the final result in an error widget.
//In case of "times graph" in highchart we have a problem to remove the old graph and put the new 
//graph with the original id because the function to remove in this library is too slow and makes 
//an error. So this function remove the old graph and creates a new widget with a new  id and a new actualized graph.

function makeGraphSeries(panel,selected,from,to,size,jsons,color,title,graph){

  //If the variable graph is undefined we have to create a new graph. 
  //In other case we have to change the variables of an existing graph.
  if(!isNaN(graph)){
    var chart=GetWidget(graph);
    var flatten=GetElementFromDash(panel,graph);

    deleteWidget(panel,graph);

    numGraph+=1;
    graph=numGraph;

    chart.series=selected;
    chart.changeId(graph);
    chart.changeSize(size);
    chart.from=from;
    chart.title=title;
    chart.to=to;

    flatten.series=selected;
    flatten.id=graph;
    flatten.from=from;
    flatten.to=to;
    flatten.title=title;

    widgets.push(chart)
    dashToSave["#panel"+panel].push(chart.flatten())
  }else{
    numGraph+=1;
    graph=numGraph;
    var chart= new HighTimes(graph,color,panel,from,to,size,title,selected,jsons)
    widgets.push(chart)
    dashToSave["#panel"+panel].push(chart.flatten())

  }
  
  var gridster = $("#panel"+panel+" ul").gridster().data('gridster');

  gridster.add_widget(chart.square, chart.x, chart.y);


  //I destroy the current menu
  $("#actualMenu").remove();
  $("#making").slideUp("slow")

  //In the right way i will draw the graph
  $("#"+graph).on("DrawTimes",function(event,trigger,data){
    var serie= parserGraphTime(configuration.time.indexOf(from.toString()),configuration.time.indexOf(to.toString()),data,selected);
    var x= parserGraphTimeX(data,configuration.time.indexOf(from.toString()),configuration.time.indexOf(to.toString()))
    drawGraphTimes(graph,serie,title,size,x)
    $("#"+this.id).off()
  })

  //In the wrong way i will draw an error widget
  $("#"+graph).on("ErrorGraphTimes",function(){
    drawErrorWidget(this.id)
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

      $("*").trigger("DrawTimes",["DrawTimes",data])
     
    }).error(function(){
      //In case of error we will throw the error event
      $("*").trigger("ErrorGraphTimes")
      takeinfo.static.static=0;
    });
  }else if(takeinfo.evolutionary.state==2){
    //Si lo tengo en caché lo dibujo directamente
    var serie= parserGraphTime(configuration.time.indexOf(from.toString()),configuration.time.indexOf(to.toString()),takeinfo.evolutionary.saveData,selected);
    var x= parserGraphTimeX(takeinfo.evolutionary.saveData,configuration.time.indexOf(from.toString()),configuration.time.indexOf(to.toString()))
    drawGraphTimes(graph,serie,title,size,x)
  }
}

function remakeGraphSeries(dash,selected,from,to,graph){
  // Creamos un div estandar de forma que cuando dibujemos nuestra gráfica cambiamos el tamaño para mejorar 
  //el rendimiento del gridster
  if(numGraph<graph){
    numGraph=graph
  }
  var inDash= "dash"+dash.toString()
  var gridster = $("#"+inDash+" ul").gridster().data('gridster');
  color=($("#dash"+dash).css('background-color'))
  if((to-from)<=12 && (to-from)>=8){

    gridster.add_widget('<div id= "graph'+graph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button id="deleteButton" onclick="deleteGraph('+dash+','+graph+')" type="button" class="btn btn-xs btn-default">Delete</button><button id="settingsButton" onclick="settingsTimeGraph('+graph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+graph+'" class="panel-body"> <img id="load'+graph+'" src="/templates/images/cargando.gif" height="42" width="42"></div></div>', 15, 12);

  }else if((to-from)<8){

    gridster.add_widget('<div id= "graph'+graph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button id="deleteButton" onclick="deleteGraph('+dash+','+graph+')" type="button" class="btn btn-xs btn-default">Delete</button><button id="settingsButton" onclick="settingsTimeGraph('+graph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+graph+'" class="panel-body"> <img id="load'+graph+'" src="/templates/images/cargando.gif" height="42" width="42"></div></div>', 12, 8);


  }else{

    gridster.add_widget('<div id= "graph'+graph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button id="deleteButton" onclick="deleteGraph('+dash+','+graph+')" type="button" class="btn btn-xs btn-default">Delete</button><button id="settingsButton" onclick="settingsTimeGraph('+graph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+graph+'" class="panel-body"> <img id="load'+graph+'" src="/templates/images/cargando.gif" height="42" width="42"></div></div>', 31, 13);

  }
  
  //En caso positivo lo dibujo
  $("#"+graph).on("DrawTimes",function(event,trigger,data){
    var serie= parserGraphTime(from,to,data,selected);
    var x= parserGraphTimeX(data,from,to)
    drawGraphTimes(graph,serie,takeinfo.evolutionary.inside,from,to,x)
    $("#"+this.id).off()
  })

  //En caso negativo dibujo un widget roto
  $("#"+graph).on("ErrorGraphTimes",function(){
    drawErrorWidget(this.id)
    $("#"+this.id).off()
  })

  //si no lo tengo hago una petición al servidor para poder tenerlo
  if(takeinfo.evolutionary.state==0){
    takeinfo.evolutionary.state==1;
    //en el caso de que lo consiga dibujo la gráfica y activo el disparador de evento para el times
    $.getJSON('templates/json/'+takeinfo.evolutionary.inside).success(function(data){

      //actualizo mi estado a terminado
      takeinfo.evolutionary.saveData=data
      takeinfo.evolutionary.state=2;

      //y llamo a pintar grafica de tipo info
      $("*").trigger("DrawTimes",["DrawTimes",data])
     
    }).error(function(){
      //En caso de error levanto el evento de gráfica mal pintada
      $("*").trigger("ErrorGraphTimes")
      takeinfo.evolutionary.static=0;
    });
  }else if(takeinfo.evolutionary.state==2){
    //If we have the data in caché we will use it
    var serie= parserGraphTime(from,to,takeinfo.evolutionary.saveData,selected);
    var x= parserGraphTimeX(takeinfo.evolutionary.saveData,from,to)
    drawGraphTimes(graph,serie,takeinfo.evolutionary.inside,from,to,x)
  }
}

//Function that draws a graph of kind TIMES in highcharts
function drawGraphTimes(graph,serie,title,size,xAxis){

  $("#load"+graph).remove()

  var chart = $('#'+graph).highcharts();

  if((size)<=12 && (size)>=8){
    var options={
      chart:{
          renderTo:graph.toString(),
          width: 430,
          height: 307
      },
      xAxis: {
        categories: xAxis
      },
      title: {
          text: title
      },
      series: serie
    }

  }else if((size)<8){
    var options={
      chart:{
          renderTo:graph.toString(),
          width: 340,
          height: 177
      },
      xAxis: {
        categories: xAxis
      },
      title: {
          text: title
      },
      series: serie
    }

  }else{
    var options={
      chart:{
          renderTo:graph.toString(),
          width: 900,
          height: 337
      },
      xAxis: {
        categories: xAxis
      },
      title: {
          text: title
      },
      series: serie,
      
    }
  }
  var chart= new Highcharts.Chart(options);

}

//Function to interpret the x plane
function parserGraphTimeX(data,from,to){
  return data.date.slice(from,to+1)
}

//Function to interpret the data
function parserGraphTime(from,to,data,selected){
    var selection=[];
    var dataAux;
    selected.forEach(function(element){
      dataAux=data[element.name].slice(from,to+1)
      obj={
          type: element.form,
          name: element.name,
          data: dataAux
      }
      selection.push(obj)
    })
    return selection;
}

//This function shows a new menu with the metrics of a specific graph created selected
//It leaves to draw an existing graph with new metrics
function settingsTimeGraph(numGraph){
  var chart = $('#'+numGraph).highcharts();
  var keys=configuration.evolutionary
  var auxseries;
  $("#making").slideDown("slow")

  if($("#currentMenu")){
    $("#currentMenu").remove();
  }
  $("#conten").append('<div id="currentMenu"><div id="list" style="height: 200px; overflow-y: scroll;"></div></div>')

  keys.forEach(function(element){
    if(existLabelHigh(chart,element)){
      auxseries=getSeriesbyName(chart,element);
      if(auxseries.type=="column"){
        $("#currentMenu #list").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column" checked>Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline">Lineas <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>');
      }else{
        $("#currentMenu #list").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column" >Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline" checked>Lineas <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>');
      }
    }else{
      $("#currentMenu #list").append('<p>'+element+':   <input id="'+element+'bar" type="radio" name="'+element+'" class="radios" value="column">Barras<input id="'+element+'line" type="radio" name="'+element+'" class="radios" value="spline">Lineas <button onclick="resetRatios('+element+'bar,'+element+'line)" type="button" class="btn btn-xs btn-default">Reset</button></p>');
    }
  })
  $("#currentMenu").append('From')
  $("#currentMenu").append('<select id="from" class="form-control">')
  configuration.time.forEach(function(element){
    $("#currentMenu #from").append('<option value="'+element+'">'+element+'</option>')
  })
  $("#currentMenu").append('</select>')
  $("#currentMenu").append('To')
  $("#currentMenu").append('<select id="to" class="form-control">')
  configuration.time.forEach(function(element){
    $("#currentMenu #to").append('<option value="'+element+'">'+element+'</option>')
  })
  $("#currentMenu").append('</select>')

  var position=chart.series[0].data.length-1;
  var position2= configuration.time.indexOf(chart.series[0].data[position-1].category)
  var month= configuration.time[position2+1]

  $("#from").val(chart.series[0].data[0].category)
  $("#to").val(configuration.time[position2+1])
  $("#currentMenu").append('<p>Title</p><p><input placeholder="'+chart.title.textStr+'" id="title" class="form-control"></div></p>')
  $("#currentMenu").append('<button onclick="takeDataTime('+numGraph+')" type="button" class="btn btn-xs btn-default">Redraw</button>')
  $("#currentMenu").append('<button onclick="deleteCreation()" type="button" class="btn btn-xs btn-default">Cancel</button>')

}

function resetRatios(element1,element2){
  element1.checked=false;
  element2.checked=false;
}
*/
//************************************************ FUNCIONES DE MOVIMIENTOS DEL DASH Y DEMÁS************
/*

//función que a partir del json de configuración mira cual es el numero
//actual de gráfica
function numGraphActual(dashConfiguration){
  Object.keys(dashConfiguration).forEach(function(element){

    dashConfiguration[element].forEach(function(graph){

      if(numGraph < graph.graph){
        numGraph= graph.graph

      }
    })

  })

}

//función que dado un dashboard indicado a partir de la configuración descargada
//lo dibuja con todo su contenido
function makeDashboardContent(dash){

  dashConfiguration["#dash"+dash].forEach(function(x){

      var graph=parseInt(x.graph);
      var inDash= "dash"+dash
      var gridster = $("#"+inDash+" ul").gridster().data('gridster');
      color=($("#"+inDash).css('background-color'))

      var options={
        chart:{
          renderTo: x.graph,
            width: 100,
            height: 100
          },
          xAxis: {
            categories: []
          },
          title: {
              text: ""
          },
          series: []
      }

      if(x.title==takeinfo.aging.inside.split(".")[0] || x.title==takeinfo.birth.inside.split(".")[0] || x.title.split(" ").length==2){

        var toDraw=[]

        x.series.forEach(function(y){
          var objaux={
            forma: y.name,
            color: getRandomColor()
          }
          toDraw.push(objaux)

        })

        gridster.add_widget('<div id= "graph'+graph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+actualDash+','+graph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsDemoGraph('+graph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+graph+'" class="panel-body"> </div></div>', 23, 22);
        var chart= new Highcharts.Chart(options);

        makeGraphAges(actualDash,graph,toDraw)                      
        
      }else{

        var selected = [];

        x.series.forEach(function(y){
          var objaux = {
            name: y.name,
            form: y.type,
          }
          selected.push(objaux)

        })
        if(x.title==takeinfo.evolutionary.inside){

          from=configuration.time.indexOf(x.xAxis[0])
          to=configuration.time.indexOf(x.xAxis[x.xAxis.length-1])
          
          remakeGraphSeries(actualDash,selected,from,to,graph)

        }else if(x.title==takeinfo.static.inside){

          gridster.add_widget('<div id= "graph'+graph+'" class="panel panel-primary" style="border-style: groove;border-color: black;border-width: 3px"><div class="panel-heading" style="background-color:'+color+'"><button onclick="deleteGraph('+dash+','+graph+')" type="button" class="btn btn-xs btn-default">Delete</button><button onclick="settingsInfoGraph('+graph+')" type="button" class="btn btn-xs btn-default">Settings</button></div><div id="'+graph+'" class="panel-body"> </div></div>', 12, 8);
          var chart= new Highcharts.Chart(options);
          makeGraphInfo(actualDash,selected,graph)
        
        }
      }
    })
  dashConfiguration["#dash"+dash]=[]
}
*/
//********************************************************************************//
//************************************** Create graphs ***************************//
//********************************************************************************//

//This function creates the configuration menu to draw a graph. In the menu will be the metrics to select what we want to draw.
//--Esta función hay que modificarla con las futuras nuevas métricas y el menu desplegable
function showConfiguration(panel,type){

  $("#settings"+panel).slideUp("slow");
  var aux=$("#currentCreation").length
  if(aux!=0){
    deleteCreation(numWidget)
    numWidget--
  }
  aux=$("#currentSettings").length
  if(aux!=0){
    $("#currentSettings").remove()
  }
  var color=($("#panel"+panel).css('background-color'));
  var objectPanel=GetPanel(panel);
  numWidget++;

  if(type=="HighInfo"){
    var widget= new HighInfo(numWidget,panel,color);
    
  }else if(type=="HighDemo"){
    var widget= new HighDemo(numWidget,panel,color);
    
  }else if(type=="HighTime"){
    var widget= new HighTime(numWidget,panel,color);
    
  }

  objectPanel.pushElement(widget)
  $("#making").slideDown("slow")
  widget.makeMenu()
}

function FillWidget(id){
  var widget=GetWidget(id);
  widget.takeData();
  if(widget.toDraw){
    MakeWidget(widget)
  }
}

function MakeWidget(widget){
  widget.MakeWidget();
}

function ShowValuesGraph(id){
  $("#making").slideDown("slow")
  var widget=GetWidget(id);
  widget.settings();
}

function ChangeValuesGraph(id){
  var widget=GetWidget(id);
  widget.redraw()
}



//**********************************  FUNCIONES DE FILTRADO Y SELECCION DE DATOS ********************////

//función para obtener una serie y sus opciones por el nombre
//no se usa en info
function getSeriesbyName(chart,label){
  var result='';
  chart.series.forEach(function (element){
    if(element.name==label){
      result=element;
    }
  })
  return result;
}

//With this function we get an object panel from cache
function GetPanel(panel){
  var result;
  //Is necessary to create a new variable aux because javascript make a comparation of functions in the "if"
  panels.forEach(function(element){
    var aux=element.getId()
    if(aux==panel){
      result=element;
      return false;
    }
  })
  return result
}

//With this function we get an object widget from caché
function GetWidget(id){
  var result="";
  panels.forEach(function(element){
    var widgets=element.getWidgets();
    widgets.forEach(function(widget){
      if(widget.id==id){
        result=widget;
        return false;
      }
    })
    if(result!=""){
      return false
    }
  })
  return result;
}

//Function that leave us to know if an element is selected in a highchart
function existLabelHigh(chart,label){
  var result=false;
  chart.series.forEach(function (element){
    if(element.name==label){
      result=true;
    }
  })
  return result;
}

//Transforms a widget in an error widget.
function drawErrorWidget(graph){
  $("#graph"+graph+" #settingsButton").remove()
  $("#graph"+graph).attr("data-sizex",5)
  $("#graph"+graph).attr("data-sizey",5)
  $("#load"+graph).remove()
  $("#"+graph).append("Error al cargar los datos requeridos")
}


//Function that cancels the creation of a widget
function deleteCreation(id){
  $("#currentCreation").remove();
  $("#making").slideUp("slow");
  var widget=GetWidget(id);
  var idPanel= widget.getPanel();
  var panel=GetPanel(idPanel) 
  panel.deleteElement(widget)
}

//Function that cancels the remake of a widget
function deleteSettings(id){
  $("#currentSettings").remove();
  $("#making").slideUp("slow");
}


//Function to show a panel and its settings of creation of graphs
function showPanel(panel){
  if(actualPanel!=panel){
    //We hide the previous panel and we show the new
    $("#panel"+actualPanel).slideUp("slow");
    $("#settings"+actualPanel).slideUp("slow");
    $("#making").slideUp("slow")
    $("#currentMenu").remove();
    $("#panel"+panel).slideDown("slow");

    actualPanel=panel;
    //makeDashboardContent(panel)
  }

}

//Function get a random color from a list
function getRandomColor() {
    var colors= ["#25A2E1","#AED4E8","#4FBDFF","#79ACCC","#67B0E3"]
    return colors[Math.floor(Math.random() * 5)]
}

//Function to create a new panel
function DashCreation(){
  numPanel+=1;
  var panel= new Panel(numPanel)
  panels.push(panel)
  $(".container-fluid").append(panel.getContent())
  $(".gridster ul").gridster({
    widget_margins: [6, 6],
    widget_base_dimensions: [20, 20],
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
  $("#panels").append('<li onclick="showPanel('+numPanel+')"><a href="javascript:;" data-toggle="collapse" data-target="#scrollPanel'+numPanel+'"><i class="fa fa-fw fa-edit"></i> Panel '+numPanel+' <i class="fa fa-fw fa-caret-down"></i></a><ul id="scrollPanel'+numPanel+'" class="collapse"><li><a onclick="showSettings('+numPanel+')" href="javascript:void(0)">Add Graph</a></li><li><a onclick="deleteAllWidgets('+numPanel+')" href="javascript:void(0)">Delete all</a></li></ul></li>')
  if(actualPanel==0){
    actualPanel=1;
  }
}

