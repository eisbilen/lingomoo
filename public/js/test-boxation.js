const MAX_WORD_COUNT = 23

current_answer = 0
size_multiply = 14

var max_sentence_length
var player_score = 0
var words_shuffled = new Array(MAX_WORD_COUNT);
var words_in_order = new Array(MAX_WORD_COUNT);

bar = document.getElementById("bar");
bar2 = document.getElementById("bar2");

function clear_svg_items() {
    for (let i = 0; i < MAX_WORD_COUNT; i++) {
        var parent = document.getElementById("boxes2");
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
        var parent = document.getElementById("answers2");
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
    }
}

function boxation(word_count) {

    assign_words_shuffled(word_count)
    shuffle(words_shuffled, word_count)

    check_buttons();
    clear_svg_items();

    bar.setAttributeNS(null, "width", 10 * (question_number + 1) + '%');
    bar2.setAttributeNS(null, "width", (10 * (question_number + 1) - 5) + '%');

    for (let i = 0; i < MAX_WORD_COUNT; i++) {

        if (i <= word_count) {

            svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            // set width and height

            //svg1 =document.getElementById("question" + i.toString());
            svg1.setAttribute("width", calculate_width(words_shuffled[i]) + 4);
            svg1.setAttribute("height", "40");
            svg1.setAttribute("fill", "none");
            svg1.setAttribute("id", 'question' + i.toString());
            svg1.setAttribute("visibility", "visible");
            svg1.setAttribute("xmlns", "http://www.w3.org/2000/svg");

            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttributeNS(null, 'x', 2);
            rect.setAttributeNS(null, 'y', 2);
            rect.setAttributeNS(null, 'height', '36');
            rect.setAttributeNS(null, 'width', calculate_width(words_shuffled[i]));
            rect.setAttributeNS(null, 'fill', 'white');
            rect.setAttributeNS(null, 'stroke', '#E8E8E8');
            rect.setAttributeNS(null, 'stroke-width', '2');
            rect.setAttributeNS(null, 'id', 'rect_' + i.toString());
            rect.setAttributeNS(null, 'rx', '5');
            rect.setAttributeNS(null, 'class', "svg-rect");
            rect.onclick = function () {
                moveSVG2(i);
            };
            svg1.appendChild(rect);

            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttributeNS(null, 'x', 5);
            text.setAttributeNS(null, 'y', 25);
            text.setAttributeNS(null, 'class', "svg-text");
            text.setAttributeNS(null, 'id', 'text_' + i.toString());
            text.textContent = words_shuffled[i]
            text.onclick = function () {
                moveSVG2(i);
            };
            svg1.appendChild(text);

            document.getElementById("boxes2").appendChild(svg1);
        }
    }
}

function calculate_width(word) {
    return (word.length * size_multiply + 7);
}

function assign_words_shuffled(word_count) {
    for (let i = 0; i < MAX_WORD_COUNT; i++) {
        if (i <= word_count) {
            words_in_order[i] = json_val[question_number].linguistic_features[i.toString()].word;
            words_shuffled[i] = json_val[question_number].linguistic_features[i.toString()].word;
        } else {
            words_shuffled[i] = "";
        }
    }
}

function moveSVG2(obj_id) {
    rect = document.getElementById("rect_" + obj_id.toString())
    text = document.getElementById("text_" + obj_id.toString())
    svg = document.getElementById("question" + obj_id.toString())

    
    text.onclick = function () {};
    rect.onclick = function () {};
    rect.setAttributeNS(null, 'class', "");

    rect.setAttributeNS(null, 'fill', '#E8E8E8');
    text.textContent = ""

    svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg1.setAttribute("width", calculate_width(words_shuffled[obj_id]));
    svg1.setAttribute("height", "40");
    svg1.setAttribute("fill", "none");
    svg1.setAttribute("id", 'answer' + obj_id.toString());
    svg1.setAttribute("visibility", "visible");
    svg1.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttributeNS(null, 'x', 5);
    text.setAttributeNS(null, 'y', 25);
    text.setAttributeNS(null, 'class', "svg-text-answer");
    text.setAttributeNS(null, 'id', 'text__' + obj_id.toString());
    text.textContent = words_shuffled[obj_id]
    text.onclick = function () {
        movebackSVG2(obj_id);
    };
    svg1.appendChild(text);

    document.getElementById("answers2").appendChild(svg1);
    current_answer += 1;
    check_buttons()
}

function movebackSVG2(obj_id) {
    var element = document.getElementById('answer' + obj_id.toString());
    element.parentNode.removeChild(element);

    rect = document.getElementById("rect_" + obj_id.toString())
    text = document.getElementById("text_" + obj_id.toString())

    rect.onclick = function () {
        moveSVG2(obj_id);
    };
    text.onclick = function () {
        moveSVG2(obj_id);
    };
    
    rect.setAttributeNS(null, 'class', "svg-rect");

    rect.setAttributeNS(null, 'fill', 'white');
    text.textContent = words_shuffled[obj_id]
    current_answer -= 1;
    check_buttons()
}

function check_buttons() {
    if (current_answer - 1 == word_count) {
        $('#button_check_your_answer').prop('disabled', false)
        $('#button_skip_question').prop('disabled', true)
    } else {
        $('#button_check_your_answer').prop('disabled', true)
        $('#button_skip_question').prop('disabled', false)
    }
}

