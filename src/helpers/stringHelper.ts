import bcrypt from 'bcryptjs';

export const textBreak = (text: string) => {
  if (text) {
    text = text.replace('&gt;','>');
    text = text.replace('&lt;','<');
    text = text.replace('&gt;','');
    text = text.replace('&lt;','');
  }
  return text.replaceAll('\n', '<br/>');
}

export const replaceEntityTags = (text: string, isRevert: boolean = false) => {
  if (text) {
    text = text.replaceAll('&gt;','>');
    text = text.replaceAll('&lt;','<');

    if (isRevert) {
      text = text.replaceAll('>','&gt;');
      text = text.replaceAll('<','&lt;');
    }
  }

  return text;
}

export const iframeToEntity = (tags: any) => {
  var tagsRegex = /(<\/iframe|<iframe|video|<video)/g;
  if (tags) {
    return tags.replaceAll(tagsRegex, function (tag: any) {
      return replaceEntityTags(tag, true);
    });
  }
}

export const getExtensionFromStr = (str: string) => {
  var pattern =/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;
  const match = str.match(pattern);
  if (match) {
    return match[0];
  }
  
  return false;
}

export const generateCryptId = (params?: any) => {
    const salt = bcrypt.genSaltSync(10) + Date.now();
    const arrayParams = Object.values(params);
    const strParams: any = arrayParams.reduce((paramPrev: any, paramNext: any) => {
        return paramPrev + paramNext;
    });

    const taskId = bcrypt.hashSync(strParams, salt);
    return taskId.replaceAll('/', '').replaceAll('.', '');
}