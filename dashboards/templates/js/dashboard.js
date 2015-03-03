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
                PanelCreation()
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
  


  //Save button
  $("#save").click(function(){

    var finalObj={}
 
    //Antes de empezar compruebo que al menos existe 1 dashboard del que guardar algo
    if(numPanel>0){
        var info={};
        panels.forEach(function(element){
          info[(Object.keys(element.flatten())[0])]=(element.flatten()[(Object.keys(element.flatten())[0])])
        })
      
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
                C: info
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

  $("#addPanel").click(function(){
    PanelCreation()
  })

});

//Function to show the settings to create new widgets
function showSettings(panel){
  $("#settings"+panel).slideDown();

}

//*******************************************************************************************************//
//************************************** Create a graph of kind "Aging chart" ***************************//
//*******************************************************************************************************//
/*



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
//******************************************************************//
//*********************** Functions dashboard **********************//
//******************************************************************//

//This function creates the configuration menu to draw a graph. In the menu will be the metrics to select what we want to draw.
//--Esta función hay que modificarla con las futuras nuevas métricas y el menu desplegable
function showConfiguration(panel,type,extraData){

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

//Function to create a new panel
function PanelCreation(){
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



//**********************************  Funciones de filtrado y seleccion de datos ********************////

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
  var idPanel= widget.panel;
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

function resetRatios(element1,element2){
  element1.checked=false;
  element2.checked=false;
}