function shuffle(array, word_count) {
    for (let i = word_count; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkAnswer() {
    $("#footer").removeClass("correct");
    $("#footer").removeClass("wrong");

    if (question_type == "put_it_order") {
        fail = 0
        var answers = document.querySelectorAll(".svg-text-answer");
        for (var i = 0; i < answers.length; i++) {
            if (answers[i].innerHTML != words_in_order[i]) {
                fail += 1;
            }
        }

        if (fail == 0) {
            player_score += json_val[question_number - 1].difficulty_score
            console.log(player_score)
            playSound(1);
            $("#footer").addClass("correct");
            
            createNextButton(1)
        } else {

            playSound(0);
            $("#footer").addClass("wrong");
            createNextButton(0)
            $("#correctAnswer").html(json_val[question_number - 1].sentence);

            
        //for (var i = 0; i < answers.length; i++) {
        //        rect = document.getElementById("rect_" + i.toString())
        //        text = document.getElementById("text_" + i.toString())
        //        text.textContent = words_in_order[i];
        //        rect.setAttributeNS(null, 'fill', '#00FF8C');
        //    }

        }
    }


    if (question_type == "missing_word") {
        fail = 0

        rect = document.getElementById("rect_" + missing_word_location.toString())
        text = document.getElementById("text_" + missing_word_location.toString())
        rect.setAttributeNS(null, 'fill', '#00FF8C');
        text.textContent=json_val[question_number-1].missing_word

        btn1_value = document.getElementById("button01").getAttribute("aria-pressed");
        btn2_value = document.getElementById("button02").getAttribute("aria-pressed");
        btn3_value = document.getElementById("button03").getAttribute("aria-pressed");

        btn1_text = document.getElementById("button01").innerHTML;
        btn2_text = document.getElementById("button02").innerHTML;
        btn3_text = document.getElementById("button03").innerHTML;

        if (btn1_value == "true" && btn1_text != json_val[question_number - 1].missing_word) {
            fail = 1
        }

        if (btn2_value == "true" && btn2_text != json_val[question_number - 1].missing_word) {
            fail = 1
        }
        if (btn3_value == "true" && btn3_text != json_val[question_number - 1].missing_word) {
            fail = 1
        }

        if (fail == 0) {

            player_score += json_val[question_number - 1].difficulty_score
            console.log(player_score)
            playSound(1);
            $("#footer").addClass("correct");
            createNextButton(1)
        } else {
            /// document.getElementById("check_resultBody").innerHTML= "Correct Answer: " + json_val[question_number-1].missing_word
            playSound(0);
            $("#footer").addClass("wrong");
            createNextButton(0)
        }
    }
    console.log(question_number)
    console.log(json_val[question_number])
    current_answer = 0
}

function createNextButton(success) {
    console.log("create next button")

    for (let i = 0; i < MAX_WORD_COUNT; i++) {
        if (document.getElementById('text__' + i.toString())) {
            text = document.getElementById('text__' + i.toString())
            text.onclick = function () {};
            text.setAttributeNS(null, 'class', "svg-text-after-answer");
        }
    }
    $('#button01').prop('disabled', true);
    $('#button02').prop('disabled', true);
    $('#button03').prop('disabled', true);

    var btn = document.createElement("BUTTON"); // Create a <button> element

    if (question_number == 7) {
        btn.innerHTML = "Complete";
    } else {
        btn.innerHTML = "Next";
    }

    if (success == 1) {
        btn.setAttribute("class", "btn btn-success");
        var img = document.createElement('img');
        img.src = '/img/correct.svg';
        img.id = 'correct_wrong_icon';
        document.getElementById('div_skip_question').appendChild(img);
    } else {
        btn.setAttribute("class", "btn btn-danger");
        var img = document.createElement('img');
        img.src = '/img/wrong.svg';
        img.id = 'correct_wrong_icon';
        document.getElementById('div_skip_question').appendChild(img);
    }

    btn.setAttribute("type", "button");
    btn.setAttribute("id", "button_next_question");
    btn.onclick = function () {
        skipQuestion()
    };
    document.getElementById("div_check_next").appendChild(btn);

    $("#button_check_your_answer").remove();
    $("#button_skip_question").remove();
}

function createCheckButton() {
    var btn = document.createElement("BUTTON"); // Create a <button> element
    btn.innerHTML = "Check";
    btn.setAttribute("class", "btn btn-warning");
    btn.setAttribute("type", "button");
    btn.setAttribute("id", "button_check_your_answer");
    btn.onclick = function () {
        checkAnswer()
    };
    document.getElementById("div_check_next").appendChild(btn);

    if (question_number <= 6) {
        var btn = document.createElement("BUTTON"); // Create a <button> element
        btn.innerHTML = "Skip";
        btn.setAttribute("class", "btn btn-warning");
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "button_skip_question");
        btn.onclick = function () {
            skipQuestion()
        };
        document.getElementById("div_skip_question").appendChild(btn);
    }

    $('#button_check_your_answer').prop('disabled', true)
    $("#button_next_question").remove();
    $("#correct_wrong_icon").remove();
}

function playSound(option) {
    if (option == 1) {
        document.getElementById('play_correct').play();
    }
    if (option == 0) {
        document.getElementById('play_wrong').play();
    }
    if (option == 2) {
        document.getElementById('play_move_svg').play();
    }
    if (option == 3) {
        document.getElementById('play_move_svg_back').play();
    }
}