const SearchService = require('../services/search');

const search = async (req, res) => {
  const { keyword, latlng, searchId, offset } = req.body;

  try {
    const data = await SearchService.search({ keyword, latlng, searchId, offset });
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send();
  }
};

const suggestion = async (req, res) => {
  const { latlng, keyword } = req.query;

  let latlngArr = latlng.split(',');

  const latitude = parseFloat(latlngArr[0], 10);
  const longitude = parseFloat(latlngArr[1], 10);

  try {
    const data = await SearchService.suggestion({ latitude, longitude, keyword });
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send();
  }
};

module.exports = { search, suggestion };
