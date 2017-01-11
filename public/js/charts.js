"use strict";
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBNJNY1EiImCdjhQqb2bZEHzZo2ralIqdQ",
    authDomain: "oliver-dexterity.firebaseapp.com",
    databaseURL: "https://oliver-dexterity.firebaseio.com",
    storageBucket: "oliver-dexterity.appspot.com",
    messagingSenderId: "576315655284"
};
var allData, girlData, boyData, leftData, rightData, allAverage,
    girlAverage, boyAverage, leftAverage, rightAverage;
firebase.initializeApp(config);

google.charts.load('current', {'packages': ['gauge', 'corechart']});
google.charts.setOnLoadCallback(getData);
function getData() {
    var database = firebase.database();
    var TestResultsRef = database.ref('tests');
    TestResultsRef.on('value', function (dataSnapshot) {
        allData = dataSnapshot.val();
        girlData = filterData(allData, 'sex', 'girl');
        boyData = filterData(allData, 'sex', 'boy');
        leftData = filterData(allData, 'dexterity', 'left');
        rightData = filterData(allData, 'dexterity', 'right');
        allAverage = getAverage(allData);
        girlAverage = getAverage(girlData);
        boyAverage = getAverage(boyData);
        leftAverage = getAverage(leftData);
        rightAverage = getAverage(rightData);
        drawCharts();
        setPersonalInformation();
    });
}

function setPersonalInformation() {
    var dataCount = Object.keys(allData).length;
    var current = document.getElementById('currentCount');
    current.innerHTML = getOrdinal(dataCount);
}
function getOrdinal(n) {
    var s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function drawCharts() {
    var common_options = {legend: {position: "none"}, vAxis: {title: "seconds"}, hAxis: {title: "hand"}};
    var girl_data = google.visualization.arrayToDataTable([
        ['hand', 'speed'],
        ['left', girlAverage[0]],
        ['right', girlAverage[1]]
    ]);
    var girl_options = Object.assign({title: "Girls"}, common_options);
    var girl_chart = new google.visualization.ColumnChart(document.getElementById("girl"));
    girl_chart.draw(girl_data, girl_options);
    var boy_data = google.visualization.arrayToDataTable([
        ['hand', 'speed'],
        ['left', boyAverage[0]],
        ['right', boyAverage[1]]
    ]);
    var boy_options = Object.assign({title: "Boys"}, common_options);
    var boy_chart = new google.visualization.ColumnChart(document.getElementById("boy"));
    boy_chart.draw(boy_data, boy_options);

    var left_hand_data = google.visualization.arrayToDataTable([
        ['hand', 'speed'],
        ['left', leftAverage[0]],
        ['right', leftAverage[1]]
    ]);
    var left_hand_options = Object.assign({title: "Left Handed"}, common_options);
    var left_hand_chart = new google.visualization.ColumnChart(document.getElementById("left"));
    left_hand_chart.draw(left_hand_data, left_hand_options);

    var right_hand_data = google.visualization.arrayToDataTable([
        ['hand', 'speed'],
        ['left', rightAverage[0]],
        ['right', rightAverage[1]]
    ]);
    var right_hand_options = Object.assign({title: "Right Handed"}, common_options);
    var right_hand_chart = new google.visualization.ColumnChart(document.getElementById("right"));
    right_hand_chart.draw(right_hand_data, right_hand_options);
}

function filterData(obj, key, val) {
    var newObj = {};
    for (var k in obj) {
        if (obj[k]['tester'][key] == val) {
            newObj[k] = obj[k];
        }
    }
    return newObj;
}

function getAverage(obj) {
    var left = 0,
        right = 0,
        count = 0;
    for (var k in obj) {
        if (obj[k]['avg'] && obj[k]['avg']['left']) {
            left += obj[k]['avg']['left'];
            right += obj[k]['avg']['right'];
            count++;
        }
    }
    if (count === 0) {
        return [0, 0];
    } else {
        return [left / count, right / count];
    }
}