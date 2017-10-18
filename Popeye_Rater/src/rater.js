// Create array of images to rate, adjust max i to amount of images beforehand!
 var images = [];
	for (var i = 0; i < 134; i++) {
	path = "images/img (" + [i+1] + ").JPG";
	images.push(path); 
 }

// Function to shuffle the images array using a fisher-yates shuffle
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while ( 0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		//... and swap with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

// Excecute the shuffle function so that the order of the images array is randomized
shuffle(images);

// Create image and function to change image to the next one in the array
 var index = 0;

 function buildImage(){
 	var img = document.createElement("img");
 	img.src = images[index];
 	document.getElementById("content").appendChild(img);
 }

function changeImage(){
	var img = document.getElementById("content").getElementsByTagName("img")[0];
	index++;
	index = index % images.length;
	img.src = images[index];
}

// Create a progress counter and hide all elements except the download button when all images have been rated.
var imageCounter = 1;
function counterUp() {
	imageCounter = imageCounter + 1;
	if (imageCounter > images.length) {
		// hide next button and show download button
		document.getElementById("nextImageButton").className = "hidden";
		document.getElementById("downloadButton").className = "generatebutton";
		// hide all boxes and images
		document.getElementById("content").className = "hidden";
		document.getElementById("counter").className = "hidden";
		document.getElementById("popeyeScoreBox").className = "hidden";
		document.getElementById("likertScoreBox").className = "hidden";
	} else
	// update the progress counter
	var progressScore = document.getElementById("counter");
	progressScore.innerHTML = "Case " + imageCounter +" of " + images.length + ".";
}

// Create an array to save the popeye identification in and a function that saves the current choice when the NEXT button is pressed
var PopeyeId = [];

function getPopeye () {
	var currentPopeyeScore = document.querySelector('input[name = "popeyescore"]:checked').value;
	PopeyeId.push(currentPopeyeScore);
}

// Create an array to save the likert scale rating in and a function that saves the current choice when the NEXT button is pressed
var likertScoreArr = [];

function getLikert () {
	var currentLikertScore = document.querySelector('input[name = "likertScore"]:checked').value;
	likertScoreArr.push(currentLikertScore);
}

// Function to check if an option in a radio button form has been checked, used for validation.
function checkCheckBoxGroup(groupName) {
  var g = document.getElementsByName(groupName);

  for(var i = 0;i<g.length;i++) {
    if (g[i].checked) {
      return true;
    }
  }
  return false;
}

// Function to erase checkboxes, use this after the data has been extracted
function erasePopCheckbox () {
	var ele = document.getElementsByName("popeyescore");
   		for(var i=0; i<ele.length; i++)
     		ele[i].checked = false;
	var ele2 = document.getElementsByName("likertScore");
   		for(var i=0; i<ele2.length; i++)
    		ele2[i].checked = false;
}

// Function for the NEXT image button, validate checkboxes (if not filled out alert the rater), extract scores
// then change the image, update the progresscounter and erase the checkboxes.
function nextImage () {
	if (checkCheckBoxGroup("popeyescore") && checkCheckBoxGroup("likertScore")) {
		getPopeye();
		getLikert();
		changeImage();
		counterUp();
		erasePopCheckbox();
	}	else {
		alert("Please insert form first!");
	}	
}

// Function to build the database array with columns:
// 	1. Picture number (so it can be sorted in the order that the rater saw them in)
// 	2. Picture name (so it can be sorted on picture name, which is used to easily add the scores in their correct order in SPSS)
// 	3. Popeye identification score, where 0 means no popeye sign presen, 1 means popeye sign present
// 	4. Likert score, measuring certainty, ranging from 1 (very uncertain) to 5 (very certain)
var DataBaseArr = [];

function createDataBaseArr () {
	for( var i = 0; i < images.length; i++) {
		CurrentDbItem = [];
		CurrentDbItem.push(i+1);
		CurrentDbItem.push(images[i]);
		CurrentDbItem.push(PopeyeId[i]);
		CurrentDbItem.push(likertScoreArr[i]);
		DataBaseArr.push(CurrentDbItem);
	}
}

// Function that creates the database array and downloads it when the download button is pressed
function printDataBaseArr () {
	createDataBaseArr();
	exampleDownload();
}

// This is to download the array as an excel file, originally a coffeescript file that is converted to javascript
	var asUtf16, downloadExcelCsv, makeExcelCsvBlob, rows, toTsv;

asUtf16 = function(str) {
  var buffer, bufferView, i, j, ref, val;
  buffer = new ArrayBuffer(str.length * 2);
  bufferView = new Uint16Array(buffer);
  bufferView[0] = 0xfeff;
  for (i = j = 0, ref = str.length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    val = str.charCodeAt(i);
    bufferView[i + 1] = val;
  }
  return bufferView;
};

makeExcelCsvBlob = function(rows) {
  return new Blob([asUtf16(toTsv(rows)).buffer], {
    type: "text/csv;charset=UTF-16"
  });
};

toTsv = function(rows) {
  var escapeValue;
  escapeValue = function(val) {
    if (typeof val === 'string') {
      return '"' + val.replace(/"/g, '""') + '"';
    } else if (val != null) {
      return val;
    } else {
      return '';
    }
  };
  return rows.map(function(row) {
    return row.map(escapeValue).join('\t');
  }).join('\n') + '\n';
};

downloadExcelCsv = function(rows, attachmentFilename) {
  var a, blob;
  blob = makeExcelCsvBlob(rows);
  a = document.createElement('a');
  a.style.display = 'none';
  a.download = attachmentFilename;
  document.body.appendChild(a);
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
};

window.exampleDownload = function() {
  return downloadExcelCsv(DataBaseArr, 'exported-data.csv');
};