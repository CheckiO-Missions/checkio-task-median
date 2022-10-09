//Dont change it
requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $, rr) {
        var $tryit;
        var tCanvas;
        var defaultArray = [1, 10, 2, 9, 3, 8, 4, 7, 5, 6];

        function retConsole(ret) {
            var numbRet = Number(ret);
            if (!isNaN(numbRet)) {
                if (numbRet < 11 && numbRet >= 0) {
                    tCanvas.createMedian(numbRet);
                }
                $tryit.find(".checkio-result").html("Result<br>" + JSON.stringify(numbRet));
            }
            else {
                $tryit.find(".checkio-result").html("Result<br>" + JSON.stringify(ret));
            }
        }

        function tryitPanel(this_e) {

            $tryit = $(this_e.extSetHtmlTryIt(this_e.getTemplate('tryit')));
            tCanvas = new MedianCanvas($tryit.find(".tryit-canvas")[0], defaultArray,
                {"cell": 20, "height": 150, "font-size": 15, "x0": 10, "y0": 10, "unit": 15}
            );
            tCanvas.createCanvas();
            tCanvas.createFeedback();
            $tryit.find(".tryit-canvas").mousedown(function (e) {
                e.originalEvent.preventDefault();
            });
            $tryit.find(".bn-check").click(function (e) {
                tCanvas.removeMedian();
                this_e.extSendToConsoleCheckiO(tCanvas.gatherData());
                e.stopPropagation();
                return false;
            });
        }

        function normalizeArray(list) {
            var res = [];
            var m = Math.max.apply(Math, list);
            for (var i = 0; i < list.length; i++) {
                res.push(list[i] / m);
            }
            return res;
        }

        function median(list) {
            if (list.length === 0) {
                return 0;
            }
            var ml = list.concat().sort(function (a, b) {
                return Number(a) - Number(b)
            });
            var l = ml.length;
            if (l % 2) {
                return ml[Math.floor(l / 2)];
            }
            else {
                return (ml[l / 2] + ml[l / 2 - 1]) / 2;
            }
        }
        function MedianCanvas(dom, numbers, options) {
            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var format = Raphael.format;

            options = options || {};
            var cell = options["cell"] || 30;
            var maxHeight = options["height"] || 200;
            var fontSize = options["font-size"] || 15;
            var x0 = options["x0"] || 0;
            var y0 = options["y0"] || 0;
            var unit = options["unit"] || 10;

            var N = numbers.length;
            var fullSizeX = (N - 1) * cell + 2 * x0;
            var paper = Raphael(dom, fullSizeX, y0 + maxHeight + fontSize * 2, 0, 0);
            var numSet = [];
            var normArray;

            var medianLine;

            var attrLine = {"stroke": colorBlue3, "stroke-width": cell / 2, "stroke-linecap": "round"};
            var attrShLine = {"stroke": colorGrey1, "stroke-width": cell / 2, "stroke-linecap": "round"};
            var attrText = {"stroke": colorBlue4, "font-size": fontSize, "font-family": "Verdana"};
            var attrMedian = {"stroke": colorOrange3, "stroke-dasharray": "- ", "stroke-width": 1};


            var animationTime = 1000;
            var delay = 300;

            var obj = this;

            this.createCanvas = function () {
                normArray = normalizeArray(numbers);
                for (var i = 0; i < N; i++) {
                    var tempSet = paper.set();
                    tempSet.push(paper.path(format(
                        "M{0},{1}V{2}",
                        x0 + i * cell,
                        y0 + maxHeight,
                        y0 + maxHeight * (1 - normArray[i])
                    )).attr(attrLine));
                    tempSet.n = numbers[i];
                    tempSet.prevPos = i;
                    tempSet.push(paper.text(x0 + i * cell, y0 + maxHeight + fontSize, numbers[i]).attr(attrText));
                    numSet.push(tempSet);
                }

            };

            this.animateCanvas = function () {
                numSet.sort(function (a, b) {
                    return a.n - b.n;
                });
                setTimeout(function () {
                    for (var i = 0; i < N; i++) {
                        var diff = i - numSet[i].prevPos;
                        numSet[i].animate({"transform": "t" + (diff * cell) + ",0" }, animationTime);
                    }
                }, delay);
                setTimeout(function () {
                    numSet[Math.floor(N / 2)].animate({"stroke": colorOrange4, "fill": colorOrange4}, animationTime / 2);
                    if (N % 2 == 0) {
                        numSet[Math.floor(N / 2) - 1].animate({"stroke": colorOrange4, "fill": colorOrange4}, animationTime / 2);
                    }
                }, delay + animationTime);
            };

            var mouseDown = false;
            var activeEl;


            this.gatherData = function () {
                var res = [];
                for (var i = 0; i < numSet.length; i++) {
                    if (!numSet[i].off) {
                        res.push(numSet[i].n);
                    }
                }
                return res;
            };

            var gatherData = this.gatherData;

            this.createMedian = function (m) {
                medianLine = paper.path(format("M0,{0}H{1}", y0 + maxHeight - m * unit, fullSizeX)).attr(attrMedian);
            };

            this.removeMedian = function () {
                if (medianLine) {
                    medianLine.remove();
                    medianLine = false;
                }
            };

            this.createFeedback = function () {

                for (var i = 0; i < N; i++) {
                    paper.path(format(
                        "M{0},{1}V{2}",
                        x0 + i * cell,
                        y0 + maxHeight,
                        y0)).attr(attrShLine).toBack();
                }
                activeEl = paper.rect(0, 5, cell * (N - 1) + 2 * x0, maxHeight + y0).attr(
                    {"fill": colorBlue1, "fill-opacity": 0, "stroke-width": 0});
                activeEl.mousedown(function (e) {
                    mouseDown = true;
                });
                activeEl.mouseup(function (e) {
                    mouseDown = false;
                });
                activeEl.mouseout(function (e) {
                    mouseDown = false;
                });
                var changeBars = function (click) {
                    return function (e) {

                        if (!mouseDown && !click) {
                            return false;
                        }
                        var x = Math.floor(e.offsetX / cell);
                        if (!numSet[x].off) {
                            var y = Math.round((y0 + maxHeight - e.offsetY) / unit);
                            numSet[x][0].attr({"path": format(
                                "M{0},{1}V{2}",
                                x0 + x * cell,
                                y0 + maxHeight,
                                y0 + maxHeight - unit * y)});
                            numSet[x][1].attr("text", y);
                            numSet[x].n = y;
                        }
                        obj.removeMedian();
                    }
                };
                var toggleBar = function (b) {
                    return function (e) {
                        if (numSet[b].off) {
                            numSet[b].off = false;
                            numSet[b][0].attr("stroke", colorBlue3);
                            numSet[b][1].attr({"stroke": colorBlue4, "fill": colorBlue4});
                        }
                        else {
                            numSet[b].off = true;
                            numSet[b][0].attr("stroke", colorGrey2);
                            numSet[b][1].attr({"stroke": colorGrey2, "fill": colorGrey2});
                            numSet[b][0].attr({"path": format(
                                "M{0},{1}V{2}",
                                x0 + b * cell,
                                y0 + maxHeight,
                                y0 + maxHeight)});
                            numSet[b][1].attr("text", 0);
                            numSet[b].n = 0;
                        }
                        obj.removeMedian();
//                        changeMedian();
                    }
                };
                activeEl.mousemove(changeBars());
                activeEl.click(changeBars(true));
                for (i = 0; i < N; i++) {
                    numSet[i][1].click(toggleBar(i));
                }

            };


        }
        var io = new extIO({
            animation: function($expl, data){
                var checkioInput = data.in;
                if (!checkioInput){
                    return;
                }
                var canvas = new MedianCanvas($expl[0], checkioInput[0]);
                canvas.createCanvas();
                canvas.animateCanvas();
            },
        });
        io.start();
    }
);
