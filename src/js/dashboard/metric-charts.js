import { adjustedDeepWorkToggle, advChartsContainer, advChartsCoverModule, chartHeaders, deepWorkHeaderText, HC_icon_metric_charts, labelDistributionContainer, leftMetricDistributionArrow, metricCharts, mainChartsContainer, mainChartsCoverModule, metricBodyContainers, metricChartsHr, metricDistributionArrows, metricDistributionBackBtn, metricDistributionContainer, metricDistributionCoverContainer, metricDistributionMonth, metricDistributionSelections, metricDistributionSubContainer, metricDistributionTimeFrame, metricDistributionWeek, metricDistributionYear, rightMetricDistributionArrow, rightMetricDistributionArrowGray, breakIntervalToggle, distractionsToggle, avgDeepWorkHeaderText, hourlyQualityAdjustedToggle, mainChartsSummary, mainChartsSummaryContainer, mainChartsSummarySubContainer, summaryDeepWorkTimeTitle, summaryAvgDeepWorkTimeTitle, summaryAvgAdjustedDeepWorkTimeTitle, summaryAvgDeepWorkIntervalTitle } from "../modules/dashboard-elements.js"
import { sessionState } from "../modules/state-objects.js"
import { flags, general, labelDistContainer, mainChartContainer } from "../modules/dashboard-objects.js"

import { setBounds, alterBounds, displayTimeFrame } from './label-distribution.js'; // need to edit editHTML

export function setMainChartsContainer() {
    setBounds(mainChartContainer, metricDistributionTimeFrame, rightMetricDistributionArrow, rightMetricDistributionArrowGray);
}

