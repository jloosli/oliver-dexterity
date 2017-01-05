"use strict";
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBNJNY1EiImCdjhQqb2bZEHzZo2ralIqdQ",
  authDomain: "oliver-dexterity.firebaseapp.com",
  databaseURL: "https://oliver-dexterity.firebaseio.com",
  storageBucket: "oliver-dexterity.appspot.com",
  messagingSenderId: "576315655284"
};
firebase.initializeApp(config);

google.charts.load('current', { 'packages': ['gauge', 'corechart'] });
google.charts.setOnLoadCallback(drawCharts);
function drawCharts() {
  var database = firebase.database();
  var TestResultsRef = database.ref('tests');
  TestResultsRef.on('value', function (dataSnapshot) {
    var allData = dataSnapshot.val();
    var girlData = allData.filter();
    console.log(dataSnapshot.val());
  });
  var boy_girl_data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Boys', 25],
    ['Girls', 50],
  ]);
  var boy_girl_options = {};
  var boy_girl_chart = new google.visualization.Gauge(document.getElementById('boy-girl'));
  boy_girl_chart.draw(boy_girl_data, boy_girl_options);

  var left_hand_data = google.visualization.arrayToDataTable([
    ['hand', 'speed'],
    ['left', 0.2],
    ['right', 0.47]
  ]);
  var left_hand_options = { title: "Left Handed" };
  var left_hand_chart = new google.visualization.ColumnChart(document.getElementById("left"));
  left_hand_chart.draw(left_hand_data, left_hand_options);

  var right_hand_data = google.visualization.arrayToDataTable([
    ['hand', 'speed'],
    ['left', 0.2],
    ['right', 0.47]
  ]);
  var right_hand_options = { title: "Right Handed" };
  var right_hand_chart = new google.visualization.ColumnChart(document.getElementById("right"));
  right_hand_chart.draw(right_hand_data, right_hand_options);
}

