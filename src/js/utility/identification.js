export const userAgent = navigator.userAgent;
export const userDevice = getDeviceType();
export const userLocationInfo = getLocationInfo();

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

async function getLocationInfo() {
    try {
        const response = await fetch('/api/info/location');
        const data = await response.json();

        const locationInfo = {
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
            postal: data.postal,
            loc: data.loc,
            org: data.org,
            timezone: data.timezone
        };

        console.log(locationInfo);

        return locationInfo;

    } catch (error) {
        console.error('Error fetching location information:', error);

        return "There was an error fetching the location info";
    }
}