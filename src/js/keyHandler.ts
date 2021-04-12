
type ShortCut = {
  keys: String[],
  event,
  ignoreIfInInputField?: boolean
}


let KEYS = {};
const KeyHandler = new _KeyHandler();
export default KeyHandler;

function _KeyHandler() {
  this.keys = {};

  let shortCuts:ShortCut[] = [
    {
      keys: ["Enter"], 
      event: function (_e:Event) {
        //@ts-ignore
        let inInputField = _e.target.type == "text" || _e.target.type == "textarea";
        if (!inInputField) return;
        App.reviewPage.checkAnswer();
      },
      ignoreIfInInputField: false
    },
  ];


  this.handleKeys = function(_keyArr, _event) {
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








