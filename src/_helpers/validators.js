import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  gender: Joi.string().valid("M", "F").required(),
  birthdate: Joi.date().required(),
  phone: Joi.string().min(7).max(15).required(),
  identification: Joi.string().min(4).max(30).required(),
  email: Joi.string().email().required(),

  password: Joi.alternatives().conditional("roles", {
    switch: [
      {
        is: Joi.array().items(Joi.string().valid("pac")).min(1),
        then: Joi.any().optional().allow(null, ""),
      },
    ],
    otherwise: Joi.string().min(6).required(),
  }),

  roles: Joi.array()
    .items(Joi.string().valid("admin", "admin_aux", "doc", "pac"))
    .min(1)
    .required(),
});

export const loginSchema = Joi.object({
  login: Joi.string().trim().required().disallow(""),
  password: Joi.string().required().disallow(""),
});
