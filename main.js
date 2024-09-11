


function getAverageTime() {

    const timeSpan = document.querySelector('.ewok-estimated-task-weight'); //element contains time range, grab

    const timeText = timeSpan.textContent; // get content from element

    const matches = timeText.match(/(\d+)\s*-\s*(\d+)/); // finds two numbers separated by ' - '

    if (matches && matches.length === 3) {
        //parse
        const num1 = parseInt(matches[1], 10); // convert to integer
        const num2 = parseInt(matches[2], 10); // convert to integer

        const average = (num1 + num2) / 2; //calculate the average

        //convert
        const minutes = Math.floor(average); // minutes
        const seconds = Math.round((average - minutes) * 60); // seconds
        console.log(`Average Time: ${minutes} minutes and ${seconds} seconds`);
    } else {
        console.log("No valid time range found.");
    }
}