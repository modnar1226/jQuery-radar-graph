(function ( $ ) {
    $.fn.radarGraph = function (options) {
        /**
         *  @param var defaults = object;
         *  add to it but dont call directly use 'settings.key' instead
        **/
        var defaults = {
            polyFill: false,
            borderOffset: 25,
            dataPoints: 4,
            levels: 5,
            levelColor: '#b5b5b5',
            maxValue: 25,
            labels: [
                'data point1',
                'data point2',
                'data point3',
                'data point4',
            ],
            chartData: {
                // color accepts hex value also : #666666
                '0':{'name':'thing1','score':[20,15,15,16.6], 'color':'red'},
                '1':{'name':'thing2','score':[17,15,15,15.6], 'color':'blue'},
                '2':{'name':'thing3','score':[20,25,20,21.6], 'color':'green'},
                '3':{'name':'thing4','score':[25,15,25,21.6], 'color':'purple'},
            },
        }
        /**
         *  @param var settings;
         *  call defaults from this object not defaults
         **/
        var settings = $.extend( {}, defaults, options );
        // plugin globals
        var canvasHeight = this.height();
        var heightMargin = this.height() - 50;
        var canvasWidth = this.width();
        var widthMargin = this.width() - 50;
        var halfWidth = (canvasWidth / 2); // x axis
        var halfHeight = (canvasHeight / 2);// - settings.borderOffset - 5; // y axis
        var radius = widthMargin / 2 - settings.borderOffset;
        var incrimentAngle = 360 / settings.dataPoints;
        var chartHeight = halfHeight * 2;
        var ringSpace = (radius) / settings.levels;

        //var radius = halfWidth;
        return this.each(function(key,element){
            if (element.getContext) {
                var ctx = element.getContext('2d');
                if (verifyNoErrors() === false) {
                    return;
                }
                var vectors = drawDataPoints(ctx);
                drawLevels(ctx);
                drawLabels(ctx, vectors);
                var html = drawLegend(element);
                html.appendTo(element.parentElement);
                drawChartData(ctx)
            } else {
                return console.log("Couldn't get context of canvas object.");
            }
        });
        /**
        *  Private Functions
        **/

        function verifyNoErrors() {
            var errorCheck = true
            // check that labels equals the dsettings.maxValue / radiusata points
            if (settings.dataPoints !== settings.labels.length) {
                alert('Label count and data point count do not match');
                errorCheck =  false;
            }
            $.each(settings.chartData, function (key, value){
                if (this.score.length !== settings.dataPoints) {
                    alert('The input score array length for '+ this.name +' does not match the label count.');
                    errorCheck =  false;
                }
            });
            return errorCheck;
        }

        // Draws the appropriate slices for number of data points default = 4;
        function drawDataPoints(ctx) {
            var dataCords = {'x':{},'y':{},'radius':{}};
            var startAngle = -90;
            var workingAngle = startAngle;
            var x = halfWidth + radius * Math.cos(startAngle * (Math.PI /180));
            var y = halfHeight + radius * Math.sin(startAngle * (Math.PI /180));
            for (var i = 0; i < settings.dataPoints; i++) {
                ctx.moveTo(halfWidth, halfHeight);
                ctx.lineTo(x, y);
                workingAngle += incrimentAngle;

                dataCords.x[i] = x;
                dataCords.y[i] = y;
                x = halfWidth + radius * Math.cos(workingAngle * (Math.PI / 180));
                y = halfHeight + radius * Math.sin(workingAngle * (Math.PI / 180));
            }
            ctx.strokeStyle = settings.levelColor;
            ctx.stroke();
            return dataCords;
        }

        function drawLevels(ctx){
            var workingRingSpace = 0;
            for (var lev = 0; lev < settings.levels; lev++) {
                ctx.fillText((settings.maxValue / settings.levels) * lev, halfWidth + workingRingSpace,halfHeight);
                workingRingSpace += ringSpace;
                ctx.beginPath();
                // draw a circle with radius of 'workingRingSpace' ie incriment by ring space
                ctx.arc(halfWidth, halfHeight, workingRingSpace, 0, Math.PI * 2, true)
                ctx.strokeStyle = settings.levelColor;
                ctx.stroke();
            }
        }

        function drawLabels(ctx, vectors) {
            // coordinate loop, x and y object should have same number of indexes
            for (var i = 0; i < settings.dataPoints; i++) {
                xPos = Math.round(vectors.x[i]);
                yPos = Math.round(vectors.y[i]);
                if (xPos === halfWidth && yPos < halfHeight) {
                    ctx.textAlign = 'center';
                    vectors.y[i] -= 2;
                } else if (xPos > halfWidth + .1 && yPos < halfHeight - .1) {
                    ctx.textAlign = 'left';
                    vectors.x[i] += 1;
                    vectors.y[i] -= 1;
                } else if (xPos > halfWidth && yPos === halfHeight) {
                    ctx.textAlign = 'left';
                    vectors.x[i] += 2;
                } else if (xPos > halfWidth + .1 && yPos > halfHeight + .1) {
                    ctx.textAlign = 'left';
                    vectors.x[i] += 1;
                    vectors.y[i] += 10;
                } else if (xPos === halfWidth && yPos > halfHeight) {
                    ctx.textAlign = 'center';
                    vectors.y[i] += 10;
                } else if (xPos < halfWidth - .1 && yPos > halfHeight + .1) {
                    ctx.textAlign = 'right';
                    vectors.x[i] -= 1;
                    vectors.y[i] += 10;
                } else if (xPos < halfWidth && yPos === halfHeight) {
                    ctx.textAlign = 'right';
                    vectors.x[i] -= 2;
                } else {
                    ctx.textAlign = 'right';
                    vectors.x[i] -= 1;
                    vectors.y[i] -= 1;
                }
                ctx.fillText(i+1, vectors.x[i], vectors.y[i]);
            }
        }

        function drawLegend(element) {
            var container = $('<div>').attr({
                id:'canvasLegend',
            }).css({
                width: canvasWidth,
                clear: 'both',
                border: '1px solid black'
            });
            var leftHtml = $('<div>').attr({
                id: 'legendLeft',
            }).css({
                fontSize: '.5em',
                width: halfWidth,
                float: 'left',
                boxSizing: 'border-box',
                padding:'5px'
            });
            var rightHtml = $('<div>').attr({
                id: 'legendRight'
            }).css({
                fontSize: '.5em',
                width: halfWidth,
                float: 'left',
                textAlign: 'left',
                boxSizing: 'border-box',
                padding:'5px',
            });
            var legendList = $('<ol>').attr({
                id: 'legendList'
            });
            var colorList = $('<ul>').css({
                listStyleType: 'square',

            });
            for (var label = 0; label < settings.labels.length; label++) {
                var newtext = settings.labels[label].replace(/^\b[a-z]/, function(oldtext) {
                    return oldtext.toUpperCase();
                });
                var legendItem = '<li>'+ newtext +'</li>';
                legendList.append(legendItem);
            }
            for (var index = 0; index < Object.keys(settings.chartData).length; index++) {
                var colorItem = '<li style="color:'+ settings.chartData[index].color +'"><span style="color:black;">'+ settings.chartData[index].name +'</span></li>'
                colorList.append(colorItem);
            }
            leftHtml.append(legendList);
            container.append(leftHtml);
            rightHtml.append(colorList);
            container.append(rightHtml);
            container.append($('<div>').css({clear:'both'}));

            return container;
        }

        function drawChartData(ctx) {
            // conversion for max value in px
            var multiplier = radius / settings.maxValue;
            // angle to draw, -90 draws the line verticaly
            var workingAngle = -90;
            for (var i = 0; i < Object.keys(settings.chartData).length; i++) {
                // vector coordinate for each graph shape to be drawn
                var polygonX = [];
                var polygonY = [];
                for (var s = 0; s < settings.chartData[i].score.length; s++) {
                    // how far from center
                    var distance = settings.chartData[i].score[s] * multiplier;
                    // x and y coordinates
                    var markerX = halfWidth + distance * Math.cos(workingAngle * (Math.PI /180));
                    var markerY = halfHeight + distance * Math.sin(workingAngle * (Math.PI /180));
                    // record each coordinate
                    polygonX[s] = markerX;
                    polygonY[s] = markerY;
                    // increase angle at which to draw
                    workingAngle += incrimentAngle;
                }
                ctx.strokeStyle = settings.chartData[i].color;

                if (settings.polyFill === true) {
                    ctx.fillStyle = settings.chartData[i].color;
                    ctx.globalAlpha = 0.2;
                    ctx.beginPath();
                    ctx.moveTo(polygonX[0],polygonY[0]);
                    for (var p1 = 1; p1 < polygonX.length; p1++) {
                        ctx.lineTo(polygonX[p1],polygonY[p1]);
                    }
                    ctx.closePath();

                    ctx.fill();
                    ctx.globalAlpha = 1;
                }

                ctx.beginPath();
                ctx.moveTo(polygonX[0],polygonY[0]);
                for (var p2 = 1; p2 < polygonX.length; p2++) {
                    ctx.lineTo(polygonX[p2],polygonY[p2]);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}(jQuery));
