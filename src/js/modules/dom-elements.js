// ------------------------------
// DOM ELEMENTS & INITIAL SETUP
// ------------------------------
export const backgroundContainer = document.getElementById('backgroundContainer');
export const deepWorkBackground = document.getElementById('deepWorkBackground');
export const breakBackground = document.getElementById('breakBackground');
export const start_stop_btn = document.getElementById("start-stop");
export const submit_change_btn = document.getElementById("target-hours-submit");
export const target_hours_input = document.getElementById("target-hours"); // can probably omit
export const end_session_btn = document.getElementById("end_session_btn");
export const report_btn = document.getElementById("reportBtn");
export const progress = document.getElementById("progress");
export const total_time_display = document.getElementById("progress-text");
export const productivity_chill_mode = document.getElementById("productivity-chill-mode");
export const progressBarContainer = document.getElementById("progress-bar-container");
export const progressBar = document.getElementById("progress-bar");
export const progressContainer = document.getElementById("progress-container");
export const display = document.getElementById("display");
export const stopwatch = document.getElementById("stopwatch");
export const hyperChillTitle = document.getElementById("hyperChillTitle");
export const subMainContainer = document.getElementById("subMainContainer");
export const interruptionsContainer = document.getElementById("interruptions-container");
export const interruptionsSubContainer = document.getElementById("interruptions-sub-container");
export const interruptionsChangeContainer = document.getElementById('interruptions-change-container');
export const interruptionsLabel = document.getElementById("interruptions-label");
export const decBtn = document.getElementById("decBtn");
export const incBtn = document.getElementById("incBtn");
export const interruptionsNum = document.getElementById("interruptions_num");
export const suggestionBreakContainer = document.getElementById("suggestionBreakContainer");
export const suggestionBreak_label = document.getElementById("suggestionBreak-label");
export const suggestionBreak_min = document.getElementById("suggestionBreak-min");
export const completedPomodorosContainer = document.getElementById("completedPomodorosContainer");
export const completedPomodoros_label = document.getElementById("completedPomodoros-label");
export const completedPomodoros_min = document.getElementById("completedPomodoros-min");
export const pomodoroInfoTooltip = document.getElementById("pomodoro-info-tooltip");
export const targetHoursContainer = document.getElementById("targetHoursContainer");
export const targetHoursInterruptionsContainer = document.getElementById("targetHoursInterruptionsContainer");
export const timekeepingContainer = document.getElementById("timekeeping-container");
export const lowerButtons = document.getElementById('lowerButtons');
export const popupMenu = document.getElementById("popupMenu");
export const settingsContainer = document.getElementById("settingsContainer");
export const notesContainer = document.getElementById("notes-container");
export const aboutContainer = document.getElementById("aboutContainer");
export const blogContainer = document.getElementById("blogContainer");
export const blackFlowtimeBackground = document.getElementById("black-flowtime");
export const blackChilltimeBackground = document.getElementById("black-chilltime");
export const targetTimeReachedToggle = document.getElementById("targetTimeReachedToggle");
export const breakSuggestionToggle = document.getElementById("breakSuggestionToggle");
export const suggestionMinutesInput = document.getElementById("suggestionMinutesInput");
export const flowmodoroNotificationToggle = document.getElementById("flowmodoroNotificationToggle");
export const flowmodoroNotifications = document.getElementById("flowmodoroNotifications");
export const flowmodoroNotificationInfoWindow = document.getElementById("flowmodoroNotificationInfoWindow");
export const flowTimeBreakNotification = document.getElementById("flowTimeBreakNotification");
export const flowTimeBreakNotificationInfoWindow = document.getElementById("flowTimeBreakNotificationInfoWindow");
export const pomodoroNotifications = document.getElementById("pomodoroNotifications");
export const pomodoroNotificationInfoWindow = document.getElementById("pomodoroNotificationInfoWindow");
export const notesAutoSwitch = document.getElementById("notesAutoSwitch");
export const notesAutoSwitchInfoWindow = document.getElementById("notesAutoSwitchInfoWindow");
export const propagateUnfinishedTasksInfoWindow = document.getElementById('propagateUnfinishedTasksInfoWindow');
export const propagateUnfinishedTasks = document.getElementById('propagateUnfinishedTasks');
export const timestampsInfoWindow = document.getElementById('timestampsInfoWindow');
export const timestampsHeader = document.getElementById('timestampsHeader');
export const timestampsToggle = document.getElementById('timestampsToggle');

