'use -strict';
var lastTransposeX = 0;
var lastTransposeY = 0;

export const processedImage = (fileString) => {
  let imageArray = [];
  let x = 0;
  let y = 0;
  let len = fileString.length;
  for (let i = 0; i < len; i++) {
    if (fileString[i] === '+') {
      imageArray.push([x, y, true, fileString[i]]);
    } else {
      imageArray.push([x, y, false, fileString[i]]);
    }
    x++;
    if (fileString[i] === '\n') {
      x = 0;
      y++;
    }
  }
  return imageArray;
}

export const processedImageAfter = (fileString, matchArray) => {

  var rowValue = fileString[fileString.length - 1][0];
  let imageArray = [];
  let len = fileString.length;

  var isFind = false;
  imageArray = Object.assign([], fileString);
  for (let i = 0; i < matchArray.length; i++) {
    for (var row = 0; row < len; row++) {
      if (imageArray[row][0] + '.' + imageArray[row][1] === matchArray[i] && imageArray[row][3] === '+') {
        imageArray[row] = [imageArray[row][0], imageArray[row][1], true, '#'];
      }

      if (fileString[row][3] === ' ') {
        imageArray[row] = [imageArray[row][0], imageArray[row][1], false, ' '];
      }
    }
  }
  return imageArray;
}

export const retreiveTestImage = (fileString, target) => {
  lastTransposeX = 0;
  lastTransposeY = 0;
  var rowValue = fileString[fileString.length - 1][0];
  var colValue = fileString[fileString.length - 1][1];
  var targetsFound = [];
  var testDataIndex = [];
  // Mapping testData Index and assigning to true.
  indexMapping(fileString, testDataIndex);
  let matchedArray = [];
  var matchArray = [];
  for (var col = 0; col <= colValue; col++) {
    for (var row = 0; row <= rowValue; row++) {
      transpose(row, col, target);
      var targetIndex = [];
      indexMapping(target, targetIndex);

      var totalPoints = 0,
        matches = 0;
      for (let i in targetIndex) {
        if (testDataIndex[i] === true) {
          matchedArray.push(i);
          matches++;
        }
        totalPoints++;
      }
      if (matches / totalPoints >= 0.65) {
        targetsFound.push([row, col]);
        matchArray = [...matchArray, ...matchedArray];
      }
      else {
        matchedArray = [];
      }
    }
  }
  return {
    matchArray : matchArray,
    targetsFound : targetsFound
  };
}

function transpose(x, y, target) {
  for (var i = 0; i < target.length; i++) {
    target[i][0] += x - lastTransposeX;
    target[i][1] += y - lastTransposeY;
  }
  lastTransposeX = x;
  lastTransposeY = y;
}

function indexMapping(inputData, mappedIndex) {
  let len = inputData.length;
  for (let i = 0; i < len; i++) {
    if (inputData[i][2])
      mappedIndex[inputData[i][0] + '.' + inputData[i][1]] = true;
  }
}