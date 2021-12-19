///////////// Define Global Const ///////////////
let userAnswerGLOBAL = 0;
let totalQuestionCount = 0;
let countCorrectAnswer = 0;
let countWrongAnswer = 0;
let cardData = {}
//////////////////////////////////////////////////

///////////// Get the URL Parameters /////////////
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const fields = params["worksheetName"].split("&");
const key = fields["0"];
const WSname = fields["1"].split("=")[1];
const tag1 = fields["2"].split("=")[1];
const tag2 = fields["3"].split("=")[1];

let dbref = firebase.database().ref("/worksheets/" + key).orderByKey();
let cursor = new Cursor(dbref, 4);
//////////////////////////////////////////////////

///////////// Insert Worksheet Title /////////////
const studyViewPageWTData = new UIData();
const studyViewPageWorksheetTitleData = new WorksheetTitleData();
 
studyViewPageWTData.setStrategy(studyViewPageWorksheetTitleData)
UIDisplayWorksheetTitle.worksheetTitle = studyViewPageWTData.getWorksheetTitleData();
UIDisplayWorksheetTitle.insertWorksheetTitle();
//////////////////////////////////////////////////

///////////////// Insert Progress Bar ///////////
const studyViewPagePBData = new UIData();
const studyViewPageProgressBarData = new ProgressBarData();

studyViewPagePBData.setStrategy(studyViewPageProgressBarData)
UIDisplayProgressBar.progressBar = {percentageCorrectAnswer: 0,
    percentageWrongAnswer: 0,
    countCorrectAnswer : 0,
    countWrongAnswer: 0,
    totalQuestionCount: 0,
    HTMLContainerIDProgressbar: 'progress-bar'
}
UIDisplayProgressBar.insertProgressBar();
////////////////////////////////////////////////

increaseWorksheetViewCount(key);


///////////////// Insert Question Cards ///////////
const cardUiData = new UIData();
const questionCardData = new QuestionCardData();
cardUiData.setStrategy(questionCardData)
//cardUiData.getDataWithPagination(cursor,'next').then(result => {cardUiData.createCards(result)});
cardUiData.getData("/worksheets/", key).then(result => {cardUiData.createCards(result)});
////////////////////////////////////////////////

///////////////// Insert Pagination ///////////
//const studyViewPagePData = new UIData();
//const studyViewPagePaginationData = new PaginationData();
//studyViewPagePData.setStrategy(studyViewPagePaginationData)
//UIDisplayPagination.pagination = {  HTMLButtonClassPreviousButton: "btn btn-primary",
//                                    HTMLButtonClassNextButton: "btn btn-primary",
//                                    HTMLContainerIDPagination: "pagination",
//                                    paginationCursor: cursor,
//                                    paginationDatabaseRef: dbref,
//                                    paginationPageSize: 30,
//                                    paginationTotalCount: 0,
//                                  }
//getTotalCount("/worksheets/", key).then((result) => {UIDisplayPagination.paginationTotalCount = Object.keys(result).length})
//UIDisplayPagination.insertPagination();
//UIDisplayPagination.updatePaginationButtons();
////////////////////////////////////////////////

//displayWorksheetProgress();

      //let intToletter = "";
      //if (result["user_answer"] == 0) {
      //  intToletter = "A";
     // }
     // if (result["user_answer"] == 1) {
     //   intToletter = "B";
     // }
     // if (result["user_answer"] == 2) {
     //   intToletter = "C";
     // }
     // if (result["user_answer"] == 3) {
      //  intToletter = "D";
     // }

      //let data_info = document.createElement("div");
      //data_info.className = "date-on-card";
      //data_info.innerHTML =
      //  "Your Answer - " +
      //  intToletter +
      //  "<br>" +
      //  "Studied at " +
      //  dataFinal[i][1]["date"];
      //card_front.appendChild(data_info);