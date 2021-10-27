var mymydata

function saveTextAsFile() {
    k = 0
    var test_content = {};
    var questions = []
    test_content.simple_test = questions;
    // Get a reference to the database service
    var database = firebase.database();

    for (let i = 0; i < mymydata.length; i++) {
        var h_sentence = document.getElementById('h' + i.toString()).innerText

        var sel_write = document.getElementById('s1' + i.toString());
        var sel_write_value = sel_write.options[sel_write.selectedIndex].value;

        var sel_question_type = document.getElementById('s0' + i.toString());
        var sel_question_type_value = sel_question_type.options[sel_question_type.selectedIndex].value;

        if (sel_write_value == 1) {
            var questions = {
                "sentence": h_sentence,
                "question_type": sel_question_type_value,
                "difficulty_score": mymydata[i].difficulty_score,
                "sentence_length": mymydata[i].sentence_length,
                "missing_word": mymydata[i].missing_word,
                "option1": mymydata[i].option1,
                "option2": mymydata[i].option2,
                "linguistic_features": mymydata[i].linguistic_features
            }
            firebase.database().ref($('#selectLessonType').val() + '/' + $('#selectLessonLevel').val() + '/' + $('#selectLessonNo').val() + '/' + k.toString()).set({
                "sentence": questions.sentence,
                "question_type": questions.question_type,
                "difficulty_score": questions.difficulty_score,
                "sentence_length": questions.sentence_length,
                "missing_word": questions.missing_word,
                "option1": questions.option1,
                "option2": questions.option2,
                "linguistic_features": questions.linguistic_features
            });
            test_content.simple_test.push(questions)
            k += 1
        }
    }

    var textToWrite = JSON.stringify(test_content);
    var textFileAsBlob = new Blob([textToWrite], {
        type: 'text/plain'
    });
    var fileNameToSaveAs = "data.json";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";

    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//usage:
readTextFile("/json/simple_sentences.json", function (text) {
    var mydata = JSON.parse(text);
    mymydata = mydata
    console.log(mydata.length)
    for (let i = 0; i < mydata.length; i++) {
        console.log(i)
        // row
        var div_row = document.createElement('div');
        div_row.setAttribute('class', 'row my-5 border');
        div_row.setAttribute('id', 'r' + i.toString());
        document.getElementById("list").appendChild(div_row);

        // sentence col
        var div_column_0 = document.createElement('div');
        div_column_0.setAttribute('class', 'col-6');
        div_column_0.setAttribute('id', 'c0' + i.toString());
        document.getElementById('r' + i.toString()).appendChild(div_column_0);

        //sentence h
        var h = document.createElement("h7"); // Create the H1 element 
        var t = document.createTextNode(mydata[i].sentence); // Create a text element 
        h.setAttribute('id', 'h' + i.toString());
        h.appendChild(t); // Append the text node to the H1 element 
        document.getElementById('c0' + i.toString()).appendChild(h);

        // question type col
        var div_column_1 = document.createElement('div');
        div_column_1.setAttribute('class', 'col-2');
        div_column_1.setAttribute('id', 'c1' + i.toString());
        document.getElementById('r' + i.toString()).appendChild(div_column_1);

        // question type select
        var select = document.createElement('select');
        select.setAttribute('class', '');
        select.setAttribute('id', 's0' + i.toString());
        document.getElementById('c1' + i.toString()).appendChild(select);

        // option 1
        var option1 = document.createElement('option');
        var t1 = document.createTextNode("Put it order");
        option1.appendChild(t1);
        option1.setAttribute('value', 'put_it_order');
        document.getElementById('s0' + i.toString()).appendChild(option1);

        // option 2
        var option2 = document.createElement('option');
        var t2 = document.createTextNode("Missing word");
        option2.appendChild(t2);
        option2.setAttribute('value', 'missing_word');
        document.getElementById('s0' + i.toString()).appendChild(option2);

        // option 3
        var option3 = document.createElement('option');
        var t3 = document.createTextNode("Same meaning");
        option3.appendChild(t3);
        option3.setAttribute('value', 'same_meaning');
        document.getElementById('s0' + i.toString()).appendChild(option3);

        // write question col
        var div_column_2 = document.createElement('div');
        div_column_2.setAttribute('class', 'col-2');
        div_column_2.setAttribute('id', 'c2' + i.toString());
        document.getElementById('r' + i.toString()).appendChild(div_column_2);

        // question type select
        var select = document.createElement('select');
        select.setAttribute('class', '');
        select.setAttribute('id', 's1' + i.toString());
        document.getElementById('c2' + i.toString()).appendChild(select);

        // write option 1
        var option1 = document.createElement('option');
        var t1 = document.createTextNode("Dont write");
        option1.appendChild(t1);
        option1.setAttribute('value', '0');
        document.getElementById('s1' + i.toString()).appendChild(option1);

        // write option 2
        var option2 = document.createElement('option');
        var t2 = document.createTextNode("Write");
        option2.appendChild(t2);
        option2.setAttribute('value', '1');
        document.getElementById('s1' + i.toString()).appendChild(option2);

        //console.log(mydata[i].sentence);

        // missing_word question col
        var div_column_3 = document.createElement('div');
        div_column_3.setAttribute('class', 'col-2');
        div_column_3.setAttribute('id', 'c3' + i.toString());
        document.getElementById('r' + i.toString()).appendChild(div_column_3);

        //missing_word h
        var h = document.createElement("h7"); // Create the h7 element 
        var t = document.createTextNode(mydata[i].missing_word); // Create a text element 
        h.setAttribute('id', 'h' + i.toString());
        h.appendChild(t); // Append the text node to the H1 element 
        document.getElementById('c3' + i.toString()).appendChild(h);


        // option1 question col
        var div_column_4 = document.createElement('div');
        div_column_4.setAttribute('class', 'col-2');
        div_column_4.setAttribute('id', 'c4' + i.toString());
        document.getElementById('r' + i.toString()).appendChild(div_column_4);

        //option1 h
        var h = document.createElement("h7"); // Create the h7 element 
        var t = document.createTextNode(mydata[i].option1); // Create a text element 
        h.setAttribute('id', 'h' + i.toString());
        h.appendChild(t); // Append the text node to the H1 element 
        document.getElementById('c4' + i.toString()).appendChild(h);

        // option2 question col
        var div_column_5 = document.createElement('div');
        div_column_5.setAttribute('class', 'col-2');
        div_column_5.setAttribute('id', 'c5' + i.toString());
        document.getElementById('r' + i.toString()).appendChild(div_column_5);

        //option1 h
        var h = document.createElement("h7"); // Create the h7 element 
        var t = document.createTextNode(mydata[i].option2); // Create a text element 
        h.setAttribute('id', 'h' + i.toString());
        h.appendChild(t); // Append the text node to the H1 element 
        document.getElementById('c5' + i.toString()).appendChild(h);
    }

});