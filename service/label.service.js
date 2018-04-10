angular.module('ToDo')
  .service('labelService', function(noteService) {
    this.labels = [];
    this.labelSetted = false;
    /**function to return labels*/
    this.getLabels = function() {
      return this.labels;
    }

    /**function to initialize all the labels*/
    this.initiateLabel = function() {
      var url = 'getalllabel';
      var labels = noteService.service(url, 'GET');
      labels.then((response) => {
        this.labels = response.data;
        return Promise.resolve(response);
      }, (response) => {
        console.log("Error", response.responseMessage);
      });
      return labels;
    };

    /**function to get label name*/
    this.getLabelName = function(label, test) {
      for (var i = 0; i < this.labels.length; i++) {
        if (this.labels[i].labelId == label) {
          return this.labels[i].name;
        }
      }
    }
  });
