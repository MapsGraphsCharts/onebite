const axios = require('axios');
const fs = require('fs');

async function downloadVenues() {
    const venues = [];

    // iterate over the API using offset parameter
    const limit = 100;
    let offset = 0;
    let calls = 0;
    while (true) {
        // check if we've made 5 requests already
        if (calls >= 1000) break;

        const response = await axios.get(`https://api.onebite.app/venue?sort=-reviewStats.community.totalScore&limit=${limit}&offset=${offset}`, {
            headers: { 'Accept-Encoding': 'gzip' }, // enable gzip compression
        });
        const data = response.data;

        if (!data.length) break;

        venues.push(...data);
        offset += limit;
        calls++;
        console.log(offset);
    }

    // Get a list of all unique column names
    const columnNames = new Set();
    venues.forEach((venue) => {
        flattenObject(venue, columnNames, "");
    });

    // Convert the data to a CSV string
    const csvRows = [];
    csvRows.push(Array.from(columnNames).join(",")); // Add header row
    venues.forEach((venue) => {
        const csvRow = [];
        for (const columnName of columnNames) {
            const value = getObjectValue(venue, columnName);
            csvRow.push(value !== undefined ? value : "");
        }
        csvRows.push(csvRow.join(","));
    });
    const csvData = csvRows.join("\n");

    // write CSV data to file
    fs.writeFileSync('./venues1.csv', csvData);
}

function flattenObject(obj, columnNames, prefix) {
    for (const key in obj) {
        const value = obj[key];
        if (typeof value === "object" && value !== null) {
            flattenObject(value, columnNames, prefix + key + ".");
        } else {
            columnNames.add(prefix + key);
        }
    }
}

function getObjectValue(obj, path) {
    const parts = path.split(".");
    let value = obj;
    for (const part of parts) {
        if (value === undefined || value === null) {
            return undefined;
        }
        value = value[part];
    }
    return value;
}

downloadVenues();
