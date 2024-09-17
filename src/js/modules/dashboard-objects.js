const dailyHours = Array.from({ length: 24 }, () => ({
    focusQualities: [],
    distractionsPerHour: [],
    deepWorkTimes: [],
    deepWork: 0,
    distractions: 0
}));

export const dashboardData = {
    sessionArr: [],
    dailyArr: [],
    dailySummary: {}, // NEW ADDITION
    weeklyArr: [], // weekly organized version of dailyArr
    currentWeekArr: [], // data for current week only
    hourlyArr: dailyHours,
    noteData: {}
}

export const general = {
    currentDay: null,
    chartTransition: 'all', // values: 'all', 'main-adjusted', 'main-break', 'adv-adjusted', 'adv-distractions', 'summary'
    lastMainChartTransition: 'all'
}

export const labelDistContainer = {
    timeFrame: 'week',
    lowerBound: null,
    upperBound: null,
    height: 'auto',
    resetInProgress: false
}

export const flags = {
    metricDistributionContainerExpanded: false,
    adjustedDeepWorkToggle: false,
    avgBreakIntervalToggle: false,
    distractionsToggle: false,
    hourlyQualityAdjustedToggle: false,
    quickerChartAnimations: false,
    summarySelected: false,
    populated365Arrs: false,
    mainChartsOpen: false,
    advChartsOpen: false,
    calendarPopupShowing: false,
    dailyArrowClicked: false,
    dashboardPopulated: false
}

export const charts = {
    deepWork: null,
    focusQuality: null,
    avgInterval: null,
    sessionIntervals: null,
    hourlyFocus: null,
    avgDeepWork: null,
    dayViewSummary: null
}

export const miniChartsArr = [null, null, null, null, null, null, null];

export const mainChartContainer = {
    timeFrame: 'week',
    lowerBound: null,
    upperBound: null
}

export const dailyContainer = {
    timeFrame: 'week', // this will not change
    lowerBound: null,
    upperBound: null,
    selectedDate: null,
    weeklyDatesArr: null,
    selectableCells: null,
    miniChartsSeen: false,
    dayViewSummaryChartSeen: false,
    weekIndex: 0,
}

export const calendarContainer = {
    month: null, // e.g. 3 --> march, 12 --> december
    year: null, // e.g. 2024
    selectedCellId: null
}

export const constants = {
    FOCUS_QUALITY_CONSTANT: 0.2
}