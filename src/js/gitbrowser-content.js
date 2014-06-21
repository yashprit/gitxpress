(function($) {

	var $sidebar = $('<a id="simple-menu" class="gitbrowser-action" href="#sidr"><span class="minimize"></span></a>');

	var branch = 'master',
	username,
	repo;
	
	var repoURL;

	var folders = {};

	var data = [];

	var add = function(nodes, root, type) {
		if (nodes.length === 0) {
			return 0;
		}
		var isfolder = (type === 'tree'? true : false);
		if (!root[nodes[0]]) {
			root[nodes[0]] = {
				path: '#' + nodes.join('/'),
				child: {},
				isFolder: isfolder,
        type: isfolder? 'tree' : 'blob'
			}
		}
		arguments.callee(nodes.slice(1), root[nodes[0]].child, type)
	}

	var convertData = function(data, obj, link) {
		for (var key in obj) {
			if (!obj.hasOwnProperty(key)) continue;
			var item = obj[key];
      var href = '/' + repoURL.username +'/' + repoURL.repo + '/' + item.type + '/' + repoURL.branch
			if(!link) {
				 var url = href + '/'  + key;
			} else {
				var url = href + '/' + link + '/' + key
			}
			
			var _obj = {
				text: key,
				href: url,
				isFolder: item.isFolder
			}
			data.push(_obj);
			if (item.child) {
				_obj.children = []
				convertData(_obj.children, item.child, key)
			}
		}
	}

	var genrateTreeFromPath = function(tree) {
		tree.forEach(function(v) {
			//if (v.type == 'tree') {
				if (v.path.indexOf('/') > -1) {
					var nodes = v.path.split('/');
					add(nodes, folders, v.type)
				} else {
					if(v.type === 'tree') {
						 folders[v.path] = {
							//path: '#' + nodes.join('/'),
							child: {},
							isFolder: true,
              type: v.type 
						} 
					} else if(v.type === 'blob'){
					 	folders[v.path] = {
							//path: '#' + nodes.join('/'),
							//child: {},
							isFolder: false,
              type: v.type
						} 
					}
				}
		});
	}

	var renderTree = function() {
		convertData(data,folders);
		$('body').append($sidebar);
		var x = $('#simple-menu').sidr({
			name: 'gitbrowser',
			displace: true,
			source: function(name) {
				var _html = '<div class="git-top-header"><div class="clearfix"><ul class="top-nav git-header"><li class="explore"><a href = "#"> Browse</a></li></ul></div></div><div id="treeview"></div>'
				return _html;
			},
			onOpen: function() {
				$('body').css('left', '150px');
				$('#simple-menu').html('<span class="minimize"></span>').animate({'left':'240px'});
			},
			onClose: function() {
				$('#simple-menu').html('<span class="maxmize"></span>').animate({'left':'0px'});
			}

		});

		var options = {
			data: data,
			ordering: 'OrderedFolder'
		};


		$.sidr('open', 'gitbrowser', function() {
			$('#treeview').easytree(options);
      $(document).pjax('[data-pjax] a, a[data-pjax]', '#js-repo-pjax-container');
      $(document).on('click', 'a.message', function(e){
        e.preventDefault();
      })
			$('body').css('left', '150px');
		})
	}

		function injectDOM() {};

	$(document).ready(function() {
		
		var gitKeyword = ['wiki', 'issues', 'pulls','pulse','graphs','network','settings','commits' ];
		
		var repoKeys = ['tree', 'master']

		var github = new Github({
			token: "0ced2bff07935ae47276cacb05737e82621d05f8",
			auth: "oauth"
		});
		
		var url = window.location.pathname;
		
		var expression = new RegExp(gitKeyword.join('|'));
		
		if(!url.match(expression)) {
			var urlparts = url.split('/');
			username = urlparts[1];
			repo = urlparts[2];
			
			var branchpart = url.split('tree')
			
			if(branchpart[1]) {
				var i = branchpart[1].substr(1, branchpart[1].length);
				branch = i.substr(0, i.indexOf('/'));
			}
			
			repoURL = {
        username: username,
        repo: repo,
        branch: branch
      };
		
			var repo = github.getRepo(username, repo);
			
			var renderRepo = function(err, tree) {
				if (err) return false;
				genrateTreeFromPath(tree);
				renderTree()
			}
			
			

			repo.getTree(branch + '?recursive=true', renderRepo);
		
			
		} 
	});
})(jQuery)
