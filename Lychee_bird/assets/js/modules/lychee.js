/**
 * @name		Lychee Module
 * @description	Module principale. Permet de g�rer le d�placement sur le site et lance les fonctions d'affichage de base.
 * @author		Tobias Reich
 * @copyright	2014 by Tobias Reich
 */

var lychee = {

	version: "2.0.3",

	api_path: "php/api.php",
	update_path: "http://lychee.electerious.com/version/index.php",
	updateURL: "https://github.com/electerious/Lychee",
	website: "http://lychee.electerious.com",

	upload_path_thumb: "uploads/thumb/",
	upload_path_big: "uploads/big/",
	fileOnServer: "0",

	publicMode: false,
	viewMode: false,
	debugMode: false,

	username: "",
	checkForUpdates: false,
	sorting: "",
	folder: "",

	dropbox: false,

	loadingBar: $("#loading"),
	header: $("header"),
	content: $("#content"),
	imageview: $("#imageview"),
	infobox: $("#infobox"),

	init: function() {

		lychee.api("init", function(data) {

			if (data.loggedIn!==true) {
				lychee.setMode("public");
			}
			
			// No configuration
			if (data==="Warning: No configuration!") {
				lychee.header.hide();
				lychee.content.hide();
				$("body").append(build.no_content("cog"));
				settings.createConfig();
				return true;
			}
			
			// No login
			if (data.config.login===false) {
				settings.createLogin();
			}

			if (data.loggedIn!==true) {
				lychee.sorting = data.config.sorting;
				lychee.folder = data.config.folder;
			} else {
				lychee.username = data.config.username;
				lychee.sorting = data.config.sorting;
				lychee.folder = data.config.folder;
			}
			
			lychee.checkForUpdates = data.config.checkForUpdates;
			$(window).bind("popstate", lychee.load);
			lychee.load();

		});
	},

	api: function(params, callback, loading) {

		if (loading==undefined) loadingBar.show();

		$.ajax({
			type: "POST",
			url: lychee.api_path,
			data: "function=" + params,
			dataType: "text",
			success: function(data) {

				setTimeout(function() { loadingBar.hide() }, 100);

				if (typeof data==="string"&&data.substring(0, 7)==="Error: ") {
					lychee.error(data.substring(7, data.length), params, data);
					return false;
				}

				if (data==="1") data = true;
				else if (data==="") data = false;

				if (typeof data==="string"&&data.substring(0, 1)==="{"&&data.substring(data.length-1, data.length)==="}") data = $.parseJSON(data);

				if (lychee.debugMode) console.log(data);

				callback(data);

			},
			error: function(jqXHR, textStatus, errorThrown) {

				lychee.error("Server error or API not found.", params, errorThrown);

			}
		});

	},

	login: function() {

		var user = $("input#username").val(),
			password = hex_md5($("input#password").val()),
			params;

		params = "login&user=" + user + "&password=" + password;
		lychee.api(params, function(data) {
			if (data===true) {
				localStorage.setItem("username", user);
				window.location.reload();
			} else {
				$("#password").val("").addClass("error");
				$(".message .button.active").removeClass("pressed");
			}
		});

	},

	loginDialog: function() {

		var local_username;

		$("body").append(build.signInModal());
		$("#username").focus();
		if (localStorage) {
			local_username = localStorage.getItem("username");
			if (local_username!=null) {
				if (local_username.length>0) $("#username").val(local_username);
				$("#password").focus();
			}
		}
		if (lychee.checkForUpdates==="1") lychee.getUpdate();

	},
	
	welcomeDialog: function() {

		var local_username;

		$("body").append(build.welcomeModal());
		$("#username").focus();
		if (localStorage) {
			local_username = localStorage.getItem("username");
			if (local_username!=null) {
				if (local_username.length>0) $("#username").val(local_username);
				$("#password").focus();
			}
		}
		if (lychee.checkForUpdates==="1") lychee.getUpdate();

	},

	logout: function() {

		lychee.api("logout", function(data) {
			window.location.reload();
		});

	},

	goto: function(url) {

		if (url==undefined) url = "";
		document.location.hash = url;

	},

	load: function() {

		var albumID = "",
			photoID = "",
			hash = document.location.hash.replace("#", "").split("/");

		contextMenu.close();

		if (hash[0]!==undefined) albumID = hash[0];
		if (hash[1]!==undefined) photoID = hash[1];
		
		if (albumID&&photoID) {

			// Trash data
			albums.json = null;
			photo.json = null;

			// Show Photo
			if (lychee.content.html()===""||($("#search").length&&$("#search").val().length!==0)) {
				lychee.content.hide();
				album.load(albumID, true);
			}
			photo.load(photoID, albumID);

		} else if (albumID) {
			// Trash data
			albums.json = null;
			photo.json = null;

			// Show Album
			if (visible.photo()) view.photo.hide();
			if (album.json&&albumID==album.json.id) view.album.title();
			else album.load(albumID);

		} else {
			// Trash data
			//welcome.json = null;
			albums.json = null;
			album.json = null;
			photo.json = null;
			search.code = "";

			// Show Albums
			//if (visible.albums()) view.albums.hide();
			if (visible.album()) view.album.hide();
			if (visible.photo()) view.photo.hide();
			albums.load();

		}
		//notification pour les images dans le dossier import
		if(lychee.username!=""){
			setInterval(upload.start.checkServer,2000);
		}
	},

	
	getUpdate: function() {

		$.ajax({
			url: lychee.update_path,
			success: function(data) { if (data!=lychee.version) $("#version span").show(); }
		});

	},

	setTitle: function(title, editable) {

		if (title==="Albums") document.title = "Lychee";
		else document.title = "Lychee - " + title;

		if (editable) $("#title").addClass("editable");
		else $("#title").removeClass("editable");

		$("#title").html(title);

	},

	setMode: function(mode) {
		
		$("#button_settings, #button_settings, #button_search, #button_trash_album, #button_share_album, .button_add, .button_divider").remove();
		$("#button_trash, #button_move, #button_share, #button_star").remove();

		$(document)
			.on("mouseenter", "#title.editable", function() { $(this).removeClass("editable") })
			.off("click", "#title.editable")
			.off("touchend", "#title.editable")
			.off("contextmenu", ".photo")
			.off("contextmenu", ".album")
			.off("drop");

		Mousetrap
			.unbind('n')
			.unbind('u')
			.unbind('s')
			.unbind('backspace');

		if (mode==="public") {

			$("header #button_signin, header #hostedwith").show();
			lychee.publicMode = true;

		} else if (mode==="view") {

			Mousetrap.unbind('esc');
			$("#button_back, a#next, a#previous").remove();

			lychee.publicMode = true;
			lychee.viewMode = true;

		}

	},

	animate: function(obj, animation) {

		var animations = [
			["fadeIn", "fadeOut"],
			["contentZoomIn", "contentZoomOut"]
		];

		if (!obj.jQuery) obj = $(obj);

		for (var i = 0; i < animations.length; i++) {
			for (var x = 0; x < animations[i].length; x++) {
				if (animations[i][x]==animation) {
					obj.removeClass(animations[i][0] + " " + animations[i][1]).addClass(animation);
					return true;
				}
			}
		}

		return false;

	},

	loadDropbox: function(callback) {

		if (!lychee.dropbox) {

			loadingBar.show();

			var g = document.createElement("script"),
				s = document.getElementsByTagName("script")[0];

			g.src = "https://www.dropbox.com/static/api/1/dropins.js";
			g.id = "dropboxjs";
			g.type = "text/javascript";
			g.async = "true";
			g.setAttribute("data-app-key", "iq7lioj9wu0ieqs");
			g.onload = g.onreadystatechange = function() {
				var rs = this.readyState;
				if (rs&&rs!=="complete"&&rs!=="loaded") return;
				lychee.dropbox = true;
				loadingBar.hide();
				callback();
			};
			s.parentNode.insertBefore(g, s);

		} else callback();

	},

	error: function(errorThrown, params, data) {

		console.log("Error Description: " + errorThrown);
		console.log("Error Params: " + params);
		console.log("Server Response: " + data);
		loadingBar.show("error", errorThrown);

	}

}