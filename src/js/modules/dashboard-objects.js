const dailyHours = Array.from({ length: 24 }, () => ({
    focusQualities: [],
    distractionsPerHour: [],
    deepWorkTimes: []
}));

export const dashboardData = {
    sessionArr: [],
    dailyArr: [],
    hourlyArr: dailyHours,
    noteData: {}
}

export const general = {
    currentDay: null
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
    disableChartAnimations: false
}

export const charts = {
    deepWork: null,
    focusQuality: null,
    avgInterval: null,
    sessionIntervals: null
}

export const mainChartContainer = {
    timeFrame: 'week',
    lowerBound: null,
    upperBound: null
}