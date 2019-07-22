require('dotenv').config();
// require our helper functions
const {
  searchSpotify,
  searchOMDB,
  searchBandsInTown,
  doWhatItSays
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
      // pass the dispatch func in as the callback
      doWhatItSays(dispatch);
      break;
    default:
      console.log('Command not found.');
  }
};

// run dispatch to start
dispatch(command, searchTerm);
