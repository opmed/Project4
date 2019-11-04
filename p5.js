/*! p5.js v0.9.0 July 01, 2019 */
/**
 * <p>The web is much more than just canvas and p5.dom makes it easy to interact
 * with other HTML5 objects, including text, hyperlink, image, input, video,
 * audio, and webcam.</p>
 * <p>There is a set of creation methods, DOM manipulation methods, and
 * an extended <a href="#/p5.Element">p5.Element</a> that supports a range of HTML elements. See the
 * <a href='https://github.com/processing/p5.js/wiki/Beyond-the-canvas'>
 * beyond the canvas tutorial</a> for a full overview of how this addon works.
 *
 * <p>Methods and properties shown in black are part of the p5.js core, items in
 * blue are part of the p5.dom library. You will need to include an extra file
 * in order to access the blue functions. See the
 * <a href='http://p5js.org/libraries/#using-a-library'>using a library</a>
 * section for information on how to include this library. p5.dom comes with
 * <a href='http://p5js.org/download'>p5 complete</a> or you can download the single file
 * <a href='https://raw.githubusercontent.com/lmccart/p5.js/master/lib/addons/p5.dom.js'>
 * here</a>.</p>
 * <p>See <a href='https://github.com/processing/p5.js/wiki/Beyond-the-canvas'>tutorial: beyond the canvas</a>
 * for more info on how to use this library.</a>
 *
 * @module p5.dom
 * @submodule p5.dom
 * @for p5
 * @main
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5.dom', ['p5'], function(p5) {
      factory(p5);
    });
  else if (typeof exports === 'object') factory(require('../p5'));
  else factory(root['p5']);
})(this, function(p5) {
  // =============================================================================
  //                         p5 additions
  // =============================================================================

  /**
   * Searches the page for an element with the given ID, class, or tag name (using the '#' or '.'
   * prefixes to specify an ID or class respectively, and none for a tag) and returns it as
   * a <a href="#/p5.Element">p5.Element</a>. If a class or tag name is given with more than 1 element,
   * only the first element will be returned.
   * The DOM node itself can be accessed with .elt.
   * Returns null if none found. You can also specify a container to search within.
   *
   * @method select
   * @param  {String} name id, class, or tag name of element to search for
   * @param  {String|p5.Element|HTMLElement} [container] id, <a href="#/p5.Element">p5.Element</a>, or
   *                                             HTML element to search within
   * @return {p5.Element|null} <a href="#/p5.Element">p5.Element</a> containing node found
   * @example
   * <div ><code class='norender'>
   * function setup() {
   *   createCanvas(100, 100);
   *   //translates canvas 50px down
   *   select('canvas').position(100, 100);
   * }
   * </code></div>
   * <div><code class='norender'>
   * // these are all valid calls to select()
   * var a = select('#moo');
   * var b = select('#blah', '#myContainer');
   * var c, e;
   * if (b) {
   *   c = select('#foo', b);
   * }
   * var d = document.getElementById('beep');
   * if (d) {
   *   e = select('p', d);
   * }
   * [a, b, c, d, e]; // unused
   * </code></div>
   *
   */
  p5.prototype.select = function(e, p) {
    p5._validateParameters('select', arguments);
    var res = null;
    var container = getContainer(p);
    if (e[0] === '.') {
      e = e.slice(1);
      res = container.getElementsByClassName(e);
      if (res.length) {
        res = res[0];
      } else {
        res = null;
      }
    } else if (e[0] === '#') {
      e = e.slice(1);
      res = container.getElementById(e);
    } else {
      res = container.getElementsByTagName(e);
      if (res.length) {
        res = res[0];
      } else {
        res = null;
      }
    }
    if (res) {
      return this._wrapElement(res);
    } else {
      return null;
    }
  };

  /**
   * Searches the page for elements with the given class or tag name (using the '.' prefix
   * to specify a class and no prefix for a tag) and returns them as <a href="#/p5.Element">p5.Element</a>s
   * in an array.
   * The DOM node itself can be accessed with .elt.
   * Returns an empty array if none found.
   * You can also specify a container to search within.
   *
   * @method selectAll
   * @param  {String} name class or tag name of elements to search for
   * @param  {String} [container] id, <a href="#/p5.Element">p5.Element</a>, or HTML element to search within
   * @return {p5.Element[]} Array of <a href="#/p5.Element">p5.Element</a>s containing nodes found
   * @example
   * <div class='norender'><code>
   * function setup() {
   *   createButton('btn');
   *   createButton('2nd btn');
   *   createButton('3rd btn');
   *   var buttons = selectAll('button');
   *
   *   for (var i = 0; i < buttons.length; i++) {
   *     buttons[i].size(100, 100);
   *   }
   * }
   * </code></div>
   * <div class='norender'><code>
   * // these are all valid calls to selectAll()
   * var a = selectAll('.moo');
   * a = selectAll('div');
   * a = selectAll('button', '#myContainer');
   *
   * var d = select('#container');
   * a = selectAll('p', d);
   *
   * var f = document.getElementById('beep');
   * a = select('.blah', f);
   *
   * a; // unused
   * </code></div>
   *
   */
  p5.prototype.selectAll = function(e, p) {
    p5._validateParameters('selectAll', arguments);
    var arr = [];
    var res;
    var container = getContainer(p);
    if (e[0] === '.') {
      e = e.slice(1);
      res = container.getElementsByClassName(e);
    } else {
      res = container.getElementsByTagName(e);
    }
    if (res) {
      for (var j = 0; j < res.length; j++) {
        var obj = this._wrapElement(res[j]);
        arr.push(obj);
      }
    }
    return arr;
  };

  /**
   * Helper function for select and selectAll
   */
  function getContainer(p) {
    var container = document;
    if (typeof p === 'string' && p[0] === '#') {
      p = p.slice(1);
      container = document.getElementById(p) || document;
    } else if (p instanceof p5.Element) {
      container = p.elt;
    } else if (p instanceof HTMLElement) {
      container = p;
    }
    return container;
  }

  /**
   * Helper function for getElement and getElements.
   */
  p5.prototype._wrapElement = function(elt) {
    var children = Array.prototype.slice.call(elt.children);
    if (elt.tagName === 'INPUT' && elt.type === 'checkbox') {
      var converted = new p5.Element(elt, this);
      converted.checked = function() {
        if (arguments.length === 0) {
          return this.elt.checked;
        } else if (arguments[0]) {
          this.elt.checked = true;
        } else {
          this.elt.checked = false;
        }
        return this;
      };
      return converted;
    } else if (elt.tagName === 'VIDEO' || elt.tagName === 'AUDIO') {
      return new p5.MediaElement(elt, this);
    } else if (elt.tagName === 'SELECT') {
      return this.createSelect(new p5.Element(elt, this));
    } else if (
      children.length > 0 &&
      children.every(function(c) {
        return c.tagName === 'INPUT' || c.tagName === 'LABEL';
      })
    ) {
      return this.createRadio(new p5.Element(elt, this));
    } else {
      return new p5.Element(elt, this);
    }
  };

  /**
   * Removes all elements created by p5, except any canvas / graphics
   * elements created by <a href="#/p5/createCanvas">createCanvas</a> or <a href="#/p5/createGraphics">createGraphics</a>.
   * Event handlers are removed, and element is removed from the DOM.
   * @method removeElements
   * @example
   * <div class='norender'><code>
   * function setup() {
   *   createCanvas(100, 100);
   *   createDiv('this is some text');
   *   createP('this is a paragraph');
   * }
   * function mousePressed() {
   *   removeElements(); // this will remove the div and p, not canvas
   * }
   * </code></div>
   *
   */
  p5.prototype.removeElements = function(e) {
    p5._validateParameters('removeElements', arguments);
    for (var i = 0; i < this._elements.length; i++) {
      if (!(this._elements[i].elt instanceof HTMLCanvasElement)) {
        this._elements[i].remove();
      }
    }
  };

  /**
   * The .<a href="#/p5.Element/changed">changed()</a> function is called when the value of an
   * element changes.
   * This can be used to attach an element specific event listener.
   *
   * @method changed
   * @param  {Function|Boolean} fxn function to be fired when the value of
   *                                an element changes.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div><code>
   * var sel;
   *
   * function setup() {
   *   textAlign(CENTER);
   *   background(200);
   *   sel = createSelect();
   *   sel.position(10, 10);
   *   sel.option('pear');
   *   sel.option('kiwi');
   *   sel.option('grape');
   *   sel.changed(mySelectEvent);
   * }
   *
   * function mySelectEvent() {
   *   var item = sel.value();
   *   background(200);
   *   text("it's a " + item + '!', 50, 50);
   * }
   * </code></div>
   *
   * <div><code>
   * var checkbox;
   * var cnv;
   *
   * function setup() {
   *   checkbox = createCheckbox(' fill');
   *   checkbox.changed(changeFill);
   *   cnv = createCanvas(100, 100);
   *   cnv.position(0, 30);
   *   noFill();
   * }
   *
   * function draw() {
   *   background(200);
   *   ellipse(50, 50, 50, 50);
   * }
   *
   * function changeFill() {
   *   if (checkbox.checked()) {
   *     fill(0);
   *   } else {
   *     noFill();
   *   }
   * }
   * </code></div>
   *
   * @alt
   * dropdown: pear, kiwi, grape. When selected text "its a" + selection shown.
   *
   */
  p5.Element.prototype.changed = function(fxn) {
    p5.Element._adjustListener('change', fxn, this);
    return this;
  };

  /**
   * The .<a href="#/p5.Element/input">input()</a> function is called when any user input is
   * detected with an element. The input event is often used
   * to detect keystrokes in a input element, or changes on a
   * slider element. This can be used to attach an element specific
   * event listener.
   *
   * @method input
   * @param  {Function|Boolean} fxn function to be fired when any user input is
   *                                detected within the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * // Open your console to see the output
   * function setup() {
   *   var inp = createInput('');
   *   inp.input(myInputEvent);
   * }
   *
   * function myInputEvent() {
   *   console.log('you are typing: ', this.value());
   * }
   * </code></div>
   *
   * @alt
   * no display.
   *
   */
  p5.Element.prototype.input = function(fxn) {
    p5.Element._adjustListener('input', fxn, this);
    return this;
  };

  /**
   * Helpers for create methods.
   */
  function addElement(elt, pInst, media) {
    var node = pInst._userNode ? pInst._userNode : document.body;
    node.appendChild(elt);
    var c = media
      ? new p5.MediaElement(elt, pInst)
      : new p5.Element(elt, pInst);
    pInst._elements.push(c);
    return c;
  }

  /**
   * Creates a &lt;div&gt;&lt;/div&gt; element in the DOM with given inner HTML.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createDiv
   * @param  {String} [html] inner HTML for element created
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div class='norender'><code>
   * createDiv('this is some text');
   * </code></div>
   */

  /**
   * Creates a &lt;p&gt;&lt;/p&gt; element in the DOM with given inner HTML. Used
   * for paragraph length text.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createP
   * @param  {String} [html] inner HTML for element created
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div class='norender'><code>
   * createP('this is some text');
   * </code></div>
   */

  /**
   * Creates a &lt;span&gt;&lt;/span&gt; element in the DOM with given inner HTML.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createSpan
   * @param  {String} [html] inner HTML for element created
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div class='norender'><code>
   * createSpan('this is some text');
   * </code></div>
   */
  var tags = ['div', 'p', 'span'];
  tags.forEach(function(tag) {
    var method = 'create' + tag.charAt(0).toUpperCase() + tag.slice(1);
    p5.prototype[method] = function(html) {
      var elt = document.createElement(tag);
      elt.innerHTML = typeof html === 'undefined' ? '' : html;
      return addElement(elt, this);
    };
  });

  /**
   * Creates an &lt;img&gt; element in the DOM with given src and
   * alternate text.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createImg
   * @param  {String} src src path or url for image
   * @param  {String} [alt] alternate text to be used if image does not load
   * @param  {Function} [successCallback] callback to be called once image data is loaded
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div class='norender'><code>
   * createImg('http://p5js.org/img/asterisk-01.png');
   * </code></div>
   */
  /**
   * @method createImg
   * @param  {String} src
   * @param  {Function} successCallback
   * @return {Object|p5.Element}
   */
  p5.prototype.createImg = function() {
    p5._validateParameters('createImg', arguments);
    var elt = document.createElement('img');
    elt.crossOrigin = 'Anonymous';
    var args = arguments;
    var self;
    var setAttrs = function() {
      self.width = elt.offsetWidth || elt.width;
      self.height = elt.offsetHeight || elt.height;
      if (args.length > 1 && typeof args[1] === 'function') {
        self.fn = args[1];
        self.fn();
      } else if (args.length > 1 && typeof args[2] === 'function') {
        self.fn = args[2];
        self.fn();
      }
    };
    elt.src = args[0];
    if (args.length > 1 && typeof args[1] === 'string') {
      elt.alt = args[1];
    }
    elt.onload = function() {
      setAttrs();
    };
    self = addElement(elt, this);
    return self;
  };

  /**
   * Creates an &lt;a&gt;&lt;/a&gt; element in the DOM for including a hyperlink.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createA
   * @param  {String} href       url of page to link to
   * @param  {String} html       inner html of link element to display
   * @param  {String} [target]   target where new link should open,
   *                             could be _blank, _self, _parent, _top.
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div class='norender'><code>
   * createA('http://p5js.org/', 'this is a link');
   * </code></div>
   */
  p5.prototype.createA = function(href, html, target) {
    p5._validateParameters('createA', arguments);
    var elt = document.createElement('a');
    elt.href = href;
    elt.innerHTML = html;
    if (target) elt.target = target;
    return addElement(elt, this);
  };

  /** INPUT **/

  /**
   * Creates a slider &lt;input&gt;&lt;/input&gt; element in the DOM.
   * Use .size() to set the display length of the slider.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createSlider
   * @param  {Number} min minimum value of the slider
   * @param  {Number} max maximum value of the slider
   * @param  {Number} [value] default value of the slider
   * @param  {Number} [step] step size for each tick of the slider (if step is set to 0, the slider will move continuously from the minimum to the maximum value)
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div><code>
   * var slider;
   * function setup() {
   *   slider = createSlider(0, 255, 100);
   *   slider.position(10, 10);
   *   slider.style('width', '80px');
   * }
   *
   * function draw() {
   *   var val = slider.value();
   *   background(val);
   * }
   * </code></div>
   *
   * <div><code>
   * var slider;
   * function setup() {
   *   colorMode(HSB);
   *   slider = createSlider(0, 360, 60, 40);
   *   slider.position(10, 10);
   *   slider.style('width', '80px');
   * }
   *
   * function draw() {
   *   var val = slider.value();
   *   background(val, 100, 100, 1);
   * }
   * </code></div>
   */
  p5.prototype.createSlider = function(min, max, value, step) {
    p5._validateParameters('createSlider', arguments);
    var elt = document.createElement('input');
    elt.type = 'range';
    elt.min = min;
    elt.max = max;
    if (step === 0) {
      elt.step = 0.000000000000000001; // smallest valid step
    } else if (step) {
      elt.step = step;
    }
    if (typeof value === 'number') elt.value = value;
    return addElement(elt, this);
  };

  /**
   * Creates a &lt;button&gt;&lt;/button&gt; element in the DOM.
   * Use .size() to set the display size of the button.
   * Use .mousePressed() to specify behavior on press.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createButton
   * @param  {String} label label displayed on the button
   * @param  {String} [value] value of the button
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div class='norender'><code>
   * var button;
   * function setup() {
   *   createCanvas(100, 100);
   *   background(0);
   *   button = createButton('click me');
   *   button.position(19, 19);
   *   button.mousePressed(changeBG);
   * }
   *
   * function changeBG() {
   *   var val = random(255);
   *   background(val);
   * }
   * </code></div>
   */
  p5.prototype.createButton = function(label, value) {
    p5._validateParameters('createButton', arguments);
    var elt = document.createElement('button');
    elt.innerHTML = label;
    if (value) elt.value = value;
    return addElement(elt, this);
  };

  /**
   * Creates a checkbox &lt;input&gt;&lt;/input&gt; element in the DOM.
   * Calling .checked() on a checkbox returns if it is checked or not
   *
   * @method createCheckbox
   * @param  {String} [label] label displayed after checkbox
   * @param  {boolean} [value] value of the checkbox; checked is true, unchecked is false
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div class='norender'><code>
   * var checkbox;
   *
   * function setup() {
   *   checkbox = createCheckbox('label', false);
   *   checkbox.changed(myCheckedEvent);
   * }
   *
   * function myCheckedEvent() {
   *   if (this.checked()) {
   *     console.log('Checking!');
   *   } else {
   *     console.log('Unchecking!');
   *   }
   * }
   * </code></div>
   */
  p5.prototype.createCheckbox = function() {
    p5._validateParameters('createCheckbox', arguments);
    var elt = document.createElement('div');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    elt.appendChild(checkbox);
    //checkbox must be wrapped in p5.Element before label so that label appears after
    var self = addElement(elt, this);
    self.checked = function() {
      var cb = self.elt.getElementsByTagName('input')[0];
      if (cb) {
        if (arguments.length === 0) {
          return cb.checked;
        } else if (arguments[0]) {
          cb.checked = true;
        } else {
          cb.checked = false;
        }
      }
      return self;
    };
    this.value = function(val) {
      self.value = val;
      return this;
    };
    if (arguments[0]) {
      var ran = Math.random()
        .toString(36)
        .slice(2);
      var label = document.createElement('label');
      checkbox.setAttribute('id', ran);
      label.htmlFor = ran;
      self.value(arguments[0]);
      label.appendChild(document.createTextNode(arguments[0]));
      elt.appendChild(label);
    }
    if (arguments[1]) {
      checkbox.checked = true;
    }
    return self;
  };

  /**
   * Creates a dropdown menu &lt;select&gt;&lt;/select&gt; element in the DOM.
   * It also helps to assign select-box methods to <a href="#/p5.Element">p5.Element</a> when selecting existing select box
   * @method createSelect
   * @param {boolean} [multiple] true if dropdown should support multiple selections
   * @return {p5.Element}
   * @example
   * <div><code>
   * var sel;
   *
   * function setup() {
   *   textAlign(CENTER);
   *   background(200);
   *   sel = createSelect();
   *   sel.position(10, 10);
   *   sel.option('pear');
   *   sel.option('kiwi');
   *   sel.option('grape');
   *   sel.changed(mySelectEvent);
   * }
   *
   * function mySelectEvent() {
   *   var item = sel.value();
   *   background(200);
   *   text('It is a ' + item + '!', 50, 50);
   * }
   * </code></div>
   */
  /**
   * @method createSelect
   * @param {Object} existing DOM select element
   * @return {p5.Element}
   */

  p5.prototype.createSelect = function() {
    p5._validateParameters('createSelect', arguments);
    var elt, self;
    var arg = arguments[0];
    if (typeof arg === 'object' && arg.elt.nodeName === 'SELECT') {
      self = arg;
      elt = this.elt = arg.elt;
    } else {
      elt = document.createElement('select');
      if (arg && typeof arg === 'boolean') {
        elt.setAttribute('multiple', 'true');
      }
      self = addElement(elt, this);
    }
    self.option = function(name, value) {
      var index;
      //see if there is already an option with this name
      for (var i = 0; i < this.elt.length; i++) {
        if (this.elt[i].innerHTML === name) {
          index = i;
          break;
        }
      }
      //if there is an option with this name we will modify it
      if (index !== undefined) {
        //if the user passed in false then delete that option
        if (value === false) {
          this.elt.remove(index);
        } else {
          //otherwise if the name and value are the same then change both
          if (this.elt[index].innerHTML === this.elt[index].value) {
            this.elt[index].innerHTML = this.elt[index].value = value;
            //otherwise just change the value
          } else {
            this.elt[index].value = value;
          }
        }
      } else {
        //if it doesn't exist make it
        var opt = document.createElement('option');
        opt.innerHTML = name;
        if (arguments.length > 1) opt.value = value;
        else opt.value = name;
        elt.appendChild(opt);
      }
    };
    self.selected = function(value) {
      var arr = [],
        i;
      if (arguments.length > 0) {
        for (i = 0; i < this.elt.length; i++) {
          if (value.toString() === this.elt[i].value) {
            this.elt.selectedIndex = i;
          }
        }
        return this;
      } else {
        if (this.elt.getAttribute('multiple')) {
          for (i = 0; i < this.elt.selectedOptions.length; i++) {
            arr.push(this.elt.selectedOptions[i].value);
          }
          return arr;
        } else {
          return this.elt.value;
        }
      }
    };
    return self;
  };

  /**
   * Creates a radio button &lt;input&gt;&lt;/input&gt; element in the DOM.
   * The .option() method can be used to set options for the radio after it is
   * created. The .value() method will return the currently selected option.
   *
   * @method createRadio
   * @param  {String} [divId] the id and name of the created div and input field respectively
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div><code>
   * var radio;
   *
   * function setup() {
   *   radio = createRadio();
   *   radio.option('black');
   *   radio.option('white');
   *   radio.option('gray');
   *   radio.style('width', '60px');
   *   textAlign(CENTER);
   *   fill(255, 0, 0);
   * }
   *
   * function draw() {
   *   var val = radio.value();
   *   background(val);
   *   text(val, width / 2, height / 2);
   * }
   * </code></div>
   * <div><code>
   * var radio;
   *
   * function setup() {
   *   radio = createRadio();
   *   radio.option('apple', 1);
   *   radio.option('bread', 2);
   *   radio.option('juice', 3);
   *   radio.style('width', '60px');
   *   textAlign(CENTER);
   * }
   *
   * function draw() {
   *   background(200);
   *   var val = radio.value();
   *   if (val) {
   *     text('item cost is $' + val, width / 2, height / 2);
   *   }
   * }
   * </code></div>
   */
  p5.prototype.createRadio = function(existing_radios) {
    p5._validateParameters('createRadio', arguments);
    // do some prep by counting number of radios on page
    var radios = document.querySelectorAll('input[type=radio]');
    var count = 0;
    if (radios.length > 1) {
      var length = radios.length;
      var prev = radios[0].name;
      var current = radios[1].name;
      count = 1;
      for (var i = 1; i < length; i++) {
        current = radios[i].name;
        if (prev !== current) {
          count++;
        }
        prev = current;
      }
    } else if (radios.length === 1) {
      count = 1;
    }
    // see if we got an existing set of radios from callee
    var elt, self;
    if (typeof existing_radios === 'object') {
      // use existing elements
      self = existing_radios;
      elt = this.elt = existing_radios.elt;
    } else {
      // create a set of radio buttons
      elt = document.createElement('div');
      self = addElement(elt, this);
    }
    // setup member functions
    self._getInputChildrenArray = function() {
      return Array.prototype.slice.call(this.elt.children).filter(function(c) {
        return c.tagName === 'INPUT';
      });
    };

    var times = -1;
    self.option = function(name, value) {
      var opt = document.createElement('input');
      opt.type = 'radio';
      opt.innerHTML = name;
      if (value) opt.value = value;
      else opt.value = name;
      opt.setAttribute('name', 'defaultradio' + count);
      elt.appendChild(opt);
      if (name) {
        times++;
        var label = document.createElement('label');
        opt.setAttribute('id', 'defaultradio' + count + '-' + times);
        label.htmlFor = 'defaultradio' + count + '-' + times;
        label.appendChild(document.createTextNode(name));
        elt.appendChild(label);
      }
      return opt;
    };
    self.selected = function(value) {
      var i;
      var inputChildren = self._getInputChildrenArray();
      if (value) {
        for (i = 0; i < inputChildren.length; i++) {
          if (inputChildren[i].value === value) inputChildren[i].checked = true;
        }
        return this;
      } else {
        for (i = 0; i < inputChildren.length; i++) {
          if (inputChildren[i].checked === true) return inputChildren[i].value;
        }
      }
    };
    self.value = function(value) {
      var i;
      var inputChildren = self._getInputChildrenArray();
      if (value) {
        for (i = 0; i < inputChildren.length; i++) {
          if (inputChildren[i].value === value) inputChildren[i].checked = true;
        }
        return this;
      } else {
        for (i = 0; i < inputChildren.length; i++) {
          if (inputChildren[i].checked === true) return inputChildren[i].value;
        }
        return '';
      }
    };
    return self;
  };

  /**
   * Creates a colorPicker element in the DOM for color input.
   * The .value() method will return a hex string (#rrggbb) of the color.
   * The .color() method will return a p5.Color object with the current chosen color.
   *
   * @method createColorPicker
   * @param {String|p5.Color} [value] default color of element
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div>
   * <code>
   * var inp1, inp2;
   * function setup() {
   *   createCanvas(100, 100);
   *   background('grey');
   *   inp1 = createColorPicker('#ff0000');
   *   inp2 = createColorPicker(color('yellow'));
   *   inp1.input(setShade1);
   *   inp2.input(setShade2);
   *   setMidShade();
   * }
   *
   * function setMidShade() {
   *   // Finding a shade between the two
   *   var commonShade = lerpColor(inp1.color(), inp2.color(), 0.5);
   *   fill(commonShade);
   *   rect(20, 20, 60, 60);
   * }
   *
   * function setShade1() {
   *   setMidShade();
   *   console.log('You are choosing shade 1 to be : ', this.value());
   * }
   * function setShade2() {
   *   setMidShade();
   *   console.log('You are choosing shade 2 to be : ', this.value());
   * }
   * </code>
   * </div>
   */
  p5.prototype.createColorPicker = function(value) {
    p5._validateParameters('createColorPicker', arguments);
    var elt = document.createElement('input');
    var self;
    elt.type = 'color';
    if (value) {
      if (value instanceof p5.Color) {
        elt.value = value.toString('#rrggbb');
      } else {
        p5.prototype._colorMode = 'rgb';
        p5.prototype._colorMaxes = {
          rgb: [255, 255, 255, 255],
          hsb: [360, 100, 100, 1],
          hsl: [360, 100, 100, 1]
        };
        elt.value = p5.prototype.color(value).toString('#rrggbb');
      }
    } else {
      elt.value = '#000000';
    }
    self = addElement(elt, this);
    // Method to return a p5.Color object for the given color.
    self.color = function() {
      if (value.mode) {
        p5.prototype._colorMode = value.mode;
      }
      if (value.maxes) {
        p5.prototype._colorMaxes = value.maxes;
      }
      return p5.prototype.color(this.elt.value);
    };
    return self;
  };

  /**
   * Creates an &lt;input&gt;&lt;/input&gt; element in the DOM for text input.
   * Use .<a href="#/p5.Element/size">size()</a> to set the display length of the box.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createInput
   * @param {String} [value] default value of the input box
   * @param {String} [type] type of text, ie text, password etc. Defaults to text
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div class='norender'><code>
   * function setup() {
   *   var inp = createInput('');
   *   inp.input(myInputEvent);
   * }
   *
   * function myInputEvent() {
   *   console.log('you are typing: ', this.value());
   * }
   * </code></div>
   */
  p5.prototype.createInput = function(value, type) {
    p5._validateParameters('createInput', arguments);
    var elt = document.createElement('input');
    elt.type = type ? type : 'text';
    if (value) elt.value = value;
    return addElement(elt, this);
  };

  /**
   * Creates an &lt;input&gt;&lt;/input&gt; element in the DOM of type 'file'.
   * This allows users to select local files for use in a sketch.
   *
   * @method createFileInput
   * @param  {Function} [callback] callback function for when a file loaded
   * @param  {String} [multiple] optional to allow multiple files selected
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created DOM element
   * @example
   * <div><code>
   * let input;
   * let img;
   *
   * function setup() {
   *   input = createFileInput(handleFile);
   *   input.position(0, 0);
   * }
   *
   * function draw() {
   *   background(255);
   *   if (img) {
   *     image(img, 0, 0, width, height);
   *   }
   * }
   *
   * function handleFile(file) {
   *   print(file);
   *   if (file.type === 'image') {
   *     img = createImg(file.data);
   *     img.hide();
   *   } else {
   *     img = null;
   *   }
   * }
   * </code></div>
   */
  p5.prototype.createFileInput = function(callback, multiple) {
    p5._validateParameters('createFileInput', arguments);
    // Function to handle when a file is selected
    // We're simplifying life and assuming that we always
    // want to load every selected file
    function handleFileSelect(evt) {
      // These are the files
      var files = evt.target.files;
      // Load each one and trigger a callback
      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        p5.File._load(f, callback);
      }
    }
    // Is the file stuff supported?
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Yup, we're ok and make an input file selector
      var elt = document.createElement('input');
      elt.type = 'file';

      // If we get a second argument that evaluates to true
      // then we are looking for multiple files
      if (multiple) {
        // Anything gets the job done
        elt.multiple = 'multiple';
      }

      // Now let's handle when a file was selected
      elt.addEventListener('change', handleFileSelect, false);
      return addElement(elt, this);
    } else {
      console.log(
        'The File APIs are not fully supported in this browser. Cannot create element.'
      );
    }
  };

  /** VIDEO STUFF **/

  function createMedia(pInst, type, src, callback) {
    var elt = document.createElement(type);

    // allow src to be empty
    src = src || '';
    if (typeof src === 'string') {
      src = [src];
    }
    for (var i = 0; i < src.length; i++) {
      var source = document.createElement('source');
      source.src = src[i];
      elt.appendChild(source);
    }
    if (typeof callback !== 'undefined') {
      var callbackHandler = function() {
        callback();
        elt.removeEventListener('canplaythrough', callbackHandler);
      };
      elt.addEventListener('canplaythrough', callbackHandler);
    }

    var c = addElement(elt, pInst, true);
    c.loadedmetadata = false;
    // set width and height onload metadata
    elt.addEventListener('loadedmetadata', function() {
      c.width = elt.videoWidth;
      c.height = elt.videoHeight;
      //c.elt.playbackRate = s;
      // set elt width and height if not set
      if (c.elt.width === 0) c.elt.width = elt.videoWidth;
      if (c.elt.height === 0) c.elt.height = elt.videoHeight;
      if (c.presetPlaybackRate) {
        c.elt.playbackRate = c.presetPlaybackRate;
        delete c.presetPlaybackRate;
      }
      c.loadedmetadata = true;
    });

    return c;
  }
  /**
   * Creates an HTML5 &lt;video&gt; element in the DOM for simple playback
   * of audio/video. Shown by default, can be hidden with .<a href="#/p5.Element/hide">hide()</a>
   * and drawn into canvas using video(). Appends to the container
   * node if one is specified, otherwise appends to body. The first parameter
   * can be either a single string path to a video file, or an array of string
   * paths to different formats of the same video. This is useful for ensuring
   * that your video can play across different browsers, as each supports
   * different formats. See <a href='https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats'>this
   * page</a> for further information about supported formats.
   *
   * @method createVideo
   * @param  {String|String[]} src path to a video file, or array of paths for
   *                             supporting different browsers
   * @param  {Function} [callback] callback function to be called upon
   *                             'canplaythrough' event fire, that is, when the
   *                             browser can play the media, and estimates that
   *                             enough data has been loaded to play the media
   *                             up to its end without having to stop for
   *                             further buffering of content
   * @return {p5.MediaElement}   pointer to video <a href="#/p5.Element">p5.Element</a>
   * @example
   * <div><code>
   * var vid;
   * function setup() {
   *   noCanvas();
   *
   *   vid = createVideo(
   *     ['assets/small.mp4', 'assets/small.ogv', 'assets/small.webm'],
   *     vidLoad
   *   );
   *
   *   vid.size(100, 100);
   * }
   *
   * // This function is called when the video loads
   * function vidLoad() {
   *   vid.loop();
   *   vid.volume(0);
   * }
   * </code></div>
   */
  p5.prototype.createVideo = function(src, callback) {
    p5._validateParameters('createVideo', arguments);
    return createMedia(this, 'video', src, callback);
  };

  /** AUDIO STUFF **/

  /**
   * Creates a hidden HTML5 &lt;audio&gt; element in the DOM for simple audio
   * playback. Appends to the container node if one is specified,
   * otherwise appends to body. The first parameter
   * can be either a single string path to a audio file, or an array of string
   * paths to different formats of the same audio. This is useful for ensuring
   * that your audio can play across different browsers, as each supports
   * different formats. See <a href='https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats'>this
   * page for further information about supported formats</a>.
   *
   * @method createAudio
   * @param  {String|String[]} [src] path to an audio file, or array of paths
   *                             for supporting different browsers
   * @param  {Function} [callback] callback function to be called upon
   *                             'canplaythrough' event fire, that is, when the
   *                             browser can play the media, and estimates that
   *                             enough data has been loaded to play the media
   *                             up to its end without having to stop for
   *                             further buffering of content
   * @return {p5.MediaElement}   pointer to audio <a href="#/p5.Element">p5.Element</a>
   * @example
   * <div><code>
   * var ele;
   * function setup() {
   *   ele = createAudio('assets/beat.mp3');
   *
   *   // here we set the element to autoplay
   *   // The element will play as soon
   *   // as it is able to do so.
   *   ele.autoplay(true);
   * }
   * </code></div>
   */
  p5.prototype.createAudio = function(src, callback) {
    p5._validateParameters('createAudio', arguments);
    return createMedia(this, 'audio', src, callback);
  };

  /** CAMERA STUFF **/

  /**
   * @property {String} VIDEO
   * @final
   * @category Constants
   */
  p5.prototype.VIDEO = 'video';
  /**
   * @property {String} AUDIO
   * @final
   * @category Constants
   */
  p5.prototype.AUDIO = 'audio';

  // from: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        );
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  /**
   * <p>Creates a new HTML5 &lt;video&gt; element that contains the audio/video
   * feed from a webcam. The element is separate from the canvas and is
   * displayed by default. The element can be hidden using .<a href="#/p5.Element/hide">hide()</a>. The feed
   * can be drawn onto the canvas using <a href="#/p5/image">image()</a>. The loadedmetadata property can
   * be used to detect when the element has fully loaded (see second example).</p>
   * <p>More specific properties of the feed can be passing in a Constraints object.
   * See the
   * <a href='http://w3c.github.io/mediacapture-main/getusermedia.html#media-track-constraints'> W3C
   * spec</a> for possible properties. Note that not all of these are supported
   * by all browsers.</p>
   * <p>Security note: A new browser security specification requires that getUserMedia,
   * which is behind <a href="#/p5/createCapture">createCapture()</a>, only works when you're running the code locally,
   * or on HTTPS. Learn more <a href='http://stackoverflow.com/questions/34197653/getusermedia-in-chrome-47-without-using-https'>here</a>
   * and <a href='https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia'>here</a>.</p>
   *
   * @method createCapture
   * @param  {String|Constant|Object}   type type of capture, either VIDEO or
   *                                   AUDIO if none specified, default both,
   *                                   or a Constraints object
   * @param  {Function}                 [callback] function to be called once
   *                                   stream has loaded
   * @return {p5.Element} capture video <a href="#/p5.Element">p5.Element</a>
   * @example
   * <div class='norender notest'><code>
   * var capture;
   *
   * function setup() {
   *   createCanvas(480, 480);
   *   capture = createCapture(VIDEO);
   *   capture.hide();
   * }
   *
   * function draw() {
   *   image(capture, 0, 0, width, width * capture.height / capture.width);
   *   filter(INVERT);
   * }
   * </code></div>
   * <div class='norender notest'><code>
   * function setup() {
   *   createCanvas(480, 120);
   *   var constraints = {
   *     video: {
   *       mandatory: {
   *         minWidth: 1280,
   *         minHeight: 720
   *       },
   *       optional: [{ maxFrameRate: 10 }]
   *     },
   *     audio: true
   *   };
   *   createCapture(constraints, function(stream) {
   *     console.log(stream);
   *   });
   * }
   * </code></div>
   * <code><div class='norender notest'>
   * var capture;
   *
   * function setup() {
   *   createCanvas(640, 480);
   *   capture = createCapture(VIDEO);
   * }
   * function draw() {
   *   background(0);
   *   if (capture.loadedmetadata) {
   *     var c = capture.get(0, 0, 100, 100);
   *     image(c, 0, 0);
   *   }
   * }
   * </code></div>
   */
  p5.prototype.createCapture = function() {
    p5._validateParameters('createCapture', arguments);
    var useVideo = true;
    var useAudio = true;
    var constraints;
    var cb;
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] === p5.prototype.VIDEO) {
        useAudio = false;
      } else if (arguments[i] === p5.prototype.AUDIO) {
        useVideo = false;
      } else if (typeof arguments[i] === 'object') {
        constraints = arguments[i];
      } else if (typeof arguments[i] === 'function') {
        cb = arguments[i];
      }
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      var elt = document.createElement('video');
      // required to work in iOS 11 & up:
      elt.setAttribute('playsinline', '');

      if (!constraints) {
        constraints = { video: useVideo, audio: useAudio };
      }

      navigator.mediaDevices.getUserMedia(constraints).then(
        function(stream) {
          try {
            if ('srcObject' in elt) {
              elt.srcObject = stream;
            } else {
              elt.src = window.URL.createObjectURL(stream);
            }
          } catch (err) {
            elt.src = stream;
          }
        },
        function(e) {
          console.log(e);
        }
      );
    } else {
      throw 'getUserMedia not supported in this browser';
    }
    var c = addElement(elt, this, true);
    c.loadedmetadata = false;
    // set width and height onload metadata
    elt.addEventListener('loadedmetadata', function() {
      elt.play();
      if (elt.width) {
        c.width = elt.videoWidth = elt.width;
        c.height = elt.videoHeight = elt.height;
      } else {
        c.width = c.elt.width = elt.videoWidth;
        c.height = c.elt.height = elt.videoHeight;
      }
      c.loadedmetadata = true;
      if (cb) {
        cb(elt.srcObject);
      }
    });
    return c;
  };

  /**
   * Creates element with given tag in the DOM with given content.
   * Appends to the container node if one is specified, otherwise
   * appends to body.
   *
   * @method createElement
   * @param  {String} tag tag for the new element
   * @param  {String} [content] html content to be inserted into the element
   * @return {p5.Element} pointer to <a href="#/p5.Element">p5.Element</a> holding created node
   * @example
   * <div class='norender'><code>
   * createElement('h2', 'im an h2 p5.element!');
   * </code></div>
   */
  p5.prototype.createElement = function(tag, content) {
    p5._validateParameters('createElement', arguments);
    var elt = document.createElement(tag);
    if (typeof content !== 'undefined') {
      elt.innerHTML = content;
    }
    return addElement(elt, this);
  };

  // =============================================================================
  //                         p5.Element additions
  // =============================================================================
  /**
   *
   * Adds specified class to the element.
   *
   * @for p5.Element
   * @method addClass
   * @param  {String} class name of class to add
   * @chainable
   * @example
   * <div class='norender'><code>
   * var div = createDiv('div');
   * div.addClass('myClass');
   * </code></div>
   */
  p5.Element.prototype.addClass = function(c) {
    if (this.elt.className) {
      if (!this.hasClass(c)) {
        this.elt.className = this.elt.className + ' ' + c;
      }
    } else {
      this.elt.className = c;
    }
    return this;
  };

  /**
   *
   * Removes specified class from the element.
   *
   * @method removeClass
   * @param  {String} class name of class to remove
   * @chainable
   * @example
   * <div class='norender'><code>
   * // In this example, a class is set when the div is created
   * // and removed when mouse is pressed. This could link up
   * // with a CSS style rule to toggle style properties.
   *
   * var div;
   *
   * function setup() {
   *   div = createDiv('div');
   *   div.addClass('myClass');
   * }
   *
   * function mousePressed() {
   *   div.removeClass('myClass');
   * }
   * </code></div>
   */
  p5.Element.prototype.removeClass = function(c) {
    // Note: Removing a class that does not exist does NOT throw an error in classList.remove method
    this.elt.classList.remove(c);
    return this;
  };

  /**
   *
   * Checks if specified class already set to element
   *
   * @method hasClass
   * @returns {boolean} a boolean value if element has specified class
   * @param c {String} class name of class to check
   * @example
   * <div class='norender'><code>
   * var div;
   *
   * function setup() {
   *   div = createDiv('div');
   *   div.addClass('show');
   * }
   *
   * function mousePressed() {
   *   if (div.hasClass('show')) {
   *     div.addClass('show');
   *   } else {
   *     div.removeClass('show');
   *   }
   * }
   * </code></div>
   */
  p5.Element.prototype.hasClass = function(c) {
    return this.elt.classList.contains(c);
  };

  /**
   *
   * Toggles element class
   *
   * @method toggleClass
   * @param c {String} class name to toggle
   * @chainable
   * @example
   * <div class='norender'><code>
   * var div;
   *
   * function setup() {
   *   div = createDiv('div');
   *   div.addClass('show');
   * }
   *
   * function mousePressed() {
   *   div.toggleClass('show');
   * }
   * </code></div>
   */
  p5.Element.prototype.toggleClass = function(c) {
    // classList also has a toggle() method, but we cannot use that yet as support is unclear.
    // See https://github.com/processing/p5.js/issues/3631
    // this.elt.classList.toggle(c);
    if (this.elt.classList.contains(c)) {
      this.elt.classList.remove(c);
    } else {
      this.elt.classList.add(c);
    }
    return this;
  };

  /**
   *
   * Attaches the element  as a child to the parent specified.
   * Accepts either a string ID, DOM node, or <a href="#/p5.Element">p5.Element</a>.
   * If no argument is specified, an array of children DOM nodes is returned.
   *
   * @method child
   * @returns {Node[]} an array of child nodes
   * @example
   * <div class='norender'><code>
   * var div0 = createDiv('this is the parent');
   * var div1 = createDiv('this is the child');
   * div0.child(div1); // use p5.Element
   * </code></div>
   * <div class='norender'><code>
   * var div0 = createDiv('this is the parent');
   * var div1 = createDiv('this is the child');
   * div1.id('apples');
   * div0.child('apples'); // use id
   * </code></div>
   * <div class='norender notest'><code>
   * // this example assumes there is a div already on the page
   * // with id "myChildDiv"
   * var div0 = createDiv('this is the parent');
   * var elt = document.getElementById('myChildDiv');
   * div0.child(elt); // use element from page
   * </code></div>
   */
  /**
   * @method child
   * @param  {String|p5.Element} [child] the ID, DOM node, or <a href="#/p5.Element">p5.Element</a>
   *                         to add to the current element
   * @chainable
   */
  p5.Element.prototype.child = function(c) {
    if (typeof c === 'undefined') {
      return this.elt.childNodes;
    }
    if (typeof c === 'string') {
      if (c[0] === '#') {
        c = c.substring(1);
      }
      c = document.getElementById(c);
    } else if (c instanceof p5.Element) {
      c = c.elt;
    }
    this.elt.appendChild(c);
    return this;
  };

  /**
   * Centers a p5 Element either vertically, horizontally,
   * or both, relative to its parent or according to
   * the body if the Element has no parent. If no argument is passed
   * the Element is aligned both vertically and horizontally.
   *
   * @method center
   * @param  {String} [align]       passing 'vertical', 'horizontal' aligns element accordingly
   * @chainable
   *
   * @example
   * <div><code>
   * function setup() {
   *   var div = createDiv('').size(10, 10);
   *   div.style('background-color', 'orange');
   *   div.center();
   * }
   * </code></div>
   */
  p5.Element.prototype.center = function(align) {
    var style = this.elt.style.display;
    var hidden = this.elt.style.display === 'none';
    var parentHidden = this.parent().style.display === 'none';
    var pos = { x: this.elt.offsetLeft, y: this.elt.offsetTop };

    if (hidden) this.show();

    this.elt.style.display = 'block';
    this.position(0, 0);

    if (parentHidden) this.parent().style.display = 'block';

    var wOffset = Math.abs(this.parent().offsetWidth - this.elt.offsetWidth);
    var hOffset = Math.abs(this.parent().offsetHeight - this.elt.offsetHeight);
    var y = pos.y;
    var x = pos.x;

    if (align === 'both' || align === undefined) {
      this.position(wOffset / 2, hOffset / 2);
    } else if (align === 'horizontal') {
      this.position(wOffset / 2, y);
    } else if (align === 'vertical') {
      this.position(x, hOffset / 2);
    }

    this.style('display', style);

    if (hidden) this.hide();

    if (parentHidden) this.parent().style.display = 'none';

    return this;
  };

  /**
   *
   * If an argument is given, sets the inner HTML of the element,
   * replacing any existing html. If true is included as a second
   * argument, html is appended instead of replacing existing html.
   * If no arguments are given, returns
   * the inner HTML of the element.
   *
   * @for p5.Element
   * @method html
   * @returns {String} the inner HTML of the element
   * @example
   * <div class='norender'><code>
   * var div = createDiv('').size(100, 100);
   * div.html('hi');
   * </code></div>
   * <div class='norender'><code>
   * var div = createDiv('Hello ').size(100, 100);
   * div.html('World', true);
   * </code></div>
   */
  /**
   * @method html
   * @param  {String} [html] the HTML to be placed inside the element
   * @param  {boolean} [append] whether to append HTML to existing
   * @chainable
   */
  p5.Element.prototype.html = function() {
    if (arguments.length === 0) {
      return this.elt.innerHTML;
    } else if (arguments[1]) {
      this.elt.innerHTML += arguments[0];
      return this;
    } else {
      this.elt.innerHTML = arguments[0];
      return this;
    }
  };

  /**
   *
   * Sets the position of the element relative to (0, 0) of the
   * window. Essentially, sets position:absolute and left and top
   * properties of style. If no arguments given returns the x and y position
   * of the element in an object.
   *
   * @method position
   * @returns {Object} the x and y position of the element in an object
   * @example
   * <div><code class='norender'>
   * function setup() {
   *   var cnv = createCanvas(100, 100);
   *   // positions canvas 50px to the right and 100px
   *   // below upper left corner of the window
   *   cnv.position(50, 100);
   * }
   * </code></div>
   */
  /**
   * @method position
   * @param  {Number} [x] x-position relative to upper left of window
   * @param  {Number} [y] y-position relative to upper left of window
   * @chainable
   */
  p5.Element.prototype.position = function() {
    if (arguments.length === 0) {
      return { x: this.elt.offsetLeft, y: this.elt.offsetTop };
    } else {
      this.elt.style.position = 'absolute';
      this.elt.style.left = arguments[0] + 'px';
      this.elt.style.top = arguments[1] + 'px';
      this.x = arguments[0];
      this.y = arguments[1];
      return this;
    }
  };

  /* Helper method called by p5.Element.style() */
  p5.Element.prototype._translate = function() {
    this.elt.style.position = 'absolute';
    // save out initial non-translate transform styling
    var transform = '';
    if (this.elt.style.transform) {
      transform = this.elt.style.transform.replace(/translate3d\(.*\)/g, '');
      transform = transform.replace(/translate[X-Z]?\(.*\)/g, '');
    }
    if (arguments.length === 2) {
      this.elt.style.transform =
        'translate(' + arguments[0] + 'px, ' + arguments[1] + 'px)';
    } else if (arguments.length > 2) {
      this.elt.style.transform =
        'translate3d(' +
        arguments[0] +
        'px,' +
        arguments[1] +
        'px,' +
        arguments[2] +
        'px)';
      if (arguments.length === 3) {
        this.elt.parentElement.style.perspective = '1000px';
      } else {
        this.elt.parentElement.style.perspective = arguments[3] + 'px';
      }
    }
    // add any extra transform styling back on end
    this.elt.style.transform += transform;
    return this;
  };

  /* Helper method called by p5.Element.style() */
  p5.Element.prototype._rotate = function() {
    // save out initial non-rotate transform styling
    var transform = '';
    if (this.elt.style.transform) {
      transform = this.elt.style.transform.replace(/rotate3d\(.*\)/g, '');
      transform = transform.replace(/rotate[X-Z]?\(.*\)/g, '');
    }

    if (arguments.length === 1) {
      this.elt.style.transform = 'rotate(' + arguments[0] + 'deg)';
    } else if (arguments.length === 2) {
      this.elt.style.transform =
        'rotate(' + arguments[0] + 'deg, ' + arguments[1] + 'deg)';
    } else if (arguments.length === 3) {
      this.elt.style.transform = 'rotateX(' + arguments[0] + 'deg)';
      this.elt.style.transform += 'rotateY(' + arguments[1] + 'deg)';
      this.elt.style.transform += 'rotateZ(' + arguments[2] + 'deg)';
    }
    // add remaining transform back on
    this.elt.style.transform += transform;
    return this;
  };

  /**
   * Sets the given style (css) property (1st arg) of the element with the
   * given value (2nd arg). If a single argument is given, .style()
   * returns the value of the given property; however, if the single argument
   * is given in css syntax ('text-align:center'), .style() sets the css
   * appropriately.
   *
   * @method style
   * @param  {String} property   property to be set
   * @returns {String} value of property
   * @example
   * <div><code class='norender'>
   * var myDiv = createDiv('I like pandas.');
   * myDiv.style('font-size', '18px');
   * myDiv.style('color', '#ff0000');
   * </code></div>
   * <div><code class='norender'>
   * var col = color(25, 23, 200, 50);
   * var button = createButton('button');
   * button.style('background-color', col);
   * button.position(10, 10);
   * </code></div>
   * <div><code class='norender'>
   * var myDiv;
   * function setup() {
   *   background(200);
   *   myDiv = createDiv('I like gray.');
   *   myDiv.position(20, 20);
   * }
   *
   * function draw() {
   *   myDiv.style('font-size', mouseX + 'px');
   * }
   * </code></div>
   */
  /**
   * @method style
   * @param  {String} property
   * @param  {String|Number|p5.Color} value     value to assign to property
   * @return {String} current value of property, if no value is given as second argument
   * @chainable
   */
  p5.Element.prototype.style = function(prop, val) {
    var self = this;

    if (val instanceof p5.Color) {
      val =
        'rgba(' +
        val.levels[0] +
        ',' +
        val.levels[1] +
        ',' +
        val.levels[2] +
        ',' +
        val.levels[3] / 255 +
        ')';
    }

    if (typeof val === 'undefined') {
      // input provided as single line string
      if (prop.indexOf(':') === -1) {
        var styles = window.getComputedStyle(self.elt);
        var style = styles.getPropertyValue(prop);
        return style;
      } else {
        var attrs = prop.split(';');
        for (var i = 0; i < attrs.length; i++) {
          var parts = attrs[i].split(':');
          if (parts[0] && parts[1]) {
            this.elt.style[parts[0].trim()] = parts[1].trim();
          }
        }
      }
    } else {
      // input provided as key,val pair
      this.elt.style[prop] = val;
      if (
        prop === 'width' ||
        prop === 'height' ||
        prop === 'left' ||
        prop === 'top'
      ) {
        var numVal = val.replace(/\D+/g, '');
        this[prop] = parseInt(numVal, 10);
      }
    }
    return this;
  };

  /**
   *
   * Adds a new attribute or changes the value of an existing attribute
   * on the specified element. If no value is specified, returns the
   * value of the given attribute, or null if attribute is not set.
   *
   * @method attribute
   * @return {String} value of attribute
   *
   * @example
   * <div class='norender'><code>
   * var myDiv = createDiv('I like pandas.');
   * myDiv.attribute('align', 'center');
   * </code></div>
   */
  /**
   * @method attribute
   * @param  {String} attr       attribute to set
   * @param  {String} value      value to assign to attribute
   * @chainable
   */
  p5.Element.prototype.attribute = function(attr, value) {
    //handling for checkboxes and radios to ensure options get
    //attributes not divs
    if (
      this.elt.firstChild != null &&
      (this.elt.firstChild.type === 'checkbox' ||
        this.elt.firstChild.type === 'radio')
    ) {
      if (typeof value === 'undefined') {
        return this.elt.firstChild.getAttribute(attr);
      } else {
        for (var i = 0; i < this.elt.childNodes.length; i++) {
          this.elt.childNodes[i].setAttribute(attr, value);
        }
      }
    } else if (typeof value === 'undefined') {
      return this.elt.getAttribute(attr);
    } else {
      this.elt.setAttribute(attr, value);
      return this;
    }
  };

  /**
   *
   * Removes an attribute on the specified element.
   *
   * @method removeAttribute
   * @param  {String} attr       attribute to remove
   * @chainable
   *
   * @example
   * <div><code>
   * var button;
   * var checkbox;
   *
   * function setup() {
   *   checkbox = createCheckbox('enable', true);
   *   checkbox.changed(enableButton);
   *   button = createButton('button');
   *   button.position(10, 10);
   * }
   *
   * function enableButton() {
   *   if (this.checked()) {
   *     // Re-enable the button
   *     button.removeAttribute('disabled');
   *   } else {
   *     // Disable the button
   *     button.attribute('disabled', '');
   *   }
   * }
   * </code></div>
   */
  p5.Element.prototype.removeAttribute = function(attr) {
    if (
      this.elt.firstChild != null &&
      (this.elt.firstChild.type === 'checkbox' ||
        this.elt.firstChild.type === 'radio')
    ) {
      for (var i = 0; i < this.elt.childNodes.length; i++) {
        this.elt.childNodes[i].removeAttribute(attr);
      }
    }
    this.elt.removeAttribute(attr);
    return this;
  };

  /**
   * Either returns the value of the element if no arguments
   * given, or sets the value of the element.
   *
   * @method value
   * @return {String|Number} value of the element
   * @example
   * <div class='norender'><code>
   * // gets the value
   * var inp;
   * function setup() {
   *   inp = createInput('');
   * }
   *
   * function mousePressed() {
   *   print(inp.value());
   * }
   * </code></div>
   * <div class='norender'><code>
   * // sets the value
   * var inp;
   * function setup() {
   *   inp = createInput('myValue');
   * }
   *
   * function mousePressed() {
   *   inp.value('myValue');
   * }
   * </code></div>
   */
  /**
   * @method value
   * @param  {String|Number}     value
   * @chainable
   */
  p5.Element.prototype.value = function() {
    if (arguments.length > 0) {
      this.elt.value = arguments[0];
      return this;
    } else {
      if (this.elt.type === 'range') {
        return parseFloat(this.elt.value);
      } else return this.elt.value;
    }
  };

  /**
   *
   * Shows the current element. Essentially, setting display:block for the style.
   *
   * @method show
   * @chainable
   * @example
   * <div class='norender'><code>
   * var div = createDiv('div');
   * div.style('display', 'none');
   * div.show(); // turns display to block
   * </code></div>
   */
  p5.Element.prototype.show = function() {
    this.elt.style.display = 'block';
    return this;
  };

  /**
   * Hides the current element. Essentially, setting display:none for the style.
   *
   * @method hide
   * @chainable
   * @example
   * <div class='norender'><code>
   * var div = createDiv('this is a div');
   * div.hide();
   * </code></div>
   */
  p5.Element.prototype.hide = function() {
    this.elt.style.display = 'none';
    return this;
  };

  /**
   *
   * Sets the width and height of the element. AUTO can be used to
   * only adjust one dimension at a time. If no arguments are given, it
   * returns the width and height of the element in an object. In case of
   * elements which need to be loaded, such as images, it is recommended
   * to call the function after the element has finished loading.
   *
   * @method size
   * @return {Object} the width and height of the element in an object
   * @example
   * <div class='norender'><code>
   * let div = createDiv('this is a div');
   * div.size(100, 100);
   * let img = createImg('assets/laDefense.jpg', () => {
   *   img.size(10, AUTO);
   * });
   * </code></div>
   */
  /**
   * @method size
   * @param  {Number|Constant} w    width of the element, either AUTO, or a number
   * @param  {Number|Constant} [h] height of the element, either AUTO, or a number
   * @chainable
   */
  p5.Element.prototype.size = function(w, h) {
    if (arguments.length === 0) {
      return { width: this.elt.offsetWidth, height: this.elt.offsetHeight };
    } else {
      var aW = w;
      var aH = h;
      var AUTO = p5.prototype.AUTO;
      if (aW !== AUTO || aH !== AUTO) {
        if (aW === AUTO) {
          aW = h * this.width / this.height;
        } else if (aH === AUTO) {
          aH = w * this.height / this.width;
        }
        // set diff for cnv vs normal div
        if (this.elt instanceof HTMLCanvasElement) {
          var j = {};
          var k = this.elt.getContext('2d');
          var prop;
          for (prop in k) {
            j[prop] = k[prop];
          }
          this.elt.setAttribute('width', aW * this._pInst._pixelDensity);
          this.elt.setAttribute('height', aH * this._pInst._pixelDensity);
          this.elt.style.width = aW + 'px';
          this.elt.style.height = aH + 'px';
          this._pInst.scale(
            this._pInst._pixelDensity,
            this._pInst._pixelDensity
          );
          for (prop in j) {
            this.elt.getContext('2d')[prop] = j[prop];
          }
        } else {
          this.elt.style.width = aW + 'px';
          this.elt.style.height = aH + 'px';
          this.elt.width = aW;
          this.elt.height = aH;
        }

        this.width = this.elt.offsetWidth;
        this.height = this.elt.offsetHeight;

        if (this._pInst && this._pInst._curElement) {
          // main canvas associated with p5 instance
          if (this._pInst._curElement.elt === this.elt) {
            this._pInst._setProperty('width', this.elt.offsetWidth);
            this._pInst._setProperty('height', this.elt.offsetHeight);
          }
        }
      }
      return this;
    }
  };

  /**
   * Removes the element and deregisters all listeners.
   * @method remove
   * @example
   * <div class='norender'><code>
   * var myDiv = createDiv('this is some text');
   * myDiv.remove();
   * </code></div>
   */
  p5.Element.prototype.remove = function() {
    // deregister events
    for (var ev in this._events) {
      this.elt.removeEventListener(ev, this._events[ev]);
    }
    if (this.elt.parentNode) {
      this.elt.parentNode.removeChild(this.elt);
    }
    delete this;
  };

  /**
   * Registers a callback that gets called every time a file that is
   * dropped on the element has been loaded.
   * p5 will load every dropped file into memory and pass it as a p5.File object to the callback.
   * Multiple files dropped at the same time will result in multiple calls to the callback.
   *
   * You can optionally pass a second callback which will be registered to the raw
   * <a href="https://developer.mozilla.org/en-US/docs/Web/Events/drop">drop</a> event.
   * The callback will thus be provided the original
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DragEvent">DragEvent</a>.
   * Dropping multiple files at the same time will trigger the second callback once per drop,
   * whereas the first callback will trigger for each loaded file.
   *
   * @method drop
   * @param  {Function} callback  callback to receive loaded file, called for each file dropped.
   * @param  {Function} [fxn]     callback triggered once when files are dropped with the drop event.
   * @chainable
   * @example
   * <div><code>
   * function setup() {
   *   var c = createCanvas(100, 100);
   *   background(200);
   *   textAlign(CENTER);
   *   text('drop file', width / 2, height / 2);
   *   c.drop(gotFile);
   * }
   *
   * function gotFile(file) {
   *   background(200);
   *   text('received file:', width / 2, height / 2);
   *   text(file.name, width / 2, height / 2 + 50);
   * }
   * </code></div>
   *
   * <div><code>
   * var img;
   *
   * function setup() {
   *   var c = createCanvas(100, 100);
   *   background(200);
   *   textAlign(CENTER);
   *   text('drop image', width / 2, height / 2);
   *   c.drop(gotFile);
   * }
   *
   * function draw() {
   *   if (img) {
   *     image(img, 0, 0, width, height);
   *   }
   * }
   *
   * function gotFile(file) {
   *   img = createImg(file.data).hide();
   * }
   * </code></div>
   *
   * @alt
   * Canvas turns into whatever image is dragged/dropped onto it.
   */
  p5.Element.prototype.drop = function(callback, fxn) {
    // Is the file stuff supported?
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      if (!this._dragDisabled) {
        this._dragDisabled = true;

        var preventDefault = function(evt) {
          evt.preventDefault();
        };

        // If you want to be able to drop you've got to turn off
        // a lot of default behavior.
        // avoid `attachListener` here, since it overrides other handlers.
        this.elt.addEventListener('dragover', preventDefault);

        // If this is a drag area we need to turn off the default behavior
        this.elt.addEventListener('dragleave', preventDefault);
      }

      // Deal with the files
      p5.Element._attachListener(
        'drop',
        function(evt) {
          evt.preventDefault();
          // Call the second argument as a callback that receives the raw drop event
          if (typeof fxn === 'function') {
            fxn.call(this, evt);
          }
          // A FileList
          var files = evt.dataTransfer.files;

          // Load each one and trigger the callback
          for (var i = 0; i < files.length; i++) {
            var f = files[i];
            p5.File._load(f, callback);
          }
        },
        this
      );
    } else {
      console.log('The File APIs are not fully supported in this browser.');
    }

    return this;
  };

  // =============================================================================
  //                         p5.MediaElement additions
  // =============================================================================

  /**
   * Extends <a href="#/p5.Element">p5.Element</a> to handle audio and video. In addition to the methods
   * of <a href="#/p5.Element">p5.Element</a>, it also contains methods for controlling media. It is not
   * called directly, but <a href="#/p5.MediaElement">p5.MediaElement</a>s are created by calling <a href="#/p5/createVideo">createVideo</a>,
   * <a href="#/p5/createAudio">createAudio</a>, and <a href="#/p5/createCapture">createCapture</a>.
   *
   * @class p5.MediaElement
   * @constructor
   * @param {String} elt DOM node that is wrapped
   */
  p5.MediaElement = function(elt, pInst) {
    p5.Element.call(this, elt, pInst);

    var self = this;
    this.elt.crossOrigin = 'anonymous';

    this._prevTime = 0;
    this._cueIDCounter = 0;
    this._cues = [];
    this._pixelsState = this;
    this._pixelDensity = 1;
    this._modified = false;
    this._pixelsDirty = true;
    this._pixelsTime = -1; // the time at which we last updated 'pixels'

    /**
     * Path to the media element source.
     *
     * @property src
     * @return {String} src
     * @example
     * <div><code>
     * var ele;
     *
     * function setup() {
     *   background(250);
     *
     *   //p5.MediaElement objects are usually created
     *   //by calling the createAudio(), createVideo(),
     *   //and createCapture() functions.
     *
     *   //In this example we create
     *   //a new p5.MediaElement via createAudio().
     *   ele = createAudio('assets/beat.mp3');
     *
     *   //We'll set up our example so that
     *   //when you click on the text,
     *   //an alert box displays the MediaElement's
     *   //src field.
     *   textAlign(CENTER);
     *   text('Click Me!', width / 2, height / 2);
     * }
     *
     * function mouseClicked() {
     *   //here we test if the mouse is over the
     *   //canvas element when it's clicked
     *   if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
     *     //Show our p5.MediaElement's src field
     *     alert(ele.src);
     *   }
     * }
     * </code></div>
     */
    Object.defineProperty(self, 'src', {
      get: function() {
        var firstChildSrc = self.elt.children[0].src;
        var srcVal = self.elt.src === window.location.href ? '' : self.elt.src;
        var ret =
          firstChildSrc === window.location.href ? srcVal : firstChildSrc;
        return ret;
      },
      set: function(newValue) {
        for (var i = 0; i < self.elt.children.length; i++) {
          self.elt.removeChild(self.elt.children[i]);
        }
        var source = document.createElement('source');
        source.src = newValue;
        elt.appendChild(source);
        self.elt.src = newValue;
        self.modified = true;
      }
    });

    // private _onended callback, set by the method: onended(callback)
    self._onended = function() {};
    self.elt.onended = function() {
      self._onended(self);
    };
  };
  p5.MediaElement.prototype = Object.create(p5.Element.prototype);

  /**
   * Play an HTML5 media element.
   *
   * @method play
   * @chainable
   * @example
   * <div><code>
   * var ele;
   *
   * function setup() {
   *   //p5.MediaElement objects are usually created
   *   //by calling the createAudio(), createVideo(),
   *   //and createCapture() functions.
   *
   *   //In this example we create
   *   //a new p5.MediaElement via createAudio().
   *   ele = createAudio('assets/beat.mp3');
   *
   *   background(250);
   *   textAlign(CENTER);
   *   text('Click to Play!', width / 2, height / 2);
   * }
   *
   * function mouseClicked() {
   *   //here we test if the mouse is over the
   *   //canvas element when it's clicked
   *   if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
   *     //Here we call the play() function on
   *     //the p5.MediaElement we created above.
   *     //This will start the audio sample.
   *     ele.play();
   *
   *     background(200);
   *     text('You clicked Play!', width / 2, height / 2);
   *   }
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.play = function() {
    if (this.elt.currentTime === this.elt.duration) {
      this.elt.currentTime = 0;
    }
    var promise;
    if (this.elt.readyState > 1) {
      promise = this.elt.play();
    } else {
      // in Chrome, playback cannot resume after being stopped and must reload
      this.elt.load();
      promise = this.elt.play();
    }
    if (promise && promise.catch) {
      promise.catch(function(e) {
        console.log(
          'WARN: Element play method raised an error asynchronously',
          e
        );
      });
    }
    return this;
  };

  /**
   * Stops an HTML5 media element (sets current time to zero).
   *
   * @method stop
   * @chainable
   * @example
   * <div><code>
   * //This example both starts
   * //and stops a sound sample
   * //when the user clicks the canvas
   *
   * //We will store the p5.MediaElement
   * //object in here
   * var ele;
   *
   * //while our audio is playing,
   * //this will be set to true
   * var sampleIsPlaying = false;
   *
   * function setup() {
   *   //Here we create a p5.MediaElement object
   *   //using the createAudio() function.
   *   ele = createAudio('assets/beat.mp3');
   *   background(200);
   *   textAlign(CENTER);
   *   text('Click to play!', width / 2, height / 2);
   * }
   *
   * function mouseClicked() {
   *   //here we test if the mouse is over the
   *   //canvas element when it's clicked
   *   if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
   *     background(200);
   *
   *     if (sampleIsPlaying) {
   *       //if the sample is currently playing
   *       //calling the stop() function on
   *       //our p5.MediaElement will stop
   *       //it and reset its current
   *       //time to 0 (i.e. it will start
   *       //at the beginning the next time
   *       //you play it)
   *       ele.stop();
   *
   *       sampleIsPlaying = false;
   *       text('Click to play!', width / 2, height / 2);
   *     } else {
   *       //loop our sound element until we
   *       //call ele.stop() on it.
   *       ele.loop();
   *
   *       sampleIsPlaying = true;
   *       text('Click to stop!', width / 2, height / 2);
   *     }
   *   }
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.stop = function() {
    this.elt.pause();
    this.elt.currentTime = 0;
    return this;
  };

  /**
   * Pauses an HTML5 media element.
   *
   * @method pause
   * @chainable
   * @example
   * <div><code>
   * //This example both starts
   * //and pauses a sound sample
   * //when the user clicks the canvas
   *
   * //We will store the p5.MediaElement
   * //object in here
   * var ele;
   *
   * //while our audio is playing,
   * //this will be set to true
   * var sampleIsPlaying = false;
   *
   * function setup() {
   *   //Here we create a p5.MediaElement object
   *   //using the createAudio() function.
   *   ele = createAudio('assets/lucky_dragons.mp3');
   *   background(200);
   *   textAlign(CENTER);
   *   text('Click to play!', width / 2, height / 2);
   * }
   *
   * function mouseClicked() {
   *   //here we test if the mouse is over the
   *   //canvas element when it's clicked
   *   if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
   *     background(200);
   *
   *     if (sampleIsPlaying) {
   *       //Calling pause() on our
   *       //p5.MediaElement will stop it
   *       //playing, but when we call the
   *       //loop() or play() functions
   *       //the sample will start from
   *       //where we paused it.
   *       ele.pause();
   *
   *       sampleIsPlaying = false;
   *       text('Click to resume!', width / 2, height / 2);
   *     } else {
   *       //loop our sound element until we
   *       //call ele.pause() on it.
   *       ele.loop();
   *
   *       sampleIsPlaying = true;
   *       text('Click to pause!', width / 2, height / 2);
   *     }
   *   }
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.pause = function() {
    this.elt.pause();
    return this;
  };

  /**
   * Set 'loop' to true for an HTML5 media element, and starts playing.
   *
   * @method loop
   * @chainable
   * @example
   * <div><code>
   * //Clicking the canvas will loop
   * //the audio sample until the user
   * //clicks again to stop it
   *
   * //We will store the p5.MediaElement
   * //object in here
   * var ele;
   *
   * //while our audio is playing,
   * //this will be set to true
   * var sampleIsLooping = false;
   *
   * function setup() {
   *   //Here we create a p5.MediaElement object
   *   //using the createAudio() function.
   *   ele = createAudio('assets/lucky_dragons.mp3');
   *   background(200);
   *   textAlign(CENTER);
   *   text('Click to loop!', width / 2, height / 2);
   * }
   *
   * function mouseClicked() {
   *   //here we test if the mouse is over the
   *   //canvas element when it's clicked
   *   if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
   *     background(200);
   *
   *     if (!sampleIsLooping) {
   *       //loop our sound element until we
   *       //call ele.stop() on it.
   *       ele.loop();
   *
   *       sampleIsLooping = true;
   *       text('Click to stop!', width / 2, height / 2);
   *     } else {
   *       ele.stop();
   *
   *       sampleIsLooping = false;
   *       text('Click to loop!', width / 2, height / 2);
   *     }
   *   }
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.loop = function() {
    this.elt.setAttribute('loop', true);
    this.play();
    return this;
  };
  /**
   * Set 'loop' to false for an HTML5 media element. Element will stop
   * when it reaches the end.
   *
   * @method noLoop
   * @chainable
   * @example
   * <div><code>
   * //This example both starts
   * //and stops loop of sound sample
   * //when the user clicks the canvas
   *
   * //We will store the p5.MediaElement
   * //object in here
   * var ele;
   * //while our audio is playing,
   * //this will be set to true
   * var sampleIsPlaying = false;
   *
   * function setup() {
   *   //Here we create a p5.MediaElement object
   *   //using the createAudio() function.
   *   ele = createAudio('assets/beat.mp3');
   *   background(200);
   *   textAlign(CENTER);
   *   text('Click to play!', width / 2, height / 2);
   * }
   *
   * function mouseClicked() {
   *   //here we test if the mouse is over the
   *   //canvas element when it's clicked
   *   if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
   *     background(200);
   *
   *     if (sampleIsPlaying) {
   *       ele.noLoop();
   *       text('No more Loops!', width / 2, height / 2);
   *     } else {
   *       ele.loop();
   *       sampleIsPlaying = true;
   *       text('Click to stop looping!', width / 2, height / 2);
   *     }
   *   }
   * }
   * </code></div>
   *
   */
  p5.MediaElement.prototype.noLoop = function() {
    this.elt.setAttribute('loop', false);
    return this;
  };

  /**
   * Set HTML5 media element to autoplay or not.
   *
   * @method autoplay
   * @param {Boolean} autoplay whether the element should autoplay
   * @chainable
   */
  p5.MediaElement.prototype.autoplay = function(val) {
    this.elt.setAttribute('autoplay', val);
    return this;
  };

  /**
   * Sets volume for this HTML5 media element. If no argument is given,
   * returns the current volume.
   *
   * @method volume
   * @return {Number} current volume
   *
   * @example
   * <div><code>
   * var ele;
   * function setup() {
   *   // p5.MediaElement objects are usually created
   *   // by calling the createAudio(), createVideo(),
   *   // and createCapture() functions.
   *   // In this example we create
   *   // a new p5.MediaElement via createAudio().
   *   ele = createAudio('assets/lucky_dragons.mp3');
   *   background(250);
   *   textAlign(CENTER);
   *   text('Click to Play!', width / 2, height / 2);
   * }
   * function mouseClicked() {
   *   // Here we call the volume() function
   *   // on the sound element to set its volume
   *   // Volume must be between 0.0 and 1.0
   *   ele.volume(0.2);
   *   ele.play();
   *   background(200);
   *   text('You clicked Play!', width / 2, height / 2);
   * }
   * </code></div>
   * <div><code>
   * var audio;
   * var counter = 0;
   *
   * function loaded() {
   *   audio.play();
   * }
   *
   * function setup() {
   *   audio = createAudio('assets/lucky_dragons.mp3', loaded);
   *   textAlign(CENTER);
   * }
   *
   * function draw() {
   *   if (counter === 0) {
   *     background(0, 255, 0);
   *     text('volume(0.9)', width / 2, height / 2);
   *   } else if (counter === 1) {
   *     background(255, 255, 0);
   *     text('volume(0.5)', width / 2, height / 2);
   *   } else if (counter === 2) {
   *     background(255, 0, 0);
   *     text('volume(0.1)', width / 2, height / 2);
   *   }
   * }
   *
   * function mousePressed() {
   *   counter++;
   *   if (counter === 0) {
   *     audio.volume(0.9);
   *   } else if (counter === 1) {
   *     audio.volume(0.5);
   *   } else if (counter === 2) {
   *     audio.volume(0.1);
   *   } else {
   *     counter = 0;
   *     audio.volume(0.9);
   *   }
   * }
   * </code>
   * </div>
   */
  /**
   * @method volume
   * @param {Number}            val volume between 0.0 and 1.0
   * @chainable
   */
  p5.MediaElement.prototype.volume = function(val) {
    if (typeof val === 'undefined') {
      return this.elt.volume;
    } else {
      this.elt.volume = val;
    }
  };

  /**
   * If no arguments are given, returns the current playback speed of the
   * element. The speed parameter sets the speed where 2.0 will play the
   * element twice as fast, 0.5 will play at half the speed, and -1 will play
   * the element in normal speed in reverse.(Note that not all browsers support
   * backward playback and even if they do, playback might not be smooth.)
   *
   * @method speed
   * @return {Number} current playback speed of the element
   *
   * @example
   * <div class='norender notest'><code>
   * //Clicking the canvas will loop
   * //the audio sample until the user
   * //clicks again to stop it
   *
   * //We will store the p5.MediaElement
   * //object in here
   * var ele;
   * var button;
   *
   * function setup() {
   *   createCanvas(710, 400);
   *   //Here we create a p5.MediaElement object
   *   //using the createAudio() function.
   *   ele = createAudio('assets/beat.mp3');
   *   ele.loop();
   *   background(200);
   *
   *   button = createButton('2x speed');
   *   button.position(100, 68);
   *   button.mousePressed(twice_speed);
   *
   *   button = createButton('half speed');
   *   button.position(200, 68);
   *   button.mousePressed(half_speed);
   *
   *   button = createButton('reverse play');
   *   button.position(300, 68);
   *   button.mousePressed(reverse_speed);
   *
   *   button = createButton('STOP');
   *   button.position(400, 68);
   *   button.mousePressed(stop_song);
   *
   *   button = createButton('PLAY!');
   *   button.position(500, 68);
   *   button.mousePressed(play_speed);
   * }
   *
   * function twice_speed() {
   *   ele.speed(2);
   * }
   *
   * function half_speed() {
   *   ele.speed(0.5);
   * }
   *
   * function reverse_speed() {
   *   ele.speed(-1);
   * }
   *
   * function stop_song() {
   *   ele.stop();
   * }
   *
   * function play_speed() {
   *   ele.play();
   * }
   * </code></div>
   */
  /**
   * @method speed
   * @param {Number} speed  speed multiplier for element playback
   * @chainable
   */
  p5.MediaElement.prototype.speed = function(val) {
    if (typeof val === 'undefined') {
      return this.presetPlaybackRate || this.elt.playbackRate;
    } else {
      if (this.loadedmetadata) {
        this.elt.playbackRate = val;
      } else {
        this.presetPlaybackRate = val;
      }
    }
  };

  /**
   * If no arguments are given, returns the current time of the element.
   * If an argument is given the current time of the element is set to it.
   *
   * @method time
   * @return {Number} current time (in seconds)
   *
   * @example
   * <div><code>
   * var ele;
   * var beginning = true;
   * function setup() {
   *   //p5.MediaElement objects are usually created
   *   //by calling the createAudio(), createVideo(),
   *   //and createCapture() functions.
   *
   *   //In this example we create
   *   //a new p5.MediaElement via createAudio().
   *   ele = createAudio('assets/lucky_dragons.mp3');
   *   background(250);
   *   textAlign(CENTER);
   *   text('start at beginning', width / 2, height / 2);
   * }
   *
   * // this function fires with click anywhere
   * function mousePressed() {
   *   if (beginning === true) {
   *     // here we start the sound at the beginning
   *     // time(0) is not necessary here
   *     // as this produces the same result as
   *     // play()
   *     ele.play().time(0);
   *     background(200);
   *     text('jump 2 sec in', width / 2, height / 2);
   *     beginning = false;
   *   } else {
   *     // here we jump 2 seconds into the sound
   *     ele.play().time(2);
   *     background(250);
   *     text('start at beginning', width / 2, height / 2);
   *     beginning = true;
   *   }
   * }
   * </code></div>
   */
  /**
   * @method time
   * @param {Number} time time to jump to (in seconds)
   * @chainable
   */
  p5.MediaElement.prototype.time = function(val) {
    if (typeof val === 'undefined') {
      return this.elt.currentTime;
    } else {
      this.elt.currentTime = val;
      return this;
    }
  };

  /**
   * Returns the duration of the HTML5 media element.
   *
   * @method duration
   * @return {Number} duration
   *
   * @example
   * <div><code>
   * var ele;
   * function setup() {
   *   //p5.MediaElement objects are usually created
   *   //by calling the createAudio(), createVideo(),
   *   //and createCapture() functions.
   *   //In this example we create
   *   //a new p5.MediaElement via createAudio().
   *   ele = createAudio('assets/doorbell.mp3');
   *   background(250);
   *   textAlign(CENTER);
   *   text('Click to know the duration!', 10, 25, 70, 80);
   * }
   * function mouseClicked() {
   *   ele.play();
   *   background(200);
   *   //ele.duration dislpays the duration
   *   text(ele.duration() + ' seconds', width / 2, height / 2);
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.duration = function() {
    return this.elt.duration;
  };
  p5.MediaElement.prototype.pixels = [];
  p5.MediaElement.prototype._ensureCanvas = function() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.drawingContext = this.canvas.getContext('2d');
      this.setModified(true);
    }
    if (this.loadedmetadata) {
      // wait for metadata for w/h
      if (this.canvas.width !== this.elt.width) {
        this.canvas.width = this.elt.width;
        this.canvas.height = this.elt.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this._pixelsDirty = true;
      }

      var currentTime = this.elt.currentTime;
      if (this._pixelsDirty || this._pixelsTime !== currentTime) {
        // only update the pixels array if it's dirty, or
        // if the video time has changed.
        this._pixelsTime = currentTime;
        this._pixelsDirty = true;

        this.drawingContext.drawImage(
          this.elt,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        this.setModified(true);
      }
    }
  };
  p5.MediaElement.prototype.loadPixels = function() {
    this._ensureCanvas();
    return p5.Renderer2D.prototype.loadPixels.apply(this, arguments);
  };
  p5.MediaElement.prototype.updatePixels = function(x, y, w, h) {
    if (this.loadedmetadata) {
      // wait for metadata
      this._ensureCanvas();
      p5.Renderer2D.prototype.updatePixels.call(this, x, y, w, h);
    }
    this.setModified(true);
    return this;
  };
  p5.MediaElement.prototype.get = function() {
    this._ensureCanvas();
    return p5.Renderer2D.prototype.get.apply(this, arguments);
  };
  p5.MediaElement.prototype._getPixel = function() {
    this.loadPixels();
    return p5.Renderer2D.prototype._getPixel.apply(this, arguments);
  };

  p5.MediaElement.prototype.set = function(x, y, imgOrCol) {
    if (this.loadedmetadata) {
      // wait for metadata
      this._ensureCanvas();
      p5.Renderer2D.prototype.set.call(this, x, y, imgOrCol);
      this.setModified(true);
    }
  };
  p5.MediaElement.prototype.copy = function() {
    this._ensureCanvas();
    p5.Renderer2D.prototype.copy.apply(this, arguments);
  };
  p5.MediaElement.prototype.mask = function() {
    this.loadPixels();
    this.setModified(true);
    p5.Image.prototype.mask.apply(this, arguments);
  };
  /**
   * helper method for web GL mode to figure out if the element
   * has been modified and might need to be re-uploaded to texture
   * memory between frames.
   * @method isModified
   * @private
   * @return {boolean} a boolean indicating whether or not the
   * image has been updated or modified since last texture upload.
   */
  p5.MediaElement.prototype.isModified = function() {
    return this._modified;
  };
  /**
   * helper method for web GL mode to indicate that an element has been
   * changed or unchanged since last upload. gl texture upload will
   * set this value to false after uploading the texture; or might set
   * it to true if metadata has become available but there is no actual
   * texture data available yet..
   * @method setModified
   * @param {boolean} val sets whether or not the element has been
   * modified.
   * @private
   */
  p5.MediaElement.prototype.setModified = function(value) {
    this._modified = value;
  };
  /**
   * Schedule an event to be called when the audio or video
   * element reaches the end. If the element is looping,
   * this will not be called. The element is passed in
   * as the argument to the onended callback.
   *
   * @method  onended
   * @param  {Function} callback function to call when the
   *                             soundfile has ended. The
   *                             media element will be passed
   *                             in as the argument to the
   *                             callback.
   * @chainable
   * @example
   * <div><code>
   * function setup() {
   *   var audioEl = createAudio('assets/beat.mp3');
   *   audioEl.showControls();
   *   audioEl.onended(sayDone);
   * }
   *
   * function sayDone(elt) {
   *   alert('done playing ' + elt.src);
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.onended = function(callback) {
    this._onended = callback;
    return this;
  };

  /*** CONNECT TO WEB AUDIO API / p5.sound.js ***/

  /**
   * Send the audio output of this element to a specified audioNode or
   * p5.sound object. If no element is provided, connects to p5's master
   * output. That connection is established when this method is first called.
   * All connections are removed by the .disconnect() method.
   *
   * This method is meant to be used with the p5.sound.js addon library.
   *
   * @method  connect
   * @param  {AudioNode|Object} audioNode AudioNode from the Web Audio API,
   * or an object from the p5.sound library
   */
  p5.MediaElement.prototype.connect = function(obj) {
    var audioContext, masterOutput;

    // if p5.sound exists, same audio context
    if (typeof p5.prototype.getAudioContext === 'function') {
      audioContext = p5.prototype.getAudioContext();
      masterOutput = p5.soundOut.input;
    } else {
      try {
        audioContext = obj.context;
        masterOutput = audioContext.destination;
      } catch (e) {
        throw 'connect() is meant to be used with Web Audio API or p5.sound.js';
      }
    }

    // create a Web Audio MediaElementAudioSourceNode if none already exists
    if (!this.audioSourceNode) {
      this.audioSourceNode = audioContext.createMediaElementSource(this.elt);

      // connect to master output when this method is first called
      this.audioSourceNode.connect(masterOutput);
    }

    // connect to object if provided
    if (obj) {
      if (obj.input) {
        this.audioSourceNode.connect(obj.input);
      } else {
        this.audioSourceNode.connect(obj);
      }
    } else {
      // otherwise connect to master output of p5.sound / AudioContext
      this.audioSourceNode.connect(masterOutput);
    }
  };

  /**
   * Disconnect all Web Audio routing, including to master output.
   * This is useful if you want to re-route the output through
   * audio effects, for example.
   *
   * @method  disconnect
   */
  p5.MediaElement.prototype.disconnect = function() {
    if (this.audioSourceNode) {
      this.audioSourceNode.disconnect();
    } else {
      throw 'nothing to disconnect';
    }
  };

  /*** SHOW / HIDE CONTROLS ***/

  /**
   * Show the default MediaElement controls, as determined by the web browser.
   *
   * @method  showControls
   * @example
   * <div><code>
   * var ele;
   * function setup() {
   *   //p5.MediaElement objects are usually created
   *   //by calling the createAudio(), createVideo(),
   *   //and createCapture() functions.
   *   //In this example we create
   *   //a new p5.MediaElement via createAudio()
   *   ele = createAudio('assets/lucky_dragons.mp3');
   *   background(200);
   *   textAlign(CENTER);
   *   text('Click to Show Controls!', 10, 25, 70, 80);
   * }
   * function mousePressed() {
   *   ele.showControls();
   *   background(200);
   *   text('Controls Shown', width / 2, height / 2);
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.showControls = function() {
    // must set style for the element to show on the page
    this.elt.style['text-align'] = 'inherit';
    this.elt.controls = true;
  };

  /**
   * Hide the default mediaElement controls.
   * @method hideControls
   * @example
   * <div><code>
   * var ele;
   * function setup() {
   *   //p5.MediaElement objects are usually created
   *   //by calling the createAudio(), createVideo(),
   *   //and createCapture() functions.
   *   //In this example we create
   *   //a new p5.MediaElement via createAudio()
   *   ele = createAudio('assets/lucky_dragons.mp3');
   *   ele.showControls();
   *   background(200);
   *   textAlign(CENTER);
   *   text('Click to hide Controls!', 10, 25, 70, 80);
   * }
   * function mousePressed() {
   *   ele.hideControls();
   *   background(200);
   *   text('Controls hidden', width / 2, height / 2);
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.hideControls = function() {
    this.elt.controls = false;
  };

  /*** SCHEDULE EVENTS ***/

  // Cue inspired by JavaScript setTimeout, and the
  // Tone.js Transport Timeline Event, MIT License Yotam Mann 2015 tonejs.org
  var Cue = function(callback, time, id, val) {
    this.callback = callback;
    this.time = time;
    this.id = id;
    this.val = val;
  };

  /**
   * Schedule events to trigger every time a MediaElement
   * (audio/video) reaches a playback cue point.
   *
   * Accepts a callback function, a time (in seconds) at which to trigger
   * the callback, and an optional parameter for the callback.
   *
   * Time will be passed as the first parameter to the callback function,
   * and param will be the second parameter.
   *
   *
   * @method  addCue
   * @param {Number}   time     Time in seconds, relative to this media
   *                             element's playback. For example, to trigger
   *                             an event every time playback reaches two
   *                             seconds, pass in the number 2. This will be
   *                             passed as the first parameter to
   *                             the callback function.
   * @param {Function} callback Name of a function that will be
   *                             called at the given time. The callback will
   *                             receive time and (optionally) param as its
   *                             two parameters.
   * @param {Object} [value]    An object to be passed as the
   *                             second parameter to the
   *                             callback function.
   * @return {Number} id ID of this cue,
   *                     useful for removeCue(id)
   * @example
   * <div><code>
   * //
   * //
   * function setup() {
   *   noCanvas();
   *
   *   var audioEl = createAudio('assets/beat.mp3');
   *   audioEl.showControls();
   *
   *   // schedule three calls to changeBackground
   *   audioEl.addCue(0.5, changeBackground, color(255, 0, 0));
   *   audioEl.addCue(1.0, changeBackground, color(0, 255, 0));
   *   audioEl.addCue(2.5, changeBackground, color(0, 0, 255));
   *   audioEl.addCue(3.0, changeBackground, color(0, 255, 255));
   *   audioEl.addCue(4.2, changeBackground, color(255, 255, 0));
   *   audioEl.addCue(5.0, changeBackground, color(255, 255, 0));
   * }
   *
   * function changeBackground(val) {
   *   background(val);
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.addCue = function(time, callback, val) {
    var id = this._cueIDCounter++;

    var cue = new Cue(callback, time, id, val);
    this._cues.push(cue);

    if (!this.elt.ontimeupdate) {
      this.elt.ontimeupdate = this._onTimeUpdate.bind(this);
    }

    return id;
  };

  /**
   * Remove a callback based on its ID. The ID is returned by the
   * addCue method.
   * @method removeCue
   * @param  {Number} id ID of the cue, as returned by addCue
   * @example
   * <div><code>
   * var audioEl, id1, id2;
   * function setup() {
   *   background(255, 255, 255);
   *   audioEl = createAudio('assets/beat.mp3');
   *   audioEl.showControls();
   *   // schedule five calls to changeBackground
   *   id1 = audioEl.addCue(0.5, changeBackground, color(255, 0, 0));
   *   audioEl.addCue(1.0, changeBackground, color(0, 255, 0));
   *   audioEl.addCue(2.5, changeBackground, color(0, 0, 255));
   *   audioEl.addCue(3.0, changeBackground, color(0, 255, 255));
   *   id2 = audioEl.addCue(4.2, changeBackground, color(255, 255, 0));
   *   text('Click to remove first and last Cue!', 10, 25, 70, 80);
   * }
   * function mousePressed() {
   *   audioEl.removeCue(id1);
   *   audioEl.removeCue(id2);
   * }
   * function changeBackground(val) {
   *   background(val);
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.removeCue = function(id) {
    for (var i = 0; i < this._cues.length; i++) {
      if (this._cues[i].id === id) {
        console.log(id);
        this._cues.splice(i, 1);
      }
    }

    if (this._cues.length === 0) {
      this.elt.ontimeupdate = null;
    }
  };

  /**
   * Remove all of the callbacks that had originally been scheduled
   * via the addCue method.
   * @method  clearCues
   * @param  {Number} id ID of the cue, as returned by addCue
   * @example
   * <div><code>
   * var audioEl;
   * function setup() {
   *   background(255, 255, 255);
   *   audioEl = createAudio('assets/beat.mp3');
   *   //Show the default MediaElement controls, as determined by the web browser
   *   audioEl.showControls();
   *   // schedule calls to changeBackground
   *   background(200);
   *   text('Click to change Cue!', 10, 25, 70, 80);
   *   audioEl.addCue(0.5, changeBackground, color(255, 0, 0));
   *   audioEl.addCue(1.0, changeBackground, color(0, 255, 0));
   *   audioEl.addCue(2.5, changeBackground, color(0, 0, 255));
   *   audioEl.addCue(3.0, changeBackground, color(0, 255, 255));
   *   audioEl.addCue(4.2, changeBackground, color(255, 255, 0));
   * }
   * function mousePressed() {
   *   // here we clear the scheduled callbacks
   *   audioEl.clearCues();
   *   // then we add some more callbacks
   *   audioEl.addCue(1, changeBackground, color(2, 2, 2));
   *   audioEl.addCue(3, changeBackground, color(255, 255, 0));
   * }
   * function changeBackground(val) {
   *   background(val);
   * }
   * </code></div>
   */
  p5.MediaElement.prototype.clearCues = function() {
    this._cues = [];
    this.elt.ontimeupdate = null;
  };

  // private method that checks for cues to be fired if events
  // have been scheduled using addCue(callback, time).
  p5.MediaElement.prototype._onTimeUpdate = function() {
    var playbackTime = this.time();

    for (var i = 0; i < this._cues.length; i++) {
      var callbackTime = this._cues[i].time;
      var val = this._cues[i].val;

      if (this._prevTime < callbackTime && callbackTime <= playbackTime) {
        // pass the scheduled callbackTime as parameter to the callback
        this._cues[i].callback(val);
      }
    }

    this._prevTime = playbackTime;
  };

  /**
   * Base class for a file.
   * Used for Element.drop and createFileInput.
   *
   * @class p5.File
   * @constructor
   * @param {File} file File that is wrapped
   */
  p5.File = function(file, pInst) {
    /**
     * Underlying File object. All normal File methods can be called on this.
     *
     * @property file
     */
    this.file = file;

    this._pInst = pInst;

    // Splitting out the file type into two components
    // This makes determining if image or text etc simpler
    var typeList = file.type.split('/');
    /**
     * File type (image, text, etc.)
     *
     * @property type
     */
    this.type = typeList[0];
    /**
     * File subtype (usually the file extension jpg, png, xml, etc.)
     *
     * @property subtype
     */
    this.subtype = typeList[1];
    /**
     * File name
     *
     * @property name
     */
    this.name = file.name;
    /**
     * File size
     *
     * @property size
     */
    this.size = file.size;

    /**
     * URL string containing image data.
     *
     * @property data
     */
    this.data = undefined;
  };

  p5.File._createLoader = function(theFile, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var p5file = new p5.File(theFile);
      p5file.data = e.target.result;
      callback(p5file);
    };
    return reader;
  };

  p5.File._load = function(f, callback) {
    // Text or data?
    // This should likely be improved
    if (/^text\//.test(f.type)) {
      p5.File._createLoader(f, callback).readAsText(f);
    } else if (!/^(video|audio)\//.test(f.type)) {
      p5.File._createLoader(f, callback).readAsDataURL(f);
    } else {
      var file = new p5.File(f);
      file.data = URL.createObjectURL(f);
      callback(file);
    }
  };
});
p5.Vector.prototype.div = function div(n) {
            if (!(typeof n === 'number' && isFinite(n))) {
              console.warn(
                'p5.Vector.prototype.div:',
                'n is undefined or not a finite number'
              );

              return this;
            }
            if (n === 0) {
              console.warn('p5.Vector.prototype.div:', 'divide by 0');
              return this;
            }
            this.x /= n;
            this.y /= n;
            this.z /= n;
            return this;
          };

          /**
           * Calculates the magnitude (length) of the vector and returns the result as
           * a float (this is simply the equation sqrt(x*x + y*y + z*z).)
           *
           * @method mag
           * @return {Number} magnitude of the vector
           * @example
           * <div>
           * <code>
           * function draw() {
           *   background(240);
           *
           *   let v0 = createVector(0, 0);
           *   let v1 = createVector(mouseX, mouseY);
           *   drawArrow(v0, v1, 'black');
           *
           *   noStroke();
           *   text('vector length: ' + v1.mag().toFixed(2), 10, 70, 90, 30);
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           * <div class="norender">
           * <code>
           * let v = createVector(20.0, 30.0, 40.0);
           * let m = v.mag();
           * print(m); // Prints "53.85164807134504"
           * </code>
           * </div>
           */
          p5.Vector.prototype.mag = function mag() {
            return Math.sqrt(this.magSq());
          };

          /**
           * Calculates the squared magnitude of the vector and returns the result
           * as a float (this is simply the equation <em>(x*x + y*y + z*z)</em>.)
           * Faster if the real length is not required in the
           * case of comparing vectors, etc.
           *
           * @method magSq
           * @return {number} squared magnitude of the vector
           * @example
           * <div class="norender">
           * <code>
           * // Static method
           * let v1 = createVector(6, 4, 2);
           * print(v1.magSq()); // Prints "56"
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * function draw() {
           *   background(240);
           *
           *   let v0 = createVector(0, 0);
           *   let v1 = createVector(mouseX, mouseY);
           *   drawArrow(v0, v1, 'black');
           *
           *   noStroke();
           *   text('vector length squared: ' + v1.magSq().toFixed(2), 10, 45, 90, 55);
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.prototype.magSq = function magSq() {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return x * x + y * y + z * z;
          };

          /**
           * Calculates the dot product of two vectors. The version of the method
           * that computes the dot product of two independent vectors is a static
           * method. See the examples for more context.
           *
           *
           * @method dot
           * @param  {Number} x   x component of the vector
           * @param  {Number} [y] y component of the vector
           * @param  {Number} [z] z component of the vector
           * @return {Number}       the dot product
           *
           * @example
           * <div class="norender">
           * <code>
           * let v1 = createVector(1, 2, 3);
           * let v2 = createVector(2, 3, 4);
           *
           * print(v1.dot(v2)); // Prints "20"
           * </code>
           * </div>
           *
           * <div class="norender">
           * <code>
           * //Static method
           * let v1 = createVector(1, 2, 3);
           * let v2 = createVector(3, 2, 1);
           * print(p5.Vector.dot(v1, v2)); // Prints "10"
           * </code>
           * </div>
           */
          /**
           * @method dot
           * @param  {p5.Vector} value value component of the vector or a <a href="#/p5.Vector">p5.Vector</a>
           * @return {Number}
           */
          p5.Vector.prototype.dot = function dot(x, y, z) {
            if (x instanceof p5.Vector) {
              return this.dot(x.x, x.y, x.z);
            }
            return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
          };

          /**
           * Calculates and returns a vector composed of the cross product between
           * two vectors. Both the static and non static methods return a new <a href="#/p5.Vector">p5.Vector</a>.
           * See the examples for more context.
           *
           * @method cross
           * @param  {p5.Vector} v <a href="#/p5.Vector">p5.Vector</a> to be crossed
           * @return {p5.Vector}   <a href="#/p5.Vector">p5.Vector</a> composed of cross product
           * @example
           * <div class="norender">
           * <code>
           * let v1 = createVector(1, 2, 3);
           * let v2 = createVector(1, 2, 3);
           *
           * v1.cross(v2); // v's components are [0, 0, 0]
           * </code>
           * </div>
           *
           * <div class="norender">
           * <code>
           * // Static method
           * let v1 = createVector(1, 0, 0);
           * let v2 = createVector(0, 1, 0);
           *
           * let crossProduct = p5.Vector.cross(v1, v2);
           * // crossProduct has components [0, 0, 1]
           * print(crossProduct);
           * </code>
           * </div>
           */
          p5.Vector.prototype.cross = function cross(v) {
            var x = this.y * v.z - this.z * v.y;
            var y = this.z * v.x - this.x * v.z;
            var z = this.x * v.y - this.y * v.x;
            if (this.p5) {
              return new p5.Vector(this.p5, [x, y, z]);
            } else {
              return new p5.Vector(x, y, z);
            }
          };

          /**
           * Calculates the Euclidean distance between two points (considering a
           * point as a vector object).
           *
           * @method dist
           * @param  {p5.Vector} v the x, y, and z coordinates of a <a href="#/p5.Vector">p5.Vector</a>
           * @return {Number}      the distance
           * @example
           * <div class="norender">
           * <code>
           * let v1 = createVector(1, 0, 0);
           * let v2 = createVector(0, 1, 0);
           *
           * let distance = v1.dist(v2); // distance is 1.4142...
           * print(distance);
           * </code>
           * </div>
           *
           * <div class="norender">
           * <code>
           * // Static method
           * let v1 = createVector(1, 0, 0);
           * let v2 = createVector(0, 1, 0);
           *
           * let distance = p5.Vector.dist(v1, v2);
           * // distance is 1.4142...
           * print(distance);
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * function draw() {
           *   background(240);
           *
           *   let v0 = createVector(0, 0);
           *
           *   let v1 = createVector(70, 50);
           *   drawArrow(v0, v1, 'red');
           *
           *   let v2 = createVector(mouseX, mouseY);
           *   drawArrow(v0, v2, 'blue');
           *
           *   noStroke();
           *   text('distance between vectors: ' + v2.dist(v1).toFixed(2), 5, 50, 95, 50);
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.prototype.dist = function dist(v) {
            return v
              .copy()
              .sub(this)
              .mag();
          };

          /**
           * Normalize the vector to length 1 (make it a unit vector).
           *
           * @method normalize
           * @return {p5.Vector} normalized <a href="#/p5.Vector">p5.Vector</a>
           * @example
           * <div class="norender">
           * <code>
           * let v = createVector(10, 20, 2);
           * // v has components [10.0, 20.0, 2.0]
           * v.normalize();
           * // v's components are set to
           * // [0.4454354, 0.8908708, 0.089087084]
           * </code>
           * </div>
           * <div>
           * <code>
           * function draw() {
           *   background(240);
           *
           *   let v0 = createVector(50, 50);
           *   let v1 = createVector(mouseX - 50, mouseY - 50);
           *
           *   drawArrow(v0, v1, 'red');
           *   v1.normalize();
           *   drawArrow(v0, v1.mult(35), 'blue');
           *
           *   noFill();
           *   ellipse(50, 50, 35 * 2);
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.prototype.normalize = function normalize() {
            var len = this.mag();
            // here we multiply by the reciprocal instead of calling 'div()'
            // since div duplicates this zero check.
            if (len !== 0) this.mult(1 / len);
            return this;
          };

          /**
           * Limit the magnitude of this vector to the value used for the <b>max</b>
           * parameter.
           *
           * @method limit
           * @param  {Number}    max the maximum magnitude for the vector
           * @chainable
           * @example
           * <div class="norender">
           * <code>
           * let v = createVector(10, 20, 2);
           * // v has components [10.0, 20.0, 2.0]
           * v.limit(5);
           * // v's components are set to
           * // [2.2271771, 4.4543543, 0.4454354]
           * </code>
           * </div>
           * <div>
           * <code>
           * function draw() {
           *   background(240);
           *
           *   let v0 = createVector(50, 50);
           *   let v1 = createVector(mouseX - 50, mouseY - 50);
           *
           *   drawArrow(v0, v1, 'red');
           *   drawArrow(v0, v1.limit(35), 'blue');
           *
           *   noFill();
           *   ellipse(50, 50, 35 * 2);
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.prototype.limit = function limit(max) {
            var mSq = this.magSq();
            if (mSq > max * max) {
              this.div(Math.sqrt(mSq)) //normalize it
                .mult(max);
            }
            return this;
          };

          /**
           * Set the magnitude of this vector to the value used for the <b>len</b>
           * parameter.
           *
           * @method setMag
           * @param  {number}    len the new length for this vector
           * @chainable
           * @example
           * <div class="norender">
           * <code>
           * let v = createVector(10, 20, 2);
           * // v has components [10.0, 20.0, 2.0]
           * v.setMag(10);
           * // v's components are set to [6.0, 8.0, 0.0]
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * function draw() {
           *   background(240);
           *
           *   let v0 = createVector(0, 0);
           *   let v1 = createVector(50, 50);
           *
           *   drawArrow(v0, v1, 'red');
           *
           *   let length = map(mouseX, 0, width, 0, 141, true);
           *   v1.setMag(length);
           *   drawArrow(v0, v1, 'blue');
           *
           *   noStroke();
           *   text('magnitude set to: ' + length.toFixed(2), 10, 70, 90, 30);
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.prototype.setMag = function setMag(n) {
            return this.normalize().mult(n);
          };

          /**
           * Calculate the angle of rotation for this vector (only 2D vectors)
           *
           * @method heading
           * @return {Number} the angle of rotation
           * @example
           * <div class = "norender">
           * <code>
           * function setup() {
           *   let v1 = createVector(30, 50);
           *   print(v1.heading()); // 1.0303768265243125
           *
           *   v1 = createVector(40, 50);
           *   print(v1.heading()); // 0.8960553845713439
           *
           *   v1 = createVector(30, 70);
           *   print(v1.heading()); // 1.1659045405098132
           * }
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * function draw() {
           *   background(240);
           *
           *   let v0 = createVector(50, 50);
           *   let v1 = createVector(mouseX - 50, mouseY - 50);
           *
           *   drawArrow(v0, v1, 'black');
           *
           *   let myHeading = v1.heading();
           *   noStroke();
           *   text(
           *     'vector heading: ' +
           *       myHeading.toFixed(2) +
           *       ' radians or ' +
           *       degrees(myHeading).toFixed(2) +
           *       ' degrees',
           *     10,
           *     50,
           *     90,
           *     50
           *   );
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.prototype.heading = function heading() {
            var h = Math.atan2(this.y, this.x);
            if (this.p5) return this.p5._fromRadians(h);
            return h;
          };

          /**
           * Rotate the vector by an angle (only 2D vectors), magnitude remains the
           * same
           *
           * @method rotate
           * @param  {number}    angle the angle of rotation
           * @chainable
           * @example
           * <div class="norender">
           * <code>
           * let v = createVector(10.0, 20.0);
           * // v has components [10.0, 20.0, 0.0]
           * v.rotate(HALF_PI);
           * // v's components are set to [-20.0, 9.999999, 0.0]
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * let angle = 0;
           * function draw() {
           *   background(240);
           *
           *   let v0 = createVector(50, 50);
           *   let v1 = createVector(50, 0);
           *
           *   drawArrow(v0, v1.rotate(angle), 'black');
           *   angle += 0.01;
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.prototype.rotate = function rotate(a) {
            var newHeading = this.heading() + a;
            if (this.p5) newHeading = this.p5._toRadians(newHeading);
            var mag = this.mag();
            this.x = Math.cos(newHeading) * mag;
            this.y = Math.sin(newHeading) * mag;
            return this;
          };

          /**
           * Calculates and returns the angle (in radians) between two vectors.
           * @method angleBetween
           * @param  {p5.Vector}    value the x, y, and z components of a <a href="#/p5.Vector">p5.Vector</a>
           * @return {Number}       the angle between (in radians)
           * @example
           * <div class="norender">
           * <code>
           * let v1 = createVector(1, 0, 0);
           * let v2 = createVector(0, 1, 0);
           *
           * let angle = v1.angleBetween(v2);
           * // angle is PI/2
           * print(angle);
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * function draw() {
           *   background(240);
           *   let v0 = createVector(50, 50);
           *
           *   let v1 = createVector(50, 0);
           *   drawArrow(v0, v1, 'red');
           *
           *   let v2 = createVector(mouseX - 50, mouseY - 50);
           *   drawArrow(v0, v2, 'blue');
           *
           *   let angleBetween = v1.angleBetween(v2);
           *   noStroke();
           *   text(
           *     'angle between: ' +
           *       angleBetween.toFixed(2) +
           *       ' radians or ' +
           *       degrees(angleBetween).toFixed(2) +
           *       ' degrees',
           *     10,
           *     50,
           *     90,
           *     50
           *   );
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.prototype.angleBetween = function angleBetween(v) {
            var dotmagmag = this.dot(v) / (this.mag() * v.mag());
            // Mathematically speaking: the dotmagmag variable will be between -1 and 1
            // inclusive. Practically though it could be slightly outside this range due
            // to floating-point rounding issues. This can make Math.acos return NaN.
            //
            // Solution: we'll clamp the value to the -1,1 range
            var angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
            if (this.p5) return this.p5._fromRadians(angle);
            return angle;
          };

          /**
           * Linear interpolate the vector to another vector
           *
           * @method lerp
           * @param  {Number}    x   the x component
           * @param  {Number}    y   the y component
           * @param  {Number}    z   the z component
           * @param  {Number}    amt the amount of interpolation; some value between 0.0
           *                         (old vector) and 1.0 (new vector). 0.9 is very near
           *                         the new vector. 0.5 is halfway in between.
           * @chainable
           *
           * @example
           * <div class="norender">
           * <code>
           * let v = createVector(1, 1, 0);
           *
           * v.lerp(3, 3, 0, 0.5); // v now has components [2,2,0]
           * </code>
           * </div>
           *
           * <div class="norender">
           * <code>
           * let v1 = createVector(0, 0, 0);
           * let v2 = createVector(100, 100, 0);
           *
           * let v3 = p5.Vector.lerp(v1, v2, 0.5);
           * // v3 has components [50,50,0]
           * print(v3);
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * let step = 0.01;
           * let amount = 0;
           *
           * function draw() {
           *   background(240);
           *   let v0 = createVector(0, 0);
           *
           *   let v1 = createVector(mouseX, mouseY);
           *   drawArrow(v0, v1, 'red');
           *
           *   let v2 = createVector(90, 90);
           *   drawArrow(v0, v2, 'blue');
           *
           *   if (amount > 1 || amount < 0) {
           *     step *= -1;
           *   }
           *   amount += step;
           *   let v3 = p5.Vector.lerp(v1, v2, amount);
           *
           *   drawArrow(v0, v3, 'purple');
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          /**
           * @method lerp
           * @param  {p5.Vector} v   the <a href="#/p5.Vector">p5.Vector</a> to lerp to
           * @param  {Number}    amt
           * @chainable
           */
          p5.Vector.prototype.lerp = function lerp(x, y, z, amt) {
            if (x instanceof p5.Vector) {
              return this.lerp(x.x, x.y, x.z, y);
            }
            this.x += (x - this.x) * amt || 0;
            this.y += (y - this.y) * amt || 0;
            this.z += (z - this.z) * amt || 0;
            return this;
          };

          /**
           * Return a representation of this vector as a float array. This is only
           * for temporary use. If used in any other fashion, the contents should be
           * copied by using the <b>p5.Vector.<a href="#/p5.Vector/copy">copy()</a></b> method to copy into your own
           * array.
           *
           * @method array
           * @return {Number[]} an Array with the 3 values
           * @example
           * <div class = "norender">
           * <code>
           * function setup() {
           *   let v = createVector(20, 30);
           *   print(v.array()); // Prints : Array [20, 30, 0]
           * }
           * </code>
           * </div>
           *
           * <div class="norender">
           * <code>
           * let v = createVector(10.0, 20.0, 30.0);
           * let f = v.array();
           * print(f[0]); // Prints "10.0"
           * print(f[1]); // Prints "20.0"
           * print(f[2]); // Prints "30.0"
           * </code>
           * </div>
           */
          p5.Vector.prototype.array = function array() {
            return [this.x || 0, this.y || 0, this.z || 0];
          };

          /**
           * Equality check against a <a href="#/p5.Vector">p5.Vector</a>
           *
           * @method equals
           * @param {Number} [x] the x component of the vector
           * @param {Number} [y] the y component of the vector
           * @param {Number} [z] the z component of the vector
           * @return {Boolean} whether the vectors are equals
           * @example
           * <div class = "norender">
           * <code>
           * let v1 = createVector(5, 10, 20);
           * let v2 = createVector(5, 10, 20);
           * let v3 = createVector(13, 10, 19);
           *
           * print(v1.equals(v2.x, v2.y, v2.z)); // true
           * print(v1.equals(v3.x, v3.y, v3.z)); // false
           * </code>
           * </div>
           *
           * <div class="norender">
           * <code>
           * let v1 = createVector(10.0, 20.0, 30.0);
           * let v2 = createVector(10.0, 20.0, 30.0);
           * let v3 = createVector(0.0, 0.0, 0.0);
           * print(v1.equals(v2)); // true
           * print(v1.equals(v3)); // false
           * </code>
           * </div>
           */
          /**
           * @method equals
           * @param {p5.Vector|Array} value the vector to compare
           * @return {Boolean}
           */
          p5.Vector.prototype.equals = function equals(x, y, z) {
            var a, b, c;
            if (x instanceof p5.Vector) {
              a = x.x || 0;
              b = x.y || 0;
              c = x.z || 0;
            } else if (x instanceof Array) {
              a = x[0] || 0;
              b = x[1] || 0;
              c = x[2] || 0;
            } else {
              a = x || 0;
              b = y || 0;
              c = z || 0;
            }
            return this.x === a && this.y === b && this.z === c;
          };

          // Static Methods

          /**
           * Make a new 2D vector from an angle
           *
           * @method fromAngle
           * @static
           * @param {Number}     angle the desired angle, in radians (unaffected by <a href="#/p5/angleMode">angleMode</a>)
           * @param {Number}     [length] the length of the new vector (defaults to 1)
           * @return {p5.Vector}       the new <a href="#/p5.Vector">p5.Vector</a> object
           * @example
           * <div>
           * <code>
           * function draw() {
           *   background(200);
           *
           *   // Create a variable, proportional to the mouseX,
           *   // varying from 0-360, to represent an angle in degrees.
           *   let myDegrees = map(mouseX, 0, width, 0, 360);
           *
           *   // Display that variable in an onscreen text.
           *   // (Note the nfc() function to truncate additional decimal places,
           *   // and the "\xB0" character for the degree symbol.)
           *   let readout = 'angle = ' + nfc(myDegrees, 1) + '\xB0';
           *   noStroke();
           *   fill(0);
           *   text(readout, 5, 15);
           *
           *   // Create a p5.Vector using the fromAngle function,
           *   // and extract its x and y components.
           *   let v = p5.Vector.fromAngle(radians(myDegrees), 30);
           *   let vx = v.x;
           *   let vy = v.y;
           *
           *   push();
           *   translate(width / 2, height / 2);
           *   noFill();
           *   stroke(150);
           *   line(0, 0, 30, 0);
           *   stroke(0);
           *   line(0, 0, vx, vy);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.fromAngle = function fromAngle(angle, length) {
            if (typeof length === 'undefined') {
              length = 1;
            }
            return new p5.Vector(length * Math.cos(angle), length * Math.sin(angle), 0);
          };

          /**
           * Make a new 3D vector from a pair of ISO spherical angles
           *
           * @method fromAngles
           * @static
           * @param {Number}     theta    the polar angle, in radians (zero is up)
           * @param {Number}     phi      the azimuthal angle, in radians
           *                               (zero is out of the screen)
           * @param {Number}     [length] the length of the new vector (defaults to 1)
           * @return {p5.Vector}          the new <a href="#/p5.Vector">p5.Vector</a> object
           * @example
           * <div modernizr='webgl'>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   fill(255);
           *   noStroke();
           * }
           * function draw() {
           *   background(255);
           *
           *   let t = millis() / 1000;
           *
           *   // add three point lights
           *   pointLight(color('#f00'), p5.Vector.fromAngles(t * 1.0, t * 1.3, 100));
           *   pointLight(color('#0f0'), p5.Vector.fromAngles(t * 1.1, t * 1.2, 100));
           *   pointLight(color('#00f'), p5.Vector.fromAngles(t * 1.2, t * 1.1, 100));
           *
           *   sphere(35);
           * }
           * </code>
           * </div>
           */
          p5.Vector.fromAngles = function(theta, phi, length) {
            if (typeof length === 'undefined') {
              length = 1;
            }
            var cosPhi = Math.cos(phi);
            var sinPhi = Math.sin(phi);
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);

            return new p5.Vector(
              length * sinTheta * sinPhi,
              -length * cosTheta,
              length * sinTheta * cosPhi
            );
          };

          /**
           * Make a new 2D unit vector from a random angle
           *
           * @method random2D
           * @static
           * @return {p5.Vector} the new <a href="#/p5.Vector">p5.Vector</a> object
           * @example
           * <div class="norender">
           * <code>
           * let v = p5.Vector.random2D();
           * // May make v's attributes something like:
           * // [0.61554617, -0.51195765, 0.0] or
           * // [-0.4695841, -0.14366731, 0.0] or
           * // [0.6091097, -0.22805278, 0.0]
           * print(v);
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * function setup() {
           *   frameRate(1);
           * }
           *
           * function draw() {
           *   background(240);
           *
           *   let v0 = createVector(50, 50);
           *   let v1 = p5.Vector.random2D();
           *   drawArrow(v0, v1.mult(50), 'black');
           * }
           *
           * // draw an arrow for a vector at a given base position
           * function drawArrow(base, vec, myColor) {
           *   push();
           *   stroke(myColor);
           *   strokeWeight(3);
           *   fill(myColor);
           *   translate(base.x, base.y);
           *   line(0, 0, vec.x, vec.y);
           *   rotate(vec.heading());
           *   let arrowSize = 7;
           *   translate(vec.mag() - arrowSize, 0);
           *   triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
           *   pop();
           * }
           * </code>
           * </div>
           */
          p5.Vector.random2D = function random2D() {
            return this.fromAngle(Math.random() * constants.TWO_PI);
          };

          /**
           * Make a new random 3D unit vector.
           *
           * @method random3D
           * @static
           * @return {p5.Vector} the new <a href="#/p5.Vector">p5.Vector</a> object
           * @example
           * <div class="norender">
           * <code>
           * let v = p5.Vector.random3D();
           * // May make v's attributes something like:
           * // [0.61554617, -0.51195765, 0.599168] or
           * // [-0.4695841, -0.14366731, -0.8711202] or
           * // [0.6091097, -0.22805278, -0.7595902]
           * print(v);
           * </code>
           * </div>
           */
          p5.Vector.random3D = function random3D() {
            var angle = Math.random() * constants.TWO_PI;
            var vz = Math.random() * 2 - 1;
            var vzBase = Math.sqrt(1 - vz * vz);
            var vx = vzBase * Math.cos(angle);
            var vy = vzBase * Math.sin(angle);
            return new p5.Vector(vx, vy, vz);
          };

          // Adds two vectors together and returns a new one.
          /**
           * @method add
           * @static
           * @param  {p5.Vector} v1 a <a href="#/p5.Vector">p5.Vector</a> to add
           * @param  {p5.Vector} v2 a <a href="#/p5.Vector">p5.Vector</a> to add
           * @param  {p5.Vector} target the vector to receive the result
           */
          /**
           * @method add
           * @static
           * @param  {p5.Vector} v1
           * @param  {p5.Vector} v2
           * @return {p5.Vector} the resulting <a href="#/p5.Vector">p5.Vector</a>
           *
           */

          p5.Vector.add = function add(v1, v2, target) {
            if (!target) {
              target = v1.copy();
            } else {
              target.set(v1);
            }
            target.add(v2);
            return target;
          };

          /*
    * Subtracts one <a href="#/p5.Vector">p5.Vector</a> from another and returns a new one.  The second
    * vector (v2) is subtracted from the first (v1), resulting in v1-v2.
    */
          /**
           * @method sub
           * @static
           * @param  {p5.Vector} v1 a <a href="#/p5.Vector">p5.Vector</a> to subtract from
           * @param  {p5.Vector} v2 a <a href="#/p5.Vector">p5.Vector</a> to subtract
           * @param  {p5.Vector} target if undefined a new vector will be created
           */
          /**
           * @method sub
           * @static
           * @param  {p5.Vector} v1
           * @param  {p5.Vector} v2
           * @return {p5.Vector} the resulting <a href="#/p5.Vector">p5.Vector</a>
           */

          p5.Vector.sub = function sub(v1, v2, target) {
            if (!target) {
              target = v1.copy();
            } else {
              target.set(v1);
            }
            target.sub(v2);
            return target;
          };

          /**
           * Multiplies a vector by a scalar and returns a new vector.
           */
          /**
           * @method mult
           * @static
           * @param  {p5.Vector} v the vector to multiply
           * @param  {Number}  n
           * @param  {p5.Vector} target if undefined a new vector will be created
           */
          /**
           * @method mult
           * @static
           * @param  {p5.Vector} v
           * @param  {Number}  n
           * @return {p5.Vector}  the resulting new <a href="#/p5.Vector">p5.Vector</a>
           */
          p5.Vector.mult = function mult(v, n, target) {
            if (!target) {
              target = v.copy();
            } else {
              target.set(v);
            }
            target.mult(n);
            return target;
          };

          /**
           * Divides a vector by a scalar and returns a new vector.
           */
          /**
           * @method div
           * @static
           * @param  {p5.Vector} v the vector to divide
           * @param  {Number}  n
           * @param  {p5.Vector} target if undefined a new vector will be created
           */
          /**
           * @method div
           * @static
           * @param  {p5.Vector} v
           * @param  {Number}  n
           * @return {p5.Vector} the resulting new <a href="#/p5.Vector">p5.Vector</a>
           */
          p5.Vector.div = function div(v, n, target) {
            if (!target) {
              target = v.copy();
            } else {
              target.set(v);
            }
            target.div(n);
            return target;
          };

          /**
           * Calculates the dot product of two vectors.
           */
          /**
           * @method dot
           * @static
           * @param  {p5.Vector} v1 the first <a href="#/p5.Vector">p5.Vector</a>
           * @param  {p5.Vector} v2 the second <a href="#/p5.Vector">p5.Vector</a>
           * @return {Number}     the dot product
           */
          p5.Vector.dot = function dot(v1, v2) {
            return v1.dot(v2);
          };

          /**
           * Calculates the cross product of two vectors.
           */
          /**
           * @method cross
           * @static
           * @param  {p5.Vector} v1 the first <a href="#/p5.Vector">p5.Vector</a>
           * @param  {p5.Vector} v2 the second <a href="#/p5.Vector">p5.Vector</a>
           * @return {Number}     the cross product
           */
          p5.Vector.cross = function cross(v1, v2) {
            return v1.cross(v2);
          };

          /**
           * Calculates the Euclidean distance between two points (considering a
           * point as a vector object).
           */
          /**
           * @method dist
           * @static
           * @param  {p5.Vector} v1 the first <a href="#/p5.Vector">p5.Vector</a>
           * @param  {p5.Vector} v2 the second <a href="#/p5.Vector">p5.Vector</a>
           * @return {Number}     the distance
           */
          p5.Vector.dist = function dist(v1, v2) {
            return v1.dist(v2);
          };

          /**
           * Linear interpolate a vector to another vector and return the result as a
           * new vector.
           */
          /**
           * @method lerp
           * @static
           * @param {p5.Vector} v1
           * @param {p5.Vector} v2
           * @param {Number} amt
           * @param {p5.Vector} target if undefined a new vector will be created
           */
          /**
           * @method lerp
           * @static
           * @param {p5.Vector} v1
           * @param {p5.Vector} v2
           * @param {Number} amt
           * @return {Number}      the lerped value
           */
          p5.Vector.lerp = function lerp(v1, v2, amt, target) {
            if (!target) {
              target = v1.copy();
            } else {
              target.set(v1);
            }
            target.lerp(v2, amt);
            return target;
          };

          /**
           * @method mag
           * @param {p5.Vector} vecT the vector to return the magnitude of
           * @return {Number}        the magnitude of vecT
           * @static
           */
          p5.Vector.mag = function mag(vecT) {
            var x = vecT.x,
              y = vecT.y,
              z = vecT.z;
            var magSq = x * x + y * y + z * z;
            return Math.sqrt(magSq);
          };

          module.exports = p5.Vector;
        },
        { '../core/constants': 18, '../core/main': 24 }
      ],
      56: [
        function(_dereq_, module, exports) {
          /**
           * @module Math
           * @submodule Random
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');

          var seeded = false;
          var previous = false;
          var y2 = 0;

          // Linear Congruential Generator
          // Variant of a Lehman Generator
          var lcg = (function() {
            // Set to values from glibc(useb by GCC) (https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use)
            // m is basically chosen to be large (as it is the max period)
            // and for its relationships to a and c
            var m = 2147483647,
              // a - 1 should be divisible by m's prime factors
              a = 1103515245,
              // c and m should be co-prime
              c = 12345,
              seed,
              z;
            return {
              setSeed: function setSeed(val) {
                // pick a random seed if val is undefined or null
                // the >>> 0 casts the seed to an unsigned 32-bit integer
                z = seed = (val == null ? Math.random() * m : val) >>> 0;
              },
              getSeed: function getSeed() {
                return seed;
              },
              rand: function rand() {
                // define the recurrence relationship
                z = (a * z + c) % m;
                // return a float in [0, 1)
                // if z = m then z / m = 0 therefore (z % m) / m < 1 always
                return z / m;
              }
            };
          })();

          /**
           * Sets the seed value for <a href="#/p5/random">random()</a>.
           *
           * By default, <a href="#/p5/random">random()</a> produces different results each time the program
           * is run. Set the seed parameter to a constant to return the same
           * pseudo-random numbers each time the software is run.
           *
           * @method randomSeed
           * @param {Number} seed   the seed value
           * @example
           * <div>
           * <code>
           * randomSeed(99);
           * for (let i = 0; i < 100; i++) {
           *   let r = random(0, 255);
           *   stroke(r);
           *   line(i, 0, i, 100);
           * }
           * </code>
           * </div>
           *
           * @alt
           * many vertical lines drawn in white, black or grey.
           *
           */
          p5.prototype.randomSeed = function(seed) {
            lcg.setSeed(seed);
            seeded = true;
            previous = false;
          };

          /**
           * Return a random floating-point number.
           *
           * Takes either 0, 1 or 2 arguments.
           *
           * If no argument is given, returns a random number from 0
           * up to (but not including) 1.
           *
           * If one argument is given and it is a number, returns a random number from 0
           * up to (but not including) the number.
           *
           * If one argument is given and it is an array, returns a random element from
           * that array.
           *
           * If two arguments are given, returns a random number from the
           * first argument up to (but not including) the second argument.
           *
           * @method random
           * @param  {Number} [min]   the lower bound (inclusive)
           * @param  {Number} [max]   the upper bound (exclusive)
           * @return {Number} the random number
           * @example
           * <div>
           * <code>
           * for (let i = 0; i < 100; i++) {
           *   let r = random(50);
           *   stroke(r * 5);
           *   line(50, i, 50 + r, i);
           * }
           * </code>
           * </div>
           * <div>
           * <code>
           * for (let i = 0; i < 100; i++) {
           *   let r = random(-50, 50);
           *   line(50, i, 50 + r, i);
           * }
           * </code>
           * </div>
           * <div>
           * <code>
           * // Get a random element from an array using the random(Array) syntax
           * let words = ['apple', 'bear', 'cat', 'dog'];
           * let word = random(words); // select random word
           * text(word, 10, 50); // draw the word
           * </code>
           * </div>
           *
           * @alt
           * 100 horizontal lines from center canvas to right. size+fill change each time
           * 100 horizontal lines from center of canvas. height & side change each render
           * word displayed at random. Either apple, bear, cat, or dog
           *
           */
          /**
           * @method random
           * @param  {Array} choices   the array to choose from
           * @return {*} the random element from the array
           * @example
           */
          p5.prototype.random = function(min, max) {
            var rand;

            if (seeded) {
              rand = lcg.rand();
            } else {
              rand = Math.random();
            }
            if (typeof min === 'undefined') {
              return rand;
            } else if (typeof max === 'undefined') {
              if (min instanceof Array) {
                return min[Math.floor(rand * min.length)];
              } else {
                return rand * min;
              }
            } else {
              if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
              }

              return rand * (max - min) + min;
            }
          };

          /**
           *
           * Returns a random number fitting a Gaussian, or
           * normal, distribution. There is theoretically no minimum or maximum
           * value that <a href="#/p5/randomGaussian">randomGaussian()</a> might return. Rather, there is
           * just a very low probability that values far from the mean will be
           * returned; and a higher probability that numbers near the mean will
           * be returned.
           * <br><br>
           * Takes either 0, 1 or 2 arguments.<br>
           * If no args, returns a mean of 0 and standard deviation of 1.<br>
           * If one arg, that arg is the mean (standard deviation is 1).<br>
           * If two args, first is mean, second is standard deviation.
           *
           * @method randomGaussian
           * @param  {Number} mean  the mean
           * @param  {Number} sd    the standard deviation
           * @return {Number} the random number
           * @example
           * <div>
           * <code>
           * for (let y = 0; y < 100; y++) {
           *   let x = randomGaussian(50, 15);
           *   line(50, y, x, y);
           * }
           * </code>
           * </div>
           * <div>
           * <code>
           * let distribution = new Array(360);
           *
           * function setup() {
           *   createCanvas(100, 100);
           *   for (let i = 0; i < distribution.length; i++) {
           *     distribution[i] = floor(randomGaussian(0, 15));
           *   }
           * }
           *
           * function draw() {
           *   background(204);
           *
           *   translate(width / 2, width / 2);
           *
           *   for (let i = 0; i < distribution.length; i++) {
           *     rotate(TWO_PI / distribution.length);
           *     stroke(0);
           *     let dist = abs(distribution[i]);
           *     line(0, 0, dist, 0);
           *   }
           * }
           * </code>
           * </div>
           * @alt
           * 100 horizontal lines from center of canvas. height & side change each render
           * black lines radiate from center of canvas. size determined each render
           */
          p5.prototype.randomGaussian = function(mean, sd) {
            var y1, x1, x2, w;
            if (previous) {
              y1 = y2;
              previous = false;
            } else {
              do {
                x1 = this.random(2) - 1;
                x2 = this.random(2) - 1;
                w = x1 * x1 + x2 * x2;
              } while (w >= 1);
              w = Math.sqrt(-2 * Math.log(w) / w);
              y1 = x1 * w;
              y2 = x2 * w;
              previous = true;
            }

            var m = mean || 0;
            var s = sd || 1;
            return y1 * s + m;
          };

          module.exports = p5;
        },
        { '../core/main': 24 }
      ],
      57: [
        function(_dereq_, module, exports) {
          /**
           * @module Math
           * @submodule Trigonometry
           * @for p5
           * @requires core
           * @requires constants
           */

          'use strict';

          var p5 = _dereq_('../core/main');
          var constants = _dereq_('../core/constants');

          /*
                                               * all DEGREES/RADIANS conversion should be done in the p5 instance
                                               * if possible, using the p5._toRadians(), p5._fromRadians() methods.
                                               */
          p5.prototype._angleMode = constants.RADIANS;

          /**
           * The inverse of <a href="#/p5/cos">cos()</a>, returns the arc cosine of a value. This function
           * expects the values in the range of -1 to 1 and values are returned in
           * the range 0 to PI (3.1415927).
           *
           * @method acos
           * @param  {Number} value the value whose arc cosine is to be returned
           * @return {Number}       the arc cosine of the given value
           *
           * @example
           * <div class= “norender">
           * <code>
           * let a = PI;
           * let c = cos(a);
           * let ac = acos(c);
           * // Prints: "3.1415927 : -1.0 : 3.1415927"
           * print(a + ' : ' + c + ' : ' + ac);
           * </code>
           * </div>
           *
           * <div class= “norender">
           * <code>
           * let a = PI + PI / 4.0;
           * let c = cos(a);
           * let ac = acos(c);
           * // Prints: "3.926991 : -0.70710665 : 2.3561943"
           * print(a + ' : ' + c + ' : ' + ac);
           * </code>
           * </div>
           */
          p5.prototype.acos = function(ratio) {
            return this._fromRadians(Math.acos(ratio));
          };

          /**
           * The inverse of <a href="#/p5/sin">sin()</a>, returns the arc sine of a value. This function
           * expects the values in the range of -1 to 1 and values are returned
           * in the range -PI/2 to PI/2.
           *
           * @method asin
           * @param  {Number} value the value whose arc sine is to be returned
           * @return {Number}       the arc sine of the given value
           *
           * @example
           * <div class= “norender">
           * <code>
           * let a = PI + PI / 3;
           * let s = sin(a);
           * let as = asin(s);
           * // Prints: "1.0471976 : 0.86602545 : 1.0471976"
           * print(a + ' : ' + s + ' : ' + as);
           * </code>
           * </div>
           *
           * <div class= “norender">
           * <code>
           * let a = PI + PI / 3.0;
           * let s = sin(a);
           * let as = asin(s);
           * // Prints: "4.1887903 : -0.86602545 : -1.0471976"
           * print(a + ' : ' + s + ' : ' + as);
           * </code>
           * </div>
           *
           */
          p5.prototype.asin = function(ratio) {
            return this._fromRadians(Math.asin(ratio));
          };

          /**
           * The inverse of <a href="#/p5/tan">tan()</a>, returns the arc tangent of a value. This function
           * expects the values in the range of -Infinity to Infinity (exclusive) and
           * values are returned in the range -PI/2 to PI/2.
           *
           * @method atan
           * @param  {Number} value the value whose arc tangent is to be returned
           * @return {Number}       the arc tangent of the given value
           *
           * @example
           * <div class= “norender">
           * <code>
           * let a = PI + PI / 3;
           * let t = tan(a);
           * let at = atan(t);
           * // Prints: "1.0471976 : 1.7320509 : 1.0471976"
           * print(a + ' : ' + t + ' : ' + at);
           * </code>
           * </div>
           *
           * <div class= “norender">
           * <code>
           * let a = PI + PI / 3.0;
           * let t = tan(a);
           * let at = atan(t);
           * // Prints: "4.1887903 : 1.7320513 : 1.0471977"
           * print(a + ' : ' + t + ' : ' + at);
           * </code>
           * </div>
           *
           */
          p5.prototype.atan = function(ratio) {
            return this._fromRadians(Math.atan(ratio));
          };

          /**
           * Calculates the angle (in radians) from a specified point to the coordinate
           * origin as measured from the positive x-axis. Values are returned as a
           * float in the range from PI to -PI. The atan2<a href="#/p5/">()</a> function is most often used
           * for orienting geometry to the position of the cursor.
           * <br><br>
           * Note: The y-coordinate of the point is the first parameter, and the
           * x-coordinate is the second parameter, due the the structure of calculating
           * the tangent.
           *
           * @method atan2
           * @param  {Number} y y-coordinate of the point
           * @param  {Number} x x-coordinate of the point
           * @return {Number}   the arc tangent of the given point
           *
           * @example
           * <div>
           * <code>
           * function draw() {
           *   background(204);
           *   translate(width / 2, height / 2);
           *   let a = atan2(mouseY - height / 2, mouseX - width / 2);
           *   rotate(a);
           *   rect(-30, -5, 60, 10);
           * }
           * </code>
           * </div>
           *
           * @alt
           * 60 by 10 rect at center of canvas rotates with mouse movements
           *
           */
          p5.prototype.atan2 = function(y, x) {
            return this._fromRadians(Math.atan2(y, x));
          };

          /**
           * Calculates the cosine of an angle. This function takes into account the
           * current <a href="#/p5/angleMode">angleMode</a>. Values are returned in the range -1 to 1.
           *
           * @method cos
           * @param  {Number} angle the angle
           * @return {Number}       the cosine of the angle
           *
           * @example
           * <div>
           * <code>
           * let a = 0.0;
           * let inc = TWO_PI / 25.0;
           * for (let i = 0; i < 25; i++) {
           *   line(i * 4, 50, i * 4, 50 + cos(a) * 40.0);
           *   a = a + inc;
           * }
           * </code>
           * </div>
           *
           * @alt
           * vertical black lines form wave patterns, extend-down on left and right side
           *
           */
          p5.prototype.cos = function(angle) {
            return Math.cos(this._toRadians(angle));
          };

          /**
           * Calculates the sine of an angle. This function takes into account the
           * current <a href="#/p5/angleMode">angleMode</a>. Values are returned in the range -1 to 1.
           *
           * @method sin
           * @param  {Number} angle the angle
           * @return {Number}       the sine of the angle
           *
           * @example
           * <div>
           * <code>
           * let a = 0.0;
           * let inc = TWO_PI / 25.0;
           * for (let i = 0; i < 25; i++) {
           *   line(i * 4, 50, i * 4, 50 + sin(a) * 40.0);
           *   a = a + inc;
           * }
           * </code>
           * </div>
           *
           * @alt
           * vertical black lines extend down and up from center to form wave pattern
           *
           */
          p5.prototype.sin = function(angle) {
            return Math.sin(this._toRadians(angle));
          };

          /**
           * Calculates the tangent of an angle. This function takes into account
           * the current <a href="#/p5/angleMode">angleMode</a>. Values are returned in the range -1 to 1.
           *
           * @method tan
           * @param  {Number} angle the angle
           * @return {Number}       the tangent of the angle
           *
           * @example
           * <div>
           * <code>
           * let a = 0.0;
           * let inc = TWO_PI / 50.0;
           * for (let i = 0; i < 100; i = i + 2) {
           *   line(i, 50, i, 50 + tan(a) * 2.0);
           *   a = a + inc;
           * }
           * </code>
           *
           *
           * @alt
           * vertical black lines end down and up from center to form spike pattern
           *
           */
          p5.prototype.tan = function(angle) {
            return Math.tan(this._toRadians(angle));
          };

          /**
           * Converts a radian measurement to its corresponding value in degrees.
           * Radians and degrees are two ways of measuring the same thing. There are
           * 360 degrees in a circle and 2*PI radians in a circle. For example,
           * 90° = PI/2 = 1.5707964. This function does not take into account the
           * current <a href="#/p5/angleMode">angleMode</a>.
           *
           * @method degrees
           * @param  {Number} radians the radians value to convert to degrees
           * @return {Number}         the converted angle
           *
           *
           * @example
           * <div class= “norender">
           * <code>
           * let rad = PI / 4;
           * let deg = degrees(rad);
           * print(rad + ' radians is ' + deg + ' degrees');
           * // Prints: 0.7853981633974483 radians is 45 degrees
           * </code>
           * </div>
           *
           */
          p5.prototype.degrees = function(angle) {
            return angle * constants.RAD_TO_DEG;
          };

          /**
           * Converts a degree measurement to its corresponding value in radians.
           * Radians and degrees are two ways of measuring the same thing. There are
           * 360 degrees in a circle and 2*PI radians in a circle. For example,
           * 90° = PI/2 = 1.5707964. This function does not take into account the
           * current <a href="#/p5/angleMode">angleMode</a>.
           *
           * @method radians
           * @param  {Number} degrees the degree value to convert to radians
           * @return {Number}         the converted angle
           *
           * @example
           * <div class= “norender">
           * <code>
           * let deg = 45.0;
           * let rad = radians(deg);
           * print(deg + ' degrees is ' + rad + ' radians');
           * // Prints: 45 degrees is 0.7853981633974483 radians
           * </code>
           * </div>
           */
          p5.prototype.radians = function(angle) {
            return angle * constants.DEG_TO_RAD;
          };

          /**
           * Sets the current mode of p5 to given mode. Default mode is RADIANS.
           *
           * @method angleMode
           * @param {Constant} mode either RADIANS or DEGREES
           *
           * @example
           * <div>
           * <code>
           * function draw() {
           *   background(204);
           *   angleMode(DEGREES); // Change the mode to DEGREES
           *   let a = atan2(mouseY - height / 2, mouseX - width / 2);
           *   translate(width / 2, height / 2);
           *   push();
           *   rotate(a);
           *   rect(-20, -5, 40, 10); // Larger rectangle is rotating in degrees
           *   pop();
           *   angleMode(RADIANS); // Change the mode to RADIANS
           *   rotate(a); // variable a stays the same
           *   rect(-40, -5, 20, 10); // Smaller rectangle is rotating in radians
           * }
           * </code>
           * </div>
           *
           * @alt
           * 40 by 10 rect in center rotates with mouse moves. 20 by 10 rect moves faster.
           *
           *
           */
          p5.prototype.angleMode = function(mode) {
            if (mode === constants.DEGREES || mode === constants.RADIANS) {
              this._angleMode = mode;
            }
          };

          /**
           * converts angles from the current angleMode to RADIANS
           *
           * @method _toRadians
           * @private
           * @param {Number} angle
           * @returns {Number}
           */
          p5.prototype._toRadians = function(angle) {
            if (this._angleMode === constants.DEGREES) {
              return angle * constants.DEG_TO_RAD;
            }
            return angle;
          };

          /**
           * converts angles from the current angleMode to DEGREES
           *
           * @method _toDegrees
           * @private
           * @param {Number} angle
           * @returns {Number}
           */
          p5.prototype._toDegrees = function(angle) {
            if (this._angleMode === constants.RADIANS) {
              return angle * constants.RAD_TO_DEG;
            }
            return angle;
          };

          /**
           * converts angles from RADIANS into the current angleMode
           *
           * @method _fromRadians
           * @private
           * @param {Number} angle
           * @returns {Number}
           */
          p5.prototype._fromRadians = function(angle) {
            if (this._angleMode === constants.DEGREES) {
              return angle * constants.RAD_TO_DEG;
            }
            return angle;
          };

          module.exports = p5;
        },
        { '../core/constants': 18, '../core/main': 24 }
      ],
      58: [
        function(_dereq_, module, exports) {
          /**
           * @module Typography
           * @submodule Attributes
           * @for p5
           * @requires core
           * @requires constants
           */

          'use strict';

          var p5 = _dereq_('../core/main');

          /**
           * Sets the current alignment for drawing text. Accepts two
           * arguments: horizAlign (LEFT, CENTER, or RIGHT) and
           * vertAlign (TOP, BOTTOM, CENTER, or BASELINE).
           *
           * The horizAlign parameter is in reference to the x value
           * of the <a href="#/p5/text">text()</a> function, while the vertAlign parameter is
           * in reference to the y value.
           *
           * So if you write textAlign(LEFT), you are aligning the left
           * edge of your text to the x value you give in <a href="#/p5/text">text()</a>. If you
           * write textAlign(RIGHT, TOP), you are aligning the right edge
           * of your text to the x value and the top of edge of the text
           * to the y value.
           *
           * @method textAlign
           * @param {Constant} horizAlign horizontal alignment, either LEFT,
           *                            CENTER, or RIGHT
           * @param {Constant} [vertAlign] vertical alignment, either TOP,
           *                            BOTTOM, CENTER, or BASELINE
           * @chainable
           * @example
           * <div>
           * <code>
           * textSize(16);
           * textAlign(RIGHT);
           * text('ABCD', 50, 30);
           * textAlign(CENTER);
           * text('EFGH', 50, 50);
           * textAlign(LEFT);
           * text('IJKL', 50, 70);
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * textSize(16);
           * strokeWeight(0.5);
           *
           * line(0, 12, width, 12);
           * textAlign(CENTER, TOP);
           * text('TOP', 0, 12, width);
           *
           * line(0, 37, width, 37);
           * textAlign(CENTER, CENTER);
           * text('CENTER', 0, 37, width);
           *
           * line(0, 62, width, 62);
           * textAlign(CENTER, BASELINE);
           * text('BASELINE', 0, 62, width);
           *
           * line(0, 87, width, 87);
           * textAlign(CENTER, BOTTOM);
           * text('BOTTOM', 0, 87, width);
           * </code>
           * </div>
           *
           * @alt
           *Letters ABCD displayed at top right, EFGH at center and IJKL at bottom left.
           * The names of the four vertical alignments rendered each showing that alignment's placement relative to a horizontal line.
           *
           */
          /**
           * @method textAlign
           * @return {Object}
           */
          p5.prototype.textAlign = function(horizAlign, vertAlign) {
            p5._validateParameters('textAlign', arguments);
            return this._renderer.textAlign.apply(this._renderer, arguments);
          };

          /**
           * Sets/gets the spacing, in pixels, between lines of text. This
           * setting will be used in all subsequent calls to the <a href="#/p5/text">text()</a> function.
           *
           * @method textLeading
           * @param {Number} leading the size in pixels for spacing between lines
           * @chainable
           *
           * @example
           * <div>
           * <code>
           * // Text to display. The "\n" is a "new line" character
           * let lines = 'L1\nL2\nL3';
           * textSize(12);
           *
           * textLeading(10); // Set leading to 10
           * text(lines, 10, 25);
           *
           * textLeading(20); // Set leading to 20
           * text(lines, 40, 25);
           *
           * textLeading(30); // Set leading to 30
           * text(lines, 70, 25);
           * </code>
           * </div>
           *
           * @alt
           *set L1 L2 & L3 displayed vertically 3 times. spacing increases for each set
           */
          /**
           * @method textLeading
           * @return {Number}
           */
          p5.prototype.textLeading = function(theLeading) {
            p5._validateParameters('textLeading', arguments);
            return this._renderer.textLeading.apply(this._renderer, arguments);
          };

          /**
           * Sets/gets the current font size. This size will be used in all subsequent
           * calls to the <a href="#/p5/text">text()</a> function. Font size is measured in pixels.
           *
           * @method textSize
           * @param {Number} theSize the size of the letters in units of pixels
           * @chainable
           *
           * @example
           * <div>
           * <code>
           * textSize(12);
           * text('Font Size 12', 10, 30);
           * textSize(14);
           * text('Font Size 14', 10, 60);
           * textSize(16);
           * text('Font Size 16', 10, 90);
           * </code>
           * </div>
           *
           * @alt
           *Font Size 12 displayed small, Font Size 14 medium & Font Size 16 large
           */
          /**
           * @method textSize
           * @return {Number}
           */
          p5.prototype.textSize = function(theSize) {
            p5._validateParameters('textSize', arguments);
            return this._renderer.textSize.apply(this._renderer, arguments);
          };

          /**
           * Sets/gets the style of the text for system fonts to NORMAL, ITALIC, BOLD or BOLDITALIC.
           * Note: this may be is overridden by CSS styling. For non-system fonts
           * (opentype, truetype, etc.) please load styled fonts instead.
           *
           * @method textStyle
           * @param {Constant} theStyle styling for text, either NORMAL,
           *                            ITALIC, BOLD or BOLDITALIC
           * @chainable
           * @example
           * <div>
           * <code>
           * strokeWeight(0);
           * textSize(12);
           * textStyle(NORMAL);
           * text('Font Style Normal', 10, 15);
           * textStyle(ITALIC);
           * text('Font Style Italic', 10, 40);
           * textStyle(BOLD);
           * text('Font Style Bold', 10, 65);
           * textStyle(BOLDITALIC);
           * text('Font Style Bold Italic', 10, 90);
           * </code>
           * </div>
           *
           * @alt
           *words Font Style Normal displayed normally, Italic in italic, bold in bold and bold italic in bold italics.
           */
          /**
           * @method textStyle
           * @return {String}
           */
          p5.prototype.textStyle = function(theStyle) {
            p5._validateParameters('textStyle', arguments);
            return this._renderer.textStyle.apply(this._renderer, arguments);
          };

          /**
           * Calculates and returns the width of any character or text string.
           *
           * @method textWidth
           * @param {String} theText the String of characters to measure
           * @return {Number}
           * @example
           * <div>
           * <code>
           * textSize(28);
           *
           * let aChar = 'P';
           * let cWidth = textWidth(aChar);
           * text(aChar, 0, 40);
           * line(cWidth, 0, cWidth, 50);
           *
           * let aString = 'p5.js';
           * let sWidth = textWidth(aString);
           * text(aString, 0, 85);
           * line(sWidth, 50, sWidth, 100);
           * </code>
           * </div>
           *
           * @alt
           *Letter P and p5.js are displayed with vertical lines at end. P is wide
           *
           */
          p5.prototype.textWidth = function(theText) {
            p5._validateParameters('textWidth', arguments);
            if (theText.length === 0) {
              return 0;
            }
            return this._renderer.textWidth.apply(this._renderer, arguments);
          };

          /**
           * Returns the ascent of the current font at its current size. The ascent
           * represents the distance, in pixels, of the tallest character above
           * the baseline.
           * @method textAscent
           * @return {Number}
           * @example
           * <div>
           * <code>
           * let base = height * 0.75;
           * let scalar = 0.8; // Different for each font
           *
           * textSize(32); // Set initial text size
           * let asc = textAscent() * scalar; // Calc ascent
           * line(0, base - asc, width, base - asc);
           * text('dp', 0, base); // Draw text on baseline
           *
           * textSize(64); // Increase text size
           * asc = textAscent() * scalar; // Recalc ascent
           * line(40, base - asc, width, base - asc);
           * text('dp', 40, base); // Draw text on baseline
           * </code>
           * </div>
           */
          p5.prototype.textAscent = function() {
            p5._validateParameters('textAscent', arguments);
            return this._renderer.textAscent();
          };

          /**
           * Returns the descent of the current font at its current size. The descent
           * represents the distance, in pixels, of the character with the longest
           * descender below the baseline.
           * @method textDescent
           * @return {Number}
           * @example
           * <div>
           * <code>
           * let base = height * 0.75;
           * let scalar = 0.8; // Different for each font
           *
           * textSize(32); // Set initial text size
           * let desc = textDescent() * scalar; // Calc ascent
           * line(0, base + desc, width, base + desc);
           * text('dp', 0, base); // Draw text on baseline
           *
           * textSize(64); // Increase text size
           * desc = textDescent() * scalar; // Recalc ascent
           * line(40, base + desc, width, base + desc);
           * text('dp', 40, base); // Draw text on baseline
           * </code>
           * </div>
           */
          p5.prototype.textDescent = function() {
            p5._validateParameters('textDescent', arguments);
            return this._renderer.textDescent();
          };

          /**
           * Helper function to measure ascent and descent.
           */
          p5.prototype._updateTextMetrics = function() {
            return this._renderer._updateTextMetrics();
          };

          module.exports = p5;
        },
        { '../core/main': 24 }
      ],
      59: [
        function(_dereq_, module, exports) {
          /**
           * @module Typography
           * @submodule Loading & Displaying
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');
          var constants = _dereq_('../core/constants');
          var opentype = _dereq_('opentype.js');

          _dereq_('../core/error_helpers');

          /**
           * Loads an opentype font file (.otf, .ttf) from a file or a URL,
           * and returns a PFont Object. This method is asynchronous,
           * meaning it may not finish before the next line in your sketch
           * is executed.
           * <br><br>
           * The path to the font should be relative to the HTML file
           * that links in your sketch. Loading fonts from a URL or other
           * remote location may be blocked due to your browser's built-in
           * security.
           *
           * @method loadFont
           * @param  {String}        path       name of the file or url to load
           * @param  {Function}      [callback] function to be executed after
           *                                    <a href="#/p5/loadFont">loadFont()</a> completes
           * @param  {Function}      [onError]  function to be executed if
           *                                    an error occurs
           * @return {p5.Font}                  <a href="#/p5.Font">p5.Font</a> object
           * @example
           *
           * <p>Calling loadFont() inside <a href="#/p5/preload">preload()</a> guarantees that the load
           * operation will have completed before <a href="#/p5/setup">setup()</a> and <a href="#/p5/draw">draw()</a> are called.</p>
           *
           * <div><code>
           * let myFont;
           * function preload() {
           *   myFont = loadFont('assets/inconsolata.otf');
           * }
           *
           * function setup() {
           *   fill('#ED225D');
           *   textFont(myFont);
           *   textSize(36);
           *   text('p5*js', 10, 50);
           * }
           * </code></div>
           *
           * Outside of <a href="#/p5/preload">preload()</a>, you may supply a callback function to handle the
           * object:
           *
           * <div><code>
           * function setup() {
           *   loadFont('assets/inconsolata.otf', drawText);
           * }
           *
           * function drawText(font) {
           *   fill('#ED225D');
           *   textFont(font, 36);
           *   text('p5*js', 10, 50);
           * }
           * </code></div>
           *
           * <p>You can also use the font filename string (without the file extension) to style other HTML
           * elements.</p>
           *
           * <div><code>
           * function preload() {
           *   loadFont('assets/inconsolata.otf');
           * }
           *
           * function setup() {
           *   let myDiv = createDiv('hello there');
           *   myDiv.style('font-family', 'Inconsolata');
           * }
           * </code></div>
           *
           * @alt
           * p5*js in p5's theme dark pink
           * p5*js in p5's theme dark pink
           *
           */
          p5.prototype.loadFont = function(path, onSuccess, onError) {
            p5._validateParameters('loadFont', arguments);
            var p5Font = new p5.Font(this);

            var self = this;
            opentype.load(path, function(err, font) {
              if (err) {
                p5._friendlyFileLoadError(4, path);
                if (typeof onError !== 'undefined') {
                  return onError(err);
                }
                console.error(err, path);
                return;
              }

              p5Font.font = font;

              if (typeof onSuccess !== 'undefined') {
                onSuccess(p5Font);
              }

              self._decrementPreload();

              // check that we have an acceptable font type
              var validFontTypes = ['ttf', 'otf', 'woff', 'woff2'],
                fileNoPath = path
                  .split('\\')
                  .pop()
                  .split('/')
                  .pop(),
                lastDotIdx = fileNoPath.lastIndexOf('.'),
                fontFamily,
                newStyle,
                fileExt = lastDotIdx < 1 ? null : fileNoPath.substr(lastDotIdx + 1);

              // if so, add it to the DOM (name-only) for use with p5.dom
              if (validFontTypes.indexOf(fileExt) > -1) {
                fontFamily = fileNoPath.substr(0, lastDotIdx);
                newStyle = document.createElement('style');
                newStyle.appendChild(
                  document.createTextNode(
                    '\n@font-face {' +
                      '\nfont-family: ' +
                      fontFamily +
                      ';\nsrc: url(' +
                      path +
                      ');\n}\n'
                  )
                );

                document.head.appendChild(newStyle);
              }
            });

            return p5Font;
          };

          /**
           * Draws text to the screen. Displays the information specified in the first
           * parameter on the screen in the position specified by the additional
           * parameters. A default font will be used unless a font is set with the
           * <a href="#/p5/textFont">textFont()</a> function and a default size will be used unless a font is set
           * with <a href="#/p5/textSize">textSize()</a>. Change the color of the text with the <a href="#/p5/fill">fill()</a> function.
           * Change the outline of the text with the <a href="#/p5/stroke">stroke()</a> and <a href="#/p5/strokeWeight">strokeWeight()</a>
           * functions.
           * <br><br>
           * The text displays in relation to the <a href="#/p5/textAlign">textAlign()</a> function, which gives the
           * option to draw to the left, right, and center of the coordinates.
           * <br><br>
           * The x2 and y2 parameters define a rectangular area to display within and
           * may only be used with string data. When these parameters are specified,
           * they are interpreted based on the current <a href="#/p5/rectMode">rectMode()</a> setting. Text that
           * does not fit completely within the rectangle specified will not be drawn
           * to the screen. If x2 and y2 are not specified, the baseline alignment is the
           * default, which means that the text will be drawn upwards from x and y.
           * <br><br>
           * <b>WEBGL</b>: Only opentype/truetype fonts are supported. You must load a font using the
           * <a href="#/p5/loadFont">loadFont()</a> method (see the example above).
           * <a href="#/p5/stroke">stroke()</a> currently has no effect in webgl mode.
           *
           * @method text
           * @param {String|Object|Array|Number|Boolean} str the alphanumeric
           *                                             symbols to be displayed
           * @param {Number} x   x-coordinate of text
           * @param {Number} y   y-coordinate of text
           * @param {Number} [x2]  by default, the width of the text box,
           *                     see <a href="#/p5/rectMode">rectMode()</a> for more info
           * @param {Number} [y2]  by default, the height of the text box,
           *                     see <a href="#/p5/rectMode">rectMode()</a> for more info
           * @chainable
           * @example
           * <div>
           * <code>
           * textSize(32);
           * text('word', 10, 30);
           * fill(0, 102, 153);
           * text('word', 10, 60);
           * fill(0, 102, 153, 51);
           * text('word', 10, 90);
           * </code>
           * </div>
           * <div>
           * <code>
           * let s = 'The quick brown fox jumped over the lazy dog.';
           * fill(50);
           * text(s, 10, 10, 70, 80); // Text wraps within text box
           * </code>
           * </div>
           *
           * <div modernizr='webgl'>
           * <code>
           * let inconsolata;
           * function preload() {
           *   inconsolata = loadFont('assets/inconsolata.otf');
           * }
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   textFont(inconsolata);
           *   textSize(width / 3);
           *   textAlign(CENTER, CENTER);
           * }
           * function draw() {
           *   background(0);
           *   let time = millis();
           *   rotateX(time / 1000);
           *   rotateZ(time / 1234);
           *   text('p5.js', 0, 0);
           * }
           * </code>
           * </div>
           *
           * @alt
           *'word' displayed 3 times going from black, blue to translucent blue
           * The quick brown fox jumped over the lazy dog.
           * the text 'p5.js' spinning in 3d
           *
           */
          p5.prototype.text = function(str, x, y, maxWidth, maxHeight) {
            p5._validateParameters('text', arguments);
            return !(this._renderer._doFill || this._renderer._doStroke)
              ? this
              : this._renderer.text.apply(this._renderer, arguments);
          };

          /**
    * Sets the current font that will be drawn with the <a href="#/p5/text">text()</a> function.
    * <br><br>
    * <b>WEBGL</b>: Only fonts loaded via <a href="#/p5/loadFont">loadFont()</a> are supported.
    *
    * @method textFont
    * @return {Object} the current font
    *
    * @example
    * <div>
    * <code>
    * fill(0);
    * textSize(12);
    * textFont('Georgia');
    * text('Georgia', 12, 30);
    * textFont('Helvetica');
    * text('Helvetica', 12, 60);
    * </code>
    * </div>
    * <div>
    * <code>
    * let fontRegular, fontItalic, fontBold;
    * function preload() {
    *   fontRegular = loadFont('assets/Regular.otf');
    *   fontItalic = loadFont('assets/Italic.ttf');
    *   fontBold = loadFont('assets/Bold.ttf');
    * }
    * function setup() {
    *   background(210);
    *   fill(0)
       .strokeWeight(0)
       .textSize(10);
    *   textFont(fontRegular);
    *   text('Font Style Normal', 10, 30);
    *   textFont(fontItalic);
    *   text('Font Style Italic', 10, 50);
    *   textFont(fontBold);
    *   text('Font Style Bold', 10, 70);
    * }
    * </code>
    * </div>
    *
    * @alt
    *words Font Style Normal displayed normally, Italic in italic and bold in bold
    */
          /**
           * @method textFont
           * @param {Object|String} font a font loaded via <a href="#/p5/loadFont">loadFont()</a>, or a String
           * representing a <a href="https://mzl.la/2dOw8WD">web safe font</a> (a font
           * that is generally available across all systems)
           * @param {Number} [size] the font size to use
           * @chainable
           */
          p5.prototype.textFont = function(theFont, theSize) {
            p5._validateParameters('textFont', arguments);
            if (arguments.length) {
              if (!theFont) {
                throw new Error('null font passed to textFont');
              }

              this._renderer._setProperty('_textFont', theFont);

              if (theSize) {
                this._renderer._setProperty('_textSize', theSize);
                this._renderer._setProperty(
                  '_textLeading',
                  theSize * constants._DEFAULT_LEADMULT
                );
              }

              return this._renderer._applyTextProperties();
            }

            return this._renderer._textFont;
          };

          module.exports = p5;
        },
        {
          '../core/constants': 18,
          '../core/error_helpers': 20,
          '../core/main': 24,
          'opentype.js': 10
        }
      ],
      60: [
        function(_dereq_, module, exports) {
          /**
           * This module defines the <a href="#/p5.Font">p5.Font</a> class and functions for
           * drawing text to the display canvas.
           * @module Typography
           * @submodule Font
           * @requires core
           * @requires constants
           */

          'use strict';
          function _typeof(obj) {
            if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
              _typeof = function _typeof(obj) {
                return typeof obj;
              };
            } else {
              _typeof = function _typeof(obj) {
                return obj &&
                  typeof Symbol === 'function' &&
                  obj.constructor === Symbol &&
                  obj !== Symbol.prototype
                  ? 'symbol'
                  : typeof obj;
              };
            }
            return _typeof(obj);
          }

          var p5 = _dereq_('../core/main');
          var constants = _dereq_('../core/constants');

          /**
           * Base class for font handling
           * @class p5.Font
           * @param {p5} [pInst] pointer to p5 instance
           */
          p5.Font = function(p) {
            this.parent = p;

            this.cache = {};

            /**
             * Underlying opentype font implementation
             * @property font
             */
            this.font = undefined;
          };

          /**
           * Returns a tight bounding box for the given text string using this
           * font (currently only supports single lines)
           *
           * @method textBounds
           * @param  {String} line     a line of text
           * @param  {Number} x        x-position
           * @param  {Number} y        y-position
           * @param  {Number} [fontSize] font size to use (optional) Default is 12.
           * @param  {Object} [options] opentype options (optional)
           *                            opentype fonts contains alignment and baseline options.
           *                            Default is 'LEFT' and 'alphabetic'
           *
           *
           * @return {Object}          a rectangle object with properties: x, y, w, h
           *
           * @example
           * <div>
           * <code>
           * let font;
           * let textString = 'Lorem ipsum dolor sit amet.';
           * function preload() {
           *   font = loadFont('./assets/Regular.otf');
           * }
           * function setup() {
           *   background(210);
           *
           *   let bbox = font.textBounds(textString, 10, 30, 12);
           *   fill(255);
           *   stroke(0);
           *   rect(bbox.x, bbox.y, bbox.w, bbox.h);
           *   fill(0);
           *   noStroke();
           *
           *   textFont(font);
           *   textSize(12);
           *   text(textString, 10, 30);
           * }
           * </code>
           * </div>
           *
           * @alt
           *words Lorem ipsum dol go off canvas and contained by white bounding box
           *
           */
          p5.Font.prototype.textBounds = function(str, x, y, fontSize, opts) {
            x = x !== undefined ? x : 0;
            y = y !== undefined ? y : 0;

            // Check cache for existing bounds. Take into consideration the text alignment
            // settings. Default alignment should match opentype's origin: left-aligned &
            // alphabetic baseline.
            var p = (opts && opts.renderer && opts.renderer._pInst) || this.parent,
              ctx = p._renderer.drawingContext,
              alignment = ctx.textAlign || constants.LEFT,
              baseline = ctx.textBaseline || constants.BASELINE,
              cacheResults = false,
              result,
              key;

            fontSize = fontSize || p._renderer._textSize;

            // NOTE: cache disabled for now pending further discussion of #3436
            if (cacheResults) {
              key = cacheKey('textBounds', str, x, y, fontSize, alignment, baseline);
              result = this.cache[key];
            }

            if (!result) {
              var minX,
                minY,
                maxX,
                maxY,
                pos,
                xCoords = [],
                yCoords = [],
                scale = this._scale(fontSize);

              this.font.forEachGlyph(str, x, y, fontSize, opts, function(
                glyph,
                gX,
                gY,
                gFontSize
              ) {
                var gm = glyph.getMetrics();
                xCoords.push(gX + gm.xMin * scale);
                xCoords.push(gX + gm.xMax * scale);
                yCoords.push(gY + -gm.yMin * scale);
                yCoords.push(gY + -gm.yMax * scale);
              });

              minX = Math.min.apply(null, xCoords);
              minY = Math.min.apply(null, yCoords);
              maxX = Math.max.apply(null, xCoords);
              maxY = Math.max.apply(null, yCoords);

              result = {
                x: minX,
                y: minY,
                h: maxY - minY,
                w: maxX - minX,
                advance: minX - x
              };

              // Bounds are now calculated, so shift the x & y to match alignment settings
              pos = this._handleAlignment(
                p._renderer,
                str,
                result.x,
                result.y,
                result.w + result.advance
              );

              result.x = pos.x;
              result.y = pos.y;

              if (cacheResults) {
                this.cache[key] = result;
              }
            }

            return result;
          };

          /**
           * Computes an array of points following the path for specified text
           *
           * @method textToPoints
           * @param  {String} txt     a line of text
           * @param  {Number} x        x-position
           * @param  {Number} y        y-position
           * @param  {Number} fontSize font size to use (optional)
           * @param  {Object} [options] an (optional) object that can contain:
           *
           * <br>sampleFactor - the ratio of path-length to number of samples
           * (default=.1); higher values yield more points and are therefore
           * more precise
           *
           * <br>simplifyThreshold - if set to a non-zero value, collinear points will be
           * be removed from the polygon; the value represents the threshold angle to use
           * when determining whether two edges are collinear
           *
           * @return {Array}  an array of points, each with x, y, alpha (the path angle)
           * @example
           * <div>
           * <code>
           * let font;
           * function preload() {
           *   font = loadFont('assets/inconsolata.otf');
           * }
           *
           * let points;
           * let bounds;
           * function setup() {
           *   createCanvas(100, 100);
           *   stroke(0);
           *   fill(255, 104, 204);
           *
           *   points = font.textToPoints('p5', 0, 0, 10, {
           *     sampleFactor: 5,
           *     simplifyThreshold: 0
           *   });
           *   bounds = font.textBounds(' p5 ', 0, 0, 10);
           * }
           *
           * function draw() {
           *   background(255);
           *   beginShape();
           *   translate(-bounds.x * width / bounds.w, -bounds.y * height / bounds.h);
           *   for (let i = 0; i < points.length; i++) {
           *     let p = points[i];
           *     vertex(
           *       p.x * width / bounds.w +
           *         sin(20 * p.y / bounds.h + millis() / 1000) * width / 30,
           *       p.y * height / bounds.h
           *     );
           *   }
           *   endShape(CLOSE);
           * }
           * </code>
           * </div>
           *
           */
          p5.Font.prototype.textToPoints = function(txt, x, y, fontSize, options) {
            var xoff = 0,
              result = [],
              glyphs = this._getGlyphs(txt);

            function isSpace(i) {
              return (
                (glyphs[i].name && glyphs[i].name === 'space') ||
                (txt.length === glyphs.length && txt[i] === ' ') ||
                (glyphs[i].index && glyphs[i].index === 3)
              );
            }

            fontSize = fontSize || this.parent._renderer._textSize;

            for (var i = 0; i < glyphs.length; i++) {
              if (!isSpace(i)) {
                // fix to #1817, #2069

                var gpath = glyphs[i].getPath(x, y, fontSize),
                  paths = splitPaths(gpath.commands);

                for (var j = 0; j < paths.length; j++) {
                  var pts = pathToPoints(paths[j], options);

                  for (var k = 0; k < pts.length; k++) {
                    pts[k].x += xoff;
                    result.push(pts[k]);
                  }
                }
              }

              xoff += glyphs[i].advanceWidth * this._scale(fontSize);
            }

            return result;
          };

          // ----------------------------- End API ------------------------------

          /**
           * Returns the set of opentype glyphs for the supplied string.
           *
           * Note that there is not a strict one-to-one mapping between characters
           * and glyphs, so the list of returned glyphs can be larger or smaller
           *  than the length of the given string.
           *
           * @private
           * @param  {String} str the string to be converted
           * @return {Array}     the opentype glyphs
           */
          p5.Font.prototype._getGlyphs = function(str) {
            return this.font.stringToGlyphs(str);
          };

          /**
           * Returns an opentype path for the supplied string and position.
           *
           * @private
           * @param  {String} line     a line of text
           * @param  {Number} x        x-position
           * @param  {Number} y        y-position
           * @param  {Object} options opentype options (optional)
           * @return {Object}     the opentype path
           */
          p5.Font.prototype._getPath = function(line, x, y, options) {
            var p = (options && options.renderer && options.renderer._pInst) || this.parent,
              renderer = p._renderer,
              pos = this._handleAlignment(renderer, line, x, y);

            return this.font.getPath(line, pos.x, pos.y, renderer._textSize, options);
          };

          /*
    * Creates an SVG-formatted path-data string
    * (See http://www.w3.org/TR/SVG/paths.html#PathData)
    * from the given opentype path or string/position
    *
    * @param  {Object} path    an opentype path, OR the following:
    *
    * @param  {String} line     a line of text
    * @param  {Number} x        x-position
    * @param  {Number} y        y-position
    * @param  {Object} options opentype options (optional), set options.decimals
    * to set the decimal precision of the path-data
    *
    * @return {Object}     this p5.Font object
    */
          p5.Font.prototype._getPathData = function(line, x, y, options) {
            var decimals = 3;

            // create path from string/position
            if (typeof line === 'string' && arguments.length > 2) {
              line = this._getPath(line, x, y, options);
            } else if (_typeof(x) === 'object') {
              // handle options specified in 2nd arg
              options = x;
            }

            // handle svg arguments
            if (options && typeof options.decimals === 'number') {
              decimals = options.decimals;
            }

            return line.toPathData(decimals);
          };

          /*
    * Creates an SVG <path> element, as a string,
    * from the given opentype path or string/position
    *
    * @param  {Object} path    an opentype path, OR the following:
    *
    * @param  {String} line     a line of text
    * @param  {Number} x        x-position
    * @param  {Number} y        y-position
    * @param  {Object} options opentype options (optional), set options.decimals
    * to set the decimal precision of the path-data in the <path> element,
    *  options.fill to set the fill color for the <path> element,
    *  options.stroke to set the stroke color for the <path> element,
    *  options.strokeWidth to set the strokeWidth for the <path> element.
    *
    * @return {Object}     this p5.Font object
    */
          p5.Font.prototype._getSVG = function(line, x, y, options) {
            var decimals = 3;

            // create path from string/position
            if (typeof line === 'string' && arguments.length > 2) {
              line = this._getPath(line, x, y, options);
            } else if (_typeof(x) === 'object') {
              // handle options specified in 2nd arg
              options = x;
            }

            // handle svg arguments
            if (options) {
              if (typeof options.decimals === 'number') {
                decimals = options.decimals;
              }
              if (typeof options.strokeWidth === 'number') {
                line.strokeWidth = options.strokeWidth;
              }
              if (typeof options.fill !== 'undefined') {
                line.fill = options.fill;
              }
              if (typeof options.stroke !== 'undefined') {
                line.stroke = options.stroke;
              }
            }

            return line.toSVG(decimals);
          };

          /*
    * Renders an opentype path or string/position
    * to the current graphics context
    *
    * @param  {Object} path    an opentype path, OR the following:
    *
    * @param  {String} line     a line of text
    * @param  {Number} x        x-position
    * @param  {Number} y        y-position
    * @param  {Object} options opentype options (optional)
    *
    * @return {p5.Font}     this p5.Font object
    */
          p5.Font.prototype._renderPath = function(line, x, y, options) {
            var pdata,
              pg = (options && options.renderer) || this.parent._renderer,
              ctx = pg.drawingContext;

            if (_typeof(line) === 'object' && line.commands) {
              pdata = line.commands;
            } else {
              //pos = handleAlignment(p, ctx, line, x, y);
              pdata = this._getPath(line, x, y, options).commands;
            }

            ctx.beginPath();
            for (var i = 0; i < pdata.length; i += 1) {
              var cmd = pdata[i];
              if (cmd.type === 'M') {
                ctx.moveTo(cmd.x, cmd.y);
              } else if (cmd.type === 'L') {
                ctx.lineTo(cmd.x, cmd.y);
              } else if (cmd.type === 'C') {
                ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
              } else if (cmd.type === 'Q') {
                ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
              } else if (cmd.type === 'Z') {
                ctx.closePath();
              }
            }

            // only draw stroke if manually set by user
            if (pg._doStroke && pg._strokeSet) {
              ctx.stroke();
            }

            if (pg._doFill) {
              // if fill hasn't been set by user, use default-text-fill
              if (!pg._fillSet) {
                pg._setFill(constants._DEFAULT_TEXT_FILL);
              }
              ctx.fill();
            }

            return this;
          };

          p5.Font.prototype._textWidth = function(str, fontSize) {
            return this.font.getAdvanceWidth(str, fontSize);
          };

          p5.Font.prototype._textAscent = function(fontSize) {
            return this.font.ascender * this._scale(fontSize);
          };

          p5.Font.prototype._textDescent = function(fontSize) {
            return -this.font.descender * this._scale(fontSize);
          };

          p5.Font.prototype._scale = function(fontSize) {
            return 1 / this.font.unitsPerEm * (fontSize || this.parent._renderer._textSize);
          };

          p5.Font.prototype._handleAlignment = function(renderer, line, x, y, textWidth) {
            var fontSize = renderer._textSize;

            if (typeof textWidth === 'undefined') {
              textWidth = this._textWidth(line, fontSize);
            }

            switch (renderer._textAlign) {
              case constants.CENTER:
                x -= textWidth / 2;
                break;
              case constants.RIGHT:
                x -= textWidth;
                break;
            }

            switch (renderer._textBaseline) {
              case constants.TOP:
                y += this._textAscent(fontSize);
                break;
              case constants.CENTER:
                y += this._textAscent(fontSize) / 2;
                break;
              case constants.BOTTOM:
                y -= this._textDescent(fontSize);
                break;
            }

            return { x: x, y: y };
          };

          // path-utils

          function pathToPoints(cmds, options) {
            var opts = parseOpts(options, {
              sampleFactor: 0.1,
              simplifyThreshold: 0
            });

            var len = pointAtLength(cmds, 0, 1), // total-length
              t = len / (len * opts.sampleFactor),
              pts = [];

            for (var i = 0; i < len; i += t) {
              pts.push(pointAtLength(cmds, i));
            }

            if (opts.simplifyThreshold) {
              simplify(pts, opts.simplifyThreshold);
            }

            return pts;
          }

          function simplify(pts, angle) {
            angle = typeof angle === 'undefined' ? 0 : angle;

            var num = 0;
            for (var i = pts.length - 1; pts.length > 3 && i >= 0; --i) {
              if (collinear(at(pts, i - 1), at(pts, i), at(pts, i + 1), angle)) {
                // Remove the middle point
                pts.splice(i % pts.length, 1);
                num++;
              }
            }
            return num;
          }

          function splitPaths(cmds) {
            var paths = [],
              current;
            for (var i = 0; i < cmds.length; i++) {
              if (cmds[i].type === 'M') {
                if (current) {
                  paths.push(current);
                }
                current = [];
              }
              current.push(cmdToArr(cmds[i]));
            }
            paths.push(current);

            return paths;
          }

          function cmdToArr(cmd) {
            var arr = [cmd.type];
            if (cmd.type === 'M' || cmd.type === 'L') {
              // moveto or lineto
              arr.push(cmd.x, cmd.y);
            } else if (cmd.type === 'C') {
              arr.push(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
            } else if (cmd.type === 'Q') {
              arr.push(cmd.x1, cmd.y1, cmd.x, cmd.y);
            }
            // else if (cmd.type === 'Z') { /* no-op */ }
            return arr;
          }

          function parseOpts(options, defaults) {
            if (_typeof(options) !== 'object') {
              options = defaults;
            } else {
              for (var key in defaults) {
                if (typeof options[key] === 'undefined') {
                  options[key] = defaults[key];
                }
              }
            }
            return options;
          }

          //////////////////////// Helpers ////////////////////////////

          function at(v, i) {
            var s = v.length;
            return v[i < 0 ? i % s + s : i % s];
          }

          function collinear(a, b, c, thresholdAngle) {
            if (!thresholdAngle) {
              return areaTriangle(a, b, c) === 0;
            }

            if (typeof collinear.tmpPoint1 === 'undefined') {
              collinear.tmpPoint1 = [];
              collinear.tmpPoint2 = [];
            }

            var ab = collinear.tmpPoint1,
              bc = collinear.tmpPoint2;
            ab.x = b.x - a.x;
            ab.y = b.y - a.y;
            bc.x = c.x - b.x;
            bc.y = c.y - b.y;

            var dot = ab.x * bc.x + ab.y * bc.y,
              magA = Math.sqrt(ab.x * ab.x + ab.y * ab.y),
              magB = Math.sqrt(bc.x * bc.x + bc.y * bc.y),
              angle = Math.acos(dot / (magA * magB));

            return angle < thresholdAngle;
          }

          function areaTriangle(a, b, c) {
            return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
          }

          // Portions of below code copyright 2008 Dmitry Baranovskiy (via MIT license)

          function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t,
              t13 = Math.pow(t1, 3),
              t12 = Math.pow(t1, 2),
              t2 = t * t,
              t3 = t2 * t,
              x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
              y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
              mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
              my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
              nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
              ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
              ax = t1 * p1x + t * c1x,
              ay = t1 * p1y + t * c1y,
              cx = t1 * c2x + t * p2x,
              cy = t1 * c2y + t * p2y,
              alpha = 90 - Math.atan2(mx - nx, my - ny) * 180 / Math.PI;

            if (mx > nx || my < ny) {
              alpha += 180;
            }

            return {
              x: x,
              y: y,
              m: { x: mx, y: my },
              n: { x: nx, y: ny },
              start: { x: ax, y: ay },
              end: { x: cx, y: cy },
              alpha: alpha
            };
          }

          function getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
            return length == null
              ? bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y)
              : findDotsAtSegment(
                  p1x,
                  p1y,
                  c1x,
                  c1y,
                  c2x,
                  c2y,
                  p2x,
                  p2y,
                  getTatLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length)
                );
          }

          function pointAtLength(path, length, istotal) {
            path = path2curve(path);
            var x,
              y,
              p,
              l,
              sp = '',
              subpaths = {},
              point,
              len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
              p = path[i];
              if (p[0] === 'M') {
                x = +p[1];
                y = +p[2];
              } else {
                l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                if (len + l > length) {
                  if (!istotal) {
                    point = getPointAtSegmentLength(
                      x,
                      y,
                      p[1],
                      p[2],
                      p[3],
                      p[4],
                      p[5],
                      p[6],
                      length - len
                    );

                    return { x: point.x, y: point.y, alpha: point.alpha };
                  }
                }
                len += l;
                x = +p[5];
                y = +p[6];
              }
              sp += p.shift() + p;
            }
            subpaths.end = sp;

            point = istotal
              ? len
              : findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);

            if (point.alpha) {
              point = { x: point.x, y: point.y, alpha: point.alpha };
            }

            return point;
          }

          function pathToAbsolute(pathArray) {
            var res = [],
              x = 0,
              y = 0,
              mx = 0,
              my = 0,
              start = 0;
            if (!pathArray) {
              // console.warn("Unexpected state: undefined pathArray"); // shouldn't happen
              return res;
            }
            if (pathArray[0][0] === 'M') {
              x = +pathArray[0][1];
              y = +pathArray[0][2];
              mx = x;
              my = y;
              start++;
              res[0] = ['M', x, y];
            }

            var dots,
              crz =
                pathArray.length === 3 &&
                pathArray[0][0] === 'M' &&
                pathArray[1][0].toUpperCase() === 'R' &&
                pathArray[2][0].toUpperCase() === 'Z';

            for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
              res.push((r = []));
              pa = pathArray[i];
              if (pa[0] !== String.prototype.toUpperCase.call(pa[0])) {
                r[0] = String.prototype.toUpperCase.call(pa[0]);
                switch (r[0]) {
                  case 'A':
                    r[1] = pa[1];
                    r[2] = pa[2];
                    r[3] = pa[3];
                    r[4] = pa[4];
                    r[5] = pa[5];
                    r[6] = +(pa[6] + x);
                    r[7] = +(pa[7] + y);
                    break;
                  case 'V':
                    r[1] = +pa[1] + y;
                    break;
                  case 'H':
                    r[1] = +pa[1] + x;
                    break;
                  case 'R':
                    dots = [x, y].concat(pa.slice(1));
                    for (var j = 2, jj = dots.length; j < jj; j++) {
                      dots[j] = +dots[j] + x;
                      dots[++j] = +dots[j] + y;
                    }
                    res.pop();
                    res = res.concat(catmullRom2bezier(dots, crz));
                    break;
                  case 'M':
                    mx = +pa[1] + x;
                    my = +pa[2] + y;
                    break;
                  default:
                    for (j = 1, jj = pa.length; j < jj; j++) {
                      r[j] = +pa[j] + (j % 2 ? x : y);
                    }
                }
              } else if (pa[0] === 'R') {
                dots = [x, y].concat(pa.slice(1));
                res.pop();
                res = res.concat(catmullRom2bezier(dots, crz));
                r = ['R'].concat(pa.slice(-2));
              } else {
                for (var k = 0, kk = pa.length; k < kk; k++) {
                  r[k] = pa[k];
                }
              }
              switch (r[0]) {
                case 'Z':
                  x = mx;
                  y = my;
                  break;
                case 'H':
                  x = r[1];
                  break;
                case 'V':
                  y = r[1];
                  break;
                case 'M':
                  mx = r[r.length - 2];
                  my = r[r.length - 1];
                  break;
                default:
                  x = r[r.length - 2];
                  y = r[r.length - 1];
              }
            }
            return res;
          }

          function path2curve(path, path2) {
            var p = pathToAbsolute(path),
              p2 = path2 && pathToAbsolute(path2);
            var attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };
            var attrs2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };
            var pcoms1 = []; // path commands of original path p
            var pcoms2 = []; // path commands of original path p2
            var ii;

            var processPath = function processPath(path, d, pcom) {
                var nx,
                  ny,
                  tq = { T: 1, Q: 1 };
                if (!path) {
                  return ['C', d.x, d.y, d.x, d.y, d.x, d.y];
                }
                if (!(path[0] in tq)) {
                  d.qx = d.qy = null;
                }
                switch (path[0]) {
                  case 'M':
                    d.X = path[1];
                    d.Y = path[2];
                    break;
                  case 'A':
                    path = ['C'].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
                    break;
                  case 'S':
                    if (pcom === 'C' || pcom === 'S') {
                      nx = d.x * 2 - d.bx;
                      ny = d.y * 2 - d.by;
                    } else {
                      nx = d.x;
                      ny = d.y;
                    }
                    path = ['C', nx, ny].concat(path.slice(1));
                    break;
                  case 'T':
                    if (pcom === 'Q' || pcom === 'T') {
                      d.qx = d.x * 2 - d.qx;
                      d.qy = d.y * 2 - d.qy;
                    } else {
                      d.qx = d.x;
                      d.qy = d.y;
                    }
                    path = ['C'].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                    break;
                  case 'Q':
                    d.qx = path[1];
                    d.qy = path[2];
                    path = ['C'].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));

                    break;
                  case 'L':
                    path = ['C'].concat(l2c(d.x, d.y, path[1], path[2]));
                    break;
                  case 'H':
                    path = ['C'].concat(l2c(d.x, d.y, path[1], d.y));
                    break;
                  case 'V':
                    path = ['C'].concat(l2c(d.x, d.y, d.x, path[1]));
                    break;
                  case 'Z':
                    path = ['C'].concat(l2c(d.x, d.y, d.X, d.Y));
                    break;
                }

                return path;
              },
              fixArc = function fixArc(pp, i) {
                if (pp[i].length > 7) {
                  pp[i].shift();
                  var pi = pp[i];
                  while (pi.length) {
                    pcoms1[i] = 'A';
                    if (p2) {
                      pcoms2[i] = 'A';
                    }
                    pp.splice(i++, 0, ['C'].concat(pi.splice(0, 6)));
                  }
                  pp.splice(i, 1);
                  ii = Math.max(p.length, (p2 && p2.length) || 0);
                }
              },
              fixM = function fixM(path1, path2, a1, a2, i) {
                if (path1 && path2 && path1[i][0] === 'M' && path2[i][0] !== 'M') {
                  path2.splice(i, 0, ['M', a2.x, a2.y]);
                  a1.bx = 0;
                  a1.by = 0;
                  a1.x = path1[i][1];
                  a1.y = path1[i][2];
                  ii = Math.max(p.length, (p2 && p2.length) || 0);
                }
              };

            var pfirst = ''; // temporary holder for original path command
            var pcom = ''; // holder for previous path command of original path

            ii = Math.max(p.length, (p2 && p2.length) || 0);
            for (var i = 0; i < ii; i++) {
              if (p[i]) {
                pfirst = p[i][0];
              } // save current path command

              if (pfirst !== 'C') {
                pcoms1[i] = pfirst; // Save current path command
                if (i) {
                  pcom = pcoms1[i - 1];
                } // Get previous path command pcom
              }
              p[i] = processPath(p[i], attrs, pcom);

              if (pcoms1[i] !== 'A' && pfirst === 'C') {
                pcoms1[i] = 'C';
              }

              fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

              if (p2) {
                // the same procedures is done to p2
                if (p2[i]) {
                  pfirst = p2[i][0];
                }
                if (pfirst !== 'C') {
                  pcoms2[i] = pfirst;
                  if (i) {
                    pcom = pcoms2[i - 1];
                  }
                }
                p2[i] = processPath(p2[i], attrs2, pcom);

                if (pcoms2[i] !== 'A' && pfirst === 'C') {
                  pcoms2[i] = 'C';
                }

                fixArc(p2, i);
              }
              fixM(p, p2, attrs, attrs2, i);
              fixM(p2, p, attrs2, attrs, i);
              var seg = p[i],
                seg2 = p2 && p2[i],
                seglen = seg.length,
                seg2len = p2 && seg2.length;
              attrs.x = seg[seglen - 2];
              attrs.y = seg[seglen - 1];
              attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
              attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
              attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
              attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
              attrs2.x = p2 && seg2[seg2len - 2];
              attrs2.y = p2 && seg2[seg2len - 1];
            }

            return p2 ? [p, p2] : p;
          }

          function a2c(x1, y1, rx, ry, angle, lac, sweep_flag, x2, y2, recursive) {
            // for more information of where this Math came from visit:
            // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            var PI = Math.PI,
              _120 = PI * 120 / 180,
              f1,
              f2,
              cx,
              cy,
              rad = PI / 180 * (+angle || 0),
              res = [],
              xy,
              rotate = function rotate(x, y, rad) {
                var X = x * Math.cos(rad) - y * Math.sin(rad),
                  Y = x * Math.sin(rad) + y * Math.cos(rad);
                return { x: X, y: Y };
              };
            if (!recursive) {
              xy = rotate(x1, y1, -rad);
              x1 = xy.x;
              y1 = xy.y;
              xy = rotate(x2, y2, -rad);
              x2 = xy.x;
              y2 = xy.y;
              var x = (x1 - x2) / 2,
                y = (y1 - y2) / 2,
                h = x * x / (rx * rx) + y * y / (ry * ry);
              if (h > 1) {
                h = Math.sqrt(h);
                rx = h * rx;
                ry = h * ry;
              }
              var rx2 = rx * rx,
                ry2 = ry * ry;
              var k =
                (lac === sweep_flag ? -1 : 1) *
                Math.sqrt(
                  Math.abs(
                    (rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x)
                  )
                );

              cx = k * rx * y / ry + (x1 + x2) / 2;
              cy = k * -ry * x / rx + (y1 + y2) / 2;
              f1 = Math.asin(((y1 - cy) / ry).toFixed(9));
              f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

              f1 = x1 < cx ? PI - f1 : f1;
              f2 = x2 < cx ? PI - f2 : f2;

              if (f1 < 0) {
                f1 = PI * 2 + f1;
              }
              if (f2 < 0) {
                f2 = PI * 2 + f2;
              }

              if (sweep_flag && f1 > f2) {
                f1 = f1 - PI * 2;
              }
              if (!sweep_flag && f2 > f1) {
                f2 = f2 - PI * 2;
              }
            } else {
              f1 = recursive[0];
              f2 = recursive[1];
              cx = recursive[2];
              cy = recursive[3];
            }
            var df = f2 - f1;
            if (Math.abs(df) > _120) {
              var f2old = f2,
                x2old = x2,
                y2old = y2;
              f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
              x2 = cx + rx * Math.cos(f2);
              y2 = cy + ry * Math.sin(f2);
              res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [
                f2,
                f2old,
                cx,
                cy
              ]);
            }
            df = f2 - f1;
            var c1 = Math.cos(f1),
              s1 = Math.sin(f1),
              c2 = Math.cos(f2),
              s2 = Math.sin(f2),
              t = Math.tan(df / 4),
              hx = 4 / 3 * rx * t,
              hy = 4 / 3 * ry * t,
              m1 = [x1, y1],
              m2 = [x1 + hx * s1, y1 - hy * c1],
              m3 = [x2 + hx * s2, y2 - hy * c2],
              m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
              return [m2, m3, m4].concat(res);
            } else {
              res = [m2, m3, m4]
                .concat(res)
                .join()
                .split(',');
              var newres = [];
              for (var i = 0, ii = res.length; i < ii; i++) {
                newres[i] =
                  i % 2
                    ? rotate(res[i - 1], res[i], rad).y
                    : rotate(res[i], res[i + 1], rad).x;
              }
              return newres;
            }
          }

          // http://schepers.cc/getting-to-the-point
          function catmullRom2bezier(crp, z) {
            var d = [];
            for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
              var p = [
                {
                  x: +crp[i - 2],
                  y: +crp[i - 1]
                },

                {
                  x: +crp[i],
                  y: +crp[i + 1]
                },

                {
                  x: +crp[i + 2],
                  y: +crp[i + 3]
                },

                {
                  x: +crp[i + 4],
                  y: +crp[i + 5]
                }
              ];

              if (z) {
                if (!i) {
                  p[0] = {
                    x: +crp[iLen - 2],
                    y: +crp[iLen - 1]
                  };
                } else if (iLen - 4 === i) {
                  p[3] = {
                    x: +crp[0],
                    y: +crp[1]
                  };
                } else if (iLen - 2 === i) {
                  p[2] = {
                    x: +crp[0],
                    y: +crp[1]
                  };

                  p[3] = {
                    x: +crp[2],
                    y: +crp[3]
                  };
                }
              } else {
                if (iLen - 4 === i) {
                  p[3] = p[2];
                } else if (!i) {
                  p[0] = {
                    x: +crp[i],
                    y: +crp[i + 1]
                  };
                }
              }
              d.push([
                'C',
                (-p[0].x + 6 * p[1].x + p[2].x) / 6,
                (-p[0].y + 6 * p[1].y + p[2].y) / 6,
                (p[1].x + 6 * p[2].x - p[3].x) / 6,
                (p[1].y + 6 * p[2].y - p[3].y) / 6,
                p[2].x,
                p[2].y
              ]);
            }

            return d;
          }

          function l2c(x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
          }

          function q2c(x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
              _23 = 2 / 3;
            return [
              _13 * x1 + _23 * ax,
              _13 * y1 + _23 * ay,
              _13 * x2 + _23 * ax,
              _13 * y2 + _23 * ay,
              x2,
              y2
            ];
          }

          function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
            if (z == null) {
              z = 1;
            }
            z = z > 1 ? 1 : z < 0 ? 0 : z;
            var z2 = z / 2;
            var n = 12;
            var Tvalues = [
              -0.1252,
              0.1252,
              -0.3678,
              0.3678,
              -0.5873,
              0.5873,
              -0.7699,
              0.7699,
              -0.9041,
              0.9041,
              -0.9816,
              0.9816
            ];

            var sum = 0;
            var Cvalues = [
              0.2491,
              0.2491,
              0.2335,
              0.2335,
              0.2032,
              0.2032,
              0.1601,
              0.1601,
              0.1069,
              0.1069,
              0.0472,
              0.0472
            ];

            for (var i = 0; i < n; i++) {
              var ct = z2 * Tvalues[i] + z2,
                xbase = base3(ct, x1, x2, x3, x4),
                ybase = base3(ct, y1, y2, y3, y4),
                comb = xbase * xbase + ybase * ybase;
              sum += Cvalues[i] * Math.sqrt(comb);
            }
            return z2 * sum;
          }

          function getTatLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
            if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
              return;
            }
            var t = 1,
              step = t / 2,
              t2 = t - step,
              l,
              e = 0.01;
            l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
            while (Math.abs(l - ll) > e) {
              step /= 2;
              t2 += (l < ll ? 1 : -1) * step;
              l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
            }
            return t2;
          }

          function base3(t, p1, p2, p3, p4) {
            var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
              t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
            return t * t2 - 3 * p1 + 3 * p2;
          }

          function cacheKey() {
            var hash = '';
            for (var i = arguments.length - 1; i >= 0; --i) {
              hash += '？' + arguments[i];
            }
            return hash;
          }

          module.exports = p5;
        },
        { '../core/constants': 18, '../core/main': 24 }
      ],
      61: [
        function(_dereq_, module, exports) {
          /**
           * @module Data
           * @submodule Array Functions
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');

          /**
           * Adds a value to the end of an array. Extends the length of
           * the array by one. Maps to Array.push().
           *
           * @method append
           * @deprecated Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push">array.push(value)</a> instead.
           * @param {Array} array Array to append
           * @param {any} value to be added to the Array
           * @return {Array} the array that was appended to
           * @example
           * <div class='norender'><code>
           * function setup() {
           *   var myArray = ['Mango', 'Apple', 'Papaya'];
           *   print(myArray); // ['Mango', 'Apple', 'Papaya']
           *
           *   append(myArray, 'Peach');
           *   print(myArray); // ['Mango', 'Apple', 'Papaya', 'Peach']
           * }
           * </code></div>
           */
          p5.prototype.append = function(array, value) {
            array.push(value);
            return array;
          };

          /**
           * Copies an array (or part of an array) to another array. The src array is
           * copied to the dst array, beginning at the position specified by
           * srcPosition and into the position specified by dstPosition. The number of
           * elements to copy is determined by length. Note that copying values
           * overwrites existing values in the destination array. To append values
           * instead of overwriting them, use <a href="#/p5/concat">concat()</a>.
           * <br><br>
           * The simplified version with only two arguments, arrayCopy(src, dst),
           * copies an entire array to another of the same size. It is equivalent to
           * arrayCopy(src, 0, dst, 0, src.length).
           * <br><br>
           * Using this function is far more efficient for copying array data than
           * iterating through a for() loop and copying each element individually.
           *
           * @method arrayCopy
           * @deprecated
           * @param {Array}  src           the source Array
           * @param {Integer} srcPosition  starting position in the source Array
           * @param {Array}  dst           the destination Array
           * @param {Integer} dstPosition   starting position in the destination Array
           * @param {Integer} length        number of Array elements to be copied
           *
           * @example
           * <div class='norender'><code>
           * var src = ['A', 'B', 'C'];
           * var dst = [1, 2, 3];
           * var srcPosition = 1;
           * var dstPosition = 0;
           * var length = 2;
           *
           * print(src); // ['A', 'B', 'C']
           * print(dst); // [ 1 ,  2 ,  3 ]
           *
           * arrayCopy(src, srcPosition, dst, dstPosition, length);
           * print(dst); // ['B', 'C', 3]
           * </code></div>
           */
          /**
           * @method arrayCopy
           * @deprecated Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin">arr1.copyWithin(arr2)</a> instead.
           * @param {Array}  src
           * @param {Array}  dst
           * @param {Integer} [length]
           */
          p5.prototype.arrayCopy = function(src, srcPosition, dst, dstPosition, length) {
            // the index to begin splicing from dst array
            var start;
            var end;

            if (typeof length !== 'undefined') {
              end = Math.min(length, src.length);
              start = dstPosition;
              src = src.slice(srcPosition, end + srcPosition);
            } else {
              if (typeof dst !== 'undefined') {
                // src, dst, length
                // rename  so we don't get confused
                end = dst;
                end = Math.min(end, src.length);
              } else {
                // src, dst
                end = src.length;
              }

              start = 0;
              // rename  so we don't get confused
              dst = srcPosition;
              src = src.slice(0, end);
            }

            // Since we are not returning the array and JavaScript is pass by reference
            // we must modify the actual values of the array
            // instead of reassigning arrays
            Array.prototype.splice.apply(dst, [start, end].concat(src));
          };

          /**
           * Concatenates two arrays, maps to Array.concat(). Does not modify the
           * input arrays.
           *
           * @method concat
           * @deprecated Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat">arr1.concat(arr2)</a> instead.
           * @param {Array} a first Array to concatenate
           * @param {Array} b second Array to concatenate
           * @return {Array} concatenated array
           *
           * @example
           * <div class = 'norender'><code>
           * function setup() {
           *   var arr1 = ['A', 'B', 'C'];
           *   var arr2 = [1, 2, 3];
           *
           *   print(arr1); // ['A','B','C']
           *   print(arr2); // [1,2,3]
           *
           *   var arr3 = concat(arr1, arr2);
           *
           *   print(arr1); // ['A','B','C']
           *   print(arr2); // [1, 2, 3]
           *   print(arr3); // ['A','B','C', 1, 2, 3]
           * }
           * </code></div>
           */
          p5.prototype.concat = function(list0, list1) {
            return list0.concat(list1);
          };

          /**
           * Reverses the order of an array, maps to Array.reverse()
           *
           * @method reverse
           * @deprecated Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse">array.reverse()</a> instead.
           * @param {Array} list Array to reverse
           * @return {Array} the reversed list
           * @example
           * <div class='norender'><code>
           * function setup() {
           *   var myArray = ['A', 'B', 'C'];
           *   print(myArray); // ['A','B','C']
           *
           *   reverse(myArray);
           *   print(myArray); // ['C','B','A']
           * }
           * </code></div>
           */
          p5.prototype.reverse = function(list) {
            return list.reverse();
          };

          /**
           * Decreases an array by one element and returns the shortened array,
           * maps to Array.pop().
           *
           * @method shorten
           * @deprecated Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop">array.pop()</a> instead.
           * @param  {Array} list Array to shorten
           * @return {Array} shortened Array
           * @example
           * <div class = 'norender'><code>
           * function setup() {
           *   var myArray = ['A', 'B', 'C'];
           *   print(myArray); // ['A', 'B', 'C']
           *   var newArray = shorten(myArray);
           *   print(myArray); // ['A','B','C']
           *   print(newArray); // ['A','B']
           * }
           * </code></div>
           */
          p5.prototype.shorten = function(list) {
            list.pop();
            return list;
          };

          /**
           * Randomizes the order of the elements of an array. Implements
           * <a href='http://Bost.Ocks.org/mike/shuffle/' target=_blank>
           * Fisher-Yates Shuffle Algorithm</a>.
           *
           * @method shuffle
           * @param  {Array}   array  Array to shuffle
           * @param  {Boolean} [bool] modify passed array
           * @return {Array}   shuffled Array
           * @example
           * <div><code>
           * function setup() {
           *   var regularArr = ['ABC', 'def', createVector(), TAU, Math.E];
           *   print(regularArr);
           *   shuffle(regularArr, true); // force modifications to passed array
           *   print(regularArr);
           *
           *   // By default shuffle() returns a shuffled cloned array:
           *   var newArr = shuffle(regularArr);
           *   print(regularArr);
           *   print(newArr);
           * }
           * </code></div>
           */
          p5.prototype.shuffle = function(arr, bool) {
            var isView = ArrayBuffer && ArrayBuffer.isView && ArrayBuffer.isView(arr);
            arr = bool || isView ? arr : arr.slice();

            var rnd,
              tmp,
              idx = arr.length;
            while (idx > 1) {
              rnd = (Math.random() * idx) | 0;

              tmp = arr[--idx];
              arr[idx] = arr[rnd];
              arr[rnd] = tmp;
            }

            return arr;
          };

          /**
           * Sorts an array of numbers from smallest to largest, or puts an array of
           * words in alphabetical order. The original array is not modified; a
           * re-ordered array is returned. The count parameter states the number of
           * elements to sort. For example, if there are 12 elements in an array and
           * count is set to 5, only the first 5 elements in the array will be sorted.
           *
           * @method sort
           * @deprecated Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort">array.sort()</a> instead.
           * @param {Array} list Array to sort
           * @param {Integer} [count] number of elements to sort, starting from 0
           * @return {Array} the sorted list
           *
           * @example
           * <div class = 'norender'><code>
           * function setup() {
           *   var words = ['banana', 'apple', 'pear', 'lime'];
           *   print(words); // ['banana', 'apple', 'pear', 'lime']
           *   var count = 4; // length of array
           *
           *   words = sort(words, count);
           *   print(words); // ['apple', 'banana', 'lime', 'pear']
           * }
           * </code></div>
           * <div class = 'norender'><code>
           * function setup() {
           *   var numbers = [2, 6, 1, 5, 14, 9, 8, 12];
           *   print(numbers); // [2, 6, 1, 5, 14, 9, 8, 12]
           *   var count = 5; // Less than the length of the array
           *
           *   numbers = sort(numbers, count);
           *   print(numbers); // [1,2,5,6,14,9,8,12]
           * }
           * </code></div>
           */
          p5.prototype.sort = function(list, count) {
            var arr = count ? list.slice(0, Math.min(count, list.length)) : list;
            var rest = count ? list.slice(Math.min(count, list.length)) : [];
            if (typeof arr[0] === 'string') {
              arr = arr.sort();
            } else {
              arr = arr.sort(function(a, b) {
                return a - b;
              });
            }
            return arr.concat(rest);
          };

          /**
           * Inserts a value or an array of values into an existing array. The first
           * parameter specifies the initial array to be modified, and the second
           * parameter defines the data to be inserted. The third parameter is an index
           * value which specifies the array position from which to insert data.
           * (Remember that array index numbering starts at zero, so the first position
           * is 0, the second position is 1, and so on.)
           *
           * @method splice
           * @deprecated Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice">array.splice()</a> instead.
           * @param {Array}  list Array to splice into
           * @param {any}    value value to be spliced in
           * @param {Integer} position in the array from which to insert data
           * @return {Array} the list
           *
           * @example
           * <div class = 'norender'><code>
           * function setup() {
           *   var myArray = [0, 1, 2, 3, 4];
           *   var insArray = ['A', 'B', 'C'];
           *   print(myArray); // [0, 1, 2, 3, 4]
           *   print(insArray); // ['A','B','C']
           *
           *   splice(myArray, insArray, 3);
           *   print(myArray); // [0,1,2,'A','B','C',3,4]
           * }
           * </code></div>
           */
          p5.prototype.splice = function(list, value, index) {
            // note that splice returns spliced elements and not an array
            Array.prototype.splice.apply(list, [index, 0].concat(value));

            return list;
          };

          /**
           * Extracts an array of elements from an existing array. The list parameter
           * defines the array from which the elements will be copied, and the start
           * and count parameters specify which elements to extract. If no count is
           * given, elements will be extracted from the start to the end of the array.
           * When specifying the start, remember that the first array element is 0.
           * This function does not change the source array.
           *
           * @method subset
           * @deprecated Use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice">array.slice()</a> instead.
           * @param  {Array}  list    Array to extract from
           * @param  {Integer} start   position to begin
           * @param  {Integer} [count] number of values to extract
           * @return {Array}          Array of extracted elements
           *
           * @example
           * <div class = 'norender'><code>
           * function setup() {
           *   var myArray = [1, 2, 3, 4, 5];
           *   print(myArray); // [1, 2, 3, 4, 5]
           *
           *   var sub1 = subset(myArray, 0, 3);
           *   var sub2 = subset(myArray, 2, 2);
           *   print(sub1); // [1,2,3]
           *   print(sub2); // [3,4]
           * }
           * </code></div>
           */
          p5.prototype.subset = function(list, start, count) {
            if (typeof count !== 'undefined') {
              return list.slice(start, start + count);
            } else {
              return list.slice(start, list.length);
            }
          };

          module.exports = p5;
        },
        { '../core/main': 24 }
      ],
      62: [
        function(_dereq_, module, exports) {
          /**
           * @module Data
           * @submodule Conversion
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');

          /**
           * Converts a string to its floating point representation. The contents of a
           * string must resemble a number, or NaN (not a number) will be returned.
           * For example, float("1234.56") evaluates to 1234.56, but float("giraffe")
           * will return NaN.
           *
           * When an array of values is passed in, then an array of floats of the same
           * length is returned.
           *
           * @method float
           * @param {String}  str float string to parse
           * @return {Number}     floating point representation of string
           * @example
           * <div><code>
           * var str = '20';
           * var diameter = float(str);
           * ellipse(width / 2, height / 2, diameter, diameter);
           * </code></div>
           * <div class='norender'><code>
           * print(float('10.31')); // 10.31
           * print(float('Infinity')); // Infinity
           * print(float('-Infinity')); // -Infinity
           * </code></div>
           *
           * @alt
           * 20 by 20 white ellipse in the center of the canvas
           *
           */
          p5.prototype.float = function(str) {
            if (str instanceof Array) {
              return str.map(parseFloat);
            }
            return parseFloat(str);
          };

          /**
           * Converts a boolean, string, or float to its integer representation.
           * When an array of values is passed in, then an int array of the same length
           * is returned.
           *
           * @method int
           * @param {String|Boolean|Number}       n value to parse
           * @param {Integer}       [radix] the radix to convert to (default: 10)
           * @return {Number}                     integer representation of value
           *
           * @example
           * <div class='norender'><code>
           * print(int('10')); // 10
           * print(int(10.31)); // 10
           * print(int(-10)); // -10
           * print(int(true)); // 1
           * print(int(false)); // 0
           * print(int([false, true, '10.3', 9.8])); // [0, 1, 10, 9]
           * print(int(Infinity)); // Infinity
           * print(int('-Infinity')); // -Infinity
           * </code></div>
           */
          /**
           * @method int
           * @param {Array} ns                    values to parse
           * @return {Number[]}                   integer representation of values
           */
          p5.prototype.int = function(n, radix) {
            radix = radix || 10;
            if (n === Infinity || n === 'Infinity') {
              return Infinity;
            } else if (n === -Infinity || n === '-Infinity') {
              return -Infinity;
            } else if (typeof n === 'string') {
              return parseInt(n, radix);
            } else if (typeof n === 'number') {
              return n | 0;
            } else if (typeof n === 'boolean') {
              return n ? 1 : 0;
            } else if (n instanceof Array) {
              return n.map(function(n) {
                return p5.prototype.int(n, radix);
              });
            }
          };

          /**
           * Converts a boolean, string or number to its string representation.
           * When an array of values is passed in, then an array of strings of the same
           * length is returned.
           *
           * @method str
           * @param {String|Boolean|Number|Array} n value to parse
           * @return {String}                     string representation of value
           * @example
           * <div class='norender'><code>
           * print(str('10')); // "10"
           * print(str(10.31)); // "10.31"
           * print(str(-10)); // "-10"
           * print(str(true)); // "true"
           * print(str(false)); // "false"
           * print(str([true, '10.3', 9.8])); // [ "true", "10.3", "9.8" ]
           * </code></div>
           */
          p5.prototype.str = function(n) {
            if (n instanceof Array) {
              return n.map(p5.prototype.str);
            } else {
              return String(n);
            }
          };

          /**
           * Converts a number or string to its boolean representation.
           * For a number, any non-zero value (positive or negative) evaluates to true,
           * while zero evaluates to false. For a string, the value "true" evaluates to
           * true, while any other value evaluates to false. When an array of number or
           * string values is passed in, then a array of booleans of the same length is
           * returned.
           *
           * @method boolean
           * @param {String|Boolean|Number|Array} n value to parse
           * @return {Boolean}                    boolean representation of value
           * @example
           * <div class='norender'><code>
           * print(boolean(0)); // false
           * print(boolean(1)); // true
           * print(boolean('true')); // true
           * print(boolean('abcd')); // false
           * print(boolean([0, 12, 'true'])); // [false, true, true]
           * </code></div>
           */
          p5.prototype.boolean = function(n) {
            if (typeof n === 'number') {
              return n !== 0;
            } else if (typeof n === 'string') {
              return n.toLowerCase() === 'true';
            } else if (typeof n === 'boolean') {
              return n;
            } else if (n instanceof Array) {
              return n.map(p5.prototype.boolean);
            }
          };

          /**
           * Converts a number, string representation of a number, or boolean to its byte
           * representation. A byte can be only a whole number between -128 and 127, so
           * when a value outside of this range is converted, it wraps around to the
           * corresponding byte representation. When an array of number, string or boolean
           * values is passed in, then an array of bytes the same length is returned.
           *
           * @method byte
           * @param {String|Boolean|Number}       n value to parse
           * @return {Number}                     byte representation of value
           *
           * @example
           * <div class='norender'><code>
           * print(byte(127)); // 127
           * print(byte(128)); // -128
           * print(byte(23.4)); // 23
           * print(byte('23.4')); // 23
           * print(byte('hello')); // NaN
           * print(byte(true)); // 1
           * print(byte([0, 255, '100'])); // [0, -1, 100]
           * </code></div>
           */
          /**
           * @method byte
           * @param {Array} ns                   values to parse
           * @return {Number[]}                  array of byte representation of values
           */
          p5.prototype.byte = function(n) {
            var nn = p5.prototype.int(n, 10);
            if (typeof nn === 'number') {
              return (nn + 128) % 256 - 128;
            } else if (nn instanceof Array) {
              return nn.map(p5.prototype.byte);
            }
          };

          /**
           * Converts a number or string to its corresponding single-character
           * string representation. If a string parameter is provided, it is first
           * parsed as an integer and then translated into a single-character string.
           * When an array of number or string values is passed in, then an array of
           * single-character strings of the same length is returned.
           *
           * @method char
           * @param {String|Number}       n value to parse
           * @return {String}             string representation of value
           *
           * @example
           * <div class='norender'><code>
           * print(char(65)); // "A"
           * print(char('65')); // "A"
           * print(char([65, 66, 67])); // [ "A", "B", "C" ]
           * print(join(char([65, 66, 67]), '')); // "ABC"
           * </code></div>
           */
          /**
           * @method char
           * @param {Array} ns              values to parse
           * @return {String[]}             array of string representation of values
           */
          p5.prototype.char = function(n) {
            if (typeof n === 'number' && !isNaN(n)) {
              return String.fromCharCode(n);
            } else if (n instanceof Array) {
              return n.map(p5.prototype.char);
            } else if (typeof n === 'string') {
              return p5.prototype.char(parseInt(n, 10));
            }
          };

          /**
           * Converts a single-character string to its corresponding integer
           * representation. When an array of single-character string values is passed
           * in, then an array of integers of the same length is returned.
           *
           * @method unchar
           * @param {String} n     value to parse
           * @return {Number}      integer representation of value
           *
           * @example
           * <div class='norender'><code>
           * print(unchar('A')); // 65
           * print(unchar(['A', 'B', 'C'])); // [ 65, 66, 67 ]
           * print(unchar(split('ABC', ''))); // [ 65, 66, 67 ]
           * </code></div>
           */
          /**
           * @method unchar
           * @param {Array} ns       values to parse
           * @return {Number[]}      integer representation of values
           */
          p5.prototype.unchar = function(n) {
            if (typeof n === 'string' && n.length === 1) {
              return n.charCodeAt(0);
            } else if (n instanceof Array) {
              return n.map(p5.prototype.unchar);
            }
          };

          /**
           * Converts a number to a string in its equivalent hexadecimal notation. If a
           * second parameter is passed, it is used to set the number of characters to
           * generate in the hexadecimal notation. When an array is passed in, an
           * array of strings in hexadecimal notation of the same length is returned.
           *
           * @method hex
           * @param {Number} n     value to parse
           * @param {Number} [digits]
           * @return {String}      hexadecimal string representation of value
           *
           * @example
           * <div class='norender'><code>
           * print(hex(255)); // "000000FF"
           * print(hex(255, 6)); // "0000FF"
           * print(hex([0, 127, 255], 6)); // [ "000000", "00007F", "0000FF" ]
           * print(Infinity); // "FFFFFFFF"
           * print(-Infinity); // "00000000"
           * </code></div>
           */
          /**
           * @method hex
           * @param {Number[]} ns    array of values to parse
           * @param {Number} [digits]
           * @return {String[]}      hexadecimal string representation of values
           */
          p5.prototype.hex = function(n, digits) {
            digits = digits === undefined || digits === null ? (digits = 8) : digits;
            if (n instanceof Array) {
              return n.map(function(n) {
                return p5.prototype.hex(n, digits);
              });
            } else if (n === Infinity || n === -Infinity) {
              var c = n === Infinity ? 'F' : '0';
              return c.repeat(digits);
            } else if (typeof n === 'number') {
              if (n < 0) {
                n = 0xffffffff + n + 1;
              }
              var hex = Number(n)
                .toString(16)
                .toUpperCase();
              while (hex.length < digits) {
                hex = '0' + hex;
              }
              if (hex.length >= digits) {
                hex = hex.substring(hex.length - digits, hex.length);
              }
              return hex;
            }
          };

          /**
           * Converts a string representation of a hexadecimal number to its equivalent
           * integer value. When an array of strings in hexadecimal notation is passed
           * in, an array of integers of the same length is returned.
           *
           * @method unhex
           * @param {String} n value to parse
           * @return {Number}      integer representation of hexadecimal value
           *
           * @example
           * <div class='norender'><code>
           * print(unhex('A')); // 10
           * print(unhex('FF')); // 255
           * print(unhex(['FF', 'AA', '00'])); // [ 255, 170, 0 ]
           * </code></div>
           */
          /**
           * @method unhex
           * @param {Array} ns values to parse
           * @return {Number[]}      integer representations of hexadecimal value
           */
          p5.prototype.unhex = function(n) {
            if (n instanceof Array) {
              return n.map(p5.prototype.unhex);
            } else {
              return parseInt('0x' + n, 16);
            }
          };

          module.exports = p5;
        },
        { '../core/main': 24 }
      ],
      63: [
        function(_dereq_, module, exports) {
          /**
           * @module Data
           * @submodule String Functions
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');
          _dereq_('../core/error_helpers');

          //return p5; //LM is this a mistake?

          /**
           * Combines an array of Strings into one String, each separated by the
           * character(s) used for the separator parameter. To join arrays of ints or
           * floats, it's necessary to first convert them to Strings using <a href="#/p5/nf">nf()</a> or
           * nfs().
           *
           * @method join
           * @param  {Array}  list      array of Strings to be joined
           * @param  {String} separator String to be placed between each item
           * @return {String}           joined String
           * @example
           * <div>
           * <code>
           * var array = ['Hello', 'world!'];
           * var separator = ' ';
           * var message = join(array, separator);
           * text(message, 5, 50);
           * </code>
           * </div>
           *
           * @alt
           * "hello world!" displayed middle left of canvas.
           *
           */
          p5.prototype.join = function(list, separator) {
            p5._validateParameters('join', arguments);
            return list.join(separator);
          };

          /**
           * This function is used to apply a regular expression to a piece of text,
           * and return matching groups (elements found inside parentheses) as a
           * String array. If there are no matches, a null value will be returned.
           * If no groups are specified in the regular expression, but the sequence
           * matches, an array of length 1 (with the matched text as the first element
           * of the array) will be returned.
           * <br><br>
           * To use the function, first check to see if the result is null. If the
           * result is null, then the sequence did not match at all. If the sequence
           * did match, an array is returned.
           * <br><br>
           * If there are groups (specified by sets of parentheses) in the regular
           * expression, then the contents of each will be returned in the array.
           * Element [0] of a regular expression match returns the entire matching
           * string, and the match groups start at element [1] (the first group is [1],
           * the second [2], and so on).
           *
           * @method match
           * @param  {String} str    the String to be searched
           * @param  {String} regexp the regexp to be used for matching
           * @return {String[]}      Array of Strings found
           * @example
           * <div>
           * <code>
           * var string = 'Hello p5js*!';
           * var regexp = 'p5js\\*';
           * var m = match(string, regexp);
           * text(m, 5, 50);
           * </code>
           * </div>
           *
           * @alt
           * "p5js*" displayed middle left of canvas.
           *
           */
          p5.prototype.match = function(str, reg) {
            p5._validateParameters('match', arguments);
            return str.match(reg);
          };

          /**
           * This function is used to apply a regular expression to a piece of text,
           * and return a list of matching groups (elements found inside parentheses)
           * as a two-dimensional String array. If there are no matches, a null value
           * will be returned. If no groups are specified in the regular expression,
           * but the sequence matches, a two dimensional array is still returned, but
           * the second dimension is only of length one.
           * <br><br>
           * To use the function, first check to see if the result is null. If the
           * result is null, then the sequence did not match at all. If the sequence
           * did match, a 2D array is returned.
           * <br><br>
           * If there are groups (specified by sets of parentheses) in the regular
           * expression, then the contents of each will be returned in the array.
           * Assuming a loop with counter variable i, element [i][0] of a regular
           * expression match returns the entire matching string, and the match groups
           * start at element [i][1] (the first group is [i][1], the second [i][2],
           * and so on).
           *
           * @method matchAll
           * @param  {String} str    the String to be searched
           * @param  {String} regexp the regexp to be used for matching
           * @return {String[]}         2d Array of Strings found
           * @example
           * <div class="norender">
           * <code>
           * var string = 'Hello p5js*! Hello world!';
           * var regexp = 'Hello';
           * matchAll(string, regexp);
           * </code>
           * </div>
           */
          p5.prototype.matchAll = function(str, reg) {
            p5._validateParameters('matchAll', arguments);
            var re = new RegExp(reg, 'g');
            var match = re.exec(str);
            var matches = [];
            while (match !== null) {
              matches.push(match);
              // matched text: match[0]
              // match start: match.index
              // capturing group n: match[n]
              match = re.exec(str);
            }
            return matches;
          };

          /**
           * Utility function for formatting numbers into strings. There are two
           * versions: one for formatting floats, and one for formatting ints.
           * The values for the digits, left, and right parameters should always
           * be positive integers.
           * (NOTE): Be cautious when using left and right parameters as it prepends numbers of 0's if the parameter
           * if greater than the current length of the number.
           * For example if number is 123.2 and left parameter passed is 4 which is greater than length of 123
           * (integer part) i.e 3 than result will be 0123.2. Same case for right parameter i.e. if right is 3 than
           * the result will be 123.200.
           *
           * @method nf
           * @param {Number|String}       num      the Number to format
           * @param {Integer|String}      [left]   number of digits to the left of the
           *                                decimal point
           * @param {Integer|String}      [right]  number of digits to the right of the
           *                                decimal point
           * @return {String}               formatted String
           *
           * @example
           * <div>
           * <code>
           * var myFont;
           * function preload() {
           *   myFont = loadFont('assets/fonts/inconsolata.ttf');
           * }
           * function setup() {
           *   background(200);
           *   var num1 = 321;
           *   var num2 = -1321;
           *
           *   noStroke();
           *   fill(0);
           *   textFont(myFont);
           *   textSize(22);
           *
           *   text(nf(num1, 4, 2), 10, 30);
           *   text(nf(num2, 4, 2), 10, 80);
           *   // Draw dividing line
           *   stroke(120);
           *   line(0, 50, width, 50);
           * }
           * </code>
           * </div>
           *
           * @alt
           * "0321.00" middle top, -1321.00" middle bottom canvas
           */
          /**
           * @method nf
           * @param {Array}        nums     the Numbers to format
           * @param {Integer|String}      [left]
           * @param {Integer|String}      [right]
           * @return {String[]}                formatted Strings
           */
          p5.prototype.nf = function(nums, left, right) {
            p5._validateParameters('nf', arguments);
            if (nums instanceof Array) {
              return nums.map(function(x) {
                return doNf(x, left, right);
              });
            } else {
              var typeOfFirst = Object.prototype.toString.call(nums);
              if (typeOfFirst === '[object Arguments]') {
                if (nums.length === 3) {
                  return this.nf(nums[0], nums[1], nums[2]);
                } else if (nums.length === 2) {
                  return this.nf(nums[0], nums[1]);
                } else {
                  return this.nf(nums[0]);
                }
              } else {
                return doNf(nums, left, right);
              }
            }
          };

          function doNf(num, left, right) {
            var neg = num < 0;
            var n = neg ? num.toString().substring(1) : num.toString();
            var decimalInd = n.indexOf('.');
            var intPart = decimalInd !== -1 ? n.substring(0, decimalInd) : n;
            var decPart = decimalInd !== -1 ? n.substring(decimalInd + 1) : '';
            var str = neg ? '-' : '';
            if (typeof right !== 'undefined') {
              var decimal = '';
              if (decimalInd !== -1 || right - decPart.length > 0) {
                decimal = '.';
              }
              if (decPart.length > right) {
                decPart = decPart.substring(0, right);
              }
              for (var i = 0; i < left - intPart.length; i++) {
                str += '0';
              }
              str += intPart;
              str += decimal;
              str += decPart;
              for (var j = 0; j < right - decPart.length; j++) {
                str += '0';
              }
              return str;
            } else {
              for (var k = 0; k < Math.max(left - intPart.length, 0); k++) {
                str += '0';
              }
              str += n;
              return str;
            }
          }

          /**
           * Utility function for formatting numbers into strings and placing
           * appropriate commas to mark units of 1000. There are two versions: one
           * for formatting ints, and one for formatting an array of ints. The value
           * for the right parameter should always be a positive integer.
           *
           * @method nfc
           * @param  {Number|String}   num     the Number to format
           * @param  {Integer|String}  [right] number of digits to the right of the
           *                                  decimal point
           * @return {String}           formatted String
           *
           * @example
           * <div>
           * <code>
           * function setup() {
           *   background(200);
           *   var num = 11253106.115;
           *   var numArr = [1, 1, 2];
           *
           *   noStroke();
           *   fill(0);
           *   textSize(12);
           *
           *   // Draw formatted numbers
           *   text(nfc(num, 4), 10, 30);
           *   text(nfc(numArr, 2), 10, 80);
           *
           *   // Draw dividing line
           *   stroke(120);
           *   line(0, 50, width, 50);
           * }
           * </code>
           * </div>
           *
           * @alt
           * "11,253,106.115" top middle and "1.00,1.00,2.00" displayed bottom mid
           */
          /**
           * @method nfc
           * @param  {Array}    nums     the Numbers to format
           * @param  {Integer|String}  [right]
           * @return {String[]}           formatted Strings
           */
          p5.prototype.nfc = function(num, right) {
            p5._validateParameters('nfc', arguments);
            if (num instanceof Array) {
              return num.map(function(x) {
                return doNfc(x, right);
              });
            } else {
              return doNfc(num, right);
            }
          };
          function doNfc(num, right) {
            num = num.toString();
            var dec = num.indexOf('.');
            var rem = dec !== -1 ? num.substring(dec) : '';
            var n = dec !== -1 ? num.substring(0, dec) : num;
            n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (right === 0) {
              rem = '';
            } else if (typeof right !== 'undefined') {
              if (right > rem.length) {
                rem += dec === -1 ? '.' : '';
                var len = right - rem.length + 1;
                for (var i = 0; i < len; i++) {
                  rem += '0';
                }
              } else {
                rem = rem.substring(0, right + 1);
              }
            }
            return n + rem;
          }

          /**
           * Utility function for formatting numbers into strings. Similar to <a href="#/p5/nf">nf()</a> but
           * puts a "+" in front of positive numbers and a "-" in front of negative
           * numbers. There are two versions: one for formatting floats, and one for
           * formatting ints. The values for left, and right parameters
           * should always be positive integers.
           *
           * @method nfp
           * @param {Number} num      the Number to format
           * @param {Integer}      [left]   number of digits to the left of the decimal
           *                                point
           * @param {Integer}      [right]  number of digits to the right of the
           *                                decimal point
           * @return {String}         formatted String
           *
           * @example
           * <div>
           * <code>
           * function setup() {
           *   background(200);
           *   var num1 = 11253106.115;
           *   var num2 = -11253106.115;
           *
           *   noStroke();
           *   fill(0);
           *   textSize(12);
           *
           *   // Draw formatted numbers
           *   text(nfp(num1, 4, 2), 10, 30);
           *   text(nfp(num2, 4, 2), 10, 80);
           *
           *   // Draw dividing line
           *   stroke(120);
           *   line(0, 50, width, 50);
           * }
           * </code>
           * </div>
           *
           * @alt
           * "+11253106.11" top middle and "-11253106.11" displayed bottom middle
           */
          /**
           * @method nfp
           * @param {Number[]} nums      the Numbers to format
           * @param {Integer}      [left]
           * @param {Integer}      [right]
           * @return {String[]}         formatted Strings
           */
          p5.prototype.nfp = function() {
            p5._validateParameters('nfp', arguments);
            var nfRes = p5.prototype.nf.apply(this, arguments);
            if (nfRes instanceof Array) {
              return nfRes.map(addNfp);
            } else {
              return addNfp(nfRes);
            }
          };

          function addNfp(num) {
            return parseFloat(num) > 0 ? '+' + num.toString() : num.toString();
          }

          /**
           * Utility function for formatting numbers into strings. Similar to <a href="#/p5/nf">nf()</a> but
           * puts an additional "_" (space) in front of positive numbers just in case to align it with negative
           * numbers which includes "-" (minus) sign.
           * The main usecase of nfs() can be seen when one wants to align the digits (place values) of a non-negative
           * number with some negative number (See the example to get a clear picture).
           * There are two versions: one for formatting float, and one for formatting int.
           * The values for the digits, left, and right parameters should always be positive integers.
           * (IMP): The result on the canvas basically the expected alignment can vary based on the typeface you are using.
           * (NOTE): Be cautious when using left and right parameters as it prepends numbers of 0's if the parameter
           * if greater than the current length of the number.
           * For example if number is 123.2 and left parameter passed is 4 which is greater than length of 123
           * (integer part) i.e 3 than result will be 0123.2. Same case for right parameter i.e. if right is 3 than
           * the result will be 123.200.
           *
           * @method nfs
           * @param {Number}       num      the Number to format
           * @param {Integer}      [left]   number of digits to the left of the decimal
           *                                point
           * @param {Integer}      [right]  number of digits to the right of the
           *                                decimal point
           * @return {String}         formatted String
           *
           * @example
           * <div>
           * <code>
           * var myFont;
           * function preload() {
           *   myFont = loadFont('assets/fonts/inconsolata.ttf');
           * }
           * function setup() {
           *   background(200);
           *   var num1 = 321;
           *   var num2 = -1321;
           *
           *   noStroke();
           *   fill(0);
           *   textFont(myFont);
           *   textSize(22);
           *
           *   // nfs() aligns num1 (positive number) with num2 (negative number) by
           *   // adding a blank space in front of the num1 (positive number)
           *   // [left = 4] in num1 add one 0 in front, to align the digits with num2
           *   // [right = 2] in num1 and num2 adds two 0's after both numbers
           *   // To see the differences check the example of nf() too.
           *   text(nfs(num1, 4, 2), 10, 30);
           *   text(nfs(num2, 4, 2), 10, 80);
           *   // Draw dividing line
           *   stroke(120);
           *   line(0, 50, width, 50);
           * }
           * </code>
           * </div>
           *
           * @alt
           * "0321.00" top middle and "-1321.00" displayed bottom middle
           */
          /**
           * @method nfs
           * @param {Array}        nums     the Numbers to format
           * @param {Integer}      [left]
           * @param {Integer}      [right]
           * @return {String[]}         formatted Strings
           */
          p5.prototype.nfs = function() {
            p5._validateParameters('nfs', arguments);
            var nfRes = p5.prototype.nf.apply(this, arguments);
            if (nfRes instanceof Array) {
              return nfRes.map(addNfs);
            } else {
              return addNfs(nfRes);
            }
          };

          function addNfs(num) {
            return parseFloat(num) >= 0 ? ' ' + num.toString() : num.toString();
          }

          /**
           * The <a href="#/p5/split">split()</a> function maps to String.split(), it breaks a String into
           * pieces using a character or string as the delimiter. The delim parameter
           * specifies the character or characters that mark the boundaries between
           * each piece. A String[] array is returned that contains each of the pieces.
           *
           * The <a href="#/p5/splitTokens">splitTokens()</a> function works in a similar fashion, except that it
           * splits using a range of characters instead of a specific character or
           * sequence.
           *
           * @method split
           * @param  {String} value the String to be split
           * @param  {String} delim the String used to separate the data
           * @return {String[]}  Array of Strings
           * @example
           * <div>
           * <code>
           * var names = 'Pat,Xio,Alex';
           * var splitString = split(names, ',');
           * text(splitString[0], 5, 30);
           * text(splitString[1], 5, 50);
           * text(splitString[2], 5, 70);
           * </code>
           * </div>
           *
           * @alt
           * "pat" top left, "Xio" mid left and "Alex" displayed bottom left
           *
           */
          p5.prototype.split = function(str, delim) {
            p5._validateParameters('split', arguments);
            return str.split(delim);
          };

          /**
           * The <a href="#/p5/splitTokens">splitTokens()</a> function splits a String at one or many character
           * delimiters or "tokens." The delim parameter specifies the character or
           * characters to be used as a boundary.
           * <br><br>
           * If no delim characters are specified, any whitespace character is used to
           * split. Whitespace characters include tab (\t), line feed (\n), carriage
           * return (\r), form feed (\f), and space.
           *
           * @method splitTokens
           * @param  {String} value   the String to be split
           * @param  {String} [delim] list of individual Strings that will be used as
           *                          separators
           * @return {String[]}          Array of Strings
           * @example
           * <div class = "norender">
           * <code>
           * function setup() {
           *   var myStr = 'Mango, Banana, Lime';
           *   var myStrArr = splitTokens(myStr, ',');
           *
           *   print(myStrArr); // prints : ["Mango"," Banana"," Lime"]
           * }
           * </code>
           * </div>
           */
          p5.prototype.splitTokens = function(value, delims) {
            p5._validateParameters('splitTokens', arguments);
            var d;
            if (typeof delims !== 'undefined') {
              var str = delims;
              var sqc = /\]/g.exec(str);
              var sqo = /\[/g.exec(str);
              if (sqo && sqc) {
                str = str.slice(0, sqc.index) + str.slice(sqc.index + 1);
                sqo = /\[/g.exec(str);
                str = str.slice(0, sqo.index) + str.slice(sqo.index + 1);
                d = new RegExp('[\\[' + str + '\\]]', 'g');
              } else if (sqc) {
                str = str.slice(0, sqc.index) + str.slice(sqc.index + 1);
                d = new RegExp('[' + str + '\\]]', 'g');
              } else if (sqo) {
                str = str.slice(0, sqo.index) + str.slice(sqo.index + 1);
                d = new RegExp('[' + str + '\\[]', 'g');
              } else {
                d = new RegExp('[' + str + ']', 'g');
              }
            } else {
              d = /\s/g;
            }
            return value.split(d).filter(function(n) {
              return n;
            });
          };

          /**
           * Removes whitespace characters from the beginning and end of a String. In
           * addition to standard whitespace characters such as space, carriage return,
           * and tab, this function also removes the Unicode "nbsp" character.
           *
           * @method trim
           * @param  {String} str a String to be trimmed
           * @return {String}       a trimmed String
           *
           * @example
           * <div>
           * <code>
           * var string = trim('  No new lines\n   ');
           * text(string + ' here', 2, 50);
           * </code>
           * </div>
           *
           * @alt
           * "No new lines here" displayed center canvas
           */
          /**
           * @method trim
           * @param  {Array} strs an Array of Strings to be trimmed
           * @return {String[]}   an Array of trimmed Strings
           */
          p5.prototype.trim = function(str) {
            p5._validateParameters('trim', arguments);
            if (str instanceof Array) {
              return str.map(this.trim);
            } else {
              return str.trim();
            }
          };

          module.exports = p5;
        },
        { '../core/error_helpers': 20, '../core/main': 24 }
      ],
      64: [
        function(_dereq_, module, exports) {
          /**
           * @module IO
           * @submodule Time & Date
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');

          /**
           * p5.js communicates with the clock on your computer. The <a href="#/p5/day">day()</a> function
           * returns the current day as a value from 1 - 31.
           *
           * @method day
           * @return {Integer} the current day
           * @example
           * <div>
           * <code>
           * var d = day();
           * text('Current day: \n' + d, 5, 50);
           * </code>
           * </div>
           *
           * @alt
           * Current day is displayed
           *
           */
          p5.prototype.day = function() {
            return new Date().getDate();
          };

          /**
           * p5.js communicates with the clock on your computer. The <a href="#/p5/hour">hour()</a> function
           * returns the current hour as a value from 0 - 23.
           *
           * @method hour
           * @return {Integer} the current hour
           * @example
           * <div>
           * <code>
           * var h = hour();
           * text('Current hour:\n' + h, 5, 50);
           * </code>
           * </div>
           *
           * @alt
           * Current hour is displayed
           *
           */
          p5.prototype.hour = function() {
            return new Date().getHours();
          };

          /**
           * p5.js communicates with the clock on your computer. The <a href="#/p5/minute">minute()</a> function
           * returns the current minute as a value from 0 - 59.
           *
           * @method minute
           * @return {Integer} the current minute
           * @example
           * <div>
           * <code>
           * var m = minute();
           * text('Current minute: \n' + m, 5, 50);
           * </code>
           * </div>
           *
           * @alt
           * Current minute is displayed
           *
           */
          p5.prototype.minute = function() {
            return new Date().getMinutes();
          };

          /**
           * Returns the number of milliseconds (thousandths of a second) since
           * starting the program. This information is often used for timing events and
           * animation sequences.
           *
           * @method millis
           * @return {Number} the number of milliseconds since starting the program
           * @example
           * <div>
           * <code>
           * var millisecond = millis();
           * text('Milliseconds \nrunning: \n' + millisecond, 5, 40);
           * </code>
           * </div>
           *
           * @alt
           * number of milliseconds since program has started displayed
           *
           */
          p5.prototype.millis = function() {
            return window.performance.now();
          };

          /**
           * p5.js communicates with the clock on your computer. The <a href="#/p5/month">month()</a> function
           * returns the current month as a value from 1 - 12.
           *
           * @method month
           * @return {Integer} the current month
           * @example
           * <div>
           * <code>
           * var m = month();
           * text('Current month: \n' + m, 5, 50);
           * </code>
           * </div>
           *
           * @alt
           * Current month is displayed
           *
           */
          p5.prototype.month = function() {
            return new Date().getMonth() + 1; //January is 0!
          };

          /**
           * p5.js communicates with the clock on your computer. The <a href="#/p5/second">second()</a> function
           * returns the current second as a value from 0 - 59.
           *
           * @method second
           * @return {Integer} the current second
           * @example
           * <div>
           * <code>
           * var s = second();
           * text('Current second: \n' + s, 5, 50);
           * </code>
           * </div>
           *
           * @alt
           * Current second is displayed
           *
           */
          p5.prototype.second = function() {
            return new Date().getSeconds();
          };

          /**
           * p5.js communicates with the clock on your computer. The <a href="#/p5/year">year()</a> function
           * returns the current year as an integer (2014, 2015, 2016, etc).
           *
           * @method year
           * @return {Integer} the current year
           * @example
           * <div>
           * <code>
           * var y = year();
           * text('Current year: \n' + y, 5, 50);
           * </code>
           * </div>
           *
           * @alt
           * Current year is displayed
           *
           */
          p5.prototype.year = function() {
            return new Date().getFullYear();
          };

          module.exports = p5;
        },
        { '../core/main': 24 }
      ],
      65: [
        function(_dereq_, module, exports) {
          /**
           * @module Shape
           * @submodule 3D Primitives
           * @for p5
           * @requires core
           * @requires p5.Geometry
           */

          'use strict';
          var p5 = _dereq_('../core/main');
          _dereq_('./p5.Geometry');
          var constants = _dereq_('../core/constants');

          /**
           * Draw a plane with given a width and height
           * @method plane
           * @param  {Number} [width]    width of the plane
           * @param  {Number} [height]   height of the plane
           * @param  {Integer} [detailX]  Optional number of triangle
           *                             subdivisions in x-dimension
           * @param {Integer} [detailY]   Optional number of triangle
           *                             subdivisions in y-dimension
           * @chainable
           * @example
           * <div>
           * <code>
           * // draw a plane
           * // with width 50 and height 50
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   plane(50, 50);
           * }
           * </code>
           * </div>
           *
           * @alt
           * Nothing displayed on canvas
           * Rotating interior view of a box with sides that change color.
           * 3d red and green gradient.
           * Rotating interior view of a cylinder with sides that change color.
           * Rotating view of a cylinder with sides that change color.
           * 3d red and green gradient.
           * rotating view of a multi-colored cylinder with concave sides.
           */
          p5.prototype.plane = function(width, height, detailX, detailY) {
            this._assert3d('plane');
            p5._validateParameters('plane', arguments);
            if (typeof width === 'undefined') {
              width = 50;
            }
            if (typeof height === 'undefined') {
              height = width;
            }

            if (typeof detailX === 'undefined') {
              detailX = 1;
            }
            if (typeof detailY === 'undefined') {
              detailY = 1;
            }

            var gId = 'plane|' + detailX + '|' + detailY;

            if (!this._renderer.geometryInHash(gId)) {
              var _plane = function _plane() {
                var u, v, p;
                for (var i = 0; i <= this.detailY; i++) {
                  v = i / this.detailY;
                  for (var j = 0; j <= this.detailX; j++) {
                    u = j / this.detailX;
                    p = new p5.Vector(u - 0.5, v - 0.5, 0);
                    this.vertices.push(p);
                    this.uvs.push(u, v);
                  }
                }
              };
              var planeGeom = new p5.Geometry(detailX, detailY, _plane);
              planeGeom.computeFaces().computeNormals();
              if (detailX <= 1 && detailY <= 1) {
                planeGeom._makeTriangleEdges()._edgesToVertices();
              } else {
                console.log(
                  'Cannot draw stroke on plane objects with more' +
                    ' than 1 detailX or 1 detailY'
                );
              }
              this._renderer.createBuffers(gId, planeGeom);
            }

            this._renderer.drawBuffersScaled(gId, width, height, 1);
            return this;
          };

          /**
           * Draw a box with given width, height and depth
           * @method  box
           * @param  {Number} [width]     width of the box
           * @param  {Number} [Height]    height of the box
           * @param  {Number} [depth]     depth of the box
           * @param {Integer} [detailX]  Optional number of triangle
           *                            subdivisions in x-dimension
           * @param {Integer} [detailY]  Optional number of triangle
           *                            subdivisions in y-dimension
           * @chainable
           * @example
           * <div>
           * <code>
           * // draw a spinning box
           * // with width, height and depth of 50
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   box(50);
           * }
           * </code>
           * </div>
           */
          p5.prototype.box = function(width, height, depth, detailX, detailY) {
            this._assert3d('box');
            p5._validateParameters('box', arguments);
            if (typeof width === 'undefined') {
              width = 50;
            }
            if (typeof height === 'undefined') {
              height = width;
            }
            if (typeof depth === 'undefined') {
              depth = height;
            }

            var perPixelLighting =
              this._renderer.attributes && this._renderer.attributes.perPixelLighting;
            if (typeof detailX === 'undefined') {
              detailX = perPixelLighting ? 1 : 4;
            }
            if (typeof detailY === 'undefined') {
              detailY = perPixelLighting ? 1 : 4;
            }

            var gId = 'box|' + detailX + '|' + detailY;
            if (!this._renderer.geometryInHash(gId)) {
              var _box = function _box() {
                var cubeIndices = [
                  [0, 4, 2, 6], // -1, 0, 0],// -x
                  [1, 3, 5, 7], // +1, 0, 0],// +x
                  [0, 1, 4, 5], // 0, -1, 0],// -y
                  [2, 6, 3, 7], // 0, +1, 0],// +y
                  [0, 2, 1, 3], // 0, 0, -1],// -z
                  [4, 5, 6, 7] // 0, 0, +1] // +z
                ];
                //using strokeIndices instead of faces for strokes
                //to avoid diagonal stroke lines across face of box
                this.strokeIndices = [
                  [0, 1],
                  [1, 3],
                  [3, 2],
                  [6, 7],
                  [8, 9],
                  [9, 11],
                  [14, 15],
                  [16, 17],
                  [17, 19],
                  [18, 19],
                  [20, 21],
                  [22, 23]
                ];

                for (var i = 0; i < cubeIndices.length; i++) {
                  var cubeIndex = cubeIndices[i];
                  var v = i * 4;
                  for (var j = 0; j < 4; j++) {
                    var d = cubeIndex[j];
                    //inspired by lightgl:
                    //https://github.com/evanw/lightgl.js
                    //octants:https://en.wikipedia.org/wiki/Octant_(solid_geometry)
                    var octant = new p5.Vector(
                      ((d & 1) * 2 - 1) / 2,
                      ((d & 2) - 1) / 2,
                      ((d & 4) / 2 - 1) / 2
                    );

                    this.vertices.push(octant);
                    this.uvs.push(j & 1, (j & 2) / 2);
                  }
                  this.faces.push([v, v + 1, v + 2]);
                  this.faces.push([v + 2, v + 1, v + 3]);
                }
              };
              var boxGeom = new p5.Geometry(detailX, detailY, _box);
              boxGeom.computeNormals();
              if (detailX <= 4 && detailY <= 4) {
                boxGeom._makeTriangleEdges()._edgesToVertices();
              } else {
                console.log(
                  'Cannot draw stroke on box objects with more' +
                    ' than 4 detailX or 4 detailY'
                );
              }
              //initialize our geometry buffer with
              //the key val pair:
              //geometry Id, Geom object
              this._renderer.createBuffers(gId, boxGeom);
            }
            this._renderer.drawBuffersScaled(gId, width, height, depth);

            return this;
          };

          /**
           * Draw a sphere with given radius
           * @method sphere
           * @param  {Number} [radius]          radius of circle
           * @param  {Integer} [detailX]        number of segments,
           *                                    the more segments the smoother geometry
           *                                    default is 24
           * @param  {Integer} [detailY]        number of segments,
           *                                    the more segments the smoother geometry
           *                                    default is 16
           * @chainable
           * @example
           * <div>
           * <code>
           * // draw a sphere with radius 40
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   sphere(40);
           * }
           * </code>
           * </div>
           */
          p5.prototype.sphere = function(radius, detailX, detailY) {
            this._assert3d('sphere');
            p5._validateParameters('sphere', arguments);
            if (typeof radius === 'undefined') {
              radius = 50;
            }
            if (typeof detailX === 'undefined') {
              detailX = 24;
            }
            if (typeof detailY === 'undefined') {
              detailY = 16;
            }

            this.ellipsoid(radius, radius, radius, detailX, detailY);

            return this;
          };

          /**
           * @private
           * Helper function for creating both cones and cyllinders
           * Will only generate well-defined geometry when bottomRadius, height > 0
           * and topRadius >= 0
           * If topRadius == 0, topCap should be false
           */
          var _truncatedCone = function _truncatedCone(
            bottomRadius,
            topRadius,
            height,
            detailX,
            detailY,
            bottomCap,
            topCap
          ) {
            bottomRadius = bottomRadius <= 0 ? 1 : bottomRadius;
            topRadius = topRadius < 0 ? 0 : topRadius;
            height = height <= 0 ? bottomRadius : height;
            detailX = detailX < 3 ? 3 : detailX;
            detailY = detailY < 1 ? 1 : detailY;
            bottomCap = bottomCap === undefined ? true : bottomCap;
            topCap = topCap === undefined ? topRadius !== 0 : topCap;
            var start = bottomCap ? -2 : 0;
            var end = detailY + (topCap ? 2 : 0);
            //ensure constant slant for interior vertex normals
            var slant = Math.atan2(bottomRadius - topRadius, height);
            var sinSlant = Math.sin(slant);
            var cosSlant = Math.cos(slant);
            var yy, ii, jj;
            for (yy = start; yy <= end; ++yy) {
              var v = yy / detailY;
              var y = height * v;
              var ringRadius;
              if (yy < 0) {
                //for the bottomCap edge
                y = 0;
                v = 0;
                ringRadius = bottomRadius;
              } else if (yy > detailY) {
                //for the topCap edge
                y = height;
                v = 1;
                ringRadius = topRadius;
              } else {
                //for the middle
                ringRadius = bottomRadius + (topRadius - bottomRadius) * v;
              }
              if (yy === -2 || yy === detailY + 2) {
                //center of bottom or top caps
                ringRadius = 0;
              }

              y -= height / 2; //shift coordiate origin to the center of object
              for (ii = 0; ii < detailX; ++ii) {
                var u = ii / detailX;
                var ur = 2 * Math.PI * u;
                var sur = Math.sin(ur);
                var cur = Math.cos(ur);

                //VERTICES
                this.vertices.push(new p5.Vector(sur * ringRadius, y, cur * ringRadius));

                //VERTEX NORMALS
                var vertexNormal;
                if (yy < 0) {
                  vertexNormal = new p5.Vector(0, -1, 0);
                } else if (yy > detailY && topRadius) {
                  vertexNormal = new p5.Vector(0, 1, 0);
                } else {
                  vertexNormal = new p5.Vector(sur * cosSlant, sinSlant, cur * cosSlant);
                }
                this.vertexNormals.push(vertexNormal);
                //UVs
                this.uvs.push(u, v);
              }
            }

            var startIndex = 0;
            if (bottomCap) {
              for (jj = 0; jj < detailX; ++jj) {
                var nextjj = (jj + 1) % detailX;
                this.faces.push([
                  startIndex + jj,
                  startIndex + detailX + nextjj,
                  startIndex + detailX + jj
                ]);
              }
              startIndex += detailX * 2;
            }
            for (yy = 0; yy < detailY; ++yy) {
              for (ii = 0; ii < detailX; ++ii) {
                var nextii = (ii + 1) % detailX;
                this.faces.push([
                  startIndex + ii,
                  startIndex + nextii,
                  startIndex + detailX + nextii
                ]);

                this.faces.push([
                  startIndex + ii,
                  startIndex + detailX + nextii,
                  startIndex + detailX + ii
                ]);
              }
              startIndex += detailX;
            }
            if (topCap) {
              startIndex += detailX;
              for (ii = 0; ii < detailX; ++ii) {
                this.faces.push([
                  startIndex + ii,
                  startIndex + (ii + 1) % detailX,
                  startIndex + detailX
                ]);
              }
            }
          };

          /**
           * Draw a cylinder with given radius and height
           * @method cylinder
           * @param  {Number}  [radius]    radius of the surface
           * @param  {Number}  [height]    height of the cylinder
           * @param  {Integer} [detailX]   number of segments,
           *                               the more segments the smoother geometry
           *                               default is 24
           * @param  {Integer} [detailY]   number of segments in y-dimension,
           *                               the more segments the smoother geometry
           *                               default is 1
           * @param  {Boolean} [bottomCap] whether to draw the bottom of the cylinder
           * @param  {Boolean} [topCap]    whether to draw the top of the cylinder
           * @chainable
           * @example
           * <div>
           * <code>
           * // draw a spinning cylinder
           * // with radius 20 and height 50
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   rotateX(frameCount * 0.01);
           *   rotateZ(frameCount * 0.01);
           *   cylinder(20, 50);
           * }
           * </code>
           * </div>
           */
          p5.prototype.cylinder = function(
            radius,
            height,
            detailX,
            detailY,
            bottomCap,
            topCap
          ) {
            this._assert3d('cylinder');
            p5._validateParameters('cylinder', arguments);
            if (typeof radius === 'undefined') {
              radius = 50;
            }
            if (typeof height === 'undefined') {
              height = radius;
            }
            if (typeof detailX === 'undefined') {
              detailX = 24;
            }
            if (typeof detailY === 'undefined') {
              detailY = 1;
            }
            if (typeof topCap === 'undefined') {
              topCap = true;
            }
            if (typeof bottomCap === 'undefined') {
              bottomCap = true;
            }

            var gId =
              'cylinder|' + detailX + '|' + detailY + '|' + bottomCap + '|' + topCap;
            if (!this._renderer.geometryInHash(gId)) {
              var cylinderGeom = new p5.Geometry(detailX, detailY);
              _truncatedCone.call(
                cylinderGeom,
                1,
                1,
                1,
                detailX,
                detailY,
                bottomCap,
                topCap
              );

              // normals are computed in call to _truncatedCone
              if (detailX <= 24 && detailY <= 16) {
                cylinderGeom._makeTriangleEdges()._edgesToVertices();
              } else {
                console.log(
                  'Cannot draw stroke on cylinder objects with more' +
                    ' than 24 detailX or 16 detailY'
                );
              }
              this._renderer.createBuffers(gId, cylinderGeom);
            }

            this._renderer.drawBuffersScaled(gId, radius, height, radius);

            return this;
          };

          /**
           * Draw a cone with given radius and height
           * @method cone
           * @param  {Number}  [radius]  radius of the bottom surface
           * @param  {Number}  [height]  height of the cone
           * @param  {Integer} [detailX] number of segments,
           *                             the more segments the smoother geometry
           *                             default is 24
           * @param  {Integer} [detailY] number of segments,
           *                             the more segments the smoother geometry
           *                             default is 1
           * @param  {Boolean} [cap]     whether to draw the base of the cone
           * @chainable
           * @example
           * <div>
           * <code>
           * // draw a spinning cone
           * // with radius 40 and height 70
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   rotateX(frameCount * 0.01);
           *   rotateZ(frameCount * 0.01);
           *   cone(40, 70);
           * }
           * </code>
           * </div>
           */
          p5.prototype.cone = function(radius, height, detailX, detailY, cap) {
            this._assert3d('cone');
            p5._validateParameters('cone', arguments);
            if (typeof radius === 'undefined') {
              radius = 50;
            }
            if (typeof height === 'undefined') {
              height = radius;
            }
            if (typeof detailX === 'undefined') {
              detailX = 24;
            }
            if (typeof detailY === 'undefined') {
              detailY = 1;
            }
            if (typeof cap === 'undefined') {
              cap = true;
            }

            var gId = 'cone|' + detailX + '|' + detailY + '|' + cap;
            if (!this._renderer.geometryInHash(gId)) {
              var coneGeom = new p5.Geometry(detailX, detailY);
              _truncatedCone.call(coneGeom, 1, 0, 1, detailX, detailY, cap, false);
              if (detailX <= 24 && detailY <= 16) {
                coneGeom._makeTriangleEdges()._edgesToVertices();
              } else {
                console.log(
                  'Cannot draw stroke on cone objects with more' +
                    ' than 24 detailX or 16 detailY'
                );
              }
              this._renderer.createBuffers(gId, coneGeom);
            }

            this._renderer.drawBuffersScaled(gId, radius, height, radius);

            return this;
          };

          /**
           * Draw an ellipsoid with given radius
           * @method ellipsoid
           * @param  {Number} [radiusx]         x-radius of ellipsoid
           * @param  {Number} [radiusy]         y-radius of ellipsoid
           * @param  {Number} [radiusz]         z-radius of ellipsoid
           * @param  {Integer} [detailX]        number of segments,
           *                                    the more segments the smoother geometry
           *                                    default is 24. Avoid detail number above
           *                                    150, it may crash the browser.
           * @param  {Integer} [detailY]        number of segments,
           *                                    the more segments the smoother geometry
           *                                    default is 16. Avoid detail number above
           *                                    150, it may crash the browser.
           * @chainable
           * @example
           * <div>
           * <code>
           * // draw an ellipsoid
           * // with radius 30, 40 and 40.
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   ellipsoid(30, 40, 40);
           * }
           * </code>
           * </div>
           */
          p5.prototype.ellipsoid = function(radiusX, radiusY, radiusZ, detailX, detailY) {
            this._assert3d('ellipsoid');
            p5._validateParameters('ellipsoid', arguments);
            if (typeof radiusX === 'undefined') {
              radiusX = 50;
            }
            if (typeof radiusY === 'undefined') {
              radiusY = radiusX;
            }
            if (typeof radiusZ === 'undefined') {
              radiusZ = radiusX;
            }

            if (typeof detailX === 'undefined') {
              detailX = 24;
            }
            if (typeof detailY === 'undefined') {
              detailY = 16;
            }

            var gId = 'ellipsoid|' + detailX + '|' + detailY;

            if (!this._renderer.geometryInHash(gId)) {
              var _ellipsoid = function _ellipsoid() {
                for (var i = 0; i <= this.detailY; i++) {
                  var v = i / this.detailY;
                  var phi = Math.PI * v - Math.PI / 2;
                  var cosPhi = Math.cos(phi);
                  var sinPhi = Math.sin(phi);

                  for (var j = 0; j <= this.detailX; j++) {
                    var u = j / this.detailX;
                    var theta = 2 * Math.PI * u;
                    var cosTheta = Math.cos(theta);
                    var sinTheta = Math.sin(theta);
                    var p = new p5.Vector(cosPhi * sinTheta, sinPhi, cosPhi * cosTheta);
                    this.vertices.push(p);
                    this.vertexNormals.push(p);
                    this.uvs.push(u, v);
                  }
                }
              };
              var ellipsoidGeom = new p5.Geometry(detailX, detailY, _ellipsoid);
              ellipsoidGeom.computeFaces();
              if (detailX <= 24 && detailY <= 24) {
                ellipsoidGeom._makeTriangleEdges()._edgesToVertices();
              } else {
                console.log(
                  'Cannot draw stroke on ellipsoids with more' +
                    ' than 24 detailX or 24 detailY'
                );
              }
              this._renderer.createBuffers(gId, ellipsoidGeom);
            }

            this._renderer.drawBuffersScaled(gId, radiusX, radiusY, radiusZ);

            return this;
          };

          /**
           * Draw a torus with given radius and tube radius
           * @method torus
           * @param  {Number} [radius]      radius of the whole ring
           * @param  {Number} [tubeRadius]  radius of the tube
           * @param  {Integer} [detailX]    number of segments in x-dimension,
           *                                the more segments the smoother geometry
           *                                default is 24
           * @param  {Integer} [detailY]    number of segments in y-dimension,
           *                                the more segments the smoother geometry
           *                                default is 16
           * @chainable
           * @example
           * <div>
           * <code>
           * // draw a spinning torus
           * // with ring radius 30 and tube radius 15
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   torus(30, 15);
           * }
           * </code>
           * </div>
           */
          p5.prototype.torus = function(radius, tubeRadius, detailX, detailY) {
            this._assert3d('torus');
            p5._validateParameters('torus', arguments);
            if (typeof radius === 'undefined') {
              radius = 50;
            } else if (!radius) {
              return; // nothing to draw
            }

            if (typeof tubeRadius === 'undefined') {
              tubeRadius = 10;
            } else if (!tubeRadius) {
              return; // nothing to draw
            }

            if (typeof detailX === 'undefined') {
              detailX = 24;
            }
            if (typeof detailY === 'undefined') {
              detailY = 16;
            }

            var tubeRatio = (tubeRadius / radius).toPrecision(4);
            var gId = 'torus|' + tubeRatio + '|' + detailX + '|' + detailY;

            if (!this._renderer.geometryInHash(gId)) {
              var _torus = function _torus() {
                for (var i = 0; i <= this.detailY; i++) {
                  var v = i / this.detailY;
                  var phi = 2 * Math.PI * v;
                  var cosPhi = Math.cos(phi);
                  var sinPhi = Math.sin(phi);
                  var r = 1 + tubeRatio * cosPhi;

                  for (var j = 0; j <= this.detailX; j++) {
                    var u = j / this.detailX;
                    var theta = 2 * Math.PI * u;
                    var cosTheta = Math.cos(theta);
                    var sinTheta = Math.sin(theta);

                    var p = new p5.Vector(r * cosTheta, r * sinTheta, tubeRatio * sinPhi);

                    var n = new p5.Vector(cosPhi * cosTheta, cosPhi * sinTheta, sinPhi);

                    this.vertices.push(p);
                    this.vertexNormals.push(n);
                    this.uvs.push(u, v);
                  }
                }
              };
              var torusGeom = new p5.Geometry(detailX, detailY, _torus);
              torusGeom.computeFaces();
              if (detailX <= 24 && detailY <= 16) {
                torusGeom._makeTriangleEdges()._edgesToVertices();
              } else {
                console.log(
                  'Cannot draw strokes on torus object with more' +
                    ' than 24 detailX or 16 detailY'
                );
              }
              this._renderer.createBuffers(gId, torusGeom);
            }
            this._renderer.drawBuffersScaled(gId, radius, radius, radius);

            return this;
          };

          ///////////////////////
          /// 2D primitives
          /////////////////////////

          /**
           * Draws a point, a coordinate in space at the dimension of one pixel,
           * given x, y and z coordinates. The color of the point is determined
           * by the current stroke, while the point size is determined by current
           * stroke weight.
           * @private
           * @param {Number} x x-coordinate of point
           * @param {Number} y y-coordinate of point
           * @param {Number} z z-coordinate of point
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(50);
           *   stroke(255);
           *   strokeWeight(4);
           *   point(25, 0);
           *   strokeWeight(3);
           *   point(-25, 0);
           *   strokeWeight(2);
           *   point(0, 25);
           *   strokeWeight(1);
           *   point(0, -25);
           * }
           * </code>
           * </div>
           */
          p5.RendererGL.prototype.point = function(x, y, z) {
            if (typeof z === 'undefined') {
              z = 0;
            }

            var _vertex = [];
            _vertex.push(new p5.Vector(x, y, z));
            this._drawPoints(_vertex, this._pointVertexBuffer);

            return this;
          };

          p5.RendererGL.prototype.triangle = function(args) {
            var x1 = args[0],
              y1 = args[1];
            var x2 = args[2],
              y2 = args[3];
            var x3 = args[4],
              y3 = args[5];

            var gId = 'tri';
            if (!this.geometryInHash(gId)) {
              var _triangle = function _triangle() {
                var vertices = [];
                vertices.push(new p5.Vector(0, 0, 0));
                vertices.push(new p5.Vector(0, 1, 0));
                vertices.push(new p5.Vector(1, 0, 0));
                this.strokeIndices = [[0, 1], [1, 2], [2, 0]];
                this.vertices = vertices;
                this.faces = [[0, 1, 2]];
                this.uvs = [0, 0, 0, 1, 1, 1];
              };
              var triGeom = new p5.Geometry(1, 1, _triangle);
              triGeom._makeTriangleEdges()._edgesToVertices();
              triGeom.computeNormals();
              this.createBuffers(gId, triGeom);
            }

            // only one triangle is cached, one point is at the origin, and the
            // two adjacent sides are tne unit vectors along the X & Y axes.
            //
            // this matrix multiplication transforms those two unit vectors
            // onto the required vector prior to rendering, and moves the
            // origin appropriately.
            var uMVMatrix = this.uMVMatrix.copy();
            try {
              // prettier-ignore
              var mult = new p5.Matrix([
    x2 - x1, y2 - y1, 0, 0, // the resulting unit X-axis
    x3 - x1, y3 - y1, 0, 0, // the resulting unit Y-axis
    0, 0, 1, 0, // the resulting unit Z-axis (unchanged)
    x1, y1, 0, 1 // the resulting origin
    ]).mult(this.uMVMatrix);

              this.uMVMatrix = mult;

              this.drawBuffers(gId);
            } finally {
              this.uMVMatrix = uMVMatrix;
            }

            return this;
          };

          p5.RendererGL.prototype.ellipse = function(args) {
            this.arc(
              args[0],
              args[1],
              args[2],
              args[3],
              0,
              constants.TWO_PI,
              constants.OPEN,
              args[4]
            );
          };

          p5.RendererGL.prototype.arc = function(args) {
            var x = arguments[0];
            var y = arguments[1];
            var width = arguments[2];
            var height = arguments[3];
            var start = arguments[4];
            var stop = arguments[5];
            var mode = arguments[6];
            var detail = arguments[7] || 25;

            var shape;
            var gId;

            // check if it is an ellipse or an arc
            if (Math.abs(stop - start) >= constants.TWO_PI) {
              shape = 'ellipse';
              gId = shape + '|' + detail + '|';
            } else {
              shape = 'arc';
              gId = shape + '|' + start + '|' + stop + '|' + mode + '|' + detail + '|';
            }

            if (!this.geometryInHash(gId)) {
              var _arc = function _arc() {
                this.strokeIndices = [];

                // if the start and stop angles are not the same, push vertices to the array
                if (start.toFixed(10) !== stop.toFixed(10)) {
                  // if the mode specified is PIE or null, push the mid point of the arc in vertices
                  if (mode === constants.PIE || typeof mode === 'undefined') {
                    this.vertices.push(new p5.Vector(0.5, 0.5, 0));
                    this.uvs.push([0.5, 0.5]);
                  }

                  // vertices for the perimeter of the circle
                  for (var i = 0; i <= detail; i++) {
                    var u = i / detail;
                    var theta = (stop - start) * u + start;

                    var _x = 0.5 + Math.cos(theta) / 2;
                    var _y = 0.5 + Math.sin(theta) / 2;

                    this.vertices.push(new p5.Vector(_x, _y, 0));
                    this.uvs.push([_x, _y]);

                    if (i < detail - 1) {
                      this.faces.push([0, i + 1, i + 2]);
                      this.strokeIndices.push([i + 1, i + 2]);
                    }
                  }

                  // check the mode specified in order to push vertices and faces, different for each mode
                  switch (mode) {
                    case constants.PIE:
                      this.faces.push([
                        0,
                        this.vertices.length - 2,
                        this.vertices.length - 1
                      ]);

                      this.strokeIndices.push([0, 1]);
                      this.strokeIndices.push([
                        this.vertices.length - 2,
                        this.vertices.length - 1
                      ]);

                      this.strokeIndices.push([0, this.vertices.length - 1]);
                      break;

                    case constants.CHORD:
                      this.strokeIndices.push([0, 1]);
                      this.strokeIndices.push([0, this.vertices.length - 1]);
                      break;

                    case constants.OPEN:
                      this.strokeIndices.push([0, 1]);
                      break;

                    default:
                      this.faces.push([
                        0,
                        this.vertices.length - 2,
                        this.vertices.length - 1
                      ]);

                      this.strokeIndices.push([
                        this.vertices.length - 2,
                        this.vertices.length - 1
                      ]);
                  }
                }
              };

              var arcGeom = new p5.Geometry(detail, 1, _arc);
              arcGeom.computeNormals();

              if (detail <= 50) {
                arcGeom._makeTriangleEdges()._edgesToVertices(arcGeom);
              } else {
                console.log('Cannot stroke ' + shape + ' with more than 50 detail');
              }

              this.createBuffers(gId, arcGeom);
            }

            var uMVMatrix = this.uMVMatrix.copy();

            try {
              this.uMVMatrix.translate([x, y, 0]);
              this.uMVMatrix.scale(width, height, 1);

              this.drawBuffers(gId);
            } finally {
              this.uMVMatrix = uMVMatrix;
            }

            return this;
          };

          p5.RendererGL.prototype.rect = function(args) {
            var perPixelLighting = this._pInst._glAttributes.perPixelLighting;
            var x = args[0];
            var y = args[1];
            var width = args[2];
            var height = args[3];
            var detailX = args[4] || (perPixelLighting ? 1 : 24);
            var detailY = args[5] || (perPixelLighting ? 1 : 16);
            var gId = 'rect|' + detailX + '|' + detailY;
            if (!this.geometryInHash(gId)) {
              var _rect = function _rect() {
                for (var i = 0; i <= this.detailY; i++) {
                  var v = i / this.detailY;
                  for (var j = 0; j <= this.detailX; j++) {
                    var u = j / this.detailX;
                    var p = new p5.Vector(u, v, 0);
                    this.vertices.push(p);
                    this.uvs.push(u, v);
                  }
                }
                // using stroke indices to avoid stroke over face(s) of rectangle
                if (detailX > 0 && detailY > 0) {
                  this.strokeIndices = [
                    [0, detailX],
                    [detailX, (detailX + 1) * (detailY + 1) - 1],
                    [(detailX + 1) * (detailY + 1) - 1, (detailX + 1) * detailY],
                    [(detailX + 1) * detailY, 0]
                  ];
                }
              };
              var rectGeom = new p5.Geometry(detailX, detailY, _rect);
              rectGeom
                .computeFaces()
                .computeNormals()
                ._makeTriangleEdges()
                ._edgesToVertices();
              this.createBuffers(gId, rectGeom);
            }

            // only a single rectangle (of a given detail) is cached: a square with
            // opposite corners at (0,0) & (1,1).
            //
            // before rendering, this square is scaled & moved to the required location.
            var uMVMatrix = this.uMVMatrix.copy();
            try {
              this.uMVMatrix.translate([x, y, 0]);
              this.uMVMatrix.scale(width, height, 1);

              this.drawBuffers(gId);
            } finally {
              this.uMVMatrix = uMVMatrix;
            }
            return this;
          };

          // prettier-ignore
          p5.RendererGL.prototype.quad = function (x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4) {
  var gId =
  'quad|' +
  x1 +
  '|' +
  y1 +
  '|' +
  z1 +
  '|' +
  x2 +
  '|' +
  y2 +
  '|' +
  z2 +
  '|' +
  x3 +
  '|' +
  y3 +
  '|' +
  z3 +
  '|' +
  x4 +
  '|' +
  y4 +
  '|' +
  z4;
  if (!this.geometryInHash(gId)) {
    var _quad = function _quad() {
      this.vertices.push(new p5.Vector(x1, y1, z1));
      this.vertices.push(new p5.Vector(x2, y2, z2));
      this.vertices.push(new p5.Vector(x3, y3, z3));
      this.vertices.push(new p5.Vector(x4, y4, z4));
      this.uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
      this.strokeIndices = [[0, 1], [1, 2], [2, 3], [3, 0]];
    };
    var quadGeom = new p5.Geometry(2, 2, _quad);
    quadGeom.
    computeNormals().
    _makeTriangleEdges().
    _edgesToVertices();
    quadGeom.faces = [[0, 1, 2], [2, 3, 0]];
    this.createBuffers(gId, quadGeom);
  }
  this.drawBuffers(gId);
  return this;
};

          //this implementation of bezier curve
          //is based on Bernstein polynomial
          // pretier-ignore
          p5.RendererGL.prototype.bezier = function(
            x1,
            y1,
            z1, // x2
            x2, // y2
            y2, // x3
            z2, // y3
            x3, // x4
            y3, // y4
            z3,
            x4,
            y4,
            z4
          ) {
            if (arguments.length === 8) {
              y4 = y3;
              x4 = x3;
              y3 = z2;
              x3 = y2;
              y2 = x2;
              x2 = z1;
              z1 = z2 = z3 = z4 = 0;
            }
            var bezierDetail = this._pInst._bezierDetail || 20; //value of Bezier detail
            this.beginShape();
            for (var i = 0; i <= bezierDetail; i++) {
              var c1 = Math.pow(1 - i / bezierDetail, 3);
              var c2 = 3 * (i / bezierDetail) * Math.pow(1 - i / bezierDetail, 2);
              var c3 = 3 * Math.pow(i / bezierDetail, 2) * (1 - i / bezierDetail);
              var c4 = Math.pow(i / bezierDetail, 3);
              this.vertex(
                x1 * c1 + x2 * c2 + x3 * c3 + x4 * c4,
                y1 * c1 + y2 * c2 + y3 * c3 + y4 * c4,
                z1 * c1 + z2 * c2 + z3 * c3 + z4 * c4
              );
            }
            this.endShape();
            return this;
          };

          // pretier-ignore
          p5.RendererGL.prototype.curve = function(
            x1,
            y1,
            z1, // x2
            x2, // y2
            y2, // x3
            z2, // y3
            x3, // x4
            y3, // y4
            z3,
            x4,
            y4,
            z4
          ) {
            if (arguments.length === 8) {
              x4 = x3;
              y4 = y3;
              x3 = y2;
              y3 = x2;
              x2 = z1;
              y2 = x2;
              z1 = z2 = z3 = z4 = 0;
            }
            var curveDetail = this._pInst._curveDetail;
            this.beginShape();
            for (var i = 0; i <= curveDetail; i++) {
              var c1 = Math.pow(i / curveDetail, 3) * 0.5;
              var c2 = Math.pow(i / curveDetail, 2) * 0.5;
              var c3 = i / curveDetail * 0.5;
              var c4 = 0.5;
              var vx =
                c1 * (-x1 + 3 * x2 - 3 * x3 + x4) +
                c2 * (2 * x1 - 5 * x2 + 4 * x3 - x4) +
                c3 * (-x1 + x3) +
                c4 * (2 * x2);
              var vy =
                c1 * (-y1 + 3 * y2 - 3 * y3 + y4) +
                c2 * (2 * y1 - 5 * y2 + 4 * y3 - y4) +
                c3 * (-y1 + y3) +
                c4 * (2 * y2);
              var vz =
                c1 * (-z1 + 3 * z2 - 3 * z3 + z4) +
                c2 * (2 * z1 - 5 * z2 + 4 * z3 - z4) +
                c3 * (-z1 + z3) +
                c4 * (2 * z2);
              this.vertex(vx, vy, vz);
            }
            this.endShape();
            return this;
          };

          /**
           * Draw a line given two points
           * @private
           * @param {Number} x0 x-coordinate of first vertex
           * @param {Number} y0 y-coordinate of first vertex
           * @param {Number} z0 z-coordinate of first vertex
           * @param {Number} x1 x-coordinate of second vertex
           * @param {Number} y1 y-coordinate of second vertex
           * @param {Number} z1 z-coordinate of second vertex
           * @chainable
           * @example
           * <div>
           * <code>
           * //draw a line
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   // Use fill instead of stroke to change the color of shape.
           *   fill(255, 0, 0);
           *   line(10, 10, 0, 60, 60, 20);
           * }
           * </code>
           * </div>
           */
          p5.RendererGL.prototype.line = function() {
            if (arguments.length === 6) {
              this.beginShape();
              this.vertex(arguments[0], arguments[1], arguments[2]);
              this.vertex(arguments[3], arguments[4], arguments[5]);
              this.endShape();
            } else if (arguments.length === 4) {
              this.beginShape();
              this.vertex(arguments[0], arguments[1], 0);
              this.vertex(arguments[2], arguments[3], 0);
              this.endShape();
            }
            return this;
          };

          p5.RendererGL.prototype.bezierVertex = function() {
            if (this.immediateMode._bezierVertex.length === 0) {
              throw Error('vertex() must be used once before calling bezierVertex()');
            } else {
              var w_x = [];
              var w_y = [];
              var w_z = [];
              var t, _x, _y, _z, i;
              var argLength = arguments.length;

              t = 0;

              if (
                this._lookUpTableBezier.length === 0 ||
                this._lutBezierDetail !== this._pInst._curveDetail
              ) {
                this._lookUpTableBezier = [];
                this._lutBezierDetail = this._pInst._curveDetail;
                var step = 1 / this._lutBezierDetail;
                var start = 0;
                var end = 1;
                var j = 0;
                while (start < 1) {
                  t = parseFloat(start.toFixed(6));
                  this._lookUpTableBezier[j] = this._bezierCoefficients(t);
                  if (end.toFixed(6) === step.toFixed(6)) {
                    t = parseFloat(end.toFixed(6)) + parseFloat(start.toFixed(6));
                    ++j;
                    this._lookUpTableBezier[j] = this._bezierCoefficients(t);
                    break;
                  }
                  start += step;
                  end -= step;
                  ++j;
                }
              }

              var LUTLength = this._lookUpTableBezier.length;

              if (argLength === 6) {
                this.isBezier = true;

                w_x = [
                  this.immediateMode._bezierVertex[0],
                  arguments[0],
                  arguments[2],
                  arguments[4]
                ];

                w_y = [
                  this.immediateMode._bezierVertex[1],
                  arguments[1],
                  arguments[3],
                  arguments[5]
                ];

                for (i = 0; i < LUTLength; i++) {
                  _x =
                    w_x[0] * this._lookUpTableBezier[i][0] +
                    w_x[1] * this._lookUpTableBezier[i][1] +
                    w_x[2] * this._lookUpTableBezier[i][2] +
                    w_x[3] * this._lookUpTableBezier[i][3];
                  _y =
                    w_y[0] * this._lookUpTableBezier[i][0] +
                    w_y[1] * this._lookUpTableBezier[i][1] +
                    w_y[2] * this._lookUpTableBezier[i][2] +
                    w_y[3] * this._lookUpTableBezier[i][3];
                  this.vertex(_x, _y);
                }
                this.immediateMode._bezierVertex[0] = arguments[4];
                this.immediateMode._bezierVertex[1] = arguments[5];
              } else if (argLength === 9) {
                this.isBezier = true;

                w_x = [
                  this.immediateMode._bezierVertex[0],
                  arguments[0],
                  arguments[3],
                  arguments[6]
                ];

                w_y = [
                  this.immediateMode._bezierVertex[1],
                  arguments[1],
                  arguments[4],
                  arguments[7]
                ];

                w_z = [
                  this.immediateMode._bezierVertex[2],
                  arguments[2],
                  arguments[5],
                  arguments[8]
                ];

                for (i = 0; i < LUTLength; i++) {
                  _x =
                    w_x[0] * this._lookUpTableBezier[i][0] +
                    w_x[1] * this._lookUpTableBezier[i][1] +
                    w_x[2] * this._lookUpTableBezier[i][2] +
                    w_x[3] * this._lookUpTableBezier[i][3];
                  _y =
                    w_y[0] * this._lookUpTableBezier[i][0] +
                    w_y[1] * this._lookUpTableBezier[i][1] +
                    w_y[2] * this._lookUpTableBezier[i][2] +
                    w_y[3] * this._lookUpTableBezier[i][3];
                  _z =
                    w_z[0] * this._lookUpTableBezier[i][0] +
                    w_z[1] * this._lookUpTableBezier[i][1] +
                    w_z[2] * this._lookUpTableBezier[i][2] +
                    w_z[3] * this._lookUpTableBezier[i][3];
                  this.vertex(_x, _y, _z);
                }
                this.immediateMode._bezierVertex[0] = arguments[6];
                this.immediateMode._bezierVertex[1] = arguments[7];
                this.immediateMode._bezierVertex[2] = arguments[8];
              }
            }
          };

          p5.RendererGL.prototype.quadraticVertex = function() {
            if (this.immediateMode._quadraticVertex.length === 0) {
              throw Error('vertex() must be used once before calling quadraticVertex()');
            } else {
              var w_x = [];
              var w_y = [];
              var w_z = [];
              var t, _x, _y, _z, i;
              var argLength = arguments.length;

              t = 0;

              if (
                this._lookUpTableQuadratic.length === 0 ||
                this._lutQuadraticDetail !== this._pInst._curveDetail
              ) {
                this._lookUpTableQuadratic = [];
                this._lutQuadraticDetail = this._pInst._curveDetail;
                var step = 1 / this._lutQuadraticDetail;
                var start = 0;
                var end = 1;
                var j = 0;
                while (start < 1) {
                  t = parseFloat(start.toFixed(6));
                  this._lookUpTableQuadratic[j] = this._quadraticCoefficients(t);
                  if (end.toFixed(6) === step.toFixed(6)) {
                    t = parseFloat(end.toFixed(6)) + parseFloat(start.toFixed(6));
                    ++j;
                    this._lookUpTableQuadratic[j] = this._quadraticCoefficients(t);
                    break;
                  }
                  start += step;
                  end -= step;
                  ++j;
                }
              }

              var LUTLength = this._lookUpTableQuadratic.length;

              if (argLength === 4) {
                this.isQuadratic = true;

                w_x = [this.immediateMode._quadraticVertex[0], arguments[0], arguments[2]];

                w_y = [this.immediateMode._quadraticVertex[1], arguments[1], arguments[3]];

                for (i = 0; i < LUTLength; i++) {
                  _x =
                    w_x[0] * this._lookUpTableQuadratic[i][0] +
                    w_x[1] * this._lookUpTableQuadratic[i][1] +
                    w_x[2] * this._lookUpTableQuadratic[i][2];
                  _y =
                    w_y[0] * this._lookUpTableQuadratic[i][0] +
                    w_y[1] * this._lookUpTableQuadratic[i][1] +
                    w_y[2] * this._lookUpTableQuadratic[i][2];
                  this.vertex(_x, _y);
                }

                this.immediateMode._quadraticVertex[0] = arguments[2];
                this.immediateMode._quadraticVertex[1] = arguments[3];
              } else if (argLength === 6) {
                this.isQuadratic = true;

                w_x = [this.immediateMode._quadraticVertex[0], arguments[0], arguments[3]];

                w_y = [this.immediateMode._quadraticVertex[1], arguments[1], arguments[4]];

                w_z = [this.immediateMode._quadraticVertex[2], arguments[2], arguments[5]];

                for (i = 0; i < LUTLength; i++) {
                  _x =
                    w_x[0] * this._lookUpTableQuadratic[i][0] +
                    w_x[1] * this._lookUpTableQuadratic[i][1] +
                    w_x[2] * this._lookUpTableQuadratic[i][2];
                  _y =
                    w_y[0] * this._lookUpTableQuadratic[i][0] +
                    w_y[1] * this._lookUpTableQuadratic[i][1] +
                    w_y[2] * this._lookUpTableQuadratic[i][2];
                  _z =
                    w_z[0] * this._lookUpTableQuadratic[i][0] +
                    w_z[1] * this._lookUpTableQuadratic[i][1] +
                    w_z[2] * this._lookUpTableQuadratic[i][2];
                  this.vertex(_x, _y, _z);
                }

                this.immediateMode._quadraticVertex[0] = arguments[3];
                this.immediateMode._quadraticVertex[1] = arguments[4];
                this.immediateMode._quadraticVertex[2] = arguments[5];
              }
            }
          };

          p5.RendererGL.prototype.curveVertex = function() {
            var w_x = [];
            var w_y = [];
            var w_z = [];
            var t, _x, _y, _z, i;
            t = 0;
            var argLength = arguments.length;

            if (
              this._lookUpTableBezier.length === 0 ||
              this._lutBezierDetail !== this._pInst._curveDetail
            ) {
              this._lookUpTableBezier = [];
              this._lutBezierDetail = this._pInst._curveDetail;
              var step = 1 / this._lutBezierDetail;
              var start = 0;
              var end = 1;
              var j = 0;
              while (start < 1) {
                t = parseFloat(start.toFixed(6));
                this._lookUpTableBezier[j] = this._bezierCoefficients(t);
                if (end.toFixed(6) === step.toFixed(6)) {
                  t = parseFloat(end.toFixed(6)) + parseFloat(start.toFixed(6));
                  ++j;
                  this._lookUpTableBezier[j] = this._bezierCoefficients(t);
                  break;
                }
                start += step;
                end -= step;
                ++j;
              }
            }

            var LUTLength = this._lookUpTableBezier.length;

            if (argLength === 2) {
              this.immediateMode._curveVertex.push(arguments[0]);
              this.immediateMode._curveVertex.push(arguments[1]);
              if (this.immediateMode._curveVertex.length === 8) {
                this.isCurve = true;
                w_x = this._bezierToCatmull([
                  this.immediateMode._curveVertex[0],
                  this.immediateMode._curveVertex[2],
                  this.immediateMode._curveVertex[4],
                  this.immediateMode._curveVertex[6]
                ]);

                w_y = this._bezierToCatmull([
                  this.immediateMode._curveVertex[1],
                  this.immediateMode._curveVertex[3],
                  this.immediateMode._curveVertex[5],
                  this.immediateMode._curveVertex[7]
                ]);

                for (i = 0; i < LUTLength; i++) {
                  _x =
                    w_x[0] * this._lookUpTableBezier[i][0] +
                    w_x[1] * this._lookUpTableBezier[i][1] +
                    w_x[2] * this._lookUpTableBezier[i][2] +
                    w_x[3] * this._lookUpTableBezier[i][3];
                  _y =
                    w_y[0] * this._lookUpTableBezier[i][0] +
                    w_y[1] * this._lookUpTableBezier[i][1] +
                    w_y[2] * this._lookUpTableBezier[i][2] +
                    w_y[3] * this._lookUpTableBezier[i][3];
                  this.vertex(_x, _y);
                }
                for (i = 0; i < argLength; i++) {
                  this.immediateMode._curveVertex.shift();
                }
              }
            } else if (argLength === 3) {
              this.immediateMode._curveVertex.push(arguments[0]);
              this.immediateMode._curveVertex.push(arguments[1]);
              this.immediateMode._curveVertex.push(arguments[2]);
              if (this.immediateMode._curveVertex.length === 12) {
                this.isCurve = true;
                w_x = this._bezierToCatmull([
                  this.immediateMode._curveVertex[0],
                  this.immediateMode._curveVertex[3],
                  this.immediateMode._curveVertex[6],
                  this.immediateMode._curveVertex[9]
                ]);

                w_y = this._bezierToCatmull([
                  this.immediateMode._curveVertex[1],
                  this.immediateMode._curveVertex[4],
                  this.immediateMode._curveVertex[7],
                  this.immediateMode._curveVertex[10]
                ]);

                w_z = this._bezierToCatmull([
                  this.immediateMode._curveVertex[2],
                  this.immediateMode._curveVertex[5],
                  this.immediateMode._curveVertex[8],
                  this.immediateMode._curveVertex[11]
                ]);

                for (i = 0; i < LUTLength; i++) {
                  _x =
                    w_x[0] * this._lookUpTableBezier[i][0] +
                    w_x[1] * this._lookUpTableBezier[i][1] +
                    w_x[2] * this._lookUpTableBezier[i][2] +
                    w_x[3] * this._lookUpTableBezier[i][3];
                  _y =
                    w_y[0] * this._lookUpTableBezier[i][0] +
                    w_y[1] * this._lookUpTableBezier[i][1] +
                    w_y[2] * this._lookUpTableBezier[i][2] +
                    w_y[3] * this._lookUpTableBezier[i][3];
                  _z =
                    w_z[0] * this._lookUpTableBezier[i][0] +
                    w_z[1] * this._lookUpTableBezier[i][1] +
                    w_z[2] * this._lookUpTableBezier[i][2] +
                    w_z[3] * this._lookUpTableBezier[i][3];
                  this.vertex(_x, _y, _z);
                }
                for (i = 0; i < argLength; i++) {
                  this.immediateMode._curveVertex.shift();
                }
              }
            }
          };

          p5.RendererGL.prototype.image = function(
            img,
            sx,
            sy,
            sWidth,
            sHeight,
            dx,
            dy,
            dWidth,
            dHeight
          ) {
            this._pInst.push();

            this._pInst.texture(img);
            this._pInst.textureMode(constants.NORMAL);

            var u0 = 0;
            if (sx <= img.width) {
              u0 = sx / img.width;
            }

            var u1 = 1;
            if (sx + sWidth <= img.width) {
              u1 = (sx + sWidth) / img.width;
            }

            var v0 = 0;
            if (sy <= img.height) {
              v0 = sy / img.height;
            }

            var v1 = 1;
            if (sy + sHeight <= img.height) {
              v1 = (sy + sHeight) / img.height;
            }

            this.beginShape();
            this.vertex(dx, dy, 0, u0, v0);
            this.vertex(dx + dWidth, dy, 0, u1, v0);
            this.vertex(dx + dWidth, dy + dHeight, 0, u1, v1);
            this.vertex(dx, dy + dHeight, 0, u0, v1);
            this.endShape(constants.CLOSE);

            this._pInst.pop();
          };

          module.exports = p5;
        },
        { '../core/constants': 18, '../core/main': 24, './p5.Geometry': 71 }
      ],
      66: [
        function(_dereq_, module, exports) {
          /**
           * @module Lights, Camera
           * @submodule Interaction
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');
          var constants = _dereq_('../core/constants');

          /**
           * Allows movement around a 3D sketch using a mouse or trackpad.  Left-clicking
           * and dragging will rotate the camera position about the center of the sketch,
           * right-clicking and dragging will pan the camera position without rotation,
           * and using the mouse wheel (scrolling) will move the camera closer or further
           * from the center of the sketch. This function can be called with parameters
           * dictating sensitivity to mouse movement along the X and Y axes.  Calling
           * this function without parameters is equivalent to calling orbitControl(1,1).
           * To reverse direction of movement in either axis, enter a negative number
           * for sensitivity.
           * @method orbitControl
           * @for p5
           * @param  {Number} [sensitivityX] sensitivity to mouse movement along X axis
           * @param  {Number} [sensitivityY] sensitivity to mouse movement along Y axis
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   normalMaterial();
           * }
           * function draw() {
           *   background(200);
           *   orbitControl();
           *   rotateY(0.5);
           *   box(30, 50);
           * }
           * </code>
           * </div>
           *
           * @alt
           * Camera orbits around a box when mouse is hold-clicked & then moved.
           */

          // implementation based on three.js 'orbitControls':
          // https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js
          p5.prototype.orbitControl = function(sensitivityX, sensitivityY) {
            this._assert3d('orbitControl');
            p5._validateParameters('orbitControl', arguments);

            // If the mouse is not in bounds of the canvas, disable all behaviors:
            var mouseInCanvas =
              this.mouseX < this.width &&
              this.mouseX > 0 &&
              this.mouseY < this.height &&
              this.mouseY > 0;
            if (!mouseInCanvas) return;

            var cam = this._renderer._curCamera;

            if (typeof sensitivityX === 'undefined') {
              sensitivityX = 1;
            }
            if (typeof sensitivityY === 'undefined') {
              sensitivityY = sensitivityX;
            }

            // default right-mouse and mouse-wheel behaviors (context menu and scrolling,
            // respectively) are disabled here to allow use of those events for panning and
            // zooming

            // disable context menu for canvas element and add 'contextMenuDisabled'
            // flag to p5 instance
            if (this.contextMenuDisabled !== true) {
              this.canvas.oncontextmenu = function() {
                return false;
              };
              this._setProperty('contextMenuDisabled', true);
            }

            // disable default scrolling behavior on the canvas element and add
            // 'wheelDefaultDisabled' flag to p5 instance
            if (this.wheelDefaultDisabled !== true) {
              this.canvas.onwheel = function() {
                return false;
              };
              this._setProperty('wheelDefaultDisabled', true);
            }

            var scaleFactor = this.height < this.width ? this.height : this.width;

            // ZOOM if there is a change in mouseWheelDelta
            if (this._mouseWheelDeltaY !== this._pmouseWheelDeltaY) {
              // zoom according to direction of mouseWheelDeltaY rather than value
              if (this._mouseWheelDeltaY > 0) {
                this._renderer._curCamera._orbit(0, 0, 0.5 * scaleFactor);
              } else {
                this._renderer._curCamera._orbit(0, 0, -0.5 * scaleFactor);
              }
            }

            if (this.mouseIsPressed) {
              // ORBIT BEHAVIOR
              if (this.mouseButton === this.LEFT) {
                var deltaTheta = -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
                var deltaPhi = sensitivityY * (this.mouseY - this.pmouseY) / scaleFactor;
                this._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
              } else if (this.mouseButton === this.RIGHT) {
                // PANNING BEHAVIOR along X/Z camera axes and restricted to X/Z plane
                // in world space
                var local = cam._getLocalAxes();

                // normalize portions along X/Z axes
                var xmag = Math.sqrt(local.x[0] * local.x[0] + local.x[2] * local.x[2]);
                if (xmag !== 0) {
                  local.x[0] /= xmag;
                  local.x[2] /= xmag;
                }

                // normalize portions along X/Z axes
                var ymag = Math.sqrt(local.y[0] * local.y[0] + local.y[2] * local.y[2]);
                if (ymag !== 0) {
                  local.y[0] /= ymag;
                  local.y[2] /= ymag;
                }

                // move along those vectors by amount controlled by mouseX, pmouseY
                var dx = -1 * sensitivityX * (this.mouseX - this.pmouseX);
                var dz = -1 * sensitivityY * (this.mouseY - this.pmouseY);

                // restrict movement to XZ plane in world space
                cam.setPosition(
                  cam.eyeX + dx * local.x[0] + dz * local.z[0],
                  cam.eyeY,
                  cam.eyeZ + dx * local.x[2] + dz * local.z[2]
                );
              }
            }
            return this;
          };

          /**
           * debugMode() helps visualize 3D space by adding a grid to indicate where the
           * ‘ground’ is in a sketch and an axes icon which indicates the +X, +Y, and +Z
           * directions. This function can be called without parameters to create a
           * default grid and axes icon, or it can be called according to the examples
           * above to customize the size and position of the grid and/or axes icon.  The
           * grid is drawn using the most recently set stroke color and weight.  To
           * specify these parameters, add a call to stroke() and strokeWeight()
           * just before the end of the draw() loop.
           *
           * By default, the grid will run through the origin (0,0,0) of the sketch
           * along the XZ plane
           * and the axes icon will be offset from the origin.  Both the grid and axes
           * icon will be sized according to the current canvas size.  Note that because the
           * grid runs parallel to the default camera view, it is often helpful to use
           * debugMode along with orbitControl to allow full view of the grid.
           * @method debugMode
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
           *   normalMaterial();
           *   debugMode();
           * }
           *
           * function draw() {
           *   background(200);
           *   orbitControl();
           *   box(15, 30);
           *   // Press the spacebar to turn debugMode off!
           *   if (keyIsDown(32)) {
           *     noDebugMode();
           *   }
           * }
           * </code>
           * </div>
           * @alt
           * a 3D box is centered on a grid in a 3D sketch. an icon
           * indicates the direction of each axis: a red line points +X,
           * a green line +Y, and a blue line +Z. the grid and icon disappear when the
           * spacebar is pressed.
           *
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
           *   normalMaterial();
           *   debugMode(GRID);
           * }
           *
           * function draw() {
           *   background(200);
           *   orbitControl();
           *   box(15, 30);
           * }
           * </code>
           * </div>
           * @alt
           * a 3D box is centered on a grid in a 3D sketch.
           *
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
           *   normalMaterial();
           *   debugMode(AXES);
           * }
           *
           * function draw() {
           *   background(200);
           *   orbitControl();
           *   box(15, 30);
           * }
           * </code>
           * </div>
           * @alt
           * a 3D box is centered in a 3D sketch. an icon
           * indicates the direction of each axis: a red line points +X,
           * a green line +Y, and a blue line +Z.
           *
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
           *   normalMaterial();
           *   debugMode(GRID, 100, 10, 0, 0, 0);
           * }
           *
           * function draw() {
           *   background(200);
           *   orbitControl();
           *   box(15, 30);
           * }
           * </code>
           * </div>
           * @alt
           * a 3D box is centered on a grid in a 3D sketch
           *
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
           *   normalMaterial();
           *   debugMode(100, 10, 0, 0, 0, 20, 0, -40, 0);
           * }
           *
           * function draw() {
           *   noStroke();
           *   background(200);
           *   orbitControl();
           *   box(15, 30);
           *   // set the stroke color and weight for the grid!
           *   stroke(255, 0, 150);
           *   strokeWeight(0.8);
           * }
           * </code>
           * </div>
           * @alt
           * a 3D box is centered on a grid in a 3D sketch. an icon
           * indicates the direction of each axis: a red line points +X,
           * a green line +Y, and a blue line +Z.
           */

          /**
           * @method debugMode
           * @param {Constant} mode either GRID or AXES
           */

          /**
           * @method debugMode
           * @param {Constant} mode
           * @param {Number} [gridSize] size of one side of the grid
           * @param {Number} [gridDivisions] number of divisions in the grid
           * @param {Number} [xOff] X axis offset from origin (0,0,0)
           * @param {Number} [yOff] Y axis offset from origin (0,0,0)
           * @param {Number} [zOff] Z axis offset from origin (0,0,0)
           */

          /**
           * @method debugMode
           * @param {Constant} mode
           * @param {Number} [axesSize] size of axes icon
           * @param {Number} [xOff]
           * @param {Number} [yOff]
           * @param {Number} [zOff]
           */

          /**
           * @method debugMode
           * @param {Number} [gridSize]
           * @param {Number} [gridDivisions]
           * @param {Number} [gridXOff]
           * @param {Number} [gridYOff]
           * @param {Number} [gridZOff]
           * @param {Number} [axesSize]
           * @param {Number} [axesXOff]
           * @param {Number} [axesYOff]
           * @param {Number} [axesZOff]
           */

          p5.prototype.debugMode = function() {
            this._assert3d('debugMode');
            p5._validateParameters('debugMode', arguments);

            // start by removing existing 'post' registered debug methods
            for (var i = this._registeredMethods.post.length - 1; i >= 0; i--) {
              // test for equality...
              if (
                this._registeredMethods.post[i].toString() === this._grid().toString() ||
                this._registeredMethods.post[i].toString() === this._axesIcon().toString()
              ) {
                this._registeredMethods.post.splice(i, 1);
              }
            }

            // then add new debugMode functions according to the argument list
            if (arguments[0] === constants.GRID) {
              this.registerMethod(
                'post',
                this._grid.call(
                  this,
                  arguments[1],
                  arguments[2],
                  arguments[3],
                  arguments[4],
                  arguments[5]
                )
              );
            } else if (arguments[0] === constants.AXES) {
              this.registerMethod(
                'post',
                this._axesIcon.call(
                  this,
                  arguments[1],
                  arguments[2],
                  arguments[3],
                  arguments[4]
                )
              );
            } else {
              this.registerMethod(
                'post',
                this._grid.call(
                  this,
                  arguments[0],
                  arguments[1],
                  arguments[2],
                  arguments[3],
                  arguments[4]
                )
              );

              this.registerMethod(
                'post',
                this._axesIcon.call(
                  this,
                  arguments[5],
                  arguments[6],
                  arguments[7],
                  arguments[8]
                )
              );
            }
          };

          /**
           * Turns off debugMode() in a 3D sketch.
           * @method noDebugMode
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
           *   normalMaterial();
           *   debugMode();
           * }
           *
           * function draw() {
           *   background(200);
           *   orbitControl();
           *   box(15, 30);
           *   // Press the spacebar to turn debugMode off!
           *   if (keyIsDown(32)) {
           *     noDebugMode();
           *   }
           * }
           * </code>
           * </div>
           * @alt
           * a 3D box is centered on a grid in a 3D sketch. an icon
           * indicates the direction of each axis: a red line points +X,
           * a green line +Y, and a blue line +Z. the grid and icon disappear when the
           * spacebar is pressed.
           */
          p5.prototype.noDebugMode = function() {
            this._assert3d('noDebugMode');

            // start by removing existing 'post' registered debug methods
            for (var i = this._registeredMethods.post.length - 1; i >= 0; i--) {
              // test for equality...
              if (
                this._registeredMethods.post[i].toString() === this._grid().toString() ||
                this._registeredMethods.post[i].toString() === this._axesIcon().toString()
              ) {
                this._registeredMethods.post.splice(i, 1);
              }
            }
          };

          /**
           * For use with debugMode
           * @private
           * @method _grid
           * @param {Number} [size] size of grid sides
           * @param {Number} [div] number of grid divisions
           * @param {Number} [xOff] offset of grid center from origin in X axis
           * @param {Number} [yOff] offset of grid center from origin in Y axis
           * @param {Number} [zOff] offset of grid center from origin in Z axis
           */
          p5.prototype._grid = function(size, numDivs, xOff, yOff, zOff) {
            if (typeof size === 'undefined') {
              size = this.width / 2;
            }
            if (typeof numDivs === 'undefined') {
              // ensure at least 2 divisions
              numDivs = Math.round(size / 30) < 4 ? 4 : Math.round(size / 30);
            }
            if (typeof xOff === 'undefined') {
              xOff = 0;
            }
            if (typeof yOff === 'undefined') {
              yOff = 0;
            }
            if (typeof zOff === 'undefined') {
              zOff = 0;
            }

            var spacing = size / numDivs;
            var halfSize = size / 2;

            return function() {
              this.push();
              this.stroke(
                this._renderer.curStrokeColor[0] * 255,
                this._renderer.curStrokeColor[1] * 255,
                this._renderer.curStrokeColor[2] * 255
              );

              this._renderer.uMVMatrix.set(
                this._renderer._curCamera.cameraMatrix.mat4[0],
                this._renderer._curCamera.cameraMatrix.mat4[1],
                this._renderer._curCamera.cameraMatrix.mat4[2],
                this._renderer._curCamera.cameraMatrix.mat4[3],
                this._renderer._curCamera.cameraMatrix.mat4[4],
                this._renderer._curCamera.cameraMatrix.mat4[5],
                this._renderer._curCamera.cameraMatrix.mat4[6],
                this._renderer._curCamera.cameraMatrix.mat4[7],
                this._renderer._curCamera.cameraMatrix.mat4[8],
                this._renderer._curCamera.cameraMatrix.mat4[9],
                this._renderer._curCamera.cameraMatrix.mat4[10],
                this._renderer._curCamera.cameraMatrix.mat4[11],
                this._renderer._curCamera.cameraMatrix.mat4[12],
                this._renderer._curCamera.cameraMatrix.mat4[13],
                this._renderer._curCamera.cameraMatrix.mat4[14],
                this._renderer._curCamera.cameraMatrix.mat4[15]
              );

              // Lines along X axis
              for (var q = 0; q <= numDivs; q++) {
                this.beginShape(this.LINES);
                this.vertex(-halfSize + xOff, yOff, q * spacing - halfSize + zOff);
                this.vertex(+halfSize + xOff, yOff, q * spacing - halfSize + zOff);
                this.endShape();
              }

              // Lines along Z axis
              for (var i = 0; i <= numDivs; i++) {
                this.beginShape(this.LINES);
                this.vertex(i * spacing - halfSize + xOff, yOff, -halfSize + zOff);
                this.vertex(i * spacing - halfSize + xOff, yOff, +halfSize + zOff);
                this.endShape();
              }

              this.pop();
            };
          };

          /**
           * For use with debugMode
           * @private
           * @method _axesIcon
           * @param {Number} [size] size of axes icon lines
           * @param {Number} [xOff] offset of icon from origin in X axis
           * @param {Number} [yOff] offset of icon from origin in Y axis
           * @param {Number} [zOff] offset of icon from origin in Z axis
           */
          p5.prototype._axesIcon = function(size, xOff, yOff, zOff) {
            if (typeof size === 'undefined') {
              size = this.width / 20 > 40 ? this.width / 20 : 40;
            }
            if (typeof xOff === 'undefined') {
              xOff = -this.width / 4;
            }
            if (typeof yOff === 'undefined') {
              yOff = xOff;
            }
            if (typeof zOff === 'undefined') {
              zOff = xOff;
            }

            return function() {
              this.push();
              this._renderer.uMVMatrix.set(
                this._renderer._curCamera.cameraMatrix.mat4[0],
                this._renderer._curCamera.cameraMatrix.mat4[1],
                this._renderer._curCamera.cameraMatrix.mat4[2],
                this._renderer._curCamera.cameraMatrix.mat4[3],
                this._renderer._curCamera.cameraMatrix.mat4[4],
                this._renderer._curCamera.cameraMatrix.mat4[5],
                this._renderer._curCamera.cameraMatrix.mat4[6],
                this._renderer._curCamera.cameraMatrix.mat4[7],
                this._renderer._curCamera.cameraMatrix.mat4[8],
                this._renderer._curCamera.cameraMatrix.mat4[9],
                this._renderer._curCamera.cameraMatrix.mat4[10],
                this._renderer._curCamera.cameraMatrix.mat4[11],
                this._renderer._curCamera.cameraMatrix.mat4[12],
                this._renderer._curCamera.cameraMatrix.mat4[13],
                this._renderer._curCamera.cameraMatrix.mat4[14],
                this._renderer._curCamera.cameraMatrix.mat4[15]
              );

              // X axis
              this.strokeWeight(2);
              this.stroke(255, 0, 0);
              this.beginShape(this.LINES);
              this.vertex(xOff, yOff, zOff);
              this.vertex(xOff + size, yOff, zOff);
              this.endShape();
              // Y axis
              this.stroke(0, 255, 0);
              this.beginShape(this.LINES);
              this.vertex(xOff, yOff, zOff);
              this.vertex(xOff, yOff + size, zOff);
              this.endShape();
              // Z axis
              this.stroke(0, 0, 255);
              this.beginShape(this.LINES);
              this.vertex(xOff, yOff, zOff);
              this.vertex(xOff, yOff, zOff + size);
              this.endShape();
              this.pop();
            };
          };

          module.exports = p5;
        },
        { '../core/constants': 18, '../core/main': 24 }
      ],
      67: [
        function(_dereq_, module, exports) {
          /**
           * @module Lights, Camera
           * @submodule Lights
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');

          /**
           * Creates an ambient light with a color
           *
           * @method ambientLight
           * @param  {Number}        v1      red or hue value relative to
           *                                 the current color range
           * @param  {Number}        v2      green or saturation value
           *                                 relative to the current color range
           * @param  {Number}        v3      blue or brightness value
           *                                 relative to the current color range
           * @param  {Number}        [alpha] the alpha value
           * @chainable
           *
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           * function draw() {
           *   background(0);
           *   ambientLight(150);
           *   ambientMaterial(250);
           *   noStroke();
           *   sphere(40);
           * }
           * </code>
           * </div>
           *
           * @alt
           * evenly distributed light across a sphere
           *
           */

          /**
           * @method ambientLight
           * @param  {String}        value   a color string
           * @chainable
           */

          /**
           * @method ambientLight
           * @param  {Number}        gray   a gray value
           * @param  {Number}        [alpha]
           * @chainable
           */

          /**
           * @method ambientLight
           * @param  {Number[]}      values  an array containing the red,green,blue &
           *                                 and alpha components of the color
           * @chainable
           */

          /**
           * @method ambientLight
           * @param  {p5.Color}      color   the ambient light color
           * @chainable
           */
          p5.prototype.ambientLight = function(v1, v2, v3, a) {
            this._assert3d('ambientLight');
            p5._validateParameters('ambientLight', arguments);
            var color = this.color.apply(this, arguments);

            this._renderer.ambientLightColors.push(
              color._array[0],
              color._array[1],
              color._array[2]
            );

            this._renderer._enableLighting = true;

            return this;
          };

          /**
           * Creates a directional light with a color and a direction
           * @method directionalLight
           * @param  {Number}    v1       red or hue value (depending on the current
           * color mode),
           * @param  {Number}    v2       green or saturation value
           * @param  {Number}    v3       blue or brightness value
           * @param  {p5.Vector} position the direction of the light
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           * function draw() {
           *   background(0);
           *   //move your mouse to change light direction
           *   let dirX = (mouseX / width - 0.5) * 2;
           *   let dirY = (mouseY / height - 0.5) * 2;
           *   directionalLight(250, 250, 250, -dirX, -dirY, -1);
           *   noStroke();
           *   sphere(40);
           * }
           * </code>
           * </div>
           *
           * @alt
           * light source on canvas changeable with mouse position
           *
           */

          /**
           * @method directionalLight
           * @param  {Number[]|String|p5.Color} color   color Array, CSS color string,
           *                                             or <a href="#/p5.Color">p5.Color</a> value
           * @param  {Number}                   x       x axis direction
           * @param  {Number}                   y       y axis direction
           * @param  {Number}                   z       z axis direction
           * @chainable
           */

          /**
           * @method directionalLight
           * @param  {Number[]|String|p5.Color} color
           * @param  {p5.Vector}                position
           * @chainable
           */

          /**
           * @method directionalLight
           * @param  {Number}    v1
           * @param  {Number}    v2
           * @param  {Number}    v3
           * @param  {Number}    x
           * @param  {Number}    y
           * @param  {Number}    z
           * @chainable
           */
          p5.prototype.directionalLight = function(v1, v2, v3, x, y, z) {
            this._assert3d('directionalLight');
            p5._validateParameters('directionalLight', arguments);

            //@TODO: check parameters number
            var color;
            if (v1 instanceof p5.Color) {
              color = v1;
            } else {
              color = this.color(v1, v2, v3);
            }

            var _x, _y, _z;
            var v = arguments[arguments.length - 1];
            if (typeof v === 'number') {
              _x = arguments[arguments.length - 3];
              _y = arguments[arguments.length - 2];
              _z = arguments[arguments.length - 1];
            } else {
              _x = v.x;
              _y = v.y;
              _z = v.z;
            }

            // normalize direction
            var l = Math.sqrt(_x * _x + _y * _y + _z * _z);
            this._renderer.directionalLightDirections.push(_x / l, _y / l, _z / l);

            this._renderer.directionalLightColors.push(
              color._array[0],
              color._array[1],
              color._array[2]
            );

            this._renderer._enableLighting = true;

            return this;
          };

          /**
           * Creates a point light with a color and a light position
           * @method pointLight
           * @param  {Number}    v1       red or hue value (depending on the current
           * color mode),
           * @param  {Number}    v2       green or saturation value
           * @param  {Number}    v3       blue or brightness value
           * @param  {Number}    x        x axis position
           * @param  {Number}    y        y axis position
           * @param  {Number}    z        z axis position
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           * function draw() {
           *   background(0);
           *   //move your mouse to change light position
           *   let locX = mouseX - width / 2;
           *   let locY = mouseY - height / 2;
           *   // to set the light position,
           *   // think of the world's coordinate as:
           *   // -width/2,-height/2 -------- width/2,-height/2
           *   //                |            |
           *   //                |     0,0    |
           *   //                |            |
           *   // -width/2,height/2--------width/2,height/2
           *   pointLight(250, 250, 250, locX, locY, 50);
           *   noStroke();
           *   sphere(40);
           * }
           * </code>
           * </div>
           *
           * @alt
           * spot light on canvas changes position with mouse
           *
           */

          /**
           * @method pointLight
           * @param  {Number}    v1
           * @param  {Number}    v2
           * @param  {Number}    v3
           * @param  {p5.Vector} position the position of the light
           * @chainable
           */

          /**
           * @method pointLight
           * @param  {Number[]|String|p5.Color} color   color Array, CSS color string,
           * or <a href="#/p5.Color">p5.Color</a> value
           * @param  {Number}                   x
           * @param  {Number}                   y
           * @param  {Number}                   z
           * @chainable
           */

          /**
           * @method pointLight
           * @param  {Number[]|String|p5.Color} color
           * @param  {p5.Vector}                position
           * @chainable
           */
          p5.prototype.pointLight = function(v1, v2, v3, x, y, z) {
            this._assert3d('pointLight');
            p5._validateParameters('pointLight', arguments);

            //@TODO: check parameters number
            var color;
            if (v1 instanceof p5.Color) {
              color = v1;
            } else {
              color = this.color(v1, v2, v3);
            }

            var _x, _y, _z;
            var v = arguments[arguments.length - 1];
            if (typeof v === 'number') {
              _x = arguments[arguments.length - 3];
              _y = arguments[arguments.length - 2];
              _z = arguments[arguments.length - 1];
            } else {
              _x = v.x;
              _y = v.y;
              _z = v.z;
            }

            this._renderer.pointLightPositions.push(_x, _y, _z);
            this._renderer.pointLightColors.push(
              color._array[0],
              color._array[1],
              color._array[2]
            );

            this._renderer._enableLighting = true;

            return this;
          };

          /**
           * Sets the default ambient and directional light. The defaults are <a href="#/p5/ambientLight">ambientLight(128, 128, 128)</a> and <a href="#/p5/directionalLight">directionalLight(128, 128, 128, 0, 0, -1)</a>. Lights need to be included in the <a href="#/p5/draw">draw()</a> to remain persistent in a looping program. Placing them in the <a href="#/p5/setup">setup()</a> of a looping program will cause them to only have an effect the first time through the loop.
           * @method lights
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           * function draw() {
           *   background(0);
           *   lights();
           *   rotateX(millis() / 1000);
           *   rotateY(millis() / 1000);
           *   rotateZ(millis() / 1000);
           *   box();
           * }
           * </code>
           * </div>
           *
           * @alt
           * the light is partially ambient and partially directional
           */
          p5.prototype.lights = function() {
            this._assert3d('lights');
            this.ambientLight(128, 128, 128);
            this.directionalLight(128, 128, 128, 0, 0, -1);
            return this;
          };

          /**
           * Sets the falloff rates for point lights. It affects only the elements which are created after it in the code.
           * The default value is lightFalloff(1.0, 0.0, 0.0), and the parameters are used to calculate the falloff with the following equation:
           *
           * d = distance from light position to vertex position
           *
           * falloff = 1 / (CONSTANT + d \* LINEAR + ( d \* d ) \* QUADRATIC)
           *
           * @method lightFalloff
           * @param {Number} constant   constant value for determining falloff
           * @param {Number} linear     linear value for determining falloff
           * @param {Number} quadratic  quadratic value for determining falloff
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   noStroke();
           * }
           * function draw() {
           *   background(0);
           *   let locX = mouseX - width / 2;
           *   let locY = mouseY - height / 2;
           *   translate(-25, 0, 0);
           *   lightFalloff(1, 0, 0);
           *   pointLight(250, 250, 250, locX, locY, 50);
           *   sphere(20);
           *   translate(50, 0, 0);
           *   lightFalloff(0.9, 0.01, 0);
           *   pointLight(250, 250, 250, locX, locY, 50);
           *   sphere(20);
           * }
           * </code>
           * </div>
           *
           * @alt
           * Two spheres with different falloff values show different intensity of light
           *
           */
          p5.prototype.lightFalloff = function(
            constantAttenuation,
            linearAttenuation,
            quadraticAttenuation
          ) {
            this._assert3d('lightFalloff');
            p5._validateParameters('lightFalloff', arguments);

            if (constantAttenuation < 0) {
              constantAttenuation = 0;
              console.warn(
                'Value of constant argument in lightFalloff() should be never be negative. Set to 0.'
              );
            }

            if (linearAttenuation < 0) {
              linearAttenuation = 0;
              console.warn(
                'Value of linear argument in lightFalloff() should be never be negative. Set to 0.'
              );
            }

            if (quadraticAttenuation < 0) {
              quadraticAttenuation = 0;
              console.warn(
                'Value of quadratic argument in lightFalloff() should be never be negative. Set to 0.'
              );
            }

            if (
              constantAttenuation === 0 &&
              linearAttenuation === 0 &&
              quadraticAttenuation === 0
            ) {
              constantAttenuation = 1;
              console.warn(
                'Either one of the three arguments in lightFalloff() should be greater than zero. Set constant argument to 1.'
              );
            }

            this._renderer.constantAttenuation = constantAttenuation;
            this._renderer.linearAttenuation = linearAttenuation;
            this._renderer.quadraticAttenuation = quadraticAttenuation;

            return this;
          };

          module.exports = p5;
        },
        { '../core/main': 24 }
      ],
      68: [
        function(_dereq_, module, exports) {
          /**
           * @module Shape
           * @submodule 3D Models
           * @for p5
           * @requires core
           * @requires p5.Geometry
           */

          'use strict';

          var p5 = _dereq_('../core/main');
          _dereq_('./p5.Geometry');

          /**
           * Load a 3d model from an OBJ or STL file.
           * <br><br>
           * One of the limitations of the OBJ and STL format is that it doesn't have a built-in
           * sense of scale. This means that models exported from different programs might
           * be very different sizes. If your model isn't displaying, try calling
           * <a href="#/p5/loadModel">loadModel()</a> with the normalized parameter set to true. This will resize the
           * model to a scale appropriate for p5. You can also make additional changes to
           * the final size of your model with the <a href="#/p5/scale">scale()</a> function.
           *
           * Also, the support for colored STL files is not present. STL files with color will be
           * rendered without color properties.
           *
           * @method loadModel
           * @param  {String} path              Path of the model to be loaded
           * @param  {Boolean} normalize        If true, scale the model to a
           *                                      standardized size when loading
           * @param  {function(p5.Geometry)} [successCallback] Function to be called
           *                                     once the model is loaded. Will be passed
           *                                     the 3D model object.
           * @param  {function(Event)} [failureCallback] called with event error if
           *                                         the model fails to load.
           * @return {p5.Geometry} the <a href="#/p5.Geometry">p5.Geometry</a> object
           *
           * @example
           * <div>
           * <code>
           * //draw a spinning octahedron
           * let octahedron;
           *
           * function preload() {
           *   octahedron = loadModel('assets/octahedron.obj');
           * }
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   model(octahedron);
           * }
           * </code>
           * </div>
           *
           * @alt
           * Vertically rotating 3-d octahedron.
           *
           * @example
           * <div>
           * <code>
           * //draw a spinning teapot
           * let teapot;
           *
           * function preload() {
           *   // Load model with normalise parameter set to true
           *   teapot = loadModel('assets/teapot.obj', true);
           * }
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   scale(0.4); // Scaled to make model fit into canvas
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   normalMaterial(); // For effect
           *   model(teapot);
           * }
           * </code>
           * </div>
           *
           * @alt
           * Vertically rotating 3-d teapot with red, green and blue gradient.
           */
          /**
           * @method loadModel
           * @param  {String} path
           * @param  {function(p5.Geometry)} [successCallback]
           * @param  {function(Event)} [failureCallback]
           * @return {p5.Geometry} the <a href="#/p5.Geometry">p5.Geometry</a> object
           */
          p5.prototype.loadModel = function(path) {
            p5._validateParameters('loadModel', arguments);
            var normalize;
            var successCallback;
            var failureCallback;
            if (typeof arguments[1] === 'boolean') {
              normalize = arguments[1];
              successCallback = arguments[2];
              failureCallback = arguments[3];
            } else {
              normalize = false;
              successCallback = arguments[1];
              failureCallback = arguments[2];
            }

            var fileType = path.slice(-4);
            var model = new p5.Geometry();
            model.gid = path + '|' + normalize;
            var self = this;

            if (fileType === '.stl') {
              this.httpDo(
                path,
                'GET',
                'arrayBuffer',
                function(arrayBuffer) {
                  parseSTL(model, arrayBuffer);

                  if (normalize) {
                    model.normalize();
                  }
                  self._decrementPreload();
                  if (typeof successCallback === 'function') {
                    successCallback(model);
                  }
                }.bind(this),
                failureCallback
              );
            } else if (fileType === '.obj') {
              this.loadStrings(
                path,
                function(strings) {
                  parseObj(model, strings);

                  if (normalize) {
                    model.normalize();
                  }

                  self._decrementPreload();
                  if (typeof successCallback === 'function') {
                    successCallback(model);
                  }
                }.bind(this),
                failureCallback
              );
            } else {
              p5._friendlyFileLoadError(3, path);

              if (failureCallback) {
                failureCallback();
              } else {
                console.error(
                  'Sorry, the file type is invalid. Only OBJ and STL files are supported.'
                );
              }
            }
            return model;
          };

          /**
           * Parse OBJ lines into model. For reference, this is what a simple model of a
           * square might look like:
           *
           * v -0.5 -0.5 0.5
           * v -0.5 -0.5 -0.5
           * v -0.5 0.5 -0.5
           * v -0.5 0.5 0.5
           *
           * f 4 3 2 1
           */
          function parseObj(model, lines) {
            // OBJ allows a face to specify an index for a vertex (in the above example),
            // but it also allows you to specify a custom combination of vertex, UV
            // coordinate, and vertex normal. So, "3/4/3" would mean, "use vertex 3 with
            // UV coordinate 4 and vertex normal 3". In WebGL, every vertex with different
            // parameters must be a different vertex, so loadedVerts is used to
            // temporarily store the parsed vertices, normals, etc., and indexedVerts is
            // used to map a specific combination (keyed on, for example, the string
            // "3/4/3"), to the actual index of the newly created vertex in the final
            // object.
            var loadedVerts = {
              v: [],
              vt: [],
              vn: []
            };

            var indexedVerts = {};

            for (var line = 0; line < lines.length; ++line) {
              // Each line is a separate object (vertex, face, vertex normal, etc)
              // For each line, split it into tokens on whitespace. The first token
              // describes the type.
              var tokens = lines[line].trim().split(/\b\s+/);

              if (tokens.length > 0) {
                if (tokens[0] === 'v' || tokens[0] === 'vn') {
                  // Check if this line describes a vertex or vertex normal.
                  // It will have three numeric parameters.
                  var vertex = new p5.Vector(
                    parseFloat(tokens[1]),
                    parseFloat(tokens[2]),
                    parseFloat(tokens[3])
                  );

                  loadedVerts[tokens[0]].push(vertex);
                } else if (tokens[0] === 'vt') {
                  // Check if this line describes a texture coordinate.
                  // It will have two numeric parameters.
                  var texVertex = [parseFloat(tokens[1]), parseFloat(tokens[2])];
                  loadedVerts[tokens[0]].push(texVertex);
                } else if (tokens[0] === 'f') {
                  // Check if this line describes a face.
                  // OBJ faces can have more than three points. Triangulate points.
                  for (var tri = 3; tri < tokens.length; ++tri) {
                    var face = [];

                    var vertexTokens = [1, tri - 1, tri];

                    for (var tokenInd = 0; tokenInd < vertexTokens.length; ++tokenInd) {
                      // Now, convert the given token into an index
                      var vertString = tokens[vertexTokens[tokenInd]];
                      var vertIndex = 0;

                      // TODO: Faces can technically use negative numbers to refer to the
                      // previous nth vertex. I haven't seen this used in practice, but
                      // it might be good to implement this in the future.

                      if (indexedVerts[vertString] !== undefined) {
                        vertIndex = indexedVerts[vertString];
                      } else {
                        var vertParts = vertString.split('/');
                        for (var i = 0; i < vertParts.length; i++) {
                          vertParts[i] = parseInt(vertParts[i]) - 1;
                        }

                        vertIndex = indexedVerts[vertString] = model.vertices.length;
                        model.vertices.push(loadedVerts.v[vertParts[0]].copy());
                        if (loadedVerts.vt[vertParts[1]]) {
                          model.uvs.push(loadedVerts.vt[vertParts[1]].slice());
                        } else {
                          model.uvs.push([0, 0]);
                        }

                        if (loadedVerts.vn[vertParts[2]]) {
                          model.vertexNormals.push(loadedVerts.vn[vertParts[2]].copy());
                        }
                      }

                      face.push(vertIndex);
                    }

                    if (face[0] !== face[1] && face[0] !== face[2] && face[1] !== face[2]) {
                      model.faces.push(face);
                    }
                  }
                }
              }
            }
            // If the model doesn't have normals, compute the normals
            if (model.vertexNormals.length === 0) {
              model.computeNormals();
            }

            return model;
          }

          /**
           * STL files can be of two types, ASCII and Binary,
           *
           * We need to convert the arrayBuffer to an array of strings,
           * to parse it as an ASCII file.
           */
          function parseSTL(model, buffer) {
            if (isBinary(buffer)) {
              parseBinarySTL(model, buffer);
            } else {
              var reader = new DataView(buffer);

              if (!('TextDecoder' in window)) {
                console.warn(
                  'Sorry, ASCII STL loading only works in browsers that support TextDecoder (https://caniuse.com/#feat=textencoder)'
                );

                return model;
              }

              var decoder = new TextDecoder('utf-8');
              var lines = decoder.decode(reader);
              var lineArray = lines.split('\n');
              parseASCIISTL(model, lineArray);
            }
            return model;
          }

          /**
           * This function checks if the file is in ASCII format or in Binary format
           *
           * It is done by searching keyword `solid` at the start of the file.
           *
           * An ASCII STL data must begin with `solid` as the first six bytes.
           * However, ASCII STLs lacking the SPACE after the `d` are known to be
           * plentiful. So, check the first 5 bytes for `solid`.
           *
           * Several encodings, such as UTF-8, precede the text with up to 5 bytes:
           * https://en.wikipedia.org/wiki/Byte_order_mark#Byte_order_marks_by_encoding
           * Search for `solid` to start anywhere after those prefixes.
           */
          function isBinary(data) {
            var reader = new DataView(data);

            // US-ASCII ordinal values for `s`, `o`, `l`, `i`, `d`
            var solid = [115, 111, 108, 105, 100];
            for (var off = 0; off < 5; off++) {
              // If "solid" text is matched to the current offset, declare it to be an ASCII STL.
              if (matchDataViewAt(solid, reader, off)) return false;
            }

            // Couldn't find "solid" text at the beginning; it is binary STL.
            return true;
          }

          /**
           * This function matches the `query` at the provided `offset`
           */
          function matchDataViewAt(query, reader, offset) {
            // Check if each byte in query matches the corresponding byte from the current offset
            for (var i = 0, il = query.length; i < il; i++) {
              if (query[i] !== reader.getUint8(offset + i, false)) return false;
            }

            return true;
          }

          /**
           * This function parses the Binary STL files.
           * https://en.wikipedia.org/wiki/STL_%28file_format%29#Binary_STL
           *
           * Currently there is no support for the colors provided in STL files.
           */
          function parseBinarySTL(model, buffer) {
            var reader = new DataView(buffer);

            // Number of faces is present following the header
            var faces = reader.getUint32(80, true);
            var r,
              g,
              b,
              hasColors = false,
              colors;
            var defaultR, defaultG, defaultB;

            // Binary files contain 80-byte header, which is generally ignored.
            for (var index = 0; index < 80 - 10; index++) {
              // Check for `COLOR=`
              if (
                reader.getUint32(index, false) === 0x434f4c4f /*COLO*/ &&
                reader.getUint8(index + 4) === 0x52 /*'R'*/ &&
                reader.getUint8(index + 5) === 0x3d /*'='*/
              ) {
                hasColors = true;
                colors = [];

                defaultR = reader.getUint8(index + 6) / 255;
                defaultG = reader.getUint8(index + 7) / 255;
                defaultB = reader.getUint8(index + 8) / 255;
                // To be used when color support is added
                // alpha = reader.getUint8(index + 9) / 255;
              }
            }
            var dataOffset = 84;
            var faceLength = 12 * 4 + 2;

            // Iterate the faces
            for (var face = 0; face < faces; face++) {
              var start = dataOffset + face * faceLength;
              var normalX = reader.getFloat32(start, true);
              var normalY = reader.getFloat32(start + 4, true);
              var normalZ = reader.getFloat32(start + 8, true);

              if (hasColors) {
                var packedColor = reader.getUint16(start + 48, true);

                if ((packedColor & 0x8000) === 0) {
                  // facet has its own unique color
                  r = (packedColor & 0x1f) / 31;
                  g = ((packedColor >> 5) & 0x1f) / 31;
                  b = ((packedColor >> 10) & 0x1f) / 31;
                } else {
                  r = defaultR;
                  g = defaultG;
                  b = defaultB;
                }
              }

              for (var i = 1; i <= 3; i++) {
                var vertexstart = start + i * 12;

                var newVertex = new p5.Vector(
                  reader.getFloat32(vertexstart, true),
                  reader.getFloat32(vertexstart + 8, true),
                  reader.getFloat32(vertexstart + 4, true)
                );

                model.vertices.push(newVertex);

                if (hasColors) {
                  colors.push(r, g, b);
                }
              }

              var newNormal = new p5.Vector(normalX, normalY, normalZ);

              model.vertexNormals.push(newNormal, newNormal, newNormal);

              model.faces.push([3 * face, 3 * face + 1, 3 * face + 2]);
            }
            if (hasColors) {
              // add support for colors here.
            }
            return model;
          }

          /**
           * ASCII STL file starts with `solid 'nameOfFile'`
           * Then contain the normal of the face, starting with `facet normal`
           * Next contain a keyword indicating the start of face vertex, `outer loop`
           * Next comes the three vertex, starting with `vertex x y z`
           * Vertices ends with `endloop`
           * Face ends with `endfacet`
           * Next face starts with `facet normal`
           * The end of the file is indicated by `endsolid`
           */
          function parseASCIISTL(model, lines) {
            var state = '';
            var curVertexIndex = [];
            var newNormal, newVertex;

            for (var iterator = 0; iterator < lines.length; ++iterator) {
              var line = lines[iterator].trim();
              var parts = line.split(' ');

              for (var partsiterator = 0; partsiterator < parts.length; ++partsiterator) {
                if (parts[partsiterator] === '') {
                  // Ignoring multiple whitespaces
                  parts.splice(partsiterator, 1);
                }
              }

              if (parts.length === 0) {
                // Remove newline
                continue;
              }

              switch (state) {
                case '': // First run
                  if (parts[0] !== 'solid') {
                    // Invalid state
                    console.error(line);
                    console.error('Invalid state "' + parts[0] + '", should be "solid"');
                    return;
                  } else {
                    state = 'solid';
                  }
                  break;

                case 'solid': // First face
                  if (parts[0] !== 'facet' || parts[1] !== 'normal') {
                    // Invalid state
                    console.error(line);
                    console.error(
                      'Invalid state "' + parts[0] + '", should be "facet normal"'
                    );

                    return;
                  } else {
                    // Push normal for first face
                    newNormal = new p5.Vector(
                      parseFloat(parts[2]),
                      parseFloat(parts[3]),
                      parseFloat(parts[4])
                    );

                    model.vertexNormals.push(newNormal, newNormal, newNormal);
                    state = 'facet normal';
                  }
                  break;

                case 'facet normal': // After normal is defined
                  if (parts[0] !== 'outer' || parts[1] !== 'loop') {
                    // Invalid State
                    console.error(line);
                    console.error(
                      'Invalid state "' + parts[0] + '", should be "outer loop"'
                    );

                    return;
                  } else {
                    // Next should be vertices
                    state = 'vertex';
                  }
                  break;

                case 'vertex':
                  if (parts[0] === 'vertex') {
                    //Vertex of triangle
                    newVertex = new p5.Vector(
                      parseFloat(parts[1]),
                      parseFloat(parts[2]),
                      parseFloat(parts[3])
                    );

                    model.vertices.push(newVertex);
                    curVertexIndex.push(model.vertices.indexOf(newVertex));
                  } else if (parts[0] === 'endloop') {
                    // End of vertices
                    model.faces.push(curVertexIndex);
                    curVertexIndex = [];
                    state = 'endloop';
                  } else {
                    // Invalid State
                    console.error(line);
                    console.error(
                      'Invalid state "' + parts[0] + '", should be "vertex" or "endloop"'
                    );

                    return;
                  }
                  break;

                case 'endloop':
                  if (parts[0] !== 'endfacet') {
                    // End of face
                    console.error(line);
                    console.error('Invalid state "' + parts[0] + '", should be "endfacet"');

                    return;
                  } else {
                    state = 'endfacet';
                  }
                  break;

                case 'endfacet':
                  if (parts[0] === 'endsolid') {
                    // End of solid
                  } else if (parts[0] === 'facet' && parts[1] === 'normal') {
                    // Next face
                    newNormal = new p5.Vector(
                      parseFloat(parts[2]),
                      parseFloat(parts[3]),
                      parseFloat(parts[4])
                    );

                    model.vertexNormals.push(newNormal, newNormal, newNormal);
                    state = 'facet normal';
                  } else {
                    // Invalid State
                    console.error(line);
                    console.error(
                      'Invalid state "' +
                        parts[0] +
                        '", should be "endsolid" or "facet normal"'
                    );

                    return;
                  }
                  break;

                default:
                  console.error('Invalid state "' + state + '"');
                  break;
              }
            }
            return model;
          }

          /**
           * Render a 3d model to the screen.
           *
           * @method model
           * @param  {p5.Geometry} model Loaded 3d model to be rendered
           * @example
           * <div>
           * <code>
           * //draw a spinning octahedron
           * let octahedron;
           *
           * function preload() {
           *   octahedron = loadModel('assets/octahedron.obj');
           * }
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   model(octahedron);
           * }
           * </code>
           * </div>
           *
           * @alt
           * Vertically rotating 3-d octahedron.
           *
           */
          p5.prototype.model = function(model) {
            this._assert3d('model');
            p5._validateParameters('model', arguments);
            if (model.vertices.length > 0) {
              if (!this._renderer.geometryInHash(model.gid)) {
                model._makeTriangleEdges()._edgesToVertices();
                this._renderer.createBuffers(model.gid, model);
              }

              this._renderer.drawBuffers(model.gid);
            }
          };

          module.exports = p5;
        },
        { '../core/main': 24, './p5.Geometry': 71 }
      ],
      69: [
        function(_dereq_, module, exports) {
          /**
           * @module Lights, Camera
           * @submodule Material
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');
          var constants = _dereq_('../core/constants');
          _dereq_('./p5.Texture');

          /**
           * Loads a custom shader from the provided vertex and fragment
           * shader paths. The shader files are loaded asynchronously in the
           * background, so this method should be used in <a href="#/p5/preload">preload()</a>.
           *
           * For now, there are three main types of shaders. p5 will automatically
           * supply appropriate vertices, normals, colors, and lighting attributes
           * if the parameters defined in the shader match the names.
           *
           * @method loadShader
           * @param {String} vertFilename path to file containing vertex shader
           * source code
           * @param {String} fragFilename path to file containing fragment shader
           * source code
           * @param {function} [callback] callback to be executed after loadShader
           * completes. On success, the Shader object is passed as the first argument.
           * @param {function} [errorCallback] callback to be executed when an error
           * occurs inside loadShader. On error, the error is passed as the first
           * argument.
           * @return {p5.Shader} a shader object created from the provided
           * vertex and fragment shader files.
           *
           * @example
           * <div modernizr='webgl'>
           * <code>
           * let mandel;
           * function preload() {
           *   // load the shader definitions from files
           *   mandel = loadShader('assets/shader.vert', 'assets/shader.frag');
           * }
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   // use the shader
           *   shader(mandel);
           *   noStroke();
           *   mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
           * }
           *
           * function draw() {
           *   mandel.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
           *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
           * }
           * </code>
           * </div>
           *
           * @alt
           * zooming Mandelbrot set. a colorful, infinitely detailed fractal.
           */
          p5.prototype.loadShader = function(
            vertFilename,
            fragFilename,
            callback,
            errorCallback
          ) {
            p5._validateParameters('loadShader', arguments);
            if (!errorCallback) {
              errorCallback = console.error;
            }

            var loadedShader = new p5.Shader();

            var self = this;
            var loadedFrag = false;
            var loadedVert = false;

            var onLoad = function onLoad() {
              self._decrementPreload();
              if (callback) {
                callback(loadedShader);
              }
            };

            this.loadStrings(
              vertFilename,
              function(result) {
                loadedShader._vertSrc = result.join('\n');
                loadedVert = true;
                if (loadedFrag) {
                  onLoad();
                }
              },
              errorCallback
            );

            this.loadStrings(
              fragFilename,
              function(result) {
                loadedShader._fragSrc = result.join('\n');
                loadedFrag = true;
                if (loadedVert) {
                  onLoad();
                }
              },
              errorCallback
            );

            return loadedShader;
          };

          /**
           * @method createShader
           * @param {String} vertSrc source code for the vertex shader
           * @param {String} fragSrc source code for the fragment shader
           * @returns {p5.Shader} a shader object created from the provided
           * vertex and fragment shaders.
           *
           * @example
           * <div modernizr='webgl'>
           * <code>
           * // the 'varying's are shared between both vertex & fragment shaders
           * let varying = 'precision highp float; varying vec2 vPos;';
           *
           * // the vertex shader is called for each vertex
           * let vs =
           *   varying +
           *   'attribute vec3 aPosition;' +
           *   'void main() { vPos = (gl_Position = vec4(aPosition,1.0)).xy; }';
           *
           * // the fragment shader is called for each pixel
           * let fs =
           *   varying +
           *   'uniform vec2 p;' +
           *   'uniform float r;' +
           *   'const int I = 500;' +
           *   'void main() {' +
           *   '  vec2 c = p + vPos * r, z = c;' +
           *   '  float n = 0.0;' +
           *   '  for (int i = I; i > 0; i --) {' +
           *   '    if(z.x*z.x+z.y*z.y > 4.0) {' +
           *   '      n = float(i)/float(I);' +
           *   '      break;' +
           *   '    }' +
           *   '    z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;' +
           *   '  }' +
           *   '  gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);' +
           *   '}';
           *
           * let mandel;
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *
           *   // create and initialize the shader
           *   mandel = createShader(vs, fs);
           *   shader(mandel);
           *   noStroke();
           *
           *   // 'p' is the center point of the Mandelbrot image
           *   mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
           * }
           *
           * function draw() {
           *   // 'r' is the size of the image in Mandelbrot-space
           *   mandel.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
           *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
           * }
           * </code>
           * </div>
           *
           * @alt
           * zooming Mandelbrot set. a colorful, infinitely detailed fractal.
           */
          p5.prototype.createShader = function(vertSrc, fragSrc) {
            this._assert3d('createShader');
            p5._validateParameters('createShader', arguments);
            return new p5.Shader(this._renderer, vertSrc, fragSrc);
          };

          /**
           * The <a href="#/p5/shader">shader()</a> function lets the user provide a custom shader
           * to fill in shapes in WEBGL mode. Users can create their
           * own shaders by loading vertex and fragment shaders with
           * <a href="#/p5/loadShader">loadShader()</a>.
           *
           * @method shader
           * @chainable
           * @param {p5.Shader} [s] the desired <a href="#/p5.Shader">p5.Shader</a> to use for rendering
           * shapes.
           *
           * @example
           * <div modernizr='webgl'>
           * <code>
           * // Click within the image to toggle
           * // the shader used by the quad shape
           * // Note: for an alternative approach to the same example,
           * // involving changing uniforms please refer to:
           * // https://p5js.org/reference/#/p5.Shader/setUniform
           *
           * let redGreen;
           * let orangeBlue;
           * let showRedGreen = false;
           *
           * function preload() {
           *   // note that we are using two instances
           *   // of the same vertex and fragment shaders
           *   redGreen = loadShader('assets/shader.vert', 'assets/shader-gradient.frag');
           *   orangeBlue = loadShader('assets/shader.vert', 'assets/shader-gradient.frag');
           * }
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *
           *   // initialize the colors for redGreen shader
           *   shader(redGreen);
           *   redGreen.setUniform('colorCenter', [1.0, 0.0, 0.0]);
           *   redGreen.setUniform('colorBackground', [0.0, 1.0, 0.0]);
           *
           *   // initialize the colors for orangeBlue shader
           *   shader(orangeBlue);
           *   orangeBlue.setUniform('colorCenter', [1.0, 0.5, 0.0]);
           *   orangeBlue.setUniform('colorBackground', [0.226, 0.0, 0.615]);
           *
           *   noStroke();
           * }
           *
           * function draw() {
           *   // update the offset values for each shader,
           *   // moving orangeBlue in vertical and redGreen
           *   // in horizontal direction
           *   orangeBlue.setUniform('offset', [0, sin(millis() / 2000) + 1]);
           *   redGreen.setUniform('offset', [sin(millis() / 2000), 1]);
           *
           *   if (showRedGreen === true) {
           *     shader(redGreen);
           *   } else {
           *     shader(orangeBlue);
           *   }
           *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
           * }
           *
           * function mouseClicked() {
           *   showRedGreen = !showRedGreen;
           * }
           * </code>
           * </div>
           *
           * @alt
           * canvas toggles between a circular gradient of orange and blue vertically. and a circular gradient of red and green moving horizontally when mouse is clicked/pressed.
           */
          p5.prototype.shader = function(s) {
            this._assert3d('shader');
            p5._validateParameters('shader', arguments);

            if (s._renderer === undefined) {
              s._renderer = this._renderer;
            }

            if (s.isStrokeShader()) {
              this._renderer.userStrokeShader = s;
            } else {
              this._renderer.userFillShader = s;
              this._renderer._useNormalMaterial = false;
            }

            s.init();

            return this;
          };

          /**
           * This function restores the default shaders in WEBGL mode. Code that runs
           * after resetShader() will not be affected by previously defined
           * shaders. Should be run after <a href="#/p5/shader">shader()</a>.
           *
           * @method resetShader
           * @chainable
           */
          p5.prototype.resetShader = function() {
            this._renderer.userFillShader = this._renderer.userStrokeShader = null;
            return this;
          };

          /**
           * Normal material for geometry. You can view all
           * possible materials in this
           * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
           * @method normalMaterial
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(200);
           *   normalMaterial();
           *   sphere(40);
           * }
           * </code>
           * </div>
           *
           * @alt
           * Red, green and blue gradient.
           *
           */
          p5.prototype.normalMaterial = function() {
            this._assert3d('normalMaterial');
            p5._validateParameters('normalMaterial', arguments);
            this._renderer.drawMode = constants.FILL;
            this._renderer._useSpecularMaterial = false;
            this._renderer._useNormalMaterial = true;
            this._renderer.curFillColor = [1, 1, 1, 1];
            this._renderer._setProperty('_doFill', true);
            this.noStroke();
            return this;
          };

          /**
           * Texture for geometry.  You can view other possible materials in this
           * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
           * @method texture
           * @param {p5.Image|p5.MediaElement|p5.Graphics} tex 2-dimensional graphics
           *                    to render as texture
           * @chainable
           * @example
           * <div>
           * <code>
           * let img;
           * function preload() {
           *   img = loadImage('assets/laDefense.jpg');
           * }
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(0);
           *   rotateZ(frameCount * 0.01);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   //pass image as texture
           *   texture(img);
           *   box(200, 200, 200);
           * }
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * let pg;
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   pg = createGraphics(200, 200);
           *   pg.textSize(75);
           * }
           *
           * function draw() {
           *   background(0);
           *   pg.background(255);
           *   pg.text('hello!', 0, 100);
           *   //pass image as texture
           *   texture(pg);
           *   rotateX(0.5);
           *   noStroke();
           *   plane(50);
           * }
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * let vid;
           * function preload() {
           *   vid = createVideo('assets/fingers.mov');
           *   vid.hide();
           * }
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(0);
           *   //pass video frame as texture
           *   texture(vid);
           *   rect(-40, -40, 80, 80);
           * }
           *
           * function mousePressed() {
           *   vid.loop();
           * }
           * </code>
           * </div>
           *
           * @alt
           * Rotating view of many images umbrella and grid roof on a 3d plane
           * black canvas
           * black canvas
           *
           */
          p5.prototype.texture = function(tex) {
            this._assert3d('texture');
            p5._validateParameters('texture', arguments);

            this._renderer.drawMode = constants.TEXTURE;
            this._renderer._useSpecularMaterial = false;
            this._renderer._useNormalMaterial = false;
            this._renderer._tex = tex;
            this._renderer._setProperty('_doFill', true);

            return this;
          };

          /**
           * Sets the coordinate space for texture mapping. The default mode is IMAGE
           * which refers to the actual coordinates of the image.
           * NORMAL refers to a normalized space of values ranging from 0 to 1.
           * This function only works in WEBGL mode.
           *
           * With IMAGE, if an image is 100 x 200 pixels, mapping the image onto the entire
           * size of a quad would require the points (0,0) (100, 0) (100,200) (0,200).
           * The same mapping in NORMAL is (0,0) (1,0) (1,1) (0,1).
           * @method  textureMode
           * @param {Constant} mode either IMAGE or NORMAL
           * @example
           * <div>
           * <code>
           * let img;
           *
           * function preload() {
           *   img = loadImage('assets/laDefense.jpg');
           * }
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   texture(img);
           *   textureMode(NORMAL);
           *   beginShape();
           *   vertex(-50, -50, 0, 0);
           *   vertex(50, -50, 1, 0);
           *   vertex(50, 50, 1, 1);
           *   vertex(-50, 50, 0, 1);
           *   endShape();
           * }
           * </code>
           * </div>
           *
           * @alt
           * the underside of a white umbrella and gridded ceiling above
           *
           * <div>
           * <code>
           * let img;
           *
           * function preload() {
           *   img = loadImage('assets/laDefense.jpg');
           * }
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   texture(img);
           *   textureMode(NORMAL);
           *   beginShape();
           *   vertex(-50, -50, 0, 0);
           *   vertex(50, -50, img.width, 0);
           *   vertex(50, 50, img.width, img.height);
           *   vertex(-50, 50, 0, img.height);
           *   endShape();
           * }
           * </code>
           * </div>
           *
           * @alt
           * the underside of a white umbrella and gridded ceiling above
           *
           */
          p5.prototype.textureMode = function(mode) {
            if (mode !== constants.IMAGE && mode !== constants.NORMAL) {
              console.warn(
                'You tried to set ' + mode + ' textureMode only supports IMAGE & NORMAL '
              );
            } else {
              this._renderer.textureMode = mode;
            }
          };

          /**
           * Sets the global texture wrapping mode. This controls how textures behave
           * when their uv's go outside of the 0 - 1 range. There are three options:
           * CLAMP, REPEAT, and MIRROR.
           *
           * CLAMP causes the pixels at the edge of the texture to extend to the bounds
           * REPEAT causes the texture to tile repeatedly until reaching the bounds
           * MIRROR works similarly to REPEAT but it flips the texture with every new tile
           *
           * REPEAT & MIRROR are only available if the texture
           * is a power of two size (128, 256, 512, 1024, etc.).
           *
           * This method will affect all textures in your sketch until a subsequent
           * textureWrap call is made.
           *
           * If only one argument is provided, it will be applied to both the
           * horizontal and vertical axes.
           * @method textureWrap
           * @param {Constant} wrapX either CLAMP, REPEAT, or MIRROR
           * @param {Constant} [wrapY] either CLAMP, REPEAT, or MIRROR
           * @example
           * <div>
           * <code>
           * let img;
           * function preload() {
           *   img = loadImage('assets/rockies128.jpg');
           * }
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   textureWrap(MIRROR);
           * }
           *
           * function draw() {
           *   background(0);
           *
           *   let dX = mouseX;
           *   let dY = mouseY;
           *
           *   let u = lerp(1.0, 2.0, dX);
           *   let v = lerp(1.0, 2.0, dY);
           *
           *   scale(width / 2);
           *
           *   texture(img);
           *
           *   beginShape(TRIANGLES);
           *   vertex(-1, -1, 0, 0, 0);
           *   vertex(1, -1, 0, u, 0);
           *   vertex(1, 1, 0, u, v);
           *
           *   vertex(1, 1, 0, u, v);
           *   vertex(-1, 1, 0, 0, v);
           *   vertex(-1, -1, 0, 0, 0);
           *   endShape();
           * }
           * </code>
           * </div>
           *
           * @alt
           * an image of the rocky mountains repeated in mirrored tiles
           *
           */
          p5.prototype.textureWrap = function(wrapX, wrapY) {
            wrapY = wrapY || wrapX;

            this._renderer.textureWrapX = wrapX;
            this._renderer.textureWrapY = wrapY;

            var textures = this._renderer.textures;
            for (var i = 0; i < textures.length; i++) {
              textures[i].setWrapMode(wrapX, wrapY);
            }
          };

          /**
           * Ambient material for geometry with a given color. You can view all
           * possible materials in this
           * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
           * @method  ambientMaterial
           * @param  {Number} v1  gray value, red or hue value
           *                         (depending on the current color mode),
           * @param  {Number} [v2] green or saturation value
           * @param  {Number} [v3] blue or brightness value
           * @param  {Number} [a]  opacity
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           * function draw() {
           *   background(0);
           *   noStroke();
           *   ambientLight(200);
           *   ambientMaterial(70, 130, 230);
           *   sphere(40);
           * }
           * </code>
           * </div>
           *
           * @alt
           * radiating light source from top right of canvas
           *
           */
          /**
           * @method  ambientMaterial
           * @param  {Number[]|String|p5.Color} color  color, color Array, or CSS color string
           * @chainable
           */
          p5.prototype.ambientMaterial = function(v1, v2, v3, a) {
            this._assert3d('ambientMaterial');
            p5._validateParameters('ambientMaterial', arguments);

            var color = p5.prototype.color.apply(this, arguments);
            this._renderer.curFillColor = color._array;
            this._renderer._useSpecularMaterial = false;
            this._renderer._useNormalMaterial = false;
            this._renderer._enableLighting = true;
            this._renderer._tex = null;

            return this;
          };

          /**
           * Specular material for geometry with a given color. You can view all
           * possible materials in this
           * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
           * @method specularMaterial
           * @param  {Number} v1  gray value, red or hue value
           *                       (depending on the current color mode),
           * @param  {Number} [v2] green or saturation value
           * @param  {Number} [v3] blue or brightness value
           * @param  {Number} [a]  opacity
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           * function draw() {
           *   background(0);
           *   noStroke();
           *   ambientLight(50);
           *   pointLight(250, 250, 250, 100, 100, 30);
           *   specularMaterial(250);
           *   sphere(40);
           * }
           * </code>
           * </div>
           *
           * @alt
           * diffused radiating light source from top right of canvas
           *
           */
          /**
           * @method specularMaterial
           * @param  {Number[]|String|p5.Color} color color Array, or CSS color string
           * @chainable
           */
          p5.prototype.specularMaterial = function(v1, v2, v3, a) {
            this._assert3d('specularMaterial');
            p5._validateParameters('specularMaterial', arguments);

            var color = p5.prototype.color.apply(this, arguments);
            this._renderer.curFillColor = color._array;
            this._renderer._useSpecularMaterial = true;
            this._renderer._useNormalMaterial = false;
            this._renderer._enableLighting = true;
            this._renderer._tex = null;

            return this;
          };

          /**
           * Sets the amount of gloss in the surface of shapes.
           * Used in combination with specularMaterial() in setting
           * the material properties of shapes. The default and minimum value is 1.
           * @method shininess
           * @param {Number} shine Degree of Shininess.
           *                       Defaults to 1.
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           * function draw() {
           *   background(0);
           *   noStroke();
           *   let locX = mouseX - width / 2;
           *   let locY = mouseY - height / 2;
           *   ambientLight(60, 60, 60);
           *   pointLight(255, 255, 255, locX, locY, 50);
           *   specularMaterial(250);
           *   translate(-25, 0, 0);
           *   shininess(1);
           *   sphere(20);
           *   translate(50, 0, 0);
           *   shininess(20);
           *   sphere(20);
           * }
           * </code>
           * </div>
           * @alt
           * Shininess on Camera changes position with mouse
           */
          p5.prototype.shininess = function(shine) {
            this._assert3d('shininess');
            p5._validateParameters('shininess', arguments);

            if (shine < 1) {
              shine = 1;
            }
            this._renderer._useShininess = shine;
            return this;
          };

          /**
           * @private blends colors according to color components.
           * If alpha value is less than 1, we need to enable blending
           * on our gl context.  Otherwise opaque objects need to a depthMask.
           * @param  {Number[]} color [description]
           * @return {Number[]]}  Normalized numbers array
           */
          p5.RendererGL.prototype._applyColorBlend = function(colors) {
            var gl = this.GL;

            var isTexture = this.drawMode === constants.TEXTURE;
            if (isTexture || colors[colors.length - 1] < 1.0) {
              gl.depthMask(isTexture);
              gl.enable(gl.BLEND);
              this._applyBlendMode();
            } else {
              gl.depthMask(true);
              gl.disable(gl.BLEND);
            }
            return colors;
          };

          /**
           * @private sets blending in gl context to curBlendMode
           * @param  {Number[]} color [description]
           * @return {Number[]]}  Normalized numbers array
           */
          p5.RendererGL.prototype._applyBlendMode = function() {
            var gl = this.GL;
            switch (this.curBlendMode) {
              case constants.BLEND:
              case constants.ADD:
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                break;
              case constants.MULTIPLY:
                gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                gl.blendFuncSeparate(gl.ZERO, gl.SRC_COLOR, gl.ONE, gl.ONE);
                break;
              case constants.SCREEN:
                gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                gl.blendFuncSeparate(gl.ONE_MINUS_DST_COLOR, gl.ONE, gl.ONE, gl.ONE);
                break;
              case constants.EXCLUSION:
                gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                gl.blendFuncSeparate(
                  gl.ONE_MINUS_DST_COLOR,
                  gl.ONE_MINUS_SRC_COLOR,
                  gl.ONE,
                  gl.ONE
                );

                break;
              case constants.REPLACE:
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ONE, gl.ZERO);
                break;
              case constants.SUBTRACT:
                gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD);
                gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
                break;
              case constants.DARKEST:
                if (this.blendExt) {
                  gl.blendEquationSeparate(this.blendExt.MIN_EXT, gl.FUNC_ADD);
                  gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
                } else {
                  console.warn(
                    'blendMode(DARKEST) does not work in your browser in WEBGL mode.'
                  );
                }
                break;
              case constants.LIGHTEST:
                if (this.blendExt) {
                  gl.blendEquationSeparate(this.blendExt.MAX_EXT, gl.FUNC_ADD);
                  gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
                } else {
                  console.warn(
                    'blendMode(LIGHTEST) does not work in your browser in WEBGL mode.'
                  );
                }
                break;
              default:
                console.error(
                  'Oops! Somehow RendererGL set curBlendMode to an unsupported mode.'
                );

                break;
            }
          };

          module.exports = p5;
        },
        { '../core/constants': 18, '../core/main': 24, './p5.Texture': 77 }
      ],
      70: [
        function(_dereq_, module, exports) {
          /**
           * @module Lights, Camera
           * @submodule Camera
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');

          ////////////////////////////////////////////////////////////////////////////////
          // p5.Prototype Methods
          ////////////////////////////////////////////////////////////////////////////////

          /**
           * Sets the camera position for a 3D sketch. Parameters for this function define
           * the position for the camera, the center of the sketch (where the camera is
           * pointing), and an up direction (the orientation of the camera).
           *
           * When called with no arguments, this function creates a default camera
           * equivalent to
           * camera(0, 0, (height/2.0) / tan(PI*30.0 / 180.0), 0, 0, 0, 0, 1, 0);
           * @method camera
           * @for p5
           * @param  {Number} [x]        camera position value on x axis
           * @param  {Number} [y]        camera position value on y axis
           * @param  {Number} [z]        camera position value on z axis
           * @param  {Number} [centerX]  x coordinate representing center of the sketch
           * @param  {Number} [centerY]  y coordinate representing center of the sketch
           * @param  {Number} [centerZ]  z coordinate representing center of the sketch
           * @param  {Number} [upX]      x component of direction 'up' from camera
           * @param  {Number} [upY]      y component of direction 'up' from camera
           * @param  {Number} [upZ]      z component of direction 'up' from camera
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           * function draw() {
           *   background(204);
           *   //move the camera away from the plane by a sin wave
           *   camera(0, 0, 20 + sin(frameCount * 0.01) * 10, 0, 0, 0, 0, 1, 0);
           *   plane(10, 10);
           * }
           * </code>
           * </div>
           *
           * @alt
           * White square repeatedly grows to fill canvas and then shrinks.
           *
           */
          p5.prototype.camera = function() {
            this._assert3d('camera');
            p5._validateParameters('camera', arguments);
            this._renderer._curCamera.camera.apply(this._renderer._curCamera, arguments);
            return this;
          };

          /**
           * Sets a perspective projection for the camera in a 3D sketch. This projection
           * represents depth through foreshortening: objects that are close to the camera
           * appear their actual size while those that are further away from the camera
           * appear smaller. The parameters to this function define the viewing frustum
           * (the truncated pyramid within which objects are seen by the camera) through
           * vertical field of view, aspect ratio (usually width/height), and near and far
           * clipping planes.
           *
           * When called with no arguments, the defaults
           * provided are equivalent to
           * perspective(PI/3.0, width/height, eyeZ/10.0, eyeZ*10.0), where eyeZ
           * is equal to ((height/2.0) / tan(PI*60.0/360.0));
           * @method  perspective
           * @for p5
           * @param  {Number} [fovy]   camera frustum vertical field of view,
           *                           from bottom to top of view, in <a href="#/p5/angleMode">angleMode</a> units
           * @param  {Number} [aspect] camera frustum aspect ratio
           * @param  {Number} [near]   frustum near plane length
           * @param  {Number} [far]    frustum far plane length
           * @chainable
           * @example
           * <div>
           * <code>
           * //drag the mouse to look around!
           * //you will see there's a vanishing point
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   perspective(PI / 3.0, width / height, 0.1, 500);
           * }
           * function draw() {
           *   background(200);
           *   orbitControl();
           *   normalMaterial();
           *
           *   rotateX(-0.3);
           *   rotateY(-0.2);
           *   translate(0, 0, -50);
           *
           *   push();
           *   translate(-15, 0, sin(frameCount / 30) * 95);
           *   box(30);
           *   pop();
           *   push();
           *   translate(15, 0, sin(frameCount / 30 + PI) * 95);
           *   box(30);
           *   pop();
           * }
           * </code>
           * </div>
           *
           * @alt
           * two colored 3D boxes move back and forth, rotating as mouse is dragged.
           *
           */
          p5.prototype.perspective = function() {
            this._assert3d('perspective');
            p5._validateParameters('perspective', arguments);
            this._renderer._curCamera.perspective.apply(
              this._renderer._curCamera,
              arguments
            );

            return this;
          };

          /**
           * Sets an orthographic projection for the camera in a 3D sketch and defines a
           * box-shaped viewing frustum within which objects are seen. In this projection,
           * all objects with the same dimension appear the same size, regardless of
           * whether they are near or far from the camera. The parameters to this
           * function specify the viewing frustum where left and right are the minimum and
           * maximum x values, top and bottom are the minimum and maximum y values, and near
           * and far are the minimum and maximum z values. If no parameters are given, the
           * default is used: ortho(-width/2, width/2, -height/2, height/2).
           * @method  ortho
           * @for p5
           * @param  {Number} [left]   camera frustum left plane
           * @param  {Number} [right]  camera frustum right plane
           * @param  {Number} [bottom] camera frustum bottom plane
           * @param  {Number} [top]    camera frustum top plane
           * @param  {Number} [near]   camera frustum near plane
           * @param  {Number} [far]    camera frustum far plane
           * @chainable
           * @example
           * <div>
           * <code>
           * //drag the mouse to look around!
           * //there's no vanishing point
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
           * }
           * function draw() {
           *   background(200);
           *   orbitControl();
           *   normalMaterial();
           *
           *   rotateX(0.2);
           *   rotateY(-0.2);
           *   push();
           *   translate(-15, 0, sin(frameCount / 30) * 65);
           *   box(30);
           *   pop();
           *   push();
           *   translate(15, 0, sin(frameCount / 30 + PI) * 65);
           *   box(30);
           *   pop();
           * }
           * </code>
           * </div>
           *
           * @alt
           * two 3D boxes move back and forth along same plane, rotating as mouse is dragged.
           *
           */
          p5.prototype.ortho = function() {
            this._assert3d('ortho');
            p5._validateParameters('ortho', arguments);
            this._renderer._curCamera.ortho.apply(this._renderer._curCamera, arguments);
            return this;
          };

          ////////////////////////////////////////////////////////////////////////////////
          // p5.Camera
          ////////////////////////////////////////////////////////////////////////////////

          /**
           * Creates a new <a href="#/p5.Camera">p5.Camera</a> object and tells the
           * renderer to use that camera.
           * Returns the p5.Camera object.
           * @method createCamera
           * @return {p5.Camera} The newly created camera object.
           * @for p5
           */
          p5.prototype.createCamera = function() {
            this._assert3d('createCamera');
            var _cam = new p5.Camera(this._renderer);

            // compute default camera settings, then set a default camera
            _cam._computeCameraDefaultSettings();
            _cam._setDefaultCamera();

            // set renderer current camera to the new camera
            this._renderer._curCamera = _cam;

            return _cam;
          };

          /**
           * This class describes a camera for use in p5's
           * <a href="https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5">
           * WebGL mode</a>. It contains camera position, orientation, and projection
           * information necessary for rendering a 3D scene.
           *
           * New p5.Camera objects can be made through the
           * <a href="#/p5/createCamera">createCamera()</a> function and controlled through
           * the methods described below. A camera created in this way will use a default
           * position in the scene and a default perspective projection until these
           * properties are changed through the various methods available. It is possible
           * to create multiple cameras, in which case the current camera
           * can be set through the <a href="#/p5/setCamera">setCamera()</a> method.
           *
           *
           * Note:
           * The methods below operate in two coordinate systems: the 'world' coordinate
           * system describe positions in terms of their relationship to the origin along
           * the X, Y and Z axes whereas the camera's 'local' coordinate system
           * describes positions from the camera's point of view: left-right, up-down,
           * and forward-backward. The <a href="#/p5.Camera/move">move()</a> method,
           * for instance, moves the camera along its own axes, whereas the
           * <a href="#/p5.Camera/setPosition">setPosition()</a>
           * method sets the camera's position in world-space.
           *
           *
           * @class p5.Camera
           * @param {rendererGL} rendererGL instance of WebGL renderer
           * @example
           * <div>
           * <code>
           * let cam;
           * let delta = 0.01;
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   normalMaterial();
           *   cam = createCamera();
           *   // set initial pan angle
           *   cam.pan(-0.8);
           * }
           *
           * function draw() {
           *   background(200);
           *
           *   // pan camera according to angle 'delta'
           *   cam.pan(delta);
           *
           *   // every 160 frames, switch direction
           *   if (frameCount % 160 === 0) {
           *     delta *= -1;
           *   }
           *
           *   rotateX(frameCount * 0.01);
           *   translate(-100, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           * }
           * </code>
           * </div>
           *
           * @alt
           * camera view pans left and right across a series of rotating 3D boxes.
           *
           */
          p5.Camera = function(renderer) {
            this._renderer = renderer;

            this.cameraType = 'default';

            this.cameraMatrix = new p5.Matrix();
            this.projMatrix = new p5.Matrix();
          };

          ////////////////////////////////////////////////////////////////////////////////
          // Camera Projection Methods
          ////////////////////////////////////////////////////////////////////////////////

          /**
           * Sets a perspective projection for a p5.Camera object and sets parameters
           * for that projection according to <a href="#/p5/perspective">perspective()</a>
           * syntax.
           * @method perspective
           * @for p5.Camera
           */
          p5.Camera.prototype.perspective = function(fovy, aspect, near, far) {
            if (typeof fovy === 'undefined') {
              fovy = this.defaultCameraFOV;
              // this avoids issue where setting angleMode(DEGREES) before calling
              // perspective leads to a smaller than expected FOV (because
              // _computeCameraDefaultSettings computes in radians)
              this.cameraFOV = fovy;
            } else {
              this.cameraFOV = this._renderer._pInst._toRadians(fovy);
            }
            if (typeof aspect === 'undefined') {
              aspect = this.defaultAspectRatio;
            }
            if (typeof near === 'undefined') {
              near = this.defaultCameraNear;
            }
            if (typeof far === 'undefined') {
              far = this.defaultCameraFar;
            }

            if (near <= 0.0001) {
              near = 0.01;
              console.log(
                'Avoid perspective near plane values close to or below 0. ' +
                  'Setting value to 0.01.'
              );
            }

            if (far < near) {
              console.log(
                'Perspective far plane value is less than near plane value. ' +
                  'Nothing will be shown.'
              );
            }

            this.aspectRatio = aspect;
            this.cameraNear = near;
            this.cameraFar = far;

            this.projMatrix = p5.Matrix.identity();

            var f = 1.0 / Math.tan(this.cameraFOV / 2);
            var nf = 1.0 / (this.cameraNear - this.cameraFar);

            // prettier-ignore
            this.projMatrix.set(f / aspect, 0, 0, 0,
  0, -f, 0, 0,
  0, 0, (far + near) * nf, -1,
  0, 0, 2 * far * near * nf, 0);

            if (this._isActive()) {
              this._renderer.uPMatrix.set(
                this.projMatrix.mat4[0],
                this.projMatrix.mat4[1],
                this.projMatrix.mat4[2],
                this.projMatrix.mat4[3],
                this.projMatrix.mat4[4],
                this.projMatrix.mat4[5],
                this.projMatrix.mat4[6],
                this.projMatrix.mat4[7],
                this.projMatrix.mat4[8],
                this.projMatrix.mat4[9],
                this.projMatrix.mat4[10],
                this.projMatrix.mat4[11],
                this.projMatrix.mat4[12],
                this.projMatrix.mat4[13],
                this.projMatrix.mat4[14],
                this.projMatrix.mat4[15]
              );
            }

            this.cameraType = 'custom';
          };

          /**
           * Sets an orthographic projection for a p5.Camera object and sets parameters
           * for that projection according to <a href="#/p5/ortho">ortho()</a> syntax.
           * @method ortho
           * @for p5.Camera
           */
          p5.Camera.prototype.ortho = function(left, right, bottom, top, near, far) {
            if (left === undefined) left = -this._renderer.width / 2;
            if (right === undefined) right = +this._renderer.width / 2;
            if (bottom === undefined) bottom = -this._renderer.height / 2;
            if (top === undefined) top = +this._renderer.height / 2;
            if (near === undefined) near = 0;
            if (far === undefined)
              far = Math.max(this._renderer.width, this._renderer.height);

            var w = right - left;
            var h = top - bottom;
            var d = far - near;

            var x = +2.0 / w;
            var y = +2.0 / h;
            var z = -2.0 / d;

            var tx = -(right + left) / w;
            var ty = -(top + bottom) / h;
            var tz = -(far + near) / d;

            this.projMatrix = p5.Matrix.identity();

            // prettier-ignore
            this.projMatrix.set(x, 0, 0, 0,
  0, -y, 0, 0,
  0, 0, z, 0,
  tx, ty, tz, 1);

            if (this._isActive()) {
              this._renderer.uPMatrix.set(
                this.projMatrix.mat4[0],
                this.projMatrix.mat4[1],
                this.projMatrix.mat4[2],
                this.projMatrix.mat4[3],
                this.projMatrix.mat4[4],
                this.projMatrix.mat4[5],
                this.projMatrix.mat4[6],
                this.projMatrix.mat4[7],
                this.projMatrix.mat4[8],
                this.projMatrix.mat4[9],
                this.projMatrix.mat4[10],
                this.projMatrix.mat4[11],
                this.projMatrix.mat4[12],
                this.projMatrix.mat4[13],
                this.projMatrix.mat4[14],
                this.projMatrix.mat4[15]
              );
            }

            this.cameraType = 'custom';
          };

          ////////////////////////////////////////////////////////////////////////////////
          // Camera Orientation Methods
          ////////////////////////////////////////////////////////////////////////////////

          /**
           * Rotate camera view about arbitrary axis defined by x,y,z
           * based on http://learnwebgl.brown37.net/07_cameras/camera_rotating_motion.html
           * @method _rotateView
           * @private
           */
          p5.Camera.prototype._rotateView = function(a, x, y, z) {
            var centerX = this.centerX;
            var centerY = this.centerY;
            var centerZ = this.centerZ;

            // move center by eye position such that rotation happens around eye position
            centerX -= this.eyeX;
            centerY -= this.eyeY;
            centerZ -= this.eyeZ;

            var rotation = p5.Matrix.identity(this._renderer._pInst);
            rotation.rotate(this._renderer._pInst._toRadians(a), x, y, z);

            // prettier-ignore
            var rotatedCenter = [
  centerX * rotation.mat4[0] + centerY * rotation.mat4[4] + centerZ * rotation.mat4[8],
  centerX * rotation.mat4[1] + centerY * rotation.mat4[5] + centerZ * rotation.mat4[9],
  centerX * rotation.mat4[2] + centerY * rotation.mat4[6] + centerZ * rotation.mat4[10]];

            // add eye position back into center
            rotatedCenter[0] += this.eyeX;
            rotatedCenter[1] += this.eyeY;
            rotatedCenter[2] += this.eyeZ;

            this.camera(
              this.eyeX,
              this.eyeY,
              this.eyeZ,
              rotatedCenter[0],
              rotatedCenter[1],
              rotatedCenter[2],
              this.upX,
              this.upY,
              this.upZ
            );
          };

          /**
           * Panning rotates the camera view to the left and right.
           * @method pan
           * @param {Number} angle amount to rotate camera in current
           * <a href="#/p5/angleMode">angleMode</a> units.
           * Greater than 0 values rotate counterclockwise (to the left).
           * @example
           * <div>
           * <code>
           * let cam;
           * let delta = 0.01;
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   normalMaterial();
           *   cam = createCamera();
           *   // set initial pan angle
           *   cam.pan(-0.8);
           * }
           *
           * function draw() {
           *   background(200);
           *
           *   // pan camera according to angle 'delta'
           *   cam.pan(delta);
           *
           *   // every 160 frames, switch direction
           *   if (frameCount % 160 === 0) {
           *     delta *= -1;
           *   }
           *
           *   rotateX(frameCount * 0.01);
           *   translate(-100, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           * }
           * </code>
           * </div>
           *
           * @alt
           * camera view pans left and right across a series of rotating 3D boxes.
           *
           */
          p5.Camera.prototype.pan = function(amount) {
            var local = this._getLocalAxes();
            this._rotateView(amount, local.y[0], local.y[1], local.y[2]);
          };

          /**
           * Tilting rotates the camera view up and down.
           * @method tilt
           * @param {Number} angle amount to rotate camera in current
           * <a href="#/p5/angleMode">angleMode</a> units.
           * Greater than 0 values rotate counterclockwise (to the left).
           * @example
           * <div>
           * <code>
           * let cam;
           * let delta = 0.01;
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   normalMaterial();
           *   cam = createCamera();
           *   // set initial tilt
           *   cam.tilt(-0.8);
           * }
           *
           * function draw() {
           *   background(200);
           *
           *   // pan camera according to angle 'delta'
           *   cam.tilt(delta);
           *
           *   // every 160 frames, switch direction
           *   if (frameCount % 160 === 0) {
           *     delta *= -1;
           *   }
           *
           *   rotateY(frameCount * 0.01);
           *   translate(0, -100, 0);
           *   box(20);
           *   translate(0, 35, 0);
           *   box(20);
           *   translate(0, 35, 0);
           *   box(20);
           *   translate(0, 35, 0);
           *   box(20);
           *   translate(0, 35, 0);
           *   box(20);
           *   translate(0, 35, 0);
           *   box(20);
           *   translate(0, 35, 0);
           *   box(20);
           * }
           * </code>
           * </div>
           *
           * @alt
           * camera view tilts up and down across a series of rotating 3D boxes.
           */
          p5.Camera.prototype.tilt = function(amount) {
            var local = this._getLocalAxes();
            this._rotateView(amount, local.x[0], local.x[1], local.x[2]);
          };

          /**
           * Reorients the camera to look at a position in world space.
           * @method lookAt
           * @for p5.Camera
           * @param {Number} x x position of a point in world space
           * @param {Number} y y position of a point in world space
           * @param {Number} z z position of a point in world space
           * @example
           * <div>
           * <code>
           * let cam;
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   normalMaterial();
           *   cam = createCamera();
           * }
           *
           * function draw() {
           *   background(200);
           *
           *   // look at a new random point every 60 frames
           *   if (frameCount % 60 === 0) {
           *     cam.lookAt(random(-100, 100), random(-50, 50), 0);
           *   }
           *
           *   rotateX(frameCount * 0.01);
           *   translate(-100, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           * }
           * </code>
           * </div>
           *
           * @alt
           * camera view of rotating 3D cubes changes to look at a new random
           * point every second .
           */
          p5.Camera.prototype.lookAt = function(x, y, z) {
            this.camera(
              this.eyeX,
              this.eyeY,
              this.eyeZ,
              x,
              y,
              z,
              this.upX,
              this.upY,
              this.upZ
            );
          };

          ////////////////////////////////////////////////////////////////////////////////
          // Camera Position Methods
          ////////////////////////////////////////////////////////////////////////////////

          /**
           * Sets a camera's position and orientation.  This is equivalent to calling
           * <a href="#/p5/camera">camera()</a> on a p5.Camera object.
           * @method camera
           * @for p5.Camera
           */
          p5.Camera.prototype.camera = function(
            eyeX,
            eyeY,
            eyeZ,
            centerX,
            centerY,
            centerZ,
            upX,
            upY,
            upZ
          ) {
            if (typeof eyeX === 'undefined') {
              eyeX = this.defaultEyeX;
              eyeY = this.defaultEyeY;
              eyeZ = this.defaultEyeZ;
              centerX = eyeX;
              centerY = eyeY;
              centerZ = 0;
              upX = 0;
              upY = 1;
              upZ = 0;
            }

            this.eyeX = eyeX;
            this.eyeY = eyeY;
            this.eyeZ = eyeZ;

            this.centerX = centerX;
            this.centerY = centerY;
            this.centerZ = centerZ;

            this.upX = upX;
            this.upY = upY;
            this.upZ = upZ;

            var local = this._getLocalAxes();

            // the camera affects the model view matrix, insofar as it
            // inverse translates the world to the eye position of the camera
            // and rotates it.
            // prettier-ignore
            this.cameraMatrix.set(local.x[0], local.y[0], local.z[0], 0,
  local.x[1], local.y[1], local.z[1], 0,
  local.x[2], local.y[2], local.z[2], 0,
  0, 0, 0, 1);

            var tx = -eyeX;
            var ty = -eyeY;
            var tz = -eyeZ;

            this.cameraMatrix.translate([tx, ty, tz]);

            if (this._isActive()) {
              this._renderer.uMVMatrix.set(
                this.cameraMatrix.mat4[0],
                this.cameraMatrix.mat4[1],
                this.cameraMatrix.mat4[2],
                this.cameraMatrix.mat4[3],
                this.cameraMatrix.mat4[4],
                this.cameraMatrix.mat4[5],
                this.cameraMatrix.mat4[6],
                this.cameraMatrix.mat4[7],
                this.cameraMatrix.mat4[8],
                this.cameraMatrix.mat4[9],
                this.cameraMatrix.mat4[10],
                this.cameraMatrix.mat4[11],
                this.cameraMatrix.mat4[12],
                this.cameraMatrix.mat4[13],
                this.cameraMatrix.mat4[14],
                this.cameraMatrix.mat4[15]
              );
            }
            return this;
          };

          /**
           * Move camera along its local axes while maintaining current camera orientation.
           * @method move
           * @param {Number} x amount to move along camera's left-right axis
           * @param {Number} y amount to move along camera's up-down axis
           * @param {Number} z amount to move along camera's forward-backward axis
           * @example
           * <div>
           * <code>
           * // see the camera move along its own axes while maintaining its orientation
           * let cam;
           * let delta = 0.5;
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   normalMaterial();
           *   cam = createCamera();
           * }
           *
           * function draw() {
           *   background(200);
           *
           *   // move the camera along its local axes
           *   cam.move(delta, delta, 0);
           *
           *   // every 100 frames, switch direction
           *   if (frameCount % 150 === 0) {
           *     delta *= -1;
           *   }
           *
           *   translate(-10, -10, 0);
           *   box(50, 8, 50);
           *   translate(15, 15, 0);
           *   box(50, 8, 50);
           *   translate(15, 15, 0);
           *   box(50, 8, 50);
           *   translate(15, 15, 0);
           *   box(50, 8, 50);
           *   translate(15, 15, 0);
           *   box(50, 8, 50);
           *   translate(15, 15, 0);
           *   box(50, 8, 50);
           * }
           * </code>
           * </div>
           *
           * @alt
           * camera view moves along a series of 3D boxes, maintaining the same
           * orientation throughout the move
           */
          p5.Camera.prototype.move = function(x, y, z) {
            var local = this._getLocalAxes();

            // scale local axes by movement amounts
            // based on http://learnwebgl.brown37.net/07_cameras/camera_linear_motion.html
            var dx = [local.x[0] * x, local.x[1] * x, local.x[2] * x];
            var dy = [local.y[0] * y, local.y[1] * y, local.y[2] * y];
            var dz = [local.z[0] * z, local.z[1] * z, local.z[2] * z];

            this.camera(
              this.eyeX + dx[0] + dy[0] + dz[0],
              this.eyeY + dx[1] + dy[1] + dz[1],
              this.eyeZ + dx[2] + dy[2] + dz[2],
              this.centerX + dx[0] + dy[0] + dz[0],
              this.centerY + dx[1] + dy[1] + dz[1],
              this.centerZ + dx[2] + dy[2] + dz[2],
              0,
              1,
              0
            );
          };

          /**
           * Set camera position in world-space while maintaining current camera
           * orientation.
           * @method setPosition
           * @param {Number} x x position of a point in world space
           * @param {Number} y y position of a point in world space
           * @param {Number} z z position of a point in world space
           * @example
           * <div>
           * <code>
           * // press '1' '2' or '3' keys to set camera position
           *
           * let cam;
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   normalMaterial();
           *   cam = createCamera();
           * }
           *
           * function draw() {
           *   background(200);
           *
           *   // '1' key
           *   if (keyIsDown(49)) {
           *     cam.setPosition(30, 0, 80);
           *   }
           *   // '2' key
           *   if (keyIsDown(50)) {
           *     cam.setPosition(0, 0, 80);
           *   }
           *   // '3' key
           *   if (keyIsDown(51)) {
           *     cam.setPosition(-30, 0, 80);
           *   }
           *
           *   box(20);
           * }
           * </code>
           * </div>
           *
           * @alt
           * camera position changes as the user presses keys, altering view of a 3D box
           */
          p5.Camera.prototype.setPosition = function(x, y, z) {
            var diffX = x - this.eyeX;
            var diffY = y - this.eyeY;
            var diffZ = z - this.eyeZ;

            this.camera(
              x,
              y,
              z,
              this.centerX + diffX,
              this.centerY + diffY,
              this.centerZ + diffZ,
              0,
              1,
              0
            );
          };

          ////////////////////////////////////////////////////////////////////////////////
          // Camera Helper Methods
          ////////////////////////////////////////////////////////////////////////////////

          // @TODO: combine this function with _setDefaultCamera to compute these values
          // as-needed
          p5.Camera.prototype._computeCameraDefaultSettings = function() {
            this.defaultCameraFOV = 60 / 180 * Math.PI;
            this.defaultAspectRatio = this._renderer.width / this._renderer.height;
            this.defaultEyeX = 0;
            this.defaultEyeY = 0;
            this.defaultEyeZ =
              this._renderer.height / 2.0 / Math.tan(this.defaultCameraFOV / 2.0);
            this.defaultCenterX = 0;
            this.defaultCenterY = 0;
            this.defaultCenterZ = 0;
            this.defaultCameraNear = this.defaultEyeZ * 0.1;
            this.defaultCameraFar = this.defaultEyeZ * 10;
          };

          //detect if user didn't set the camera
          //then call this function below
          p5.Camera.prototype._setDefaultCamera = function() {
            this.cameraFOV = this.defaultCameraFOV;
            this.aspectRatio = this.defaultAspectRatio;
            this.eyeX = this.defaultEyeX;
            this.eyeY = this.defaultEyeY;
            this.eyeZ = this.defaultEyeZ;
            this.centerX = this.defaultCenterX;
            this.centerY = this.defaultCenterY;
            this.centerZ = this.defaultCenterZ;
            this.upX = 0;
            this.upY = 1;
            this.upZ = 0;
            this.cameraNear = this.defaultCameraNear;
            this.cameraFar = this.defaultCameraFar;

            this.perspective();
            this.camera();

            this.cameraType = 'default';
          };

          p5.Camera.prototype._resize = function() {
            // If we're using the default camera, update the aspect ratio
            if (this.cameraType === 'default') {
              this._computeCameraDefaultSettings();
              this._setDefaultCamera();
            } else {
              this.perspective(
                this.cameraFOV,
                this._renderer.width / this._renderer.height
              );
            }
          };

          /**
           * Returns a copy of a camera.
           * @method copy
           * @private
           */
          p5.Camera.prototype.copy = function() {
            var _cam = new p5.Camera(this._renderer);
            _cam.cameraFOV = this.cameraFOV;
            _cam.aspectRatio = this.aspectRatio;
            _cam.eyeX = this.eyeX;
            _cam.eyeY = this.eyeY;
            _cam.eyeZ = this.eyeZ;
            _cam.centerX = this.centerX;
            _cam.centerY = this.centerY;
            _cam.centerZ = this.centerZ;
            _cam.cameraNear = this.cameraNear;
            _cam.cameraFar = this.cameraFar;

            _cam.cameraType = this.cameraType;

            _cam.cameraMatrix = this.cameraMatrix.copy();
            _cam.projMatrix = this.projMatrix.copy();

            return _cam;
          };

          /**
           * Returns a camera's local axes: left-right, up-down, and forward-backward,
           * as defined by vectors in world-space.
           * @method _getLocalAxes
           * @private
           */
          p5.Camera.prototype._getLocalAxes = function() {
            // calculate camera local Z vector
            var z0 = this.eyeX - this.centerX;
            var z1 = this.eyeY - this.centerY;
            var z2 = this.eyeZ - this.centerZ;

            // normalize camera local Z vector
            var eyeDist = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            if (eyeDist !== 0) {
              z0 /= eyeDist;
              z1 /= eyeDist;
              z2 /= eyeDist;
            }

            // calculate camera Y vector
            var y0 = this.upX;
            var y1 = this.upY;
            var y2 = this.upZ;

            // compute camera local X vector as up vector (local Y) cross local Z
            var x0 = y1 * z2 - y2 * z1;
            var x1 = -y0 * z2 + y2 * z0;
            var x2 = y0 * z1 - y1 * z0;

            // recompute y = z cross x
            y0 = z1 * x2 - z2 * x1;
            y1 = -z0 * x2 + z2 * x0;
            y2 = z0 * x1 - z1 * x0;

            // cross product gives area of parallelogram, which is < 1.0 for
            // non-perpendicular unit-length vectors; so normalize x, y here:
            var xmag = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (xmag !== 0) {
              x0 /= xmag;
              x1 /= xmag;
              x2 /= xmag;
            }

            var ymag = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (ymag !== 0) {
              y0 /= ymag;
              y1 /= ymag;
              y2 /= ymag;
            }

            return {
              x: [x0, x1, x2],
              y: [y0, y1, y2],
              z: [z0, z1, z2]
            };
          };

          /**
           * Orbits the camera about center point. For use with orbitControl().
           * @method _orbit
           * @private
           * @param {Number} dTheta change in spherical coordinate theta
           * @param {Number} dPhi change in spherical coordinate phi
           * @param {Number} dRadius change in radius
           */
          p5.Camera.prototype._orbit = function(dTheta, dPhi, dRadius) {
            var diffX = this.eyeX - this.centerX;
            var diffY = this.eyeY - this.centerY;
            var diffZ = this.eyeZ - this.centerZ;

            // get spherical coorinates for current camera position about origin
            var camRadius = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
            // from https://github.com/mrdoob/three.js/blob/dev/src/math/Spherical.js#L72-L73
            var camTheta = Math.atan2(diffX, diffZ); // equatorial angle
            var camPhi = Math.acos(Math.max(-1, Math.min(1, diffY / camRadius))); // polar angle

            // add change
            camTheta += dTheta;
            camPhi += dPhi;
            camRadius += dRadius;

            // prevent zooming through the center:
            if (camRadius < 0) {
              camRadius = 0.1;
            }

            // prevent rotation over the zenith / under bottom
            if (camPhi > Math.PI) {
              camPhi = Math.PI;
            } else if (camPhi <= 0) {
              camPhi = 0.001;
            }

            // from https://github.com/mrdoob/three.js/blob/dev/src/math/Vector3.js#L628-L632
            var _x = Math.sin(camPhi) * camRadius * Math.sin(camTheta);
            var _y = Math.cos(camPhi) * camRadius;
            var _z = Math.sin(camPhi) * camRadius * Math.cos(camTheta);

            this.camera(
              _x + this.centerX,
              _y + this.centerY,
              _z + this.centerZ,
              this.centerX,
              this.centerY,
              this.centerZ,
              0,
              1,
              0
            );
          };

          /**
           * Returns true if camera is currently attached to renderer.
           * @method _isActive
           * @private
           */
          p5.Camera.prototype._isActive = function() {
            return this === this._renderer._curCamera;
          };

          /**
           * Sets rendererGL's current camera to a p5.Camera object.  Allows switching
           * between multiple cameras.
           * @method setCamera
           * @param  {p5.Camera} cam  p5.Camera object
           * @for p5
           * @example
           * <div>
           * <code>
           * let cam1, cam2;
           * let currentCamera;
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   normalMaterial();
           *
           *   cam1 = createCamera();
           *   cam2 = createCamera();
           *   cam2.setPosition(30, 0, 50);
           *   cam2.lookAt(0, 0, 0);
           *   cam2.ortho();
           *
           *   // set variable for previously active camera:
           *   currentCamera = 1;
           * }
           *
           * function draw() {
           *   background(200);
           *
           *   // camera 1:
           *   cam1.lookAt(0, 0, 0);
           *   cam1.setPosition(sin(frameCount / 60) * 200, 0, 100);
           *
           *   // every 100 frames, switch between the two cameras
           *   if (frameCount % 100 === 0) {
           *     if (currentCamera === 1) {
           *       setCamera(cam1);
           *       currentCamera = 0;
           *     } else {
           *       setCamera(cam2);
           *       currentCamera = 1;
           *     }
           *   }
           *
           *   drawBoxes();
           * }
           *
           * function drawBoxes() {
           *   rotateX(frameCount * 0.01);
           *   translate(-100, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           *   translate(35, 0, 0);
           *   box(20);
           * }
           * </code>
           * </div>
           *
           * @alt
           * Canvas switches between two camera views, each showing a series of spinning
           * 3D boxes.
           */
          p5.prototype.setCamera = function(cam) {
            this._renderer._curCamera = cam;

            // set the projection matrix (which is not normally updated each frame)
            this._renderer.uPMatrix.set(
              cam.projMatrix.mat4[0],
              cam.projMatrix.mat4[1],
              cam.projMatrix.mat4[2],
              cam.projMatrix.mat4[3],
              cam.projMatrix.mat4[4],
              cam.projMatrix.mat4[5],
              cam.projMatrix.mat4[6],
              cam.projMatrix.mat4[7],
              cam.projMatrix.mat4[8],
              cam.projMatrix.mat4[9],
              cam.projMatrix.mat4[10],
              cam.projMatrix.mat4[11],
              cam.projMatrix.mat4[12],
              cam.projMatrix.mat4[13],
              cam.projMatrix.mat4[14],
              cam.projMatrix.mat4[15]
            );
          };

          module.exports = p5.Camera;
        },
        { '../core/main': 24 }
      ],
      71: [
        function(_dereq_, module, exports) {
          //some of the functions are adjusted from Three.js(http://threejs.org)

          'use strict';

          var p5 = _dereq_('../core/main');
          /**
           * p5 Geometry class
           * @class p5.Geometry
           * @constructor
           * @param  {Integer} [detailX] number of vertices on horizontal surface
           * @param  {Integer} [detailY] number of vertices on horizontal surface
           * @param {function} [callback] function to call upon object instantiation.
           *
           */
          p5.Geometry = function(detailX, detailY, callback) {
            //an array containing every vertex
            //@type [p5.Vector]
            this.vertices = [];

            //an array containing every vertex for stroke drawing
            this.lineVertices = [];

            //an array 1 normal per lineVertex with
            //final position representing which direction to
            //displace for strokeWeight
            //[[0,0,-1,1], [0,1,0,-1] ...];
            this.lineNormals = [];

            //an array containing 1 normal per vertex
            //@type [p5.Vector]
            //[p5.Vector, p5.Vector, p5.Vector,p5.Vector, p5.Vector, p5.Vector,...]
            this.vertexNormals = [];
            //an array containing each three vertex indices that form a face
            //[[0, 1, 2], [2, 1, 3], ...]
            this.faces = [];
            //a 2D array containing uvs for every vertex
            //[[0.0,0.0],[1.0,0.0], ...]
            this.uvs = [];
            // a 2D array containing edge connectivity pattern for create line vertices
            //based on faces for most objects;
            this.edges = [];
            this.detailX = detailX !== undefined ? detailX : 1;
            this.detailY = detailY !== undefined ? detailY : 1;

            this.dirtyFlags = {};

            if (callback instanceof Function) {
              callback.call(this);
            }
            return this; // TODO: is this a constructor?
          };

          p5.Geometry.prototype.reset = function() {
            this.lineVertices.length = 0;
            this.lineNormals.length = 0;

            this.vertices.length = 0;
            this.edges.length = 0;
            this.vertexColors.length = 0;
            this.vertexNormals.length = 0;
            this.uvs.length = 0;

            this.dirtyFlags = {};
          };

          /**
           * @method computeFaces
           * @chainable
           */
          p5.Geometry.prototype.computeFaces = function() {
            this.faces.length = 0;
            var sliceCount = this.detailX + 1;
            var a, b, c, d;
            for (var i = 0; i < this.detailY; i++) {
              for (var j = 0; j < this.detailX; j++) {
                a = i * sliceCount + j; // + offset;
                b = i * sliceCount + j + 1; // + offset;
                c = (i + 1) * sliceCount + j + 1; // + offset;
                d = (i + 1) * sliceCount + j; // + offset;
                this.faces.push([a, b, d]);
                this.faces.push([d, b, c]);
              }
            }
            return this;
          };

          p5.Geometry.prototype._getFaceNormal = function(faceId) {
            //This assumes that vA->vB->vC is a counter-clockwise ordering
            var face = this.faces[faceId];
            var vA = this.vertices[face[0]];
            var vB = this.vertices[face[1]];
            var vC = this.vertices[face[2]];
            var ab = p5.Vector.sub(vB, vA);
            var ac = p5.Vector.sub(vC, vA);
            var n = p5.Vector.cross(ab, ac);
            var ln = p5.Vector.mag(n);
            var sinAlpha = ln / (p5.Vector.mag(ab) * p5.Vector.mag(ac));
            if (sinAlpha === 0 || isNaN(sinAlpha)) {
              console.warn(
                'p5.Geometry.prototype._getFaceNormal:',
                'face has colinear sides or a repeated vertex'
              );

              return n;
            }
            if (sinAlpha > 1) sinAlpha = 1; // handle float rounding error
            return n.mult(Math.asin(sinAlpha) / ln);
          };
          /**
           * computes smooth normals per vertex as an average of each
           * face.
           * @method computeNormals
           * @chainable
           */
          p5.Geometry.prototype.computeNormals = function() {
            var vertexNormals = this.vertexNormals;
            var vertices = this.vertices;
            var faces = this.faces;
            var iv;

            // initialize the vertexNormals array with empty vectors
            vertexNormals.length = 0;
            for (iv = 0; iv < vertices.length; ++iv) {
              vertexNormals.push(new p5.Vector());
            }

            // loop through all the faces adding its normal to the normal
            // of each of its vertices
            for (var f = 0; f < faces.length; ++f) {
              var face = faces[f];
              var faceNormal = this._getFaceNormal(f);

              // all three vertices get the normal added
              for (var fv = 0; fv < 3; ++fv) {
                var vertexIndex = face[fv];
                vertexNormals[vertexIndex].add(faceNormal);
              }
            }

            // normalize the normals
            for (iv = 0; iv < vertices.length; ++iv) {
              vertexNormals[iv].normalize();
            }

            return this;
          };

          /**
           * Averages the vertex normals. Used in curved
           * surfaces
           * @method averageNormals
           * @chainable
           */
          p5.Geometry.prototype.averageNormals = function() {
            for (var i = 0; i <= this.detailY; i++) {
              var offset = this.detailX + 1;
              var temp = p5.Vector.add(
                this.vertexNormals[i * offset],
                this.vertexNormals[i * offset + this.detailX]
              );

              temp = p5.Vector.div(temp, 2);
              this.vertexNormals[i * offset] = temp;
              this.vertexNormals[i * offset + this.detailX] = temp;
            }
            return this;
          };

          /**
           * Averages pole normals.  Used in spherical primitives
           * @method averagePoleNormals
           * @chainable
           */
          p5.Geometry.prototype.averagePoleNormals = function() {
            //average the north pole
            var sum = new p5.Vector(0, 0, 0);
            for (var i = 0; i < this.detailX; i++) {
              sum.add(this.vertexNormals[i]);
            }
            sum = p5.Vector.div(sum, this.detailX);

            for (i = 0; i < this.detailX; i++) {
              this.vertexNormals[i] = sum;
            }

            //average the south pole
            sum = new p5.Vector(0, 0, 0);
            for (
              i = this.vertices.length - 1;
              i > this.vertices.length - 1 - this.detailX;
              i--
            ) {
              sum.add(this.vertexNormals[i]);
            }
            sum = p5.Vector.div(sum, this.detailX);

            for (
              i = this.vertices.length - 1;
              i > this.vertices.length - 1 - this.detailX;
              i--
            ) {
              this.vertexNormals[i] = sum;
            }
            return this;
          };

          /**
           * Create a 2D array for establishing stroke connections
           * @private
           * @chainable
           */
          p5.Geometry.prototype._makeTriangleEdges = function() {
            this.edges.length = 0;
            if (Array.isArray(this.strokeIndices)) {
              for (var i = 0, max = this.strokeIndices.length; i < max; i++) {
                this.edges.push(this.strokeIndices[i]);
              }
            } else {
              for (var j = 0; j < this.faces.length; j++) {
                this.edges.push([this.faces[j][0], this.faces[j][1]]);
                this.edges.push([this.faces[j][1], this.faces[j][2]]);
                this.edges.push([this.faces[j][2], this.faces[j][0]]);
              }
            }
            return this;
          };

          /**
           * Create 4 vertices for each stroke line, two at the beginning position
           * and two at the end position. These vertices are displaced relative to
           * that line's normal on the GPU
           * @private
           * @chainable
           */
          p5.Geometry.prototype._edgesToVertices = function() {
            this.lineVertices.length = 0;
            this.lineNormals.length = 0;

            for (var i = 0; i < this.edges.length; i++) {
              var begin = this.vertices[this.edges[i][0]];
              var end = this.vertices[this.edges[i][1]];
              var dir = end
                .copy()
                .sub(begin)
                .normalize();
              var a = begin.array();
              var b = begin.array();
              var c = end.array();
              var d = end.array();
              var dirAdd = dir.array();
              var dirSub = dir.array();
              // below is used to displace the pair of vertices at beginning and end
              // in opposite directions
              dirAdd.push(1);
              dirSub.push(-1);
              this.lineNormals.push(dirAdd, dirSub, dirAdd, dirAdd, dirSub, dirSub);
              this.lineVertices.push(a, b, c, c, b, d);
            }
            return this;
          };

          /**
           * Modifies all vertices to be centered within the range -100 to 100.
           * @method normalize
           * @chainable
           */
          p5.Geometry.prototype.normalize = function() {
            if (this.vertices.length > 0) {
              // Find the corners of our bounding box
              var maxPosition = this.vertices[0].copy();
              var minPosition = this.vertices[0].copy();

              for (var i = 0; i < this.vertices.length; i++) {
                maxPosition.x = Math.max(maxPosition.x, this.vertices[i].x);
                minPosition.x = Math.min(minPosition.x, this.vertices[i].x);
                maxPosition.y = Math.max(maxPosition.y, this.vertices[i].y);
                minPosition.y = Math.min(minPosition.y, this.vertices[i].y);
                maxPosition.z = Math.max(maxPosition.z, this.vertices[i].z);
                minPosition.z = Math.min(minPosition.z, this.vertices[i].z);
              }

              var center = p5.Vector.lerp(maxPosition, minPosition, 0.5);
              var dist = p5.Vector.sub(maxPosition, minPosition);
              var longestDist = Math.max(Math.max(dist.x, dist.y), dist.z);
              var scale = 200 / longestDist;

              for (i = 0; i < this.vertices.length; i++) {
                this.vertices[i].sub(center);
                this.vertices[i].mult(scale);
              }
            }
            return this;
          };

          module.exports = p5.Geometry;
        },
        { '../core/main': 24 }
      ],
      72: [
        function(_dereq_, module, exports) {
          /**
           * @requires constants
           * @todo see methods below needing further implementation.
           * future consideration: implement SIMD optimizations
           * when browser compatibility becomes available
           * https://developer.mozilla.org/en-US/docs/Web/JavaScript/
           *   Reference/Global_Objects/SIMD
           */

          'use strict';

          var p5 = _dereq_('../core/main');

          var GLMAT_ARRAY_TYPE = Array;
          var isMatrixArray = function isMatrixArray(x) {
            return x instanceof Array;
          };
          if (typeof Float32Array !== 'undefined') {
            GLMAT_ARRAY_TYPE = Float32Array;
            isMatrixArray = function isMatrixArray(x) {
              return x instanceof Array || x instanceof Float32Array;
            };
          }

          /**
           * A class to describe a 4x4 matrix
           * for model and view matrix manipulation in the p5js webgl renderer.
           * @class p5.Matrix
           * @private
           * @constructor
           * @param {Array} [mat4] array literal of our 4x4 matrix
           */
          p5.Matrix = function() {
            var args = new Array(arguments.length);
            for (var i = 0; i < args.length; ++i) {
              args[i] = arguments[i];
            }

            // This is default behavior when object
            // instantiated using createMatrix()
            // @todo implement createMatrix() in core/math.js
            if (args.length && args[args.length - 1] instanceof p5) {
              this.p5 = args[args.length - 1];
            }

            if (args[0] === 'mat3') {
              this.mat3 = Array.isArray(args[1])
                ? args[1]
                : new GLMAT_ARRAY_TYPE([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            } else {
              this.mat4 = Array.isArray(args[0])
                ? args[0]
                : new GLMAT_ARRAY_TYPE([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            }
            return this;
          };

          /**
           * Sets the x, y, and z component of the vector using two or three separate
           * variables, the data from a p5.Matrix, or the values from a float array.
           *
           * @method set
           * @param {p5.Matrix|Float32Array|Number[]} [inMatrix] the input p5.Matrix or
           *                                     an Array of length 16
           * @chainable
           */
          /**
           * @method set
           * @param {Number[]} elements 16 numbers passed by value to avoid
           *                                     array copying.
           * @chainable
           */
          p5.Matrix.prototype.set = function(inMatrix) {
            if (inMatrix instanceof p5.Matrix) {
              this.mat4 = inMatrix.mat4;
              return this;
            } else if (isMatrixArray(inMatrix)) {
              this.mat4 = inMatrix;
              return this;
            } else if (arguments.length === 16) {
              this.mat4[0] = arguments[0];
              this.mat4[1] = arguments[1];
              this.mat4[2] = arguments[2];
              this.mat4[3] = arguments[3];
              this.mat4[4] = arguments[4];
              this.mat4[5] = arguments[5];
              this.mat4[6] = arguments[6];
              this.mat4[7] = arguments[7];
              this.mat4[8] = arguments[8];
              this.mat4[9] = arguments[9];
              this.mat4[10] = arguments[10];
              this.mat4[11] = arguments[11];
              this.mat4[12] = arguments[12];
              this.mat4[13] = arguments[13];
              this.mat4[14] = arguments[14];
              this.mat4[15] = arguments[15];
            }
            return this;
          };

          /**
           * Gets a copy of the vector, returns a p5.Matrix object.
           *
           * @method get
           * @return {p5.Matrix} the copy of the p5.Matrix object
           */
          p5.Matrix.prototype.get = function() {
            return new p5.Matrix(this.mat4, this.p5);
          };

          /**
           * return a copy of a matrix
           * @method copy
           * @return {p5.Matrix}   the result matrix
           */
          p5.Matrix.prototype.copy = function() {
            var copied = new p5.Matrix(this.p5);
            copied.mat4[0] = this.mat4[0];
            copied.mat4[1] = this.mat4[1];
            copied.mat4[2] = this.mat4[2];
            copied.mat4[3] = this.mat4[3];
            copied.mat4[4] = this.mat4[4];
            copied.mat4[5] = this.mat4[5];
            copied.mat4[6] = this.mat4[6];
            copied.mat4[7] = this.mat4[7];
            copied.mat4[8] = this.mat4[8];
            copied.mat4[9] = this.mat4[9];
            copied.mat4[10] = this.mat4[10];
            copied.mat4[11] = this.mat4[11];
            copied.mat4[12] = this.mat4[12];
            copied.mat4[13] = this.mat4[13];
            copied.mat4[14] = this.mat4[14];
            copied.mat4[15] = this.mat4[15];
            return copied;
          };

          /**
           * return an identity matrix
           * @method identity
           * @return {p5.Matrix}   the result matrix
           */
          p5.Matrix.identity = function(pInst) {
            return new p5.Matrix(pInst);
          };

          /**
           * transpose according to a given matrix
           * @method transpose
           * @param  {p5.Matrix|Float32Array|Number[]} a  the matrix to be
           *                                               based on to transpose
           * @chainable
           */
          p5.Matrix.prototype.transpose = function(a) {
            var a01, a02, a03, a12, a13, a23;
            if (a instanceof p5.Matrix) {
              a01 = a.mat4[1];
              a02 = a.mat4[2];
              a03 = a.mat4[3];
              a12 = a.mat4[6];
              a13 = a.mat4[7];
              a23 = a.mat4[11];

              this.mat4[0] = a.mat4[0];
              this.mat4[1] = a.mat4[4];
              this.mat4[2] = a.mat4[8];
              this.mat4[3] = a.mat4[12];
              this.mat4[4] = a01;
              this.mat4[5] = a.mat4[5];
              this.mat4[6] = a.mat4[9];
              this.mat4[7] = a.mat4[13];
              this.mat4[8] = a02;
              this.mat4[9] = a12;
              this.mat4[10] = a.mat4[10];
              this.mat4[11] = a.mat4[14];
              this.mat4[12] = a03;
              this.mat4[13] = a13;
              this.mat4[14] = a23;
              this.mat4[15] = a.mat4[15];
            } else if (isMatrixArray(a)) {
              a01 = a[1];
              a02 = a[2];
              a03 = a[3];
              a12 = a[6];
              a13 = a[7];
              a23 = a[11];

              this.mat4[0] = a[0];
              this.mat4[1] = a[4];
              this.mat4[2] = a[8];
              this.mat4[3] = a[12];
              this.mat4[4] = a01;
              this.mat4[5] = a[5];
              this.mat4[6] = a[9];
              this.mat4[7] = a[13];
              this.mat4[8] = a02;
              this.mat4[9] = a12;
              this.mat4[10] = a[10];
              this.mat4[11] = a[14];
              this.mat4[12] = a03;
              this.mat4[13] = a13;
              this.mat4[14] = a23;
              this.mat4[15] = a[15];
            }
            return this;
          };

          /**
           * invert  matrix according to a give matrix
           * @method invert
           * @param  {p5.Matrix|Float32Array|Number[]} a   the matrix to be
           *                                                based on to invert
           * @chainable
           */
          p5.Matrix.prototype.invert = function(a) {
            var a00, a01, a02, a03, a10, a11, a12, a13;
            var a20, a21, a22, a23, a30, a31, a32, a33;
            if (a instanceof p5.Matrix) {
              a00 = a.mat4[0];
              a01 = a.mat4[1];
              a02 = a.mat4[2];
              a03 = a.mat4[3];
              a10 = a.mat4[4];
              a11 = a.mat4[5];
              a12 = a.mat4[6];
              a13 = a.mat4[7];
              a20 = a.mat4[8];
              a21 = a.mat4[9];
              a22 = a.mat4[10];
              a23 = a.mat4[11];
              a30 = a.mat4[12];
              a31 = a.mat4[13];
              a32 = a.mat4[14];
              a33 = a.mat4[15];
            } else if (isMatrixArray(a)) {
              a00 = a[0];
              a01 = a[1];
              a02 = a[2];
              a03 = a[3];
              a10 = a[4];
              a11 = a[5];
              a12 = a[6];
              a13 = a[7];
              a20 = a[8];
              a21 = a[9];
              a22 = a[10];
              a23 = a[11];
              a30 = a[12];
              a31 = a[13];
              a32 = a[14];
              a33 = a[15];
            }
            var b00 = a00 * a11 - a01 * a10;
            var b01 = a00 * a12 - a02 * a10;
            var b02 = a00 * a13 - a03 * a10;
            var b03 = a01 * a12 - a02 * a11;
            var b04 = a01 * a13 - a03 * a11;
            var b05 = a02 * a13 - a03 * a12;
            var b06 = a20 * a31 - a21 * a30;
            var b07 = a20 * a32 - a22 * a30;
            var b08 = a20 * a33 - a23 * a30;
            var b09 = a21 * a32 - a22 * a31;
            var b10 = a21 * a33 - a23 * a31;
            var b11 = a22 * a33 - a23 * a32;

            // Calculate the determinant
            var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

            if (!det) {
              return null;
            }
            det = 1.0 / det;

            this.mat4[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            this.mat4[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            this.mat4[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            this.mat4[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            this.mat4[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            this.mat4[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            this.mat4[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            this.mat4[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            this.mat4[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            this.mat4[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            this.mat4[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            this.mat4[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            this.mat4[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            this.mat4[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            this.mat4[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            this.mat4[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

            return this;
          };

          /**
           * Inverts a 3x3 matrix
           * @method invert3x3
           * @chainable
           */
          p5.Matrix.prototype.invert3x3 = function() {
            var a00 = this.mat3[0];
            var a01 = this.mat3[1];
            var a02 = this.mat3[2];
            var a10 = this.mat3[3];
            var a11 = this.mat3[4];
            var a12 = this.mat3[5];
            var a20 = this.mat3[6];
            var a21 = this.mat3[7];
            var a22 = this.mat3[8];
            var b01 = a22 * a11 - a12 * a21;
            var b11 = -a22 * a10 + a12 * a20;
            var b21 = a21 * a10 - a11 * a20;

            // Calculate the determinant
            var det = a00 * b01 + a01 * b11 + a02 * b21;
            if (!det) {
              return null;
            }
            det = 1.0 / det;
            this.mat3[0] = b01 * det;
            this.mat3[1] = (-a22 * a01 + a02 * a21) * det;
            this.mat3[2] = (a12 * a01 - a02 * a11) * det;
            this.mat3[3] = b11 * det;
            this.mat3[4] = (a22 * a00 - a02 * a20) * det;
            this.mat3[5] = (-a12 * a00 + a02 * a10) * det;
            this.mat3[6] = b21 * det;
            this.mat3[7] = (-a21 * a00 + a01 * a20) * det;
            this.mat3[8] = (a11 * a00 - a01 * a10) * det;
            return this;
          };

          /**
           * transposes a 3x3 p5.Matrix by a mat3
           * @method transpose3x3
           * @param  {Number[]} mat3 1-dimensional array
           * @chainable
           */
          p5.Matrix.prototype.transpose3x3 = function(mat3) {
            var a01 = mat3[1],
              a02 = mat3[2],
              a12 = mat3[5];
            this.mat3[1] = mat3[3];
            this.mat3[2] = mat3[6];
            this.mat3[3] = a01;
            this.mat3[5] = mat3[7];
            this.mat3[6] = a02;
            this.mat3[7] = a12;
            return this;
          };

          /**
           * converts a 4x4 matrix to its 3x3 inverse transform
           * commonly used in MVMatrix to NMatrix conversions.
           * @method invertTranspose
           * @param  {p5.Matrix} mat4 the matrix to be based on to invert
           * @chainable
           * @todo  finish implementation
           */
          p5.Matrix.prototype.inverseTranspose = function(matrix) {
            if (this.mat3 === undefined) {
              console.error('sorry, this function only works with mat3');
            } else {
              //convert mat4 -> mat3
              this.mat3[0] = matrix.mat4[0];
              this.mat3[1] = matrix.mat4[1];
              this.mat3[2] = matrix.mat4[2];
              this.mat3[3] = matrix.mat4[4];
              this.mat3[4] = matrix.mat4[5];
              this.mat3[5] = matrix.mat4[6];
              this.mat3[6] = matrix.mat4[8];
              this.mat3[7] = matrix.mat4[9];
              this.mat3[8] = matrix.mat4[10];
            }

            var inverse = this.invert3x3();
            // check inverse succeeded
            if (inverse) {
              inverse.transpose3x3(this.mat3);
            } else {
              // in case of singularity, just zero the matrix
              for (var i = 0; i < 9; i++) {
                this.mat3[i] = 0;
              }
            }
            return this;
          };

          /**
           * inspired by Toji's mat4 determinant
           * @method determinant
           * @return {Number} Determinant of our 4x4 matrix
           */
          p5.Matrix.prototype.determinant = function() {
            var d00 = this.mat4[0] * this.mat4[5] - this.mat4[1] * this.mat4[4],
              d01 = this.mat4[0] * this.mat4[6] - this.mat4[2] * this.mat4[4],
              d02 = this.mat4[0] * this.mat4[7] - this.mat4[3] * this.mat4[4],
              d03 = this.mat4[1] * this.mat4[6] - this.mat4[2] * this.mat4[5],
              d04 = this.mat4[1] * this.mat4[7] - this.mat4[3] * this.mat4[5],
              d05 = this.mat4[2] * this.mat4[7] - this.mat4[3] * this.mat4[6],
              d06 = this.mat4[8] * this.mat4[13] - this.mat4[9] * this.mat4[12],
              d07 = this.mat4[8] * this.mat4[14] - this.mat4[10] * this.mat4[12],
              d08 = this.mat4[8] * this.mat4[15] - this.mat4[11] * this.mat4[12],
              d09 = this.mat4[9] * this.mat4[14] - this.mat4[10] * this.mat4[13],
              d10 = this.mat4[9] * this.mat4[15] - this.mat4[11] * this.mat4[13],
              d11 = this.mat4[10] * this.mat4[15] - this.mat4[11] * this.mat4[14];

            // Calculate the determinant
            return d00 * d11 - d01 * d10 + d02 * d09 + d03 * d08 - d04 * d07 + d05 * d06;
          };

          /**
           * multiply two mat4s
           * @method mult
           * @param {p5.Matrix|Float32Array|Number[]} multMatrix The matrix
           *                                                we want to multiply by
           * @chainable
           */
          p5.Matrix.prototype.mult = function(multMatrix) {
            var _src;

            if (multMatrix === this || multMatrix === this.mat4) {
              _src = this.copy().mat4; // only need to allocate in this rare case
            } else if (multMatrix instanceof p5.Matrix) {
              _src = multMatrix.mat4;
            } else if (isMatrixArray(multMatrix)) {
              _src = multMatrix;
            } else if (arguments.length === 16) {
              _src = arguments;
            } else {
              return; // nothing to do.
            }

            // each row is used for the multiplier
            var b0 = this.mat4[0],
              b1 = this.mat4[1],
              b2 = this.mat4[2],
              b3 = this.mat4[3];
            this.mat4[0] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
            this.mat4[1] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
            this.mat4[2] = b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
            this.mat4[3] = b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

            b0 = this.mat4[4];
            b1 = this.mat4[5];
            b2 = this.mat4[6];
            b3 = this.mat4[7];
            this.mat4[4] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
            this.mat4[5] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
            this.mat4[6] = b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
            this.mat4[7] = b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

            b0 = this.mat4[8];
            b1 = this.mat4[9];
            b2 = this.mat4[10];
            b3 = this.mat4[11];
            this.mat4[8] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
            this.mat4[9] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
            this.mat4[10] = b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
            this.mat4[11] = b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

            b0 = this.mat4[12];
            b1 = this.mat4[13];
            b2 = this.mat4[14];
            b3 = this.mat4[15];
            this.mat4[12] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
            this.mat4[13] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
            this.mat4[14] = b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
            this.mat4[15] = b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

            return this;
          };

          p5.Matrix.prototype.apply = function(multMatrix) {
            var _src;

            if (multMatrix === this || multMatrix === this.mat4) {
              _src = this.copy().mat4; // only need to allocate in this rare case
            } else if (multMatrix instanceof p5.Matrix) {
              _src = multMatrix.mat4;
            } else if (isMatrixArray(multMatrix)) {
              _src = multMatrix;
            } else if (arguments.length === 16) {
              _src = arguments;
            } else {
              return; // nothing to do.
            }

            var mat4 = this.mat4;

            // each row is used for the multiplier
            var m0 = mat4[0];
            var m4 = mat4[4];
            var m8 = mat4[8];
            var m12 = mat4[12];
            mat4[0] = _src[0] * m0 + _src[1] * m4 + _src[2] * m8 + _src[3] * m12;
            mat4[4] = _src[4] * m0 + _src[5] * m4 + _src[6] * m8 + _src[7] * m12;
            mat4[8] = _src[8] * m0 + _src[9] * m4 + _src[10] * m8 + _src[11] * m12;
            mat4[12] = _src[12] * m0 + _src[13] * m4 + _src[14] * m8 + _src[15] * m12;

            var m1 = mat4[1];
            var m5 = mat4[5];
            var m9 = mat4[9];
            var m13 = mat4[13];
            mat4[1] = _src[0] * m1 + _src[1] * m5 + _src[2] * m9 + _src[3] * m13;
            mat4[5] = _src[4] * m1 + _src[5] * m5 + _src[6] * m9 + _src[7] * m13;
            mat4[9] = _src[8] * m1 + _src[9] * m5 + _src[10] * m9 + _src[11] * m13;
            mat4[13] = _src[12] * m1 + _src[13] * m5 + _src[14] * m9 + _src[15] * m13;

            var m2 = mat4[2];
            var m6 = mat4[6];
            var m10 = mat4[10];
            var m14 = mat4[14];
            mat4[2] = _src[0] * m2 + _src[1] * m6 + _src[2] * m10 + _src[3] * m14;
            mat4[6] = _src[4] * m2 + _src[5] * m6 + _src[6] * m10 + _src[7] * m14;
            mat4[10] = _src[8] * m2 + _src[9] * m6 + _src[10] * m10 + _src[11] * m14;
            mat4[14] = _src[12] * m2 + _src[13] * m6 + _src[14] * m10 + _src[15] * m14;

            var m3 = mat4[3];
            var m7 = mat4[7];
            var m11 = mat4[11];
            var m15 = mat4[15];
            mat4[3] = _src[0] * m3 + _src[1] * m7 + _src[2] * m11 + _src[3] * m15;
            mat4[7] = _src[4] * m3 + _src[5] * m7 + _src[6] * m11 + _src[7] * m15;
            mat4[11] = _src[8] * m3 + _src[9] * m7 + _src[10] * m11 + _src[11] * m15;
            mat4[15] = _src[12] * m3 + _src[13] * m7 + _src[14] * m11 + _src[15] * m15;

            return this;
          };

          /**
           * scales a p5.Matrix by scalars or a vector
           * @method scale
           * @param  {p5.Vector|Float32Array|Number[]} s vector to scale by
           * @chainable
           */
          p5.Matrix.prototype.scale = function(x, y, z) {
            if (x instanceof p5.Vector) {
              // x is a vector, extract the components from it.
              y = x.y;
              z = x.z;
              x = x.x; // must be last
            } else if (x instanceof Array) {
              // x is an array, extract the components from it.
              y = x[1];
              z = x[2];
              x = x[0]; // must be last
            }

            this.mat4[0] *= x;
            this.mat4[1] *= x;
            this.mat4[2] *= x;
            this.mat4[3] *= x;
            this.mat4[4] *= y;
            this.mat4[5] *= y;
            this.mat4[6] *= y;
            this.mat4[7] *= y;
            this.mat4[8] *= z;
            this.mat4[9] *= z;
            this.mat4[10] *= z;
            this.mat4[11] *= z;

            return this;
          };

          /**
           * rotate our Matrix around an axis by the given angle.
           * @method rotate
           * @param  {Number} a The angle of rotation in radians
           * @param  {p5.Vector|Number[]} axis  the axis(es) to rotate around
           * @chainable
           * inspired by Toji's gl-matrix lib, mat4 rotation
           */
          p5.Matrix.prototype.rotate = function(a, x, y, z) {
            if (x instanceof p5.Vector) {
              // x is a vector, extract the components from it.
              y = x.y;
              z = x.z;
              x = x.x; //must be last
            } else if (x instanceof Array) {
              // x is an array, extract the components from it.
              y = x[1];
              z = x[2];
              x = x[0]; //must be last
            }

            var len = Math.sqrt(x * x + y * y + z * z);
            x *= 1 / len;
            y *= 1 / len;
            z *= 1 / len;

            var a00 = this.mat4[0];
            var a01 = this.mat4[1];
            var a02 = this.mat4[2];
            var a03 = this.mat4[3];
            var a10 = this.mat4[4];
            var a11 = this.mat4[5];
            var a12 = this.mat4[6];
            var a13 = this.mat4[7];
            var a20 = this.mat4[8];
            var a21 = this.mat4[9];
            var a22 = this.mat4[10];
            var a23 = this.mat4[11];

            //sin,cos, and tan of respective angle
            var sA = Math.sin(a);
            var cA = Math.cos(a);
            var tA = 1 - cA;
            // Construct the elements of the rotation matrix
            var b00 = x * x * tA + cA;
            var b01 = y * x * tA + z * sA;
            var b02 = z * x * tA - y * sA;
            var b10 = x * y * tA - z * sA;
            var b11 = y * y * tA + cA;
            var b12 = z * y * tA + x * sA;
            var b20 = x * z * tA + y * sA;
            var b21 = y * z * tA - x * sA;
            var b22 = z * z * tA + cA;

            // rotation-specific matrix multiplication
            this.mat4[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.mat4[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.mat4[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.mat4[3] = a03 * b00 + a13 * b01 + a23 * b02;
            this.mat4[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.mat4[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.mat4[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.mat4[7] = a03 * b10 + a13 * b11 + a23 * b12;
            this.mat4[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.mat4[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.mat4[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.mat4[11] = a03 * b20 + a13 * b21 + a23 * b22;

            return this;
          };

          /**
           * @todo  finish implementing this method!
           * translates
           * @method translate
           * @param  {Number[]} v vector to translate by
           * @chainable
           */
          p5.Matrix.prototype.translate = function(v) {
            var x = v[0],
              y = v[1],
              z = v[2] || 0;
            this.mat4[12] += this.mat4[0] * x + this.mat4[4] * y + this.mat4[8] * z;
            this.mat4[13] += this.mat4[1] * x + this.mat4[5] * y + this.mat4[9] * z;
            this.mat4[14] += this.mat4[2] * x + this.mat4[6] * y + this.mat4[10] * z;
            this.mat4[15] += this.mat4[3] * x + this.mat4[7] * y + this.mat4[11] * z;
          };

          p5.Matrix.prototype.rotateX = function(a) {
            this.rotate(a, 1, 0, 0);
          };
          p5.Matrix.prototype.rotateY = function(a) {
            this.rotate(a, 0, 1, 0);
          };
          p5.Matrix.prototype.rotateZ = function(a) {
            this.rotate(a, 0, 0, 1);
          };

          /**
           * sets the perspective matrix
           * @method perspective
           * @param  {Number} fovy   [description]
           * @param  {Number} aspect [description]
           * @param  {Number} near   near clipping plane
           * @param  {Number} far    far clipping plane
           * @chainable
           */
          p5.Matrix.prototype.perspective = function(fovy, aspect, near, far) {
            var f = 1.0 / Math.tan(fovy / 2),
              nf = 1 / (near - far);

            this.mat4[0] = f / aspect;
            this.mat4[1] = 0;
            this.mat4[2] = 0;
            this.mat4[3] = 0;
            this.mat4[4] = 0;
            this.mat4[5] = f;
            this.mat4[6] = 0;
            this.mat4[7] = 0;
            this.mat4[8] = 0;
            this.mat4[9] = 0;
            this.mat4[10] = (far + near) * nf;
            this.mat4[11] = -1;
            this.mat4[12] = 0;
            this.mat4[13] = 0;
            this.mat4[14] = 2 * far * near * nf;
            this.mat4[15] = 0;

            return this;
          };

          /**
           * sets the ortho matrix
           * @method ortho
           * @param  {Number} left   [description]
           * @param  {Number} right  [description]
           * @param  {Number} bottom [description]
           * @param  {Number} top    [description]
           * @param  {Number} near   near clipping plane
           * @param  {Number} far    far clipping plane
           * @chainable
           */
          p5.Matrix.prototype.ortho = function(left, right, bottom, top, near, far) {
            var lr = 1 / (left - right),
              bt = 1 / (bottom - top),
              nf = 1 / (near - far);
            this.mat4[0] = -2 * lr;
            this.mat4[1] = 0;
            this.mat4[2] = 0;
            this.mat4[3] = 0;
            this.mat4[4] = 0;
            this.mat4[5] = -2 * bt;
            this.mat4[6] = 0;
            this.mat4[7] = 0;
            this.mat4[8] = 0;
            this.mat4[9] = 0;
            this.mat4[10] = 2 * nf;
            this.mat4[11] = 0;
            this.mat4[12] = (left + right) * lr;
            this.mat4[13] = (top + bottom) * bt;
            this.mat4[14] = (far + near) * nf;
            this.mat4[15] = 1;

            return this;
          };

          /**
           * PRIVATE
           */
          // matrix methods adapted from:
          // https://developer.mozilla.org/en-US/docs/Web/WebGL/
          // gluPerspective
          //
          // function _makePerspective(fovy, aspect, znear, zfar){
          //    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
          //    var ymin = -ymax;
          //    var xmin = ymin * aspect;
          //    var xmax = ymax * aspect;
          //    return _makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
          //  }

          ////
          //// glFrustum
          ////
          //function _makeFrustum(left, right, bottom, top, znear, zfar){
          //  var X = 2*znear/(right-left);
          //  var Y = 2*znear/(top-bottom);
          //  var A = (right+left)/(right-left);
          //  var B = (top+bottom)/(top-bottom);
          //  var C = -(zfar+znear)/(zfar-znear);
          //  var D = -2*zfar*znear/(zfar-znear);
          //  var frustrumMatrix =[
          //  X, 0, A, 0,
          //  0, Y, B, 0,
          //  0, 0, C, D,
          //  0, 0, -1, 0
          //];
          //return frustrumMatrix;
          // }

          // function _setMVPMatrices(){
          ////an identity matrix
          ////@TODO use the p5.Matrix class to abstract away our MV matrices and
          ///other math
          //var _mvMatrix =
          //[
          //  1.0,0.0,0.0,0.0,
          //  0.0,1.0,0.0,0.0,
          //  0.0,0.0,1.0,0.0,
          //  0.0,0.0,0.0,1.0
          //];

          module.exports = p5.Matrix;
        },
        { '../core/main': 24 }
      ],
      73: [
        function(_dereq_, module, exports) {
          /**
           * Welcome to RendererGL Immediate Mode.
           * Immediate mode is used for drawing custom shapes
           * from a set of vertices.  Immediate Mode is activated
           * when you call <a href="#/p5/beginShape">beginShape()</a> & de-activated when you call <a href="#/p5/endShape">endShape()</a>.
           * Immediate mode is a style of programming borrowed
           * from OpenGL's (now-deprecated) immediate mode.
           * It differs from p5.js' default, Retained Mode, which caches
           * geometries and buffers on the CPU to reduce the number of webgl
           * draw calls. Retained mode is more efficient & performative,
           * however, Immediate Mode is useful for sketching quick
           * geometric ideas.
           */
          'use strict';

          var p5 = _dereq_('../core/main');
          var constants = _dereq_('../core/constants');

          /**
           * Begin shape drawing.  This is a helpful way of generating
           * custom shapes quickly.  However in WEBGL mode, application
           * performance will likely drop as a result of too many calls to
           * <a href="#/p5/beginShape">beginShape()</a> / <a href="#/p5/endShape">endShape()</a>.  As a high performance alternative,
           * please use p5.js geometry primitives.
           * @private
           * @method beginShape
           * @param  {Number} mode webgl primitives mode.  beginShape supports the
           *                       following modes:
           *                       POINTS,LINES,LINE_STRIP,LINE_LOOP,TRIANGLES,
           *                       TRIANGLE_STRIP,and TRIANGLE_FAN.
           * @chainable
           */
          p5.RendererGL.prototype.beginShape = function(mode) {
            //default shape mode is line_strip
            this.immediateMode.shapeMode = mode !== undefined ? mode : constants.LINE_STRIP;
            //if we haven't yet initialized our
            //immediateMode vertices & buffers, create them now!
            if (this.immediateMode.vertices === undefined) {
              this.immediateMode.vertices = [];
              this.immediateMode.edges = [];
              this.immediateMode.lineVertices = [];
              this.immediateMode.vertexColors = [];
              this.immediateMode.lineNormals = [];
              this.immediateMode.uvCoords = [];
              this.immediateMode.vertexBuffer = this.GL.createBuffer();
              this.immediateMode.colorBuffer = this.GL.createBuffer();
              this.immediateMode.uvBuffer = this.GL.createBuffer();
              this.immediateMode.lineVertexBuffer = this.GL.createBuffer();
              this.immediateMode.lineNormalBuffer = this.GL.createBuffer();
              this.immediateMode.pointVertexBuffer = this.GL.createBuffer();
              this.immediateMode._bezierVertex = [];
              this.immediateMode._quadraticVertex = [];
              this.immediateMode._curveVertex = [];
              this.immediateMode._isCoplanar = true;
              this.immediateMode._testIfCoplanar = null;
            } else {
              this.immediateMode.vertices.length = 0;
              this.immediateMode.edges.length = 0;
              this.immediateMode.lineVertices.length = 0;
              this.immediateMode.lineNormals.length = 0;
              this.immediateMode.vertexColors.length = 0;
              this.immediateMode.uvCoords.length = 0;
            }
            this.isImmediateDrawing = true;
            return this;
          };
          /**
           * adds a vertex to be drawn in a custom Shape.
           * @private
           * @method vertex
           * @param  {Number} x x-coordinate of vertex
           * @param  {Number} y y-coordinate of vertex
           * @param  {Number} z z-coordinate of vertex
           * @chainable
           * @TODO implement handling of <a href="#/p5.Vector">p5.Vector</a> args
           */
          p5.RendererGL.prototype.vertex = function(x, y) {
            var z, u, v;

            // default to (x, y) mode: all other arugments assumed to be 0.
            z = u = v = 0;

            if (arguments.length === 3) {
              // (x, y, z) mode: (u, v) assumed to be 0.
              z = arguments[2];
            } else if (arguments.length === 4) {
              // (x, y, u, v) mode: z assumed to be 0.
              u = arguments[2];
              v = arguments[3];
            } else if (arguments.length === 5) {
              // (x, y, z, u, v) mode
              z = arguments[2];
              u = arguments[3];
              v = arguments[4];
            }
            if (this.immediateMode._testIfCoplanar == null) {
              this.immediateMode._testIfCoplanar = z;
            } else if (this.immediateMode._testIfCoplanar !== z) {
              this.immediateMode._isCoplanar = false;
            }
            var vert = new p5.Vector(x, y, z);
            this.immediateMode.vertices.push(vert);
            var vertexColor = this.curFillColor || [0.5, 0.5, 0.5, 1.0];
            this.immediateMode.vertexColors.push(
              vertexColor[0],
              vertexColor[1],
              vertexColor[2],
              vertexColor[3]
            );

            if (this.textureMode === constants.IMAGE) {
              if (this._tex !== null) {
                if (this._tex.width > 0 && this._tex.height > 0) {
                  u /= this._tex.width;
                  v /= this._tex.height;
                }
              } else if (this._tex === null && arguments.length >= 4) {
                // Only throw this warning if custom uv's have  been provided
                console.warn(
                  'You must first call texture() before using' +
                    ' vertex() with image based u and v coordinates'
                );
              }
            }

            this.immediateMode.uvCoords.push(u, v);

            this.immediateMode._bezierVertex[0] = x;
            this.immediateMode._bezierVertex[1] = y;
            this.immediateMode._bezierVertex[2] = z;

            this.immediateMode._quadraticVertex[0] = x;
            this.immediateMode._quadraticVertex[1] = y;
            this.immediateMode._quadraticVertex[2] = z;

            return this;
          };

          /**
           * End shape drawing and render vertices to screen.
           * @chainable
           */
          p5.RendererGL.prototype.endShape = function(
            mode,
            isCurve,
            isBezier,
            isQuadratic,
            isContour,
            shapeKind
          ) {
            if (this.immediateMode.shapeMode === constants.POINTS) {
              this._drawPoints(
                this.immediateMode.vertices,
                this.immediateMode.pointVertexBuffer
              );
            } else if (this.immediateMode.vertices.length > 1) {
              if (this._doStroke && this.drawMode !== constants.TEXTURE) {
                if (this.immediateMode.shapeMode === constants.TRIANGLE_STRIP) {
                  var i;
                  for (i = 0; i < this.immediateMode.vertices.length - 2; i++) {
                    this.immediateMode.edges.push([i, i + 1]);
                    this.immediateMode.edges.push([i, i + 2]);
                  }
                  this.immediateMode.edges.push([i, i + 1]);
                } else if (this.immediateMode.shapeMode === constants.TRIANGLES) {
                  for (i = 0; i < this.immediateMode.vertices.length - 2; i = i + 3) {
                    this.immediateMode.edges.push([i, i + 1]);
                    this.immediateMode.edges.push([i + 1, i + 2]);
                    this.immediateMode.edges.push([i + 2, i]);
                  }
                } else if (this.immediateMode.shapeMode === constants.LINES) {
                  for (i = 0; i < this.immediateMode.vertices.length - 1; i = i + 2) {
                    this.immediateMode.edges.push([i, i + 1]);
                  }
                } else {
                  for (i = 0; i < this.immediateMode.vertices.length - 1; i++) {
                    this.immediateMode.edges.push([i, i + 1]);
                  }
                }
                if (mode === constants.CLOSE) {
                  this.immediateMode.edges.push([
                    this.immediateMode.vertices.length - 1,
                    0
                  ]);
                }

                p5.Geometry.prototype._edgesToVertices.call(this.immediateMode);
                this._drawStrokeImmediateMode();
              }

              if (this._doFill && this.immediateMode.shapeMode !== constants.LINES) {
                if (
                  this.isBezier ||
                  this.isQuadratic ||
                  this.isCurve ||
                  (this.immediateMode.shapeMode === constants.LINE_STRIP &&
                    this.drawMode === constants.FILL &&
                    this.immediateMode._isCoplanar === true)
                ) {
                  this.immediateMode.shapeMode = constants.TRIANGLES;
                  var contours = [
                    new Float32Array(this._vToNArray(this.immediateMode.vertices))
                  ];

                  var polyTriangles = this._triangulate(contours);
                  this.immediateMode.vertices = [];
                  for (
                    var j = 0, polyTriLength = polyTriangles.length;
                    j < polyTriLength;
                    j = j + 3
                  ) {
                    this.vertex(
                      polyTriangles[j],
                      polyTriangles[j + 1],
                      polyTriangles[j + 2]
                    );
                  }
                }
                if (this.immediateMode.vertices.length > 0) {
                  this._drawFillImmediateMode(
                    mode,
                    isCurve,
                    isBezier,
                    isQuadratic,
                    isContour,
                    shapeKind
                  );
                }
              }
            }
            //clear out our vertexPositions & colors arrays
            //after rendering
            this.immediateMode.vertices.length = 0;
            this.immediateMode.vertexColors.length = 0;
            this.immediateMode.uvCoords.length = 0;
            this.isImmediateDrawing = false;
            this.isBezier = false;
            this.isQuadratic = false;
            this.isCurve = false;
            this.immediateMode._bezierVertex.length = 0;
            this.immediateMode._quadraticVertex.length = 0;
            this.immediateMode._curveVertex.length = 0;
            this.immediateMode._isCoplanar = true;
            this.immediateMode._testIfCoplanar = null;

            return this;
          };

          p5.RendererGL.prototype._drawFillImmediateMode = function(
            mode,
            isCurve,
            isBezier,
            isQuadratic,
            isContour,
            shapeKind
          ) {
            var gl = this.GL;
            var shader = this._getImmediateFillShader();
            this._setFillUniforms(shader);

            // initialize the fill shader's 'aPosition' buffer
            if (shader.attributes.aPosition) {
              //vertex position Attribute
              this._bindBuffer(
                this.immediateMode.vertexBuffer,
                gl.ARRAY_BUFFER,
                this._vToNArray(this.immediateMode.vertices),
                Float32Array,
                gl.DYNAMIC_DRAW
              );

              shader.enableAttrib(shader.attributes.aPosition, 3);
            }

            // initialize the fill shader's 'aVertexColor' buffer
            if (this.drawMode === constants.FILL && shader.attributes.aVertexColor) {
              this._bindBuffer(
                this.immediateMode.colorBuffer,
                gl.ARRAY_BUFFER,
                this.immediateMode.vertexColors,
                Float32Array,
                gl.DYNAMIC_DRAW
              );

              shader.enableAttrib(shader.attributes.aVertexColor, 4);
            }

            // initialize the fill shader's 'aTexCoord' buffer
            if (this.drawMode === constants.TEXTURE && shader.attributes.aTexCoord) {
              //texture coordinate Attribute
              this._bindBuffer(
                this.immediateMode.uvBuffer,
                gl.ARRAY_BUFFER,
                this.immediateMode.uvCoords,
                Float32Array,
                gl.DYNAMIC_DRAW
              );

              shader.enableAttrib(shader.attributes.aTexCoord, 2);
            }

            //if (true || mode) {
            if (this.drawMode === constants.FILL || this.drawMode === constants.TEXTURE) {
              switch (this.immediateMode.shapeMode) {
                case constants.LINE_STRIP:
                case constants.LINES:
                  this.immediateMode.shapeMode = constants.TRIANGLE_FAN;
                  break;
              }
            } else {
              switch (this.immediateMode.shapeMode) {
                case constants.LINE_STRIP:
                case constants.LINES:
                  this.immediateMode.shapeMode = constants.LINE_LOOP;
                  break;
              }
            }
            //}
            //QUADS & QUAD_STRIP are not supported primitives modes
            //in webgl.
            if (
              this.immediateMode.shapeMode === constants.QUADS ||
              this.immediateMode.shapeMode === constants.QUAD_STRIP
            ) {
              throw new Error(
                'sorry, ' +
                  this.immediateMode.shapeMode +
                  ' not yet implemented in webgl mode.'
              );
            } else {
              this._applyColorBlend(this.curFillColor);
              gl.enable(gl.BLEND);
              gl.drawArrays(
                this.immediateMode.shapeMode,
                0,
                this.immediateMode.vertices.length
              );

              this._pixelsState._pixelsDirty = true;
            }
            // todo / optimizations? leave bound until another shader is set?
            shader.unbindShader();
          };

          p5.RendererGL.prototype._drawStrokeImmediateMode = function() {
            var gl = this.GL;
            var shader = this._getImmediateStrokeShader();
            this._setStrokeUniforms(shader);

            // initialize the stroke shader's 'aPosition' buffer
            if (shader.attributes.aPosition) {
              this._bindBuffer(
                this.immediateMode.lineVertexBuffer,
                gl.ARRAY_BUFFER,
                this._flatten(this.immediateMode.lineVertices),
                Float32Array,
                gl.STATIC_DRAW
              );

              shader.enableAttrib(shader.attributes.aPosition, 3);
            }

            // initialize the stroke shader's 'aDirection' buffer
            if (shader.attributes.aDirection) {
              this._bindBuffer(
                this.immediateMode.lineNormalBuffer,
                gl.ARRAY_BUFFER,
                this._flatten(this.immediateMode.lineNormals),
                Float32Array,
                gl.STATIC_DRAW
              );

              shader.enableAttrib(shader.attributes.aDirection, 4);
            }

            this._applyColorBlend(this.curStrokeColor);
            gl.drawArrays(gl.TRIANGLES, 0, this.immediateMode.lineVertices.length);

            this._pixelsState._pixelsDirty = true;

            shader.unbindShader();
          };

          module.exports = p5.RendererGL;
        },
        { '../core/constants': 18, '../core/main': 24 }
      ],
      74: [
        function(_dereq_, module, exports) {
          //Retained Mode. The default mode for rendering 3D primitives
          //in WEBGL.
          'use strict';

          var p5 = _dereq_('../core/main');
          _dereq_('./p5.RendererGL');

          // a render buffer definition
          function BufferDef(size, src, dst, attr, map) {
            this.size = size; // the number of FLOATs in each vertex
            this.src = src; // the name of the model's source array
            this.dst = dst; // the name of the geometry's buffer
            this.attr = attr; // the name of the vertex attribute
            this.map = map; // optional, a transformation function to apply to src
          }

          var _flatten = p5.RendererGL.prototype._flatten;
          var _vToNArray = p5.RendererGL.prototype._vToNArray;

          var strokeBuffers = [
            new BufferDef(3, 'lineVertices', 'lineVertexBuffer', 'aPosition', _flatten),
            new BufferDef(4, 'lineNormals', 'lineNormalBuffer', 'aDirection', _flatten)
          ];

          var fillBuffers = [
            new BufferDef(3, 'vertices', 'vertexBuffer', 'aPosition', _vToNArray),
            new BufferDef(3, 'vertexNormals', 'normalBuffer', 'aNormal', _vToNArray),
            new BufferDef(4, 'vertexColors', 'colorBuffer', 'aMaterialColor'),
            new BufferDef(3, 'vertexAmbients', 'ambientBuffer', 'aAmbientColor'),
            //new BufferDef(3, 'vertexSpeculars', 'specularBuffer', 'aSpecularColor'),
            new BufferDef(2, 'uvs', 'uvBuffer', 'aTexCoord', _flatten)
          ];

          p5.RendererGL._textBuffers = [
            new BufferDef(3, 'vertices', 'vertexBuffer', 'aPosition', _vToNArray),
            new BufferDef(2, 'uvs', 'uvBuffer', 'aTexCoord', _flatten)
          ];

          var hashCount = 0;
          /**
           * _initBufferDefaults
           * @private
           * @description initializes buffer defaults. runs each time a new geometry is
           * registered
           * @param  {String} gId  key of the geometry object
           * @returns {Object} a new buffer object
           */
          p5.RendererGL.prototype._initBufferDefaults = function(gId) {
            this._freeBuffers(gId);

            //@TODO remove this limit on hashes in gHash
            hashCount++;
            if (hashCount > 1000) {
              var key = Object.keys(this.gHash)[0];
              delete this.gHash[key];
              hashCount--;
            }

            //create a new entry in our gHash
            return (this.gHash[gId] = {});
          };

          p5.RendererGL.prototype._freeBuffers = function(gId) {
            var buffers = this.gHash[gId];
            if (!buffers) {
              return;
            }

            delete this.gHash[gId];
            hashCount--;

            var gl = this.GL;
            if (buffers.indexBuffer) {
              gl.deleteBuffer(buffers.indexBuffer);
            }

            function freeBuffers(defs) {
              for (var i = 0; i < defs.length; i++) {
                var def = defs[i];
                if (buffers[def.dst]) {
                  gl.deleteBuffer(buffers[def.dst]);
                  buffers[def.dst] = null;
                }
              }
            }

            // free all the buffers
            freeBuffers(strokeBuffers);
            freeBuffers(fillBuffers);
          };

          p5.RendererGL.prototype._prepareBuffers = function(buffers, shader, defs) {
            var model = buffers.model;
            var attributes = shader.attributes;
            var gl = this.GL;

            // loop through each of the buffer definitions
            for (var i = 0; i < defs.length; i++) {
              var def = defs[i];

              var attr = attributes[def.attr];
              if (!attr) continue;

              var buffer = buffers[def.dst];

              // check if the model has the appropriate source array
              var src = model[def.src];
              if (src) {
                // check if we need to create the GL buffer
                var createBuffer = !buffer;
                if (createBuffer) {
                  // create and remember the buffer
                  buffers[def.dst] = buffer = gl.createBuffer();
                }
                // bind the buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

                // check if we need to fill the buffer with data
                if (createBuffer || model.dirtyFlags[def.src] !== false) {
                  var map = def.map;
                  // get the values from the model, possibly transformed
                  var values = map ? map(src) : src;

                  // fill the buffer with the values
                  this._bindBuffer(buffer, gl.ARRAY_BUFFER, values);

                  // mark the model's source array as clean
                  model.dirtyFlags[def.src] = false;
                }
                // enable the attribute
                shader.enableAttrib(attr, def.size);
              } else {
                if (buffer) {
                  // remove the unused buffer
                  gl.deleteBuffer(buffer);
                  buffers[def.dst] = null;
                }
                // disable the vertex
                gl.disableVertexAttribArray(attr.index);
              }
            }
          };

          /**
           * creates a buffers object that holds the WebGL render buffers
           * for a geometry.
           * @private
           * @param  {String} gId    key of the geometry object
           * @param  {p5.Geometry}  model contains geometry data
           */
          p5.RendererGL.prototype.createBuffers = function(gId, model) {
            var gl = this.GL;
            //initialize the gl buffers for our geom groups
            var buffers = this._initBufferDefaults(gId);
            buffers.model = model;

            var indexBuffer = buffers.indexBuffer;

            if (model.faces.length) {
              // allocate space for faces
              if (!indexBuffer) indexBuffer = buffers.indexBuffer = gl.createBuffer();
              var vals = p5.RendererGL.prototype._flatten(model.faces);
              this._bindBuffer(indexBuffer, gl.ELEMENT_ARRAY_BUFFER, vals, Uint16Array);

              // the vertex count is based on the number of faces
              buffers.vertexCount = model.faces.length * 3;
            } else {
              // the index buffer is unused, remove it
              if (indexBuffer) {
                gl.deleteBuffer(indexBuffer);
                buffers.indexBuffer = null;
              }
              // the vertex count comes directly from the model
              buffers.vertexCount = model.vertices ? model.vertices.length : 0;
            }

            buffers.lineVertexCount = model.lineVertices ? model.lineVertices.length : 0;

            return buffers;
          };

          /**
           * Draws buffers given a geometry key ID
           * @private
           * @param  {String} gId     ID in our geom hash
           * @chainable
           */
          p5.RendererGL.prototype.drawBuffers = function(gId) {
            var gl = this.GL;
            var buffers = this.gHash[gId];

            if (this._doStroke && buffers.lineVertexCount > 0) {
              var strokeShader = this._getRetainedStrokeShader();
              this._setStrokeUniforms(strokeShader);
              this._prepareBuffers(buffers, strokeShader, strokeBuffers);
              this._applyColorBlend(this.curStrokeColor);
              this._drawArrays(gl.TRIANGLES, gId);
              strokeShader.unbindShader();
            }

            if (this._doFill) {
              var fillShader = this._getRetainedFillShader();
              this._setFillUniforms(fillShader);
              this._prepareBuffers(buffers, fillShader, fillBuffers);
              if (buffers.indexBuffer) {
                //vertex index buffer
                this._bindBuffer(buffers.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);
              }
              this._applyColorBlend(this.curFillColor);
              this._drawElements(gl.TRIANGLES, gId);
              fillShader.unbindShader();
            }
            return this;
          };

          /**
           * Calls drawBuffers() with a scaled model/view matrix.
           *
           * This is used by various 3d primitive methods (in primitives.js, eg. plane,
           * box, torus, etc...) to allow caching of un-scaled geometries. Those
           * geometries are generally created with unit-length dimensions, cached as
           * such, and then scaled appropriately in this method prior to rendering.
           *
           * @private
           * @method drawBuffersScaled
           * @param {String} gId     ID in our geom hash
           * @param {Number} scaleX  the amount to scale in the X direction
           * @param {Number} scaleY  the amount to scale in the Y direction
           * @param {Number} scaleZ  the amount to scale in the Z direction
           */
          p5.RendererGL.prototype.drawBuffersScaled = function(
            gId,
            scaleX,
            scaleY,
            scaleZ
          ) {
            var uMVMatrix = this.uMVMatrix.copy();
            try {
              this.uMVMatrix.scale(scaleX, scaleY, scaleZ);
              this.drawBuffers(gId);
            } finally {
              this.uMVMatrix = uMVMatrix;
            }
          };

          p5.RendererGL.prototype._drawArrays = function(drawMode, gId) {
            this.GL.drawArrays(drawMode, 0, this.gHash[gId].lineVertexCount);
            this._pixelsState._pixelsDirty = true;
            return this;
          };

          p5.RendererGL.prototype._drawElements = function(drawMode, gId) {
            var buffers = this.gHash[gId];
            var gl = this.GL;
            // render the fill
            if (buffers.indexBuffer) {
              // we're drawing faces
              gl.drawElements(gl.TRIANGLES, buffers.vertexCount, gl.UNSIGNED_SHORT, 0);
            } else {
              // drawing vertices
              gl.drawArrays(drawMode || gl.TRIANGLES, 0, buffers.vertexCount);
            }
            this._pixelsState._pixelsDirty = true;
          };

          p5.RendererGL.prototype._drawPoints = function(vertices, vertexBuffer) {
            var gl = this.GL;
            var pointShader = this._getImmediatePointShader();
            this._setPointUniforms(pointShader);

            this._bindBuffer(
              vertexBuffer,
              gl.ARRAY_BUFFER,
              this._vToNArray(vertices),
              Float32Array,
              gl.STATIC_DRAW
            );

            pointShader.enableAttrib(pointShader.attributes.aPosition, 3);

            gl.drawArrays(gl.Points, 0, vertices.length);

            pointShader.unbindShader();
            this._pixelsState._pixelsDirty = true;
          };

          module.exports = p5.RendererGL;
        },
        { '../core/main': 24, './p5.RendererGL': 75 }
      ],
      75: [
        function(_dereq_, module, exports) {
          'use strict';

          var p5 = _dereq_('../core/main');
          var constants = _dereq_('../core/constants');
          var libtess = _dereq_('libtess');
          _dereq_('./p5.Shader');
          _dereq_('./p5.Camera');
          _dereq_('../core/p5.Renderer');
          _dereq_('./p5.Matrix');

          var lightingShader =
            'precision mediump float;\n\nuniform mat4 uViewMatrix;\n\nuniform bool uUseLighting;\n\nuniform int uAmbientLightCount;\nuniform vec3 uAmbientColor[8];\n\nuniform int uDirectionalLightCount;\nuniform vec3 uLightingDirection[8];\nuniform vec3 uDirectionalColor[8];\n\nuniform int uPointLightCount;\nuniform vec3 uPointLightLocation[8];\nuniform vec3 uPointLightColor[8];\n\nuniform bool uSpecular;\nuniform float uShininess;\n\nuniform float uConstantAttenuation;\nuniform float uLinearAttenuation;\nuniform float uQuadraticAttenuation;\n\nconst float specularFactor = 2.0;\nconst float diffuseFactor = 0.73;\n\nstruct LightResult {\n  float specular;\n  float diffuse;\n};\n\nfloat _phongSpecular(\n  vec3 lightDirection,\n  vec3 viewDirection,\n  vec3 surfaceNormal,\n  float shininess) {\n\n  vec3 R = reflect(lightDirection, surfaceNormal);\n  return pow(max(0.0, dot(R, viewDirection)), shininess);\n}\n\nfloat _lambertDiffuse(vec3 lightDirection, vec3 surfaceNormal) {\n  return max(0.0, dot(-lightDirection, surfaceNormal));\n}\n\nLightResult _light(vec3 viewDirection, vec3 normal, vec3 lightVector) {\n\n  vec3 lightDir = normalize(lightVector);\n\n  //compute our diffuse & specular terms\n  LightResult lr;\n  if (uSpecular)\n    lr.specular = _phongSpecular(lightDir, viewDirection, normal, uShininess);\n  lr.diffuse = _lambertDiffuse(lightDir, normal);\n  return lr;\n}\n\nvoid totalLight(\n  vec3 modelPosition,\n  vec3 normal,\n  out vec3 totalDiffuse,\n  out vec3 totalSpecular\n) {\n\n  totalSpecular = vec3(0.0);\n\n  if (!uUseLighting) {\n    totalDiffuse = vec3(1.0);\n    return;\n  }\n\n  totalDiffuse = vec3(0.0);\n\n  vec3 viewDirection = normalize(-modelPosition);\n\n  for (int j = 0; j < 8; j++) {\n    if (j < uDirectionalLightCount) {\n      vec3 lightVector = (uViewMatrix * vec4(uLightingDirection[j], 0.0)).xyz;\n      vec3 lightColor = uDirectionalColor[j];\n      LightResult result = _light(viewDirection, normal, lightVector);\n      totalDiffuse += result.diffuse * lightColor;\n      totalSpecular += result.specular * lightColor;\n    }\n\n    if (j < uPointLightCount) {\n      vec3 lightPosition = (uViewMatrix * vec4(uPointLightLocation[j], 1.0)).xyz;\n      vec3 lightVector = modelPosition - lightPosition;\n    \n      //calculate attenuation\n      float lightDistance = length(lightVector);\n      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);\n      vec3 lightColor = lightFalloff * uPointLightColor[j];\n\n      LightResult result = _light(viewDirection, normal, lightVector);\n      totalDiffuse += result.diffuse * lightColor;\n      totalSpecular += result.specular * lightColor;\n    }\n  }\n\n  totalDiffuse *= diffuseFactor;\n  totalSpecular *= specularFactor;\n}\n';

          var defaultShaders = {
            immediateVert:
              'attribute vec3 aPosition;\nattribute vec4 aVertexColor;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform float uResolution;\nuniform float uPointSize;\n\nvarying vec4 vColor;\nvoid main(void) {\n  vec4 positionVec4 = vec4(aPosition, 1.0);\n  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\n  vColor = aVertexColor;\n  gl_PointSize = uPointSize;\n}\n',
            vertexColorVert:
              'attribute vec3 aPosition;\nattribute vec4 aVertexColor;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  vec4 positionVec4 = vec4(aPosition, 1.0);\n  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\n  vColor = aVertexColor;\n}\n',
            vertexColorFrag:
              'precision mediump float;\nvarying vec4 vColor;\nvoid main(void) {\n  gl_FragColor = vColor;\n}',
            normalVert:
              'attribute vec3 aPosition;\nattribute vec3 aNormal;\nattribute vec2 aTexCoord;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\n\nvarying vec3 vVertexNormal;\nvarying highp vec2 vVertTexCoord;\n\nvoid main(void) {\n  vec4 positionVec4 = vec4(aPosition, 1.0);\n  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\n  vVertexNormal = normalize(vec3( uNormalMatrix * aNormal ));\n  vVertTexCoord = aTexCoord;\n}\n',
            normalFrag:
              'precision mediump float;\nvarying vec3 vVertexNormal;\nvoid main(void) {\n  gl_FragColor = vec4(vVertexNormal, 1.0);\n}',
            basicFrag:
              'precision mediump float;\nuniform vec4 uMaterialColor;\nvoid main(void) {\n  gl_FragColor = uMaterialColor;\n}',
            lightVert:
              lightingShader +
              '// include lighting.glgl\n\nattribute vec3 aPosition;\nattribute vec3 aNormal;\nattribute vec2 aTexCoord;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\n\nvarying highp vec2 vVertTexCoord;\nvarying vec3 vDiffuseColor;\nvarying vec3 vSpecularColor;\n\nvoid main(void) {\n\n  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);\n  gl_Position = uProjectionMatrix * viewModelPosition;\n\n  vec3 vertexNormal = normalize(uNormalMatrix * aNormal);\n  vVertTexCoord = aTexCoord;\n\n  totalLight(viewModelPosition.xyz, vertexNormal, vDiffuseColor, vSpecularColor);\n\n  for (int i = 0; i < 8; i++) {\n    if (i < uAmbientLightCount) {\n      vDiffuseColor += uAmbientColor[i];\n    }\n  }\n}\n',
            lightTextureFrag:
              'precision mediump float;\n\nuniform vec4 uMaterialColor;\nuniform vec4 uTint;\nuniform sampler2D uSampler;\nuniform bool isTexture;\n\nvarying highp vec2 vVertTexCoord;\nvarying vec3 vDiffuseColor;\nvarying vec3 vSpecularColor;\n\nvoid main(void) {\n  gl_FragColor = isTexture ? texture2D(uSampler, vVertTexCoord) * (uTint / vec4(255, 255, 255, 255)) : uMaterialColor;\n  gl_FragColor.rgb = gl_FragColor.rgb * vDiffuseColor + vSpecularColor;\n}',
            phongVert:
              'precision mediump float;\nprecision mediump int;\n\nattribute vec3 aPosition;\nattribute vec3 aNormal;\nattribute vec2 aTexCoord;\n\nuniform vec3 uAmbientColor[8];\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\nuniform int uAmbientLightCount;\n\nvarying vec3 vNormal;\nvarying vec2 vTexCoord;\nvarying vec3 vViewPosition;\nvarying vec3 vAmbientColor;\n\nvoid main(void) {\n\n  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);\n\n  // Pass varyings to fragment shader\n  vViewPosition = viewModelPosition.xyz;\n  gl_Position = uProjectionMatrix * viewModelPosition;  \n\n  vNormal = uNormalMatrix * aNormal;\n  vTexCoord = aTexCoord;\n\n  // TODO: this should be a uniform\n  vAmbientColor = vec3(0.0);\n  for (int i = 0; i < 8; i++) {\n    if (i < uAmbientLightCount) {\n      vAmbientColor += uAmbientColor[i];\n    }\n  }\n}\n',
            phongFrag:
              lightingShader +
              '// include lighting.glgl\n\nuniform vec4 uMaterialColor;\nuniform sampler2D uSampler;\nuniform bool isTexture;\n\nvarying vec3 vNormal;\nvarying vec2 vTexCoord;\nvarying vec3 vViewPosition;\nvarying vec3 vAmbientColor;\n\nvoid main(void) {\n\n  vec3 diffuse;\n  vec3 specular;\n  totalLight(vViewPosition, normalize(vNormal), diffuse, specular);\n\n  gl_FragColor = isTexture ? texture2D(uSampler, vTexCoord) : uMaterialColor;\n  gl_FragColor.rgb = gl_FragColor.rgb * (diffuse + vAmbientColor) + specular;\n}',
            fontVert:
              "precision mediump float;\n\nattribute vec3 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nuniform vec4 uGlyphRect;\nuniform float uGlyphOffset;\n\nvarying vec2 vTexCoord;\nvarying float w;\n\nvoid main() {\n  vec4 positionVec4 = vec4(aPosition, 1.0);\n\n  // scale by the size of the glyph's rectangle\n  positionVec4.xy *= uGlyphRect.zw - uGlyphRect.xy;\n\n  // move to the corner of the glyph\n  positionVec4.xy += uGlyphRect.xy;\n\n  // move to the letter's line offset\n  positionVec4.x += uGlyphOffset;\n  \n  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\n  vTexCoord = aTexCoord;\n  w = gl_Position.w;\n}\n",
            fontFrag:
              "#extension GL_OES_standard_derivatives : enable\nprecision mediump float;\n\n#if 0\n  // simulate integer math using floats\n\t#define int float\n\t#define ivec2 vec2\n\t#define INT(x) float(x)\n\n\tint ifloor(float v) { return floor(v); }\n\tivec2 ifloor(vec2 v) { return floor(v); }\n\n#else\n  // use native integer math\n\tprecision highp int;\n\t#define INT(x) x\n\n\tint ifloor(float v) { return int(v); }\n\tint ifloor(int v) { return v; }\n\tivec2 ifloor(vec2 v) { return ivec2(v); }\n\n#endif\n\nuniform sampler2D uSamplerStrokes;\nuniform sampler2D uSamplerRowStrokes;\nuniform sampler2D uSamplerRows;\nuniform sampler2D uSamplerColStrokes;\nuniform sampler2D uSamplerCols;\n\nuniform ivec2 uStrokeImageSize;\nuniform ivec2 uCellsImageSize;\nuniform ivec2 uGridImageSize;\n\nuniform ivec2 uGridOffset;\nuniform ivec2 uGridSize;\nuniform vec4 uMaterialColor;\n\nvarying vec2 vTexCoord;\n\n// some helper functions\nint round(float v) { return ifloor(v + 0.5); }\nivec2 round(vec2 v) { return ifloor(v + 0.5); }\nfloat saturate(float v) { return clamp(v, 0.0, 1.0); }\nvec2 saturate(vec2 v) { return clamp(v, 0.0, 1.0); }\n\nint mul(float v1, int v2) {\n  return ifloor(v1 * float(v2));\n}\n\nivec2 mul(vec2 v1, ivec2 v2) {\n  return ifloor(v1 * vec2(v2) + 0.5);\n}\n\n// unpack a 16-bit integer from a float vec2\nint getInt16(vec2 v) {\n  ivec2 iv = round(v * 255.0);\n  return iv.x * INT(128) + iv.y;\n}\n\nvec2 pixelScale;\nvec2 coverage = vec2(0.0);\nvec2 weight = vec2(0.5);\nconst float minDistance = 1.0/8192.0;\nconst float hardness = 1.05; // amount of antialias\n\n// the maximum number of curves in a glyph\nconst int N = INT(250);\n\n// retrieves an indexed pixel from a sampler\nvec4 getTexel(sampler2D sampler, int pos, ivec2 size) {\n  int width = size.x;\n  int y = ifloor(pos / width);\n  int x = pos - y * width;  // pos % width\n\n  return texture2D(sampler, (vec2(x, y) + 0.5) / vec2(size));\n}\n\nvoid calulateCrossings(vec2 p0, vec2 p1, vec2 p2, out vec2 C1, out vec2 C2) {\n\n  // get the coefficients of the quadratic in t\n  vec2 a = p0 - p1 * 2.0 + p2;\n  vec2 b = p0 - p1;\n  vec2 c = p0 - vTexCoord;\n\n  // found out which values of 't' it crosses the axes\n  vec2 surd = sqrt(max(vec2(0.0), b * b - a * c));\n  vec2 t1 = ((b - surd) / a).yx;\n  vec2 t2 = ((b + surd) / a).yx;\n\n  // approximate straight lines to avoid rounding errors\n  if (abs(a.y) < 0.001)\n    t1.x = t2.x = c.y / (2.0 * b.y);\n\n  if (abs(a.x) < 0.001)\n    t1.y = t2.y = c.x / (2.0 * b.x);\n\n  // plug into quadratic formula to find the corrdinates of the crossings\n  C1 = ((a * t1 - b * 2.0) * t1 + c) * pixelScale;\n  C2 = ((a * t2 - b * 2.0) * t2 + c) * pixelScale;\n}\n\nvoid coverageX(vec2 p0, vec2 p1, vec2 p2) {\n\n  vec2 C1, C2;\n  calulateCrossings(p0, p1, p2, C1, C2);\n\n  // determine on which side of the x-axis the points lie\n  bool y0 = p0.y > vTexCoord.y;\n  bool y1 = p1.y > vTexCoord.y;\n  bool y2 = p2.y > vTexCoord.y;\n\n  // could web be under the curve (after t1)?\n  if (y1 ? !y2 : y0) {\n    // add the coverage for t1\n    coverage.x += saturate(C1.x + 0.5);\n    // calculate the anti-aliasing for t1\n    weight.x = min(weight.x, abs(C1.x));\n  }\n\n  // are we outside the curve (after t2)?\n  if (y1 ? !y0 : y2) {\n    // subtract the coverage for t2\n    coverage.x -= saturate(C2.x + 0.5);\n    // calculate the anti-aliasing for t2\n    weight.x = min(weight.x, abs(C2.x));\n  }\n}\n\n// this is essentially the same as coverageX, but with the axes swapped\nvoid coverageY(vec2 p0, vec2 p1, vec2 p2) {\n\n  vec2 C1, C2;\n  calulateCrossings(p0, p1, p2, C1, C2);\n\n  bool x0 = p0.x > vTexCoord.x;\n  bool x1 = p1.x > vTexCoord.x;\n  bool x2 = p2.x > vTexCoord.x;\n\n  if (x1 ? !x2 : x0) {\n    coverage.y -= saturate(C1.y + 0.5);\n    weight.y = min(weight.y, abs(C1.y));\n  }\n\n  if (x1 ? !x0 : x2) {\n    coverage.y += saturate(C2.y + 0.5);\n    weight.y = min(weight.y, abs(C2.y));\n  }\n}\n\nvoid main() {\n\n  // calculate the pixel scale based on screen-coordinates\n  pixelScale = hardness / fwidth(vTexCoord);\n\n  // which grid cell is this pixel in?\n  ivec2 gridCoord = ifloor(vTexCoord * vec2(uGridSize));\n\n  // intersect curves in this row\n  {\n    // the index into the row info bitmap\n    int rowIndex = gridCoord.y + uGridOffset.y;\n    // fetch the info texel\n    vec4 rowInfo = getTexel(uSamplerRows, rowIndex, uGridImageSize);\n    // unpack the rowInfo\n    int rowStrokeIndex = getInt16(rowInfo.xy);\n    int rowStrokeCount = getInt16(rowInfo.zw);\n\n    for (int iRowStroke = INT(0); iRowStroke < N; iRowStroke++) {\n      if (iRowStroke >= rowStrokeCount)\n        break;\n\n      // each stroke is made up of 3 points: the start and control point\n      // and the start of the next curve.\n      // fetch the indices of this pair of strokes:\n      vec4 strokeIndices = getTexel(uSamplerRowStrokes, rowStrokeIndex++, uCellsImageSize);\n\n      // unpack the stroke index\n      int strokePos = getInt16(strokeIndices.xy);\n\n      // fetch the two strokes\n      vec4 stroke0 = getTexel(uSamplerStrokes, strokePos + INT(0), uStrokeImageSize);\n      vec4 stroke1 = getTexel(uSamplerStrokes, strokePos + INT(1), uStrokeImageSize);\n\n      // calculate the coverage\n      coverageX(stroke0.xy, stroke0.zw, stroke1.xy);\n    }\n  }\n\n  // intersect curves in this column\n  {\n    int colIndex = gridCoord.x + uGridOffset.x;\n    vec4 colInfo = getTexel(uSamplerCols, colIndex, uGridImageSize);\n    int colStrokeIndex = getInt16(colInfo.xy);\n    int colStrokeCount = getInt16(colInfo.zw);\n    \n    for (int iColStroke = INT(0); iColStroke < N; iColStroke++) {\n      if (iColStroke >= colStrokeCount)\n        break;\n\n      vec4 strokeIndices = getTexel(uSamplerColStrokes, colStrokeIndex++, uCellsImageSize);\n\n      int strokePos = getInt16(strokeIndices.xy);\n      vec4 stroke0 = getTexel(uSamplerStrokes, strokePos + INT(0), uStrokeImageSize);\n      vec4 stroke1 = getTexel(uSamplerStrokes, strokePos + INT(1), uStrokeImageSize);\n      coverageY(stroke0.xy, stroke0.zw, stroke1.xy);\n    }\n  }\n\n  weight = saturate(1.0 - weight * 2.0);\n  float distance = max(weight.x + weight.y, minDistance); // manhattan approx.\n  float antialias = abs(dot(coverage, weight) / distance);\n  float cover = min(abs(coverage.x), abs(coverage.y));\n  gl_FragColor = uMaterialColor;\n  gl_FragColor.a *= saturate(max(antialias, cover));\n}",
            lineVert:
              "/*\n  Part of the Processing project - http://processing.org\n  Copyright (c) 2012-15 The Processing Foundation\n  Copyright (c) 2004-12 Ben Fry and Casey Reas\n  Copyright (c) 2001-04 Massachusetts Institute of Technology\n  This library is free software; you can redistribute it and/or\n  modify it under the terms of the GNU Lesser General Public\n  License as published by the Free Software Foundation, version 2.1.\n  This library is distributed in the hope that it will be useful,\n  but WITHOUT ANY WARRANTY; without even the implied warranty of\n  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU\n  Lesser General Public License for more details.\n  You should have received a copy of the GNU Lesser General\n  Public License along with this library; if not, write to the\n  Free Software Foundation, Inc., 59 Temple Place, Suite 330,\n  Boston, MA  02111-1307  USA\n*/\n\n#define PROCESSING_LINE_SHADER\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform float uStrokeWeight;\n\nuniform vec4 uViewport;\n\nattribute vec4 aPosition;\nattribute vec4 aDirection;\n  \nvoid main() {\n  // using a scale <1 moves the lines towards the camera\n  // in order to prevent popping effects due to half of\n  // the line disappearing behind the geometry faces.\n  vec3 scale = vec3(0.9995);\n\n  vec4 posp = uModelViewMatrix * aPosition;\n  vec4 posq = uModelViewMatrix * (aPosition + vec4(aDirection.xyz, 0));\n\n  // Moving vertices slightly toward the camera\n  // to avoid depth-fighting with the fill triangles.\n  // Discussed here:\n  // http://www.opengl.org/discussion_boards/ubbthreads.php?ubb=showflat&Number=252848  \n  posp.xyz = posp.xyz * scale;\n  posq.xyz = posq.xyz * scale;\n\n  vec4 p = uProjectionMatrix * posp;\n  vec4 q = uProjectionMatrix * posq;\n\n  // formula to convert from clip space (range -1..1) to screen space (range 0..[width or height])\n  // screen_p = (p.xy/p.w + <1,1>) * 0.5 * uViewport.zw\n\n  // prevent division by W by transforming the tangent formula (div by 0 causes\n  // the line to disappear, see https://github.com/processing/processing/issues/5183)\n  // t = screen_q - screen_p\n  //\n  // tangent is normalized and we don't care which aDirection it points to (+-)\n  // t = +- normalize( screen_q - screen_p )\n  // t = +- normalize( (q.xy/q.w+<1,1>)*0.5*uViewport.zw - (p.xy/p.w+<1,1>)*0.5*uViewport.zw )\n  //\n  // extract common factor, <1,1> - <1,1> cancels out\n  // t = +- normalize( (q.xy/q.w - p.xy/p.w) * 0.5 * uViewport.zw )\n  //\n  // convert to common divisor\n  // t = +- normalize( ((q.xy*p.w - p.xy*q.w) / (p.w*q.w)) * 0.5 * uViewport.zw )\n  //\n  // remove the common scalar divisor/factor, not needed due to normalize and +-\n  // (keep uViewport - can't remove because it has different components for x and y\n  //  and corrects for aspect ratio, see https://github.com/processing/processing/issues/5181)\n  // t = +- normalize( (q.xy*p.w - p.xy*q.w) * uViewport.zw )\n\n  vec2 tangent = normalize((q.xy*p.w - p.xy*q.w) * uViewport.zw);\n\n  // flip tangent to normal (it's already normalized)\n  vec2 normal = vec2(-tangent.y, tangent.x);\n\n  float thickness = aDirection.w * uStrokeWeight;\n  vec2 offset = normal * thickness / 2.0;\n\n  // Perspective ---\n  // convert from world to clip by multiplying with projection scaling factor\n  // to get the right thickness (see https://github.com/processing/processing/issues/5182)\n  // invert Y, projections in Processing invert Y\n  vec2 perspScale = (uProjectionMatrix * vec4(1, -1, 0, 0)).xy;\n\n  // No Perspective ---\n  // multiply by W (to cancel out division by W later in the pipeline) and\n  // convert from screen to clip (derived from clip to screen above)\n  vec2 noPerspScale = p.w / (0.5 * uViewport.zw);\n\n  //gl_Position.xy = p.xy + offset.xy * mix(noPerspScale, perspScale, float(perspective > 0));\n  gl_Position.xy = p.xy + offset.xy * perspScale;\n  gl_Position.zw = p.zw;\n}\n",
            lineFrag:
              'precision mediump float;\nprecision mediump int;\n\nuniform vec4 uMaterialColor;\n\nvoid main() {\n  gl_FragColor = uMaterialColor;\n}',
            pointVert:
              'attribute vec3 aPosition;\nuniform float uPointSize;\nvarying float vStrokeWeight;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nvoid main() {\n\tvec4 positionVec4 =  vec4(aPosition, 1.0);\n\tgl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;\n\tgl_PointSize = uPointSize;\n\tvStrokeWeight = uPointSize;\n}',
            pointFrag:
              'precision mediump float;\nprecision mediump int;\nuniform vec4 uMaterialColor;\nvarying float vStrokeWeight;\n\nvoid main(){\n\tfloat mask = 0.0;\n\n\t// make a circular mask using the gl_PointCoord (goes from 0 - 1 on a point)\n    // might be able to get a nicer edge on big strokeweights with smoothstep but slightly less performant\n\n\tmask = step(0.98, length(gl_PointCoord * 2.0 - 1.0));\n\n\t// if strokeWeight is 1 or less lets just draw a square\n\t// this prevents weird artifacting from carving circles when our points are really small\n\t// if strokeWeight is larger than 1, we just use it as is\n\n\tmask = mix(0.0, mask, clamp(floor(vStrokeWeight - 0.5),0.0,1.0));\n\n\t// throw away the borders of the mask\n    // otherwise we get weird alpha blending issues\n\n\tif(mask > 0.98){\n      discard;\n  \t}\n\n  \tgl_FragColor = vec4(uMaterialColor.rgb * (1.0 - mask), uMaterialColor.a) ;\n}'
          };

          /**
           * 3D graphics class
           * @private
           * @class p5.RendererGL
           * @constructor
           * @extends p5.Renderer
           * @todo extend class to include public method for offscreen
           * rendering (FBO).
           *
           */
          p5.RendererGL = function(elt, pInst, isMainCanvas, attr) {
            p5.Renderer.call(this, elt, pInst, isMainCanvas);
            this._setAttributeDefaults(pInst);
            this._initContext();
            this.isP3D = true; //lets us know we're in 3d mode
            this.GL = this.drawingContext;

            // lights
            this._enableLighting = false;

            this.ambientLightColors = [];
            this.directionalLightDirections = [];
            this.directionalLightColors = [];

            this.pointLightPositions = [];
            this.pointLightColors = [];

            this.drawMode = constants.FILL;
            this.curFillColor = [1, 1, 1, 1];
            this.curStrokeColor = [0, 0, 0, 1];
            this.curBlendMode = constants.BLEND;
            this.blendExt = this.GL.getExtension('EXT_blend_minmax');

            this._useSpecularMaterial = false;
            this._useNormalMaterial = false;
            this._useShininess = 1;

            this._tint = [255, 255, 255, 255];

            // lightFalloff variables
            this.constantAttenuation = 1;
            this.linearAttenuation = 0;
            this.quadraticAttenuation = 0;

            /**
             * model view, projection, & normal
             * matrices
             */
            this.uMVMatrix = new p5.Matrix();
            this.uPMatrix = new p5.Matrix();
            this.uNMatrix = new p5.Matrix('mat3');

            // Camera
            this._curCamera = new p5.Camera(this);
            this._curCamera._computeCameraDefaultSettings();
            this._curCamera._setDefaultCamera();

            //Geometry & Material hashes
            this.gHash = {};

            this._defaultLightShader = undefined;
            this._defaultImmediateModeShader = undefined;
            this._defaultNormalShader = undefined;
            this._defaultColorShader = undefined;
            this._defaultPointShader = undefined;

            this._pointVertexBuffer = this.GL.createBuffer();

            this.userFillShader = undefined;
            this.userStrokeShader = undefined;
            this.userPointShader = undefined;

            //Imediate Mode
            //default drawing is done in Retained Mode
            this.isImmediateDrawing = false;
            this.immediateMode = {};

            this.pointSize = 5.0; //default point size
            this.curStrokeWeight = 1;

            // array of textures created in this gl context via this.getTexture(src)
            this.textures = [];

            this.textureMode = constants.IMAGE;
            // default wrap settings
            this.textureWrapX = constants.CLAMP;
            this.textureWrapY = constants.CLAMP;
            this._tex = null;
            this._curveTightness = 6;

            // lookUpTable for coefficients needed to be calculated for bezierVertex, same are used for curveVertex
            this._lookUpTableBezier = [];
            // lookUpTable for coefficients needed to be calculated for quadraticVertex
            this._lookUpTableQuadratic = [];

            // current curveDetail in the Bezier lookUpTable
            this._lutBezierDetail = 0;
            // current curveDetail in the Quadratic lookUpTable
            this._lutQuadraticDetail = 0;

            this._tessy = this._initTessy();

            this.fontInfos = {};

            return this;
          };

          p5.RendererGL.prototype = Object.create(p5.Renderer.prototype);

          //////////////////////////////////////////////
          // Setting
          //////////////////////////////////////////////

          p5.RendererGL.prototype._setAttributeDefaults = function(pInst) {
            var defaults = {
              alpha: true,
              depth: true,
              stencil: true,
              antialias: false,
              premultipliedAlpha: false,
              preserveDrawingBuffer: true,
              perPixelLighting: false
            };

            if (pInst._glAttributes === null) {
              pInst._glAttributes = defaults;
            } else {
              pInst._glAttributes = Object.assign(defaults, pInst._glAttributes);
            }
            return;
          };

          p5.RendererGL.prototype._initContext = function() {
            try {
              this.drawingContext =
                this.canvas.getContext('webgl', this._pInst._glAttributes) ||
                this.canvas.getContext('experimental-webgl', this._pInst._glAttributes);
              if (this.drawingContext === null) {
                throw new Error('Error creating webgl context');
              } else {
                var gl = this.drawingContext;
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                this._viewport = this.drawingContext.getParameter(
                  this.drawingContext.VIEWPORT
                );
              }
            } catch (er) {
              throw er;
            }
          };

          //This is helper function to reset the context anytime the attributes
          //are changed with setAttributes()

          p5.RendererGL.prototype._resetContext = function(options, callback) {
            var w = this.width;
            var h = this.height;
            var defaultId = this.canvas.id;
            var isPGraphics = this._pInst instanceof p5.Graphics;

            if (isPGraphics) {
              var pg = this._pInst;
              pg.canvas.parentNode.removeChild(pg.canvas);
              pg.canvas = document.createElement('canvas');
              var node = pg._pInst._userNode || document.body;
              node.appendChild(pg.canvas);
              p5.Element.call(pg, pg.canvas, pg._pInst);
              pg.width = w;
              pg.height = h;
            } else {
              var c = this.canvas;
              if (c) {
                c.parentNode.removeChild(c);
              }
              c = document.createElement('canvas');
              c.id = defaultId;
              if (this._pInst._userNode) {
                this._pInst._userNode.appendChild(c);
              } else {
                document.body.appendChild(c);
              }
              this._pInst.canvas = c;
            }

            var renderer = new p5.RendererGL(this._pInst.canvas, this._pInst, !isPGraphics);

            this._pInst._setProperty('_renderer', renderer);
            renderer.resize(w, h);
            renderer._applyDefaults();

            if (!isPGraphics) {
              this._pInst._elements.push(renderer);
            }

            if (typeof callback === 'function') {
              //setTimeout with 0 forces the task to the back of the queue, this ensures that
              //we finish switching out the renderer
              setTimeout(function() {
                callback.apply(window._renderer, options);
              }, 0);
            }
          };
          /**
           * @module Rendering
           * @submodule Rendering
           * @for p5
           */
          /**
           * Set attributes for the WebGL Drawing context.
           * This is a way of adjusting how the WebGL
           * renderer works to fine-tune the display and performance.
           * <br><br>
           * Note that this will reinitialize the drawing context
           * if called after the WebGL canvas is made.
           * <br><br>
           * If an object is passed as the parameter, all attributes
           * not declared in the object will be set to defaults.
           * <br><br>
           * The available attributes are:
           * <br>
           * alpha - indicates if the canvas contains an alpha buffer
           * default is true
           * <br><br>
           * depth - indicates whether the drawing buffer has a depth buffer
           * of at least 16 bits - default is true
           * <br><br>
           * stencil - indicates whether the drawing buffer has a stencil buffer
           * of at least 8 bits
           * <br><br>
           * antialias - indicates whether or not to perform anti-aliasing
           * default is false
           * <br><br>
           * premultipliedAlpha - indicates that the page compositor will assume
           * the drawing buffer contains colors with pre-multiplied alpha
           * default is false
           * <br><br>
           * preserveDrawingBuffer - if true the buffers will not be cleared and
           * and will preserve their values until cleared or overwritten by author
           * (note that p5 clears automatically on draw loop)
           * default is true
           * <br><br>
           * perPixelLighting - if true, per-pixel lighting will be used in the
           * lighting shader.
           * default is false
           * <br><br>
           * @method setAttributes
           * @for p5
           * @param  {String}  key Name of attribute
           * @param  {Boolean}        value New value of named attribute
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(255);
           *   push();
           *   rotateZ(frameCount * 0.02);
           *   rotateX(frameCount * 0.02);
           *   rotateY(frameCount * 0.02);
           *   fill(0, 0, 0);
           *   box(50);
           *   pop();
           * }
           * </code>
           * </div>
           * <br>
           * Now with the antialias attribute set to true.
           * <br>
           * <div>
           * <code>
           * function setup() {
           *   setAttributes('antialias', true);
           *   createCanvas(100, 100, WEBGL);
           * }
           *
           * function draw() {
           *   background(255);
           *   push();
           *   rotateZ(frameCount * 0.02);
           *   rotateX(frameCount * 0.02);
           *   rotateY(frameCount * 0.02);
           *   fill(0, 0, 0);
           *   box(50);
           *   pop();
           * }
           * </code>
           * </div>
           *
           * <div>
           * <code>
           * // press the mouse button to enable perPixelLighting
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   noStroke();
           *   fill(255);
           * }
           *
           * var lights = [
           *   { c: '#f00', t: 1.12, p: 1.91, r: 0.2 },
           *   { c: '#0f0', t: 1.21, p: 1.31, r: 0.2 },
           *   { c: '#00f', t: 1.37, p: 1.57, r: 0.2 },
           *   { c: '#ff0', t: 1.12, p: 1.91, r: 0.7 },
           *   { c: '#0ff', t: 1.21, p: 1.31, r: 0.7 },
           *   { c: '#f0f', t: 1.37, p: 1.57, r: 0.7 }
           * ];
           *
           * function draw() {
           *   var t = millis() / 1000 + 1000;
           *   background(0);
           *   directionalLight(color('#222'), 1, 1, 1);
           *
           *   for (var i = 0; i < lights.length; i++) {
           *     var light = lights[i];
           *     pointLight(
           *       color(light.c),
           *       p5.Vector.fromAngles(t * light.t, t * light.p, width * light.r)
           *     );
           *   }
           *
           *   specularMaterial(255);
           *   sphere(width * 0.1);
           *
           *   rotateX(t * 0.77);
           *   rotateY(t * 0.83);
           *   rotateZ(t * 0.91);
           *   torus(width * 0.3, width * 0.07, 24, 10);
           * }
           *
           * function mousePressed() {
           *   setAttributes('perPixelLighting', true);
           *   noStroke();
           *   fill(255);
           * }
           * function mouseReleased() {
           *   setAttributes('perPixelLighting', false);
           *   noStroke();
           *   fill(255);
           * }
           * </code>
           * </div>
           *
           * @alt a rotating cube with smoother edges
           */
          /**
           * @method setAttributes
           * @for p5
           * @param  {Object}  obj object with key-value pairs
           */

          p5.prototype.setAttributes = function(key, value) {
            if (typeof this._glAttributes === 'undefined') {
              console.log(
                'You are trying to use setAttributes on a p5.Graphics object ' +
                  'that does not use a WEBGL renderer.'
              );

              return;
            }
            var unchanged = true;
            if (typeof value !== 'undefined') {
              //first time modifying the attributes
              if (this._glAttributes === null) {
                this._glAttributes = {};
              }
              if (this._glAttributes[key] !== value) {
                //changing value of previously altered attribute
                this._glAttributes[key] = value;
                unchanged = false;
              }
              //setting all attributes with some change
            } else if (key instanceof Object) {
              if (this._glAttributes !== key) {
                this._glAttributes = key;
                unchanged = false;
              }
            }
            //@todo_FES
            if (!this._renderer.isP3D || unchanged) {
              return;
            }

            if (!this._setupDone) {
              for (var x in this._renderer.gHash) {
                if (this._renderer.gHash.hasOwnProperty(x)) {
                  console.error(
                    'Sorry, Could not set the attributes, you need to call setAttributes() ' +
                      'before calling the other drawing methods in setup()'
                  );

                  return;
                }
              }
            }

            this.push();
            this._renderer._resetContext();
            this.pop();

            if (this._renderer._curCamera) {
              this._renderer._curCamera._renderer = this._renderer;
            }
          };

          /**
           * @class p5.RendererGL
           */

          p5.RendererGL.prototype._update = function() {
            // reset model view and apply initial camera transform
            // (containing only look at info; no projection).
            this.uMVMatrix.set(
              this._curCamera.cameraMatrix.mat4[0],
              this._curCamera.cameraMatrix.mat4[1],
              this._curCamera.cameraMatrix.mat4[2],
              this._curCamera.cameraMatrix.mat4[3],
              this._curCamera.cameraMatrix.mat4[4],
              this._curCamera.cameraMatrix.mat4[5],
              this._curCamera.cameraMatrix.mat4[6],
              this._curCamera.cameraMatrix.mat4[7],
              this._curCamera.cameraMatrix.mat4[8],
              this._curCamera.cameraMatrix.mat4[9],
              this._curCamera.cameraMatrix.mat4[10],
              this._curCamera.cameraMatrix.mat4[11],
              this._curCamera.cameraMatrix.mat4[12],
              this._curCamera.cameraMatrix.mat4[13],
              this._curCamera.cameraMatrix.mat4[14],
              this._curCamera.cameraMatrix.mat4[15]
            );

            // reset light data for new frame.

            this.ambientLightColors.length = 0;
            this.directionalLightDirections.length = 0;
            this.directionalLightColors.length = 0;

            this.pointLightPositions.length = 0;
            this.pointLightColors.length = 0;

            this._enableLighting = false;

            //reset tint value for new frame
            this._tint = [255, 255, 255, 255];
          };

          /**
           * [background description]
           */
          p5.RendererGL.prototype.background = function() {
            var _col = this._pInst.color.apply(this._pInst, arguments);
            var _r = _col.levels[0] / 255;
            var _g = _col.levels[1] / 255;
            var _b = _col.levels[2] / 255;
            var _a = _col.levels[3] / 255;
            this.GL.clearColor(_r, _g, _b, _a);
            this.GL.depthMask(true);
            this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
            this._pixelsState._pixelsDirty = true;
          };

          //////////////////////////////////////////////
          // COLOR
          //////////////////////////////////////////////
          /**
           * Basic fill material for geometry with a given color
           * @method  fill
           * @class p5.RendererGL
           * @param  {Number|Number[]|String|p5.Color} v1  gray value,
           * red or hue value (depending on the current color mode),
           * or color Array, or CSS color string
           * @param  {Number}            [v2] green or saturation value
           * @param  {Number}            [v3] blue or brightness value
           * @param  {Number}            [a]  opacity
           * @chainable
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(200, 200, WEBGL);
           * }
           *
           * function draw() {
           *   background(0);
           *   noStroke();
           *   fill(100, 100, 240);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   box(75, 75, 75);
           * }
           * </code>
           * </div>
           *
           * @alt
           * black canvas with purple cube spinning
           *
           */
          p5.RendererGL.prototype.fill = function(v1, v2, v3, a) {
            //see material.js for more info on color blending in webgl
            var color = p5.prototype.color.apply(this._pInst, arguments);
            this.curFillColor = color._array;
            this.drawMode = constants.FILL;
            this._useNormalMaterial = false;
            this._tex = null;
          };

          /**
           * Basic stroke material for geometry with a given color
           * @method  stroke
           * @param  {Number|Number[]|String|p5.Color} v1  gray value,
           * red or hue value (depending on the current color mode),
           * or color Array, or CSS color string
           * @param  {Number}            [v2] green or saturation value
           * @param  {Number}            [v3] blue or brightness value
           * @param  {Number}            [a]  opacity
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(200, 200, WEBGL);
           * }
           *
           * function draw() {
           *   background(0);
           *   stroke(240, 150, 150);
           *   fill(100, 100, 240);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   box(75, 75, 75);
           * }
           * </code>
           * </div>
           *
           * @alt
           * black canvas with purple cube with pink outline spinning
           *
           */
          p5.RendererGL.prototype.stroke = function(r, g, b, a) {
            //@todo allow transparency in stroking currently doesn't have
            //any impact and causes problems with specularMaterial
            arguments[3] = 255;
            var color = p5.prototype.color.apply(this._pInst, arguments);
            this.curStrokeColor = color._array;
          };

          p5.RendererGL.prototype.strokeCap = function(cap) {
            // @TODO : to be implemented
            console.error('Sorry, strokeCap() is not yet implemented in WEBGL mode');
          };

          p5.RendererGL.prototype.blendMode = function(mode) {
            if (
              mode === constants.DARKEST ||
              mode === constants.LIGHTEST ||
              mode === constants.ADD ||
              mode === constants.BLEND ||
              mode === constants.SUBTRACT ||
              mode === constants.SCREEN ||
              mode === constants.EXCLUSION ||
              mode === constants.REPLACE ||
              mode === constants.MULTIPLY
            )
              this.curBlendMode = mode;
            else if (
              mode === constants.BURN ||
              mode === constants.OVERLAY ||
              mode === constants.HARD_LIGHT ||
              mode === constants.SOFT_LIGHT ||
              mode === constants.DODGE
            ) {
              console.warn(
                'BURN, OVERLAY, HARD_LIGHT, SOFT_LIGHT, and DODGE only work for blendMode in 2D mode.'
              );
            }
          };

          /**
           * Change weight of stroke
           * @method  strokeWeight
           * @param  {Number} stroke weight to be used for drawing
           * @example
           * <div>
           * <code>
           * function setup() {
           *   createCanvas(200, 400, WEBGL);
           *   setAttributes('antialias', true);
           * }
           *
           * function draw() {
           *   background(0);
           *   noStroke();
           *   translate(0, -100, 0);
           *   stroke(240, 150, 150);
           *   fill(100, 100, 240);
           *   push();
           *   strokeWeight(8);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   sphere(75);
           *   pop();
           *   push();
           *   translate(0, 200, 0);
           *   strokeWeight(1);
           *   rotateX(frameCount * 0.01);
           *   rotateY(frameCount * 0.01);
           *   sphere(75);
           *   pop();
           * }
           * </code>
           * </div>
           *
           * @alt
           * black canvas with two purple rotating spheres with pink
           * outlines the sphere on top has much heavier outlines,
           *
           */
          p5.RendererGL.prototype.strokeWeight = function(w) {
            if (this.curStrokeWeight !== w) {
              this.pointSize = w;
              this.curStrokeWeight = w;
            }
          };

          // x,y are canvas-relative (pre-scaled by _pixelDensity)
          p5.RendererGL.prototype._getPixel = function(x, y) {
            var pixelsState = this._pixelsState;
            var imageData, index;
            if (pixelsState._pixelsDirty) {
              imageData = new Uint8Array(4);
              // prettier-ignore
              this.drawingContext.readPixels(
    x, y, 1, 1,
    this.drawingContext.RGBA, this.drawingContext.UNSIGNED_BYTE,
    imageData);

              index = 0;
            } else {
              imageData = pixelsState.pixels;
              index = (Math.floor(x) + Math.floor(y) * this.canvas.width) * 4;
            }
            return [
              imageData[index + 0],
              imageData[index + 1],
              imageData[index + 2],
              imageData[index + 3]
            ];
          };

          /**
           * Loads the pixels data for this canvas into the pixels[] attribute.
           * Note that updatePixels() and set() do not work.
           * Any pixel manipulation must be done directly to the pixels[] array.
           *
           * @private
           * @method loadPixels
           *
           */

          p5.RendererGL.prototype.loadPixels = function() {
            var pixelsState = this._pixelsState;
            if (!pixelsState._pixelsDirty) return;
            pixelsState._pixelsDirty = false;

            //@todo_FES
            if (this._pInst._glAttributes.preserveDrawingBuffer !== true) {
              console.log(
                'loadPixels only works in WebGL when preserveDrawingBuffer ' + 'is true.'
              );

              return;
            }

            //if there isn't a renderer-level temporary pixels buffer
            //make a new one
            var pixels = pixelsState.pixels;
            var len = this.GL.drawingBufferWidth * this.GL.drawingBufferHeight * 4;
            if (!(pixels instanceof Uint8Array) || pixels.length !== len) {
              pixels = new Uint8Array(len);
              this._pixelsState._setProperty('pixels', pixels);
            }

            var pd = this._pInst._pixelDensity;
            // prettier-ignore
            this.GL.readPixels(
  0, 0, this.width * pd, this.height * pd,
  this.GL.RGBA, this.GL.UNSIGNED_BYTE,
  pixels);
          };

          //////////////////////////////////////////////
          // HASH | for geometry
          //////////////////////////////////////////////

          p5.RendererGL.prototype.geometryInHash = function(gId) {
            return this.gHash[gId] !== undefined;
          };

          /**
           * [resize description]
           * @private
           * @param  {Number} w [description]
           * @param  {Number} h [description]
           */
          p5.RendererGL.prototype.resize = function(w, h) {
            p5.Renderer.prototype.resize.call(this, w, h);
            this.GL.viewport(0, 0, this.GL.drawingBufferWidth, this.GL.drawingBufferHeight);

            this._viewport = this.GL.getParameter(this.GL.VIEWPORT);

            this._curCamera._resize();

            //resize pixels buffer
            var pixelsState = this._pixelsState;
            pixelsState._pixelsDirty = true;
            if (typeof pixelsState.pixels !== 'undefined') {
              pixelsState._setProperty(
                'pixels',
                new Uint8Array(this.GL.drawingBufferWidth * this.GL.drawingBufferHeight * 4)
              );
            }
          };

          /**
           * clears color and depth buffers
           * with r,g,b,a
           * @private
           * @param {Number} r normalized red val.
           * @param {Number} g normalized green val.
           * @param {Number} b normalized blue val.
           * @param {Number} a normalized alpha val.
           */
          p5.RendererGL.prototype.clear = function() {
            var _r = arguments[0] || 0;
            var _g = arguments[1] || 0;
            var _b = arguments[2] || 0;
            var _a = arguments[3] || 0;
            this.GL.clearColor(_r, _g, _b, _a);
            this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
            this._pixelsState._pixelsDirty = true;
          };

          p5.RendererGL.prototype.applyMatrix = function(a, b, c, d, e, f) {
            if (arguments.length === 16) {
              p5.Matrix.prototype.apply.apply(this.uMVMatrix, arguments);
            } else {
              // prettier-ignore
              this.uMVMatrix.apply([
    a, b, 0, 0,
    c, d, 0, 0,
    0, 0, 1, 0,
    e, f, 0, 1]);
            }
          };

          /**
           * [translate description]
           * @private
           * @param  {Number} x [description]
           * @param  {Number} y [description]
           * @param  {Number} z [description]
           * @chainable
           * @todo implement handle for components or vector as args
           */
          p5.RendererGL.prototype.translate = function(x, y, z) {
            if (x instanceof p5.Vector) {
              z = x.z;
              y = x.y;
              x = x.x;
            }
            this.uMVMatrix.translate([x, y, z]);
            return this;
          };

          /**
           * Scales the Model View Matrix by a vector
           * @private
           * @param  {Number | p5.Vector | Array} x [description]
           * @param  {Number} [y] y-axis scalar
           * @param  {Number} [z] z-axis scalar
           * @chainable
           */
          p5.RendererGL.prototype.scale = function(x, y, z) {
            this.uMVMatrix.scale(x, y, z);
            return this;
          };

          p5.RendererGL.prototype.rotate = function(rad, axis) {
            if (typeof axis === 'undefined') {
              return this.rotateZ(rad);
            }
            p5.Matrix.prototype.rotate.apply(this.uMVMatrix, arguments);
            return this;
          };

          p5.RendererGL.prototype.rotateX = function(rad) {
            this.rotate(rad, 1, 0, 0);
            return this;
          };

          p5.RendererGL.prototype.rotateY = function(rad) {
            this.rotate(rad, 0, 1, 0);
            return this;
          };

          p5.RendererGL.prototype.rotateZ = function(rad) {
            this.rotate(rad, 0, 0, 1);
            return this;
          };

          p5.RendererGL.prototype.push = function() {
            // get the base renderer style
            var style = p5.Renderer.prototype.push.apply(this);

            // add webgl-specific style properties
            var properties = style.properties;

            properties.uMVMatrix = this.uMVMatrix.copy();
            properties.uPMatrix = this.uPMatrix.copy();
            properties._curCamera = this._curCamera;

            // make a copy of the current camera for the push state
            // this preserves any references stored using 'createCamera'
            this._curCamera = this._curCamera.copy();

            properties.ambientLightColors = this.ambientLightColors.slice();

            properties.directionalLightDirections = this.directionalLightDirections.slice();
            properties.directionalLightColors = this.directionalLightColors.slice();

            properties.pointLightPositions = this.pointLightPositions.slice();
            properties.pointLightColors = this.pointLightColors.slice();

            properties.userFillShader = this.userFillShader;
            properties.userStrokeShader = this.userStrokeShader;
            properties.userPointShader = this.userPointShader;

            properties.pointSize = this.pointSize;
            properties.curStrokeWeight = this.curStrokeWeight;
            properties.curStrokeColor = this.curStrokeColor;
            properties.curFillColor = this.curFillColor;

            properties._useSpecularMaterial = this._useSpecularMaterial;
            properties._useShininess = this._useShininess;

            properties.constantAttenuation = this.constantAttenuation;
            properties.linearAttenuation = this.linearAttenuation;
            properties.quadraticAttenuation = this.quadraticAttenuation;

            properties._enableLighting = this._enableLighting;
            properties._useNormalMaterial = this._useNormalMaterial;
            properties._tex = this._tex;
            properties.drawMode = this.drawMode;

            return style;
          };

          p5.RendererGL.prototype.resetMatrix = function() {
            this.uMVMatrix = p5.Matrix.identity(this._pInst);
            return this;
          };

          //////////////////////////////////////////////
          // SHADER
          //////////////////////////////////////////////

          /*
 * shaders are created and cached on a per-renderer basis,
 * on the grounds that each renderer will have its own gl context
 * and the shader must be valid in that context.
 */

          p5.RendererGL.prototype._getImmediateStrokeShader = function() {
            // select the stroke shader to use
            var stroke = this.userStrokeShader;
            if (!stroke || !stroke.isStrokeShader()) {
              return this._getLineShader();
            }
            return stroke;
          };

          p5.RendererGL.prototype._getRetainedStrokeShader =
            p5.RendererGL.prototype._getImmediateStrokeShader;

          /*
                                                    * selects which fill shader should be used based on renderer state,
                                                    * for use with begin/endShape and immediate vertex mode.
                                                    */
          p5.RendererGL.prototype._getImmediateFillShader = function() {
            if (this._useNormalMaterial) {
              console.log(
                'Sorry, normalMaterial() does not currently work with custom WebGL geometry' +
                  ' created with beginShape(). Falling back to standard fill material.'
              );

              return this._getImmediateModeShader();
            }

            var fill = this.userFillShader;
            if (this._enableLighting) {
              if (!fill || !fill.isLightShader()) {
                return this._getLightShader();
              }
            } else if (this._tex) {
              if (!fill || !fill.isTextureShader()) {
                return this._getLightShader();
              }
            } else if (!fill /*|| !fill.isColorShader()*/) {
              return this._getImmediateModeShader();
            }
            return fill;
          };

          /*
    * selects which fill shader should be used based on renderer state
    * for retained mode.
    */
          p5.RendererGL.prototype._getRetainedFillShader = function() {
            if (this._useNormalMaterial) {
              return this._getNormalShader();
            }

            var fill = this.userFillShader;
            if (this._enableLighting) {
              if (!fill || !fill.isLightShader()) {
                return this._getLightShader();
              }
            } else if (this._tex) {
              if (!fill || !fill.isTextureShader()) {
                return this._getLightShader();
              }
            } else if (!fill /* || !fill.isColorShader()*/) {
              return this._getColorShader();
            }
            return fill;
          };

          p5.RendererGL.prototype._getImmediatePointShader = function() {
            // select the point shader to use
            var point = this.userPointShader;
            if (!point || !point.isPointShader()) {
              return this._getPointShader();
            }
            return point;
          };

          p5.RendererGL.prototype._getRetainedLineShader =
            p5.RendererGL.prototype._getImmediateLineShader;

          p5.RendererGL.prototype._getLightShader = function() {
            if (!this._defaultLightShader) {
              if (this._pInst._glAttributes.perPixelLighting) {
                this._defaultLightShader = new p5.Shader(
                  this,
                  defaultShaders.phongVert,
                  defaultShaders.phongFrag
                );
              } else {
                this._defaultLightShader = new p5.Shader(
                  this,
                  defaultShaders.lightVert,
                  defaultShaders.lightTextureFrag
                );
              }
            }

            return this._defaultLightShader;
          };

          p5.RendererGL.prototype._getImmediateModeShader = function() {
            if (!this._defaultImmediateModeShader) {
              this._defaultImmediateModeShader = new p5.Shader(
                this,
                defaultShaders.immediateVert,
                defaultShaders.vertexColorFrag
              );
            }

            return this._defaultImmediateModeShader;
          };

          p5.RendererGL.prototype._getNormalShader = function() {
            if (!this._defaultNormalShader) {
              this._defaultNormalShader = new p5.Shader(
                this,
                defaultShaders.normalVert,
                defaultShaders.normalFrag
              );
            }

            return this._defaultNormalShader;
          };

          p5.RendererGL.prototype._getColorShader = function() {
            if (!this._defaultColorShader) {
              this._defaultColorShader = new p5.Shader(
                this,
                defaultShaders.normalVert,
                defaultShaders.basicFrag
              );
            }

            return this._defaultColorShader;
          };

          p5.RendererGL.prototype._getPointShader = function() {
            if (!this._defaultPointShader) {
              this._defaultPointShader = new p5.Shader(
                this,
                defaultShaders.pointVert,
                defaultShaders.pointFrag
              );
            }
            return this._defaultPointShader;
          };

          p5.RendererGL.prototype._getLineShader = function() {
            if (!this._defaultLineShader) {
              this._defaultLineShader = new p5.Shader(
                this,
                defaultShaders.lineVert,
                defaultShaders.lineFrag
              );
            }

            return this._defaultLineShader;
          };

          p5.RendererGL.prototype._getFontShader = function() {
            if (!this._defaultFontShader) {
              this.GL.getExtension('OES_standard_derivatives');
              this._defaultFontShader = new p5.Shader(
                this,
                defaultShaders.fontVert,
                defaultShaders.fontFrag
              );
            }
            return this._defaultFontShader;
          };

          p5.RendererGL.prototype._getEmptyTexture = function() {
            if (!this._emptyTexture) {
              // a plain white texture RGBA, full alpha, single pixel.
              var im = new p5.Image(1, 1);
              im.set(0, 0, 255);
              this._emptyTexture = new p5.Texture(this, im);
            }
            return this._emptyTexture;
          };

          p5.RendererGL.prototype.getTexture = function(img) {
            var textures = this.textures;
            for (var it = 0; it < textures.length; ++it) {
              var texture = textures[it];
              if (texture.src === img) return texture;
            }

            var tex = new p5.Texture(this, img);
            textures.push(tex);
            return tex;
          };

          p5.RendererGL.prototype._setStrokeUniforms = function(strokeShader) {
            strokeShader.bindShader();

            // set the uniform values
            strokeShader.setUniform('uMaterialColor', this.curStrokeColor);
            strokeShader.setUniform('uStrokeWeight', this.curStrokeWeight);
          };

          p5.RendererGL.prototype._setFillUniforms = function(fillShader) {
            fillShader.bindShader();

            // TODO: optimize
            fillShader.setUniform('uMaterialColor', this.curFillColor);
            fillShader.setUniform('isTexture', !!this._tex);
            if (this._tex) {
              fillShader.setUniform('uSampler', this._tex);
            }
            fillShader.setUniform('uTint', this._tint);

            fillShader.setUniform('uSpecular', this._useSpecularMaterial);
            fillShader.setUniform('uShininess', this._useShininess);

            fillShader.setUniform('uUseLighting', this._enableLighting);

            var pointLightCount = this.pointLightColors.length / 3;
            fillShader.setUniform('uPointLightCount', pointLightCount);
            fillShader.setUniform('uPointLightLocation', this.pointLightPositions);
            fillShader.setUniform('uPointLightColor', this.pointLightColors);

            var directionalLightCount = this.directionalLightColors.length / 3;
            fillShader.setUniform('uDirectionalLightCount', directionalLightCount);
            fillShader.setUniform('uLightingDirection', this.directionalLightDirections);
            fillShader.setUniform('uDirectionalColor', this.directionalLightColors);

            // TODO: sum these here...
            var ambientLightCount = this.ambientLightColors.length / 3;
            fillShader.setUniform('uAmbientLightCount', ambientLightCount);
            fillShader.setUniform('uAmbientColor', this.ambientLightColors);

            fillShader.setUniform('uConstantAttenuation', this.constantAttenuation);
            fillShader.setUniform('uLinearAttenuation', this.linearAttenuation);
            fillShader.setUniform('uQuadraticAttenuation', this.quadraticAttenuation);

            fillShader.bindTextures();
          };

          p5.RendererGL.prototype._setPointUniforms = function(pointShader) {
            pointShader.bindShader();

            // set the uniform values
            pointShader.setUniform('uMaterialColor', this.curStrokeColor);
            // @todo is there an instance where this isn't stroke weight?
            // should be they be same var?
            pointShader.setUniform('uPointSize', this.pointSize);
          };

          /* Binds a buffer to the drawing context
    * when passed more than two arguments it also updates or initializes
    * the data associated with the buffer
    */
          p5.RendererGL.prototype._bindBuffer = function(
            buffer,
            target,
            values,
            type,
            usage
          ) {
            if (!target) target = this.GL.ARRAY_BUFFER;
            this.GL.bindBuffer(target, buffer);
            if (values !== undefined) {
              var data = new (type || Float32Array)(values);
              this.GL.bufferData(target, data, usage || this.GL.STATIC_DRAW);
            }
          };

          ///////////////////////////////
          //// UTILITY FUNCTIONS
          //////////////////////////////
          /**
           * turn a two dimensional array into one dimensional array
           * @private
           * @param  {Array} arr 2-dimensional array
           * @return {Array}     1-dimensional array
           * [[1, 2, 3],[4, 5, 6]] -> [1, 2, 3, 4, 5, 6]
           */
          p5.RendererGL.prototype._flatten = function(arr) {
            //when empty, return empty
            if (arr.length === 0) {
              return [];
            } else if (arr.length > 20000) {
              //big models , load slower to avoid stack overflow
              //faster non-recursive flatten via axelduch
              //stackoverflow.com/questions/27266550/how-to-flatten-nested-array-in-javascript
              var toString = Object.prototype.toString;
              var arrayTypeStr = '[object Array]';
              var result = [];
              var nodes = arr.slice();
              var node;
              node = nodes.pop();
              do {
                if (toString.call(node) === arrayTypeStr) {
                  nodes.push.apply(nodes, node);
                } else {
                  result.push(node);
                }
              } while (nodes.length && (node = nodes.pop()) !== undefined);
              result.reverse(); // we reverse result to restore the original order
              return result;
            } else {
              //otherwise if model within limits for browser
              //use faster recursive loading
              return [].concat.apply([], arr);
            }
          };

          /**
           * turn a p5.Vector Array into a one dimensional number array
           * @private
           * @param  {p5.Vector[]} arr  an array of p5.Vector
           * @return {Number[]}     a one dimensional array of numbers
           * [p5.Vector(1, 2, 3), p5.Vector(4, 5, 6)] ->
           * [1, 2, 3, 4, 5, 6]
           */
          p5.RendererGL.prototype._vToNArray = function(arr) {
            var ret = [];
            for (var i = 0; i < arr.length; i++) {
              var item = arr[i];
              ret.push(item.x, item.y, item.z);
            }
            return ret;
          };

          /**
           * ensures that p5 is using a 3d renderer. throws an error if not.
           */
          p5.prototype._assert3d = function(name) {
            if (!this._renderer.isP3D)
              throw new Error(
                name +
                  "() is only supported in WEBGL mode. If you'd like to use 3D graphics" +
                  ' and WebGL, see  https://p5js.org/examples/form-3d-primitives.html' +
                  ' for more information.'
              );
          };

          // function to initialize GLU Tesselator

          p5.RendererGL.prototype._initTessy = function initTesselator() {
            // function called for each vertex of tesselator output
            function vertexCallback(data, polyVertArray) {
              polyVertArray[polyVertArray.length] = data[0];
              polyVertArray[polyVertArray.length] = data[1];
              polyVertArray[polyVertArray.length] = data[2];
            }

            function begincallback(type) {
              if (type !== libtess.primitiveType.GL_TRIANGLES) {
                console.log('expected TRIANGLES but got type: ' + type);
              }
            }

            function errorcallback(errno) {
              console.log('error callback');
              console.log('error number: ' + errno);
            }
            // callback for when segments intersect and must be split
            function combinecallback(coords, data, weight) {
              return [coords[0], coords[1], coords[2]];
            }

            function edgeCallback(flag) {
              // don't really care about the flag, but need no-strip/no-fan behavior
            }

            var tessy = new libtess.GluTesselator();
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
            tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

            return tessy;
          };

          p5.RendererGL.prototype._triangulate = function(contours) {
            // libtess will take 3d verts and flatten to a plane for tesselation
            // since only doing 2d tesselation here, provide z=1 normal to skip
            // iterating over verts only to get the same answer.
            // comment out to test normal-generation code
            this._tessy.gluTessNormal(0, 0, 1);

            var triangleVerts = [];
            this._tessy.gluTessBeginPolygon(triangleVerts);

            for (var i = 0; i < contours.length; i++) {
              this._tessy.gluTessBeginContour();
              var contour = contours[i];
              for (var j = 0; j < contour.length; j += 3) {
                var coords = [contour[j], contour[j + 1], contour[j + 2]];
                this._tessy.gluTessVertex(coords, coords);
              }
              this._tessy.gluTessEndContour();
            }

            // finish polygon
            this._tessy.gluTessEndPolygon();

            return triangleVerts;
          };

          // function to calculate BezierVertex Coefficients
          p5.RendererGL.prototype._bezierCoefficients = function(t) {
            var t2 = t * t;
            var t3 = t2 * t;
            var mt = 1 - t;
            var mt2 = mt * mt;
            var mt3 = mt2 * mt;
            return [mt3, 3 * mt2 * t, 3 * mt * t2, t3];
          };

          // function to calculate QuadraticVertex Coefficients
          p5.RendererGL.prototype._quadraticCoefficients = function(t) {
            var t2 = t * t;
            var mt = 1 - t;
            var mt2 = mt * mt;
            return [mt2, 2 * mt * t, t2];
          };

          // function to convert Bezier coordinates to Catmull Rom Splines
          p5.RendererGL.prototype._bezierToCatmull = function(w) {
            var p1 = w[1];
            var p2 = w[1] + (w[2] - w[0]) / this._curveTightness;
            var p3 = w[2] - (w[3] - w[1]) / this._curveTightness;
            var p4 = w[2];
            var p = [p1, p2, p3, p4];
            return p;
          };

          module.exports = p5.RendererGL;
        },
        {
          '../core/constants': 18,
          '../core/main': 24,
          '../core/p5.Renderer': 27,
          './p5.Camera': 70,
          './p5.Matrix': 72,
          './p5.Shader': 76,
          libtess: 9
        }
      ],
      76: [
        function(_dereq_, module, exports) {
          /**
           * This module defines the p5.Shader class
           * @module Lights, Camera
           * @submodule Shaders
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');

          /**
           * Shader class for WEBGL Mode
           * @class p5.Shader
           * @param {p5.RendererGL} renderer an instance of p5.RendererGL that
           * will provide the GL context for this new p5.Shader
           * @param {String} vertSrc source code for the vertex shader (as a string)
           * @param {String} fragSrc source code for the fragment shader (as a string)
           */
          p5.Shader = function(renderer, vertSrc, fragSrc) {
            // TODO: adapt this to not take ids, but rather,
            // to take the source for a vertex and fragment shader
            // to enable custom shaders at some later date
            this._renderer = renderer;
            this._vertSrc = vertSrc;
            this._fragSrc = fragSrc;
            this._vertShader = -1;
            this._fragShader = -1;
            this._glProgram = 0;
            this._loadedAttributes = false;
            this.attributes = {};
            this._loadedUniforms = false;
            this.uniforms = {};
            this._bound = false;
            this.samplers = [];
          };

          /**
           * Creates, compiles, and links the shader based on its
           * sources for the vertex and fragment shaders (provided
           * to the constructor). Populates known attributes and
           * uniforms from the shader.
           * @method init
           * @chainable
           * @private
           */
          p5.Shader.prototype.init = function() {
            if (this._glProgram === 0 /* or context is stale? */) {
              var gl = this._renderer.GL;

              // @todo: once custom shading is allowed,
              // friendly error messages should be used here to share
              // compiler and linker errors.

              //set up the shader by
              // 1. creating and getting a gl id for the shader program,
              // 2. compliling its vertex & fragment sources,
              // 3. linking the vertex and fragment shaders
              this._vertShader = gl.createShader(gl.VERTEX_SHADER);
              //load in our default vertex shader
              gl.shaderSource(this._vertShader, this._vertSrc);
              gl.compileShader(this._vertShader);
              // if our vertex shader failed compilation?
              if (!gl.getShaderParameter(this._vertShader, gl.COMPILE_STATUS)) {
                console.error(
                  'Yikes! An error occurred compiling the vertex shader:' +
                    gl.getShaderInfoLog(this._vertShader)
                );

                return null;
              }

              this._fragShader = gl.createShader(gl.FRAGMENT_SHADER);
              //load in our material frag shader
              gl.shaderSource(this._fragShader, this._fragSrc);
              gl.compileShader(this._fragShader);
              // if our frag shader failed compilation?
              if (!gl.getShaderParameter(this._fragShader, gl.COMPILE_STATUS)) {
                console.error(
                  'Darn! An error occurred compiling the fragment shader:' +
                    gl.getShaderInfoLog(this._fragShader)
                );

                return null;
              }

              this._glProgram = gl.createProgram();
              gl.attachShader(this._glProgram, this._vertShader);
              gl.attachShader(this._glProgram, this._fragShader);
              gl.linkProgram(this._glProgram);
              if (!gl.getProgramParameter(this._glProgram, gl.LINK_STATUS)) {
                console.error(
                  'Snap! Error linking shader program: ' +
                    gl.getProgramInfoLog(this._glProgram)
                );
              }

              this._loadAttributes();
              this._loadUniforms();
            }
            return this;
          };

          /**
           * Queries the active attributes for this shader and loads
           * their names and locations into the attributes array.
           * @method _loadAttributes
           * @private
           */
          p5.Shader.prototype._loadAttributes = function() {
            if (this._loadedAttributes) {
              return;
            }

            this.attributes = {};

            var gl = this._renderer.GL;

            var numAttributes = gl.getProgramParameter(
              this._glProgram,
              gl.ACTIVE_ATTRIBUTES
            );

            for (var i = 0; i < numAttributes; ++i) {
              var attributeInfo = gl.getActiveAttrib(this._glProgram, i);
              var name = attributeInfo.name;
              var location = gl.getAttribLocation(this._glProgram, name);
              var attribute = {};
              attribute.name = name;
              attribute.location = location;
              attribute.index = i;
              attribute.type = attributeInfo.type;
              attribute.size = attributeInfo.size;
              this.attributes[name] = attribute;
            }

            this._loadedAttributes = true;
          };

          /**
           * Queries the active uniforms for this shader and loads
           * their names and locations into the uniforms array.
           * @method _loadUniforms
           * @private
           */
          p5.Shader.prototype._loadUniforms = function() {
            if (this._loadedUniforms) {
              return;
            }

            var gl = this._renderer.GL;

            // Inspect shader and cache uniform info
            var numUniforms = gl.getProgramParameter(this._glProgram, gl.ACTIVE_UNIFORMS);

            var samplerIndex = 0;
            for (var i = 0; i < numUniforms; ++i) {
              var uniformInfo = gl.getActiveUniform(this._glProgram, i);
              var uniform = {};
              uniform.location = gl.getUniformLocation(this._glProgram, uniformInfo.name);
              uniform.size = uniformInfo.size;
              var uniformName = uniformInfo.name;
              //uniforms thats are arrays have their name returned as
              //someUniform[0] which is a bit silly so we trim it
              //off here. The size property tells us that its an array
              //so we dont lose any information by doing this
              if (uniformInfo.size > 1) {
                uniformName = uniformName.substring(0, uniformName.indexOf('[0]'));
              }
              uniform.name = uniformName;
              uniform.type = uniformInfo.type;
              if (uniform.type === gl.SAMPLER_2D) {
                uniform.samplerIndex = samplerIndex;
                samplerIndex++;
                this.samplers.push(uniform);
              }
              this.uniforms[uniformName] = uniform;
            }
            this._loadedUniforms = true;
          };

          p5.Shader.prototype.compile = function() {
            // TODO
          };

          /**
           * initializes (if needed) and binds the shader program.
           * @method bindShader
           * @private
           */
          p5.Shader.prototype.bindShader = function() {
            this.init();
            if (!this._bound) {
              this.useProgram();
              this._bound = true;

              this._setMatrixUniforms();

              this.setUniform('uViewport', this._renderer._viewport);
            }
          };

          /**
           * @method unbindShader
           * @chainable
           * @private
           */
          p5.Shader.prototype.unbindShader = function() {
            if (this._bound) {
              this.unbindTextures();
              //this._renderer.GL.useProgram(0); ??
              this._bound = false;
            }
            return this;
          };

          p5.Shader.prototype.bindTextures = function() {
            var gl = this._renderer.GL;
            for (var i = 0; i < this.samplers.length; i++) {
              var uniform = this.samplers[i];
              var tex = uniform.texture;
              if (tex === undefined) {
                // user hasn't yet supplied a texture for this slot.
                // (or there may not be one--maybe just lighting),
                // so we supply a default texture instead.
                tex = this._renderer._getEmptyTexture();
              }
              gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
              tex.bindTexture();
              tex.update();
              gl.uniform1i(uniform.location, uniform.samplerIndex);
            }
          };

          p5.Shader.prototype.updateTextures = function() {
            for (var i = 0; i < this.samplers.length; i++) {
              var uniform = this.samplers[i];
              var tex = uniform.texture;
              if (tex) {
                tex.update();
              }
            }
          };

          p5.Shader.prototype.unbindTextures = function() {
            // TODO: migrate stuff from material.js here
            // - OR - have material.js define this function
          };

          p5.Shader.prototype._setMatrixUniforms = function() {
            this.setUniform('uProjectionMatrix', this._renderer.uPMatrix.mat4);
            this.setUniform('uModelViewMatrix', this._renderer.uMVMatrix.mat4);
            this.setUniform('uViewMatrix', this._renderer._curCamera.cameraMatrix.mat4);
            if (this.uniforms.uNormalMatrix) {
              this._renderer.uNMatrix.inverseTranspose(this._renderer.uMVMatrix);
              this.setUniform('uNormalMatrix', this._renderer.uNMatrix.mat3);
            }
          };

          /**
           * @method useProgram
           * @chainable
           * @private
           */
          p5.Shader.prototype.useProgram = function() {
            var gl = this._renderer.GL;
            gl.useProgram(this._glProgram);
            return this;
          };

          /**
           * Wrapper around gl.uniform functions.
           * As we store uniform info in the shader we can use that
           * to do type checking on the supplied data and call
           * the appropriate function.
           * @method setUniform
           * @chainable
           * @param {String} uniformName the name of the uniform in the
           * shader program
           * @param {Object|Number|Boolean|Number[]} data the data to be associated
           * with that uniform; type varies (could be a single numerical value, array,
           * matrix, or texture / sampler reference)
           *
           * @example
           * <div modernizr='webgl'>
           * <code>
           * // Click within the image to toggle the value of uniforms
           * // Note: for an alternative approach to the same example,
           * // involving toggling between shaders please refer to:
           * // https://p5js.org/reference/#/p5/shader
           *
           * let grad;
           * let showRedGreen = false;
           *
           * function preload() {
           *   // note that we are using two instances
           *   // of the same vertex and fragment shaders
           *   grad = loadShader('assets/shader.vert', 'assets/shader-gradient.frag');
           * }
           *
           * function setup() {
           *   createCanvas(100, 100, WEBGL);
           *   shader(grad);
           *   noStroke();
           * }
           *
           * function draw() {
           *   // update the offset values for each scenario,
           *   // moving the "grad" shader in either vertical or
           *   // horizontal direction each with differing colors
           *
           *   if (showRedGreen === true) {
           *     grad.setUniform('colorCenter', [1, 0, 0]);
           *     grad.setUniform('colorBackground', [0, 1, 0]);
           *     grad.setUniform('offset', [sin(millis() / 2000), 1]);
           *   } else {
           *     grad.setUniform('colorCenter', [1, 0.5, 0]);
           *     grad.setUniform('colorBackground', [0.226, 0, 0.615]);
           *     grad.setUniform('offset', [0, sin(millis() / 2000) + 1]);
           *   }
           *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
           * }
           *
           * function mouseClicked() {
           *   showRedGreen = !showRedGreen;
           * }
           * </code>
           * </div>
           *
           * @alt
           * canvas toggles between a circular gradient of orange and blue vertically. and a circular gradient of red and green moving horizontally when mouse is clicked/pressed.
           */
          p5.Shader.prototype.setUniform = function(uniformName, data) {
            //@todo update all current gl.uniformXX calls

            var uniform = this.uniforms[uniformName];
            if (!uniform) {
              return;
            }

            var location = uniform.location;

            var gl = this._renderer.GL;
            this.useProgram();

            switch (uniform.type) {
              case gl.BOOL:
                if (data === true) {
                  gl.uniform1i(location, 1);
                } else {
                  gl.uniform1i(location, 0);
                }
                break;
              case gl.INT:
                if (uniform.size > 1) {
                  data.length && gl.uniform1iv(location, data);
                } else {
                  gl.uniform1i(location, data);
                }
                break;
              case gl.FLOAT:
                if (uniform.size > 1) {
                  data.length && gl.uniform1fv(location, data);
                } else {
                  gl.uniform1f(location, data);
                }
                break;
              case gl.FLOAT_MAT3:
                gl.uniformMatrix3fv(location, false, data);
                break;
              case gl.FLOAT_MAT4:
                gl.uniformMatrix4fv(location, false, data);
                break;
              case gl.FLOAT_VEC2:
                if (uniform.size > 1) {
                  data.length && gl.uniform2fv(location, data);
                } else {
                  gl.uniform2f(location, data[0], data[1]);
                }
                break;
              case gl.FLOAT_VEC3:
                if (uniform.size > 1) {
                  data.length && gl.uniform3fv(location, data);
                } else {
                  gl.uniform3f(location, data[0], data[1], data[2]);
                }
                break;
              case gl.FLOAT_VEC4:
                if (uniform.size > 1) {
                  data.length && gl.uniform4fv(location, data);
                } else {
                  gl.uniform4f(location, data[0], data[1], data[2], data[3]);
                }
                break;
              case gl.INT_VEC2:
                if (uniform.size > 1) {
                  data.length && gl.uniform2iv(location, data);
                } else {
                  gl.uniform2i(location, data[0], data[1]);
                }
                break;
              case gl.INT_VEC3:
                if (uniform.size > 1) {
                  data.length && gl.uniform3iv(location, data);
                } else {
                  gl.uniform3i(location, data[0], data[1], data[2]);
                }
                break;
              case gl.INT_VEC4:
                if (uniform.size > 1) {
                  data.length && gl.uniform4iv(location, data);
                } else {
                  gl.uniform4i(location, data[0], data[1], data[2], data[3]);
                }
                break;
              case gl.SAMPLER_2D:
                gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
                uniform.texture = this._renderer.getTexture(data);
                gl.uniform1i(uniform.location, uniform.samplerIndex);
                break;
              //@todo complete all types
            }
            return this;
          };

          /* NONE OF THIS IS FAST OR EFFICIENT BUT BEAR WITH ME
    *
    * these shader "type" query methods are used by various
    * facilities of the renderer to determine if changing
    * the shader type for the required action (for example,
    * do we need to load the default lighting shader if the
    * current shader cannot handle lighting?)
    *
    **/

          p5.Shader.prototype.isLightShader = function() {
            return (
              this.attributes.aNormal !== undefined ||
              this.uniforms.uUseLighting !== undefined ||
              this.uniforms.uAmbientLightCount !== undefined ||
              this.uniforms.uDirectionalLightCount !== undefined ||
              this.uniforms.uPointLightCount !== undefined ||
              this.uniforms.uAmbientColor !== undefined ||
              this.uniforms.uDirectionalColor !== undefined ||
              this.uniforms.uPointLightLocation !== undefined ||
              this.uniforms.uPointLightColor !== undefined ||
              this.uniforms.uLightingDirection !== undefined ||
              this.uniforms.uSpecular !== undefined
            );
          };

          p5.Shader.prototype.isTextureShader = function() {
            return this.samplerIndex > 0;
          };

          p5.Shader.prototype.isColorShader = function() {
            return (
              this.attributes.aVertexColor !== undefined ||
              this.uniforms.uMaterialColor !== undefined
            );
          };

          p5.Shader.prototype.isTexLightShader = function() {
            return this.isLightShader() && this.isTextureShader();
          };

          p5.Shader.prototype.isStrokeShader = function() {
            return this.uniforms.uStrokeWeight !== undefined;
          };

          /**
           * @method enableAttrib
           * @chainable
           * @private
           */
          p5.Shader.prototype.enableAttrib = function(
            attr,
            size,
            type,
            normalized,
            stride,
            offset
          ) {
            if (attr) {
              if (
                typeof IS_MINIFIED === 'undefined' &&
                this.attributes[attr.name] !== attr
              ) {
                console.warn(
                  'The attribute "' +
                    attr.name +
                    '"passed to enableAttrib does not belong to this shader.'
                );
              }
              var loc = attr.location;
              if (loc !== -1) {
                var gl = this._renderer.GL;
                gl.enableVertexAttribArray(loc);
                gl.vertexAttribPointer(
                  loc,
                  size,
                  type || gl.FLOAT,
                  normalized || false,
                  stride || 0,
                  offset || 0
                );
              }
            }
            return this;
          };

          module.exports = p5.Shader;
        },
        { '../core/main': 24 }
      ],
      77: [
        function(_dereq_, module, exports) {
          /**
           * This module defines the p5.Texture class
           * @module Lights, Camera
           * @submodule Material
           * @for p5
           * @requires core
           */

          'use strict';

          var p5 = _dereq_('../core/main');
          var constants = _dereq_('../core/constants');

          /**
           * Texture class for WEBGL Mode
           * @private
           * @class p5.Texture
           * @param {p5.RendererGL} renderer an instance of p5.RendererGL that
           * will provide the GL context for this new p5.Texture
           * @param {p5.Image|p5.Graphics|p5.Element|p5.MediaElement|ImageData} [obj] the
           * object containing the image data to store in the texture.
           */
          p5.Texture = function(renderer, obj) {
            this._renderer = renderer;

            var gl = this._renderer.GL;

            this.src = obj;
            this.glTex = undefined;
            this.glTarget = gl.TEXTURE_2D;
            this.glFormat = gl.RGBA;
            this.mipmaps = false;
            this.glMinFilter = gl.LINEAR;
            this.glMagFilter = gl.LINEAR;
            this.glWrapS = gl.CLAMP_TO_EDGE;
            this.glWrapT = gl.CLAMP_TO_EDGE;

            // used to determine if this texture might need constant updating
            // because it is a video or gif.
            this.isSrcMediaElement =
              typeof p5.MediaElement !== 'undefined' && obj instanceof p5.MediaElement;
            this._videoPrevUpdateTime = 0;
            this.isSrcHTMLElement =
              typeof p5.Element !== 'undefined' &&
              obj instanceof p5.Element &&
              !(obj instanceof p5.Graphics);
            this.isSrcP5Image = obj instanceof p5.Image;
            this.isSrcP5Graphics = obj instanceof p5.Graphics;
            this.isImageData = typeof ImageData !== 'undefined' && obj instanceof ImageData;

            var textureData = this._getTextureDataFromSource();
            this.width = textureData.width;
            this.height = textureData.height;

            this.init(textureData);
            return this;
          };

          p5.Texture.prototype._getTextureDataFromSource = function() {
            var textureData;
            if (this.isSrcP5Image) {
              // param is a p5.Image
              textureData = this.src.canvas;
            } else if (
              this.isSrcMediaElement ||
              this.isSrcP5Graphics ||
              this.isSrcHTMLElement
            ) {
              // if param is a video HTML element
              textureData = this.src.elt;
            } else if (this.isImageData) {
              textureData = this.src;
            }
            return textureData;
          };

          /**
           * Initializes common texture parameters, creates a gl texture,
           * tries to upload the texture for the first time if data is
           * already available.
           * @private
           * @method init
           */
          p5.Texture.prototype.init = function(data) {
            var gl = this._renderer.GL;
            this.glTex = gl.createTexture();

            this.glWrapS = this._renderer.textureWrapX;
            this.glWrapT = this._renderer.textureWrapY;

            this.setWrapMode(this.glWrapS, this.glWrapT);
            this.bindTexture();

            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.glMinFilter);

            if (
              this.width === 0 ||
              this.height === 0 ||
              (this.isSrcMediaElement && !this.src.loadedmetadata)
            ) {
              // assign a 1x1 empty texture initially, because data is not yet ready,
              // so that no errors occur in gl console!
              var tmpdata = new Uint8Array([1, 1, 1, 1]);
              gl.texImage2D(
                this.glTarget,
                0,
                gl.RGBA,
                1,
                1,
                0,
                this.glFormat,
                gl.UNSIGNED_BYTE,
                tmpdata
              );
            } else {
              // data is ready: just push the texture!
              gl.texImage2D(
                this.glTarget,
                0,
                this.glFormat,
                this.glFormat,
                gl.UNSIGNED_BYTE,
                data
              );
            }
          };

          /**
           * Checks if the source data for this texture has changed (if it's
           * easy to do so) and reuploads the texture if necessary. If it's not
           * possible or to expensive to do a calculation to determine wheter or
           * not the data has occurred, this method simply re-uploads the texture.
           * @method update
           */
          p5.Texture.prototype.update = function() {
            var data = this.src;
            if (data.width === 0 || data.height === 0) {
              return false; // nothing to do!
            }

            var textureData = this._getTextureDataFromSource();
            var updated = false;

            var gl = this._renderer.GL;
            // pull texture from data, make sure width & height are appropriate
            if (textureData.width !== this.width || textureData.height !== this.height) {
              updated = true;

              // make sure that if the width and height of this.src have changed
              // for some reason, we update our metadata and upload the texture again
              this.width = textureData.width;
              this.height = textureData.height;

              if (this.isSrcP5Image) {
                data.setModified(false);
              } else if (this.isSrcMediaElement || this.isSrcHTMLElement) {
                // on the first frame the metadata comes in, the size will be changed
                // from 0 to actual size, but pixels may not be available.
                // flag for update in a future frame.
                // if we don't do this, a paused video, for example, may not
                // send the first frame to texture memory.
                data.setModified(true);
              }
            } else if (this.isSrcP5Image) {
              // for an image, we only update if the modified field has been set,
              // for example, by a call to p5.Image.set
              if (data.isModified()) {
                updated = true;
                data.setModified(false);
              }
            } else if (this.isSrcMediaElement) {
              // for a media element (video), we'll check if the current time in
              // the video frame matches the last time. if it doesn't match, the
              // video has advanced or otherwise been taken to a new frame,
              // and we need to upload it.
              if (data.isModified()) {
                // p5.MediaElement may have also had set/updatePixels, etc. called
                // on it and should be updated, or may have been set for the first
                // time!
                updated = true;
                data.setModified(false);
              } else if (data.loadedmetadata) {
                // if the meta data has been loaded, we can ask the video
                // what it's current position (in time) is.
                if (this._videoPrevUpdateTime !== data.time()) {
                  // update the texture in gpu mem only if the current
                  // video timestamp does not match the timestamp of the last
                  // time we uploaded this texture (and update the time we
                  // last uploaded, too)
                  this._videoPrevUpdateTime = data.time();
                  updated = true;
                }
              }
            } else if (this.isImageData) {
              if (data._dirty) {
                data._dirty = false;
                updated = true;
              }
            } else {
              /* data instanceof p5.Graphics, probably */
              // there is not enough information to tell if the texture can be
              // conditionally updated; so to be safe, we just go ahead and upload it.
              updated = true;
            }

            if (updated) {
              this.bindTexture();
              gl.texImage2D(
                this.glTarget,
                0,
                this.glFormat,
                this.glFormat,
                gl.UNSIGNED_BYTE,
                textureData
              );
            }

            return updated;
          };

          /**
           * Binds the texture to the appropriate GL target.
           * @method bindTexture
           */
          p5.Texture.prototype.bindTexture = function() {
            // bind texture using gl context + glTarget and
            // generated gl texture object
            var gl = this._renderer.GL;
            gl.bindTexture(this.glTarget, this.glTex);

            return this;
          };

          /**
           * Unbinds the texture from the appropriate GL target.
           * @method unbindTexture
           */
          p5.Texture.prototype.unbindTexture = function() {
            // unbind per above, disable texturing on glTarget
            var gl = this._renderer.GL;
            gl.bindTexture(this.glTarget, null);
          };

          /**
           * Sets how a texture is be interpolated when upscaled or downscaled.
           * Nearest filtering uses nearest neighbor scaling when interpolating
           * Linear filtering uses WebGL's linear scaling when interpolating
           * @method setInterpolation
           * @param {String} downScale Specifies the texture filtering when
           *                           textures are shrunk. Options are LINEAR or NEAREST
           * @param {String} upScale Specifies the texture filtering when
           *                         textures are magnified. Options are LINEAR or NEAREST
           * @todo implement mipmapping filters
           */
          p5.Texture.prototype.setInterpolation = function(downScale, upScale) {
            var gl = this._renderer.GL;

            if (downScale === constants.NEAREST) {
              this.glMinFilter = gl.NEAREST;
            } else {
              this.glMinFilter = gl.LINEAR;
            }

            if (upScale === constants.NEAREST) {
              this.glMagFilter = gl.NEAREST;
            } else {
              this.glMagFilter = gl.LINEAR;
            }

            this.bindTexture();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.glMinFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
            this.unbindTexture();
          };

          /**
           * Sets the texture wrapping mode. This controls how textures behave
           * when their uv's go outside of the 0 - 1 range. There are three options:
           * CLAMP, REPEAT, and MIRROR. REPEAT & MIRROR are only available if the texture
           * is a power of two size (128, 256, 512, 1024, etc.).
           * @method setWrapMode
           * @param {String} wrapX Controls the horizontal texture wrapping behavior
           * @param {String} wrapY Controls the vertical texture wrapping behavior
           */
          p5.Texture.prototype.setWrapMode = function(wrapX, wrapY) {
            var gl = this._renderer.GL;

            // for webgl 1 we need to check if the texture is power of two
            // if it isn't we will set the wrap mode to CLAMP
            // webgl2 will support npot REPEAT and MIRROR but we don't check for it yet
            var isPowerOfTwo = function isPowerOfTwo(x) {
              return (x & (x - 1)) === 0;
            };

            var widthPowerOfTwo = isPowerOfTwo(this.width);
            var heightPowerOfTwo = isPowerOfTwo(this.height);

            if (wrapX === constants.REPEAT) {
              if (widthPowerOfTwo && heightPowerOfTwo) {
                this.glWrapS = gl.REPEAT;
              } else {
                console.warn(
                  'You tried to set the wrap mode to REPEAT but the texture size is not a power of two. Setting to CLAMP instead'
                );

                this.glWrapS = gl.CLAMP_TO_EDGE;
              }
            } else if (wrapX === constants.MIRROR) {
              if (widthPowerOfTwo && heightPowerOfTwo) {
                this.glWrapS = gl.MIRRORED_REPEAT;
              } else {
                console.warn(
                  'You tried to set the wrap mode to MIRROR but the texture size is not a power of two. Setting to CLAMP instead'
                );

                this.glWrapS = gl.CLAMP_TO_EDGE;
              }
            } else {
              // falling back to default if didn't get a proper mode
              this.glWrapS = gl.CLAMP_TO_EDGE;
            }

            if (wrapY === constants.REPEAT) {
              if (widthPowerOfTwo && heightPowerOfTwo) {
                this.glWrapT = gl.REPEAT;
              } else {
                console.warn(
                  'You tried to set the wrap mode to REPEAT but the texture size is not a power of two. Setting to CLAMP instead'
                );

                this.glWrapT = gl.CLAMP_TO_EDGE;
              }
            } else if (wrapY === constants.MIRROR) {
              if (widthPowerOfTwo && heightPowerOfTwo) {
                this.glWrapT = gl.MIRRORED_REPEAT;
              } else {
                console.warn(
                  'You tried to set the wrap mode to MIRROR but the texture size is not a power of two. Setting to CLAMP instead'
                );

                this.glWrapT = gl.CLAMP_TO_EDGE;
              }
            } else {
              // falling back to default if didn't get a proper mode
              this.glWrapT = gl.CLAMP_TO_EDGE;
            }

            this.bindTexture();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.glWrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.glWrapT);
            this.unbindTexture();
          };

          module.exports = p5.Texture;
        },
        { '../core/constants': 18, '../core/main': 24 }
      ],
      78: [
        function(_dereq_, module, exports) {
          'use strict';

          var p5 = _dereq_('../core/main');
          var constants = _dereq_('../core/constants');
          _dereq_('./p5.Shader');
          _dereq_('./p5.RendererGL.Retained');

          // Text/Typography
          // @TODO:
          p5.RendererGL.prototype._applyTextProperties = function() {
            //@TODO finish implementation
            //console.error('text commands not yet implemented in webgl');
          };

          p5.RendererGL.prototype.textWidth = function(s) {
            if (this._isOpenType()) {
              return this._textFont._textWidth(s, this._textSize);
            }

            return 0; // TODO: error
          };

          // rendering constants

          // the number of rows/columns dividing each glyph
          var charGridWidth = 9;
          var charGridHeight = charGridWidth;

          // size of the image holding the bezier stroke info
          var strokeImageWidth = 64;
          var strokeImageHeight = 64;

          // size of the image holding the stroke indices for each row/col
          var gridImageWidth = 64;
          var gridImageHeight = 64;

          // size of the image holding the offset/length of each row/col stripe
          var cellImageWidth = 64;
          var cellImageHeight = 64;

          /**
           * @private
           * @class ImageInfos
           * @param {Integer} width
           * @param {Integer} height
           *
           * the ImageInfos class holds a list of ImageDatas of a given size.
           */
          function ImageInfos(width, height) {
            this.width = width;
            this.height = height;
            this.infos = []; // the list of images

            /**
             *
             * @method findImage
             * @param {Integer} space
             * @return {Object} contains the ImageData, and pixel index into that
             *                  ImageData where the free space was allocated.
             *
             * finds free space of a given size in the ImageData list
             */
            this.findImage = function(space) {
              var imageSize = this.width * this.height;
              if (space > imageSize) throw new Error('font is too complex to render in 3D');

              // search through the list of images, looking for one with
              // anough unused space.
              var imageInfo, imageData;
              for (var ii = this.infos.length - 1; ii >= 0; --ii) {
                var imageInfoTest = this.infos[ii];
                if (imageInfoTest.index + space < imageSize) {
                  // found one
                  imageInfo = imageInfoTest;
                  imageData = imageInfoTest.imageData;
                  break;
                }
              }

              if (!imageInfo) {
                try {
                  // create a new image
                  imageData = new ImageData(this.width, this.height);
                } catch (err) {
                  // for browsers that don't support ImageData constructors (ie IE11)
                  // create an ImageData using the old method
                  var canvas = document.getElementsByTagName('canvas')[0];
                  var created = !canvas;
                  if (!canvas) {
                    // create a temporary canvas
                    canvas = document.createElement('canvas');
                    canvas.style.display = 'none';
                    document.body.appendChild(canvas);
                  }
                  var ctx = canvas.getContext('2d');
                  if (ctx) {
                    imageData = ctx.createImageData(this.width, this.height);
                  }
                  if (created) {
                    // distroy the temporary canvas, if necessary
                    document.body.removeChild(canvas);
                  }
                }
                // construct & dd the new image info
                imageInfo = { index: 0, imageData: imageData };
                this.infos.push(imageInfo);
              }

              var index = imageInfo.index;
              imageInfo.index += space; // move to the start of the next image
              imageData._dirty = true;
              return { imageData: imageData, index: index };
            };
          }

          /**
           * @function setPixel
           * @param {Object} imageInfo
           * @param {Number} r
           * @param {Number} g
           * @param {Number} b
           * @param {Number} a
           *
           * writes the next pixel into an indexed ImageData
           */
          function setPixel(imageInfo, r, g, b, a) {
            var imageData = imageInfo.imageData;
            var pixels = imageData.data;
            var index = imageInfo.index++ * 4;
            pixels[index++] = r;
            pixels[index++] = g;
            pixels[index++] = b;
            pixels[index++] = a;
          }

          var SQRT3 = Math.sqrt(3);

          /**
           * @private
           * @class FontInfo
           * @param {Object} font an opentype.js font object
           *
           * contains cached images and glyph information for an opentype font
           */
          var FontInfo = function FontInfo(font) {
            this.font = font;
            // the bezier curve coordinates
            this.strokeImageInfos = new ImageInfos(strokeImageWidth, strokeImageHeight);
            // lists of curve indices for each row/column slice
            this.colDimImageInfos = new ImageInfos(gridImageWidth, gridImageHeight);
            this.rowDimImageInfos = new ImageInfos(gridImageWidth, gridImageHeight);
            // the offset & length of each row/col slice in the glyph
            this.colCellImageInfos = new ImageInfos(cellImageWidth, cellImageHeight);
            this.rowCellImageInfos = new ImageInfos(cellImageWidth, cellImageHeight);

            // the cached information for each glyph
            this.glyphInfos = {};

            /**
             * @method getGlyphInfo
             * @param {Glyph} glyph the x positions of points in the curve
             * @returns {Object} the glyphInfo for that glyph
             *
             * calculates rendering info for a glyph, including the curve information,
             * row & column stripes compiled into textures.
             */

            this.getGlyphInfo = function(glyph) {
              // check the cache
              var gi = this.glyphInfos[glyph.index];
              if (gi) return gi;

              // get the bounding box of the glyph from opentype.js
              var bb = glyph.getBoundingBox();
              var xMin = bb.x1;
              var yMin = bb.y1;
              var gWidth = bb.x2 - xMin;
              var gHeight = bb.y2 - yMin;
              var cmds = glyph.path.commands;
              // don't bother rendering invisible glyphs
              if (gWidth === 0 || gHeight === 0 || !cmds.length) {
                return (this.glyphInfos[glyph.index] = {});
              }

              var i;
              var strokes = []; // the strokes in this glyph
              var rows = []; // the indices of strokes in each row
              var cols = []; // the indices of strokes in each column
              for (i = charGridWidth - 1; i >= 0; --i) {
                cols.push([]);
              }
              for (i = charGridHeight - 1; i >= 0; --i) {
                rows.push([]);
              }

              /**
               * @function push
               * @param {Number[]} xs the x positions of points in the curve
               * @param {Number[]} ys the y positions of points in the curve
               * @param {Object} v    the curve information
               *
               * adds a curve to the rows & columns that it intersects with
               */
              function push(xs, ys, v) {
                var index = strokes.length; // the index of this stroke
                strokes.push(v); // add this stroke to the list

                /**
                 * @function minMax
                 * @param {Number[]} rg the list of values to compare
                 * @param {Number} min the initial minimum value
                 * @param {Number} max the initial maximum value
                 *
                 * find the minimum & maximum value in a list of values
                 */
                function minMax(rg, min, max) {
                  for (var i = rg.length; i-- > 0; ) {
                    var v = rg[i];
                    if (min > v) min = v;
                    if (max < v) max = v;
                  }
                  return { min: min, max: max };
                }

                // loop through the rows & columns that the curve intersects
                // adding the curve to those slices
                var mmX = minMax(xs, 1, 0);
                var ixMin = Math.max(Math.floor(mmX.min * charGridWidth), 0);
                var ixMax = Math.min(Math.ceil(mmX.max * charGridWidth), charGridWidth);
                for (var iCol = ixMin; iCol < ixMax; ++iCol) {
                  cols[iCol].push(index);
                }

                var mmY = minMax(ys, 1, 0);
                var iyMin = Math.max(Math.floor(mmY.min * charGridHeight), 0);
                var iyMax = Math.min(Math.ceil(mmY.max * charGridHeight), charGridHeight);
                for (var iRow = iyMin; iRow < iyMax; ++iRow) {
                  rows[iRow].push(index);
                }
              }

              /**
               * @function clamp
               * @param {Number} v the value to clamp
               * @param {Number} min the minimum value
               * @param {Number} max the maxmimum value
               *
               * clamps a value between a minimum & maximum value
               */
              function clamp(v, min, max) {
                if (v < min) return min;
                if (v > max) return max;
                return v;
              }

              /**
               * @function byte
               * @param {Number} v the value to scale
               *
               * converts a floating-point number in the range 0-1 to a byte 0-255
               */
              function byte(v) {
                return clamp(255 * v, 0, 255);
              }

              /**
               * @private
               * @class Cubic
               * @param {Number} p0 the start point of the curve
               * @param {Number} c0 the first control point
               * @param {Number} c1 the second control point
               * @param {Number} p1 the end point
               *
               * a cubic curve
               */
              function Cubic(p0, c0, c1, p1) {
                this.p0 = p0;
                this.c0 = c0;
                this.c1 = c1;
                this.p1 = p1;

                /**
                 * @method toQuadratic
                 * @return {Object} the quadratic approximation
                 *
                 * converts the cubic to a quadtratic approximation by
                 * picking an appropriate quadratic control point
                 */
                this.toQuadratic = function() {
                  return {
                    x: this.p0.x,
                    y: this.p0.y,
                    x1: this.p1.x,
                    y1: this.p1.y,
                    cx: ((this.c0.x + this.c1.x) * 3 - (this.p0.x + this.p1.x)) / 4,
                    cy: ((this.c0.y + this.c1.y) * 3 - (this.p0.y + this.p1.y)) / 4
                  };
                };

                /**
                 * @method quadError
                 * @return {Number} the error
                 *
                 * calculates the magnitude of error of this curve's
                 * quadratic approximation.
                 */
                this.quadError = function() {
                  return (
                    p5.Vector.sub(
                      p5.Vector.sub(this.p1, this.p0),
                      p5.Vector.mult(p5.Vector.sub(this.c1, this.c0), 3)
                    ).mag() / 2
                  );
                };

                /**
                 * @method split
                 * @param {Number} t the value (0-1) at which to split
                 * @return {Cubic} the second part of the curve
                 *
                 * splits the cubic into two parts at a point 't' along the curve.
                 * this cubic keeps its start point and its end point becomes the
                 * point at 't'. the 'end half is returned.
                 */
                this.split = function(t) {
                  var m1 = p5.Vector.lerp(this.p0, this.c0, t);
                  var m2 = p5.Vector.lerp(this.c0, this.c1, t);
                  var mm1 = p5.Vector.lerp(m1, m2, t);

                  this.c1 = p5.Vector.lerp(this.c1, this.p1, t);
                  this.c0 = p5.Vector.lerp(m2, this.c1, t);
                  var pt = p5.Vector.lerp(mm1, this.c0, t);
                  var part1 = new Cubic(this.p0, m1, mm1, pt);
                  this.p0 = pt;
                  return part1;
                };

                /**
                 * @method splitInflections
                 * @return {Cubic[]} the non-inflecting pieces of this cubic
                 *
                 * returns an array containing 0, 1 or 2 cubics split resulting
                 * from splitting this cubic at its inflection points.
                 * this cubic is (potentially) altered and returned in the list.
                 */
                this.splitInflections = function() {
                  var a = p5.Vector.sub(this.c0, this.p0);
                  var b = p5.Vector.sub(p5.Vector.sub(this.c1, this.c0), a);
                  var c = p5.Vector.sub(
                    p5.Vector.sub(p5.Vector.sub(this.p1, this.c1), a),
                    p5.Vector.mult(b, 2)
                  );

                  var cubics = [];

                  // find the derivative coefficients
                  var A = b.x * c.y - b.y * c.x;
                  if (A !== 0) {
                    var B = a.x * c.y - a.y * c.x;
                    var C = a.x * b.y - a.y * b.x;
                    var disc = B * B - 4 * A * C;
                    if (disc >= 0) {
                      if (A < 0) {
                        A = -A;
                        B = -B;
                        C = -C;
                      }

                      var Q = Math.sqrt(disc);
                      var t0 = (-B - Q) / (2 * A); // the first inflection point
                      var t1 = (-B + Q) / (2 * A); // the second inflection point

                      // test if the first inflection point lies on the curve
                      if (t0 > 0 && t0 < 1) {
                        // split at the first inflection point
                        cubics.push(this.split(t0));
                        // scale t2 into the second part
                        t1 = 1 - (1 - t1) / (1 - t0);
                      }

                      // test if the second inflection point lies on the curve
                      if (t1 > 0 && t1 < 1) {
                        // split at the second inflection point
                        cubics.push(this.split(t1));
                      }
                    }
                  }

                  cubics.push(this);
                  return cubics;
                };
              }

              /**
               * @function cubicToQuadratics
               * @param {Number} x0
               * @param {Number} y0
               * @param {Number} cx0
               * @param {Number} cy0
               * @param {Number} cx1
               * @param {Number} cy1
               * @param {Number} x1
               * @param {Number} y1
               * @returns {Cubic[]} an array of cubics whose quadratic approximations
               *                    closely match the civen cubic.
               *
               * converts a cubic curve to a list of quadratics.
               */
              function cubicToQuadratics(x0, y0, cx0, cy0, cx1, cy1, x1, y1) {
                // create the Cubic object and split it at its inflections
                var cubics = new Cubic(
                  new p5.Vector(x0, y0),
                  new p5.Vector(cx0, cy0),
                  new p5.Vector(cx1, cy1),
                  new p5.Vector(x1, y1)
                ).splitInflections();

                var qs = []; // the final list of quadratics
                var precision = 30 / SQRT3;

                // for each of the non-inflected pieces of the original cubic
                for (var i = 0; i < cubics.length; i++) {
                  var cubic = cubics[i];

                  // the cubic is iteratively split in 3 pieces:
                  // the first piece is accumulated in 'qs', the result.
                  // the last piece is accumulated in 'tail', temporarily.
                  // the middle piece is repeatedly split again, while necessary.
                  var tail = [];

                  var t3;
                  for (;;) {
                    // calculate this cubic's precision
                    t3 = precision / cubic.quadError();
                    if (t3 >= 0.5 * 0.5 * 0.5) {
                      break; // not too bad, we're done
                    }

                    // find a split point based on the error
                    var t = Math.pow(t3, 1.0 / 3.0);
                    // split the cubic in 3
                    var start = cubic.split(t);
                    var middle = cubic.split(1 - t / (1 - t));

                    qs.push(start); // the first part
                    tail.push(cubic); // the last part
                    cubic = middle; // iterate on the middle piece
                  }

                  if (t3 < 1) {
                    // a little excess error, split the middle in two
                    qs.push(cubic.split(0.5));
                  }
                  // add the middle piece to the result
                  qs.push(cubic);

                  // finally add the tail, reversed, onto the result
                  Array.prototype.push.apply(qs, tail.reverse());
                }

                return qs;
              }

              /**
               * @function pushLine
               * @param {Number} x0
               * @param {Number} y0
               * @param {Number} x1
               * @param {Number} y1
               *
               * add a straight line to the row/col grid of a glyph
               */
              function pushLine(x0, y0, x1, y1) {
                var mx = (x0 + x1) / 2;
                var my = (y0 + y1) / 2;
                push([x0, x1], [y0, y1], { x: x0, y: y0, cx: mx, cy: my });
              }

              /**
               * @function samePoint
               * @param {Number} x0
               * @param {Number} y0
               * @param {Number} x1
               * @param {Number} y1
               * @return {Boolean} true if the two points are sufficiently close
               *
               * tests if two points are close enough to be considered the same
               */
              function samePoint(x0, y0, x1, y1) {
                return Math.abs(x1 - x0) < 0.00001 && Math.abs(y1 - y0) < 0.00001;
              }

              var x0, y0, xs, ys;
              for (var iCmd = 0; iCmd < cmds.length; ++iCmd) {
                var cmd = cmds[iCmd];
                // scale the coordinates to the range 0-1
                var x1 = (cmd.x - xMin) / gWidth;
                var y1 = (cmd.y - yMin) / gHeight;

                // don't bother if this point is the same as the last
                if (samePoint(x0, y0, x1, y1)) continue;

                switch (cmd.type) {
                  case 'M': // move
                    xs = x1;
                    ys = y1;
                    break;
                  case 'L': // line
                    pushLine(x0, y0, x1, y1);
                    break;
                  case 'Q': // quadratic
                    var cx = (cmd.x1 - xMin) / gWidth;
                    var cy = (cmd.y1 - yMin) / gHeight;
                    push([x0, x1, cx], [y0, y1, cy], { x: x0, y: y0, cx: cx, cy: cy });
                    break;
                  case 'Z': // end
                    if (!samePoint(x0, y0, xs, ys)) {
                      // add an extra line closing the loop, if necessary
                      pushLine(x0, y0, xs, ys);
                      strokes.push({ x: xs, y: ys });
                    } else {
                      strokes.push({ x: x0, y: y0 });
                    }
                    break;
                  case 'C': // cubic
                    var cx1 = (cmd.x1 - xMin) / gWidth;
                    var cy1 = (cmd.y1 - yMin) / gHeight;
                    var cx2 = (cmd.x2 - xMin) / gWidth;
                    var cy2 = (cmd.y2 - yMin) / gHeight;
                    var qs = cubicToQuadratics(x0, y0, cx1, cy1, cx2, cy2, x1, y1);
                    for (var iq = 0; iq < qs.length; iq++) {
                      var q = qs[iq].toQuadratic();
                      push([q.x, q.x1, q.cx], [q.y, q.y1, q.cy], q);
                    }
                    break;
                  default:
                    throw new Error('unknown command type: ' + cmd.type);
                }

                x0 = x1;
                y0 = y1;
              }

              // allocate space for the strokes
              var strokeCount = strokes.length;
              var strokeImageInfo = this.strokeImageInfos.findImage(strokeCount);
              var strokeOffset = strokeImageInfo.index;

              // fill the stroke image
              for (var il = 0; il < strokeCount; ++il) {
                var s = strokes[il];
                setPixel(strokeImageInfo, byte(s.x), byte(s.y), byte(s.cx), byte(s.cy));
              }

              /**
               * @function layout
               * @param {Number[][]} dim
               * @param {ImageInfo[]} dimImageInfos
               * @param {ImageInfo[]} cellImageInfos
               * @return {Object}
               *
               * lays out the curves in a dimension (row or col) into two
               * images, one for the indices of the curves themselves, and
               * one containing the offset and length of those index spans.
               */
              function layout(dim, dimImageInfos, cellImageInfos) {
                var dimLength = dim.length; // the number of slices in this dimension
                var dimImageInfo = dimImageInfos.findImage(dimLength);
                var dimOffset = dimImageInfo.index;
                // calculate the total number of stroke indices in this dimension
                var totalStrokes = 0;
                for (var id = 0; id < dimLength; ++id) {
                  totalStrokes += dim[id].length;
                }

                // allocate space for the stroke indices
                var cellImageInfo = cellImageInfos.findImage(totalStrokes);

                // for each slice in the glyph
                for (var i = 0; i < dimLength; ++i) {
                  var strokeIndices = dim[i];
                  var strokeCount = strokeIndices.length;
                  var cellLineIndex = cellImageInfo.index;

                  // write the offset and count into the glyph slice image
                  setPixel(
                    dimImageInfo,
                    cellLineIndex >> 7,
                    cellLineIndex & 0x7f,
                    strokeCount >> 7,
                    strokeCount & 0x7f
                  );

                  // for each stroke index in that slice
                  for (var iil = 0; iil < strokeCount; ++iil) {
                    // write the stroke index into the slice's image
                    var strokeIndex = strokeIndices[iil] + strokeOffset;
                    setPixel(cellImageInfo, strokeIndex >> 7, strokeIndex & 0x7f, 0, 0);
                  }
                }

                return {
                  cellImageInfo: cellImageInfo,
                  dimOffset: dimOffset,
                  dimImageInfo: dimImageInfo
                };
              }

              // initialize the info for this glyph
              gi = this.glyphInfos[glyph.index] = {
                glyph: glyph,
                uGlyphRect: [bb.x1, -bb.y1, bb.x2, -bb.y2],
                strokeImageInfo: strokeImageInfo,
                strokes: strokes,
                colInfo: layout(cols, this.colDimImageInfos, this.colCellImageInfos),
                rowInfo: layout(rows, this.rowDimImageInfos, this.rowCellImageInfos)
              };

              gi.uGridOffset = [gi.colInfo.dimOffset, gi.rowInfo.dimOffset];
              return gi;
            };
          };

          p5.RendererGL.prototype._renderText = function(p, line, x, y, maxY) {
            if (!this._textFont || typeof this._textFont === 'string') {
              console.log(
                'WEBGL: you must load and set a font before drawing text. See `loadFont` and `textFont` for more details.'
              );

              return;
            }
            if (y >= maxY || !this._doFill) {
              return; // don't render lines beyond our maxY position
            }

            if (!this._isOpenType()) {
              console.log('WEBGL: only opentype fonts are supported');
              return p;
            }

            p.push(); // fix to #803

            // remember this state, so it can be restored later
            var doStroke = this._doStroke;
            var drawMode = this.drawMode;

            this._doStroke = false;
            this.drawMode = constants.TEXTURE;

            // get the cached FontInfo object
            var font = this._textFont.font;
            var fontInfo = this._textFont._fontInfo;
            if (!fontInfo) {
              fontInfo = this._textFont._fontInfo = new FontInfo(font);
            }

            // calculate the alignment and move/scale the view accordingly
            var pos = this._textFont._handleAlignment(this, line, x, y);
            var fontSize = this._textSize;
            var scale = fontSize / font.unitsPerEm;
            this.translate(pos.x, pos.y, 0);
            this.scale(scale, scale, 1);

            // initialize the font shader
            var gl = this.GL;
            var initializeShader = !this._defaultFontShader;
            var sh = this._getFontShader();
            sh.init();
            sh.bindShader(); // first time around, bind the shader fully

            if (initializeShader) {
              // these are constants, really. just initialize them one-time.
              sh.setUniform('uGridImageSize', [gridImageWidth, gridImageHeight]);
              sh.setUniform('uCellsImageSize', [cellImageWidth, cellImageHeight]);
              sh.setUniform('uStrokeImageSize', [strokeImageWidth, strokeImageHeight]);
              sh.setUniform('uGridSize', [charGridWidth, charGridHeight]);
            }
            this._applyColorBlend(this.curFillColor);

            var g = this.gHash['glyph'];
            if (!g) {
              // create the geometry for rendering a quad
              var geom = (this._textGeom = new p5.Geometry(1, 1, function() {
                for (var i = 0; i <= 1; i++) {
                  for (var j = 0; j <= 1; j++) {
                    this.vertices.push(new p5.Vector(j, i, 0));
                    this.uvs.push(j, i);
                  }
                }
              }));
              geom.computeFaces().computeNormals();
              g = this.createBuffers('glyph', geom);
            }

            // bind the shader buffers
            this._prepareBuffers(g, sh, p5.RendererGL._textBuffers);
            this._bindBuffer(g.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);

            // this will have to do for now...
            sh.setUniform('uMaterialColor', this.curFillColor);

            try {
              var dx = 0; // the x position in the line
              var glyphPrev = null; // the previous glyph, used for kerning
              // fetch the glyphs in the line of text
              var glyphs = font.stringToGlyphs(line);
              for (var ig = 0; ig < glyphs.length; ++ig) {
                var glyph = glyphs[ig];
                // kern
                if (glyphPrev) dx += font.getKerningValue(glyphPrev, glyph);

                var gi = fontInfo.getGlyphInfo(glyph);
                if (gi.uGlyphRect) {
                  var rowInfo = gi.rowInfo;
                  var colInfo = gi.colInfo;
                  sh.setUniform('uSamplerStrokes', gi.strokeImageInfo.imageData);
                  sh.setUniform('uSamplerRowStrokes', rowInfo.cellImageInfo.imageData);
                  sh.setUniform('uSamplerRows', rowInfo.dimImageInfo.imageData);
                  sh.setUniform('uSamplerColStrokes', colInfo.cellImageInfo.imageData);
                  sh.setUniform('uSamplerCols', colInfo.dimImageInfo.imageData);
                  sh.setUniform('uGridOffset', gi.uGridOffset);
                  sh.setUniform('uGlyphRect', gi.uGlyphRect);
                  sh.setUniform('uGlyphOffset', dx);

                  sh.bindTextures(); // afterwards, only textures need updating

                  // draw it
                  gl.drawElements(gl.TRIANGLES, 6, this.GL.UNSIGNED_SHORT, 0);
                }
                dx += glyph.advanceWidth;
                glyphPrev = glyph;
              }
            } finally {
              // clean up
              sh.unbindShader();

              this._doStroke = doStroke;
              this.drawMode = drawMode;

              p.pop();
            }

            this._pixelsState._pixelsDirty = true;
            return p;
          };
        },
        {
          '../core/constants': 18,
          '../core/main': 24,
          './p5.RendererGL.Retained': 74,
          './p5.Shader': 76
        }
      ]
    },
    {},
    [13]
  )(13);
});
