export function validateName(value) {
  const name = value.trim();

  if (!name) {
    return "Name is required.";
  }

  if (name.length < 2 || name.length > 80) {
    return "Please enter a name between 2 and 80 characters.";
  }

  if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(name)) {
    return "Please enter a valid name.";
  }

  return "";
}

export function validateEmail(value) {
  const email = value.trim();

  if (!email) {
    return "Email address is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return "Please enter a valid email address.";
  }

  return "";
}

export function validatePassword(value) {
  if (!value) {
    return "Password is required.";
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
    return "Password must contain uppercase, lowercase, number, and special character.";
  }

  return "";
}

export function validateConfirmPassword(password, confirmation) {
  if (!confirmation) {
    return "Please confirm your password.";
  }

  if (password !== confirmation) {
    return "Passwords do not match.";
  }

  return "";
}

const DEFAULT_USERS = [
  {
    id: 1,
    name: "Legal Metrology Authority",
    email: "admin@example.com",
    password: "Admin@123",
    role: "authority",
  },
  {
    id: 2,
    name: "Field Officer",
    email: "inspector@example.com",
    password: "Inspector@123",
    role: "inspector",
  },
];

export function readRegisteredUsers() {
  try {
    const storedUsers = localStorage.getItem("registeredUsers");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    if (Array.isArray(users) && users.length > 0) {
      // Merge with default users to guarantee demo accounts are always present
      const emails = new Set(users.map((u) => u.email));
      const merged = [...users];
      for (const defUser of DEFAULT_USERS) {
        if (!emails.has(defUser.email)) {
          merged.push(defUser);
        }
      }
      return merged;
    }
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}
