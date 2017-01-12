// Initialize Firebase
var config = {
    apiKey: "AIzaSyBNJNY1EiImCdjhQqb2bZEHzZo2ralIqdQ",
    authDomain: "oliver-dexterity.firebaseapp.com",
    databaseURL: "https://oliver-dexterity.firebaseio.com",
    storageBucket: "oliver-dexterity.appspot.com",
    messagingSenderId: "576315655284"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var tests_to_run = 6;
var title = document.getElementById('title');
var text = document.getElementById('text');
var countdown_start = 5;
var max_test = 5;
var min_test = 1;
var testing = false;
var timer;
var result;
var results = [];

function run_tests() {
    console.log(results);
    if (results.length === tests_to_run) {
        finalize();
        return;
    }
    if (results.length < (tests_to_run / 2)) {
        test('left');
    } else {
        test('right');
    }

}
function countdown(start) {
    if (start > 0) {
        text.innerHTML = start;
        setTimeout(function () {
            countdown(start - 1);
        }, 1000);
    } else {
        text.innerHTML = '';
        run_tests();
    }
}

function test(hand) {
    updateProgress();
    title.innerHTML = "Use your <span class='text-danger'>" + hand + "</span> hand to tap the screen or keyboard when it flashes GO!";
    document.body.className = hand;
    if (hand === 'right') {
        document.querySelector('.d-flex').classList.add('flex-row-reverse');
    }
    setTimeout(function () {
        text.innerHTML = "GO!";
        document.body.style = "background: slateblue; color: white;";
        testing = true;
        timer = Date.now();
    }, ((Math.random() * (max_test - min_test)) + min_test) * 1000);
}

function catchEvent(event) {
    if (testing) {
        console.log(event);
        testing = false;
        document.body.style = "background: white; color: black;";
        result = (Date.now() - timer) / 1000;
        console.log(result, 'seconds');
        text.innerHTML = "";
        results.push(result);
        run_tests();
    }
}

var getQueryParameters = function (str) {
    return (str || document.location.search)
        .replace(/(^\?)/, '')
        .split("&")
        .map(function (n) {
                return n = n.split("="), this[n[0]] = n[1], this
            }
                .bind({})
        )[0];
};

function updateProgress() {
    var pct = Math.round(results.length / (max_test + 1) * 100);
    var bar = document.querySelector('.progress-bar');
    bar.innerHTML = pct + '%';
    bar.style = "width: " + bar.innerHTML;
    bar.setAttribute('aria-valuenow', pct);
}

function finalize() {
    // Create a new post reference with an auto-generated id
    var leftAvg = results.slice(0, results.length / 2).reduce(function (sum, n) {
            return sum + n
        }, 0) / (results.length / 2);
    var rightAvg = results.slice(results.length / 2).reduce(function (sum, n) {
            return sum + n
        }, 0) / (results.length / 2);
    var dataToSave = {
        date: Date.now(),
        tester: getQueryParameters(),
        data: results,
        avg: {left: leftAvg, right: rightAvg}
    };
    var newTestResultRef = database.ref('tests').push();
    newTestResultRef.set(dataToSave).then(function () {
        window.location = '/page4.html';
    });
}

window.addEventListener('keypress', catchEvent, false);
window.addEventListener('click', catchEvent, false);

countdown(countdown_start);
