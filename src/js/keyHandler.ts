import { App } from './app';

type ShortCut = {
  keys: string[],
  event: Function,
  ignoreIfInInputField?: boolean
}

let Keys: {[index: string]: boolean};
const KeyHandler = new (function () {
  const shortCuts:ShortCut[] = [
    {
      keys: ["ArrowLeft"],
      event: function (_e:KeyboardEvent) {
        if (App.curPage.pageIndex == App.lessonPage.pageIndex) return App.lessonPage.prevWord();
      }
    },
    {
      keys: ["ArrowRight"],
      event: function (_e:KeyboardEvent) {
        if (App.curPage.pageIndex == App.lessonPage.pageIndex) return App.lessonPage.nextWord();
      }
    },
    {
      keys: ["Enter"], 
      event: function (_e:KeyboardEvent) {
        //@ts-ignore
        let inInputField = _e.target.type == "text" || _e.target.type == "textarea";
        App.curPage.onEnterPress(inInputField);
      },
      ignoreIfInInputField: false
    }
  ];


  this.setup = function() {
    Keys = {};
    document.body.addEventListener("keydown", function(_e:KeyboardEvent) {
      Keys[_e["key"]] = true;
      let preventDefault = KeyHandler.handleKeys(_e);
      if (preventDefault) _e.preventDefault();
    });

    document.body.addEventListener("keyup", function(_e) {
      Keys[_e["key"]] = false;
    });
  }

  this.handleKeys = function(_event:KeyboardEvent) {
    // @ts-ignore
    let inInputField = _event.target.type == "text" || _event.target.type == "textarea";
    for (let i = 0; i < shortCuts.length; i++)
    {
      let curShortcut = shortCuts[i]; 
      if (curShortcut.ignoreIfInInputField && inInputField) continue;

      let succes = true;
      for (let i = 0; i < curShortcut.keys.length; i++)
      {
        let curKey:string = curShortcut.keys[i];
        if (Keys[curKey]) continue;
        succes = false;
        break;
      }

      if (!succes) continue;
      // @ts-ignore
      _event.target.blur();

      let status = false;
      try {status = curShortcut.event(_event);}
      catch (e) {console.warn(e)};
      Keys = {};
      return true;
    }
  }
} as any);


export default KeyHandler;