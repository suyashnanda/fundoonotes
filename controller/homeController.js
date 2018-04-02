var ToDo = angular.module('ToDo')

ToDo.controller('homeController', function($rootScope, $scope, fileReader,
          $location, $timeout, $mdSidenav, noteService, $mdDialog, mdcDateTimeDialog,
         toastr, $mdUtil, $filter, $interval, $state, Upload, $base64, $q,labelService) {

  $scope.toggleLeft = buildToggler('left');
  /**function to toggle sidebar*/
  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID).toggle();
    };
  }

  var urls = [];
  /**function to check url and respond acc to url data*/
  $scope.checkUrl = function(note) {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
    var url = note.body.match(urlPattern);
    var link = [];
    if (note.size == undefined) {
      note.size = 0;
      note.url = [];
      note.link = [];
    }
    if ((url != null || url != undefined) && note.size < url.length) {
      for (var i = 0; i < url.length; i++) {
        note.url[i] = url[i];
        noteService.getUrl(url[i])
                      .then(function(response) {
                          var responseData = response.data;
                          var urlDomain , url;
                          if (responseData.urlDomain) {
                              urlDomain = responseData.urlDomain;
                              url = note.url[noteService.searchStringInArray(urlDomain,note.url)];
                          }else {
                              urlDomain = responseData.urlDomain || response.config.headers.url;
                              url = note.url[noteService.searchStringInArray(urlDomain,note.url)];
                          }
                          link[note.size] = {
                            urlTitle: responseData.urlTitle,
                            urlImage: responseData.ulrImage,
                            urlDomain: urlDomain,
                            url: url
                          }
                          note.link[note.size] = link[note.size];
                          note.size = note.size + 1;
                        }, function(response) {

                      })
      }
    }

  }

  /**LIST/GRID VIEW */
  $scope.view = function() {
    var view = localStorage.getItem('view');
    if (view == 'list') {
      $scope.displayView('list');
    } else {
      $scope.displayView('grid');
    }

  }
  /**display view according to list and grid selection*/
  $scope.displayView = function(type) {
    if (type == 'list') {
      $scope.view = '90';
      $scope.width = '100%';
      $scope.list = false;
      $scope.grid = true;
      localStorage.setItem('view', 'list');
    } else {
      $scope.view = '30';
      $scope.width = '280px';
      $scope.grid = false;
      $scope.list = true;
      localStorage.setItem('view', 'grid');
    }

  }
  /**function to check pin and unpin of notes*/
  $scope.pinStatus = false;
  $scope.pinUnpin = function() {
    if ($scope.pinStatus == false) {
      $scope.pinStatus = true;
    } else {
      $scope.pinStatus = false;
    }
  }

  /**function to display dialog for reminder selection*/
  $scope.displayDialog = function(note) {
    mdcDateTimeDialog.show({
        time: true
      })
      .then(function(date) {
        $scope.selectedDateTime = date;
        note.reminder = date;
        update(note);
        var url = 'update';
        toastr.success("Reminder saved", {
          timeOut: 1000
        });
      });
  };

  /*ARRAY OF COLORS*/
  $scope.colors = ['transparent', '#FF8A80', '#FFD180', '#FFFF8D', '#CFD8DC', '#80D8FF', '#A7FFEB', '#CCFF90'];

  $scope.noteColor = function(newColor, oldColor) {
    $scope.color = newColor;
  }
  /**set new color to the notes*/
  $scope.newColor="";
  $scope.colorChanged = function(note) {
    update(note);
  }

  var note = function() {
    $location.path('notes');
  }
  /*//////////////////////////////=====GET ALL NOTES======///////////////////////////// */
  var getNotes = function() {
    $timeout(getNotesActual, 1000);
  }

  /**function to get all the notes with its label attached to it*/
  var getNotesActual = function() {
    var url = 'getNotes';
    var notes = noteService.service(url, 'GET', notes);
    notes.then(function(response) {
      $scope.notes = response.data;
      $scope.notes = $scope.notes.map((note)=>{
          note.labels = note.labels.map((label_id)=>{
                      return {
                        label_id : label_id,
                        label_name : labelService.getLabelName(label_id)
                      };
                    });
          return note;
      });
      if ($state.current.name == 'label') {
        var filteredNotes = [];
        var labelId = localStorage.getItem('lastLabel');
        console.log(labelId);
        for (var i = 0; i < $scope.notes.length; i++) {
            var note = $scope.notes[i];
            var lbl = note.labels;

            for (var j = 0; j < lbl.length; j++) {
              if (labelId == lbl[j].label_id) {
                filteredNotes.push(note);
              }
            }
          }
        $scope.notes = filteredNotes;
      }

      /*==============REMINDER CHECKER====================*/
      $interval(function() {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].reminder) {
            var date = new Date(response.data[i].reminder);
            if ($filter('date')(date) == $filter('date')(new Date())) {
              toastr.success(response.data[i].body, response.data[i].title, "Reminder");
            }
          }
        }
      }, 90000);
    }, function(response) {
      $scope.error = response.data.responseMessage;
      $location.path('login');
    });
  }

  /**function to add new note on submitting*/

  $scope.addNote = function(pinStatus) {
    $scope.note = {};
    $scope.note.title = document.getElementById("title").innerHTML;
    $scope.note.body = document.getElementById("body").innerHTML;
    var url = 'addNote';
    if ((document.getElementById("title").innerHTML == "" && document.getElementById("body").innerHTML == "")) {
      $scope.displayDiv = false;
      $scope.imageSrc = "";
      $scope.addImg = "";
      $scope.color = "#fff";
    } else {
      $scope.note.pinned = pinStatus;
      $scope.note.color = $scope.color;
      $scope.note.image = $scope.addImg;
      $scope.imageSrc = "";
      $scope.addImg = "";

      noteService.service(url, 'POST', $scope.note)
        .then(function(response) {
          document.getElementById("title").innerHTML = "";
          document.getElementById("body").innerHTML = "";
          $scope.color = '#fff';
          $scope.displayDiv = false;
          getNotes();
        }, function(response) {
          getNotes();
          $scope.error = response.data.message;
          toastr.success($scope.error, {
            timeOut: 1000
          });
        });
    }
  }

  /**function calling restservice to delete the note forever*/
  $scope.deleteNoteForever = function(note) {
    var url = 'delete/' + note.noteId;
    var notes = noteService.service(url, 'DELETE', note);
    notes.then(function(response) {
      getNotes();
      toastr.success("Deleted successfully.", {
        timeOut: 1000
      });
    }, function(response) {
      getNotes();
      $scope.error = response.data;
      toastr.success($scope.error, {
        timeOut: 1000
      });
    });
  }

  /**function calling restservices to restore the notes*/
  $scope.restoreNote = function(note) {
    var url = 'updateStatus';
    var notes = noteService.update(url, 'POST', note.noteId, 'false', 'restore');
    notes.then(function(response) {
      getNotes();
      toastr.success("Done!!!", {
        timeOut: 1000
      });
    }, function(response) {
      $scope.error = response.data.responseMessage;
      toastr.success($scope.error, {
        timeOut: 1000
      });
    });
  }

  /**function calling restservice to delete the note and send that note into trash*/
  $scope.deleteNote = function(note) {
    var url = 'updateStatus';
    var notes = noteService.update(url, 'POST', note.noteId, 'true', 'trash');
    notes.then(function(response) {
      getNotes();
      toastr.info("Moved to trash", {
        timeOut: 1000
      });
    }, function(response) {
      $scope.error = response.data.responseMessage;
      toastr.success($scope.error, {
        timeOut: 1000
      });
    });
  }

  //function to pin a selected note
  $scope.pinned = function(note, status) {
    var url = 'updateStatus';
    var notes = noteService.update(url, 'POST', note.noteId, status, 'pinned');
    notes.then(function(response) {
      getNotes();
    }, function(response) {
      $scope.error = response.data.responseMessage;
    });
  }

  //function to archive a selected note
  $scope.archive = function(note, status) {
    var url = 'updateStatus';
    var notes = noteService.update(url, 'POST', note.noteId, status, 'archive');
    notes.then(function(response) {
      getNotes();
    }, function(response) {
      $scope.error = response.data.responseMessage;
    });
  }

  $scope.displayDiv = false;
  $scope.show = function() {
    $scope.displayDiv = true;
  }

  $scope.hide = function() {
    $scope.displayDiv = false;
  }

  /**function to add collaborators to a selected note*/
  $scope.collaborators = function(note, event) {
    $mdDialog.show({
      locals: {
        dataToPass: note,
        ownerDetails: $scope.owner,
        listOfUser: $scope.userList,
        collabUser: note.collabuser
      },
      templateUrl: 'template/collaborator.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      controllerAs: 'controller',
      controller: opencollaboratorsModel
    });
  }

  function opencollaboratorsModel($scope, $state, dataToPass, ownerDetails, listOfUser, collabUser) {
    $scope.owner = ownerDetails;
    $scope.userList = listOfUser;
    $scope.collabuser = collabUser;

    $scope.removeCollaborator = function(user) {
      let noteObj = noteLabelsMap(dataToPass);
      var array = noteObj.collaborator;
      var index = array.indexOf(user);
      array.splice(index, 1);
      update(noteObj);
      $mdDialog.hide();
    }

    $scope.getUserEmail = function() {
      var url = 'collaborate';
      let noteObj = noteLabelsMap(dataToPass);
      var a = noteService.collaborate(url, 'POST', noteObj, $scope.search);
      a.then(function(response) {
        $state.reload();
        $mdDialog.hide();
      }, function(response) {
        console.log("Error");
      })

    }
  }

  /*//////////////////////////////=====GET OWNER NOTE======///////////////////////////// */
  $scope.getOwner = function(note) {
    var url = 'getOwner';

    let noteObj = noteLabelsMap(note);

    noteService.service(url, 'POST', noteObj)
                    .then(function(response) {
                      $scope.owner = response.data;
                      note.owner = response.data;
                    }, function(response) {
                      $scope.error = response.data;
                    })
  }

  /**function to call when click on notes to update it*/
  $scope.updateEditedNote = function(note, event) {
    // Show dialog box for edit a note
    $mdDialog.show({
      locals: {
        dataToPass: note,
        pin: $scope.pinned,
        changeImage: $scope.openImageUploader,
        deletelebel: $scope.removeLabel,
        labels :$scope.labels,
        collaborator: $scope.collaborators,
        colors: $scope.colors,
        changeColor: $scope.colorChanged,
        modelDeleteNote: $scope.deleteNote,
        modelMakeCopy: $scope.makeCopy,
        user: $scope.user,
        labelAdd: $scope.labelToggle,
        checkbox: $scope.checkboxCheck,
        mdArchive: $scope.archive
      },
      templateUrl: 'template/UpdateNote.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      controllerAs: 'controller',
      controller: mdDialogController
    });
  }

  function mdDialogController($scope, $state, dataToPass, pin, changeImage, deletelebel,
                    collaborator, colors,labels, changeColor, modelDeleteNote, modelMakeCopy,
                    user, labelAdd, checkbox, mdArchive,labelService) {

    $scope.colors = colors;
    $scope.user = user;

    $scope.onColorChange=function(newColor,mdDialogData){
      mdDialogData.color = newColor;
      update(mdDialogData);
    }
    labelService.labels = labels;
    $scope.mdDialogData = dataToPass;
    // $scope.mdDialogData.labels = $scope.mdDialogData.labels.map((label_id)=>{
    //   return {
    //     label_id : label_id,
    //     label_name : labelService.getLabelName(label_id)
    //   };
    // });
    /*=========================Remove Image=============*/
    $scope.removeImage = function(mdDialogData) {
      mdDialogData.image = null;
      update(mdDialogData);
    }
    // Saving the edited note
    $scope.saveUpdatedNote = function() {

      dataToPass.title = document.getElementById("updatedNoteTitle").innerHTML;
      dataToPass.body = document.getElementById("updatedNoteBody").innerHTML;
      update(dataToPass);
      $mdDialog.hide();
    }
    $scope.getLabelName = labelService.getLabelName;

    $scope.pinned = pin;
    $scope.openImageUploader = changeImage;
    $scope.removeLabel = deletelebel;
    $scope.collaborators = collaborator;
    $scope.colorChanged = changeColor;
    $scope.deleteNote = modelDeleteNote;
    $scope.makeCopy = modelMakeCopy;
    $scope.labelToggle = labelAdd
    $scope.checkboxCheck = checkbox;
    $scope.archive = mdArchive;
  }

  /*//////////////////////////////=====DELETE REMINDER======///////////////////////////// */
  $scope.deleteRemender = function(note) {
    note.reminder = null;
    update(note);
  }

  /*/////////////////////////////=======GET USER===================/////////////////////*/
  var getUser = function() {
    var url = 'getUser';
    var user = noteService.service(url, 'GET');

    user.then(function(response) {
      var User = response.data;
      $scope.user = User;
    }, function(response) {

    });
  }

  /*/////////////////////=============Get All Labels====================///////////////////*/
  var getLabels = function() {
    $timeout(getLabelsActual, 500);
  }

  //
  var getLabelsActual = function() {
    labelService.initiateLabel().then(function(response) {
      $scope.labels = response.data;
      labelService.labels = response.data;
    }, function(response) {
      console.log("Error", response.responseMessage);
    })
  }
  /*//////////////////////////////=====UPDATE FUNCTION======///////////////////////////// */
  var noteLabelsMap = function (note) {
    let noteObj = JSON.parse(JSON.stringify(note));
    noteObj.labels = noteObj.labels.map((label)=> {
      if(label.label_id === undefined){
        return label;
      }
      return label.label_id;
    });
    return noteObj;
  }
  var update = function(note) {
    var url = 'update';
    let noteObj = noteLabelsMap(note);

    var notes = noteService.service(url, 'POST', noteObj);
    notes.then(function(response) {
      getNotes();
    }, function(response) {
      getNotes();
      $scope.error = response.data.responseMessage;
    });
  }

  var updateUser = function(user) {
    var url = 'updateUser';
    var notes = noteService.service(url, 'POST', user);
    notes.then(function(response) {
      getNotes();
    }, function(response) {
      getNotes();
      $scope.error = response.data.responseMessage;
    });
  }


  /*//////////////////////////////=====UPLOAD Image======///////////////////////////// */

  /*open to crop the selected image through directive*/
  // $scope.cropped = false;
  // $scope.uploadImage = function(selectedfiles) {
  //   $scope.cropped = true;
  //   ngDialog.open({
  //     template: 'selectProfilePic',
  //     className: 'ngdialog-theme-default',
  //     scope: $scope,
  //     overlay: true,
  //     showClose: true
  //   });
  // }
  $scope.openImageUploader = function(env, className) {
    // console.log("image calling",env, className)
    // $(className).trigger("click");
  }


  $scope.stepsModel = [];

  $scope.imageUpload = function(element) {
    var reader = new FileReader();
    reader.onload = $scope.imageIsLoaded;
    reader.readAsDataURL(element.files[0]);
  }

  $scope.imageIsLoaded = function(e) {}


  $scope.imageIsLoaded = function(e) {
    // setTimeout(function(){
    // $scope.$apply(function() {
      $scope.stepsModel.push(e.target.result);
      var imageSrc = e.target.result;
      if ($scope.type === 'input') {
        $scope.addImg = imageSrc;
      } else if ($scope.type === 'user') {

        var userId = $scope.user.id;

        var url = 'profileUpdate';
        var uploadImage = noteService.uploadImage(url, 'POST', imageSrc);

        uploadImage.then(function(response) {
          $state.reload();
        }, function(reponse) {
        })
      } else if ($scope.type === 'update') {
        var noteId = $scope.changeIamge.noteId;
        var url = 'image/' + noteId;
        var uploadImage = noteService.uploadImage(url, 'POST', imageSrc);

        uploadImage.then(function(response) {
          getNotes();
        }, function(reponse) {

        })
      } else {
        var noteId = $scope.type.noteId;
        var url = 'image/' + noteId;
        var uploadImage = noteService.uploadImage(url, 'POST', imageSrc);
        uploadImage.then(function(response) {
          getNotes();
        }, function(reponse) {
        })
      }
    // });
    // });
  };

  /*//////////////////////////////=====Make a Copy of  note======///////////////////////////// */

  $scope.makeCopy = function(note) {
    note.noteId = null;
    note.archive = false;
    note.pinned = false;
    note.reminder = null;
    var url = 'addNote';
    var a = noteService.service(url, 'POST', note);
    a.then(function(response) {
      $scope.displayDiv = false;
      getNotes();
    }, function(response) {
      getNotes();
      $scope.error = response.data.message;
    });
  }

  /*//////////////////////////////=====LOGOUT ======///////////////////////////// */

  $scope.logout = function() {
    localStorage.removeItem('token');
    $location.path('/login');
    toastr.success("Logout successfull");
  }

  /*//////////////////////////////=====CHANGING COLOR ======///////////////////////////// */
  if ($state.current.name == 'home') {
    $scope.navBarColor = "#ffbb33";
    $scope.editable = true;
    $scope.title = "Fundoo Notes";
  } else if ($state.current.name == 'archive') {
    $scope.navBarColor = "#607D8B";
    $scope.editable = true;
    $scope.title = "Archive";
  } else if ($state.current.name == 'trash') {
    $scope.navBarColor = "#636363";
    $scope.editable = false;
    $scope.title = "Trash";
  } else if ($state.current.name == 'reminder') {
    $scope.navBarColor = "#607D8B";
    $scope.editable = true;
    $scope.title = "Reminder";
  } else if ($state.current.name == 'search') {
    $scope.navBarColor = "#512DA8";
    $scope.title = "Google Keep";
  }
  /*//////////////////////////////=====REFRESH OWNER ======///////////////////////////// */

  $scope.refresh = function() {
    $state.reload();
  }

  $scope.querySearch = function(searchText) {
    var arr = [];
    var j = -1;
    var url = 'search/' + searchText;
    var searchNote = noteService.service(url, 'GET')
    searchNote.then(function(response) {
      arr = response.data;
    }, function(response) {})
    return arr;

  }

  $scope.searchTextChange = function(searchText) {
    var arr = [];
    $scope.searchResultNotes = [];
    var url = 'search/' + searchText;
    var searchNote = noteService.service(url, 'GET')
    searchNote.then(function(response) {
      arr = response.data;
      $scope.searchResultNotes = arr;
    }, function(response) {

    })
    $scope.searchResultNotes = arr;
  }

  /*===========================Create Label========================*/
  $scope.createLabel = function($event, user) {
    $mdDialog.show({
      locals: {
        dataToPass: user // Pass the note data into dialog box
      },
      templateUrl: 'template/createLabel.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      controllerAs: 'controller',
      controller: createLabelController
    });
  }

  function createLabelController($scope, dataToPass) {
    $scope.userlabel = dataToPass;
    $scope.createLabel = function(labelName) {
      $scope.label = {};
      $scope.label.name = labelName;
      url = 'addlabel';

      var addLabel = noteService.service(url, 'POST', $scope.label)
      addLabel.then(function(response) {
        $mdDialog.hide();
        $timeout(getLabels);
      }, function(response) {})
    }
  }

  /*===========================Add Label to note========================*/
  $scope.labelToggle = function(noteObj, label) {

    let note = noteLabelsMap(noteObj);
    var index = -1;
    var i = 0;
    for (i = 0; i < note.labels.length; i++) {
      if (note.labels[i] === label.labelId) {
        index = i;
        break;
      }
    }
    if (index == -1) {
      note.labels.push(label.labelId);
      update(note);
    } else {
      note.labels.splice(index, 1);
      update(note);
    }
  }

  $scope.checkboxCheck = function(note, label) {
    var labels = note.labels;
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].label_id === label.labelId) {
        return true;
      }
    }
    return false;
  }

  /*==========================DELETE LABEL==============================*/

  $scope.deleteLabel = function(label) {
    var url = 'deleteLabel';
    var deletelabel = noteService.label(url, 'POST', label);
    deletelabel.then(function(response) {
      $timeout(getLabels);
    }, function(response) {})
  }

  $scope.getLabelName = labelService.getLabelName;
  // $scope.getLabelName = function(label) {
  //   for (var i = 0; i < $scope.labels.length; i++) {
  //     if ($scope.labels[i].labelId == label) {
  //       return $scope.labels[i].name;
  //     }
  //   }
  // }

  /*==========================REMOVE LABEL==============================*/

  $scope.removeLabel = function(note, label) {
    var removeLabel = note.labels;
    var indexOfLabel = removeLabel.indexOf(label);
    removeLabel.splice(indexOfLabel, 1);
    update(note);
  }

  /*//////////////////////////////=====Remove my self======///////////////////////////// */

  $scope.removeMySelf = function(note, user) {
    var array = note.collaborator;
    var index = array.indexOf(user);
    array.splice(index, 1);
    update(note);

  }

  /*============================GET ALL USER=========================================*/

  var getUsers = function() {
    var url = "getUserList";
    var users = noteService.service(url, 'GET');
    users.then(function(response) {
      $scope.userList = response.data;
    }, function(response) {

    });
  }

  /*============================LABEL STATE=========================================*/

  $scope.labelState = function(label) {
    localStorage.setItem('lastLabel', label.labelId);
    $location.path('label/' + label.name);
  }

  /*============================ADD ARCHIVE NOTE=========================================*/

  $scope.addArchiveNote = function(status) {
    $scope.note = {};
    $scope.note.title = document.getElementById("title").innerHTML;
    $scope.note.body = document.getElementById("body").innerHTML;
    var url = 'addnote';
    if ((document.getElementById("title").innerHTML == "" && document.getElementById("body").innerHTML == "")) {
      $scope.displayDiv = false;
      $scope.imageSrc = "";
      $scope.addImg = "";
    } else {
      $scope.note.archive = status;
      $scope.note.pinned = false;
      $scope.note.color = $scope.color;
      $scope.note.image = $scope.addImg;
      $scope.imageSrc = "";
      $scope.addImg = "";
      var notes = noteService.service(url, 'POST', $scope.note);
      notes.then(function(response) {
        document.getElementById("title").innerHTML = "";
        document.getElementById("body").innerHTML = "";
        $scope.color = '#fff';
        $scope.displayDiv = false;

        getNotes();

      }, function(response) {
        getNotes();
        $scope.error = response.data.message;
      });
    }
  }

  $scope.getCollabUser = function(note) {
    var url = 'getCollabUser';
    let noteObj = noteLabelsMap(note);
    var getCollab = noteService.service(url, 'POST', noteObj);
    getCollab.then(function(response) {
      note.collabuser = response.data;
    }, function(response) {})
  }

  $scope.adminDashboard = function() {
    $location.path('admin');
  }
  // $scope.initHomeNote = function () {
    getUser();
    getUsers();
    getNotesActual();
  // }
  getLabelsActual();
  // checkboxCheck
  // labelToggle
  $scope.closeNote = function() {
    $scope.addNote();
  }
});
