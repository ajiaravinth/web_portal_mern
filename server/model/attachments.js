const get_attachment = (path, name) => {
  return encodeURI(path.substring(2) + name);
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = {
  get_attachment: get_attachment,
  capitalizeFirstLetter: capitalizeFirstLetter,
};
