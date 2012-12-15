var manifest = {
  settings: [{name: "zoomFactor", type: "member", label: "Zoom Factor", set :  [2, 3, 4, 5, 6, 7, 8], default: 2}]
};

jetpack.future.import("menu");
jetpack.future.import("storage.settings");

var ctx = null;
var container = null;
var width = 100;
var height = 100;

function onMouseMove(event) {
  container.css({left: event.pageX + 'px', top: event.pageY + 'px'});
  container.hide(); // hide lens otherwise its content is drawn, too
  ctx.drawWindow(jetpack.tabs.focused.contentWindow, event.pageX, event.pageY, width, height, "white");
  container.show();
}

function turnOff() {
  container = $("#dafizillaMGContainer", jetpack.tabs.focused.contentDocument);
  if (container.length && container.css("display") != "none") {
    jetpack.tabs.focused.contentWindow.removeEventListener("mousemove", onMouseMove, false);
    container.hide();
    ctx.restore();
  }
}

jetpack.tabs.onFocus(function() {
  turnOff();
});

jetpack.menu.tools.add(function(target)({
  label : "Show Magnifying Glass",
  command : function(menuitem) {
    var doc = jetpack.tabs.focused.contentDocument;
    container = $("#dafizillaMGContainer", doc);
    if (container.length == 0) {
      $($(doc).find("body").get(0))
	.append('<div id="dafizillaMGContainer" style="display:none;width:' + width + 'px; height:' + height + 'px; -moz-border-radius: 5px !important; position: absolute; z-index: 3000; border: 1px solid #111; background-color: #eee; padding: 5px;">'
		+ '<canvas id="dafizillaMGCanvas" width="'+ width + 'px" height="' + height + 'px"/><br/><p style="font-size: 8px !important; background-color:#eee !important; width:100%; color: #000 !important; text-align: center !important">Click to hide</p></div>');
      container = $("#dafizillaMGContainer", doc);
    }
    container.show();
    container.bind("click", function(event) {
      turnOff();
    });
    ctx = doc.getElementById("dafizillaMGCanvas").getContext("2d");
    ctx.save();
    jetpack.future.import("storage.settings"); // ensure latest set value is retrieved
    var zoomFactor = jetpack.storage.settings.zoomFactor;
    ctx.scale(zoomFactor, zoomFactor);
    jetpack.tabs.focused.contentWindow.addEventListener("mousemove", onMouseMove, false);
    jetpack.tabs.focused.contentWindow.addEventListener("blur", function(event) {turnOff();}, false);
  }
  })
);