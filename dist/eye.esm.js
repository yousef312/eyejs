/**
 * @typedef {Object} AttrMap
 * @property {HTMLDivElement} parent - append newly created element to a parent
 * @property {Array<String>|String} class - class or array of classes to set
 * @property {String} id - set element ID
 * @property {Object} data - dataset values to set
 * @property {String} text - set element text
 * @property {String} html - set element html
 */

/**
 * @typedef {Object} EyeElement eye element definition
 * @property {(tag: String, attrs: AttrMap) => EyeElement} eye - The main function to create or select elements.
 * @property {(set_to?: string) => EyeElement} show - Show the element, optional customize the display value, inline-bloc, bloc.... .
 * @property {() => EyeElement} hide - Hide the element.
 * @property {(index: number) => EyeElement} child - Function to get a child element by index.
 * @property {(key: String, value: *) => EyeElement} refer - Set or get a hidden WeakMap attributes
 * @property {(key: String, subfind: number) => EyeElement} unrefer - Remove/unset a WeakMap attributes, optionally `subfind` it if array is set!
 * @property {(event: String, callback: Function) => EyeElement} on - Attach an event listener to `event`
 * @property {(parent: HTMLElement) => EyeElement} appendTo - Append this element to an other
 * @property {(key: String, value: String) => EyeElement|String} attr - Set or get a value of certain attribute
 * @property {(key: String, value: String) => EyeElement|string} css - Modify or get element style
 * @property {(key: string, value: string) => DOMStringMap|string} data - Set or get a dataset value of the attribute
 * @property {(value: String) => EyeElement|string} text - Set or get elements text content
 * @property {(value: String) => EyeElement|string} html - Set or get elements html content
 * @property {Function} [eventName] - Functions for various events (e.g., click, focus, etc.).
 * @property {boolean} isEyeInstance - Flag to check if the element is an Eye instance.
 * @property {(action: String, value: String, opt?: String) => boolean} class - perform class manipulation
 */

/**
 * @typedef {EyeElement & {
 *  refresh: (attrs: AttrMap) => ModelEyeElement
 * }} ModelEyeElement eye element definition for model elements
 */

const events = [
  // Mouse Events
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "mouseover",
  "mouseout",
  "contextmenu",

  // Keyboard Events
  "keydown",
  "keypress", // Deprecated
  "keyup",

  // Focus Events
  "focus",
  "blur",
  "focusin",
  "focusout",

  // Form Events
  "submit",
  "change",
  "input",
  "reset",
  "select",

  // Touch Events (for mobile)
  "touchstart",
  "touchend",
  "touchmove",
  "touchcancel",

  // Pointer Events
  "pointerdown",
  "pointerup",
  "pointermove",
  "pointerenter",
  "pointerleave",
  "pointercancel",

  // Drag and Drop Events
  "dragstart",
  "dragend",
  "dragenter",
  "dragover",
  "dragleave",
  "drop",

  // Window/Document Events
  "resize",
  "scroll",
  "load",
  "beforeunload",
  "unload",

  // Media Events
  "play",
  "pause",
  "ended",
  "volumechange",
  "timeupdate",

  // Clipboard Events
  "copy",
  "cut",
  "paste",

  // Animation and Transition Events
  "animationstart",
  "animationend",
  "animationiteration",
  "transitionstart",
  "transitionend",

  // Mutation Events
  "DOMSubtreeModified",
  "DOMNodeInserted",
  "DOMNodeRemoved",

  // Other Events
  "error",
  "hashchange",
  "popstate",
];

const htmlElements = [
  // Metadata
  "base",
  "head",
  "link",
  "meta",
  "style",
  "title",

  // Sections
  "body",
  "address",
  "article",
  "aside",
  "footer",
  "header",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "main",
  "nav",
  "section",

  // Text content
  "blockquote",
  "dd",
  "div",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "hr",
  "li",
  "ol",
  "p",
  "pre",
  "ul",

  // Inline text semantics
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",

  // Image and multimedia
  "area",
  "audio",
  "img",
  "map",
  "track",
  "video",

  // Embedded content
  "embed",
  "iframe",
  "object",
  "picture",
  "portal",
  "source",

  // Scripting
  "canvas",
  "noscript",
  "script",

  // Demarcating edits
  "del",
  "ins",

  // Table content
  "caption",
  "col",
  "colgroup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",

  // Forms
  "button",
  "datalist",
  "fieldset",
  "form",
  "input",
  "label",
  "legend",
  "meter",
  "optgroup",
  "option",
  "output",
  "progress",
  "select",
  "textarea",

  // Interactive elements
  "details",
  "dialog",
  "summary",

  // Web components / scripting base
  "slot",
  "template",
];
const hiddenAttributes = new WeakMap();

