const ctx = document.getElementById('sessionSummaryChart').getContext('2d');

let focusQuality = 34;
let focusQualityRemainder = 100 - focusQuality;
// let focusQualityStr = 'Focus Quality: ' + focusQuality + '%';

let deepWork = 5.27;
let targetHours = 6;
let deepWorkRemainder = targetHours - deepWork;
if (deepWorkRemainder < 0) {
    deepWorkRemainder = 0;
}
let deepWorkHours = Math.floor(deepWork);
let deepWorkMinutes = Math.floor((deepWork - deepWorkHours) * 60);
// let deepWorkStr = 'Deep Work: ' + deepWorkHours + 'h ' + deepWorkMinutes + 'm';

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
            duration: 2000, // Adjust the duration in milliseconds
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
                            return ' Focus Quality: ' + tooltipItem.raw + '%';
                        } else if (tooltipItem.datasetIndex === 1) {
                            return ' Deep Work: ' + deepWorkHours + 'h ' + deepWorkMinutes + 'm';
                        }
                        return ''; // Default return value
                    }
                }
            }
        }
    }
};

const myChart = new Chart(ctx, config);
