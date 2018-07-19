sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		FrequencyText: function (frqc) {
			switch (frqc) {
			case "D":
				return "Daily";
			case "M":
				return "Many times a day";
			case "W":
				return "Weekly";
			default:
				return frqc;
			}
		},
		Time: function (time) {
			var H = Math.floor((time.ms / 1000) / 3600);
			var M = Math.floor(((time.ms / 1000) % 3600) / 60);
			var S = Math.floor((((time.ms / 1000) % 3600) % 60));
			if (String(H).length === 1) {
				H = '0' + H;
			}
			if (String(M).length === 1) {
				M = '0' + M;
			}
			if (String(S).length === 1) {
				S = '0' + S;
			}
			return H + ':' + M + ':' + S;

		},
		Date: function (date) {
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				pattern: "dd.MM.yyyy"
			});
			return oDateFormat.format(date);
		},
		typeOfPopover: function (state) {
			switch (state) {
			case "E":
				return sap.ui.core.MessageType.Error;
			case "I":
				return sap.ui.core.MessageType.Information;
			case "S":
				return sap.ui.core.MessageType.Success;
			case "W":
				return sap.ui.core.MessageType.Warning;
			case "N":
				return sap.ui.core.MessageType.None;
			default:
				return state;
			}
		},
		typeOfIcon: function (state) {
			switch (state) {
			case "E":
				return "sap-icon://message-error";
			case "I":
				return "sap-icon://message-information";
			case "S":
				return "sap-icon://message-success";
			case "W":
				return "sap-icon://message-warning";
			case "N":
				return "";
			default:
				return state;
			}
		},
		colorOfIcon: function (state) {
			switch (state) {
			case "E":
				return "red";
			case "I":
				return "grey";
			case "S":
				return "green";
			case "W":
				return "orange";
			case "N":
				return "";
			default:
				return state;
			}
		}

	};

});