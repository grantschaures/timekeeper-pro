export const chimePath = 'sounds/alerts/LEX_LM_77_bell_loop_vinyl_night_F.wav';
export const bellPath = 'sounds/alerts/ESM_Christmas_Glockenspiel_Bell_Pluck_Hit_Single_9_Wet_Perc_Tonal.wav';
export const clock_tick = new Audio('sounds/new_clock_tick.wav');

var chime = new Audio('sounds/empty.wav');
var bell = new Audio('sounds/empty.wav');

export var soundMap = {
    NoAlert: null,
    Chime: chime,
    Bell: bell
};