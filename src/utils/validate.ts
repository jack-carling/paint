// Check name
export const validateName = (name: string) => {
  const nameRE = new RegExp(/^[a-zA-Z0-9åäöÅÄÖ-]+\s?[a-zA-Z0-9åäöÅÄÖ-]+$/);
  if (name.length < 3) {
    return { success: false, message: 'Name needs to be at least 3 characters.' };
  }
  if (!nameRE.test(name)) {
    return { success: false, message: 'Name is not valid.' };
  }
  if (name.length > 20) {
    return { success: false, message: 'Name cannot be longer than 20 characters.' };
  }
  return { success: true, message: '' };
};

// Check password
export const validatePassword = (password: string) => {
  if (password.length < 8) {
    return { success: false, message: 'Password needs to be at least 8 characters.' };
  }
  return { success: true, message: '' };
};

// Check email
export const validateEmail = (email: string) => {
  const emailRE = new RegExp(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );
  if (!emailRE.test(email)) {
    return { success: false, message: 'Email is not valid.' };
  }
  return { success: true, message: '' };
};
