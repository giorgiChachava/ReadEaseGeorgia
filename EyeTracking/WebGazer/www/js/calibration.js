var PointCalibrate = 0;
var CalibrationPoints={};

// Find the help modal
var helpModal;

/**
 * Clear the canvas and the calibration button.
 */
function ClearCanvas(){
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('display', 'none');
  });
  var canvas = document.getElementById("plotting_canvas");
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Show the instruction of using calibration at the start up screen.
 */
function PopUpInstruction(){
  ClearCanvas();
  swal({
    title:"Calibration",
    text: "Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.",
    buttons:{
      cancel: false,
      confirm: true
    }
  }).then(isConfirm => {
    ShowCalibrationPoint();
  });

}
/**
  * Show the help instructions right at the start.
  */
 function helpModalShow() {
    if(!helpModal) {
        helpModal = new bootstrap.Modal(document.getElementById('helpModal'))
    }
    helpModal.show();
}

function calcAccuracy() {
    // show modal
    // notification for the measurement process
    swal({
        title: "Calculating measurement",
        text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
        closeOnEsc: false,
        allowOutsideClick: false,
        closeModal: true
    }).then( () => {
        // makes the variables true for 5 seconds & plots the points
    
        store_points_variable(); // start storing the prediction points
    
        sleep(5000).then(() => {
                stop_storing_points_variable(); // stop storing the prediction points
                var past50 = webgazer.getStoredPoints(); // retrieve the stored points
                var precision_measurement = calculatePrecision(past50);
                var accuracyLabel = "<a>Accuracy | "+precision_measurement+"%</a>";
                document.getElementById("Accuracy").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
                swal({
                    title: "Your accuracy measure is " + precision_measurement + "%",
                    allowOutsideClick: false,
                    buttons: {
                        confirm: true,
                    }
                }).then(isConfirm => {
                        if (isConfirm){
                            //clear the calibration & hide the last middle button
                            ClearCanvas();
                        } else {
                            //use restart function to restart the calibration
                            document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
                            webgazer.clearData();
                            ClearCalibration();
                            ClearCanvas();
                            ShowCalibrationPoint();
                        }
                });
        });
    });
}

function calPointClick(node) {
    const id = node.id;

    if (!CalibrationPoints[id]){ // initialises if not done
        CalibrationPoints[id]=0;
    }
    CalibrationPoints[id]++; // increments values

    if (CalibrationPoints[id]==5){ //only turn to yellow after 5 clicks
        node.style.setProperty('background-color', 'yellow');
        node.setAttribute('disabled', 'disabled');
        PointCalibrate++;
    }else if (CalibrationPoints[id]<5){
        //Gradually increase the opacity of calibration points when click to give some indication to user.
        var opacity = 0.2*CalibrationPoints[id]+0.2;
        node.style.setProperty('opacity', opacity);
    }

    //Show the middle calibration point after all other points have been clicked.
    if (PointCalibrate == 8){
        document.getElementById('Pt5').style.removeProperty('display');
    }

    if (PointCalibrate >= 9){ // last point is calibrated
        // grab every element in Calibration class and hide them except the middle point.
        document.querySelectorAll('.Calibration').forEach((i) => {
            i.style.setProperty('display', 'none');
        });
        document.getElementById('Pt5').style.removeProperty('display');

        // clears the canvas
        var canvas = document.getElementById("plotting_canvas");
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        // Calculate the accuracy
        calcAccuracy();
    }
}

/**
 * Load this function when the index page starts.
* This function listens for button clicks on the html page
* checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
*/
//$(document).ready(function(){
// 


function docLoad() {
  ClearCanvas();
    
    // click event on the calibration buttons
  document.querySelectorAll('.Calibration').forEach((i) => {
        i.addEventListener('click', () => {
            calPointClick(i);
        })
    })
};
//---------dont forget---------
window.addEventListener('load', docLoad);

/**
 * Show the Calibration Points
 */
function ShowCalibrationPoint() {
  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.removeProperty('display');
  });
  // initially hides the middle button
  document.getElementById('Pt5').style.setProperty('display', 'none');
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration(){
  // Clear data from WebGazer

  document.querySelectorAll('.Calibration').forEach((i) => {
    i.style.setProperty('background-color', 'red');
    i.style.setProperty('opacity', '0.2');
    i.removeAttribute('disabled');
  });

  CalibrationPoints = {};
  PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}



function helpModalShow(){
  console.log("Help modal show triggered");
  const modal = document.getElementById('helpModal');
  if (!modal.classList.contains('show')) {
    modal.classList.add('show');
    modal.style.display = 'block';
  }
}


function startCalibration() {
  document.getElementById('plotting_canvas').style.display = 'block';
  document.getElementById('webgazerNavbar').style.display = 'block';
  document.getElementById('introSection').style.display = 'none';
  document.querySelector('.calibrationDiv').style.display = 'block'; 
  const modal = document.getElementById('helpModal')
    if (!modal.classList.contains('show')) {
    modal.classList.add('show');
    modal.style.display = 'block';
    }

  RestartForStart();

  

  // Watch for accuracy showing %
  const accuracyEl = document.getElementById('Accuracy');
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && accuracyEl.textContent.includes('%')) {
        setTimeout(() => {
          document.getElementById('doneCalibrationModal').style.display = 'block';
        }, 1000);
      }
    }
  });
  observer.observe(accuracyEl, { childList: true });
  eyeTrackingActive=true;
  updateStatusIndicator();
}

function skipCalibration() {
  // Hide intro section
  document.getElementById('introSection').style.display = 'none';
  document.getElementById('main').style.display = 'block';
  // Make sure WebGazer is turned off
  if (window.webgazer) {
   webgazer.clearData();
    //webgazer.stopVideo();
    webgazer.pause();
   // webgazer.end(); // fully stops and cleans up
    console.log("WebGazer disabled for click-only mode.");
  } 
  eyeTrackingActive=false;
  updateStatusIndicator();

  // Show content for non-eye-tracking mode (you can adjust this)

  // Optional: Attach click-to-speak handlers (for example purposes)
  // document.getElementById('boxLeft').onclick = function() {
  //   speakWord("cat");
  // };
  // document.getElementById('boxRight').onclick = function() {
  //   speakWord("hat");
  // };

}

// Usage

// Simple TTS function
function speakWord(word) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(word);
  synth.speak(utter);
  console.log("Spoken:", word);
}


function updateStatusIndicator() {
  const statusElement = document.getElementById('trackingStatus');
  const dot = statusElement.querySelector('span');
  const text = document.getElementById('modeText');
  
  if (eyeTrackingActive) {
    statusElement.style.backgroundColor = '#28a745';
    dot.style.backgroundColor = 'white';
    text.textContent = 'Tracking Active';
  } else {
    statusElement.style.backgroundColor = '#6c757d';
    dot.style.backgroundColor = '#ccc';
    text.textContent = 'Mouse Mode';
  }
}