document.addEventListener("stateUpdated", function() {
    if (sessionState.loggedIn) {
        mainChartsCoverModule.addEventListener("click", function() {
            displayTimeFrame(mainChartContainer, metricDistributionTimeFrame);
            expandMetricDistributionContainer(mainChartsContainer);
        })

        advChartsCoverModule.addEventListener("click", function() {
            metricDistributionTimeFrame.innerText = "All Time";
            expandMetricDistributionContainer(advChartsContainer);
        })
        
        metricDistributionBackBtn.addEventListener('mouseover', function() {
            metricDistributionBackBtn.classList.remove('resetBounce');
            metricDistributionBackBtn.classList.add('triggerBounceLeft');
        })
        metricDistributionBackBtn.addEventListener('mouseout', function() {
            metricDistributionBackBtn.classList.remove('TriggerBounceLeft');
            metricDistributionBackBtn.classList.add('resetBounce');
        })
        metricDistributionBackBtn.addEventListener("click", function(event) {
            event.stopPropagation(); // stops propagation in bubbling phase after target phase
            resetMetricDistributionContainer();   
        })

        // TOGGLES

        adjustedDeepWorkToggle.addEventListener('click', function() { // main chart
            if (adjustedDeepWorkToggle.checked) {
                flags.adjustedDeepWorkToggle = true;
                deepWorkHeaderText.innerText = "Adjusted Deep Work"
                general.chartTransition = 'main-adjusted';

                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayMainCharts'));
                
            } else {
                flags.adjustedDeepWorkToggle = false;
                deepWorkHeaderText.innerText = "Deep Work"
                general.chartTransition = 'main-adjusted';

                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayMainCharts'));

            }
        })

        breakIntervalToggle.addEventListener('click', function() { // main chart
            if (breakIntervalToggle.checked) {
                flags.avgBreakIntervalToggle = true;
                avgIntervalHeaderText.innerText = "Avg Break Interval"
                general.chartTransition = 'main-break';
                
                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayMainCharts'));
                
            } else {
                flags.avgBreakIntervalToggle = false;
                avgIntervalHeaderText.innerText = "Avg Deep Work Interval";
                general.chartTransition = 'main-break';

                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayMainCharts'));
            }
        })
        
        distractionsToggle.addEventListener('click', function() { // adv chart
            if (distractionsToggle.checked) {
                flags.distractionsToggle = true;
                hourlyFocusHeaderText.innerText = "Avg Distractions"
                general.chartTransition = 'adv-distractions';
                
                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayAdvCharts'));
                
            } else {
                flags.distractionsToggle = false;
                hourlyFocusHeaderText.innerText = "Focus Quality";
                general.chartTransition = 'adv-distractions';
    
                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayAdvCharts'));
            }

        })
        
        hourlyQualityAdjustedToggle.addEventListener('click', function() { // adv chart
            if (hourlyQualityAdjustedToggle.checked) {
                flags.hourlyQualityAdjustedToggle = true;
                avgDeepWorkHeaderText.innerText = "Adjusted Avg Deep Work"
                general.chartTransition = 'adv-adjusted';
    
                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayAdvCharts'));
    
            } else {
                flags.hourlyQualityAdjustedToggle = false;
                avgDeepWorkHeaderText.innerText = "Avg Deep Work";
                general.chartTransition = 'adv-adjusted';
    
                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayAdvCharts'));
            }

        })

        // WEEK, MONTH, YEAR buttons

        metricDistributionWeek.addEventListener("click", function() {
            // add class
            metricDistributionWeek.classList.add('metricDistributionSelected');
    
            // remove class
            metricDistributionMonth.classList.remove('metricDistributionSelected');
            metricDistributionYear.classList.remove('metricDistributionSelected');
    
            // set timeFrame
            mainChartContainer.timeFrame = 'week';
    
            // call function which resets bounds
            setBounds(mainChartContainer, metricDistributionTimeFrame, rightMetricDistributionArrow, rightMetricDistributionArrowGray);

            // chart transition
            if (flags.summarySelected) {
                general.chartTransition = 'summary';
            } else {
                general.chartTransition = 'all';
            }
    
            // visualize data
            document.dispatchEvent(new Event('displayMainCharts'));
        })
        
        metricDistributionMonth.addEventListener("click", function() {
            // add class
            metricDistributionMonth.classList.add('metricDistributionSelected');
            
            // remove class
            metricDistributionWeek.classList.remove('metricDistributionSelected');
            metricDistributionYear.classList.remove('metricDistributionSelected');
            
            // set timeFrame
            mainChartContainer.timeFrame = 'month';
            
            // call function which resets bounds
            setBounds(mainChartContainer, metricDistributionTimeFrame, rightMetricDistributionArrow, rightMetricDistributionArrowGray);

            // chart transition
            if (flags.summarySelected) {
                general.chartTransition = 'summary';
            } else {
                general.chartTransition = 'all';
            }
    
            // visualize data
            document.dispatchEvent(new Event('displayMainCharts'));
    
        })
        
        metricDistributionYear.addEventListener("click", function() {
            // add class
            metricDistributionYear.classList.add('metricDistributionSelected');
            
            // remove class
            metricDistributionWeek.classList.remove('metricDistributionSelected');
            metricDistributionMonth.classList.remove('metricDistributionSelected');
            
            // set timeFrame
            mainChartContainer.timeFrame = 'year';
            
            // call function which resets bounds
            setBounds(mainChartContainer, metricDistributionTimeFrame, rightMetricDistributionArrow, rightMetricDistributionArrowGray);

            // chart transition
            if (flags.summarySelected) {
                general.chartTransition = 'summary';
            } else {
                general.chartTransition = 'all';
            }
    
            // visualize data
            document.dispatchEvent(new Event('displayMainCharts'));
    
        })

        mainChartsSummary.addEventListener('click', function() {
            if (flags.summarySelected) {
                flags.summarySelected = false;

                // remove class
                mainChartsSummary.classList.remove('summarySelected');

                // show mainChartsContainer
                mainChartsContainer.style.display = 'flex';

                // hide mainChartsSummaryContainer
                mainChartsSummaryContainer.style.display = 'none';
                mainChartsSummarySubContainer.style.opacity = '0';
                
                // chart transition
                general.chartTransition = 'all';

            } else {
                flags.summarySelected = true;
                
                // add class
                mainChartsSummary.classList.add('summarySelected');
                
                // hide mainChartsContainer
                mainChartsContainer.style.display = 'none';
                
                // show mainChartsSummaryContainer
                mainChartsSummaryContainer.style.display = 'flex';
                setTimeout(() => {
                    mainChartsSummarySubContainer.style.opacity = '1';
                }, 0)

                // chart transition
                general.chartTransition = 'summary';
            }
    
            // visualize data
            document.dispatchEvent(new Event('displayMainCharts'));
        })
    
        // ARROW BUTTONS

        leftMetricDistributionArrow.addEventListener("click", function() {
            // decrease current bounds
            alterBounds('shiftdown', mainChartContainer, metricDistributionTimeFrame, rightMetricDistributionArrow, rightMetricDistributionArrowGray);

            // chart transition
            if (flags.summarySelected) {
                general.chartTransition = 'summary';
            } else {
                general.chartTransition = 'all';
            }
    
            // visualize data
            document.dispatchEvent(new Event('displayMainCharts'));
    
        })
        
        rightMetricDistributionArrow.addEventListener("click", function() {
            // increase current bounds
            alterBounds('shiftup', mainChartContainer, metricDistributionTimeFrame, rightMetricDistributionArrow, rightMetricDistributionArrowGray);

            // chart transition
            if (flags.summarySelected) {
                general.chartTransition = 'summary';
            } else {
                general.chartTransition = 'all';
            }
    
            // visualize data
            document.dispatchEvent(new Event('displayMainCharts'));
    
        })
    }

    window.addEventListener('resize', checkViewportWidth);
})

