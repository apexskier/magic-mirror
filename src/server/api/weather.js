var request = require('request');
var Cache = require('../../common/cache');

var apiKey = require('../../private.js').forecast;

// var mockData = JSON.parse(`{"latitude":47.6373976,"longitude":-122.19845959999998,"timezone":"America/Los_Angeles","offset":-8,"currently":{"time":1452752907,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","nearestStormDistance":18,"nearestStormBearing":45,"precipIntensity":0,"precipProbability":0,"temperature":42.03,"apparentTemperature":39.66,"dewPoint":40.52,"humidity":0.94,"windSpeed":4,"windBearing":164,"visibility":8.33,"cloudCover":0.77,"pressure":1015.75,"ozone":358.88},"minutely":{"summary":"Mostly cloudy for the hour.","icon":"partly-cloudy-night","data":[{"time":1452752880,"precipIntensity":0,"precipProbability":0},{"time":1452752940,"precipIntensity":0,"precipProbability":0},{"time":1452753000,"precipIntensity":0,"precipProbability":0},{"time":1452753060,"precipIntensity":0,"precipProbability":0},{"time":1452753120,"precipIntensity":0,"precipProbability":0},{"time":1452753180,"precipIntensity":0,"precipProbability":0},{"time":1452753240,"precipIntensity":0,"precipProbability":0},{"time":1452753300,"precipIntensity":0,"precipProbability":0},{"time":1452753360,"precipIntensity":0,"precipProbability":0},{"time":1452753420,"precipIntensity":0,"precipProbability":0},{"time":1452753480,"precipIntensity":0,"precipProbability":0},{"time":1452753540,"precipIntensity":0,"precipProbability":0},{"time":1452753600,"precipIntensity":0,"precipProbability":0},{"time":1452753660,"precipIntensity":0,"precipProbability":0},{"time":1452753720,"precipIntensity":0,"precipProbability":0},{"time":1452753780,"precipIntensity":0,"precipProbability":0},{"time":1452753840,"precipIntensity":0,"precipProbability":0},{"time":1452753900,"precipIntensity":0,"precipProbability":0},{"time":1452753960,"precipIntensity":0,"precipProbability":0},{"time":1452754020,"precipIntensity":0,"precipProbability":0},{"time":1452754080,"precipIntensity":0,"precipProbability":0},{"time":1452754140,"precipIntensity":0,"precipProbability":0},{"time":1452754200,"precipIntensity":0,"precipProbability":0},{"time":1452754260,"precipIntensity":0,"precipProbability":0},{"time":1452754320,"precipIntensity":0,"precipProbability":0},{"time":1452754380,"precipIntensity":0,"precipProbability":0},{"time":1452754440,"precipIntensity":0,"precipProbability":0},{"time":1452754500,"precipIntensity":0,"precipProbability":0},{"time":1452754560,"precipIntensity":0,"precipProbability":0},{"time":1452754620,"precipIntensity":0,"precipProbability":0},{"time":1452754680,"precipIntensity":0,"precipProbability":0},{"time":1452754740,"precipIntensity":0,"precipProbability":0},{"time":1452754800,"precipIntensity":0,"precipProbability":0},{"time":1452754860,"precipIntensity":0,"precipProbability":0},{"time":1452754920,"precipIntensity":0,"precipProbability":0},{"time":1452754980,"precipIntensity":0,"precipProbability":0},{"time":1452755040,"precipIntensity":0,"precipProbability":0},{"time":1452755100,"precipIntensity":0,"precipProbability":0},{"time":1452755160,"precipIntensity":0,"precipProbability":0},{"time":1452755220,"precipIntensity":0,"precipProbability":0},{"time":1452755280,"precipIntensity":0,"precipProbability":0},{"time":1452755340,"precipIntensity":0,"precipProbability":0},{"time":1452755400,"precipIntensity":0,"precipProbability":0},{"time":1452755460,"precipIntensity":0,"precipProbability":0},{"time":1452755520,"precipIntensity":0,"precipProbability":0},{"time":1452755580,"precipIntensity":0,"precipProbability":0},{"time":1452755640,"precipIntensity":0,"precipProbability":0},{"time":1452755700,"precipIntensity":0,"precipProbability":0},{"time":1452755760,"precipIntensity":0,"precipProbability":0},{"time":1452755820,"precipIntensity":0,"precipProbability":0},{"time":1452755880,"precipIntensity":0,"precipProbability":0},{"time":1452755940,"precipIntensity":0,"precipProbability":0},{"time":1452756000,"precipIntensity":0,"precipProbability":0},{"time":1452756060,"precipIntensity":0,"precipProbability":0},{"time":1452756120,"precipIntensity":0,"precipProbability":0},{"time":1452756180,"precipIntensity":0,"precipProbability":0},{"time":1452756240,"precipIntensity":0,"precipProbability":0},{"time":1452756300,"precipIntensity":0,"precipProbability":0},{"time":1452756360,"precipIntensity":0,"precipProbability":0},{"time":1452756420,"precipIntensity":0,"precipProbability":0},{"time":1452756480,"precipIntensity":0,"precipProbability":0}]},"hourly":{"summary":"Mostly cloudy throughout the day.","icon":"partly-cloudy-day","data":[{"time":1452751200,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.002,"precipProbability":0.06,"precipType":"rain","temperature":42.54,"apparentTemperature":40.63,"dewPoint":41.16,"humidity":0.95,"windSpeed":3.58,"windBearing":152,"visibility":8.32,"cloudCover":0.8,"pressure":1015.56,"ozone":358.94},{"time":1452754800,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":41.47,"apparentTemperature":38.48,"dewPoint":39.81,"humidity":0.94,"windSpeed":4.64,"windBearing":175,"visibility":8.34,"cloudCover":0.74,"pressure":1015.97,"ozone":358.8},{"time":1452758400,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0008,"precipProbability":0.01,"precipType":"rain","temperature":41.04,"apparentTemperature":37.92,"dewPoint":39.29,"humidity":0.93,"windSpeed":4.72,"windBearing":182,"visibility":8.11,"cloudCover":0.7,"pressure":1016.32,"ozone":358.34},{"time":1452762000,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":40.46,"apparentTemperature":37.18,"dewPoint":38.77,"humidity":0.94,"windSpeed":4.79,"windBearing":185,"visibility":8.01,"cloudCover":0.68,"pressure":1016.6,"ozone":358.35},{"time":1452765600,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":39.9,"apparentTemperature":36.48,"dewPoint":38.1,"humidity":0.93,"windSpeed":4.84,"windBearing":189,"visibility":8.17,"cloudCover":0.63,"pressure":1016.8,"ozone":359.64},{"time":1452769200,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":39.85,"apparentTemperature":36.37,"dewPoint":37.97,"humidity":0.93,"windSpeed":4.92,"windBearing":186,"visibility":8.29,"cloudCover":0.72,"pressure":1016.96,"ozone":361.39},{"time":1452772800,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":39.15,"apparentTemperature":35.05,"dewPoint":37.3,"humidity":0.93,"windSpeed":5.55,"windBearing":186,"visibility":8.45,"cloudCover":0.74,"pressure":1017.06,"ozone":361.96},{"time":1452776400,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":38.9,"apparentTemperature":34.81,"dewPoint":36.95,"humidity":0.93,"windSpeed":5.49,"windBearing":176,"visibility":8.6,"cloudCover":0.81,"pressure":1017.07,"ozone":360.18},{"time":1452780000,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":38.44,"apparentTemperature":34.26,"dewPoint":36.45,"humidity":0.92,"windSpeed":5.49,"windBearing":175,"visibility":8.64,"cloudCover":0.91,"pressure":1017,"ozone":357.21},{"time":1452783600,"summary":"Overcast","icon":"cloudy","precipIntensity":0,"precipProbability":0,"temperature":38.15,"apparentTemperature":33.87,"dewPoint":35.9,"humidity":0.92,"windSpeed":5.57,"windBearing":176,"visibility":8.78,"cloudCover":0.96,"pressure":1016.86,"ozone":354.84},{"time":1452787200,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":37.82,"apparentTemperature":33.91,"dewPoint":35.37,"humidity":0.91,"windSpeed":5,"windBearing":170,"visibility":8.81,"cloudCover":0.9,"pressure":1016.71,"ozone":353.79},{"time":1452790800,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":39,"apparentTemperature":35.47,"dewPoint":36.15,"humidity":0.89,"windSpeed":4.78,"windBearing":165,"visibility":8.85,"cloudCover":0.83,"pressure":1016.49,"ozone":353.34},{"time":1452794400,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":40.61,"apparentTemperature":37.62,"dewPoint":36.82,"humidity":0.86,"windSpeed":4.47,"windBearing":171,"visibility":9,"cloudCover":0.73,"pressure":1016.01,"ozone":353.05},{"time":1452798000,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":42.3,"apparentTemperature":40.09,"dewPoint":37.2,"humidity":0.82,"windSpeed":3.87,"windBearing":173,"visibility":9.29,"cloudCover":0.66,"pressure":1015.14,"ozone":352.81},{"time":1452801600,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":43.61,"apparentTemperature":42.22,"dewPoint":37.34,"humidity":0.78,"windSpeed":3.22,"windBearing":162,"visibility":9.49,"cloudCover":0.61,"pressure":1014.05,"ozone":352.73},{"time":1452805200,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":45.29,"apparentTemperature":44.18,"dewPoint":37.78,"humidity":0.75,"windSpeed":3.17,"windBearing":129,"visibility":9.68,"cloudCover":0.67,"pressure":1012.95,"ozone":352.72},{"time":1452808800,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":47.23,"apparentTemperature":46.27,"dewPoint":38.91,"humidity":0.73,"windSpeed":3.29,"windBearing":111,"visibility":9.81,"cloudCover":0.7,"pressure":1011.84,"ozone":352.76},{"time":1452812400,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":48.24,"apparentTemperature":46.9,"dewPoint":39.73,"humidity":0.72,"windSpeed":3.92,"windBearing":94,"visibility":9.71,"cloudCover":0.73,"pressure":1010.78,"ozone":352.85},{"time":1452816000,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":47.57,"apparentTemperature":46.09,"dewPoint":39.11,"humidity":0.72,"windSpeed":3.97,"windBearing":90,"visibility":9.82,"cloudCover":0.76,"pressure":1009.98,"ozone":352.88},{"time":1452819600,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":46.06,"apparentTemperature":44.26,"dewPoint":38.1,"humidity":0.74,"windSpeed":4.07,"windBearing":89,"visibility":9.9,"cloudCover":0.87,"pressure":1009.52,"ozone":352.88},{"time":1452823200,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":44.36,"apparentTemperature":42.1,"dewPoint":36.72,"humidity":0.74,"windSpeed":4.31,"windBearing":92,"visibility":9.95,"cloudCover":0.88,"pressure":1009.29,"ozone":352.81},{"time":1452826800,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":42.63,"apparentTemperature":39.93,"dewPoint":35.59,"humidity":0.76,"windSpeed":4.51,"windBearing":95,"visibility":9.97,"cloudCover":0.91,"pressure":1009.25,"ozone":352.48},{"time":1452830400,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":41.04,"apparentTemperature":38,"dewPoint":34.22,"humidity":0.76,"windSpeed":4.6,"windBearing":99,"visibility":10,"cloudCover":0.9,"pressure":1009.23,"ozone":351.46},{"time":1452834000,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":40.04,"apparentTemperature":36.87,"dewPoint":33.61,"humidity":0.78,"windSpeed":4.56,"windBearing":103,"visibility":10,"cloudCover":0.9,"pressure":1009.34,"ozone":350.18},{"time":1452837600,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":39.33,"apparentTemperature":36.16,"dewPoint":33.2,"humidity":0.78,"windSpeed":4.42,"windBearing":106,"visibility":10,"cloudCover":0.9,"pressure":1009.5,"ozone":349.75},{"time":1452841200,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":38.8,"apparentTemperature":35.59,"dewPoint":32.53,"humidity":0.78,"windSpeed":4.37,"windBearing":107,"visibility":10,"cloudCover":0.83,"pressure":1009.71,"ozone":351.02},{"time":1452844800,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":38.52,"apparentTemperature":35.3,"dewPoint":32.16,"humidity":0.78,"windSpeed":4.33,"windBearing":107,"visibility":10,"cloudCover":0.75,"pressure":1009.97,"ozone":353.15},{"time":1452848400,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":38.36,"apparentTemperature":35.22,"dewPoint":32,"humidity":0.78,"windSpeed":4.21,"windBearing":108,"visibility":10,"cloudCover":0.68,"pressure":1010.3,"ozone":354.73},{"time":1452852000,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":38.17,"apparentTemperature":35.19,"dewPoint":31.81,"humidity":0.78,"windSpeed":4.02,"windBearing":112,"visibility":10,"cloudCover":0.62,"pressure":1010.67,"ozone":355.21},{"time":1452855600,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":37.62,"apparentTemperature":34.78,"dewPoint":31.27,"humidity":0.78,"windSpeed":3.79,"windBearing":116,"visibility":10,"cloudCover":0.54,"pressure":1011.08,"ozone":355.14},{"time":1452859200,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":37.3,"apparentTemperature":34.59,"dewPoint":31.13,"humidity":0.78,"windSpeed":3.63,"windBearing":121,"visibility":10,"cloudCover":0.52,"pressure":1011.49,"ozone":354.81},{"time":1452862800,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":37,"apparentTemperature":34.22,"dewPoint":31.18,"humidity":0.79,"windSpeed":3.65,"windBearing":125,"visibility":10,"cloudCover":0.54,"pressure":1011.89,"ozone":354.46},{"time":1452866400,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0009,"precipProbability":0.01,"precipType":"rain","temperature":37.13,"apparentTemperature":34.27,"dewPoint":31.77,"humidity":0.81,"windSpeed":3.75,"windBearing":129,"visibility":10,"cloudCover":0.58,"pressure":1012.3,"ozone":353.86},{"time":1452870000,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0023,"precipProbability":0.07,"precipType":"rain","temperature":37.5,"apparentTemperature":34.62,"dewPoint":32.6,"humidity":0.82,"windSpeed":3.81,"windBearing":134,"visibility":10,"cloudCover":0.63,"pressure":1012.74,"ozone":352.58},{"time":1452873600,"summary":"Drizzle","icon":"rain","precipIntensity":0.0057,"precipProbability":0.28,"precipType":"rain","temperature":38.31,"apparentTemperature":35.51,"dewPoint":33.84,"humidity":0.84,"windSpeed":3.85,"windBearing":138,"visibility":10,"cloudCover":0.69,"pressure":1013.23,"ozone":350.16},{"time":1452877200,"summary":"Light Rain","icon":"rain","precipIntensity":0.01,"precipProbability":0.55,"precipType":"rain","temperature":39.44,"apparentTemperature":36.76,"dewPoint":35.44,"humidity":0.85,"windSpeed":3.91,"windBearing":144,"visibility":10,"cloudCover":0.77,"pressure":1013.71,"ozone":347.07},{"time":1452880800,"summary":"Light Rain","icon":"rain","precipIntensity":0.0127,"precipProbability":0.58,"precipType":"rain","temperature":40.34,"apparentTemperature":37.64,"dewPoint":36.73,"humidity":0.87,"windSpeed":4.08,"windBearing":151,"visibility":10,"cloudCover":0.83,"pressure":1014.05,"ozone":344.27},{"time":1452884400,"summary":"Light Rain","icon":"rain","precipIntensity":0.0124,"precipProbability":0.58,"precipType":"rain","temperature":41.32,"apparentTemperature":38.64,"dewPoint":38.03,"humidity":0.88,"windSpeed":4.24,"windBearing":162,"visibility":10,"cloudCover":0.87,"pressure":1014.19,"ozone":342.03},{"time":1452888000,"summary":"Light Rain","icon":"rain","precipIntensity":0.0106,"precipProbability":0.56,"precipType":"rain","temperature":42.59,"apparentTemperature":40.06,"dewPoint":39.56,"humidity":0.89,"windSpeed":4.29,"windBearing":168,"visibility":10,"cloudCover":0.89,"pressure":1014.21,"ozone":340.08},{"time":1452891600,"summary":"Drizzle","icon":"rain","precipIntensity":0.0088,"precipProbability":0.51,"precipType":"rain","temperature":44,"apparentTemperature":41.67,"dewPoint":41.17,"humidity":0.9,"windSpeed":4.33,"windBearing":171,"visibility":10,"cloudCover":0.91,"pressure":1014.21,"ozone":338.51},{"time":1452895200,"summary":"Drizzle","icon":"rain","precipIntensity":0.0079,"precipProbability":0.44,"precipType":"rain","temperature":45.4,"apparentTemperature":43.07,"dewPoint":42.69,"humidity":0.9,"windSpeed":4.64,"windBearing":182,"visibility":10,"cloudCover":0.94,"pressure":1014.28,"ozone":337.55},{"time":1452898800,"summary":"Drizzle","icon":"rain","precipIntensity":0.0072,"precipProbability":0.38,"precipType":"rain","temperature":46.58,"apparentTemperature":44.12,"dewPoint":43.93,"humidity":0.9,"windSpeed":5.13,"windBearing":190,"visibility":10,"cloudCover":0.97,"pressure":1014.38,"ozone":336.98},{"time":1452902400,"summary":"Drizzle","icon":"rain","precipIntensity":0.0062,"precipProbability":0.31,"precipType":"rain","temperature":47.19,"apparentTemperature":44.56,"dewPoint":44.53,"humidity":0.9,"windSpeed":5.59,"windBearing":189,"visibility":10,"cloudCover":0.98,"pressure":1014.39,"ozone":336.24},{"time":1452906000,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0046,"precipProbability":0.2,"precipType":"rain","temperature":46.69,"apparentTemperature":43.85,"dewPoint":44,"humidity":0.9,"windSpeed":5.77,"windBearing":176,"visibility":10,"cloudCover":0.93,"pressure":1014.24,"ozone":334.88},{"time":1452909600,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0027,"precipProbability":0.09,"precipType":"rain","temperature":45.49,"apparentTemperature":42.38,"dewPoint":42.73,"humidity":0.9,"windSpeed":5.85,"windBearing":160,"visibility":10,"cloudCover":0.86,"pressure":1013.98,"ozone":333.36},{"time":1452913200,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0014,"precipProbability":0.03,"precipType":"rain","temperature":44.12,"apparentTemperature":40.82,"dewPoint":41.14,"humidity":0.89,"windSpeed":5.76,"windBearing":149,"visibility":10,"cloudCover":0.82,"pressure":1013.67,"ozone":332.44},{"time":1452916800,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0008,"precipProbability":0.01,"precipType":"rain","temperature":43.25,"apparentTemperature":39.86,"dewPoint":39.71,"humidity":0.87,"windSpeed":5.63,"windBearing":141,"visibility":10,"cloudCover":0.85,"pressure":1013.32,"ozone":332.65},{"time":1452920400,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0009,"precipProbability":0.01,"precipType":"rain","temperature":42.76,"apparentTemperature":39.34,"dewPoint":38.5,"humidity":0.85,"windSpeed":5.55,"windBearing":136,"visibility":10,"cloudCover":0.92,"pressure":1012.9,"ozone":333.47},{"time":1452924000,"summary":"Overcast","icon":"cloudy","precipIntensity":0.0022,"precipProbability":0.06,"precipType":"rain","temperature":42.56,"apparentTemperature":39.16,"dewPoint":37.79,"humidity":0.83,"windSpeed":5.46,"windBearing":133,"visibility":10,"cloudCover":0.97,"pressure":1012.34,"ozone":334.02}]},"daily":{"summary":"Light rain throughout the week, with temperatures bottoming out at 47°F on Friday.","icon":"rain","data":[{"time":1452672000,"summary":"Light rain until afternoon, starting again in the evening.","icon":"rain","sunriseTime":1452700501,"sunsetTime":1452732112,"moonPhase":0.13,"precipIntensity":0.0168,"precipIntensityMax":0.041,"precipIntensityMaxTime":1452704400,"precipProbability":0.74,"precipType":"rain","temperatureMin":41.47,"temperatureMinTime":1452754800,"temperatureMax":49.64,"temperatureMaxTime":1452679200,"apparentTemperatureMin":38.48,"apparentTemperatureMinTime":1452754800,"apparentTemperatureMax":47.05,"apparentTemperatureMaxTime":1452679200,"dewPoint":43.08,"humidity":0.91,"windSpeed":2.62,"windBearing":165,"visibility":8.45,"cloudCover":0.84,"pressure":1007.83,"ozone":349.75},{"time":1452758400,"summary":"Mostly cloudy throughout the day.","icon":"partly-cloudy-day","sunriseTime":1452786867,"sunsetTime":1452818591,"moonPhase":0.17,"precipIntensity":0.0002,"precipIntensityMax":0.0008,"precipIntensityMaxTime":1452758400,"precipProbability":0.01,"precipType":"rain","temperatureMin":37.82,"temperatureMinTime":1452787200,"temperatureMax":48.24,"temperatureMaxTime":1452812400,"apparentTemperatureMin":33.87,"apparentTemperatureMinTime":1452783600,"apparentTemperatureMax":46.9,"apparentTemperatureMaxTime":1452812400,"dewPoint":36.8,"humidity":0.83,"windSpeed":3.52,"windBearing":146,"visibility":9.22,"cloudCover":0.79,"pressure":1013.52,"ozone":354.56},{"time":1452844800,"summary":"Light rain until afternoon, starting again overnight.","icon":"rain","sunriseTime":1452873230,"sunsetTime":1452905072,"moonPhase":0.21,"precipIntensity":0.0043,"precipIntensityMax":0.0127,"precipIntensityMaxTime":1452880800,"precipProbability":0.58,"precipType":"rain","temperatureMin":37,"temperatureMinTime":1452862800,"temperatureMax":47.19,"temperatureMaxTime":1452902400,"apparentTemperatureMin":34.22,"apparentTemperatureMinTime":1452862800,"apparentTemperatureMax":44.56,"apparentTemperatureMaxTime":1452902400,"dewPoint":37.14,"humidity":0.85,"windSpeed":4.2,"windBearing":146,"visibility":10,"cloudCover":0.79,"pressure":1012.88,"ozone":343.4},{"time":1452931200,"summary":"Rain throughout the day.","icon":"rain","sunriseTime":1452959590,"sunsetTime":1452991554,"moonPhase":0.25,"precipIntensity":0.0262,"precipIntensityMax":0.062,"precipIntensityMaxTime":1452956400,"precipProbability":0.79,"precipType":"rain","temperatureMin":42.45,"temperatureMinTime":1452952800,"temperatureMax":51.06,"temperatureMaxTime":1452981600,"apparentTemperatureMin":36.2,"apparentTemperatureMinTime":1452952800,"apparentTemperatureMax":51.06,"apparentTemperatureMaxTime":1452981600,"dewPoint":42.88,"humidity":0.88,"windSpeed":7.98,"windBearing":161,"visibility":8.78,"cloudCover":0.97,"pressure":1007.07,"ozone":348.86},{"time":1453017600,"summary":"Light rain throughout the day.","icon":"rain","sunriseTime":1453045948,"sunsetTime":1453078037,"moonPhase":0.28,"precipIntensity":0.0255,"precipIntensityMax":0.0438,"precipIntensityMaxTime":1453064400,"precipProbability":0.75,"precipType":"rain","temperatureMin":43.63,"temperatureMinTime":1453100400,"temperatureMax":47.82,"temperatureMaxTime":1453017600,"apparentTemperatureMin":39.67,"apparentTemperatureMinTime":1453039200,"apparentTemperatureMax":45.24,"apparentTemperatureMaxTime":1453017600,"dewPoint":42.9,"humidity":0.92,"windSpeed":5.19,"windBearing":138,"visibility":10,"cloudCover":0.96,"pressure":1008.84,"ozone":359.8},{"time":1453104000,"summary":"Drizzle throughout the day.","icon":"rain","sunriseTime":1453132303,"sunsetTime":1453164522,"moonPhase":0.32,"precipIntensity":0.0064,"precipIntensityMax":0.0107,"precipIntensityMaxTime":1453104000,"precipProbability":0.56,"precipType":"rain","temperatureMin":38.59,"temperatureMinTime":1453186800,"temperatureMax":48.83,"temperatureMaxTime":1453154400,"apparentTemperatureMin":35.78,"apparentTemperatureMinTime":1453186800,"apparentTemperatureMax":48.83,"apparentTemperatureMaxTime":1453154400,"dewPoint":41.36,"humidity":0.94,"windSpeed":3.03,"windBearing":128,"cloudCover":0.48,"pressure":1014.06,"ozone":372.19},{"time":1453190400,"summary":"Drizzle in the morning and evening.","icon":"rain","sunriseTime":1453218656,"sunsetTime":1453251007,"moonPhase":0.36,"precipIntensity":0.0046,"precipIntensityMax":0.0058,"precipIntensityMaxTime":1453269600,"precipProbability":0.28,"precipType":"rain","temperatureMin":36.6,"temperatureMinTime":1453212000,"temperatureMax":47.44,"temperatureMaxTime":1453237200,"apparentTemperatureMin":32.9,"apparentTemperatureMinTime":1453204800,"apparentTemperatureMax":45.21,"apparentTemperatureMaxTime":1453237200,"dewPoint":37.22,"humidity":0.88,"windSpeed":4.64,"windBearing":89,"cloudCover":0.63,"pressure":1011.91,"ozone":352.55},{"time":1453276800,"summary":"Drizzle starting in the evening.","icon":"rain","sunriseTime":1453305006,"sunsetTime":1453337494,"moonPhase":0.39,"precipIntensity":0.0042,"precipIntensityMax":0.0054,"precipIntensityMaxTime":1453359600,"precipProbability":0.26,"precipType":"rain","temperatureMin":38.31,"temperatureMinTime":1453305600,"temperatureMax":50.25,"temperatureMaxTime":1453323600,"apparentTemperatureMin":35.99,"apparentTemperatureMinTime":1453305600,"apparentTemperatureMax":50.25,"apparentTemperatureMaxTime":1453323600,"dewPoint":38.25,"humidity":0.83,"windSpeed":2.92,"windBearing":114,"cloudCover":0.81,"pressure":1013.59,"ozone":362.86}]},"flags":{"sources":["darksky","lamp","gfs","cmc","nam","rap","rtma","sref","fnmoc","isd","nwspa","madis","nearest-precip"],"darksky-stations":["KATX"],"lamp-stations":["KAWO","KBFI","KPAE","KPWT","KRNT","KSEA","KTCM","KTIW"],"isd-stations":["994014-99999","999999-24234","999999-24244","999999-24281","999999-94290"],"madis-stations":["AV093","C1943","C3186","C5022","D2923","D3422","D4490","D6133","D6811","D6865","D9096","E6711","E7765","E8003","EVERB","UWASH"],"units":"us"}}`);

// 5 minute cache
var weatherCache = new Cache(1000 * 60 * 5);

function get(req, res) {
    weatherCache(`${req.params.lat};${req.params.lng}`, function(resolve, reject) {
        // return resolve(mockData);
        request({
            method: 'GET',
            url: `https://api.forecast.io/forecast/${apiKey}/${req.params.lat},${req.params.lng}`,
            json: true
        }, function(err, response, body) {
            if (!err) {
                resolve(body);
            } else {
                reject(err);
            }
        });
    }).then(function(data) {
        res.json({
            status: 'success',
            data: data
        });
    }).catch(function(data) {
        res.status(500).json({
            status: 'error',
            data: data
        });
    });
}

module.exports.get = get;
