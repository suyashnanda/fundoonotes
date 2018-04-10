var ToDo = angular.module('ToDo');

ToDo.filter('labelFilter', function() {
  return function(notes) {
    var filteredNotes = [];
    var labelId = localStorage.getItem('lastLabel');
    if (labelId == undefined) {
      return notes;
    }
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      var lbl = note.labels;
      for (var j = 0; j < lbl.length; j++) {
        if (labelId == lbl[j]) {
          filteredNotes.push(note);
        }
      }
    }
    return filteredNotes;
  }
});
