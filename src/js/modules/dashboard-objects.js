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
    hourlyArr: dailyHours,
    noteData: {}
}

export const general = {
    currentDay: null,
    chartTransition: 'all' // values: 'all', 'main-adjusted', 'main-break', 'adv-adjusted', 'adv-distractions'
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
    quickerChartAnimations: false
}

export const charts = {
    deepWork: null,
    focusQuality: null,
    avgInterval: null,
    sessionIntervals: null,
    hourlyFocus: null,
    avgDeepWork: null
}

export const mainChartContainer = {
    timeFrame: 'week',
    lowerBound: null,
    upperBound: null
}

export const constants = {
    FOCUS_QUALITY_CONSTANT: 0.2
}