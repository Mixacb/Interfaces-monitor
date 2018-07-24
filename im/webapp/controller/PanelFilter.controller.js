sap.ui.define([
	"s/im/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, MessageToast, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("s.im.controller.PanelFilter", {
		onBeforeRendering: function () {
			var oModel = this.getView().getModel("SelectedFilters");
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-dd"
			});
			var currentDate = oDateFormat.format(new Date());
			oModel.setProperty("/DateStart", currentDate);
			oModel.setProperty("/DateEnd", currentDate);
			oModel.setProperty("/TimeStart", "00:00");
			oModel.setProperty("/TimeEnd", "23:59");
		},

		onSearch: function (oSource, oEvent) {

			var FilterArray = [];
			var oModel = this.getView().getModel("SelectedFilters");
			var SelectedInterfaces = oModel.getProperty("/SelectedInterfaces"),
				Type = oModel.getProperty("/SelectedItemKey"),
				DescriptionText = oModel.getProperty("/DescriptionText"),
				SelectedSystems = oModel.getProperty("/SelectedSystems"),
				SelectedExecutionStates = oModel.getProperty("/SelectedExecutionStates"),
				DateStart = oModel.getProperty("/DateStart"),
				DateEnd = oModel.getProperty("/DateEnd"),
				TimeStart = [],
				TimeEnd = [];
			TimeStart[0] = oModel.getProperty("/TimeStart") ? oModel.getProperty("/TimeStart").slice(0, 2) : null;
			TimeStart[1] = oModel.getProperty("/TimeStart") ? oModel.getProperty("/TimeStart").slice(3, 5) : null;
			TimeEnd[0] = oModel.getProperty("/TimeEnd") ? oModel.getProperty("/TimeEnd").slice(0, 2) : null;
			TimeEnd[1] = oModel.getProperty("/TimeEnd") ? oModel.getProperty("/TimeEnd").slice(3, 5) : null;

			var TimeSt = TimeSt ? "PT" + TimeStart[0] + "H" + TimeStart[1] + 'M00S' : null;
			var TimeEn = TimeEn ? "PT" + TimeEnd[0] + "H" + TimeEnd[1] + 'M00S' : null;

			var filterPathes = ["Intty", "Intid", "Inttx", "Syssr", "Systr", "Exdat", "Extim",
				"State"
			];


			if (Type === "Outbound") {
				FilterArray.push(new Filter("Intty", FilterOperator.EQ, "O"));
				if (SelectedSystems[0]) {
					SelectedSystems.forEach(function (item) {
						FilterArray.push(new Filter("Systr", FilterOperator.EQ, item));
					});
				}

			} else {
				FilterArray.push(new Filter("Intty", FilterOperator.EQ, "I"));
				if (SelectedSystems[0]) {
					SelectedSystems.forEach(function (item) {
						FilterArray.push(new Filter("Syssr", FilterOperator.EQ, item));
					});
				}
			}

			if (SelectedInterfaces[0]) {
				SelectedInterfaces.forEach(function (item) {
					FilterArray.push(new Filter("Intid", FilterOperator.EQ, item));
				});
			}

			if (DescriptionText) {
				FilterArray.push(new Filter("Inttx", FilterOperator.Contains, DescriptionText));
			}

			if (DateStart || DateEnd) {
				if (DateStart && DateEnd) {
					FilterArray.push(new Filter("Exdat", FilterOperator.BT, DateStart, DateEnd));
				}
				if (DateStart) {
					FilterArray.push(new Filter("Exdat", FilterOperator.GT, DateStart));
				}
				if (DateEnd) {
					FilterArray.push(new Filter("Exdat", FilterOperator.LT, DateEnd));
				}

			}

			if (TimeSt || TimeEn) {
				if (TimeSt && TimeEn) {
					FilterArray.push(new Filter("Extim", FilterOperator.BT, TimeSt, TimeEn));
				}
				if (TimeSt) {
					FilterArray.push(new Filter("Extim", FilterOperator.GT, TimeSt));
				}
				if (TimeEn) {
					FilterArray.push(new Filter("Extim", FilterOperator.LT, TimeEn));
				}

			}

			if (SelectedExecutionStates[0]) {
				SelectedExecutionStates.forEach(function (item) {
					FilterArray.push(new Filter("State", FilterOperator.EQ, item));
				});

			}

			sap.ui.getCore().getEventBus().publish("onSearch", FilterArray); 
		}

	});

});