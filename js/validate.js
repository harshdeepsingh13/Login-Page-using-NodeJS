function validatePassword(){
    console.log('function called');
    var firstPass = document.getElementById('firstPass');
    var secondPass = document.getElementById('secondPass');

    console.log(firstPass.value + " " + secondPass.value);
    if(firstPass.value.toString() == secondPass. value.toString())
    {
        document.getElementById('validResult').innerHTML="  password valid";
        console.log("true");
        document.getElementById('submit').disabled = false;
    }
    else
    {
        document.getElementById('validResult').innerHTML="  passwords do not match";
        console.log('false');
    }
}