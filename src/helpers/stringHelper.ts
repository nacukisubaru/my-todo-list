export const wrapLinksInTags = (text: string) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      return '<a target="blank" href="' + url + '">' + url + '</a>';
    });
}

export const textBreak = (text: string) => {
    return text.replaceAll('\n', '<br/>');
}