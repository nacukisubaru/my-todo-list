export const textBreak = (text: string) => {
  text = text.replace('&gt;','>');
  text = text.replace('&lt;','<');
  text = text.replace('&gt;','');
  text = text.replace('&lt;','');
  return text.replaceAll('\n', '<br/>');
}

export const replaceEntityTags = (text: string, isRevert: boolean = false) => {
  text = text.replaceAll('&gt;','>');
  text = text.replaceAll('&lt;','<');

  if (isRevert) {
    text = text.replaceAll('>','&gt;');
    text = text.replaceAll('<','&lt;');
  }

  return text;
}

export const iframeToEntity = (tags: any) => {
  var tagsRegex = /(<\/iframe|<iframe)/g;
  return tags.replaceAll(tagsRegex, function (tag: any) {
    return replaceEntityTags(tag, true);
  });
}