const keys = require('../keys');
const fs = require('fs');
const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');

// spotify function doesn't need to be defined as async because node-spotify-api accepts a callback in its search method.
const searchSpotify = searchTerm => {
  const spotify = new Spotify(keys.spotify);
  //if there is no song input then default to Lithium
  if (!searchTerm) {
    searchTerm = 'Lithium';
  }

  // the params object to pass into spotify search method. Defining it as a variable to make it easier to read
  const params = {
    type: 'track',
    query: searchTerm
  };

  // our callback function to pass into spotify search method which will handle printing data to the console.
  const action = (err, data) => {
    // if there's an error stop the code from running
    if (err) {
      throw err;
    }
    const { items } = data.tracks;

    items.forEach(song => {
      const dataString = `
      Artist(s): ${song.artists.map(artist => artist.name)}
      Song: ${song.name}
      Preview URL: ${song.preview_url}
      Album: ${song.album.name}
          `;
      // artists come back as an array of objects, we can use map to only get the name
      console.log(dataString);
      logDataToFile('./logs/spotifyLog.txt', dataString);
    });
  };
  // call spotify method with the parameters and action to run.
  spotify.search(params, action);
};

// axios returns a promise but we can use async await to make our code read more like
// synchronous code
// define your function as async and you await your async action inside the function.
const searchOMDB = async searchTerm => {
  if (!searchTerm) {
    searchTerm = 'Mr Nobody';
  }
  const url = `http://www.omdbapi.com/?t=${searchTerm}&y=&plot=short&apikey=ee5329ae`;

  try {
    // await a response from omdb using axios and store it in a variable
    const response = await axios.get(url);
    // all the good stuff is in data this is the same as saying const data = response.data.
    // instead we use object destructuring to grab the data object from response and store it in a variable
    const { data } = response;
    const dataString = `
    Title: ${data.Title}
    Year: ${data.Year}
    IMDB Rating: ${data.imdbRating}
    Country: ${data.Country}
    Language: ${data.Language}
    Plot: ${data.Plot}
    Actors: ${data.Actors}
    `;
    console.log(dataString);
    logDataToFile('./logs/movieLog.txt', dataString);
  } catch (err) {
    // log errors if there is an error
    console.log(err);
  }
};

const searchBandsInTown = async searchTerm => {
  if (!searchTerm) {
    searchTerm = 'Weezer';
  }

  const url = `https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=codingbootcamp`;
  // try block is basically your .then
  try {
    const response = await axios.get(url);
    const { data } = response;

    data.forEach(concert => {
      const date = moment(concert.datetime, 'YYYY-MM-DDTHH:mm:ss').format(
        'MM/DD/YYYY'
      );

      const dataString = `
      Lineup: ${concert.lineup.join(', ')}
      Venue: ${concert.venue.name}
      Location: ${concert.venue.city}, ${concert.venue.region}, ${
        concert.venue.country
      }
      Date: ${date}
      `;
      console.log(dataString);
      logDataToFile('./logs/concertLog.txt', dataString);
    });
    // catch is basically your .catch
  } catch (err) {
    console.log(err);
  }
};

const doWhatItSays = callback => {
  fs.readFile('random.txt', 'utf8', (err, data) => {
    console.log(data);
    if (err) {
      console.log(err);
    }

    const fileData = data.split(',');
    // same as saying const command = fileData[0] and const fileTerm = fileData[1] but we can do it inline.
    const [command, fileTerm] = fileData;

    if (fileData.length === 2) {
      callback(command, fileTerm);
    } else if (fileData.length === 1) {
      callback(command);
    } else {
      console.log("liri can't interpret this file");
    }
  });
};

const logDataToFile = (fileName, data) => {
  fs.appendFile(fileName, data, err => {
    if (err) {
      return console.log(err);
    }

    console.log(`${fileName} was updated`);
  });
};

// export all our functions

module.exports = {
  searchSpotify,
  searchBandsInTown,
  searchOMDB,
  logDataToFile,
  doWhatItSays
};
