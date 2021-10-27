$(document).ready(function() {
   
});

let cardContainer;
var filename_answer = ' ';


let createTaskCard = (task, url, fl) => {

    console.log(fl)
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
  console.log($('#card-cont').children('.card').last().children('.card-img-top').children('#card-back'))
}


function getAnswer(answer_file_name,element) {
  var storage = firebase.storage();
  // Create a reference from a Google Cloud Storage URI     
  var gsReference_answer = storage.refFromURL('gs://lingomoo.appspot.com/images/' + answer_file_name.replace("question", "answer"))

            gsReference_answer.getDownloadURL().then(function(url) {
              console.log(url)

              element.attr("src", url)
              
              

              }).catch(function(error) {
                // Handle any errors
              });
              element.attr("class", "card-img answered")
}

function queryDatabase() {
    firebase.database().ref('/questions/').once('value').then(function(snapshot) {

        var dataObject = snapshot.val();
        var keys = Object.keys(dataObject);

        var promises_question = [];
        var promises_answer = [];
        
        for (var i = 0; i<keys.length; i++){
            var currentObject = dataObject[keys[i]]

            console.log(currentObject.missing_word_q)
            console.log(currentObject.correct_order_q)

            if (currentObject.missing_word_q == 1) {
              var filename_question = currentObject.image_file_name.replace(".", "_missing_word_question.");
              filename_answer = currentObject.image_file_name.replace(".", "_missing_word_answer.");
            }
            if (currentObject.correct_order_q == 1) {
              var filename_question = currentObject.image_file_name.replace(".", "_correct_order_question.");
              filename_answer = currentObject.image_file_name.replace(".", "_correct_order_answer.");
            }
            console.log(filename_question)
            console.log(filename_answer)


            var storage = firebase.storage();
            // Create a reference from a Google Cloud Storage URI
            var gsReference_question = storage.refFromURL('gs://lingomoo.appspot.com/images/' + filename_question)
            var gsReference_answer = storage.refFromURL('gs://lingomoo.appspot.com/images/' + filename_answer)

            promises_answer.push(gsReference_answer.getDownloadURL());
            promises_question.push(gsReference_question.getDownloadURL());

            (function(fl) {
            gsReference_question.getDownloadURL().then(function(url) {
              console.log(url)
              createTaskCard(currentObject.sentence, url, fl);

              }).catch(function(error) {
                // Handle any errors
              });
            })(filename_question);


              gsReference_answer.getDownloadURL().then(function(url) {
                console.log(url)
                addAnswer(url);
  
                }).catch(function(error) {
                  // Handle any errors
                });


        }

        console.log(promises_answer)
      });

}


class Cursor {
  constructor(baseRef, pageSize) {
     this.baseRef = baseRef;
     this.lastKey = null;
     this.lastValue = null;
     this.pageSize = pageSize;
  }
  
  next() {
    let ref = this.baseRef;
    
    if( this.lastValue !== null ) {
       // a previous page has been loaded so get the next one using the previous value/key
       // we have to start from the current cursor so add one to page size
       ref = ref.startAt(this.lastValue, this.lastKey).limitToFirst(this.pageSize+1);
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
             
      if( this.lastValue !== null ) {
        // skip the first value, which is actually the cursor
        keys.shift();
        data.shift();
      }

      // store the last loaded record
      if( data.length ) {
        const last = data.length - 1;
        this.lastKey = keys[last];
        this.lastValue = data[last].author;
      }

      return data;
    });
  }
}


var db = firebase.database().ref('/questions/');
const cursor = new Cursor(db, 5);

// handle next page requests
$('#ebutton').click(e => {
  e.preventDefault();
  console.log("tusa bastim")
  cursor.next().then(data => queryDatabase(data));
});


// load the first page
$('#ebutton').click();

