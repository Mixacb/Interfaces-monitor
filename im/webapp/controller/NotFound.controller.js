sap.ui.define([
		"s/im/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("s.im.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);