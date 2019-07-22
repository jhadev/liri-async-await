require('dotenv').config();
const keys = require('./keys.js');
const fs = require('fs');
const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');

const command = process.argv[2];
// searches might be multiple words so we have to turn anything from the 3rd index on in the array into a single string
const searchTerm = process.argv.slice(3).join(' ');

// this is like the control center for liri. it runs functions based on certain input
const dispatch = (command, searchTerm) => {
  switch (command) {
    case 'spotify-this':
      searchSpotify(searchTerm);
      break;
    case 'movie-this':
      searchOMDB(searchTerm);
      break;
    case 'concert-this':
      searchBandsInTown(searchTerm);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('Command not found.');
  }
};

const searchSpotify = async searchTerm => {
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

  try {
    // call spotify method with the parameters and action to run.
    const response = await spotify.search(params);

    const { items } = response.tracks;

    items.forEach(song => {
      // artists come back as an array of objects, we can use map to only get the name
      console.log(`
      Artist(s): ${song.artists.map(artist => artist.name)}
      Song: ${song.name}
      Preview URL: ${song.preview_url}
      Album: ${song.album.name}
      `);
    });
  } catch (err) {
    console.log(err);
  }
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
    console.log(`
    Title: ${data.Title}
    Year: ${data.Year}
    IMDB Rating: ${data.imdbRating}
    Country: ${data.Country}
    Language: ${data.Language}
    Plot: ${data.Plot}
    Actors: ${data.Actors}
    `);
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

      console.log(`
      Lineup: ${concert.lineup.join(', ')}
      Venue: ${concert.venue.name}
      Location: ${concert.venue.city}, ${concert.venue.region}, ${
        concert.venue.country
      }
      Date: ${date}
      `);
    });
    // catch is basically your .catch
  } catch (err) {
    console.log(err);
  }
};

const doWhatItSays = () => {
  fs.readFile('random.txt', 'utf8', (err, data) => {
    console.log(data);
    if (err) {
      console.log(err);
    }

    // THERE IS A POTENTIAL BUG HERE.
    // WILL CAUSE AN INFINITE LOOP

    const fileData = data.split(',');
    // same as saying const command = fileData[0] and const fileTerm = fileData[1] but we can do it inline.
    const [command, fileTerm] = fileData;

    if (fileData.length === 2) {
      dispatch(command, fileTerm);
    } else if (fileData.length === 1) {
      dispatch(command);
    } else {
      console.log('too many words for liri to understand.');
    }
  });
};

// run dispatch to start
dispatch(command, searchTerm);
