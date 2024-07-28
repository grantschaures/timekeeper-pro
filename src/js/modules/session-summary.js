import { multiSeriesPiePlotContainer, popupOverlay, sessionSummaryChart, sessionSummaryPopup, summaryStats } from "./dom-elements.js";

export function displaySessionSummaryPopup(sessionId) {
    console.log("displaying session summary popup");
    console.log(sessionId);

    // fade in the sessionSummaryPopup
    popupOverlay.style.display = 'flex';
    sessionSummaryPopup.style.display = 'flex';
    setTimeout(() => {
        sessionSummaryPopup.style.opacity = 1;
        multiSeriesPiePlotContainer.style.opacity = 1;
        sessionSummaryChart.style.opacity = 1;
        summaryStats.forEach(container => {
            container.style.opacity = 1;
        })
        document.dispatchEvent(new Event('triggerSessionSummaryChartAnimation'));
    }, 100);
}