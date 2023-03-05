const axios = require('axios');
const ObjectsToCsv = require('objects-to-csv');

async function downloadVenues() {
    const venues = [];

    // iterate over the API using offset parameter
    const limit = 100;
    let offset = 0;
    while (true) {
        const response = await axios.get(`https://api.onebite.app/venue?sort=-reviewStats.community.totalScore&limit=${limit}&offset=${offset}`, {
            headers: { 'Accept-Encoding': 'gzip' }, // enable gzip compression
        });
        const data = response.data;

        if (!data.length) break;

        venues.push(...data);
        offset += limit;
        console.log(offset)
   }

    // transform venues into CSV data
    const csvData = venues.map(({ id, name, address, city, state, postalCode, latitude, longitude }) => ({ id, name, address, city, state, postalCode, latitude, longitude }));

    // write CSV data to file
    const csv = new ObjectsToCsv(csvData);
    await csv.toDisk('./venues.csv');
}

downloadVenues();
