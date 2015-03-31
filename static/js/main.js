/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */

jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        
        var url = o.url;
        
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            
            // Manipulate options so that JSONP-x request is made to YQL
            
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {
                    
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                    
                };
            })(o.success);
            
        }
        
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);



 // end cross domain script
 
 

var s205 = {
	
	name : '205',
	id : '6350571126703259706',
	tripId: '6351527705628215820',		
	stops :[{
		id: 24172
	},
	{
		id:21020
	}]
	
}; //end 205


var s219 = {
	
	name : '219',
	id : '6350571126703259716',
	tripId: '6351527705611380763', //change
	//Mahon to Cit
	stops : [{
		name :"Ringmahon Rd (Holy Cross School)",
		id :21386
	},
	{
		name :"Cork Institute of Technology",
		id :21020
	}]
}; //end 219

function getStops(stop){		
	
	$.ajax({
		 url: 'http://whensmybus.buseireann.ie/internetservice/services/tripInfo/tripPassages',
		 type: 'GET',  
		 contentType: "application/json; charset=utf-8",
		 data: {'tripId':stop.tripId, 'mode':'departure', 'cacheBuster':'1425331174701'},
		  success: function(res){					
				var data = $(res.responseText).text();
				data = JSON.parse(data);
				for(var i in data.actual){
					$('#stoplist').append("<option class='stop' value='" + data.actual[i].stop.shortName + "'>" + data.actual[i].plannedTime + " " +  data.actual[i].stop.name + "</option>");
									
				}				
			}		  
	});
}

function getTimes(stop){	

	$("#loading").show();
	$("#stoptable .times").remove();
	$("#stoptable2 .times").remove();

	$.ajax({
		  url: 'http://whensmybus.buseireann.ie/internetservice/services/passageInfo/stopPassages/stop',
		 type: 'GET',  
		 contentType: "application/json; charset=utf-8",
		 data: {'stop':stop.stops[0].id, 'routeId':stop.id, 'mode':'departure','cacheBuster':'1424727065980'},
		  success: function(res){				
				var data = $(res.responseText).text();
				data = JSON.parse(data);
				$('#route').html("Departures: <strong> " + data.stopName + "</strong>");

				for(var i in data.actual){
					$('#stoptable').append("<tr class='times'><td>" + data.actual[i].patternText + "</td><td>" + data.actual[i].direction + "</td><td>" + data.actual[i].mixedTime + "</td></tr>");
				}
				SetCookie('route', stop.name);
			},
			error: function(res){				
				var data = $(res.responseText).text();
				data = JSON.parse(data);
				console.log(data);
				$('#route').html("Departures: <strong> " + data.stopName + "</strong>");
				
				for(var i in data.actual){
					$('#stoptable2').append("<tr class='times'><td>" + data.actual[i].patternText + "</td><td>" + data.actual[i].direction + "</td><td>" + data.actual[i].mixedTime + "</td></tr>");
				}
				
				SetCookie('route', stop.name);
		}
		  
	});
	$("#loading").show();
	
	$.ajax({
	  url: 'http://whensmybus.buseireann.ie/internetservice/services/passageInfo/stopPassages/stop',
	 type: 'GET',  
	 contentType: "application/json; charset=utf-8",
	 data: {'stop':stop.stops[1].id,'routeId':stop.id, 'mode':'departure', 'cacheBuster':'1424727065980'},
	  success: function(res){				
			var data = $(res.responseText).text();
			data = JSON.parse(data);			
			$('#route2').html("Departures: <strong>" + data.stopName + "</strong>");

			for(var i in data.actual){
				$('#stoptable2').append("<tr class='times'><td>" + data.actual[i].patternText + "</td><td>" + data.actual[i].direction + "</td><td>" + data.actual[i].mixedTime + "</td></tr>");
			}
			$("#loading").hide();			
		},
		error: function(res){				
			var data = $(res.responseText).text();
			data = JSON.parse(data);			
			$('#route').html("Departures: <strong> " + data.stopName + "</strong>");
			
			for(var i in data.actual){
				$('#stoptable2').append("<tr class='times'><td>" + data.actual[i].patternText + "</td><td>" + data.actual[i].direction + "</td><td>" + data.actual[i].mixedTime + "</td></tr>");
			}
			
			SetCookie('route', stop.name);
			$("#loading").hide();			
		}
	  
});
$("#loading").show();



}

$( document ).ready(function() {
	
		$('#s205').click(function(){
			getTimes(s205);
		});
		
		$('#s219').click(function(){
			getTimes(s219);
		});
		
		var route = GetCookie('route');
		if(route!=null){
			switch(route){
			case '205':console.log("Cookie set to " + route);getTimes(s205);break;
			case '219':console.log("Cookie set to " + route);getTimes(s219);break;
			default:break;
			}
		}
});