export const pomodoroNotificationToggle = document.getElementById("pomodoroNotificationToggle");
export const pomodoroNotificationToggleBall = document.getElementById("pomodoroNotificationToggleBall");
export const autoStartPomodoroIntervalToggle = document.getElementById("autoStartPomodoroIntervalToggle");
export const autoStartBreakIntervalToggle = document.getElementById("autoStartBreakIntervalToggle");
export const defaultThemeContainer = document.getElementById("defaultThemeContainer");
export const defaultTheme = document.getElementById("defaultTheme");
export const darkThemeContainer = document.getElementById("darkThemeContainer");
export const darkGrayTheme = document.getElementById("darkGrayTheme");
export const targetTimeReachedAlert = document.getElementById("targetTimeReachedAlert");
export const transitionClockSoundToggle = document.getElementById("transitionClockSoundToggle");
export const flowTimeAnimationToggle = document.getElementById("flowTimeAnimationToggle");
export const chillTimeAnimationToggle = document.getElementById("chillTimeAnimationToggle");
export const pomodoroVolumeContainer = document.getElementById("pomodoroVolumeContainer");
export const pomodoroVolumeBar = document.getElementById('pomodoroVolumeBar');
export const pomodoroVolumeThumb = document.getElementById('pomodoroVolumeThumb');
export const flowmodoroVolumeContainer = document.getElementById("flowmodoroVolumeContainer");
export const flowmodoroVolumeBar = document.getElementById('flowmodoroVolumeBar');
export const flowmodoroVolumeThumb = document.getElementById('flowmodoroVolumeThumb');
export const generalVolumeContainer = document.getElementById("generalVolumeContainer");
export const generalVolumeBar = document.getElementById('generalVolumeBar');
export const generalVolumeThumb = document.getElementById('generalVolumeThumb');
export const pomodoroVolumeContainer2 = document.getElementById("pomodoroVolumeContainer2");
export const pomodoroVolumeBar2 = document.getElementById('pomodoroVolumeBar2');
export const pomodoroVolumeThumb2 = document.getElementById('pomodoroVolumeThumb2');
export const flowmodoroVolumeContainer2 = document.getElementById("flowmodoroVolumeContainer2");
export const flowmodoroVolumeBar2 = document.getElementById('flowmodoroVolumeBar2');
export const flowmodoroVolumeThumb2 = document.getElementById('flowmodoroVolumeThumb2');
export const generalVolumeContainer2 = document.getElementById("generalVolumeContainer2");
export const generalVolumeBar2 = document.getElementById('generalVolumeBar2');
export const generalVolumeThumb2 = document.getElementById('generalVolumeThumb2');
export const flowmodoroRadios = document.querySelectorAll('.flowmodoroAlert');
export const flowmodoroInputs = document.querySelectorAll('.flowmodoroBreak');
export const generalRadios = document.querySelectorAll('.generalAlert');
export const pomodoroInputs = document.querySelectorAll('.pomodoroInterval')
export const pomodoroRadios = document.querySelectorAll('.pomodoroAlert');
export const flowtimeBackgroundCells = document.querySelectorAll('.flowtimeBackgroundCell');
export const flowtimeBackgroundWorldCells = document.querySelectorAll('.flowtimeBackgroundWorldCell');
export const chilltimeBackgroundCells = document.querySelectorAll('.chilltimeBackgroundCell');
export const chilltimeBackgroundWorldCells = document.querySelectorAll('.chilltimeBackgroundWorldCell');
export const settings_menu_container = document.getElementById("settingsMenuContainer");
export const registerHereText = document.getElementById("registerHereText");
export const backgroundVideo = document.getElementById('background-video');
export const flowAnimation = document.getElementById("flowAnimation");
export const chillAnimation = document.getElementById("chillAnimation");
export const createLabelInput = document.getElementById("create-label-input");
export const updateLabelInput = document.getElementById("update-label-input");
export const emojiContainer = document.getElementById("emoji-container");
export const menuBtn = document.getElementById("menuBtn");
export const blogBtn = document.getElementById("blogBtn");
export const blog_icon = document.getElementById("blogIcon"); // icon in popup-menu
export const about_btn = document.getElementById("aboutBtn");
export const about_icon = document.getElementById("aboutIcon");
export const about_menu_container = document.getElementById("aboutMenuContainer");
export const settings_btn = document.getElementById("settingsBtn");
export const settings_icon = document.getElementById("settingsIcon");
export const logInOut_btn = document.getElementById("logInOutBtn");
export const login_icon = document.getElementById("loginIcon");
export const login_menu_container = document.getElementById("loginMenuContainer");
export const about_exit = document.getElementById("aboutExit");
export const blog_exit = document.getElementById("blogExit");
export const blog_post_exit = document.getElementById("blogPostExit");
export const blog_post_back = document.getElementById("blogPostBack");
export const back_icons = document.querySelectorAll(".backIcon");
export const exit_icons = document.querySelectorAll(".exitIcon");
export const main_elements = document.querySelector("main");
export const blog_post_container = document.getElementById("blogPostContainer");
export const blog_cells = document.querySelectorAll(".blog_cell");
export const blogs = document.querySelectorAll(".blog");
export const settings_exit = document.getElementById("settingsExit");
export const pomodoroBtnContainer = document.getElementById("pomodoroBtnContainer");
export const backgroundsBtnContainer = document.getElementById("backgroundsBtnContainer");
export const dashboardBtnContainer = document.getElementById("dashboardBtnContainer");
export const reportIcon = document.getElementById("report-icon");
export const reportPath = document.getElementById("report-path");
export const spaceIcon = document.getElementById("space-icon"); // icon in three way toggle
export const homeIcon = document.getElementById("home-icon");
export const threeWayToggle = document.getElementById("threeWayToggle");
export const blogMenuContainer = document.getElementById("blogMenuContainer");
export const aboutIconNotes = document.getElementById('aboutIconNotes');
export const body = document.body;
export const taskContainer = document.getElementById("task-container");
export const promptContainer = document.getElementById("prompt-container");
export const labelInputContainer = document.getElementById("label-input-container");
export const createLabelContainer = document.getElementById("create-label-container");
export const createLabelWindow = document.getElementById("create-label-window");
export const createLabelDone = document.getElementById("create-label-done");
export const createLabelCancel = document.getElementById("create-label-cancel");
export const updateLabelContainer = document.getElementById("update-label-container");
export const updateLabelWindow = document.getElementById("update-label-window");
export const updateLabelCancel = document.getElementById('update-label-cancel');
export const updateLabelDone = document.getElementById('update-label-done');
export const labelSelectionWindow = document.getElementById("label-selection-window");
export const labelSelectionRow = document.querySelector('.label-selection-row');
export const clearIcon = document.getElementById("clearIcon");
export const notesBtn = document.getElementById("notes");
export const notesConsole = document.getElementById("notes-console");
export const taskPrompt = document.getElementById("task-prompt");
export const tagIcon = document.getElementById("tag-icon");
export const tagSelection = document.querySelectorAll('.selection-tag');
export const tagSelectionDivider = document.getElementById('tag-selection-divider');
export const addDoneContainer = document.getElementById('add-done-container');
export const selectionDoneDiv = document.getElementById('selection-done-div');
export const selectionDone = document.getElementById('selection-done');
export const addTagIcon = document.getElementById("add-tag-icon");
export const emojiBtn = document.getElementById("emoji-btn");
export const emojiBtn2 = document.getElementById("emoji-btn2");
export const emojiImg = document.getElementById("OGemoji");
export const emojiImg2 = document.getElementById("OGemoji2");
export const emojiSymbols = document.querySelectorAll('.emoji-symbol');
export const transitionNotesAutoSwitchToggle = document.getElementById('transitionNotesAutoSwitchToggle');
export const propagateUnfinishedTasksToggle = document.getElementById('propagateUnfinishedTasksToggle');
export const tutorialImgContainers = document.querySelectorAll('.tutorialImgContainer');
export const notesBtnContainer = document.getElementById("notesBtnContainer");
export const flowmodoroBtnContainer = document.getElementById("flowmodoroBtnContainer");
export const notesSettingsHr1 = document.getElementById('notesSettingsHr1');
export const notesSettingsHr2 = document.getElementById('notesSettingsHr2');
export const addingDeletingUpdatingLabelsInfoBlock = document.getElementById('addingDeletingUpdatingLabelsInfoBlock');
export const addNoteTaskContainer = document.getElementById("add-note-task-container");
export const noteTaskInputContainer = document.getElementById("note-task-input-container");
export const noteTaskInputText = document.getElementById("note-task-input-text");
export const noteInputCancelBtn = document.getElementById("note-input-cancel-btn");
export const noteInputSaveBtn = document.getElementById("note-input-save-btn");
export const taskCheckbox = document.getElementById('taskCheckbox');
export const dynamicList = document.getElementById('dynamicList');
export const textarea = document.getElementById('note-task-input-text');
export const clearNotesConsoleBtn = document.getElementById('clearNotesConsoleBtn');

