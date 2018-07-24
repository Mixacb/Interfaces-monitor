/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"s/im/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"s/im/test/integration/pages/Worklist",
	"s/im/test/integration/pages/Object",
	"s/im/test/integration/pages/NotFound",
	"s/im/test/integration/pages/Browser",
	"s/im/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "s.im.view."
	});

	sap.ui.require([
		"s/im/test/integration/WorklistJourney",
		"s/im/test/integration/ObjectJourney",
		"s/im/test/integration/NavigationJourney",
		"s/im/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});