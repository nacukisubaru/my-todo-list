export const arrayUniqueByKey = (array:any, key = 'id') => {
    const map:any = Map;
    const arrayUniqueByKey = [
        ...new map(array.map((item: { [x: string]: any; }) => [item[key], item])).values()
    ];

    return arrayUniqueByKey;
}
  
export const uniqueList = (array: any[]) => {
    function onlyUnique(value: any, index: number, array: any[]) {
        return array.indexOf(value) === index;
    }

    return array.filter(onlyUnique);
}

export const shuffle = (array: any[]) => {
    let currentIndex = array.length,  randomIndex = array.length * 100;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
  