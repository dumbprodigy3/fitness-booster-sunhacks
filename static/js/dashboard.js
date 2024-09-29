document.addEventListener('DOMContentLoaded', function () {
    const dashboardContainer = document.getElementById('dashboard-container');
    const viewToggle = document.getElementById('viewToggle');
    const viewModeLabel = document.getElementById('viewMode');
    const getFitDataButton = document.getElementById('getFitDataButton');
    let currentView = 'last7Days'; // Initialize the view state

    // Function to get fitness data after login
    function getFitData() {
        // Get the values from the input fields
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        if (startTime && endTime) {
            // Convert date-time string to Date object and get time in milliseconds
            const startTimeMillis = new Date(startTime).getTime();
            const endTimeMillis = new Date(endTime).getTime();

            // Check that the start time is before the end time
            if (startTimeMillis >= endTimeMillis) {
                alert("Start time must be before end time");
                return;
            }

            console.log("Start Time in Millis:", startTimeMillis);
            console.log("End Time in Millis:", endTimeMillis);

            // Make API request with startTimeMillis and endTimeMillis
            fetch(`https://z5b1v2y35i.execute-api.us-east-2.amazonaws.com/dev/get-google-fit-activity?startTimeMillis=${startTimeMillis}&endTimeMillis=${endTimeMillis}`)
                .then(response => response.json())
                .then(data => {
                    // Display the retrieved Google Fit data on the dashboard
                    updateDashboard(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            alert("Please select both start and end times.");
        }
    }

    // Add event listener for the Get Fit Data button
    getFitDataButton.addEventListener('click', getFitData);

    // Function to update dashboard data after fetching from Google Fit
    function updateDashboard(data) {
        // Assuming the `data` structure contains the following:
        // data = {
        //   "workout": [...],
        //   "stepCount": [...],
        //   "foodTracking": [...],
        //   "sleepCycle": [...]
        // }
        chartData[0].data = data.workout || [];
        chartData[1].data = data.stepCount || [];
        chartData[2].data = data.foodTracking || [];
        chartData[3].data = data.sleepCycle || [];
        renderCharts();
    }

    // Data structure to hold information for each chart
    const chartData = [
        {
            title: 'Workout Duration',
            canvasId: 'workoutDurationChart',
            labels: generateDateLabels(30), // Generate labels for the last 30 days
            data: [],
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)'
        },
        {
            title: 'Step Count',
            canvasId: 'stepCountChart',
            labels: generateDateLabels(30),
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
        },
        {
            title: 'Food Tracking',
            canvasId: 'foodTrackingChart',
            labels: generateDateLabels(30),
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
        },
        {
            title: 'Sleep Cycle',
            canvasId: 'sleepCycleChart',
            labels: generateDateLabels(30),
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
        }
    ];

    // Render the initial set of charts with placeholder data
    renderCharts();

    // Add event listener for the toggle switch to change between last 7 days and weekly average
    viewToggle.addEventListener('change', () => {
        currentView = viewToggle.checked ? 'weeklyAverage' : 'last7Days';
        viewModeLabel.textContent = viewToggle.checked ? 'Week' : 'Day';
        renderCharts();
    });

    // Function to create and render charts dynamically based on the view
    function renderCharts() {
        // Clear the dashboard container
        dashboardContainer.innerHTML = '';

        // Create charts based on the current view
        chartData.forEach(chart => {
            let labels, data;

            if (currentView === 'last7Days') {
                labels = chart.labels.slice(-7);
                data = chart.data.slice(-7);
            } else {
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = aggregateWeeklyAverage(chart.data);
            }

            createCard(chart.title + ` (${currentView === 'last7Days' ? 'Last 7 Days' : 'Weekly Average'})`, chart.canvasId, labels, data, chart.borderColor, chart.backgroundColor);
        });
    }

    // Function to create and append card elements to the dashboard
    function createCard(titleText, canvasId, labels, data, borderColor, backgroundColor) {
        const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h3');
        title.textContent = titleText;
        card.appendChild(title);

        const canvas = document.createElement('canvas');
        canvas.id = canvasId;
        card.appendChild(canvas);

        dashboardContainer.appendChild(card);

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: titleText,
                    data: data,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Function to generate date labels for the last `numDays` days
    function generateDateLabels(numDays) {
        const labels = [];
        const today = new Date();
        for (let i = numDays - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }));
        }
        return labels;
    }

    // Function to aggregate data by week and calculate the average
    function aggregateWeeklyAverage(data) {
        const weeklyAverage = [];
        for (let i = 0; i < data.length; i += 7) {
            const weekData = data.slice(i, i + 7);
            const weekSum = weekData.reduce((acc, val) => acc + val, 0);
            weeklyAverage.push(weekSum / weekData.length);
        }
        return weeklyAverage;
    }
});
