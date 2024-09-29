document.addEventListener('DOMContentLoaded', function () {
    const dashboardContainer = document.getElementById('dashboard-container');
    const viewToggle = document.getElementById('viewToggle');
    const viewModeLabel = document.getElementById('viewMode');

    // Data for the dashboard (static for now)
    const chartData = [
        {
            title: 'Workout Duration',
            canvasId: 'workoutDurationChart',
            labels: generateDateLabels(30), // Generate labels for the last 30 days
            data: [30, 45, 60, 40, 50, 70, 65, 35, 55, 60, 45, 50, 70, 30, 60, 75, 40, 65, 55, 70, 30, 45, 80, 65, 50, 60, 55, 70, 45, 50],
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)'
        },
        {
            title: 'Step Count',
            canvasId: 'stepCountChart',
            labels: generateDateLabels(30),
            data: [3000, 5000, 7000, 4000, 6500, 8000, 7500, 6000, 7200, 5300, 4800, 7100, 7800, 3000, 4900, 8700, 6000, 6900, 7000, 8000, 5000, 4500, 8200, 7300, 6500, 6900, 7400, 8200, 5000, 6000],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
        },
        {
            title: 'Food Tracking',
            canvasId: 'foodTrackingChart',
            labels: generateDateLabels(30),
            data: [2000, 1800, 2100, 1900, 2200, 2300, 2000, 2100, 1950, 2050, 2200, 1800, 2400, 2000, 2200, 1900, 2150, 2300, 2100, 2000, 1800, 1950, 2250, 2100, 2300, 2000, 2200, 2400, 1950, 2050],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
        },
        {
            title: 'Sleep Cycle',
            canvasId: 'sleepCycleChart',
            labels: generateDateLabels(30),
            data: [6, 7, 8, 5, 7, 6, 8, 7, 6, 7.5, 8, 6.5, 7, 5.5, 6, 8, 7, 6, 7.5, 8, 6, 7, 8, 5.5, 7, 6.5, 7, 6, 8, 7.5],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
        }
    ];

    let currentView = 'last7Days'; // Initialize the view state

    // Render the initial set of charts
    renderCharts();

    // Add event listener for the toggle switch
    viewToggle.addEventListener('change', () => {
        currentView = viewToggle.checked ? 'weeklyAverage' : 'last7Days';
        viewModeLabel.textContent = viewToggle.checked ? 'Week' : 'Day';
        renderCharts();
    });

    // Function to create and render charts
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

    // Function to create and append card elements
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