function flat(word) {
  let n = "";
  for (let i = 0; i < word.length; i++) {
    const t = word[i];
    if (t === t.toUpperCase() && t !== t.toLowerCase()) n += "-" + t;
    else n += t;
  }
  return n.toLowerCase();
}

/**
 * cmcl stands for Create Model Children Layers, recursively creates model layers one by one
 * @param {EyeElement} parent
 * @param {Object} layer
 * @returns {Array<{name: string,set: (parent: EyeElement, value: String) =>}>}
 */
function cmcl(parent, layer) {
  let obj = [];
  for (const key in layer) {
    const subcontent = layer[key];
    const [def, _set] = key.split(":");
    const [tagName, ...cls] = def.split(".");
    let [_set_name = null, _set_default = null] = (_set || "")
      .split("-")
      .map((a) => a.trim());

    let elm = eye(tagName.trim(), {
      class: cls,
      parent,
      data: _set ? { value: _set_name } : undefined,
    });

    if (_set && _set_name) {
      obj.push({
        name: _set_name,
        set: function (parent, value) {
          let elm = parent.querySelector(`[data-value="${_set_name}"]`);
          elm.textContent = value ?? _set_default;
        },
      });
    }

    // recursive
    if (
      subcontent &&
      typeof subcontent === "object" &&
      !(subcontent instanceof Array)
    )
      obj = obj.concat(cmcl(elm, subcontent));
  }
  return obj;
}

/**
 * Creates or select nodes using css selectors, offering a pack of useful functions to use around your code!
 * @param {String} tag
 * @param {AttrMap} attrs
 * @param {*} css CSS styles to be applied to the element.
 * @returns {EyeElement|(attrs: AttrMap) => ModelEyeElement|Array<>}
 */
