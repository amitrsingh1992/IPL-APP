function allnumeric(inputtxt) {
    var numbers = /^[0-9]+$/;
    var flag = false;
    if (inputtxt.value.match(numbers)) {
        alert('Your Registration has successfully accepted....you will be redirected to login page now!');
        // document.form1.text1.focus();
        window.location.href="login.html";
         return true;
    } else {
        alert('Please input numeric characters only');
        document.form1.text1.focus();
        return false;
    }
}