export const loginEmailInput = document.getElementById("loginEmailInput");
export const loginPasswordInput = document.getElementById("loginPasswordInput");
export const forgotPasswordContainer = document.getElementById("forgotPasswordContainer");
export const loginBtnContainer = document.getElementById("loginBtnContainer");
export const loginBtn = document.getElementById("loginBtn");
export const logoutBtn = document.getElementById("logoutBtn");
export const deleteAccountBtn = document.getElementById("deleteAccountBtn");
export const forgotPasswordSettings = document.getElementById("forgotPasswordSettings");

export const overlayExit = document.getElementById("overlayExit");
export const popupOverlay = document.getElementById("popupOverlay");
export const deleteAccountPopup = document.getElementById("deleteAccountPopup");
export const deleteAccountPopupYesBtn = document.getElementById("deleteAccountPopupYesBtn");
export const deleteAccountPopupNoBtn = document.getElementById("deleteAccountPopupNoBtn");

export const questionIcon = document.getElementById("questionIconContainer");
export const popupQuestionMenu = document.getElementById("popupQuestionMenu");

export const settingsGUIContainer = document.getElementById("settingsGUIContainer");
export const darkLightThemeGUIContainer = document.getElementById("darkLightThemeGUIContainer");
export const displayGUIContainer = document.getElementById("displayGUIContainer");