function eye(tag, attrs, css) {
  if (css instanceof Array) children = css;
  /**
   * @type {EyeElement}
   */
  let elm,
    selectFunc = "querySelector",
    parent = this === undefined || this instanceof Window ? document : this;

  if (tag instanceof HTMLElement) elm = tag;
  else {
    if (tag.indexOf("model:") === 0) {
      if (!attrs) throw new Error("Model tag must have attributes!");
      tag = tag.split(":")[1];
      // creating a model
      let model = eye("div", {
        class: ["eye-model", tag],
        "data-model": tag,
        "data-eye-model": tag,
      });

      let sets = cmcl(model, attrs);

      /**
       * @param {string} attrs
       * @returns {ModelEyeElement}
       */
      return (attrs) => {
        let copy = eye(model.cloneNode(true), attrs);
        // define & attach the refresh function
        copy.refresh = function (attrs = {}) {
          let def = attrs.default === false ? false : true;
          sets.forEach((item) => {
            if (def === true || (!def && attrs.hasOwnProperty(item.name)))
              item.set(copy, attrs[item.name]);
          });
          return this;
        };

        copy.refresh(attrs);
        return eye(copy, attrs);
      };
    }
    // there is three cases
    if (attrs && attrs.all === true)
      // CASE 1: parent is not docuement & all=true
      selectFunc = "querySelectorAll";
    if (parent == document && htmlElements.indexOf(tag) != -1)
      // CASE 3: parent is document & user input a tag name
      selectFunc = "createElement";

    elm = parent[selectFunc](tag);
  }

  if (elm instanceof NodeList) {
    elm.forEach((nd) => eye(nd));
    // for nodelist there's some other available functions
    return [...elm];
  }

  if (!elm) return null;
  if (elm.isEyeInstance) return elm;

  elm.isEyeInstance = true;
  // adding a very special function
  elm.eye = eye;

  // adding the element itself
  // usuage:
  // item.set("id=menu-item","contentEditable=true","data-index=15",...);
  elm.set = function (value, ...args) {
    args.push(value);
    args.forEach((arg) => {
      if (arg.indexOf("=") != -1) {
        const [key, val] = arg.split("=");
        if (key.indexOf("data-") === 0) {
          this.dataset[flat(key.replace("data-", ""))] = val;
        } else {
          this.setAttribute(key, val);
        }
      } else if (arg.indexOf(":") != -1) {
        const [key, val] = arg.split(":");
        this.style[flat(key)] = val;
      } else this.setAttribute(arg, "");
    });

    return this;
  };

  elm.class = function (actions) {
    let vals = null;
    if (typeof actions === "number") return elm.classList.item(actions);

    actions.split(" ").forEach((action) => {
      if (action[0] == "-") {
        elm.classList.remove(action.substring(1, action.length));
      } else if (action[0] == "%") {
        elm.classList.toggle(action.substring(1, action.length));
      } else if (action[0] == "?") {
        vals = elm.classList.contains(action.substring(1, action.length));
      } else if (action.indexOf("/") != -1) {
        [v1, v2] = action.split("/");
        elm.classList.replace(v1, v2);
      } else {
        elm.classList.add(action.substring(1, action.length));
      }
    });

    return vals !== null ? vals : this;
  };

  elm.show = function (set_to) {
    this.style.display = set_to || "";
    return this;
  };

  elm.hide = function () {
    this.style.display = "none";
    return this;
  };

  elm.child = function (index) {
    return this.children[index] ? eye(this.children[index]) : null;
  };

  elm.refer = function (key, value) {
    if (value !== undefined) {
      let attr = hiddenAttributes.get(this);
      if (!attr) {
        attr = {};
        hiddenAttributes.set(this, attr);
      }

      // now a small check
      if (value instanceof Array) {
        // if value is instance of array means we're defining an array property of adding to one
        if (attr[key] instanceof Array) attr[key].push(value[0]);
        else attr[key] = [value[0]];
      } else attr[key] = value;
      return this;
    } else return hiddenAttributes.get(this)?.[key];
  };
  elm.unrefer = function (key, subfind) {
    let attr = hiddenAttributes.get(this);
    if (attr) {
      if (!subfind && typeof key === "string" && attr[key])
        attr[key] = undefined;
      else if (typeof subfind === "function" && attr[key] instanceof Array)
        attr[key].forEach((item, i, arr) => {
          if (subfind(item) === true) {
            arr.splice(i, 1);
            i--;
          }
        });
    }

    return this;
  };

  // re-assinging events handling system
  events.forEach((ev) => {
    var old;
    if (typeof elm[ev] == "function") {
      old = elm[ev];
    }
    elm[ev] = function (cb) {
      if (cb) {
        if (typeof cb == "function") elm.addEventListener(ev, cb);
      } else old.call(elm);
      return this;
    };
  });

  elm.on = function (evs, listener) {
    evs = evs.split(" ");
    for (let j = 0; j < evs.length; j++) elm.addEventListener(evs[j], listener);
    return this;
  };

  elm.appendTo = function (parent) {
    if (parent) parent.append(this);
    return this;
  };

  elm.attr = function (key, value) {
    if (key) {
      if (value) {
        if (value === false) this.removeAttribute(key);
        this.setAttribute(key, value);
      } else return this.getAttribute(key);
    }
    return this;
  };

  elm.css = function (key, value) {
    // usuage is wide customizable
    if (key) {
      if (value) elm.style[flat(key)] = value;
      else return this.style[flat(key)];
    }
    return this;
  };

  elm.data = function (key, value) {
    if (key) {
      if (value) this.dataset[key] = value;
      else return this.dataset[key];
    }
    return this.dataset;
  };

  elm.text = function (value) {
    if (value) this.textContent = value;
    else return this.textContent;
    return this;
  };

  elm.html = function (value) {
    if (value) this.innerHTML = value;
    else return this.innerHTML;
    return this;
  };

  // setting attributes & css
  let parentElm = null;
  if (attrs)
    for (const key in attrs) {
      const value = attrs[key];
      if (key == "class")
        elm.classList.add.apply(
          elm.classList,
          value instanceof Array ? value : value.split(" ")
        );
      else if (key == "text") elm.textContent = value;
      else if (key == "html") elm.innerHTML = value;
      else if (key == "data") for (const k in value) elm.dataset[k] = value[k];
      else if (key == "parent") parentElm = value;
      else if (key in elm) elm[key] = value;
      else if (key[0] != "_") elm.setAttribute(key, elm); // we must ignore _ started keys 'cause they are used by models
    }
  if (css)
    for (const key in css)
      if (key.indexOf("-") != -1) elm.style[key] = css[key];
      else elm.style[flat(key)] = css[key];

  if (parentElm) parentElm.append(elm);
  return elm;
}

// gloablly exposed
window.eye = eye;

export { eye as default };
//# sourceMappingURL=eye.esm.js.map
