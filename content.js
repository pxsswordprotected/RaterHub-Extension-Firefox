// content.js

console.log("Content script loaded");

// Track AET and set up button event listeners once
function trackAET() {
  console.log("Tracking AET initialized");

  // Observe the page for the AET element and stop after detecting it once
  const observer = new MutationObserver(() => {
    const aetElement = document.querySelector('.ewok-estimated-task-weight');
    if (aetElement) {
      const aetAverage = calculateAET(aetElement.textContent);
      console.log("AET average found:", aetAverage);
      setUpSubmitButtons(aetAverage);
      observer.disconnect(); // Stop observing once AET is found
    }
  });

  // Start observing the document for changes
  observer.observe(document.body, { childList: true, subtree: true });
}

// Calculate AET from the span text (e.g., "3 - 4 minutes")
function calculateAET(aetText) {
  const [low, high] = aetText.match(/\d+/g).map(Number);
  const average = (low + high) / 2;
  console.log("Calculated AET Average:", average);
  return average;
}

// Set up event listeners for submit buttons
function setUpSubmitButtons(aetAverage) {
  const submitButtons = [
    document.getElementById('ewok-task-submit-button'),
    document.getElementById('ewok-task-submit-done-button')
  ];

  // Add listeners to each submit button once
  submitButtons.forEach(button => {
    if (button && !button.hasAttribute('data-aet-listener')) {
      button.setAttribute('data-aet-listener', 'true'); // Mark as listener added
      button.addEventListener('click', async () => {
        console.log("Submit button clicked, adding AET:", aetAverage);
        await addAETToTotal(aetAverage);
      });
    }
  });
}

// Add AET to the daily total, only once per button click
async function addAETToTotal(aetAverage) {
  const dayKey = getCurrentDay();
  const times = await loadTimesFromStorage();

  // Add the AET to today's total
  times[dayKey] = (times[dayKey] || 0) + aetAverage;
  await saveTimesToStorage(times); // Save updated times
  console.log("Updated times:", times);
}

// Get the current day as a string key
function getCurrentDay() {
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const currentDay = new Date().getDay();
  return daysOfWeek[currentDay === 0 ? 6 : currentDay - 1];
}

// Functions for loading and saving times to storage
async function loadTimesFromStorage() {
  const data = await browser.storage.local.get("times");
  return data.times || {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0
  };
}

async function saveTimesToStorage(times) {
  await browser.storage.local.set({ times });
}

// Start tracking AET
trackAET();
