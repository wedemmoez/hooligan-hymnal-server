var Foes = require('../models/foes');
var bodyParser = require('body-parser');
var config = require("../config.js");

var foes_cache = {
  data: null,
  last_refresh: 0,
  force_reload: function(res) {
    var that = this;
    Foes.find((error, foes) => {
      if (error) {
        that.data = null;
        that.last_refresh = 0;
        if(res != null) res.send(error);
      }
      that.data = foes;
      that.last_refresh = Date.now();
      if(res != null) res.send(that.data);
    });
  },
  send_data: function(res) {
    if(this.last_refresh + config.cache_timeout < Date.now()) {
      this.force_reload(res);
    } else {
      res.send(this.data);
    }
  }
}

module.exports = app => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );

  // returns all players
  app.get('/api/foes', (req, res) => {
    foes_cache.send_data(res);
  });

  // returns single player by _id
  app.get('/api/foes/:id', (req, res) => {
    Foes.findById(req.params.id, (error, foe) => {
      res.send(foe);
      foes_cache.force_reload();
    });
  });

  // creates player
  app.post('/api/foes', (req, res) => {
    if(req.body.authKey !== process.env.AUTH_KEY) {
      res.status(403).send( {'error' : "bad auth key"});
      return;
    }
    var newFoe = Foes(req.body);
    newFoe.save((error, foe) => {
      error ? res.status(501).send({ error }) : res.send(foe);
      foes_cache.force_reload();
    });
  });

  // updates player
  app.put('/api/players/:id', (req, res) => {
    if(req.body.authKey !== process.env.AUTH_KEY) {
      res.status(403).send( {'error' : "bad auth key"});
      return;
    }
    Foes.findByIdAndUpdate(req.params.id, req.body, (error, foe) => {
      error ? res.status(501).send({ error }) : res.send(foe);
      foes_cache.force_reload();
    });
  });

  //deletes player
  app.delete('/api/players/:id', (req, res) => {
    if(req.body.authKey !== process.env.AUTH_KEY) {
      res.status(403).send( {'error' : "bad auth key"});
      return;
    }
    Foes.findByIdAndRemove(req.params.id, error => {
      error
        ? res.status(501).send({ error })
        : res.send({ message: 'Deleted' + req.params.id });
      foes_cache.force_reload();
    });
  });
};