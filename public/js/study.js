let dbref = firebase.database().ref("/worksheets").orderByKey();
let cursor = new Cursor(dbref, 6);

let cardUiData = new UIData();
const worksheetCardData = new WorksheetCardData();
cardUiData.setStrategy(worksheetCardData)
//cardUiData.getDataWithLimitToLast("/worksheets",8).then(result => {console.log(result); cardUiData.createCards(result)});
cardUiData.getDataWithPagination(cursor,'next').then(result => {console.log(result); cardUiData.createCards(result)});

///////////////// Insert Pagination ///////////
const studyPagePData = new UIData();
const studyPagePaginationData = new PaginationData();
studyPagePData.setStrategy(studyPagePaginationData)
UIDisplayPagination.pagination = {  HTMLButtonClassPreviousButton: "btn btn-primary",
                                    HTMLButtonClassNextButton: "btn btn-primary",
                                    HTMLContainerIDPagination: "pagination",
                                    paginationCursor: cursor,
                                    paginationDatabaseRef: dbref,
                                    paginationPageSize: 3,
                                    paginationTotalCount: 0,
                                  }

getTotalCount("/worksheets", "").then((result) => {
    UIDisplayPagination.paginationTotalCount = Object.keys(result).length;
    UIDisplayPagination.insertPagination();
    UIDisplayPagination.updatePaginationButtons();
})
////////////////////////////////////////////////