export const openEyeContainer = document.getElementById("openEyeContainer");
export const closedEyeContainer = document.getElementById("closedEyeContainer");

export const streaksContainer = document.getElementById("streaksContainer");
export const streaksLoginSuggestionPopup = document.getElementById("streaksLoginSuggestionPopup");
export const streaksCount = document.getElementById("streaksCount");

export const loginQuestionMenuContainer = document.getElementById("loginQuestionMenuContainer");
export const privacyPolicyContainer = document.getElementById("privacyPolicyContainer");
export const termsAndConditionsContainer = document.getElementById("termsAndConditionsContainer");
export const shortcutsContainer = document.getElementById("shortcutsContainer");
export const shortcutsPopup = document.getElementById("shortcutsPopup");

export const accountPopup = document.getElementById("accountPopup");
export const goBackContainer = document.getElementById("goBackContainer");
export const logoutBtnContainer2 = document.getElementById("logoutBtnContainer2");
export const welcomeText = document.getElementById("welcomeText");
export const goBackBtn = document.getElementById("goBackBtn");
export const logoutBtn2 = document.getElementById("logoutBtn2");
export const dashboardContainer = document.getElementById("dashboardContainer");
export const spaceContainer = document.getElementById("spaceContainer");

export const confirmLabelDeletionPopup = document.getElementById("confirmLabelDeletionPopup");
export const labelToDeleteContainer = document.getElementById("labelToDeleteContainer");
export const confirmLabelDeletionYesBtn = document.getElementById("confirmLabelDeletionYesBtn");
export const confirmLabelDeletionNoBtn = document.getElementById("confirmLabelDeletionNoBtn");
export const confirmLabelDeletionText = document.getElementById("confirmLabelDeletionText");

export const previousSessionStartedPopup = document.getElementById("previousSessionStartedPopup");
export const previousSessionStartedOkBtn = document.getElementById("previousSessionStartedOkBtn");
export const invalidatePreviousSessionInput = document.getElementById("invalidatePreviousSessionInput");
export const quitCurrentSessionInput = document.getElementById("quitCurrentSessionInput");

