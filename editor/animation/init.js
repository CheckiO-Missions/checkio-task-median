//Dont change it
requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $, rr) {

        function normalizeArray(list) {

            var res = [];
            const m = Math.max(...list);
            for (var num of list) {res.push(num / m)}
            return res
        }

        function MedianCanvas(numbers) {

            const colorOrange4 = "#F0801A";
            const colorBlue4 = "#294270";
            const colorBlue3 = "#006CA9";

            const N = numbers.length;

            var cell = Math.floor(200 / N);
            cell = Math.max(...[cell, 2]);
            cell = Math.min(...[cell, 40]);
            const maxHeight = 200;
            const indentAbove = 10;
            const fontSize = 10;

            const fullSizeX = N * cell;
            
            var numSet = [];
            const normArray = normalizeArray(numbers);

            const attrLine = { "stroke": colorBlue3, "stroke-width": cell / 2, "stroke-linecap": "round" };
            const attrText = { "stroke": colorBlue4, "font-size": fontSize, "font-family": "Verdana" };

            const animationTime = 800;
            const delay = 240;

            this.createCanvas = function (dom) {
                const paper = Raphael(dom, fullSizeX, maxHeight + 25 + indentAbove);
                for (var i = 0; i < N; i++) {
                    var tempSet = paper.set();
                    tempSet.push(paper
                        .path(Raphael.format("M{0},{1}V{2}", i * cell + cell / 2, maxHeight + indentAbove, maxHeight * (1 - normArray[i]) + indentAbove))
                        .attr(attrLine));
                    tempSet.n = numbers[i];
                    tempSet.prevPos = i;
                    tempSet.push(paper.text(i * cell + cell/2, maxHeight + 15 + indentAbove, numbers[i]).attr(attrText));
                    numSet.push(tempSet);
                }
            };
            this.animateCanvas = function () {
                numSet.sort(function (a, b) { return a.n - b.n });
                setTimeout(function () {
                    for (var i = 0; i < N; i++) {
                        var diff = i - numSet[i].prevPos;
                        numSet[i].animate({ "transform": "t" + (diff * cell) + ",0" }, animationTime);
                    }
                }, delay);
                setTimeout(function () {
                    numSet[Math.floor(N / 2)].animate({ "stroke": colorOrange4, "fill": colorOrange4 }, animationTime / 2);
                    if (N % 2 == 0) {
                        numSet[Math.floor(N / 2) - 1].animate({ "stroke": colorOrange4, "fill": colorOrange4 }, animationTime / 2);
                    }
                }, delay + animationTime);
            };
        }
        new extIO({
            animation: function ($expl, data) {
                var canvas = new MedianCanvas(data.in[0]);
                canvas.createCanvas($expl[0]);
                canvas.animateCanvas();
            },
        }).start()
    }
);