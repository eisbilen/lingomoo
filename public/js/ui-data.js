/////////////////// DATA ITEMS FOR STUDY-WORKSHEET.HTML ///////////////////
// this object represent the QUESTION cards for WEB UI
function QuestionCardData() {
  
    this.paginationCursor = function () {}
  
    this.getQuestionCount = async function (databaseRef, key) {
      return await getQuestionCount(databaseRef, key)
    }
  
    this.getData = function (databaseRef, key)  {
      return getFirebaseData(databaseRef, key)
    }
    
    this.getDataWithPagination = function (cursor, button)  {
      return getFirebaseDataWithPagination(cursor, button)
    }
    
    this.arrangeData = async function (data) {
      const arrangedData = []
      let questionIndex = 0
  
      for (let key in data) {
        const cardData = {}
        cardData['questionIndex'] = questionIndex
        cardData['questionCorrectAnswer'] = data[key]['correct_answer']
        cardData['questionUserAnswer'] = ""
        cardData['questionArticleUrl'] = data[key]['article_url']
        cardData['questionFileName'] = data[key]['file_name']
        cardData['HTMLContainerIDQuestionCardsTopLevel'] = "question-cards"
        cardData['HTMLImageStyleCross'] = ""
        cardData['HTMLImageStyleTick'] = ""
        cardData['HTMLButtonGroupStyleQuestionOptions'] = ""
        cardData['HTMLButtonStyleCheckQuestionAnswer'] = ""
        cardData['HTMLImageClassQuestionCard'] = "card-img-top"
        arrangedData.push(cardData)
        questionIndex += 1
      }
      totalQuestionCount = questionIndex;
      return arrangedData
    }
    
    this.createCards = async function (result) {
      const storage = firebase.storage();
      const user = firebase.auth().currentUser
      const arrangedData = this.arrangeData(result)
      document.getElementById('question-cards').innerHTML = "";
      arrangedData.then((result) => {result.forEach(async function (cardData, index) {
        const userAnswer = await getAnsweredQuestionData(cardData['questionFileName'], user.uid)
        
        if (userAnswer) {
          const imageDisplay = await setHTMLStyleForTickCross(userAnswer)
          cardData['HTMLImageStyleTick'] = imageDisplay[0]
          cardData['HTMLImageStyleCross'] = imageDisplay[1]
  
          const gsReferenceAnswerImage = storage.refFromURL("gs://lingomoo.appspot.com/images/" + cardData['questionFileName'].replace("question", "answer") + '.jpg');
          cardData['questionImageUrl'] = await gsReferenceAnswerImage.getDownloadURL()
          cardData['HTMLImageClassQuestionCard'] = "card-img answered"
          cardData['HTMLButtonGroupStyleQuestionOptions'] = "display:none;"
          cardData['HTMLButtonStyleCheckQuestionAnswer'] = "display:none;"
        } 
        else {
          const gsReferenceQuestionImage = storage.refFromURL("gs://lingomoo.appspot.com/images/" + cardData['questionFileName']+'.jpg');
          cardData['questionImageUrl'] = await gsReferenceQuestionImage.getDownloadURL();
        }
  
        UIDisplayQuestionCard.card = cardData;
        UIDisplayQuestionCard.insertCard();
        updateTitleAndProcessBar();
        })
      })
    }
}
// this object represent the PROGRESS BAR for WEB UI
function ProgressBarData() {
  
    this.getProgressBarData = function ()  {
      return {percentageCorrectAnswer: Math.round((countCorrectAnswer/totalQuestionCount) * 100),
              percentageWrongAnswer:  Math.round((countWrongAnswer/totalQuestionCount) * 100),
              countCorrectAnswer : countCorrectAnswer,
              countWrongAnswer: countWrongAnswer,
              totalQuestionCount: totalQuestionCount,
              HTMLContainerIDProgressbar: 'progress-bar'
      }
    }
}
// this object represent the WORKSHET TITLE for WEB UI
function WorksheetTitleData() {
  
    this.getWorksheetTitleData = function ()  {
      return {
              worksheetName: WSname,
              worksheetTag1: tag1,
              worksheetTag2: tag2,
              countAnsweredQuestion: UIDisplayProgressBar.countWrongAnswer + UIDisplayProgressBar.countCorrectAnswer,
              totalQuestionCount: UIDisplayProgressBar.totalQuestionCount,
              HTMLContainerIDWorksheetTitle: 'worksheet-title'
      }
    }
}
function PaginationData() {
  
    this.getPaginationData = function ()  {
      return {
              HTMLButtonClassPreviousButton: HTMLButtonClassPreviousButton,
              HTMLButtonClassNextButton: HTMLButtonClassNextButton,
              HTMLContainerIDPagination: HTMLContainerIDPagination,
              paginationCursor: paginationCursor,
              paginationDatabaseRef: paginationDatabaseRef,
              paginationPageSize: paginationPageSize 
      }
    }
}
////////////////////////////////////////////////////////////////////////////

///////////////////// UI DISPLAY ITEMS FOR STUDY.HTML ///////////////
// this is implementation of the strategy pattern for worksheet cards
// it defines how to get and arrange data for worksheet cards
function WorksheetCardData() {
    this.getDataWithLimitToLast = function (databaseRef, limitToLastValue)  {
      return getFirebaseDataWithLimitToLast(databaseRef, limitToLastValue)
    }

    this.getDataWithPagination = function (cursor, button)  {
        return getFirebaseDataWithPagination(cursor, button)
    }
  
    this.arrangeData = function (data) {
      arrangedData = []
      console.log(data)
      document.getElementById('into').innerHTML = "";
      for (let key in data) {
        console.log(key)
        cardData = {}
        cardData['key'] = key;
        cardData['name'] = findWSname(key);
        cardData['dateCreated'] = timeSince(findWSdate(key));
        cardData['creator'] = findWScreator(key);
        cardData['questionCount'] = findWSquestioncount(key);
        cardData['HTMLContainerIDWorksheetCardsTopLevel'] = 'into';
        cardData['tagPrimary'] = findWStag1(key);
        cardData['tagSecondary'] = findWStag2(key);
        arrangedData.push(cardData)
      }
      return arrangedData
    }

    this.createCards = async function (result) {
        await getTotalCount("/worksheets/", "").then((result) => {UIDisplayPagination.paginationTotalCount = Object.keys(result).length})

        const arrangedData = cardUiData.arrangeData(result)        
        arrangedData.forEach(function (cardData, index) {
          UIDisplayWorkSheetCard.card = cardData;
          UIDisplayWorkSheetCard.insertCard();
        });
      }
}
  