const axios = require('axios');
const config = require('config');
const { uuid } = require('uuidv4');
const { SEARCH_API, SEARCH_SUGGESTION_API, USER_AGENT } = require('../utils/constants');

const SESSION_ID = config.get('sessionId');

const HEADERS = {
  'X-Mts-Ssid': SESSION_ID,
  'User-Agent': USER_AGENT,
  'Accept-Language': 'en-US;q=1.0, en;q=0.9',
  'X-Request-Id': uuid(),
};

const suggestion = async ({ latitude = '', longitude = '', keyword = '' } = {}) => {
  let url = new URL(SEARCH_SUGGESTION_API);
  url.searchParams.append('latitude', latitude);
  url.searchParams.append('longitude', longitude);
  url.searchParams.append('keyword', keyword);
  url.searchParams.append('poiID', 'IT.0AGEMVY6Q9KD0');

  url = url.toString();

  try {
    const { data } = await axios.get(url, {
      headers: HEADERS
    });

    return data;
  } catch (err) {
    throw err;
  }
};

const search = async ({ latlng = '', keyword = '', searchId = '', offset = 0 } = {}) => {
  const params = new URLSearchParams();
  params.append('latlng', latlng);
  params.append('keyword', keyword);
  params.append('searchID', searchId);
  params.append('offset', offset);
  params.append('pageSize', 20);
  params.append('source', 'autocomplete');
  params.append('requireSortAndFilters', true);
  params.append('dryrunSortAndFilters', false);
  params.append('enableServiceBasedMenu', false);
  params.append('poiID', 'IT.0AGEMVY6Q9KD0');
  params.append('searchIntent', '');

  const postData = params.toString();

  try {
    const { data } = await axios.post(SEARCH_API, postData, {
      headers: HEADERS
    });

    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = { suggestion, search };
