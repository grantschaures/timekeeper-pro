const express = require("express");
const router = require("express").Router();
require('dotenv').config();

// telling the router to use the JSON parsing middleware for all routes under this router
router.use(express.json());

const IP_INFO_TOKEN = process.env.IP_INFO_TOKEN;

async function getIpInfo(ip) {
    try {
        const response = await fetch(`https://ipinfo.io/${ip}/json?token=${IP_INFO_TOKEN}`);
        const data = await response.json();

        console.log(ip);

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

        // console.log(locationInfo);

        return locationInfo;

    } catch (error) {
        console.error('Error fetching location information:', error);
        throw error;
    }
}

router.get('/location', async (req, res) => {
    const ip = req.ip; // Use the request IP address
    try {
        const locationInfo = await getIpInfo(ip);
        res.json(locationInfo);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching location information' });
    }
});

module.exports = router;