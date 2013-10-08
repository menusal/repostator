//http://maps.googleapis.com/maps/api/directions/json?origin=castellon&destination=valencia&waypoints=villreal|segorbe&sensor=false
var peor_precio,mejor_precio,distancia;
var mRoute = {

	// Definitions
	origin: "",
	destination: "",
    mode: false,

	// Functions
    clearRoute: function() {

        this.mode=false;
        $("#pA, #pB").attr("value","");
        $(".waypoints").html();
        $(".infotravel").remove();
        try { 
            $(".waypoint").remove();
            $(".close").trigger("click");
            map.removeLayer(routeLayer);
            map.removeLayer(eLayer); 
        } catch (err) { }
    },
	// Call to WS to get lat,lon
	getRoute: function(a,b) {

        if ( $("#pA").val() == "" || $("#pB").val() == "" )
            return false;

        // Modo routing
        this.mode=true;
		this.origin = $("#pA").val()  + ',spain';
		this.destination = $("#pB").val()  + ',spain';

        //Waypoints
        var i=0;
        var wp=false;

        $(".waypoints input").each( function(){
            
            if ( $( this ).val() != "" ) {
                if (i==0)
                    wp = $( this ).val()  + ',spain';
                else
                    wp += "|" + $( this ).val() + ',spain';
                i++;
            }

        });

        if (wp)
            this.destination += "&waypoints=" + wp


		$('#load_route').html('<img src="images/load.gif" /> Calculando ruta..');

		$.ajax({
			url: 'directions.php',
			dataType: "json",
			data: {origen: this.origin , destino: this.destination}, //
			success: function(results) {
			
			
				try {

					 obj = JSON && JSON.parse(results) || $.parseJSON(results);

					// Extensión a la ruta
					var southWest = new L.LatLng(obj.routes[0].bounds.southwest.lat, obj.routes[0].bounds.southwest.lng),
					    northEast = new L.LatLng(obj.routes[0].bounds.northeast.lat, obj.routes[0].bounds.northeast.lng),
					    bounds = new L.LatLngBounds(southWest, northEast);

					   map.fitBounds(bounds);
				
					try { 
                        map.removeLayer(routeLayer);
                        map.removeLayer(eLayer); 
                    } catch (err) { }

					routeLayer = new L.LayerGroup();

					// Incicio
					marker = new L.Marker(new L.LatLng(parseFloat(obj.routes[0].legs[0].start_location.lat), parseFloat(obj.routes[0].legs[0].start_location.lng))).bindLabel(obj.routes[0].legs[0].start_address).bindPopup(obj.routes[0].legs[0].start_address);
					routeLayer.addLayer(marker);

                    // Waypoints
                    nwp = obj.routes[0].legs.length;
                    
                    // Si existen paradas intermedias itero 
                    var tduracion;
                    var tdistancia=horas=minutos=0;
                    var Time,Hours,Minutes;
                    
                    if(nwp>1) {
                        
                        for (i in obj.routes[0].legs) {
                            marker = new L.Marker(new L.LatLng(parseFloat(obj.routes[0].legs[i].end_location.lat), parseFloat(obj.routes[0].legs[i].end_location.lng))).bindPopup(obj.routes[0].legs[i].end_address);

                            var duracion = obj.routes[0].legs[i].duration.text;
                            duracion = duracion.replace(/hours/g, "");
                            duracion = duracion.replace(/mins/g, "");

                            tiempo = duracion.split(" ");

                             if (!isNumber(tiempo[2]))
                            {
                                horas += 0;
                                minutos += parseInt(tiempo[0]);
                            } else {
                                horas += parseInt(tiempo[0]);
                                minutos += parseInt(tiempo[2]);
                            }

                            tduracion += duracion;

                            distancia = obj.routes[0].legs[0].distance.text;
                            distancia = distancia.replace(/,/g, "");

                            tdistancia += parseInt(distancia);
                    
                            routeLayer.addLayer(marker);
                        }

                        Hours = Math.floor(minutos/60) + horas;
                        Minutes = minutos%60;
    

                    } else {

                        var duracion = obj.routes[0].legs[0].duration.text;
                        duracion = duracion.replace(/hours/g, "");
                        duracion = duracion.replace(/mins/g, "");

                        tiempo = duracion.split(" ");

                        if (!isNumber(tiempo[2]))
                        {
                            horas += 0;
                            minutos += parseInt(tiempo[0]);
                        } else {
                            horas += parseInt(tiempo[0]);
                            minutos += parseInt(tiempo[2]);
                        }
                       
                        
                        tduracion = duracion;
                        
                        distancia = obj.routes[0].legs[0].distance.text;
                        distancia = distancia.replace(/,/g, "");

                        tdistancia += parseInt(distancia);

                        Hours = horas;
                        Minutes = minutos;
   
                    }

                    nminutos = number_format(minutos/60,2, '.', '');
                    cuadre = nminutos.split(".");
                    horas += parseInt(cuadre[0]);
                    minutos += parseInt(cuadre[1]);



                     // Datos de la ruta
                    $("#ruta_esumen").html('<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">×</button>Distancia: <b>' + tdistancia + ' km.</b><br>Duración: <b>' + Hours + ' horas ' + Minutes + ' minutos</b><div class="infotravel"></div></div>');

					// fin
					marker = new L.Marker(new L.LatLng(parseFloat(obj.routes[0].legs[0].end_location.lat), parseFloat(obj.routes[0].legs[0].end_location.lng))).bindLabel(obj.routes[0].legs[0].end_address).bindPopup(obj.routes[0].legs[0].end_address);
					
					routeLayer.addLayer(marker);

					// Creamos ruta
					var instring = obj.routes[0].overview_polyline.points;
					instring = instring.replace(/\\\\/g, "\\");
					points = decodeLine(instring);
					outstring = "";

					var ruta = new Array();

					for(i=0; i < points.length; i++) {

						//outstring = outstring + points[i][0] + ", " + points[i][1] + "\n";
						ruta.push( new L.LatLng(points[i][0],points[i][1]) );
					
					}

					//var ruta = [ new L.LatLng(51.509, -0.08),new L.LatLng(51.503, -0.06) ];

					var oroute = new L.Polyline(ruta, {color: 'red'}).bindLabel('Ruta');

					routeLayer.addLayer(oroute);
					// Agregamos capa
					map.addLayer(routeLayer);
					//console.log(outstring);

					$('#load_route').html('');

                    mRoute.getEstations(points,tdistancia)
                    

				} catch (err) {
                    console.warn(err.message);
					$('#load_route').html('');
					$("#ruta_esumen").html('<div class="alert alert-error infotravel"><button type="button" class="close" data-dismiss="alert">×</button><strong>Oh snap!</strong> Modifica los criterios de la búsqueda</div>');
				}
			}
		});
		
	},
    // Funcion para extraer las eess de la ruta seleccionada
    getEstations: function(route,distancia) {

        var points = JSON.stringify(route);

        $('#load_route').html('<img src="images/load.gif" /> Consultando estaciones..');
        $.ajax({
                url: 'geteess.php',
                type: 'post',
                dataType: "json",
                data: {points: points, tipo: tipo,accuracy: $("#accuracy").val()},
                success: function(obj) {
                var LeafIcon = L.Icon.extend({
                    iconUrl: 'lib/leaflet/images/Arrow.png',
                    //shadowUrl: 'lib/images/leaf-shadow.png',
                    iconSize: new L.Point(25, 40),
                    //shadowSize: new L.Point(68, 95),
                    iconAnchor: new L.Point(0, 0),
                    popupAnchor: new L.Point(-3, -76)
                });
                var greenIcon = new LeafIcon();
                console.log(obj);

                    try { map.removeLayer(eLayer) } catch (err) { }

                    eLayer = pLayer = new L.LayerGroup();

                   
                   

                    for (i in obj.eess) {

                        mcolor = "red";
                        mfillColor = "red";
                        mOpacity = 0.4; 
                        tam = 500;
                        msg = "";

                        precio = obj.eess[i].info.split(" ");
                        precio = precio[precio.length - 2];
                        precio = precio.replace(",",".");

                        switch(parseInt(i)) {
                        
                            case 0:
                                mcolor = "green";
                                mfillColor = "green";
                                mOpacity = 0.7; 
                                tam = 4000;
                                msg = "<b> La más económica </b><br>";
                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l1.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});

                                mejor_precio = precio;
                                break;          
                            case 1:
                                msg = "<b> Muy económica </b><br>";
                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l2.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
                                break;
                            case 2:
                                msg = "<b> Muy económica </b><br>";
                        
                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l3.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
                                break;
                            case 3:
                                msg = "<b> Bastante económica </b><br>";
                                
                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l4.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
                                break;
                            case 4:
                                msg = "<b> Económica </b><br>";

                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l5.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
                                break;
                            case 5:
                                msg = "<b> Económica </b><br>";

                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l6.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
                                break;
                            case 6:
                                msg = "<b> Algo económica </b><br>";

                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l7.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
                                break;
                            case 7:
                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l8.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
                                break;
                            case 8:
                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/l9.png',iconSize: new L.Point(25, 40),iconAnchor: new L.Point(25, 20),popupAnchor: new L.Point(-10, -20)});
                                break;
                            default:
                                var greenIcon = new LeafIcon({iconUrl: 'lib/leaflet/images/generico.png',iconSize: new L.Point(15, 20),iconAnchor: new L.Point(15, 10),popupAnchor: new L.Point(-10, -20)});
                                peor_precio = precio;
                                break;

                        }

                        // var circleLocation = new L.LatLng(parseFloat(obj.eess[i].lat), parseFloat(obj.eess[i].lng));
                        
                        // circleOptions = {
                        //     color: mcolor,
                        //     fillColor: mfillColor,
                        //     fillOpacity: mOpacity
                        // };

                        // var circle = new L.Circle(circleLocation, tam, circleOptions);
                        // pLayer.addLayer(circle);


                        marker = new L.Marker(new L.LatLng(parseFloat(obj.eess[i].lat), parseFloat(obj.eess[i].lng)),{icon: greenIcon}).bindLabel(msg + obj.eess[i].info).bindPopup(msg + obj.eess[i].info);

                        if(parseInt(i)==0)
                            var mbarata = marker;


                        eLayer.addLayer(marker);
                    }

                    map.addLayer(eLayer);
                    map.addLayer(pLayer);
                    mbarata.openPopup();
                    $('#load_route').html('');


                    // Consumo
                    mRoute.getConsumos();
                }
            });


    },
    getConsumos: function() {
        var media = $(".media").val();
        var consumo_optimo = ( parseFloat(media) * parseInt(distancia) / 100  ) * parseFloat(mejor_precio);
        var consumo_caro = ( parseFloat(media) * parseInt(distancia) / 100  ) * parseFloat(peor_precio);
        
        $(".infotravel").html("<br> Menor gasto: <b>" + number_format(consumo_optimo,2) + "</b>").append("<br> Mayor gasto: <b>" + number_format(consumo_caro,2) + "</b>");
    }

}

