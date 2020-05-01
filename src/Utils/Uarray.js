// Utility methods for javascript objects.


class Uarray {

  static removeDuplicates(array) {
    return array.filter(function (value, index) {
      return array.indexOf(value) === index;
    })
  }

  // Sorting an array in ascending order
  static sortAsc(array) {
    return array.sort(function (a,b) {return a-b;})
  }

  static getValuesByIndexes(data, indexArr) {
    return indexArr.map(function (i) {
      return data[i]
    })
  }

}

export default Uarray;
