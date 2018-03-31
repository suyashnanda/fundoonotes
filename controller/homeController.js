var ToDo = angular.module('ToDo')

ToDo.controller('homeController', function ($rootScope,$scope,fileReader,$location, $timeout, $mdSidenav,noteService,$mdDialog,mdcDateTimeDialog,toastr
							,$mdUtil,$filter,$interval,$state,Upload, $base64,$q) {




	$scope.toggleLeft = buildToggler('left');

	function buildToggler(navID) {

		return function() {
	        $mdSidenav(navID).toggle();
	      };
	}

	var urls=[];
	$scope.checkUlr =function(note){
		var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
		var url  = note.body.match(urlPattern);
		var link=[];
		if(note.size==undefined){
			note.size=0;
			note.url=[];
			note.link=[];
		}
		if((url!=null || url!=undefined) && note.size<url.length){
			for (var i=0;i<url.length;i++){
				note.url[i]=url[i];
				var getUrlData=noteService.getUrl(url[i]);
				getUrlData.then(function(response){

					var responseData = response.data;

					link[note.size]={
							urlTitle:responseData.urlTitle,
							urlImage:responseData.ulrImage,
							urlDomain:responseData.urlDomain,
							url:note.url[note.size]
							}
					note.link[note.size]=link[note.size];
					note.size=note.size+1;

				},function(response){

				})
			}
		}

	}

	/*//////////////////////////////=====LIST/GRID VIEW======///////////////////////////// */


	$scope.view=function(){
		var view = localStorage.getItem('view');
		if(view=='list'){
			$scope.displayView('list');
		}else{
			$scope.displayView('grid');
		}

	}

	$scope.displayView=function(type){

		if(type=='list'){

			$scope.view='90';
			$scope.width='100%';
			$scope.list=false;
			$scope.grid=true;
			getNotes();
			localStorage.setItem('view','list');
		}else{

			$scope.view='30';
			$scope.width='280px';
			$scope.grid=false;
			$scope.list=true;
			getNotes();
			localStorage.setItem('view','grid');
		}

	}


	$scope.pinStatus = false;
	$scope.pinUnpin=function(){
		if ($scope.pinStatus == false) {
			$scope.pinStatus = true;
		} else {
			$scope.pinStatus = false;
		}
	}



	/*//////////////////////////////=====REMINDER======///////////////////////////// */

    $scope.displayDialog = function (note) {
      mdcDateTimeDialog.show({
       /* maxDate: $scope.maxDate,*/
        time: true
      })
        .then(function (date) {
        	console.log(date);
          $scope.selectedDateTime = date;
          note.reminder=date;

          update(note);
          	var url='update';
          	toastr.success("Reminder saved",{ timeOut: 1000 });

        });
    };





	/*//////////////////////////////=====COLOR======///////////////////////////// */


	$scope.colors1 = [
		 {	color:'#fff',name : 'White'},
		 {	color:'#ff8a80',name : 'Red'},
		 {	color:'#ffd180',name : 'Orange'},
		 {	color:'#ffff8d',name : 'Yellow'},
		 {	color:'#ccff90',name : 'Green'},
		 {	color:'#a7ffeb',name : 'Teal'},
		 {	color:'#80d8ff',name : 'Blue'},
		 {	color:'#82b1ff',name : 'Dark Blue'},
		 {	color:'#b388ff',name : 'Purple'},
		 {	color:'#f8bbd0',name : 'Pink'},
		 {	color:'#d7ccc8',name : 'Brown'},
		 {	color:'#cfd8dc',name : 'Grey'}
		 ];
console.log("$scope.colors1",$scope.colors1)


	 $scope.noteColor=function(newColor, oldColor)
	 {
		 console.log(newColor);
		 $scope.color = newColor;
	 }

	$scope.colorChanged = function(newColor, oldColor, note) {
		console.log("III:::"+newColor);
        note.color=newColor;
        update(note);
     }




	var note=function(){
		$location.path('notes');
	}

	/*//////////////////////////////=====GET ALL NOTES======///////////////////////////// */
	//var search=[];

	var getNotes = function() {
		$timeout(getNotesActual, 1000);
	}

    var getNotesActual=function(){


    	var url = 'getnotes';

    	var notes=noteService.service(url,'GET',notes);

    	notes.then(function(response){

    		$scope.notes=response.data;
    		if($state.current.name=='label'){
	    		var filteredNotes = [];
				var labelId = localStorage.getItem('lastLabel');

				for (var i = 0; i < $scope.notes.length; i++) {
					var note = $scope.notes[i];
					var lbl = note.labels;
					for (var j = 0; j < lbl.length; j++) {
						if (labelId == lbl[j]) {
							filteredNotes.push(note);
						}
					}
				}
				$scope.notes = filteredNotes;

    		}


    		/*console.log(response.data);
    		 for (var i = 0; i < response.data.length; i++) {
    			 search.push(response.data[i]);
    		 }
    		*/
    		/*==============REMINDER CHECKER====================*/
      		   $interval(function () {

    		          for (var i = 0; i < response.data.length; i++) {
    		            if(response.data[i].reminder) {
    		            	var date=new Date(response.data[i].reminder);
    		            	if ($filter('date')(date)== $filter('date')(new Date())) {
    		                toastr.success(response.data[i].body, response.data[i].title,"Reminder");
    		              }
    		            }
    		          }
    		      },90000);

    	},function(response){
    		$scope.error=response.data.responseMessage;
    		$location.path('login');
    	});

    }

	/*//////////////////////////////=====ADD NEW NOTE======///////////////////////////// */

    $scope.addNote = function(pinStatus) {
    	$scope.note = {};

    	$scope.note.title = document.getElementById("title").innerHTML;

    	$scope.note.body = document.getElementById("body").innerHTML;

    	console.log($scope.note.body )
		var url='addnote';
		if((document.getElementById("title").innerHTML=="" && document.getElementById("body").innerHTML==""))
			{
				$scope.displayDiv=false;
				$scope.imageSrc = "";
				$scope.addImg="";
				$scope.color="#fff";
			}
		else{

			$scope.note.pinned=pinStatus;
			$scope.note.color=$scope.color;
			$scope.note.image=$scope.addImg;
			$scope.imageSrc = "";
			$scope.addImg="";

			var notes = noteService.service(url,'POST',$scope.note);

			notes.then(function(response) {

					document.getElementById("title").innerHTML="";
					document.getElementById("body").innerHTML="";
					$scope.color='#fff';
					$scope.displayDiv=false;

					getNotes();
//					toastr.success("Note added.",{ timeOut: 1000 });
				}, function(response) {

					getNotes();

					$scope.error = response.data.message;
					toastr.success($scope.error,{ timeOut: 1000 });
				});

		}

	}

	/*//////////////////////////////=====DELETE NOTE FOREVER======///////////////////////////// */


    $scope.deleteNoteForever=function(note){

    	console.log("inside delete forever")
    	console.log("deleting Note"+note);
    	var url='delete/'+note.noteId;
    	var notes = noteService.service(url,'DELETE',note);
    	notes.then(function(response) {

			getNotes();
			toastr.success("Deleted successfully.",{ timeOut: 1000 });

		}, function(response) {

			getNotes();
			console.log(response.data);
			$scope.error = response.data;
			toastr.success($scope.error,{ timeOut: 1000 });
		});

    }


	/*//////////////////////////////=====RESTORE NOTE======///////////////////////////// */

    	$scope.restoreNote=function(note){

    		var url = 'updatestatus';
    		var notes = noteService.update(url,'POST',note.noteId,'false','restore');
    		notes.then(function(response){
    			getNotes();
    			toastr.success("Done!!!",{ timeOut: 1000 });
    		},function(response){
    			$scope.error=response.data.responseMessage;
    			toastr.success($scope.error,{ timeOut: 1000 });
    		});
    	}

    	/*//////////////////////////////=====DELETE NOTE AND SAVE TO TRASH======///////////////////////////// */

    $scope.deleteNote = function(note) {

		var url = 'updatestatus';
		var notes = noteService.update(url,'POST',note.noteId,'true','trash');
		notes.then(function(response){
			getNotes();
			toastr.info("Moved to trash",{ timeOut: 1000 });
		},function(response){
			$scope.error=response.data.responseMessage;
			toastr.success($scope.error,{ timeOut: 1000 });
		});
	}

	/*//////////////////////////////=====PIN NOTE======///////////////////////////// */

    $scope.pinned = function(note,status) {
		//note.pinned=status;
		//note.archive=false;
		//update(note);
		var url = 'updatestatus';
		var notes = noteService.update(url,'POST',note.noteId,status,'pinned');
		notes.then(function(response){
			getNotes();
		},function(response){
			$scope.error=response.data.responseMessage;
		});
	}

	/*//////////////////////////////=====ARCHIVE NOTE======///////////////////////////// */

    $scope.archive=function(note,status){
    	console.log("in archive");
    /*	note.pinned=false;
    	note.archive=status;
    	update(note);*/
    	var url = 'updatestatus';
		var notes = noteService.update(url,'POST',note.noteId,status,'archive');
		notes.then(function(response){
			getNotes();
		},function(response){
			$scope.error=response.data.responseMessage;
		});
    }


	$scope.displayDiv=false;
	$scope.show=function(){
		$scope.displayDiv=true;
	}

	$scope.hide=function(){
		$scope.displayDiv=false;
	}
	/*//////////////////////////////=====Collaborators NOTE======///////////////////////////// */

	$scope.collaborators = function(note,event)
	{
		console.log("inside collaboarator");
		$mdDialog.show({
			locals:{
				dataToPass : note,
				ownerDetails :$scope.owner,
				listOfUser: $scope.userList,
				collabUser : note.collabuser
			},
			templateUrl : 'template/collaborator.html',
			 parent: angular.element(document.body),
		     targetEvent: event,
		     clickOutsideToClose: true,
		     controllerAs: 'controller',
		     controller: opencollaboratorsModel
		});
	}

	function opencollaboratorsModel($scope, $state, dataToPass,ownerDetails,listOfUser,collabUser) {
				$scope.owner = ownerDetails;
				$scope.userList=listOfUser;
				$scope.collabuser =collabUser;
				console.log("collabuser",$scope.collabuser);


			$scope.removeCollaborator=function(user){


				var array = dataToPass.collaborator;
				console.log(dataToPass);
				var index = array.indexOf(user);
				array.splice(index, 1);
				update(dataToPass);
				$mdDialog.hide();
			}




			$scope.getUserEmail = function() {

	    	console.log($scope.search);

	    	var url = 'collaborate';
	    	var a=noteService.collaborate(url,'POST',dataToPass,$scope.search);
	    	a.then(function(response){
	    		$state.reload();
	    		$mdDialog.hide();
	    	},function(response){
	    		console.log("Error");
	    	})

	      }
	   }

	/*//////////////////////////////=====GET OWNER NOTE======///////////////////////////// */


	$scope.getOwner=function(note){
		var url = 'getowner';
		var a= noteService.service(url,'POST',note)
		a.then(function(response){

			$scope.owner=response.data;
			note.owner=response.data;
		},function(response){
			$scope.error=response.data;
		})
	}

	/*//////////////////////////////=====UPDATE NOTE======///////////////////////////// */

	$scope.updateEditedNote = function(note, event) {
	    // Show dialog box for edit a note
		console.log("inside updatenote");
		console.log(note);
	    $mdDialog.show({
	      locals: {
	        dataToPass: note,
	        pin:$scope.pinned,
	        changeImage : $scope.openImageUploader,
	        deletelebel : $scope.removeLabel,
	        collaborator : $scope.collaborators,
	        colors :$scope.colors,
	        changeColor :$scope.colorChanged,
	        modelDeleteNote :$scope.deleteNote,
	        modelMakeCopy : $scope.makeCopy,
	        user : $scope.user,
	        labelAdd:$scope.labelToggle,
	        checkbox:$scope.checkboxCheck,
	        mdArchive:$scope.archive

	      },
	      templateUrl: 'template/UpdateNote.html',
	      parent: angular.element(document.body),
	      targetEvent: event,
	      clickOutsideToClose: true,
	      controllerAs: 'controller',
	      controller: mdDialogController
	    });
	}

	function mdDialogController($scope, $state, dataToPass,pin,changeImage,deletelebel,collaborator,colors,changeColor,modelDeleteNote,modelMakeCopy,user
			,labelAdd,checkbox,mdArchive) {


		  $scope.mdDialogData = dataToPass;
	      $scope.colors = colors;
	      $scope.user=user;
	      /*=========================Remove Image=============*/

	      $scope.removeImage=function(mdDialogData){
	    	  mdDialogData.image=null;
	    	  update(mdDialogData);
	      }
	      // Saving the edited note
	      	$scope.saveUpdatedNote = function() {
	    	/*var url = 'update';*/

	    	console.log(dataToPass);

	    	dataToPass.title = document.getElementById("updatedNoteTitle").innerHTML;

	    	dataToPass.body = document.getElementById("updatedNoteBody").innerHTML;


	    	update(dataToPass);
			$mdDialog.hide();

	      }

	     /* $scope.pinned=function(note,status){
	    	  note.pinned= status;
	    	  update(note);
	      }*/

	      	$scope.pinned=pin;
	  		$scope.openImageUploader = changeImage;
	  		$scope.removeLabel = deletelebel;
	  		$scope.collaborators = collaborator;
	  		$scope.colorChanged=changeColor;
	  		$scope.deleteNote=modelDeleteNote;
	  		$scope.makeCopy=modelMakeCopy;
	        $scope.labelToggle=labelAdd
	        $scope.checkboxCheck=checkbox;
	        $scope.archive=mdArchive;


	}

	/*//////////////////////////////=====DELETE REMINDER======///////////////////////////// */

		$scope.deleteRemender=function(note){

			note.reminder=null;
			update(note);
		}
	/*/////////////////////////////=======GET USER===================/////////////////////*/

		var getUser=function(){
		var url='getUser';
		var user = noteService.service(url,'GET');

		user.then(function(response) {

			var User=response.data;
			console.log("user label");
			console.log(User.labels);
			console.log("label"+response.data.labels);

			$scope.user=User;
			console.log($scope.user);
		}, function(response) {

		});

		}

		/*/////////////////////=============Get All Labels====================///////////////////*/
		var getLabels = function() {
			$timeout(getLabelsActual, 1000);
		}

		var getLabelsActual = function(){
			var url='getalllabel';
			var labels = noteService.service(url,'GET');
			labels.then(function(response){
				console.log("All lAbels by elastic",response.data);
				$scope.labels=response.data;
			},function(response){
				console.log("Error",response.responseMessage);
			})
		}
		/*//////////////////////////////=====UPDATE FUNCTION======///////////////////////////// */

		var update=function(note){

			var url='update';
			var notes = noteService.service(url,'POST',note);
			notes.then(function(response) {

				getNotes();

			}, function(response) {
				getNotes();
				console.log(response);
				$scope.error = response.data.responseMessage;

			});
		}


			var updateUser=function(user){

			var url='updateUser';
			var notes = noteService.service(url,'POST',user);
			notes.then(function(response) {

				getNotes();

			}, function(response) {

				getNotes();
				console.log(response);
				$scope.error = response.data.responseMessage;

			});
		}


		/*//////////////////////////////=====UPLOAD Image======///////////////////////////// */



		$scope.openImageUploader = function(type) {
			$scope.type = type;
			console.log(type);

			$('#image').trigger('click');

			return false;
		}


		$scope.stepsModel = [];

		$scope.imageUpload = function(element){

			var reader = new FileReader();
		    console.log("ele"+element);
		    reader.onload = $scope.imageIsLoaded;
		    reader.readAsDataURL(element.files[0]);
		    console.log("selected image",element.files[0]);
		}

		$scope.imageIsLoaded=function(e)
		{
			console.log(e.target.result);
		}


		$scope.imageIsLoaded = function(e){
		    $scope.$apply(function() {
		        $scope.stepsModel.push(e.target.result);
		        console.log(e.target.result);
		        var imageSrc=e.target.result;
		        if($scope.type ==='input')
	        	{
		        	$scope.addImg= imageSrc;
	        	}else if($scope.type ==='user'){

	        		var userId = $scope.user.id;

		        	var url = 'profileUpdate';
					var uploadImage=noteService.uploadImage(url,'POST',imageSrc);

					uploadImage.then(function(response){
						$state.reload();
					},function(reponse){

					})

	        	}else if($scope.type ==='update'){

	        		var noteId = $scope.changeIamge.noteId;
		        	var url = 'image/'+noteId;
					var uploadImage=noteService.uploadImage(url,'POST',imageSrc);

					uploadImage.then(function(response){
						getNotes();
					},function(reponse){

					})

	        	}
		        else{
		        	var noteId = $scope.type.noteId;
		        	console.log("Notes id ",noteId);
		        	var url = 'image/'+noteId;
					var uploadImage=noteService.uploadImage(url,'POST',imageSrc);

					uploadImage.then(function(response){
						getNotes();
					},function(reponse){

					})

		        }
		    });
		};



		/*//////////////////////////////=====Make a Copy of  note======///////////////////////////// */

		$scope.makeCopy=function(note){

			note.noteId=null;
			note.archive=false;
			note.pinned=false;
			note.reminder=null;
			var url='addnote';
			var a = noteService.service(url,'POST',note);
			a.then(function(response) {
			$scope.displayDiv=false;

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

		if($state.current.name=='home'){
				$scope.navBarColor="#ffbb33";
				$scope.editable = true;
				$scope.title = "Fundoo Notes";
		} else if($state.current.name=='archive'){
			$scope.navBarColor = "#607D8B";
			$scope.editable = true;
			$scope.title = "Archive";
		} else if($state.current.name=='trash'){
			$scope.navBarColor = "#636363";
			$scope.editable = false;
			$scope.title = "Trash";
		}
		else if($state.current.name=='reminder'){
			$scope.navBarColor = "#607D8B";
			$scope.editable = true;
			$scope.title = "Reminder";
		} else if($state.current.name=='search'){
			$scope.navBarColor = "#512DA8";
			$scope.title = "Google Keep";
		}
		/*//////////////////////////////=====REFRESH OWNER ======///////////////////////////// */

		$scope.refresh=function(){
			$state.reload();
		}



		$scope.querySearch=function(searchText){
			var arr = [];
			var j = -1;
			var url ='search/'+searchText;
			var searchNote = noteService.service(url,'GET')
			searchNote.then(function(response){
				 arr=response.data;
				 console.log("querySearch",arr);

			},function(response){
				console.log("Not found ",response.log);
			})
			return arr;

		}

		$scope.searchTextChange = function (searchText) {
			var arr = [];
			$scope.searchResultNotes = [];
			var url ='search/'+searchText;
			var searchNote = noteService.service(url,'GET')
			searchNote.then(function(response){
				 arr=response.data;
				 $scope.searchResultNotes = arr;
			},function(response){

			})
			$scope.searchResultNotes = arr;
		}




		/*===========================Create Label========================*/

	      $scope.createLabel=function($event,user){
	    	  $mdDialog.show({
	    		  locals: {
	    		        dataToPass: user  // Pass the note data into dialog box
	    		      },
	    		 templateUrl : 'template/createLabel.html',
	    		 parent : angular.element(document.body),
	    		 targetEvent : event,
	    		 clickOutsideToClose: true,
	    		 controllerAs : 'controller',
	    		 controller : createLabelController
	    	  });
	      }

	      function createLabelController($scope,dataToPass){
	    	  $scope.userlabel=dataToPass;
	    	  $scope.createLabel=function(labelName){
	    		  console.log(labelName)
	    		  $scope.label={};
	    		  $scope.label.name=labelName;
	    		  url = 'addlabel';

	    		  var addLabel= noteService.service(url,'POST',$scope.label)
	    		  addLabel.then(function(response){
	    			  console.log("label added successfully");
	    			  $mdDialog.hide();
	    			  $state.reload();
	    		  },function(response){
	    			  console.log("label failed to add")
	    		  })
	    	  }
	      }

			/*===========================Add Label to note========================*/

	      $scope.labelToggle=function(note,label){
	    	  console.log("clicked");

	    	  var index = -1;
	    	  var i=0;
				for ( i = 0; i<note.labels.length;i++) {
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
					if (labels[i] === label.labelId) {
						return true;
					}
				}
				return false;
			}

			/*==========================DELETE LABEL==============================*/

			$scope.deleteLabel=function(label){
				var url = 'deletelabel';
				var deletelabel = noteService.label(url,'POST',label);
				deletelabel.then(function(response){
					console.log("Label deleted successfully");
					$state.reload();
					getLabels();
				},function(response){
					console.log("label deletion failed")
				})
			}

			$scope.getLabelName = function(label) {
				for (var i = 0; i < $scope.labels.length; i++) {
					if ($scope.labels[i].labelId == label) {
						return $scope.labels[i].name;
					}
				}
			}

			/*==========================REMOVE LABEL==============================*/

			$scope.removeLabel=function(note,label){
				console.log("inside remove label");
				var removeLabel = note.labels;
				console.log("inside remove label"+removeLabel);
				var indexOfLabel = removeLabel.indexOf(label);
				removeLabel.splice(indexOfLabel, 1);
				update(note);

			}
			/*//////////////////////////////=====Remove my self======///////////////////////////// */

			$scope.removeMySelf=function(note,user){

				var array = note.collaborator;
				console.log(note);
				var index = array.indexOf(user);
				array.splice(index, 1);
				update(note);

			}


			/*============================GET ALL USER=========================================*/

			var getUsers=function(){
				var url = "getUserList";
				var users = noteService.service(url, 'GET');
				users.then(function(response) {
					console.log("ALL USER");

					$scope.userList=response.data;
					console.log($scope.userList);
				}, function(response) {

				});
		    }


			/*============================LABEL STATE=========================================*/


			$scope.labelState=function(label){
				localStorage.setItem('lastLabel', label.labelId);
				$location.path('label/'+label.name);
			}


			/*============================ADD ARCHIVE NOTE=========================================*/

			$scope.addArchiveNote=function(status){
				$scope.note = {};
		    	/*var token = localStorage.getItem('token');*/
		    	$scope.note.title = document.getElementById("title").innerHTML;

		    	$scope.note.body = document.getElementById("body").innerHTML;

		    	console.log($scope.note.body )
				var url='addnote';
				if((document.getElementById("title").innerHTML=="" && document.getElementById("body").innerHTML==""))
					{
						$scope.displayDiv=false;
						$scope.imageSrc = "";
						$scope.addImg="";
					}
				else{
					$scope.note.archive=status;
					$scope.note.pinned=false;
					$scope.note.color=$scope.color;
					$scope.note.image=$scope.addImg;
					$scope.imageSrc = "";
					$scope.addImg="";
				/*	if(date!=null)
						{
						$scope.note.color=date;
						}*/
					var notes = noteService.service(url,'POST',$scope.note);
					notes.then(function(response) {

					document.getElementById("title").innerHTML="";
					document.getElementById("body").innerHTML="";
					$scope.color='#fff';
					$scope.displayDiv=false;

					getNotes();

				}, function(response) {

					getNotes();

					$scope.error = response.data.message;

				});

				}
			}


			$scope.getCollabUser=function(note) {
				var url = 'getcollabuser';
				var getCollab = noteService.service(url,'POST',note);
				getCollab.then(function(response){
					note.collabuser=response.data;
				},function(response){
					console.log("error");
				})
			}

			$scope.adminDashboard=function(){
		    	$location.path('admin');
		    }

    getUser();
    getUsers();
    getNotesActual();
    getLabelsActual();


    $scope.closeNote=function(){
    	$scope.addNote();
	}



});
