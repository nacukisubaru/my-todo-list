export const convertSecoundsToTimeString = (time: number) => {
    var date = new Date(0);
    date.setSeconds(time);
    var timeString = date.toISOString().substring(11, 19);
    return timeString;
}

export const convertTimeStringToSeconds = (time: string = '00:00:00') => {
    var seconds = new Date('1970-01-01T' + time + 'Z').getTime() / 1000;
    return seconds;
}