'use strict';



function Timeout(f, ms){
  var t = {};

  t.conf = {
    ms: ms,
    f: function(){
      t.state.isOn = false;
      f();
    }
  };

  t.state = {
    setTimeoutInstance: undefined,
    isOn: false
  };

  return start(t);
}


function start(t){
  if (!isOn(t)){
    t.state.isOn = !t.state.isOn;
    t.state.setTimeoutInstance = setTimeout(t.conf.f, t.conf.ms);
  }
  return t;
}


function stop(t){
  if (isOn(t)){
    t.state.isOn = !t.state.isOn;
    t.state.setTimeoutInstance = clearTimeout(t.state.setTimeoutInstance);
  }
  return t;
}


function restart(t){
  start(stop(t));
}


function isOn(t){
  return t.state.isOn;
}


function isOff(t){
  return !t.state.isOn;
}



module.exports = Timeout;
module.exports.start = start;
module.exports.stop = stop;
module.exports.restart = restart;
module.exports.isOn = isOn;
module.exports.isOff = isOff;
