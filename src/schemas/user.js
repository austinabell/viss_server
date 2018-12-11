import Joi from "joi";

export default Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .label("Email"),
  username: Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .required()
    .label("Username"),
  name: Joi.string()
    .max(254)
    .required()
    .label("Name"),
  password: Joi.string()
    .min(8)
    .max(50)
    .label("Password") // Add regex for pw
});
