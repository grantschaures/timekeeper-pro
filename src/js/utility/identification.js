export const userAgent = navigator.userAgent;
export const userDevice = getDeviceType();

function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Regular expressions to match different types of devices
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    if (/mobile|android|touch|webos|hpwos/i.test(userAgent)) {
        return "Mobile";
    }
    if (/tablet|iPad|playbook|silk/.test(userAgent) || (navigator.maxTouchPoints > 1)) {
        return "iPad or Tablet";
    }
    return "Desktop";
}