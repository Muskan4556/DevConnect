import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

// Error handler middleware
const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateMyUserAuthRequest = [
  body("firstName")
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 4, max: 50 })
    .withMessage("First name must be between 4 and 50 characters"),

  body("lastName")
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ min: 6, max: 25 })
    .withMessage("Email must be between 6 and 25 characters"),

  body("password")
    .notEmpty()
    .isStrongPassword()
    .withMessage(
      "Password must be strong (min 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol)"
    )
    .isLength({ max: 64 })
    .withMessage("Password must be less than 64 characters"),

  body("age")
    .isInt({ min: 18, max: 80 })
    .withMessage("Age must be between 18 and 80")
    .optional(),

  body("gender")
    .optional()
    .isString()
    .withMessage("Gender must be a string")
    .isIn(["M", "F", "Others"])
    .withMessage("Gender must be one of: M, F, Others"),

  body("photoUrl")
    .optional()
    .isString()
    .withMessage("Photo URL must be a string")
    .trim()
    .isURL()
    .withMessage("Photo URL must be a valid URL"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ min: 4, max: 400 })
    .withMessage("Description must be between 4 and 400 characters"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array")
    .custom((arr) => arr.length <= 25)
    .withMessage("Skills array cannot have more than 25 items"),

  handleValidationErrors,
];

export const validateMyUserUpdateRequest = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .isLength({ min: 4, max: 50 })
    .withMessage("First name must be between 4 and 50 characters"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),

  body("password")
    .optional()
    .isStrongPassword()
    .withMessage(
      "Password must be strong (min 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol)"
    )
    .isLength({ max: 64 })
    .withMessage("Password must be less than 64 characters"),
  body("age")
    .optional()
    .isInt({ min: 18, max: 80 })
    .withMessage("Age must be between 18 and 80"),

  body("gender")
    .optional()
    .isString()
    .withMessage("Gender must be a string")
    .isIn(["M", "F", "Others"])
    .withMessage("Gender must be one of: M, F, Others"),

  body("photoUrl")
    .optional()
    .isString()
    .withMessage("Photo URL must be a string")
    .trim()
    .isURL()
    .withMessage("Photo URL must be a valid URL"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ min: 4, max: 400 })
    .withMessage("Description must be between 4 and 400 characters"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array")
    .custom((arr) => arr.length <= 25)
    .withMessage("Skills array cannot have more than 25 items"),

  handleValidationErrors,
];

export const validateMyUserLoginAuthRequest = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ min: 6, max: 25 })
    .withMessage("Email must be between 6 and 25 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 64 })
    .withMessage("Password must be less than 64 characters"),

  handleValidationErrors,
];

export const validateMyUserUpdatePasswordRequest = [
  body("oldPassword")
    .optional()
    .isString()
    .withMessage("Old password must be a string"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isStrongPassword()
    .withMessage(
      "New password must be strong (min 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol)"
    ),
  handleValidationErrors,
];

export const validateMyUserForgetPasswordRequest = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ min: 6, max: 25 })
    .withMessage("Email must be between 6 and 25 characters"),
  body("password")
    .notEmpty()
    .withMessage("New password is required")
    .isStrongPassword()
    .withMessage(
      "New password must be strong (min 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol)"
    ),
  handleValidationErrors,
];

export const validateSendConnectionRequest = [
  param("status")
    .isString()
    .trim()
    .notEmpty()
    .isIn(["ignored", "interested"])
    .withMessage("Status must be ignored or interested"),
  param("toUserId")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 24, max: 24 })
    .withMessage("ID is not valid"),
  handleValidationErrors,
];

export const validateReviewConnectionRequest = [
  param("status")
    .isString()
    .trim()
    .notEmpty()
    .isIn(["accepted", "rejected"])
    .withMessage("Status must be accepted or rejected"),
  param("requestId")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 24, max: 24 })
    .withMessage("ID is not valid"),
  handleValidationErrors,
];
