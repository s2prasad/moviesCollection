(function() {
    angular
        .module('moviesApp', [])
        .controller('MoviesListCtrl', MoviesListCtrl)
        .factory('moviesService', moviesService);

    function MoviesListCtrl($scope, $http, moviesService) {
        var vm = this;
        vm.configure = configure;
        vm.setActiveMovie = setActiveMovie;
        vm.setActiveCast = setActiveCast;
        vm.getCollection = getCollection;
        vm.getMovie = getMovie;
        vm.getCredit = getCredit;
        vm.displayImage = displayImage;

        function setActiveMovie(movie) {
            vm.activeMovie = movie;
        };

        function setActiveCast(cast) {
            vm.activeCast = cast;
        };

        function configure(){
            moviesService.movieConfiguration().then(function(data) {
                vm.configResponse = data;
                vm.baseURL = data.images.base_url;
                vm.imgURL = data.images.base_url+""+data.images.poster_sizes[0];
                vm.posterURL = data.images.base_url+""+data.images.poster_sizes[3];
                vm.profileURL = data.images.base_url+""+data.images.profile_sizes[0];
            }); 
        };
    	
        function getCollection(){
            moviesService.getCollections().then(function(data) {
                vm.name = data.name;
                vm.parts = data.parts;
                //Set default active image 
                vm.activeMovie = vm.parts[0];
                //Set default first movie 
                vm.getMovie(vm.parts[0].id);
            });
        };

        vm.configure();
        vm.getCollection();

        function getMovie(id){
            moviesService.getMovies(id).then(function(data) {
                vm.movieResponse = data;
                vm.movieName = data.original_title;
                vm.movieImg = vm.baseURL+"w185"+data.poster_path;
                vm.movieDesc = data.overview;
                vm.getCredit(id);
            });
        };

        function getCredit(id){
            var writersArr =[], directorArr=[], castArr=[];
            moviesService.getCredits(id).then(function(data) {
                vm.creditResponse = data;
                vm.crew = data.crew;
                var crewLen = vm.crew.length; 
                //Get writers and Directors based on Job description
                for (var i = 0; i < crewLen; i++) {
                    if(vm.crew[i].department == "Writing"){
                        writersArr.push(vm.crew[i].name);
                    }
                    if(vm.crew[i].job == "Director"){
                        directorArr.push(vm.crew[i].name)
                    }
                };
                vm.writers = writersArr.join(', ');
                vm.directors = directorArr.join(', ');

                //Get Stars
                var casts = data.cast;
                vm.topCasts = [];
                for (var i = 0; i < 5; i++) {
                    vm.topCasts.push(casts[i]);
                    castArr.push(casts[i].name);
                };
                //Set default image to first cast image
                vm.castImageURL = vm.posterURL + casts[0].profile_path;
                //Set Default active cast
                vm.activeCast = vm.topCasts[0];
                vm.stars = castArr.join(', ');
            });
        };

        function displayImage(cast){
            vm.castImageURL = vm.posterURL + cast.profile_path;
        };
    };
    function moviesService($http ){
        //Return public API.
        //Service to make http requests
        var api_key = "a6d7c0ca44addd1fde9c680ac109864e";
        var service = { 

            movieConfiguration : function ( ) {
                var configRequestURL= "http://api.themoviedb.org/3/configuration?api_key="+api_key;
                var promise = $http.get(configRequestURL).then(function (response) {
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
              // Return the promise to the controller
              return promise;
            },

            getCollections : function(){
                var collectionURL = "http://api.themoviedb.org/3/collection/528?api_key="+api_key;
                var promise = $http.get(collectionURL).then(function (response) {
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
              // Return the promise to the controller
              return promise;
            },

            getMovies : function(id){
                var movieURL = "http://api.themoviedb.org/3/movie/"+id+"?api_key="+api_key;
                var promise = $http.get(movieURL).then(function (response) {
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                  // Return the promise to the controller
                  return promise;
            },

            getCredits : function(id){
                var creditsURL = "http://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+api_key;
                var promise = $http.get(creditsURL).then(function (response) {
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
                  // Return the promise to the controller
                  return promise;
            }
        };
    return service;
            
    };
})();