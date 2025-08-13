window.onload = async function() {

    //start the webgazer tracker
    await webgazer.setRegression('ridge') /* currently must set regression and tracker */
        //.setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
          //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
          //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
        })
        .saveDataAcrossSessions(true)
        //.begin();
        document.getElementById('startCalibrationBox').addEventListener('click', () => {
        webgazer.begin();
        startCalibration(); // your existing calibration function
        
});
        webgazer.showVideoPreview(true) /* shows all video previews */
            .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
            .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

    //Set up the webgazer video feedback.
    var setup = function() {

        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };
    setup();

};

// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = true;

window.onbeforeunload = function() {
    webgazer.end();
}

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart(){
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    webgazer.clearData();
    ClearCalibration();
    PopUpInstruction();
}

function RestartForStart(){
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    webgazer.clearData();
    ClearCalibration();
}

function RestartForCalibrationButton(){
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    webgazer.clearData();
    ClearCalibration();
    PopUpInstruction();
    const modal = document.getElementById('helpModal')
    if (modal.classList.contains('show')) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}
////////////////////////////////////////////////////UPDATE THIS///////////////////////////////
const ExerciseGames = [
'letter-mastery-game',
'emoji-word-finder-game',
'gaze-maze-game',
'find-words-game',
'odd-one-out-game',
'focus-timer-game',
'rapid-word-attack-game'
];

function showSection(sectionId) {
  const sections = ['toolsSection', 'exercisesSection',  'aboutSection'];
  sections.forEach(id => {
    document.getElementById(id).style.display = (id === sectionId) ? 'block' : 'none';
  });
}

function hideExercises(){
  ExerciseGames.forEach(id => {
    document.getElementById(id).style.display='none';
  });
}
  function filterExercises(level) {
    // Update button styles
    const buttons = document.querySelectorAll('#exercisesSection button');
    buttons.forEach(button => {
      if (button.textContent.toLowerCase().includes(level)) {
        button.style.background = '#4a6fa5';
        button.style.color = 'white';
      } else if (button.textContent.toLowerCase() !== 'all') {
        button.style.background = '#e2e8f0';
        button.style.color = '#2c3e50';
      }
    });
    
    // Special case for "All" button
    if (level === 'all') {
      document.querySelector('#exercisesSection button:first-child').style.background = '#4a6fa5';
      document.querySelector('#exercisesSection button:first-child').style.color = 'white';
    } else {
      document.querySelector('#exercisesSection button:first-child').style.background = '#e2e8f0';
      document.querySelector('#exercisesSection button:first-child').style.color = '#2c3e50';
    }
    
    // Filter exercises
    const exercises = document.querySelectorAll('.exercise-card');
    exercises.forEach(exercise => {
      if (level === 'all' || exercise.getAttribute('data-level') === level) {
        exercise.style.display = 'block';
      } else {
        exercise.style.display = 'none';
      }
    });
  }

  // Initialize to show all exercises
  filterExercises('all');