function checkViewportWidth() {
    if (window.innerWidth <= 1385) {

        // temporary additions
        metricDistributionWeek.innerText = "W";
        metricDistributionMonth.innerText = "M";
        metricDistributionYear.innerText = "Y";
    } else {


        // temporary additions
        metricDistributionWeek.innerText = "Week";
        metricDistributionMonth.innerText = "Month";
        metricDistributionYear.innerText = "Year";

    }

    if (window.innerWidth <= 695) {
        // temporary addition
        metricDistributionTimeFrame.style.display = "none";
    } else {
        // temporary addition
        metricDistributionTimeFrame.style.display = "flex";
    }

    if (window.innerWidth <= 560) {
        summaryAvgAdjustedDeepWorkTimeTitle.innerText = "Avg Per Day (QA):";
        
    } else {
        summaryAvgAdjustedDeepWorkTimeTitle.innerText = "Avg Per Day (Quality Adjusted):";
        
    }

    if (window.innerWidth <= 550) {
        mainChartsSummary.innerText = "S";
    } else {
        mainChartsSummary.innerText = "Summary";
    }
}

function expandMetricDistributionContainer(metricBodyContainer) {
    if (!labelDistContainer.resetInProgress) {
        // header adjustment
        adjustMetricDistributionHeaderContainer(metricBodyContainer);
        checkViewportWidth();

        // show the metricBodyContainer
        // metricBodyContainer.style.display = 'flex';

        // remove metric distribution container cover
        metricDistributionCoverContainer.style.opacity = "0";
        metricDistributionCoverContainer.style.display = "none";
        metricDistributionSubContainer.style.display = "flex";
    
        // show the metric distribution sub container
        setTimeout(() => {
            metricDistributionSubContainer.style.opacity = "1";
        }, 0)
    
        // remove label distribution container
        const currentHeight = labelDistributionContainer.scrollHeight + 'px';
        labelDistributionContainer.style.height = currentHeight;
        labelDistributionContainer.offsetHeight;
        labelDistContainer.height = labelDistributionContainer.scrollHeight + 'px';
        labelDistributionContainer.style.height = '0%';
        labelDistributionContainer.style.padding = '0px';
        labelDistributionContainer.style.marginTop = '0px';
        labelDistributionContainer.style.opacity = '0';
    
        // expand metric distribution container
        metricDistributionContainer.style.marginBottom = '0px';
        metricDistributionContainer.classList.add('expanded');
        flags.metricDistributionContainerExpanded = true;

        // initial back btn right translation movement
        metricDistributionBackBtn.classList.add('resetBounce');
        
        setTimeout(() => {
            HC_icon_metric_charts.style.opacity = '0';
        }, 250)


        setTimeout(() => {
            metricCharts.forEach(chart => {
                chart.style.display = 'flex';
                setTimeout(() => {
                    chart.style.opacity = '1';
                }, 0)
            })

            metricChartsHr.forEach(Hr => {
                Hr.style.width = '100%';
                Hr.style.opacity = '1';
            })

            if (metricBodyContainer === mainChartsContainer) {

                if (flags.summarySelected) {
                    mainChartsSummaryContainer.style.display = 'flex';
                    mainChartsSummarySubContainer.style.opacity = '1';
                } else {
                    metricBodyContainer.style.display = 'flex';
                }

                mainChartsDivisionHr.style.display = 'flex';

                // chart transition
                general.chartTransition = 'all';

                document.dispatchEvent(new Event('displayMainCharts'));
                
            } else {
                metricBodyContainer.style.display = 'flex';
                
                // chart transition
                general.chartTransition = 'all';

                document.dispatchEvent(new Event('displayAdvCharts'));
            }
        }, 500)

    }
}

