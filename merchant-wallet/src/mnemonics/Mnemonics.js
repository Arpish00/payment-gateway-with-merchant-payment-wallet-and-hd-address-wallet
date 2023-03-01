const axios = require('axios');

async function fetchMnemonic() {
  try {
    const response = await axios.get('http://localhost:5000/api/exportMnemonic');
    
    const mnemonic = await response.data;
    console.log('Exported mnemonic:', mnemonic);
    // Do something with the exported mnemonic string
    module.exports = {
      mnemonic
    };
  } catch (error) {
    console.error('Error fetching exported mnemonic:', error);
  }
}

fetchMnemonic();
