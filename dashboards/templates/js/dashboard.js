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
var dashConfiguration=[];
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
              Object.keys(data).forEach(function(element){
                PanelCreation(data[element].panel.color);
                var id=element.split("panel")[1]
                dashConfiguration.push(id)
                var panel= GetPanel(id)

                //With the panel created we pass to create the object of the widgets to draw them when we want to see each panel.
                data[element].widgets.forEach(function(widgetSaved){
                  if(numWidget<widgetSaved.id){
                    numWidget=widgetSaved.id
                  }
                  if(widgetSaved.type=="HighInfo"){
                    var widget= new HighInfo(widgetSaved.id,id,widgetSaved.color,widgetSaved.jsons,widgetSaved.title,widgetSaved.series)
                    panel.pushElement(widget)
                  }else if(widgetSaved.type=="HighDemo"){
                    var widget= new HighDemo(widgetSaved.id,id,widgetSaved.color,widgetSaved.jsons,widgetSaved.title,widgetSaved.series)
                    panel.pushElement(widget)
                  }else if(widgetSaved.type=="HighTime"){
                    var widget= new HighTime(widgetSaved.id,id,widgetSaved.color,widgetSaved.jsons,widgetSaved.title,widgetSaved.series,widgetSaved.from,widgetSaved.to,widgetSaved.size)
                    panel.pushElement(widget)
                  }
                })
              })
              $("#panel"+1).slideDown("slow");
              //makepanel is a function that creates a panel with the configuration saved
              makePanel(1)
            }
          });
      }else{
        
        //In other case we request the default configuration file
        $.ajax({
            type: "GET",
            url: "/db/0",
            data: "0",
            dataType: "json",
            success: function(data){
              Object.keys(data).forEach(function(element){
                PanelCreation(data[element].panel.color);
                var id=element.split("panel")[1]
                dashConfiguration.push(id)
                var panel= GetPanel(id)
                data[element].widgets.forEach(function(widgetSaved){
                  if(numWidget<widgetSaved.id){
                    numWidget=widgetSaved.id
                  }
                  if(widgetSaved.type=="HighInfo"){
                    var widget= new HighInfo(widgetSaved.id,id,widgetSaved.color,widgetSaved.jsons,widgetSaved.title,widgetSaved.series)
                    panel.pushElement(widget)
                  }else if(widgetSaved.type=="HighDemo"){
                    var widget= new HighDemo(widgetSaved.id,id,widgetSaved.color,widgetSaved.jsons,widgetSaved.title,widgetSaved.series)
                    panel.pushElement(widget)
                  }else if(widgetSaved.type=="HighTime"){
                    var widget= new HighTime(widgetSaved.id,id,widgetSaved.color,widgetSaved.jsons,widgetSaved.title,widgetSaved.series,widgetSaved.from,widgetSaved.to,widgetSaved.size)
                    panel.pushElement(widget)
                  }
                })
              })
              $("#panel"+1).slideDown("slow");
              makePanel(1)
            }
        });
        
      }

    }).fail(function(){
      alert("Los archivos de configuración no se han cargado correctamente. Sus gráficas no pueden ser reproducidas")
    })
  


  //Save button
  $("#save").click(function(){

    var finalObj={}
 
    //Before to save we check that we have one dashboard at least
    if(numPanel>0){
        var info={};
        panels.forEach(function(element){
          info[(Object.keys(element.flatten())[0])]=(element.flatten()[(Object.keys(element.flatten())[0])])
        })
      
      //To save we have to see if we are working in a created environment or we are creating a new dashboard.
      if(document.URL.split("/")[document.URL.split("/").length-1]==""){
        $.ajax({
          type: "GET",
          url: "/db/",
          success: function(data){

            var idList= data.split(",")
            if(idList.length==1000000000000000){
              alert("Sorry, the server is full.")
            }else{

              var id= Math.floor((Math.random() * 1000000000000000) + 1)
              
              while((idList.indexOf(id)!=-1) && id!=0000000000000000){
                id= Math.floor((Math.random() * 1000000000000000) + 1)
              }

              var send={
                N: id,
                C: info
              }

              //With the post we create the dashboard in the server.
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
        //In other case we overwrite the existing configuration file in the server
        var send={
          N: document.URL.split("/")[document.URL.split("/").length-1],
          C: info
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

//******************************************************************//
//*********************** Functions dashboard **********************//
//******************************************************************//

//This function creates the configuration menu to draw a graph. In the menu will be the metrics to select what we want to draw.
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
function PanelCreation(color){
  numPanel+=1;
  if(color!=undefined){
    var panel= new Panel(numPanel,color)
  }else{
    var panel= new Panel(numPanel)

  }

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
//This function shows a configuration menu to change the widget to other panel
function ChangePanelMenu (id){
  var widget=GetWidget(id);

  $("#making").slideDown("slow")

  $("#conten").append('<div id="currentSettings"></div>')
  for(i=1; i<=numPanel; i++){
    if(widget.panel==i){
      $("#currentSettings").append('<p><input type="radio" name="PanelOptions" class="radios" value="'+i+'" checked>Panel '+i+'</p>');
    }else{
      $("#currentSettings").append('<p><input type="radio" name="PanelOptions" class="radios" value="'+i+'">Panel '+i+'</p>');
    }
  }
  $("#currentSettings").append('<button onclick="ChangePanel('+id+')" type="button" class="btn btn-xs btn-default">Move</button>')
  $("#currentSettings").append('<button onclick="deleteSettings()" type="button" class="btn btn-xs btn-default">Cancel</button>')

}
//This function changes the widget to other panel
function ChangePanel (id){
  var newPanel;
  var widget=GetWidget(id);

  var gridster = $("#panel"+actualPanel+" ul").gridster().data('gridster');
  gridster.remove_widget("#widget"+id,function(){
    var NowPanel= GetPanel(actualPanel)
    NowPanel.deleteElement(widget)

    $("#panel"+actualPanel).slideUp("slow");

    $("#currentSettings input[type='radio']:checked").each(function() {
      newPanel=$(this).attr('value')
    });

    $("#panel"+newPanel).slideDown("slow");

    widget.panel=parseInt(newPanel);
    var ToPanel= GetPanel(newPanel)
    ToPanel.pushElement(widget)
    widget.MakeWidget();

    $("#currentSettings").remove();
    $("#making").slideUp("slow");

  });

}



//**************  Filtering and selection of data functions ************////

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
    if(dashConfiguration.indexOf(panel)!=-1){
      makePanel(panel)
    }
  }

}

//Function that creates all components in a panel.
function makePanel(panel){
  var panel= GetPanel(panel)
  dashConfiguration.splice(dashConfiguration.indexOf(panel)-1,1)
  var widgets= panel.getWidgets()
  widgets.forEach(function(widget){
    widget.MakeWidget()
  })
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


