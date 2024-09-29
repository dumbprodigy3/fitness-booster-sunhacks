// Update the workout status
function updateWorkout() {
    const workoutInput = document.getElementById('workout-input').value;
    const workoutStatus = document.getElementById('workout-status');

    if (workoutInput) {
        workoutStatus.textContent = `Today's workout: ${workoutInput}`;
    } else {
        workoutStatus.textContent = 'No workout logged yet.';
    }
}

// Update the steps status
function updateSteps() {
    const stepsInput = document.getElementById('steps-input').value;
    const stepsStatus = document.getElementById('steps-status');

    if (stepsInput) {
        stepsStatus.textContent = `Today's steps: ${stepsInput}`;
    } else {
        stepsStatus.textContent = 'No steps logged yet.';
    }
}

// Update the food status
function updateFood() {
    const foodInput = document.getElementById('food-input').value;
    const foodStatus = document.getElementById('food-status');

    if (foodInput) {
        foodStatus.textContent = `Today's meals: ${foodInput}`;
    } else {
        foodStatus.textContent = 'No meals logged yet.';
    }
}

// Update the sleep status
function updateSleep() {
    const sleepInput = document.getElementById('sleep-input').value;
    const sleepStatus = document.getElementById('sleep-status');

    if (sleepInput) {
        sleepStatus.textContent = `Hours of sleep: ${sleepInput}`;
    } else {
        sleepStatus.textContent = 'No sleep logged yet.';
    }
}
