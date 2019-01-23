/**
 * Encrypt key/value pairs that will be sent to back end...
 */
export const encryptReqData = (obj: {}) => {
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[encodeURIComponent(key)] = encodeURIComponent(obj[key]);
    }
  }
  return newObj;
};
