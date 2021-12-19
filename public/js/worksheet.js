//var dataObject = [];
//var dataObject2 = [];
//var dataFinal = [];
//var url_list = [];
//var img_list = [];

//var ws_question_list = [];
//let cardContainer;
//var filename_answer = ' ';
//var count = 0;
//userAnswerGLOBAL = 0;

///////////// Define Global Const ///////////////
let userAnswerGLOBAL = 0;
let totalQuestionCount = 0;
let countCorrectAnswer = 0;
let countWrongAnswer = 0;
let cardData = {}
//////////////////////////////////////////////////
var dbref = firebase.database().ref("/questions_cat/VERB").orderByKey();
const cursor = new Cursor(dbref, 9);
//////////////////////////////////////////////////


$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(document).ready(function () {
  $("#max-alert").hide();
  $(".btn-group :input").change(function () {
      console.log(this); // points to the clicked input button
  });
});

