// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
    const times = await loadTimesFromStorage();
    displayTimes(times);
    updateTotalTime(times);
  
    // Add event listener for reset button
    document.getElementById("resetButton").addEventListener("click", resetAllTimes);
  
    // Add event listeners to auto-save changes on input
    addAutoSaveListeners();
  });
  
  // Function to load times from storage
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
  
  // Function to save times to storage
  async function saveTimesToStorage(times) {
    await browser.storage.local.set({ times });
  }
  
  // Display each day's time in the popup table, converting to hours
  function displayTimes(times) {
    for (const day in times) {
      // Convert minutes to hours with consistent precision and set the input value
      const hours = (times[day] / 60).toFixed(2);
      document.getElementById(`${day}Time`).value = hours;
    }
  }
  
  // Calculate and display the total time for the week in hours
  function updateTotalTime(times) {
    // Sum all minutes, then convert to hours with precise rounding
    const totalTimeInHours = (Object.values(times).reduce((a, b) => a + b, 0) / 60).toFixed(2);
    document.getElementById("totalTime").textContent = totalTimeInHours;
  }
  
  // Reset all times to zero
  async function resetAllTimes() {
    const resetTimes = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0
    };
  
    await saveTimesToStorage(resetTimes);  // Save reset times to storage
    displayTimes(resetTimes);               // Update the UI with reset values
    updateTotalTime(resetTimes);            // Update the total display
  }
  
  // Add event listeners to automatically save changes on input with precise conversion
  function addAutoSaveListeners() {
    ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach(day => {
      const input = document.getElementById(`${day}Time`);
      input.addEventListener("input", async (event) => {
        const newTimes = await loadTimesFromStorage();
        const hours = parseFloat(event.target.value);
        newTimes[day] = Math.round(hours * 60 * 100) / 100;  // Convert hours to minutes with precision
        await saveTimesToStorage(newTimes);                  // Save updated times
        updateTotalTime(newTimes);                           // Update the total display immediately
        console.log(`Updated ${day} time to ${hours} hours (${newTimes[day]} minutes)`);
      });
    });
  }
  