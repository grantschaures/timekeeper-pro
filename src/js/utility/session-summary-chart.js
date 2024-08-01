import { tempStorage, charts } from "../modules/summary-stats.js";

document.addEventListener("triggerSessionSummaryChartAnimation", function() {
    const ctx = document.getElementById('sessionSummaryChart').getContext('2d');

    let focusQuality = getFocusQuality(tempStorage.focusQuality);
    let focusQualityRemainder = 100 - focusQuality;

    let deepWork = getDeepWork(tempStorage.deepWork);
    let targetHours = getTargetHours(tempStorage.targetHours);
    let deepWorkRemainder = targetHours - deepWork;
    if (deepWorkRemainder < 0) {
        deepWorkRemainder = 0;
    }
    let deepWorkHours = Math.floor(deepWork);
    let deepWorkMinutes = Math.floor((deepWork - deepWorkHours) * 60);

    let lessThanOneMin = false;
    let deepWorkSeconds;

    // if total deep work is < 1m, calculate number of seconds
    if (tempStorage.deepWork < 60000) {
        lessThanOneMin = true;
        deepWorkSeconds = Math.floor(tempStorage.deepWork / 1000);
    }

    updateSummaryStats(deepWorkHours, deepWorkMinutes, focusQuality, lessThanOneMin, deepWorkSeconds);

    // edge case: user switches mode really fast and thus get 0ms of deep work
    // allows for correct visual representation on chart
    if (deepWork === 0) {
        deepWork = 0.0000000000000001;
    }

    const data = {
        datasets: [
            {
                label: 'Focus Quality',
                data: [focusQuality, focusQualityRemainder],
                backgroundColor: [
                    'rgba(59, 143, 227, 1)',
                    'rgba(59, 143, 227, 0.15)',
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                ],
                borderWidth: 0,
            },
            {
                label: 'Deep Work',
                data: [deepWork, deepWorkRemainder],
                backgroundColor: [
                    'rgba(83, 230, 88, 1)',
                    'rgba(83, 230, 88, 0.15)',
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 255, 255, 1)',
                ],
                borderWidth: 0,
            }
        ]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            animation: {
                duration: 2000, // Duration in milliseconds
                animateRotate: true, // Animate rotation
                animateScale: true, // Animate scaling
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'bottom',
                    labels: {
                        boxWidth: 25, // Width of the box
                        padding: 25, // Padding between the legend items
                        usePointStyle: true, // Use point style for the legend
                        textAlign: 'center',
                        generateLabels: function(chart) {
                            // Generate legend items
                            const datasets = chart.data.datasets;
                            return datasets.map((dataset, index) => {
                                return {
                                    text: dataset.label,
                                    fillStyle: dataset.backgroundColor[0],
                                    hidden: !chart.isDatasetVisible(index),
                                    lineCap: dataset.borderCapStyle,
                                    lineDash: dataset.borderDash,
                                    lineDashOffset: dataset.borderDashOffset,
                                    lineJoin: dataset.borderJoinStyle,
                                    strokeStyle: dataset.borderColor[0],
                                    pointStyle: dataset.pointStyle,
                                    datasetIndex: index
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    filter: function(tooltipItem) {
                        // Only show tooltip for the first data point
                        return tooltipItem.dataIndex === 0;
                    },
                    callbacks: {
                        label: function(tooltipItem) {
                            if (tooltipItem.datasetIndex === 0) {
                                return ' Focus Quality: ' + focusQuality + '%';
                            } else if (tooltipItem.datasetIndex === 1) {
                                if (!lessThanOneMin) {
                                    return ' Deep Work: ' + deepWorkHours + 'h ' + deepWorkMinutes + 'm';
                                } else {
                                    return ' Deep Work: ' + deepWorkSeconds + 's';
                                }
                            }
                            return ''; // Default return value
                        }
                    }
                }
            }
        }
    };

    // Destroy the existing chart instance if it exists
    if (charts.summary) {
        charts.summary.destroy();
        charts.summary = null;
    }

    // Create a new chart instance
    charts.summary = new Chart(ctx, config);
})

// HELPER FUNCTIONS

function getFocusQuality(focusQuality) {
    let newFocusQuality = Math.floor(focusQuality * 100);

    return newFocusQuality;
}

function getDeepWork(deepWork) {
    let newDeepWork = deepWork / 3600000;

    return newDeepWork;
}

function getTargetHours(targetHours) {
    let newTargetHours;
    if (targetHours !== null) {
        newTargetHours = targetHours / 3600000;
    } else {
        newTargetHours = 0;
    }

    return newTargetHours;
}

function updateSummaryStats(deepWorkHours, deepWorkMinutes, focusQuality, lessThanOneMin, deepWorkSeconds) {
    let deepWorkStr;
    let focusQualityStr = `${focusQuality}%`;

    if (!lessThanOneMin) {
        deepWorkStr = `${deepWorkHours}h ${deepWorkMinutes}m`;
    } else {
        deepWorkStr = `${deepWorkSeconds}s`;
    }

    document.getElementById('deepWorkTime').innerHTML = `<b>${deepWorkStr}</b>`;
    document.getElementById('focusPercentage').innerHTML = `<b>${focusQualityStr}</b>`;
}