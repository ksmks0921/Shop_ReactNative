const isEmpty = string => string.trim() === '' ? true : false;
const isEmail = email => email.match(/.+@.+\..+/) ? true : false;

export function validateSignupData(data) {
  let errors = {};
  if(isEmpty(data.email)) {
    errors.email = 'Es obligatorio';
  } else if (!isEmail(data.email)) {
    errors.email = 'Invalid email';
  }
  if (isEmpty(data.name)) {
    errors.name = 'es obligatorio';
  }
  if (isEmpty(data.phone)) {
    errors.phone = 'es obligatorio';
  }
  if (isEmpty(data.last_name)) {
    errors.last_name = 'es obligatorio';
  }
  if (isEmpty(data.password)) {
    errors.password = 'es obligatorio';
  }

  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true
  }
}


export function validateLoginData(data) {
  let errors = {};
  if (isEmpty(data.email)) {
    errors.email = 'es obligatorio';
  } else if (!isEmail(data.email)) {
    errors.email = 'Invalid email';
  }
  if (isEmpty(data.password)) {
    errors.password = 'es obligatorio';
  }
  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true
  }
}

export function validateSippingData (data) {
  let errors = {}
  if (isEmpty(data.contact_name)) {
    errors.contact_name = 'es obligatorio';
  }
  if (isEmpty(data.street)) {
    errors.street = 'es obligatorio';
  }
  if (isEmpty(data.num_ext)) {
    errors.num_ext = 'es obligatorio';
  }
  // if (isEmpty(data.num_int)) {
  //   errors.num_int = 'es obligatorio';
  // }
  if (isEmpty(data.phone)) {
    errors.phone = 'es obligatorio';
  }
  if (isEmpty(data.cellphone)) {
    errors.cellphone = 'es obligatorio';
  }
  if (isEmpty(data.zipcode)) {
    errors.zipcode = 'es obligatorio';
  }

  return {
    errors,
    valid: Object.keys(errors).length > 0 ? false : true
  }
}
/*export function reduceUserDetails(data) {
  const userDetails = {};
  if(!isEmpty(data.bio)) userDetails.bio = data.bio
  if(!isEmpty(data.location)) userDetails.location = data.location
  if(!isEmpty(data.website)) {
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`
    } else {
      userDetails.website = data.website
    }
  }

  return userDetails
}*/
