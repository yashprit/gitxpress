#hubrowser
=========

**HuBrowser** is browser plugin to browse by adding filetree at lefthand side of screen GitHub &amp; bookmark repository 

##Setup

###Install Node
//FIX ME

###Install Gulp

###Chrome Extension

1. Clone Repo using ssh `git clone git@github.com:yashprit/hubrowser.git` or https `git clone https://github.com/yashprit/hubrowser.git`.
2. Make sure node and gulp in installed, after that run `npm install -d`.
3. on root run `gulp chrome` all build file will be store in `dist/build/chrome`.
4. Go to `chrome://extension`.
5. Check on `developer mode` if not checked, click on `Load unpacked extension...` this will open file explorer, browse the path hubrowser/dist/build/chrome
6. Open [GitHub hubrowser or any repo](https://github.com/yashprit/hubrowser) to see hubrowser in action

**P.S. crx file still not present, we are currently in development mode, next browser is Mozilla.**


###Use Gulp resources 
1. http://julienrenaux.fr/2014/05/25/introduction-to-gulp-js-with-practical-examples/
2. https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support
3. http://stackoverflow.com/questions/21699146/gulp-js-task-return-on-src

