var Rdam = function(db, callback) {

  this.metrics = [];
};


Rdam.prototype = {
  init: function(db, callback) {
    this.setupDb(db, function() {
      callback();
    });

  },

  setubDb: function(db, callback){
    var self = this;
  },
};
exports.Rdam = Rdam;
