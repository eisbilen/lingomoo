function mDown(obj, button) 
{
    if (button == "1")
    {
        obj.setAttribute('src', '/img/check_your_answer_down.svg');
    }
    if (button == "2")
    {
        obj.setAttribute('src', '/img/next_question_down.svg');
    } 
    console.log("mouse down")
}

function mUp(obj, button) 
{
    if (button == "1")
    {
        window.addEventListener('mouseup', function(event)
        {
            console.log("mouse up");
            document.getElementById("btn_check_your_answer").setAttribute('src', '/img/check_your_answer_up.svg');
        })
    }
    if (button == "2")
    {
        window.addEventListener('mouseup', function(event)
        {   
            console.log("mouse up");
            document.getElementById("btn_next_question").setAttribute( 'src', '/img/next_question_up.svg');
        })
    }
}




  




