
export const getGroupFromUrl = (url = '') => {
  const group = url.replace(/^(.*?)group-/, '');
  const groupId = Number.parseFloat(group);
  return groupId;
};
