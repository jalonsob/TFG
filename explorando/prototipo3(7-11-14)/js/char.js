$(document).ready(function() {

    var jsonfile = '/Users/jesus/Desktop/prototipo3(7-11-14)/datos.json';
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

});
