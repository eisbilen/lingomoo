
///////////// Define Global Const ///////////////
let userAnswerGLOBAL = 0;
let totalQuestionCount = 0;
let countCorrectAnswer = 0;
let countWrongAnswer = 0;
let cardData = {}
//////////////////////////////////////////////////
let dbref = firebase.database().ref("/questions_cat/VERB").orderByKey();
let cursor = new Cursor(dbref, 9);
//////////////////////////////////////////////////

///////////////// Insert Question Cards ///////////
const cardUiData = new UIData();
const questionWSCreationCardData = new QuestionWSCreationCardData();
cardUiData.setStrategy(questionWSCreationCardData)
cardUiData.getDataWithPagination(cursor,'next').then(result => {cardUiData.createCards(result)});
//cardUiData.getData("/questions_cat/VERB", '').then(result => {cardUiData.createCards(result)});
////////////////////////////////////////////////

///////////////// Insert Pagination ///////////
const WSCreationPagination = new UIData();
const WSCreationPagePaginationData = new PaginationData();
WSCreationPagination.setStrategy(WSCreationPagePaginationData)
UIDisplayPagination.pagination = {  HTMLButtonClassPreviousButton: "btn btn-primary",
                                    HTMLButtonClassNextButton: "btn btn-primary",
                                    HTMLContainerIDPagination: "pagination",
                                    paginationCursor: cursor,
                                    paginationDatabaseRef: dbref,
                                    paginationPageSize: 1,
                                    paginationTotalCount: 0,
                                    paginationTotalCountDBREF: "/questions_cat/VERB",
                                  }
getTotalCount(UIDisplayPagination.paginationTotalCountDBREF, "").then((result) => {UIDisplayPagination.paginationTotalCount = Object.keys(result).length})
UIDisplayPagination.insertPagination();
UIDisplayPagination.updatePaginationButtons();
////////////////////////////////////////////////

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(document).ready(function () {
  $("#max-alert").hide();
  $(".btn-group :input").change(function () {
      console.log(this); // points to the clicked input button
  });
});

