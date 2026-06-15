/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CartContext: () => (/* binding */ CartContext),\n/* harmony export */   \"default\": () => (/* binding */ App),\n/* harmony export */   useCart: () => (/* binding */ useCart)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n// pages/_app.js\n// ─────────────────────────────────────────────────────────\n// Global app wrapper — provides the cart to every page\n// ─────────────────────────────────────────────────────────\n\n\n\n/* ── CART CONTEXT ─────────────────────────────────── */ const CartContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);\nfunction useCart() {\n    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(CartContext);\n}\nfunction CartProvider({ children }) {\n    const [items, setItems] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    // Load cart from localStorage on first render\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        try {\n            const saved = localStorage.getItem(\"quikcart_cart\");\n            if (saved) setItems(JSON.parse(saved));\n        } catch  {}\n    }, []);\n    // Save cart to localStorage whenever it changes\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        localStorage.setItem(\"quikcart_cart\", JSON.stringify(items));\n    }, [\n        items\n    ]);\n    function addItem(product, qty = 1) {\n        setItems((prev)=>{\n            const existing = prev.find((i)=>i.id === product.id);\n            if (existing) {\n                return prev.map((i)=>i.id === product.id ? {\n                        ...i,\n                        quantity: i.quantity + qty\n                    } : i);\n            }\n            return [\n                ...prev,\n                {\n                    ...product,\n                    quantity: qty\n                }\n            ];\n        });\n    }\n    function removeItem(id) {\n        setItems((prev)=>prev.filter((i)=>i.id !== id));\n    }\n    function updateQty(id, qty) {\n        if (qty < 1) return removeItem(id);\n        setItems((prev)=>prev.map((i)=>i.id === id ? {\n                    ...i,\n                    quantity: qty\n                } : i));\n    }\n    function clearCart() {\n        setItems([]);\n    }\n    const totalItems = items.reduce((s, i)=>s + i.quantity, 0);\n    const subtotal = items.reduce((s, i)=>s + i.price * i.quantity, 0);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CartContext.Provider, {\n        value: {\n            items,\n            addItem,\n            removeItem,\n            updateQty,\n            clearCart,\n            totalItems,\n            subtotal\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\HP\\\\OneDrive\\\\Documents\\\\QuikCart-Final\\\\pages\\\\_app.js\",\n        lineNumber: 61,\n        columnNumber: 5\n    }, this);\n}\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CartProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\HP\\\\OneDrive\\\\Documents\\\\QuikCart-Final\\\\pages\\\\_app.js\",\n            lineNumber: 70,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\HP\\\\OneDrive\\\\Documents\\\\QuikCart-Final\\\\pages\\\\_app.js\",\n        lineNumber: 69,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGdCQUFnQjtBQUNoQiw0REFBNEQ7QUFDNUQsdURBQXVEO0FBQ3ZELDREQUE0RDs7QUFFVTtBQUN4QztBQUU5Qix1REFBdUQsR0FDaEQsTUFBTUksNEJBQWNKLG9EQUFhQSxDQUFDLE1BQUs7QUFFdkMsU0FBU0s7SUFDZCxPQUFPSixpREFBVUEsQ0FBQ0c7QUFDcEI7QUFFQSxTQUFTRSxhQUFhLEVBQUVDLFFBQVEsRUFBRTtJQUNoQyxNQUFNLENBQUNDLE9BQU9DLFNBQVMsR0FBR1AsK0NBQVFBLENBQUMsRUFBRTtJQUVyQyw4Q0FBOEM7SUFDOUNDLGdEQUFTQSxDQUFDO1FBQ1IsSUFBSTtZQUNGLE1BQU1PLFFBQVFDLGFBQWFDLE9BQU8sQ0FBQztZQUNuQyxJQUFJRixPQUFPRCxTQUFTSSxLQUFLQyxLQUFLLENBQUNKO1FBQ2pDLEVBQUUsT0FBTSxDQUFDO0lBQ1gsR0FBRyxFQUFFO0lBRUwsZ0RBQWdEO0lBQ2hEUCxnREFBU0EsQ0FBQztRQUNSUSxhQUFhSSxPQUFPLENBQUMsaUJBQWlCRixLQUFLRyxTQUFTLENBQUNSO0lBQ3ZELEdBQUc7UUFBQ0E7S0FBTTtJQUVWLFNBQVNTLFFBQVFDLE9BQU8sRUFBRUMsTUFBTSxDQUFDO1FBQy9CVixTQUFTVyxDQUFBQTtZQUNQLE1BQU1DLFdBQVdELEtBQUtFLElBQUksQ0FBQ0MsQ0FBQUEsSUFBS0EsRUFBRUMsRUFBRSxLQUFLTixRQUFRTSxFQUFFO1lBQ25ELElBQUlILFVBQVU7Z0JBQ1osT0FBT0QsS0FBS0ssR0FBRyxDQUFDRixDQUFBQSxJQUNkQSxFQUFFQyxFQUFFLEtBQUtOLFFBQVFNLEVBQUUsR0FBRzt3QkFBRSxHQUFHRCxDQUFDO3dCQUFFRyxVQUFVSCxFQUFFRyxRQUFRLEdBQUdQO29CQUFJLElBQUlJO1lBRWpFO1lBQ0EsT0FBTzttQkFBSUg7Z0JBQU07b0JBQUUsR0FBR0YsT0FBTztvQkFBRVEsVUFBVVA7Z0JBQUk7YUFBRTtRQUNqRDtJQUNGO0lBRUEsU0FBU1EsV0FBV0gsRUFBRTtRQUNwQmYsU0FBU1csQ0FBQUEsT0FBUUEsS0FBS1EsTUFBTSxDQUFDTCxDQUFBQSxJQUFLQSxFQUFFQyxFQUFFLEtBQUtBO0lBQzdDO0lBRUEsU0FBU0ssVUFBVUwsRUFBRSxFQUFFTCxHQUFHO1FBQ3hCLElBQUlBLE1BQU0sR0FBRyxPQUFPUSxXQUFXSDtRQUMvQmYsU0FBU1csQ0FBQUEsT0FBUUEsS0FBS0ssR0FBRyxDQUFDRixDQUFBQSxJQUFLQSxFQUFFQyxFQUFFLEtBQUtBLEtBQUs7b0JBQUUsR0FBR0QsQ0FBQztvQkFBRUcsVUFBVVA7Z0JBQUksSUFBSUk7SUFDekU7SUFFQSxTQUFTTztRQUNQckIsU0FBUyxFQUFFO0lBQ2I7SUFFQSxNQUFNc0IsYUFBYXZCLE1BQU13QixNQUFNLENBQUMsQ0FBQ0MsR0FBR1YsSUFBTVUsSUFBSVYsRUFBRUcsUUFBUSxFQUFFO0lBQzFELE1BQU1RLFdBQWExQixNQUFNd0IsTUFBTSxDQUFDLENBQUNDLEdBQUdWLElBQU1VLElBQUlWLEVBQUVZLEtBQUssR0FBR1osRUFBRUcsUUFBUSxFQUFFO0lBRXBFLHFCQUNFLDhEQUFDdEIsWUFBWWdDLFFBQVE7UUFBQ0MsT0FBTztZQUFFN0I7WUFBT1M7WUFBU1U7WUFBWUU7WUFBV0M7WUFBV0M7WUFBWUc7UUFBUztrQkFDbkczQjs7Ozs7O0FBR1A7QUFFZSxTQUFTK0IsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxxQkFDRSw4REFBQ2xDO2tCQUNDLDRFQUFDaUM7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QiIsInNvdXJjZXMiOlsid2VicGFjazovL3F1aWtjYXJ0Ly4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHBhZ2VzL19hcHAuanNcbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gR2xvYmFsIGFwcCB3cmFwcGVyIOKAlCBwcm92aWRlcyB0aGUgY2FydCB0byBldmVyeSBwYWdlXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnXG5cbi8qIOKUgOKUgCBDQVJUIENPTlRFWFQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovXG5leHBvcnQgY29uc3QgQ2FydENvbnRleHQgPSBjcmVhdGVDb250ZXh0KG51bGwpXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VDYXJ0KCkge1xuICByZXR1cm4gdXNlQ29udGV4dChDYXJ0Q29udGV4dClcbn1cblxuZnVuY3Rpb24gQ2FydFByb3ZpZGVyKHsgY2hpbGRyZW4gfSkge1xuICBjb25zdCBbaXRlbXMsIHNldEl0ZW1zXSA9IHVzZVN0YXRlKFtdKVxuXG4gIC8vIExvYWQgY2FydCBmcm9tIGxvY2FsU3RvcmFnZSBvbiBmaXJzdCByZW5kZXJcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc2F2ZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncXVpa2NhcnRfY2FydCcpXG4gICAgICBpZiAoc2F2ZWQpIHNldEl0ZW1zKEpTT04ucGFyc2Uoc2F2ZWQpKVxuICAgIH0gY2F0Y2gge31cbiAgfSwgW10pXG5cbiAgLy8gU2F2ZSBjYXJ0IHRvIGxvY2FsU3RvcmFnZSB3aGVuZXZlciBpdCBjaGFuZ2VzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3F1aWtjYXJ0X2NhcnQnLCBKU09OLnN0cmluZ2lmeShpdGVtcykpXG4gIH0sIFtpdGVtc10pXG5cbiAgZnVuY3Rpb24gYWRkSXRlbShwcm9kdWN0LCBxdHkgPSAxKSB7XG4gICAgc2V0SXRlbXMocHJldiA9PiB7XG4gICAgICBjb25zdCBleGlzdGluZyA9IHByZXYuZmluZChpID0+IGkuaWQgPT09IHByb2R1Y3QuaWQpXG4gICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgcmV0dXJuIHByZXYubWFwKGkgPT5cbiAgICAgICAgICBpLmlkID09PSBwcm9kdWN0LmlkID8geyAuLi5pLCBxdWFudGl0eTogaS5xdWFudGl0eSArIHF0eSB9IDogaVxuICAgICAgICApXG4gICAgICB9XG4gICAgICByZXR1cm4gWy4uLnByZXYsIHsgLi4ucHJvZHVjdCwgcXVhbnRpdHk6IHF0eSB9XVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVJdGVtKGlkKSB7XG4gICAgc2V0SXRlbXMocHJldiA9PiBwcmV2LmZpbHRlcihpID0+IGkuaWQgIT09IGlkKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVF0eShpZCwgcXR5KSB7XG4gICAgaWYgKHF0eSA8IDEpIHJldHVybiByZW1vdmVJdGVtKGlkKVxuICAgIHNldEl0ZW1zKHByZXYgPT4gcHJldi5tYXAoaSA9PiBpLmlkID09PSBpZCA/IHsgLi4uaSwgcXVhbnRpdHk6IHF0eSB9IDogaSkpXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhckNhcnQoKSB7XG4gICAgc2V0SXRlbXMoW10pXG4gIH1cblxuICBjb25zdCB0b3RhbEl0ZW1zID0gaXRlbXMucmVkdWNlKChzLCBpKSA9PiBzICsgaS5xdWFudGl0eSwgMClcbiAgY29uc3Qgc3VidG90YWwgICA9IGl0ZW1zLnJlZHVjZSgocywgaSkgPT4gcyArIGkucHJpY2UgKiBpLnF1YW50aXR5LCAwKVxuXG4gIHJldHVybiAoXG4gICAgPENhcnRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IGl0ZW1zLCBhZGRJdGVtLCByZW1vdmVJdGVtLCB1cGRhdGVRdHksIGNsZWFyQ2FydCwgdG90YWxJdGVtcywgc3VidG90YWwgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9DYXJ0Q29udGV4dC5Qcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPENhcnRQcm92aWRlcj5cbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICA8L0NhcnRQcm92aWRlcj5cbiAgKVxufVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJDYXJ0Q29udGV4dCIsInVzZUNhcnQiLCJDYXJ0UHJvdmlkZXIiLCJjaGlsZHJlbiIsIml0ZW1zIiwic2V0SXRlbXMiLCJzYXZlZCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiYWRkSXRlbSIsInByb2R1Y3QiLCJxdHkiLCJwcmV2IiwiZXhpc3RpbmciLCJmaW5kIiwiaSIsImlkIiwibWFwIiwicXVhbnRpdHkiLCJyZW1vdmVJdGVtIiwiZmlsdGVyIiwidXBkYXRlUXR5IiwiY2xlYXJDYXJ0IiwidG90YWxJdGVtcyIsInJlZHVjZSIsInMiLCJzdWJ0b3RhbCIsInByaWNlIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();