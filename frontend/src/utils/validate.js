export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8)
    errors.push("Password must be at least 8 characters long");
  if (password.length > 50)
    errors.push("Password must not exceed 50 characters");
  if (!/[A-Z]/.test(password))
    errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password))
    errors.push("Password must contain at least one lowercase letter");
  if (!/\d/.test(password))
    errors.push("Password must contain at least one number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    errors.push(
      'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    );

  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length === 0 ? "Password is valid" : errors[0],
  };
};

export const validateEmail = (email) => {
  const errors = [];

  if (!email || email.trim() === "") {
    return {
      isValid: false,
      errors: ["Email is required"],
      message: "Email is required",
    };
  }

  const trimmedEmail = email.trim();
  if (trimmedEmail.length > 254)
    errors.push("Email address is too long (maximum 254 characters)");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail))
    errors.push("Please enter a valid email address");
  if (trimmedEmail.includes(".."))
    errors.push("Email cannot contain consecutive dots");

  const [localPart, domainPart] = trimmedEmail.split("@");
  if (localPart) {
    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      errors.push("Email cannot start or end with a dot before @");
    }
    if (localPart.length > 64) {
      errors.push("Email local part is too long (maximum 64 characters)");
    }
  }
  if (domainPart) {
    if (domainPart.startsWith("-") || domainPart.endsWith("-")) {
      errors.push("Domain cannot start or end with a hyphen");
    }
    const tld = domainPart.split(".").pop();
    if (!tld || tld.length < 2) {
      errors.push("Top-level domain must be at least 2 characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length === 0 ? "Email is valid" : errors[0],
    normalizedEmail: errors.length === 0 ? trimmedEmail.toLowerCase() : null,
  };
};
