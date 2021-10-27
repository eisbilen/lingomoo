
current_answer = 0
size_multiply = 9.86

var missing_word_location

var max_sentence_length

var words_in_order = new Array(MAX_WORD_COUNT);
var options = new Array(2);

bar=document.getElementById("bar");
bar2=document.getElementById("bar2");


function boxation_missing_word(word_count) 
{
    assign_words(word_count)
    check_buttons();
    write_options();
    clear_svg_items();
    bar.setAttributeNS(null, "width", 10*(question_number+1)+'%');
    bar2.setAttributeNS(null, "width", (10*(question_number+1)-5)+'%');

    for (let i = 0; i < MAX_WORD_COUNT; i++) 
    {

        if (i<=word_count) 
        {
          
            svg1 = document. createElementNS("http://www.w3.org/2000/svg", "svg");
            // set width and height

            //svg1 =document.getElementById("question" + i.toString());
            svg1.setAttribute("width", calculate_width(words_in_order[i])+4);
            svg1.setAttribute("height", "40");
            svg1.setAttribute("fill", "none");
            svg1.setAttribute("id", 'question' + i.toString());
            svg1.setAttribute("visibility", "visible");
            svg1.setAttribute("xmlns", "http://www.w3.org/2000/svg");

            var rect = document.createElementNS("http://www.w3.org/2000/svg","rect"); 
            rect.setAttributeNS(null, 'x', 2);
            rect.setAttributeNS(null, 'y', 2);
            rect.setAttributeNS(null, 'height', '36');
            rect.setAttributeNS(null, 'width', calculate_width(words_in_order[i]));
            rect.setAttributeNS(null, 'fill', 'white');
            rect.setAttributeNS(null, 'stroke', '#E8E8E8');
            rect.setAttributeNS(null, 'stroke-width', '2');
            rect.setAttributeNS(null, 'rx', '5');
            rect.setAttributeNS(null, 'id', 'rect_' + i.toString());
            svg1.appendChild(rect);

            var text = document.createElementNS("http://www.w3.org/2000/svg","text"); 
            text.setAttributeNS(null, 'x', 5);
            text.setAttributeNS(null, 'y', 25);
            text.setAttributeNS(null, 'class', "svg-text-missing-word");
            text.textContent = words_in_order[i]
            text.setAttributeNS(null, 'id', 'text_' + i.toString());
            svg1.appendChild(text);

            if (words_in_order[i]==json_val[question_number].missing_word)
            {
                text.textContent = ""
                rect.setAttributeNS(null, 'fill', '#E8E8E8');
                missing_word_location=i
            }
            else
            {
                text.textContent = words_in_order[i]
            }

            document. getElementById("boxes2").appendChild(svg1);        
        }
    }
}


function calculate_width(word) 
{
    return (word.length*size_multiply+7);
}

function assign_words(word_count) 
{
    for (let i = 0; i < MAX_WORD_COUNT ; i++) {
        if (i<=word_count)
        {
            console.log(i)
            console.log(json_val[question_number].linguistic_features[i.toString()])
            
            words_in_order[i] = json_val[question_number].linguistic_features[i.toString()].word;  
        } 
        else
        {
            words_in_order[i] = "";
        }
    }  
}

function check_buttons()
{
    if (current_answer-1==word_count)
    {
        $('#button_check_your_answer').prop('disabled', false)
        $('#button_skip_question').prop('disabled', true)
    }
    else
    {
        $('#button_check_your_answer').prop('disabled', true)
        $('#button_skip_question').prop('disabled', false)
    }
}

function remove_options() {
    // Removes an element from the document
    var button01 = document.getElementById("button01");
    var button02 = document.getElementById("button02");
    var button03 = document.getElementById("button03");

    if (button01.parentNode!=null) {button01.parentNode.removeChild(button01);}
    if (button02.parentNode!=null) {button02.parentNode.removeChild(button02);}
    if (button03.parentNode!=null) {button03.parentNode.removeChild(button03);}
}

function write_options () 
{
    var btn1 = document.createElement("BUTTON");
    var btn2 = document.createElement("BUTTON");
    var btn3 = document.createElement("BUTTON");

    options[0] = json_val[question_number].missing_word
    options[1] = json_val[question_number].option1
    options[2] = json_val[question_number].option2

    shuffle(options,2)

    var t1 = document.createTextNode(options[0]);
    var t2 = document.createTextNode(options[1]);
    var t3 = document.createTextNode(options[2]);

    btn1.setAttribute("class","btn btn-block btn-outline-warning");
    btn1.setAttribute("type","button");
    btn1.setAttribute("id","button01");
    btn1.setAttribute("data-toggle","button");
    btn1.setAttribute("onclick","option01()");

    btn2.setAttribute("class","btn btn-block btn-outline-warning");
    btn2.setAttribute("type","button");
    btn2.setAttribute("id","button02");
    btn2.setAttribute("data-toggle","button");
    btn2.setAttribute("onclick","option02()");

    btn3.setAttribute("class","btn btn-block btn-outline-warning");
    btn3.setAttribute("type","button");
    btn3.setAttribute("id","button03");
    btn3.setAttribute("data-toggle","button");
    btn3.setAttribute("onclick","option03()");

    btn1.appendChild(t1);
    document.getElementById("write-option1").appendChild(btn1);

    btn2.appendChild(t2);
    document.getElementById("write-option2").appendChild(btn2);
    
    btn3.appendChild(t3);
    document.getElementById("write-option3").appendChild(btn3);
}

function option01() 
{
    change_class()
    document.getElementById("button01").setAttribute("aria-pressed","true");
    document.getElementById("button02").setAttribute("aria-pressed","false");
    document.getElementById("button03").setAttribute("aria-pressed","false");
}
function option02() 
{
    change_class()
    document.getElementById("button01").setAttribute("aria-pressed","false");
    document.getElementById("button02").setAttribute("aria-pressed","true");
    document.getElementById("button03").setAttribute("aria-pressed","false");   
}
function option03() 
{
    change_class()
    document.getElementById("button01").setAttribute("aria-pressed","false");
    document.getElementById("button02").setAttribute("aria-pressed","false");
    document.getElementById("button03").setAttribute("aria-pressed","true");   
}
function change_class() 
{
    $('#button_check_your_answer').prop('disabled', false)
    $('#button_skip_question').prop('disabled', true)

    document.getElementById("button01").setAttribute("class","btn btn-block btn-outline-warning");
    document.getElementById("button02").setAttribute("class","btn btn-block btn-outline-warning");
    document.getElementById("button03").setAttribute("class","btn btn-block btn-outline-warning");
}