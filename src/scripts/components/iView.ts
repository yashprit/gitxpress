/// <reference path="../../../typings.d.ts" />

import $ from 'jquery';

export default abstract class iView {
  template:string;
  html:string;
  selector:string;

  constructor(selector:string, template:string) {
    this.selector = selector;
    this.template = template;
  }

  abstract componentWillRender() :void;
  abstract componentDidRender() : void;

  compile(params:object) {
    let re = /{{(.+?)}}/g, 
		  reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, 
		  code = 'with(obj) { var r=[];\n', 
		  cursor = 0, 
		  result,
	    match;
	  
    let add = function(line:string, js:boolean) {
		  js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			  (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		  return add;
	  }
	  
    while(match = re.exec(this.template)) {
		  add(this.template.slice(cursor, match.index), false)(match[1], true);
		  cursor = match.index + match[0].length;
	  }
	  
    add(this.template.substr(cursor, this.template.length - cursor), false);
	  code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
	  try { 
      result = new Function('obj', code).apply(params, [params]); 
      this.html = result;
    } catch(err) { 
      console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); 
    }
  }

  render(params:object, functionName:string){
    this.componentWillRender();
    this.compile(params);
    (<any>$(this.selector))[functionName](this.html);
    this.componentDidRender();
  }
}