// This function is from Google's polyline utility.
function decodeLine (encoded) {
  var len = encoded.length;
  var index = 0;
  var array = [];
  var lat = 0;
  var lng = 0;

  while (index < len) {
    var b;
    var shift = 0;
    var result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    array.push([lat * 1e-5, lng * 1e-5]);
  }

  return array;
}

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

function number_format (number, decimals, dec_point, thousands_sep) {
  // http://kevin.vanzonneveld.net
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +     bugfix by: Michael White (http://getsprink.com)
  // +     bugfix by: Benjamin Lupton
  // +     bugfix by: Allan Jensen (http://www.winternet.no)
  // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +     bugfix by: Howard Yeend
  // +    revised by: Luke Smith (http://lucassmith.name)
  // +     bugfix by: Diogo Resende
  // +     bugfix by: Rival
  // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
  // +   improved by: davook
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Jay Klehr
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +      input by: Amir Habibi (http://www.residence-mixte.com/)
  // +     bugfix by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Theriault
  // +      input by: Amirouche
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: number_format(1234.56);
  // *     returns 1: '1,235'
  // *     example 2: number_format(1234.56, 2, ',', ' ');
  // *     returns 2: '1 234,56'
  // *     example 3: number_format(1234.5678, 2, '.', '');
  // *     returns 3: '1234.57'
  // *     example 4: number_format(67, 2, ',', '.');
  // *     returns 4: '67,00'
  // *     example 5: number_format(1000);
  // *     returns 5: '1,000'
  // *     example 6: number_format(67.311, 2);
  // *     returns 6: '67.31'
  // *     example 7: number_format(1000.55, 1);
  // *     returns 7: '1,000.6'
  // *     example 8: number_format(67000, 5, ',', '.');
  // *     returns 8: '67.000,00000'
  // *     example 9: number_format(0.9, 0);
  // *     returns 9: '1'
  // *    example 10: number_format('1.20', 2);
  // *    returns 10: '1.20'
  // *    example 11: number_format('1.20', 4);
  // *    returns 11: '1.2000'
  // *    example 12: number_format('1.2000', 3);
  // *    returns 12: '1.200'
  // *    example 13: number_format('1 000,50', 2, '.', ' ');
  // *    returns 13: '100 050.00'
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}