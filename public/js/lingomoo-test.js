  var question_number = 0;
  var delete_options = 0;
  var json_val = [];
  var lesson_type
  var lesson_level
  var lesson_no
  var uid
  var previous_score

  var user_progress = [];

  const preObject = document.getElementById('question');

  function read_from_firebase(callback) {
    var dbrefObject = firebase.database().ref(lesson_type + '/level' + lesson_level + '/' + lesson_no + '/');
    dbrefObject.on('value', snap => {
      json_val.push(snap.val());
      callback();
    }, function (error) {
      console.error(error);
    });
  }

  function confirm_firebase_load() {
    console.log("Sorular Eklendi")
    console.log(json_val)
    //console.log(json_val['0'].simple_test)
    json_val = json_val['0']
    console.log(json_val)
    skipQuestion();
  }

  function skipQuestion() {

    $("#footer").removeClass("correct");
    $("#footer").removeClass("wrong");
    $("#button_check_your_answer").remove();
    $("#button_skip_question").remove();
    $("#correctAnswer").html("");

    if (question_number == 7) {
      $("#test-content").remove();
      $("#correct_wrong_icon").remove();

      
      btn = document.getElementById("button_next_question")
      if (btn==null){
      var btn = document.createElement("BUTTON");  
      btn.setAttribute("type", "button");
      btn.setAttribute("id", "button_next_question");
      
      document.getElementById("div_check_next").appendChild(btn);
      }
      btn = document.getElementById("button_next_question")
      btn.setAttribute("class", "btn btn-success");
      btn.innerHTML = "Continue"
      btn.onclick = function () {
        redirect()
      };

      lesson_no = Number(lesson_no) + 1
      console.log(lesson_no)


      firebase.database().ref('users/' + uid + '/' + lesson_type + '_lesson_no').set(lesson_no)

      console.log(Math.round(player_score))
      console.log(previous_score)
      firebase.database().ref('users/' + uid + '/' + 'straw_bale_points').set(Math.round(player_score)+previous_score)
      

          var img = document.createElement('img'); img.src = '/img/celebration.svg'; img.id = 'celebration_icon'; document.getElementById('celeb_icon').appendChild(img);

          var h5 = document.createElement('h5');
          var t = document.createTextNode("You've completed the lesson!"); // Create a text node
          h5.appendChild(t); h5.id = 'h5_celebration'; h5.setAttribute('class', "text-warning my-2"); document.getElementById('celeb_icon').appendChild(h5);

          var h8 = document.createElement('h8');
          var t = document.createTextNode("You've earned " + Math.round(player_score).toString() + " straw-bale points!"); // Create a text node
          h8.appendChild(t); h8.id = 'h5_celebration'; h8.setAttribute('class', "text-warning my-4"); document.getElementById('celeb_icon').appendChild(h8);

          var img = document.createElement('img'); img.src = ''; img.id = 'hay-bale-icon'; document.getElementById('celeb_icon').appendChild(img);

          return
        }

        question_type = json_val[question_number].question_type
        word_count = (parseInt(json_val[question_number].sentence_length)) - 1

        if (delete_options == 1) {
          remove_options()
          delete_options = 0
        }

        if (question_type == "put_it_order") {
          preObject.textContent = "Put the words in correct order"
          boxation(word_count)

          $('#button_check_your_answer').prop('disabled', true)
          $('#button_skip_question').prop('disabled', false)
        }
        if (question_type == "missing_word") {
          delete_options = 1
          preObject.textContent = "Find the missing word"
          boxation_missing_word(word_count)

          $('#button_check_your_answer').prop('disabled', true)
          $('#button_skip_question').prop('disabled', false)
        }

        createCheckButton()
        question_number = question_number + 1
      } 

      $(document).ready(function () {
        console.log("document loaded");

        var queryString = window.location.search;
        console.log(queryString);
        var urlParams = new URLSearchParams(queryString);
        lesson_type = urlParams.get('type')
        lesson_level = urlParams.get('level')
        lesson_no = urlParams.get('lesson')

        console.log(lesson_type);
        console.log(lesson_level);
        console.log(lesson_no);

        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            console.log(user)
            uid=user.uid
            user_redirect(user.uid)
          } else {
            redirect()
          }
        });
        read_from_firebase(confirm_firebase_load);
      });

      function user_redirect(uid) {

        firebase.database().ref('users/' + uid + '/').once("value", snapshot => {
          if (snapshot.exists()) {
            user_progress.push(snapshot.val());
            console.log("User exists!");

            console.log(lesson_type);
            console.log(lesson_no);
            console.log(lesson_level);
            console.log(user_progress[0]);
            console.log(user_progress[0][lesson_type + '_level']);
            console.log(user_progress[0][lesson_type + '_lesson_no']);

            previous_score=parseInt(user_progress[0]['straw_bale_points'])
            console.log(previous_score)
           

            if ((user_progress[0][lesson_type + '_level'] == lesson_level) && (user_progress[0][lesson_type + '_lesson_no'] == lesson_no)) {
              console.log("ok to proceed")
              return
            } else {
              redirect()
            }
          }
        });
      }

      function redirect() {
        var myUrlWithParams = new URL("https://lingomoo.firebaseapp.com");
        window.location.href = myUrlWithParams;
      }