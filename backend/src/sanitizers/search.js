const { pick } = require('../utils/object');

/**
 * sanitizes the search suggestion data
 * @param {Object} data  - Received JSON from grab api
 * @returns Array<String> - List of suggestions
 */
const suggestion = (data) => {
  const { suggestions } = data;

  let sanitizedData = [];
  if (suggestions) {
    sanitizedData = suggestions.map((suggestion) => {
      if (suggestion.suggestType === 'QUERY') {
        const { query: { query } } = suggestion;
        return query;
      }
    }).filter(Boolean);
  }

  return sanitizedData || [];
};


const MERCHANT_DATA_KEYS = [
  'id',
  'address',
  'latlng',
  'merchantBrief',
  'chainID',
  'chainName',
  'branchMerchants',
  'branchName',
  'estimatedDeliveryFee',
  'dishes',
  'estimatedPickupTime',
  'discountPercentage',
  'businessType',
  'littleIconLabel',
  'customLabel'
];

const search = (data) => {
  let sanitizedData = [];

  const { searchResult } = data;

  if (searchResult) {
    const { searchMerchants } = searchResult;

    if (searchMerchants) {
      sanitizedData = searchMerchants.map((merchant) => {
        return pick(merchant, MERCHANT_DATA_KEYS);
      });
    }
  }

  return sanitizedData;
};

module.exports = { suggestion, search };
