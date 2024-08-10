import { labelDistributionContainer, metricDistributionContainer } from "../modules/dashboard-elements.js"
import { sessionState } from "../modules/state-objects.js"

document.addEventListener("stateUpdated", function() {
    if (sessionState.loggedIn) {
        metricDistributionContainer.addEventListener("click", function() {
            if (!metricDistributionContainer.classList.contains('expanded')) {
                expandMetricDistributionContainer();
                
            } else {
                resetMetricDistributionCotnainer();

            }
        })



    } else {


    }
})

function expandMetricDistributionContainer() {
    labelDistributionContainer.style.height = '0%';
    labelDistributionContainer.style.padding = '0px';
    labelDistributionContainer.style.marginTop = '0px';
    labelDistributionContainer.style.opacity = '0';

    metricDistributionContainer.style.marginBottom = '0px';
    metricDistributionContainer.classList.add('expanded');
}

function resetMetricDistributionCotnainer() {
    labelDistributionContainer.style.height = '50%';
    labelDistributionContainer.style.padding = '15px';
    labelDistributionContainer.style.marginTop = '10px';
    labelDistributionContainer.style.opacity = '1';

    metricDistributionContainer.style.marginBottom = '10px';
    metricDistributionContainer.classList.remove('expanded');
}