function resetMetricDistributionContainer() {
    labelDistContainer.resetInProgress = true;

    // hiding metric distribution sub-container
    metricDistributionSubContainer.style.opacity = "0";
    metricDistributionSubContainer.style.display = "none";
    metricDistributionCoverContainer.style.display = "flex";

    // showing metric distribution cover-container
    setTimeout(() => {
        metricDistributionCoverContainer.style.opacity = "1";
    }, 0)

    // resetting label distribution container
    labelDistributionContainer.style.height = labelDistContainer.height;
    setTimeout(() => {
        labelDistributionContainer.style.height = 'auto';
        labelDistContainer.resetInProgress = false;
    }, 500)
    labelDistributionContainer.style.padding = '15px';
    labelDistributionContainer.style.marginTop = '10px';
    labelDistributionContainer.style.opacity = '1';

    // resetting metric distribution container
    metricDistributionContainer.style.marginBottom = '10px';
    metricDistributionContainer.classList.remove('expanded');
    flags.metricDistributionContainerExpanded = false;

    // resetting metric body containers
    metricBodyContainers.forEach(container => {
        container.style.display = 'none';
    })

    // resetting metric distributionHeaderContainer
    metricDistributionSelections.style.display = 'none';
    metricDistributionArrows.style.display = 'none';
    mainChartsSummary.style.display = 'none';
    metricDistributionTimeFrame.style.display = 'none';

    // reset animation flag
    flags.quickerChartAnimations = false;

    // resetting main charts
    metricCharts.forEach(chart => {
        chart.style.display = 'none';
        setTimeout(() => {
            chart.style.opacity = '0';
        }, 0)
        HC_icon_metric_charts.style.opacity = '1';
    })

    // resetting Hr widths
    metricChartsHr.forEach(Hr => {
        Hr.style.width = '0%';
        Hr.style.opacity = '0';
    })

    // rehide the division Hr
    mainChartsDivisionHr.style.display = 'none';
}

function adjustMetricDistributionHeaderContainer(metricBodyContainer) {
    if (metricBodyContainer.id === 'mainChartsContainer') {
        metricDistributionSelections.style.display = 'flex';
        metricDistributionArrows.style.display = 'flex';
        mainChartsSummary.style.display = 'flex';
        metricDistributionTimeFrame.style.display = 'flex';
    }
}