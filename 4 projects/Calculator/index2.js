(function(){
  "use strict"

  var calc = {
    states: {
      setNumber: true,
      floatPoint: false
    },

    restart: function(){
      this.cacheDom();
      this.bindEvents();
    },

    cacheDom: function(){
      this.viewer = document.querySelector("#viewer");
      this.equals = document.querySelector("#equals");
      this.clearButton = document.querySelector("#clear");
      this.buttons = document.querySelectorAll(".btn");
    },

    bindEvents: function(){
      for (var i = 0, l = this.buttons.length; i < l; i++){
        this.buttons[i].onclick = this.setInput.bind(this);
      }

      this.equals.onclick = this.displayNumber.bind(this);
      this.clearButton.onclick = this.clearViewer;
    },

    setInput: function(e){
      var el = e.target,
      number = el.getAttribute("data-sign");

      if (calc.isNumber(number)) {
        this.states.setNumber = true;
      } else {
        this.states.setNumber = false;
        this.states.floatPoint = false;
      }

      this.setViewer(number);
    },

    setViewer: function(input) {
      if (this.states.setNumber) {
        //Number
        if (input === "." && !this.states.floatPoint) {
          this.states.floatPoint = true;
          viewer.innerHTML += input;
        } else if (input === "." && this.states.floatPoint) {
          //error
        } else {
          viewer.innerHTML += input;
        }
      } else {
        //Operator
        viewer.innerHTML += " " + input + " ";
      }
    },

    displayNumber: function(e){
      viewer.innerHTML = this.calculate(viewer.innerHTML);
    },

    clearViewer: function(){
      viewer.innerHTML = "";
    },

    tokenize: function(code) {
      var results = [];
      var tokenRegExp = /\s*([A-Za-z]+|[0-9\.]+|\S)\s*/g;

      var m;
      while ((m = tokenRegExp.exec(code)) !== null)
      results.push(m[1]);
      return results;
    },

    isNumber: function(token) {
      return token !== undefined && token.match(/^[0-9\.]+$/) !== null;
    },

    isName: function(token) {
      return token !== undefined && token.match(/^[A-Za-z]+$/) !== null;
    },

    parse: function(code) {
      var tokens = calc.tokenize(code);
      var position = 0;

      function peek() {
        return tokens[position];
      }

      function consume(token) {
        position++;
      }
      function parsePrimaryExpr() {
        var t = peek();
        if (calc.isNumber(t)) {
          consume(t);
          return {type: "number", value: t};
        } else if (calc.isName(t)) {
          consume(t);
          return {type: "name", id: t};
        } else if (t == String.fromCharCode(8730) || t == String.fromCharCode(178)) {
          return {type: "special", id: t};
        } else if (t === "(") {
          consume(t);
          var expr = parseExpr();
          if (peek() !== ")")
          throw new SyntaxError("expected )");
          consume(")");
          return expr;
        } else {
          throw new SyntaxError("expected a number, a variable, or parentheses");
        }
      }

      function parseMulExpr() {
        var expr = parsePrimaryExpr();
        var t = peek();
        while (t === "*" || t === "/" || t === String.fromCharCode(8730) || t === String.fromCharCode(178)) {
          if (t === String.fromCharCode(178)) {
            var rhs = parsePrimaryExpr();
            expr = {type: t, left: expr, right: rhs};
            consume(t);
            t = peek();
          } else {
            consume(t);
            var rhs = parsePrimaryExpr();
            expr = {type: t, left: expr, right: rhs};
            t = peek();
          }
        }
        return expr;
      }

      function parseExpr() {
        var expr = parseMulExpr();
        var t = peek();
        while (t === "+" || t === "-") {
          consume(t);
          var rhs = parseMulExpr();
          expr = {type: t, left: expr, right: rhs};
          t = peek();
        }
        return expr;
      }
      var result = parseExpr();
      if (position !== tokens.length)
      throw new SyntaxError("unexpected '" + peek() + "'");
      return result;
    },

    calculate: function (code) {
      function evaluate(obj) {
        switch (obj.type) {
          case "number":  return parseFloat(obj.value);
          case "name":  return variables[obj.id] || 0;
          case "+":  return evaluate(obj.left) + evaluate(obj.right);
          case "-":  return evaluate(obj.left) - evaluate(obj.right);
          case "*":  return evaluate(obj.left) * evaluate(obj.right);
          case "/":  return evaluate(obj.left) / evaluate(obj.right);
          case String.fromCharCode(8730): return Math.sqrt(evaluate(obj.right)); //sqrt
          case String.fromCharCode(178):  return Math.pow(evaluate(obj.left), 2); //pow
        }
      }
      return evaluate(calc.parse(code));
    }
  };

  calc.restart();
  window.calc = calc;
}());
