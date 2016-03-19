var xmlhttp = new XMLHttpRequest();
var url = "www.oddsportal.com/set-timezone/39/";

xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    var myArr = JSON.parse(xmlhttp.responseText);
    myFunction(myArr);
  }
};

xmlhttp.open("GET", url, true);
xmlhttp.send();


// var xmlhttp = new XMLHttpRequest();var url = \"www.oddsportal.com/set-timezone/39/\";xmlhttp.onreadystatechange = function() {  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {    var myArr = JSON.parse(xmlhttp.responseText);    myFunction(myArr);  }};xmlhttp.open(\"GET\", url, true);xmlhttp.send();
