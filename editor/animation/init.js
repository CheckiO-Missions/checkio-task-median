//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }
            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + ext.JSON.encode(data.in) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var checkioInput = data.in;
            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + ext.JSON.encode(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + ext.JSON.encode(checkioInput) + ')');
                $content.find('.answer').html('Right result:&nbsp;' + ext.JSON.encode(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + ext.JSON.encode(checkioInput) + ')');
                $content.find('.answer').remove();
            }

            var canvas = new MedianCanvas($content.find(".explanation")[0], checkioInput);
            canvas.createCanvas();
            canvas.animateCanvas();

            this_e.setAnimationHeight($content.height() + 60);

        });

        function normalizeArray(list) {
            var res = [];
            var m = Math.max.apply(Math, list);
            for (var i = 0; i < list.length; i++) {
                res.push(list[i] / m);
            }
            return res;
        }

        function MedianCanvas(dom, numbers) {
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

            var cell = 30;
            var maxHeight = 200;
            var fontSize = 15;

            var N = numbers.length;
            var paper = Raphael(dom, (N - 1) * cell, maxHeight + fontSize * 2, 0, 0);
            var numSet = [];

            var attrLine = {"stroke": colorBlue3, "stroke-width": cell / 2, "stroke-linecap": "round"};
            var attrText = {"stroke": colorBlue4, "font-size": fontSize, "font-family": "Verdana"};
            var animationTime = 1000;
            var delay = 300;

            this.createCanvas = function () {
                var normArray = normalizeArray(numbers);
                for (var i = 0; i < N; i++) {
                    var tempSet = paper.set();
                    tempSet.push(paper.path(format(
                        "M{0},{1}V{2}",
                        i * cell,
                        maxHeight,
                        maxHeight * (1 - normArray[i])
                    )).attr(attrLine));
                    tempSet.n = numbers[i];
                    tempSet.prevPos = i;
                    tempSet.push(paper.text(i * cell, maxHeight + fontSize, numbers[i]).attr(attrText));
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
                setTimeout(function() {
                    numSet[Math.floor(N / 2)].animate({"stroke": colorOrange4, "fill": colorOrange4}, animationTime / 2);
                    if (N % 2 == 0) {
                        numSet[Math.floor(N / 2) - 1].animate({"stroke": colorOrange4, "fill": colorOrange4}, animationTime / 2);
                    }
                }, delay + animationTime);

            }
        }


    }
);
