import { App } from './app';
import Server from './server';
declare const window:any;

App.setup();
console.log(window.App = App);
console.log(window.Server = Server);
