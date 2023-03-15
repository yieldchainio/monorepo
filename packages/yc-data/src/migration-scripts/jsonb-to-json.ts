var convertJSONarray = function (s: string) {
  var step1 = s.replace(/"{/g, "{").replace(/}"/g, "}").replace(/\\/g, "");
  //step1 = "{ {}, {}, {},...}"
  var step2 = "[" + step1.slice(1, -1) + "]";
  // step2 = "[ {}, {}, {}, ...]"
  var step3 = JSON.parse(step2);
  // step3 = [ {}, {}, {}, ...] the desired result :)
  return step3;
};
