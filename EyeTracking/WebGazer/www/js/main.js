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

        ///////////////BELOW THIS IS ADDED BY GIORGI CHACHAVA - HANDLES CALIBRATION START BUTTON (BELOW THIS LINE IS ALL MY CODE)
        document.getElementById('startCalibrationBox').addEventListener('click', () => {
    // Add loading state
    const button = document.getElementById('startCalibrationBox');
    button.innerHTML = '⏳ იტვირთება...';
    button.disabled = true;
    
    webgazer.begin()
        .then(() => {
            // Camera access granted
            console.log('WebGazer started successfully');
            startCalibration();
            button.style.display = 'none'; // Hide button after success
        })
        .catch((err) => {
            // Camera access denied or other error
            console.error('WebGazer failed to start:', err);
            button.innerHTML = '❌ კამერის ნებართვა საჭიროა';
            button.disabled = false;
            
            // Show helpful message
            alert('კამერის წვდომა საჭიროა თვალის ტრეკინგისთვის. გთხოვთ, განაახლოთ გვერდი და დაუშვათ კამერის გამოყენება.');
        });
});
     ///////////////////////ABOVE THIS IS ADDED BY GIORGI CHACHAVA
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
// Added by giorgi chachava - just added function to handle section display and exercise filtering (below this line is all my code)
const ExerciseGames = [
'letter-mastery-game',
'emoji-word-finder-game',
'gaze-maze-game',
'find-words-game',
'odd-one-out-game',
'syllable-builder-game',
'letter-order-game',
'memory-match-game',
];

function showSection(sectionId) {
  const sections = ['toolsSection', 'exercisesSection',  'aboutSection'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === sectionId) ? 'block' : 'none';
  });
}

function hideExercises(){
  ExerciseGames.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}
  function filterExercises(level) {
    // Highlight the active category chip via a class (styled in CSS)
    document.querySelectorAll('#exercisesSection .ex-filter').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.filter === level);
    });

    // Show/hide cards. Clearing the inline value lets the CSS grid display win.
    document.querySelectorAll('.exercise-card').forEach(card => {
      const show = level === 'all' || card.getAttribute('data-level') === level;
      card.style.display = show ? '' : 'none';
    });
  }

  // Initialize to show all exercises
  filterExercises('all');