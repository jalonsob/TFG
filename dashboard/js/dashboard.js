var actualDash=0;
var numDash=0;
var numGraph=0;

$(document).ready(function() {

  $("#addDash").click(function(){
    numDash+=1;
    $(".container-fluid").append('<div id="dash'+(numDash)+'" class="gridster"><ul></ul></div> ')
    $("#dashboards").append('<li onclick="showDash('+numDash+')"><a href="javascript:;" data-toggle="collapse" data-target="#scrollDash'+numDash+'"><i class="fa fa-fw fa-edit"></i> Dashboard '+numDash+' <i class="fa fa-fw fa-caret-down"></i></a><ul id="scrollDash'+numDash+'" class="collapse"><li><a onclick="makeGraph('+numDash+')" href="#">Add Graph</a></li><li><a onclick="deleteAllGraphs('+numDash+')" href="#">Delete all</a></li></ul></li>')
    if(actualDash==0){
      actualDash=1;
    }
  })

});

function makeGraph(dash){
  var inDash= "dash"+dash.toString()
  numGraph+=1;
  var gridster = $("#"+inDash+" ul").gridster().data('gridster');
  gridster.add_widget('<div id= "graph'+numGraph+'" class="panel panel-primary"><div class="panel-heading"><button type="button" class="btn btn-xs btn-default">Delete</button></div><div id="'+numGraph+'" class="panel-body"> </div></div>', 1, 1);
  var series=[];
  obj={
          type: "column",
          name: "probando",
          data: [1,2,3,4,5,6,7]
        }
  series.push(obj)
  var options={
            chart:{
                renderTo:numGraph.toString(),
                width: 370,
                height: 160
            },
            title: {
                text: ''
            },
            series: series
        }
  var chart= new Highcharts.Chart(options);
}

function showDash(dash){
  if(actualDash!=dash){
    $("#dash"+actualDash).slideUp("slow");
    $("#dash"+dash).slideDown("slow");
    actualDash=dash;
  }

}

function deleteAllGraphs(dash){
  var inDash= "dash"+dash.toString()
  var gridster = $("#"+inDash+" ul").gridster().data('gridster');
  gridster.remove_all_widgets();
}
