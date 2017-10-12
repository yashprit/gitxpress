declare module 'octicons';

declare module 'detect-browser';

interface JQuery {
   bigSlide(options?: any) : any;
   treeview(options?: any) : any;
   pjax(element?: any, container?:any): any;
   popover():void;
   selectize(option?:any):void;
}

interface JQueryStatic {
  pjax(element?: any, container?:any): any;
  popover():void;
  selectize(option?:any):void;
}

declare var chrome:any;

declare var window:Window;