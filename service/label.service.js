angular.module('ToDo')
        .service('labelService', function(noteService) {
          this.labels = [];
             this.labelSetted = false;

          this.getLabels = function() {
            return this.labels;
          }
          this.initiateLabel = function () {
          var url = 'getAllLabel';
              var labels = noteService.service(url, 'GET');
              labels.then((response)=>{
                this.labels = response.data;
                return Promise.resolve(response);
              }, (response) => {
                console.log("Error", response.responseMessage);
              });
              return labels;
          };
          this.getLabelName = function(label,test) {
            for (var i = 0; i < this.labels.length; i++) {
              if (this.labels[i].labelId == label) {
                return this.labels[i].name;
              }
            }
          }
      });
      // .factory('labelService', function(noteService) {
      //   return {
      //     labels : [],
      //     labelSetted : false,
      //     getLabels : function() {
      //       return this.labels;
      //     },
      //     initiateLabel : function () {
      //       var url = 'getAllLabel';
      //       var labels = noteService.service(url, 'GET');
      //         labels.then((response)=>{
      //           this.labels = response.data;
      //           this.labelSetted = true;
      //           return Promise.resolve(response);
      //         }, (response) => {
      //           console.log("Error", response.responseMessage);
      //           return Promise.reject(response);
      //         });
      //       return labels;
      //     },
      //     getLabelName : function(label) {
      //       for (var i = 0; i < this.labels.length; i++) {
      //         if (this.labels[i].labelId == label) {
      //           return this.labels[i].name;
      //         }
      //       }
      //     }
      //   }
      // })
