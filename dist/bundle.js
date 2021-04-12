/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/app.ts":
/*!***********************!*\
  !*** ./src/js/app.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nvar App = new function () {\n    var HTML = {\n        pages: $(\"#mainContent .page\")\n    };\n    this.setup = function () {\n        document.body.addEventListener(\"keydown\", function (_e) {\n            KEYS[_e[\"key\"]] = true;\n            var preventDefault = KeyHandler.handleKeys(KEYS, _e);\n            if (preventDefault)\n                _e.preventDefault();\n        });\n        document.body.addEventListener(\"keyup\", function (_e) {\n            KEYS[_e[\"key\"]] = false;\n        });\n    };\n    this.curPage = false;\n    this.reviewPage = new _reviewPage(openPage);\n    this.resultPage = new _resultPage(openPage);\n    function openPage(_index) {\n        for (var _i = 0, _a = HTML.pages; _i < _a.length; _i++) {\n            var page = _a[_i];\n            page.classList.add(\"hide\");\n        }\n        HTML.pages[_index].classList.remove(\"hide\");\n    }\n};\nApp.setup();\n\n\n\n//# sourceURL=webpack://jlp/./src/js/app.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/app.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;