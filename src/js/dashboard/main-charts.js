import { adjustedDeepWorkToggle, advChartsContainer, advChartsCoverModule, chartHeaders, deepWorkHeaderText, HC_icon_main_charts, labelDistributionContainer, leftMetricDistributionArrow, mainCharts, mainChartsContainer, mainChartsCoverModule, metricBodyContainers, metricDistributionArrows, metricDistributionBackBtn, metricDistributionContainer, metricDistributionCoverContainer, metricDistributionMonth, metricDistributionSelections, metricDistributionSubContainer, metricDistributionTimeFrame, metricDistributionWeek, metricDistributionYear, rightMetricDistributionArrow } from "../modules/dashboard-elements.js"
import { sessionState } from "../modules/state-objects.js"
import { flags, labelDistContainer, mainChartContainer } from "../modules/dashboard-objects.js"

import { setBounds, alterBounds } from './label-distribution.js';

export function populateMainChartsContainer() {
    setBounds(mainChartContainer, metricDistributionTimeFrame);
}

document.addEventListener("stateUpdated", function() {
    if (sessionState.loggedIn) {
        mainChartsCoverModule.addEventListener("click", function() {
            expandMetricDistributionContainer(mainChartsContainer);
        })

        advChartsCoverModule.addEventListener("click", function() {
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

        adjustedDeepWorkToggle.addEventListener('click', function() {
            if (adjustedDeepWorkToggle.checked) {
                flags.adjustedDeepWorkToggle = true;
                deepWorkHeaderText.innerText = "Adjusted Deep Work"

                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayMainCharts'));
                
            } else {
                flags.adjustedDeepWorkToggle = false;
                deepWorkHeaderText.innerText = "Deep Work"

                // make necessary changes to chart distribution
                document.dispatchEvent(new Event('displayMainCharts'));

            }
        })

        metricDistributionWeek.addEventListener("click", function() {
            // add class
            metricDistributionWeek.classList.add('metricDistributionSelected');
    
            // remove class
            metricDistributionMonth.classList.remove('metricDistributionSelected');
            metricDistributionYear.classList.remove('metricDistributionSelected');
    
            // set timeFrame
            mainChartContainer.timeFrame = 'week';
    
            // call function which resets bounds
            setBounds(mainChartContainer, metricDistributionTimeFrame);
    
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
            setBounds(mainChartContainer, metricDistributionTimeFrame);
    
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
            setBounds(mainChartContainer, metricDistributionTimeFrame);
    
            // visualize data
            document.dispatchEvent(new Event('displayMainCharts'));
    
        })
    
        leftMetricDistributionArrow.addEventListener("click", function() {
            // decrease current bounds
            alterBounds('shiftdown', mainChartContainer, metricDistributionTimeFrame);
    
            // visualize data
            document.dispatchEvent(new Event('displayMainCharts'));
    
        })
        
        rightMetricDistributionArrow.addEventListener("click", function() {
            // increase current bounds
            alterBounds('shiftup', mainChartContainer, metricDistributionTimeFrame);
    
            // visualize data
            document.dispatchEvent(new Event('displayMainCharts'));
    
        })
    }
})

function expandMetricDistributionContainer(metricBodyContainer) {
    if (!labelDistContainer.resetInProgress) {
        // header adjustment
        adjustMetricDistributionHeaderContainer(metricBodyContainer);

        // show the metricBodyContainer
        metricBodyContainer.style.display = 'flex';

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
            HC_icon_main_charts.style.opacity = '0';
        }, 250)

        setTimeout(() => {
            mainCharts.forEach(chart => {
                chart.style.display = 'flex';
                setTimeout(() => {
                    chart.style.opacity = '1';
                }, 0)
            })

            // send dispatch event
            document.dispatchEvent(new Event('displayMainCharts'));
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
    metricDistributionTimeFrame.style.display = 'none';

    // resetting main charts
    mainCharts.forEach(chart => {
        chart.style.display = 'none';
        setTimeout(() => {
            chart.style.opacity = '0';
        }, 0)
        HC_icon_main_charts.style.opacity = '1';
    })
}

function adjustMetricDistributionHeaderContainer(metricBodyContainer) {
    if (metricBodyContainer.id === 'mainChartsContainer') {
        metricDistributionSelections.style.display = 'flex';
        metricDistributionArrows.style.display = 'flex';
        metricDistributionTimeFrame.style.display = 'flex';
    }
}