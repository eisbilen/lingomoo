$(document).ready(function() {
   
});

let cardContainer;
var filename_answer = ' ';


let createTaskCard = (task, url, fl) => {

  
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
    cardImage_front.id = fl


  let butt = document.createElement("a");
  butt.innerText = "Check Answer"
  butt.className = "btn btn-info";
  butt.onclick = function() {
    getAnswer($(this).siblings('.card-img-top').attr('id'), $(this).siblings('.card-img-top'))
};
  
    card_flip.appendChild(card_front)
    card_front.appendChild(cardImage_front)
    
    card_front.appendChild(butt)
    cardContainer.appendChild(card_flip);
}

let initListOfTasks = () => {
    cardContainer = document.getElementById('card-cont');
};

initListOfTasks();


function addAnswer(url) {
  $('#card-cont').children('.card').last().children('.card-img-top').children('#card-back').attr("src", url);
}

function getAnswer(answer_file_name, element) {
  var storage = firebase.storage();
  // Create a reference from a Google Cloud Storage URI     
  var gsReference_answer = storage.refFromURL('gs://lingomoo.appspot.com/images/' + answer_file_name.replace("question", "answer"))

            gsReference_answer.getDownloadURL().then(function(url) {

              element.attr("src", url)

              }).catch(function(error) {
                // Handle any errors
              });
              element.attr("class", "card-img answered")
}

function queryDatabase(dataObject) {
  $('html, body').animate({
    scrollTop: (($('#today').offset().top)-20)
},500);

        $("#card-cont").empty();
        var keys = Object.keys(dataObject);

        var promises_question = [];
        var promises_answer = [];
        
        for (var i = 0; i<keys.length; i++){
            var currentObject = dataObject[keys[i]]

            console.log(currentObject)
            //console.log(currentObject.missing_word_q)
            //console.log(currentObject.correct_order_q)

            if (currentObject.missing_word_q == 1) {
              var filename_question = currentObject.image_file_name.replace(".", "_missing_word_question.");
              filename_answer = currentObject.image_file_name.replace(".", "_missing_word_answer.");
            }
            if (currentObject.correct_order_q == 1) {
              var filename_question = currentObject.image_file_name.replace(".", "_correct_order_question.");
              filename_answer = currentObject.image_file_name.replace(".", "_correct_order_answer.");
            }
            //console.log(filename_question)
            //console.log(filename_answer)


            var storage = firebase.storage();
            // Create a reference from a Google Cloud Storage URI
            var gsReference_question = storage.refFromURL('gs://lingomoo.appspot.com/images/' + filename_question)
            var gsReference_answer = storage.refFromURL('gs://lingomoo.appspot.com/images/' + filename_answer)

            promises_answer.push(gsReference_answer.getDownloadURL());
            promises_question.push(gsReference_question.getDownloadURL());

            (function(fl) {
            gsReference_question.getDownloadURL().then(function(url) {

              createTaskCard(currentObject.sentence, url, fl);

              }).catch(function(error) {
                // Handle any errors
              });
            })(filename_question);


              gsReference_answer.getDownloadURL().then(function(url) {

                addAnswer(url);
  
                }).catch(function(error) {
                  // Handle any errors
                });
        }

        //console.log(promises_answer)
        $('#previous-button').removeClass('disabled')
        $('#next-button').removeClass('disabled')

}


class Cursor {
  constructor(baseRef, pageSize) {
     this.baseRef = baseRef;
     this.lastKey = null;
     this.firstIndex = 0;
     this.lastIndex = 0;
     this.lastRecord= 0;
     this.pageIndex = 0;
     this.firstKey = null;
     this.pageSize = pageSize;
  }
  displayIndex(){
    $('#index-text').text('Page ' + this.pageIndex + "   (" + this.firstIndex.toString() + ' - ' + this.lastIndex.toString() + ")")
  }
  next() {
    let ref = this.baseRef;
    
    if( this.lastKey !== null ) {
       // a previous page has been loaded so get the next one using the previous value/key
       // we have to start from the current cursor so add one to page size
       ref = ref.startAt(this.lastKey).limitToFirst(this.pageSize+1);
       this.firstIndex += this.pageSize 
       this.lastIndex += this.pageSize
       this.pageIndex += 1
       this.displayIndex()
    }
    else {
       // this is the first page
       ref = ref.limitToFirst(this.pageSize);
       this.firstIndex = 1
       this.pageIndex = 1
       this.lastIndex = this.pageSize

       this.displayIndex()
    }
    
    return ref.once('value').then(snap => {
      const keys = [];
      const data = []; // store data in array so it's ordered
      
      snap.forEach(ss => {
         data.push(ss.val());
         keys.push(ss.key);
      });
             
      if( this.lastKey !== null ) {
        // skip the first value, which is actually the cursor
        keys.shift();
        data.shift();
      }

      // store the last loaded record
      if( data.length ) {

        const last = data.length - 1;
        console.log(data.length)
        
        if (data.length < this.pageSize){
        this.lastRecord = 1;
        }

        this.lastKey = keys[last];
        this.firstKey = keys[0];

      }
      console.log(this.firstKey)
      console.log(this.lastKey)
      return data;
    });
  }

  previous() {
    let ref = this.baseRef;

    if( this.lastKey !== null ) {
       // a previous page has been loaded so get the next one using the previous value/key
       // we have to start from the current cursor so add one to page size
       ref = ref.endAt(this.firstKey).limitToLast(this.pageSize+1);
       this.firstIndex -= this.pageSize 
       this.lastIndex -= this.pageSize
       this.pageIndex -= 1
       this.displayIndex();
    }
    else {
       // this is the first page
       ref = ref.limitToFirst(this.pageSize);
    }
    
    return ref.once('value').then(snap => {
      const keys = [];
      const data = []; // store data in array so it's ordered
      
      snap.forEach(ss => {
         data.push(ss.val());
         keys.push(ss.key);
      });
             
      if( this.lastKey !== null ) {
        // remove the last value, which is actually the cursor
        keys.pop();
        data.pop();
        this.lastRecord = 0;
      }

      // store the last loaded record
      if( data.length ) {
        

        const last = data.length - 1;
        this.lastKey = keys[last];
        this.firstKey = keys[0];

      }
      console.log(this.firstKey)
      console.log(this.lastKey)
      return data;
    });
  }

}

var db = firebase.database().ref('/questions/PREPOSITION/').orderByKey();
const cursor = new Cursor(db, 9);

// handle next page requests
$('#next-button').click(e => {
  e.preventDefault();
  console.log("--------next--------")  

  
  if($('#next-button').hasClass('disabled')) {
    return false;
  }

  if (cursor.lastRecord == 0 ){
    $('#next-button').addClass('disabled')
    cursor.next().then(data => queryDatabase(data));
    }

});

// handle previous page requests
$('#previous-button').click(e => {
  e.preventDefault();
  console.log("--------previous--------")
  console.log(cursor.firstIndex)
   
  if($('#previous-button').hasClass('disabled')) {
      return false;
  }

  if (cursor.firstIndex !==1 ){
    $('#previous-button').addClass('disabled')
    cursor.previous().then(data => queryDatabase(data));
  }

});

// load the first page
$('#next-button').click();

