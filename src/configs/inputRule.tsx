const validateMessages = {
  required: "Please input your ${label}",
};

const noSpacialInputRule = [
  {
    pattern: new RegExp(/^[a-zA-Z0-9 ]*$/),
    message: "Can't use special character",
  },
  { required: true },
];

const requiredRule = [{ required: true }];
const latitudeRule = [
  {
    pattern: new RegExp(/^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/),
    message: "The input is not valid latitude or longitude!",
  },
]
const longitudeRule = [
  {
    pattern: new RegExp(/^-?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)$/),
    message: "The input is not valid latitude or longitude!",
  },
]
const emailRule = [
  {
    pattern: new RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ),
    message: "The input is not valid Email!",
  },
  {
    required: true,
    // message: "Please input your Email!",
  },
];
const emailRuleNotRequired = [
  {
    pattern: new RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ),
    message: "The input is not valid Email!",
  }
];

const resetPasswordRule = [
  { required: true },
  {
    pattern: new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-])[a-zA-Z0-9@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]{8,}$"
    ),
    message: (
      <span>
        Password must have at least 8 characters, 1 lowercase, 1 upper case, 1
        number and 1 special character.
      </span>
    ),
  },
];

const telRule = [
  {
    pattern: new RegExp(/^[0-9]*$/),
    message: "Only numbers",
  },
  {
    required: true,
  },
];

export {
  validateMessages,
  noSpacialInputRule,
  requiredRule,
  emailRule,
  resetPasswordRule,
  telRule,
  latitudeRule,
  longitudeRule,
  emailRuleNotRequired
};
