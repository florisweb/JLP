import App from 'app';

type ShortCut = {
  keys: String[],
  event: Function,
  ignoreIfInInputField?: boolean
}

type keyArr = {

}


let KEYS:keyArr = {};
const KeyHandler = new (_KeyHandler() as any);
export default KeyHandler;

function _KeyHandler() {
  this.keys = {};

  let shortCuts:ShortCut[] = [
    {
      keys: ["Enter"], 
      event: function (_e:KeyboardEvent) {
        //@ts-ignore
        let inInputField = _e.target.type == "text" || _e.target.type == "textarea";
        if (!inInputField) return;
        App.reviewPage.checkAnswer();
      },
      ignoreIfInInputField: false
    },
  ];


  this.setup = function() {
    document.body.addEventListener("keydown", function(_e:KeyboardEvent) {
      KEYS[_e["key"]] = true;
      let preventDefault = KeyHandler.handleKeys(KEYS, _e);
      if (preventDefault) _e.preventDefault();
    });

    document.body.addEventListener("keyup", function(_e) {
      KEYS[_e["key"]] = false;
    });
  }

  this.handleKeys = function(_keyArr:KeyArr, _event:KeyboardEvent) {
    let inInputField = _event.target.type == "text" || _event.target.type == "textarea";

    for (let i = 0; i < shortCuts.length; i++)
    {
      let curShortcut = shortCuts[i]; 
      if (curShortcut.ignoreIfInInputField && inInputField) continue;

      let succes = true;
      for (let i = 0; i < curShortcut.keys.length; i++)
      {
        let curKey:String = curShortcut.keys[i];
        if (_keyArr[curKey]) continue;
        succes = false;
        break;
      }

      if (!succes) continue;
      
      _event.target.blur();

      let status = false;
      try {status = curShortcut.event(_event);}
      catch (e) {console.warn(e)};
      KEYS = {};
      return true;
    }
  }

}