export const sessionSummaryPopup = document.getElementById("sessionSummaryPopup");
export const multiSeriesPiePlotContainer = document.getElementById("multiSeriesPiePlotContainer");
export const summaryStats = document.querySelectorAll('.summaryStats');
export const sessionSummaryChart = document.getElementById('sessionSummaryChart');
export const deepWorkTime = document.getElementById('deepWorkTime');
export const focusPercentage = document.getElementById('focusPercentage');
export const commentsTextArea = document.getElementById('commentsTextArea');
export const sessionSummaryOkBtn = document.getElementById('sessionSummaryOkBtn');
export const subjectiveFeedbackDropdown = document.getElementById('subjectiveFeedbackDropdown');
export const HC_icon_session_summary = document.getElementById('HC_icon_session_summary');
export const commentsContainer = document.getElementById('commentsContainer');
export const HC_icon_signup_prompt = document.getElementById('HC_icon_signup_prompt');

export const sessionSummarySignupPromptPopup = document.getElementById('sessionSummarySignupPromptPopup');
export const signupPromptPopupBtn = document.getElementById('signupPromptPopupBtn');

export const toggleIntervalTime = document.getElementById('toggleIntervalTime');
export const toggleTotalTime = document.getElementById('toggleTotalTime');

export const intervalTimeInfoWindow = document.getElementById('intervalTimeInfoWindow');
export const totalTimeInfoWindow = document.getElementById('totalTimeInfoWindow');

export const intervalTimeToggle = document.getElementById('intervalTimeToggle');
export const totalTimeToggle = document.getElementById('totalTimeToggle');

export const muffinInfoWindow = document.getElementById('muffinInfoWindow');
export const toggleMuffin = document.getElementById('toggleMuffin');
export const muffinToggle = document.getElementById('muffinToggle');

export const cats = document.querySelectorAll('.sleepyCat');
export const catsContainer = document.getElementById('catsContainer');
export const zzz = document.getElementById("zzz");

export const darkContainer = document.getElementById("darkContainer");
export const lightContainer = document.getElementById("lightContainer");

export const pipIconContainer = document.getElementById("pip-icon-container");

export const supportEmail = document.getElementById("supportEmail");

export const sessionSummaryKitty1 = document.getElementById("sessionSummaryKitty1");
export const sessionSummaryKitty2 = document.getElementById("sessionSummaryKitty2");
export const sessionSummaryKitty3 = document.getElementById("sessionSummaryKitty3");

export const progressCatHead = document.getElementById('progressCatHead');
export const progressCatBody = document.getElementById('progressCatBody');
export const pipCatShadow = document.getElementById('pip-cat-shadow');
export const pipInfoText = document.getElementById('pip-info-text');

export const notesShortcutsContainer = document.getElementById('notesShortcutsContainer');

export let hoverTimer;
export var backgroundVideoSource = document.getElementById('background-video-source');
export var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
export const initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;

export const setDailyTargetHours = document.getElementById('setDailyTargetHours');
export const dailyTargetHoursDropdown = document.getElementById('dailyTargetHoursDropdown');
export const dailyTargetHoursInfoWindow = document.getElementById('dailyTargetHoursInfoWindow');
export const toggleAdvChartsSampleSize = document.getElementById('toggleAdvChartsSampleSize');
export const advChartsSampleSizeInfoWindow = document.getElementById('advChartsSampleSizeInfoWindow');
export const aboutIconSessionIntervalsChartBounds = document.getElementById('aboutIconSessionIntervalsChartBounds');
export const sessionIntervalsBoundsDemoPopup = document.getElementById('sessionIntervalsBoundsDemoPopup');
export const sessionIntervalsChartBoundsRadios = document.querySelectorAll('.sessionIntervalsChartBounds');

export const lowerBoundHourDropdown = document.getElementById('lowerBoundHourDropdown');
export const upperBoundHourDropdown = document.getElementById('upperBoundHourDropdown');

export const advChartsSampleSizeToggle = document.getElementById('advChartsSampleSizeToggle');

export const default24HoursBoundsInput = document.getElementById('default24HoursBoundsInput');
export const manualBoundsInput = document.getElementById('manualBoundsInput');
export const automaticBoundsInput = document.getElementById('automaticBoundsInput');

export const feedbackFormBtn = document.getElementById('feedbackFormBtn');

export const targetHoursQuestionIcon = document.getElementById('targetHoursQuestionIcon');
export const interruptionsQuestionIcon = document.getElementById('interruptionsQuestionIcon');

export const targetHoursQuestionPopup = document.getElementById('targetHoursQuestionPopup');
export const interruptionsQuestionPopup = document.getElementById('interruptionsQuestionPopup');

export const settingsDiscordBtn = document.getElementById('settingsDiscordBtn');
export const discordContainer = document.getElementById('discordContainer');