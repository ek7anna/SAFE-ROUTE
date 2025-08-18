// Initialize map
const map = L.map('map').setView([8.5590, 76.9065], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// API Keys (will be replaced by .env in production)
const WEATHER_API_KEY = '5c827784b4684e764ab0db346b3fc370';
const TOMTOM_API_KEY = 'iXOEKSTO2zh9fMskxAuNAMQV7xPoo3ym';

// Add test marker to verify map works
const testMarker = L.marker([8.5590, 76.9065]).addTo(map);
testMarker.bindPopup("<b>Map is working!</b><br>Loading real-time data...").openPopup();

// Real-time Weather Function
async function getWeather(lat, lng) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
        );
        return await response.json();
    } catch (error) {
        console.error("Weather API Error:", error);
        return null;
    }
}

// Real-time Traffic Function
async function getTrafficIncidents(bbox) {
    try {
        const response = await fetch(
            `https://api.tomtom.com/traffic/services/4/incidentDetails?bbox=${bbox}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay}}}&key=${TOMTOM_API_KEY}`
        );
        const data = await response.json();
        return data.incidents || [];
    } catch (error) {
        console.error("Traffic API Error:", error);
        return [];
    }
}

// Test API connection (combined real-time test)
async function testAPI() {
    try {
        // Test Weather API
        const weather = await getWeather(8.5590, 76.9065);
        if (!weather) throw new Error("Weather API failed");
        
        // Test Traffic API (using small bounding box around Trivandrum)
        const incidents = await getTrafficIncidents("76.80,8.50,77.00,8.60");
        
        // Update marker popup with real data
        testMarker.setPopupContent(`
            <b>Real-time Data Working!</b><br>
            <b>Weather:</b> ${weather.weather[0].main}<br>
            <b>Temp:</b> ${weather.main.temp}°C<br>
            <b>Traffic Incidents:</b> ${incidents.length}
        `);
        
        console.log("API Tests Successful:", { weather, incidents });
    } catch (error) {
        console.error("API Test Failed:", error);
        testMarker.setPopupContent(`
            <b>API Connection Issues</b><br>
            ${error.message}<br>
            (Using test data for demonstration)
        `);
        
        // Fallback test data
        return {
            weather: {
                main: { temp: 28 },
                weather: [{ main: "Clouds" }]
            },
            traffic: {
                incidents: []
            }
        };
    }
}

// Run the test
testAPI();

// Your existing routing functionality remains unchanged below...
// [Keep all your existing route planning code here]