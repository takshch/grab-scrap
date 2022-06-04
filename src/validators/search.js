const Joi = require('joi');
const { isUuid } = require('uuidv4');

const simplifyErrorMessage = (message) => message.replace(/"/g, '');

const validateLatLang = (value, helper) => {
  if (value.includes(' ')) {
    return helper.message('Invalid latlng');
  }

  const latlng = value.split(',');
  if (latlng.length !== 2) {
    return helper.message('Invalid latlng');
  }

  const lat = parseFloat(latlng[0], 10);
  const lng = parseFloat(latlng[1], 10);

  if (!(typeof lat === 'number' && typeof lng === 'number')) {
    return helper.message('Invalid latlng');
  }

  return true;
};

const search = async (req, res, next) => {
  const schema = Joi.object().strict().keys({
    keyword: Joi.string().required().min(1),
    latlng: Joi.string().custom(validateLatLang).required(),
    offset: Joi.number().optional(),
    searchId: Joi.string().custom((value, helper) => {
      if (!isUuid(value)) {
        return helper.message('Invalid searchId');
      }

      return true;
    }).optional(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    const message = simplifyErrorMessage(err.details[0].message);
    res.status(400).send({ message });
  }
}

const suggestion = async (req, res, next) => {
  const schema = Joi.object().strict().keys({
    keyword: Joi.string().required().min(1),
    latlng: Joi.string().custom(validateLatLang).required(),
  });

  try {
    await schema.validateAsync(req.query);
    next();
  } catch (err) {
    const message = simplifyErrorMessage(err.details[0].message);
    res.status(400).send({ message });
  }
}

module.exports = { search, suggestion };
