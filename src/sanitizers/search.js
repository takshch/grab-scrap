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

module.exports = { suggestion };
