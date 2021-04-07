
function $<Type extends Element = Element>(_string:string):NodeListOf<Type> {
  return document.querySelectorAll<Type>(_string);
}

function newId():string {
  return Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000);
}

function setTextToElement(element:Element, text:string) {
  element.innerHTML = "";
  let a = document.createElement('a');
  a.text = text;
  element.append(a);
}

function isDescendant(parent:Element, child:Element):boolean {
  if (parent == child) return true;
  
    var node = child.parentNode;
    while (node != null) 
    {
        if (node == parent) return true;
        node = node.parentNode;
    }
    return false;
}





function removeSpacesFromEnds(_str:string):string {
  for (let c = 0; c < _str.length; c++)
  {
    if (_str[0] !== " ") continue;
    _str = _str.substr(1, _str.length);
  }

  for (let c = _str.length; c > 0; c--)
  {
    if (_str[_str.length - 1] !== " ") continue;
    _str = _str.substr(0, _str.length - 1);
  }
  return _str;
} 








// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
function similarity(s1:string, s2:string):number {
  var longer = s1;
  var shorter = s2;

  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }

  var longerLength = longer.length;
  if (longerLength == 0) {return 1.0;}
  // @ts-ignore
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);


  function editDistance(s1:string, s2:string):number {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
        {
        costs[j] = j;
        } else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
            costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
      costs[s2.length] = lastValue;
    }

    return costs[s2.length];
  }
}

