declare module 'octicons';

declare module 'detect-browser';

interface JQuery {
   bigSlide(options?: any) : any;
   treeview(options?: any) : any;
   pjax(element?: any, container?:any): any;
}

interface JQueryStatic {
  pjax(element?: any, container?:any): any;
}

declare var chrome:any;

declare var window:Window;