//**************************************//
//*************Object panel**************//
//**************************************//

function Panel(idPanel,color,name,reading,wid){
	var id=idPanel;
	this.name= name || "Panel "+idPanel
	this.reading= reading || {}
	var widgets=wid || [];
	var color=color || getRandomColor();
	var statc='<li class="dropdown">'+
				'<a href="#" class="dropdown-toggle btn btn-xs btn-default" data-toggle="dropdown">Info</a>'+
					'<ul class="dropdown-menu statc">'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighInfo','scm')"+'" type="button" class="btn btn-xs btn-default">SCM (Source Code Management)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighInfo','its')"+'" type="button" class="btn btn-xs btn-default">ITS (Intelligent Tutoring System)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighInfo','mls')"+'" type="button" class="btn btn-xs btn-default">MLS (Major League Soccer)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighInfo','scr')"+'" type="button" class="btn btn-xs btn-default">SCR (Sustained Cell Rate)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighInfo','irc')"+'" type="button" class="btn btn-xs btn-default">IRC (Internet Relay Chat)</button>'+
						'</li>'+
					'</ul>'+
				'</li>'
	var Htmlstatc='<li class="dropdown">'+
				'<a href="#" class="dropdown-toggle btn btn-xs btn-default" data-toggle="dropdown">HTML Info </a>'+
					'<ul class="dropdown-menu statc">'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HtmlInfoWidget','scm')"+'" type="button" class="btn btn-xs btn-default">SCM (Source Code Management)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HtmlInfoWidget','its')"+'" type="button" class="btn btn-xs btn-default">ITS (Intelligent Tutoring System)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HtmlInfoWidget','mls')"+'" type="button" class="btn btn-xs btn-default">MLS (Major League Soccer)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HtmlInfoWidget','scr')"+'" type="button" class="btn btn-xs btn-default">SCR (Sustained Cell Rate)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HtmlInfoWidget','irc')"+'" type="button" class="btn btn-xs btn-default">IRC (Internet Relay Chat)</button>'+
						'</li>'+
					'</ul>'+
				'</li>'
			  	  
	var evolutionary='<li class="dropdown">'+
				'<a href="#" class="dropdown-toggle btn btn-xs btn-default" data-toggle="dropdown">Time </a>'+
					'<ul class="dropdown-menu evol">'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighTime','scm')"+'" type="button" class="btn btn-xs btn-default">SCM (Source Code Management)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighTime','its')"+'" type="button" class="btn btn-xs btn-default">ITS (Intelligent Tutoring System)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighTime','mls')"+'" type="button" class="btn btn-xs btn-default">MLS (Major League Soccer)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighTime','scr')"+'" type="button" class="btn btn-xs btn-default">SCR (Sustained Cell Rate)</button>'+
						'</li>'+
					'</ul>'+
				'</li>'
	var demog='<li class="dropdown">'+
				'<a href="#" class="dropdown-toggle btn btn-xs btn-default" data-toggle="dropdown">Demographic </a>'+
					'<ul class="dropdown-menu evol">'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighDemo','scm')"+'" type="button" class="btn btn-xs btn-default">SCM (Source Code Management)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighDemo','its')"+'" type="button" class="btn btn-xs btn-default">ITS (Intelligent Tutoring System)</button>'+
						'</li>'+
						'<li>'+
							'</button><button onclick="'+"showConfiguration("+id+",'HighDemo','mls')"+'" type="button" class="btn btn-xs btn-default">MLS (Major League Soccer)</button>'+
						'</li>'+
					'</ul>'+
				'</li>'

	var settings= '<ul style="display: flex; list-style:none ">'+evolutionary+demog+statc+Htmlstatc+'<li><button onclick="'+"showConfiguration("+id+",'VideoWidget')"+'" type="button" class="btn btn-xs btn-default">Video </button></li></ul>'
	var gridster= '<div id="panel'+id+'" class="gridster ready" style="background-color:'+color+'"><div style="background: linear-gradient(to bottom, '+color+', #222222)"><ul></ul><div></div>'
	
	this.writeSettings=function(){
		$("#widgetButtons").html(settings)
	}

	this.getSettings=function(){
		return settings
	}

	this.getContent=function(){
		return gridster
	}

	this.getId= function(){
		return id
	}

	this.getWidgets= function(){
		return widgets
	}

	this.flatten=function(){
		var objaux={};
		var name= this.name
		var reading= this.reading
		objaux["panel"+id]={};
		objaux["panel"+id].panel={
			color: color,
			id: id,
			name: name,
			reading: reading
		};
		objaux["panel"+id].widgets=[];
		widgets.forEach(function(element){
			objaux["panel"+id].widgets.push(element.flatten())
		})
		return objaux
	}
	this.changeColor=function(newColor){
		color=newColor;
	}

	this.pushElement= function(widget){
		widgets.push(widget)
	}

	this.deleteElement=function(element){
		widgets.splice(widgets.indexOf(element), 1);
	}

	this.deleteAll=function(){
		widgets=[]
	}
}