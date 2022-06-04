const HOST = 'https://p.grabtaxi.com';

const SEARCH_API = `${HOST}/api/passenger/v3/grabfood/search`;
const SEARCH_SUGGESTION_API = `${SEARCH_API}/suggestion`;

const USER_AGENT = 'Grab/5.203.200 (Android 7.0; Build 34232290)';

module.exports = {
  USER_AGENT,
  SEARCH_SUGGESTION_API,
  SEARCH_API
};
