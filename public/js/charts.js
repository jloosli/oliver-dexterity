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

google.charts.load('current', { 'packages': ['gauge', 'corechart'] });
google.charts.setOnLoadCallback(getData);
function getData() {
  var database = firebase.database();
  var TestResultsRef = database.ref('tests');
  initCharts();
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
  });
}

function initCharts() { }
function drawCharts() {

  var boy_girl_data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Boys', (boyAverage[0] + boyAverage[1]) / 2],
    ['Girls', (girlAverage[0] + girlAverage[1]) / 2],
  ]);
  var boy_girl_options = {};
  var boy_girl_chart = new google.visualization.Gauge(document.getElementById('boy-girl'));
  boy_girl_chart.draw(boy_girl_data, boy_girl_options);

  var left_hand_data = google.visualization.arrayToDataTable([
    ['hand', 'speed'],
    ['left', leftAverage[0]],
    ['right', leftAverage[1]]
  ]);
  var left_hand_options = { title: "Left Handed" };
  var left_hand_chart = new google.visualization.ColumnChart(document.getElementById("left"));
  left_hand_chart.draw(left_hand_data, left_hand_options);

  var right_hand_data = google.visualization.arrayToDataTable([
    ['hand', 'speed'],
    ['left', rightAverage[0]],
    ['right', rightAverage[1]]
  ]);
  var right_hand_options = { title: "Right Handed" };
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