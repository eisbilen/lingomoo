var dataObject = [];
var dataObject2 = [];
var dataFinal = [];
var url_list = [];
var img_list = [];

var ws_question_list = [];
let cardContainer;
var filename_answer = ' ';
var count = 0;
userAnswerGLOBAL = 0;

var dbref = firebase.database().ref("/questions_cat/VERB").orderByKey();
const cursor = new Cursor(dbref, 9);

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(document).ready(function () {
  $("#max-alert").hide();
  $(".btn-group :input").change(function () {
      console.log(this); // points to the clicked input button
  });
});

let createTaskCard = (correct_answer, article_url, url, fl) => {
    let card_flip = document.createElement('div')
    card_flip.className = 'card';

    let card_body = document.createElement('div')
    card_body.className = "card-body";

    let card_front = document.createElement('div')
    card_front.className = 'card-img-top';

    let cardImage_back = document.createElement('img');
    cardImage_back.className = "card-img-top"
    cardImage_back.src = '';
    cardImage_back.id = "card-back"

    let cardImage_front = document.createElement('img');
    cardImage_front.className = "card-img-top"
    cardImage_front.src = url

    url_list.push(url)

    cardImage_front.id = fl

    let correct_img = document.createElement('img');
    correct_img.className = "correct-img"
    correct_img.src = "assets/img/correct.png"

    let wrong_img = document.createElement('img');
    wrong_img.className = "wrong-img"
    wrong_img.src = "assets/img/wrong.png"


    let butt_link = document.createElement("a");
    butt_link.innerText = ""
    butt_link.className = "url btn btn-warning btn-sm bx bx-book-add";
    butt_link.id = "article_url" + count.toString();

    var attr1 = document.createAttribute("data-toggle")
    attr1.value = "tooltip"

    var attr2 = document.createAttribute("data-placement")
    attr2.value = "top"

    var attr3 = document.createAttribute("title")
    attr3.value = "Add This Question Into Your Worksheet"

    var attr4 = document.createAttribute("worksheet-url")
    attr4.value = url

    butt_link.setAttributeNode(attr1)
    butt_link.setAttributeNode(attr2)
    butt_link.setAttributeNode(attr3)
    butt_link.setAttributeNode(attr4)

    butt_link.onclick = function () {
        let qc = Number($('#ws-question-count').text())
        if (qc >= 24) {
            $("#max-alert").fadeTo(2000, 50).slideUp(50, function () {
                $("#max-alert").slideUp(50);
            });
            console.log("Max 24")
        }
        else{
        addQuestionToWS(url, fl, correct_answer, parseInt($('#ws-question-count').html(), 10))
        
        }
    }

    $('#article_url' + (count - 1).toString()).tooltip('enable');

    count = count + 1;

    card_flip.appendChild(card_front)
    card_front.appendChild(cardImage_front)

    card_front.appendChild(butt_link)
    card_front.appendChild(correct_img)
    card_front.appendChild(wrong_img)
    cardContainer.appendChild(card_flip);
}

initListOfTasks(1,cursor);
