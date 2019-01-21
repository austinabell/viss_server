import Joi from "joi";

export const createTask = Joi.object().keys({
  address: Joi.string()
    .required()
    .min(4)
    .max(50)
    .label("Address"),
  city: Joi.string()
    .required()
    .min(4)
    .max(50)
    .label("City"),
  province: Joi.string()
    .min(1)
    .max(50)
    .label("Province"),
  lat: Joi.number(),
  lng: Joi.number(),
  isAllDay: Joi.bool(),
  windowStart: Joi.string(),
  windowEnd: Joi.string(),
  duration: Joi.number()
    .min(0)
    .max(1440),
  notes: Joi.any()
});
