const eyeTrackingExercises = [
'gaze-maze'
];

let currentExerciseType = null;

function startExercise(type) {
  exClick=true;
  let gameName=type+'-game';
  console.log("Starting exercise:", type);
  document.getElementById('exercisesSection').style.display = 'none';
  currentExerciseType = type;

  if (eyeTrackingExercises.includes(type) & eyeTrackingActive==false) {
    document.getElementById('eyeTrackingPrompt').style.display = 'block';
  } else{
      document.getElementById(gameName).style.display='block'
  };
  

}

function startCalibrationExercise(){

  document.getElementById('eyeTrackingPrompt').style.display = 'none';
  webgazer.begin().then(() => {
  waitForWebcamFeed((video) => {
    console.log("Video found:", video);
      const ids = [
    'webgazerVideoFeed',
    'webgazerFaceOverlay',
    'webgazerFaceFeedbackBox',
    'webgazerGazeDot'
  ];

ids.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.style.position = 'fixed'; // Make sure it's movable
    el.style.top = '80px';
    el.style.zIndex = 9999;
  }
});

  });
});

  startCalibration();
  document.getElementById('main').style.display='none'; 
}

function cancelCalibrationExercise(){
  document.getElementById('eyeTrackingPrompt').style.display = 'none';
  document.getElementById('exercisesSection').style.display = 'block';
}
function waitForWebcamFeed(callback) {
  const interval = setInterval(() => {
    const video = document.querySelector('video');
    if (video) {
      clearInterval(interval);
      callback(video);
    }
  }, 100); // Check every 100ms
}

function proceedToTracking() {
  document.getElementById('doneCalibrationModal').style.display = 'none';
  document.getElementById('plotting_canvas').style.display = 'none';
  document.getElementById('webgazerNavbar').style.display = 'none';
  document.querySelector('.calibrationDiv').style.display = 'none';

  // ✅ Stop learning
  webgazer.removeMouseEventListeners();
  webgazer.collectFeatures = () => {};

//hide prediction dot
  document.querySelectorAll('.webgazerGazeDot').forEach(dot => {
    dot.style.display = 'none';
  });

  // Start tracking phase after 5s
  setTimeout(() => {
    document.getElementById('main').style.display = 'block';
    if (exClick){
      document.getElementById(gameName).style.display='block'
    }
    console.log(eyeTrackingActive)
  }, 1000);

  
}