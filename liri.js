require('dotenv').config();
const fs = require('fs');
// require our helper functions
const {
  searchSpotify,
  searchOMDB,
  searchBandsInTown
} = require('./utils/helpers');

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
      doWhatItSays(searchTerm);
      break;
    default:
      console.log('Command not found.');
  }
};

// need to leave this here because we don't export dispatch
const doWhatItSays = () => {
  fs.readFile('random.txt', 'utf8', (err, data) => {
    console.log(data);
    if (err) {
      console.log(err);
    }

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
