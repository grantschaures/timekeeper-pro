import { labelDistributionContainer, metricDistributionBackBtn, metricDistributionContainer, metricDistributionCoverContainer, metricDistributionSubContainer } from "../modules/dashboard-elements.js"
import { sessionState } from "../modules/state-objects.js"
import { flags, labelDistContainer } from "../modules/dashboard-objects.js"

document.addEventListener("stateUpdated", function() {
    if (sessionState.loggedIn) {
        metricDistributionContainer.addEventListener("click", function() {
            if (!flags.metricDistributionContainerExpanded) { // could make a flag for this
                expandMetricDistributionContainer();
            }
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
            if (flags.metricDistributionContainerExpanded) {
                event.stopPropagation(); // stops propagation in bubbling phase after target phase
                resetMetricDistributionContainer();                
            }
        })
    }
})

function expandMetricDistributionContainer() {
    if (!labelDistContainer.resetInProgress) {
        metricDistributionCoverContainer.style.opacity = "0";
        metricDistributionCoverContainer.style.display = "none";
        metricDistributionSubContainer.style.display = "flex";
    
        setTimeout(() => {
            metricDistributionSubContainer.style.opacity = "1";
        }, 0)
    
        const currentHeight = labelDistributionContainer.scrollHeight + 'px';
        labelDistributionContainer.style.height = currentHeight;
        labelDistributionContainer.offsetHeight;
        labelDistContainer.height = labelDistributionContainer.scrollHeight + 'px';
    
        labelDistributionContainer.style.height = '0%';
        labelDistributionContainer.style.padding = '0px';
        labelDistributionContainer.style.marginTop = '0px';
        labelDistributionContainer.style.opacity = '0';
    
        metricDistributionBackBtn.style.opacity = '1';
    
        metricDistributionContainer.style.marginBottom = '0px';
        metricDistributionContainer.classList.add('expanded');
        flags.metricDistributionContainerExpanded = true;
    }
}

function resetMetricDistributionContainer() {
    labelDistContainer.resetInProgress = true;
    metricDistributionSubContainer.style.opacity = "0";
    metricDistributionSubContainer.style.display = "none";
    metricDistributionCoverContainer.style.display = "flex";

    setTimeout(() => {
        metricDistributionCoverContainer.style.opacity = "1";
    }, 0)

    labelDistributionContainer.style.height = labelDistContainer.height;
    
    setTimeout(() => {
        labelDistributionContainer.style.height = 'auto';
        labelDistContainer.resetInProgress = false;
    }, 500)

    labelDistributionContainer.style.padding = '15px';
    labelDistributionContainer.style.marginTop = '10px';
    labelDistributionContainer.style.opacity = '1';

    metricDistributionBackBtn.style.opacity = '0';
    
    metricDistributionContainer.style.marginBottom = '10px';
    metricDistributionContainer.classList.remove('expanded');
    flags.metricDistributionContainerExpanded = false;
}