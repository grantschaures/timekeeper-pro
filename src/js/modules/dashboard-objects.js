const dailyHours = Array.from({ length: 24 }, () => ({
    focusQualities: [],
    distractionsPerHour: [],
    deepWorkTimes: []
}));

export const dashboardData = {
    sessionArr: [],
    dailyArr: [],
    hourlyArr: dailyHours
}

export const labelDistContainer = {
    timeFrame: 'week',
    currentDay: null,
    lowerBound: null,
    upperBound: null
}