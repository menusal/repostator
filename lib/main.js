/**
* jQuery.browser.mobile (http://detectmobilebrowser.com/)
*
* jQuery.browser.mobile will be true if the browser is a mobile device
*
**/
(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

if( jQuery.browser.mobile)
 		location.href = "http://mov.repostator.com/";

var copen = false;
var gnombre = "Gasolina 95";
var new_url;
var debug=false;

$(function(){
	
	$('#loc').chosen();

	// social
	  $('#demo1').sharrre({
      share: {
        googlePlus: true,
        facebook: true,
        twitter: true,
        delicious: true,
      },
      buttons: {
        googlePlus: {size: 'tall'},
        facebook: {layout: 'box_count'},
        twitter: {count: 'vertical'},
        delicious: {size: 'tall'},
      },
      hover: function(api, options){
        $(api.element).find('.buttons').show();      
      },
      hide: function(api, options){
        $(api.element).find('.buttons').hide();
      }
    });
    

	if ( $.browser.msie ) {
	 if ( parseFloat($.browser.version)  < 9 )
	 	location.href='browser.html';
	}

});

$(document).ready(function(){



	$('.panel').toggle(function(){ //adding a toggle function to the #tab
      		$('#top').css({width:"0px"});
      		$('.router').hide();
   		},function(){
   			$('#top').css({width:"320px"});
   			$('.router').fadeIn();
   		});
   

	//mRoute.constructUrl();
 	var ob_lgeocoder = $(".leaflet-control-geocoder");
 	ob_lgeocoder.hide();

 	// Media combustible
 	$("#media").html( $(".media").val() + " L. / 100");
 	$(".media").change(function(){
 		$("#media").html( $( this ).val() + " L. / 100");
 		 mRoute.getConsumos();
 	});

 	if( jQuery.browser.mobile || debug) {

 		location.href = "http://mov.repostator.com/";


		//$(".leaflet-control-geocoder").hide();
		setTimeout(
			function() {
				$(".leaflet-control-geocoder").show().animate({ top: "-120px"},500).prepend("<div style='margin:.5em'> <b>Localidad</b></div>");
				$('.navbar-inner, #controles').fadeIn(3000);

			},2000
		);

	} else {

		$('.navbar-inner, #controles').fadeIn(3000);
		$(".geolocaliza").fadeIn();
	}

	$('.controles').tooltip({placement: 'bottom'});
	$('.glocalidad, #accuracy').tooltip({placement: 'left'});

	$('.cpop, .add_waypoint').tooltip({placement: 'top'});

	$( '.litros' ).change(function(){
		cambiaPrecios();
	});

	$('#sel-link').click(function(){
		var url = window.location.href;
		var ll = map.getCenter();
		new_url = url + '?lat='+ll.lat+'&lng='+ll.lng+'&zoom='+map.getZoom();
		// window.location.href = new_url;
		$(' .shareurl ').val(new_url);
		$('#wshare').modal('show');
	});

	var ltiempo = false;
	$('#sel-weather').click(function(){
		if (!ltiempo) {
			$('#sel-weather').css( 'background-color:' ,'rgba(255, 255, 255, 0.70)' );
			map.addLayer(validatorsLayer);
			ltiempo = true;	
		} else {
			$('#sel-weather').css( 'background-color:' ,'rgba(0, 0, 0, 0.50)' );
			map.removeLayer(validatorsLayer);
			ltiempo = false;
		}
	});

	var tipos = ['#sel-gas-95','#sel-gas-98','#sel-gas-a','#sel-gas-nd','#sel-gas-bio'];
	var inc = 60;


	$(".com").click(function(){
	  	
	  	if(!copen) {

	  		for ( i in tipos ) {

	  			if( "#" + $( this ).attr( 'id' ) == tipos[i] )
	  				
	  				$( tipos[i] ).fadeIn(100).animate({ top: "0px"}, 500 );	
	  			
	  			else {

	  				$( tipos[i] ).fadeIn(100).animate({ top: inc + "px"}, 500 );
	  				inc += 60;
	  			}
	  				
	  		};

	  		copen = true;
		
		} else {
		
			for ( i in tipos ) {

	  			if( "#" + $( this ).attr( 'id' ) == tipos[i] )
	  				$( tipos[i] ).animate({ top: "0px"}, 500 );
	  			else
	  				$( tipos[i] ).fadeOut(500).animate({ top: "0px"}, 500 );
	  				
	  		};

	  		copen = false;
	  		mRoute.getRoute();
		}

		inc = 90;

		gnombre=$( this ).attr('nombre');
		tipo = $(this).attr('tipo');
		if ( $( this ).attr('id') != "sel-gas" ) {
			
			processData(fecha);
		}
			



	});

	//Comprobamos cookie modal
	if($.cookie('eess_modal') == null)
		$.cookie('eess_modal', 'act');
	
	// if($.cookie('eess_modal') == 'act' && !jQuery.browser.mobile )
	// 	$('#myModal').modal('show');

	// Solo mostramos el botón de localización para la versión móvil
	if( jQuery.browser.mobile || debug)
	{
	 	$('#localizame').show();
	 	$('.divpopup, #social, #top').hide();

	 	$('#footer, #social, #sel-link, #sel-weather').hide();

		// Posición del elemento
		var position;
		var i=0;
		var position = {left:0};


		$('.controles').each(

			function (e) {

				// Modificamos tamaño a mitad
				var ancho = $( this ).width();
				$( this ).height( parseInt($( this ).height() / 2));
				$( this ).width( parseInt(ancho / 2));

				// desplazamos elementos
				
					//$( this ).css( 'left', parseInt(position.left + ancho + 5) + 'px');
				
				position = $( this ).position();
				i++;
			}
		);

		$('#sel-litros').css({
			'font-size': '.8em',
			'height': '30px',
			'left': '95px',
		});

		$('#localizame').css({
			'left': '170px',
		});
		
		$('.controles').css({
			'background-size': '60%',
		});

		$('#sel-weather').css({
			'left': '175px',
			//'left': '215px',
		});

		


		$('.litros').css({
			'height': '27px',
			'width': '46px'
		});
	}

	

	//$('#localizame').show();

	if($.cookie('eess_pop') == 'yes')
		$('#cpop').attr('checked',true);

	$('#cmodal').click(function(){
		if($( this ).attr('checked'))
			$.cookie('eess_modal', 'des');
	});

   
	// Add dinamicals waypoints 
	var wpts=0;
	function restaw() {
		wpts -=1;
	}

	$(".add_waypoint").click( function() {
		n = Math.floor((Math.random()*10)+1);
		if ( $(".div_waypoints").length<8 ) {
			$(".waypoints").append('<div class="div_waypoints" id="dw' + n +'"><input type="text" class="waypoint" placeholder="Introduce parada" value=""/><i rel="tooltip" class="icon-remove-sign delete_waypoint cursor" title="Quitar parada" onclick="$(\'#dw' + n +'\').remove();"></i></div>');
			
		}
	});



});


var fecha=new Date();

var radius;
var circle;
var estaciones = new Array(1000);
var marker,routeLayer;
var mbarato;    
var d=fecha.getDate();

if (d.toString().length == 1){
	dant = '0'+(d -1);
	d='0'+d;
} 
else
	dant = d-1;

var m=fecha.getMonth() +1;

if (m.toString().length == 1)
	m='0'+m;
	
var y=fecha.getFullYear();

fecha = d+''+m+''+y;

var fechaant = dant+''+m+''+y;

var LeafIcon = L.Icon.extend({
	iconUrl: 'lib/leaflet/images/Arrow.png',
	//shadowUrl: 'lib/images/leaf-shadow.png',
	iconSize: new L.Point(25, 40),
	//shadowSize: new L.Point(68, 95),
	iconAnchor: new L.Point(0, 0),
	popupAnchor: new L.Point(-3, -76)
});

var greenIcon = new LeafIcon();
//marker = new L.Marker(new L.LatLng(51.5, -0.09), {icon: greenIcon});

var tipo = 'GPR';
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © openstreetmap contributors';
var osm = new L.TileLayer(osmUrl,{minZoom: 1, maxZoom:18, attribution: osmAttrib});

var essLayer,essPoint;
var map = new L.Map('map', {
		center: new L.LatLng(40.05403,-0.14183),
		zoom: 6,
		//crs: L.CRS.EPSG4326,
		layers: [osm] //minim,osm,
	});

var bingGeocoder = new L.Control.BingGeocoder('Ajub91WI5igiNC716MDMqHOqYhJ18LxNU_mRT1K9eoefAV80AnFq9APArt47nZBV');

map.addControl(bingGeocoder);

var validatorsLayer = new OsmJs.Weather.LeafletLayer({lang: 'en'});

// Si el usuario ya ha entrado cogemos vista guardada
 if($.cookie('eess_lat') != null && $.cookie('eess_lng') != null && $.cookie('eess_zoom') != null && gup( 'zoom' ) == "" && gup( 'lat' ) == "") {
 	
 	var ll = new L.LatLng($.cookie('eess_lat'),$.cookie('eess_lng'))
 	map.setView(ll,$.cookie('eess_zoom'));
 
 }else if (gup( 'zoom' ) != "" && gup( 'lat' ) != "" && gup( 'lng' ) != "") {
 	
 	var ll = new L.LatLng(parseFloat(gup( 'lat' )),parseFloat(gup( 'lng' )));
 	map.setView(ll,parseInt(gup( 'zoom' )));
 
 }

 $('#loc').change(function(){

 	var latlng = $( '#' + $( this ).attr('id') + ' option:selected').val().split(',');
 	console.log(latlng);
 	var ll = new L.LatLng(latlng[1],latlng[0]);
 	map.setView(ll,13);

 });

$.cookie('eess_latlng', map.getCenter());
$.cookie('eess_zoom', map.getZoom());
	
map.on('moveend', function(e) {
	processData(fecha);
});
map.on('zoomend', function(e) {
	//setTimeout(function(){processData();},1000);
});
map.on('click', function(e) {
	
});

$('.com ').click(function(){
		// $('.controles').removeClass('selected');
		// $( this ).addClass('selected');
		
	});

function processData(fecha) {

	//$('#info').html(' Zoom: ' + map.getZoom());
	var bounds = map.getBounds();
	var ll = map.getCenter();
	// Establecemos vistas de usuario ara próxima carga
	$.cookie('eess_lat', ll.lat);
	$.cookie('eess_lng', ll.lng);
	$.cookie('eess_zoom', map.getZoom());

	var homes = [{
	   "h_id": "3",
	   "city": "Dallas",
	   "state": "TX",
	   "zip": "75201",
	   "price": "162500"
	}, {
	   "h_id": "4",
	   "city": "Bevery Hills",
	   "state": "CA",
	   "zip": "90210",
	   "price": "319250"
	}, {
	   "h_id": "5",
	   "city": "New York",
	   "state": "NY",
	   "zip": "00010",
	   "price": "962500"
	}];

	var estaciones = [];

	try { 
		map.removeLayer(essLayer); 
		map.removeLayer(essPoint); 
	} catch (err) {

	}
	
	if (parseInt(map.getZoom()) > 12 && !mRoute.mode)
	{
		//mRoute.clearRoute();

		$('#info').html('<img src="images/load.gif" />');
		$('#fecha').html(' Precios de ' + gnombre+ ' a <b>'+fecha.substr(0,2) + '/' + fecha.substr(2,2)  + '/' + fecha.substr(4,4) + '</b>');
		$.ajax({
			type: "GET",
			url: "data/eess_"+tipo+".csv",
			dataType: "text",
			error: function(request,error) {
				$('#fecha').html(' Precios a <b>'+fechaant.substr(0,2) + '/' + fechaant.substr(2,2)  + '/' + fechaant.substr(4,4) + '</b>');
				processData(fechaant);
			},
			success: function(data) {
				
				var ocrr=0;
				var fields = data.split(/\n/);
				fields.pop(fields.length-1);
				var headers = fields[0].split(',');
				var data = fields.slice(1, fields.length);
				var masbarata = 0;
				var mbarato;
				
				
				
				essLayer = essPoint = new L.LayerGroup();
				
				var precio_anterior = 10000;
				var preciol = 0;

				//FIXME:: Limpiar marcadores
				for(var j = 0; j < data.length; j += 1) {
					var dataFields = data[j].split(',');  
					if(!isNaN(parseFloat(dataFields[0]))) {   
						if ( ( parseFloat(dataFields[0]) < parseFloat(bounds._northEast.lng) && 
							 parseFloat(dataFields[0]) > parseFloat(bounds._southWest.lng) ) &&
							 ( parseFloat(dataFields[1]) < parseFloat(bounds._northEast.lat) && 
							 parseFloat(dataFields[1]) > parseFloat(bounds._southWest.lat) )) {
							
							var precio = parseFloat(dataFields[2].substr(-1) + '.' +dataFields[3].substr(0,3));
							
							
							if (!isNaN(precio))
								estaciones.push({
									'nombre': dataFields[2],
									'precio': parseFloat(precio),
									'lng': dataFields[0],
									'lat': dataFields[1]
								});
						}
					}	
				}

				var mcolor,mfillColor,tam;
				

				for (var i in estaciones) {
					
					// var LeafIcon = L.Icon.extend({
					// 		iconUrl: 'lib/leaflet/images/generico.png',
					// 		iconSize: new L.Point(25, 40),
					// 		iconAnchor: new L.Point(0, 0),
					// 		popupAnchor: new L.Point(15, 0)
					// 		});
					
					// var greenIcon = new LeafIcon();

				

			
					var mOpacity = 0.4;

					switch(parseInt(i)) {
						case 0:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l1.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;			
						case 1:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l2.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;
						case 2:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l3.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;
						case 3:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l4.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;
						case 4:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l5.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;
						case 5:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l6.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;
						case 6:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l7.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;
						case 7:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l8.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;
						case 8:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l9.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;
						default:
							var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/generico.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
							break;
					}

					//greenIcon.iconUrl = 'lib/leaflet/images/generico.png';

					// var circleLocation = new L.LatLng(parseFloat(estaciones[i]['lat']), parseFloat(estaciones[i]['lng'])),
				 //    circleOptions = {
				 //        color: mcolor,
				 //        fillColor: mfillColor,
				 //        fillOpacity: mOpacity
				 //    };

					// var circle = new L.Circle(circleLocation, tam + 40, circleOptions);
					// essPoint.addLayer(circle);
					

					marker = new L.Marker(new L.LatLng(parseFloat(estaciones[i]['lat']), parseFloat(estaciones[i]['lng'])),{icon: greenIcon});
					//marker = new L.Marker(new L.LatLng(parseFloat(estaciones[i]['lat']), parseFloat(estaciones[i]['lng'])));
					


					essLayer.addLayer(marker);

					var nombre = estaciones[i]['nombre'].split(/ /);

					var precio = parseFloat(estaciones[i]['precio']);
					var litros = parseInt( $( '.litros' ).val() );
					var preciol = precio * litros;
					preciol = preciol.toFixed(3);

					if(	parseFloat(precio) < parseFloat(precio_anterior) ) {

						cont = '<div style="text-align:center" class="eess" ><p><b> ¡¡ LA MAS BARATA !! </b></p><p>' + estaciones[i]['nombre'] + '</p><p style="color:#666"><image src="images/gas.png" width="16px" height="16px"/>' + gnombre+ ' : <span style="color:#006699;font-size:1.4em" class="precio">' + precio + '</span> &euro;/l.</p><p> <b class="nlitros" style="color:#333;font-size:1.4em">' + $( '.litros' ).val() + '</b> litros cuestan <span style="color:#006699;font-size:1.4em" class="lprecio">' + preciol + '</span></p></div>';

						marker.bindLabel(precio + '&euro; el litro <br> Pincha para ampliar info.').bindPopup(cont);
						precio_anterior = precio;
						mbarato = marker;
						mbaratoll = new L.LatLng(parseFloat(estaciones[i]['lat']), parseFloat(estaciones[i]['lng']));

					} else {
						cont = '<div style="text-align:center" class="eess" ><p>' + estaciones[i]['nombre']  + '</p><p style="color:#666"><image src="images/gas.png" width="16px" height="16px"/>' + gnombre+ ' : <span style="color:#006699;font-size:1.4em" class="precio">' + precio + '</span> &euro;/l.</p><b class="nlitros" style="color:#333;font-size:1.4em">' + $( '.litros' ).val() + '</b> litros cuestan <span style="color:#006699;font-size:1.4em" class="lprecio">' + preciol + '</span></div>'
						marker.bindLabel(precio + '&euro; el litro <br> Pincha para ampliar info.').bindPopup(cont);
					}
					//estaciones[precio] = marker;
					marker.on('click', function() {
						cambiaPrecios();
					});

					ocrr++;
				};

				map.addLayer(essLayer);
				//map.addLayer(essPoint);

				// Centramos el más barato 
				if (mbarato != null && $.cookie('eess_pop') == 'yes') {
					//map.setView(mbaratoll,map.getZoom());
					mbarato.openPopup()
				}
				
				//setTimeout(function(){mbarato.openPopup()},1000);
				$('#info').html(' &nbsp; <b>'+ocrr+'</b> estación(es) encontrada(s)');

				$('#cpop').click(function(){
					if($( this ).attr('checked')) {
						$.cookie('eess_pop', 'yes');
						if (mbarato != null)
							mbarato.openPopup();
					}
					else
						$.cookie('eess_pop', 'no');
				});
				
			}
		})
		
	}
	else {
		$('#info').html(' Acercate más para mostrar estaciones de servicio ');
		$('#fecha').html('');
	}
}

var sort_by = function(field, reverse, primer){

   var key = function (x) {return primer ? primer(x[field]) : x[field]};

   return function (a,b) {
       var A = key(a), B = key(b);
       return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
   }
}

function locationMe(){
	// Geo Location
//		map.locateAndSetView(14);
	map.locate({setView: true, maxZoom: 14});

	map.on('locationfound', onLocationFound);
	//setTimeout(function(){map.setZoom(14)},500);

}

function onLocationFound(e) {
	radius = e.accuracy * 0.2;
	circle = new L.Circle(e.latlng, radius);
	//var marker = new L.Marker(e.latlng,{icon: greenIcon});
	//map.addLayer(marker);
	circle.bindPopup( "Est&aacute;s aqu&iacute;");
	map.addLayer(circle);
	
}

function cambiaPrecios() {
	$(' .eess' ).each(function(){
		var precio = parseFloat( $( '.' + $(this).attr('class') + ' span.precio' ).html() );
		var litros = parseInt( $( '.litros' ).val() );
		var preciol = precio * litros;
		preciol = preciol.toFixed(3);

		$( '.' + $(this).attr('class') + ' span.lprecio').html( preciol );
		$( '.' + $(this).attr('class') + ' b.nlitros').html( litros );
	});
}

function gup( name ){

	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp ( regexS );
	var tmpURL = window.location.href;
	var results = regex.exec( tmpURL );
	if( results == null )
		return"";
	else
		return results[1];

	//var frank_param = gup( 'frank' );
}

function getCity() {

	if(mRoute.mode) {
		$(".infolocation").show().delay(5000).fadeOut();
		return false;
	}

	var localidad = $(".glocalidad").val();
	$(".leaflet-control-geocoder input").attr("value",localidad + ', spain');
	$(".leaflet-control-geocoder :submit").trigger("click");

	setTimeout(function(){map.setZoom(13)},500);

}
