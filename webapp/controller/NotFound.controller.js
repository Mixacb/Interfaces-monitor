sap.ui.define([
		"s/Interfaces-monitor/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("s.Interfaces-monitor.controller.NotFound", {

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