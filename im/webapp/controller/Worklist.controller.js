/*global location history */ //="{path:'/Executions(Intid='{Intid}',Exeid='{Exeid}')/ToMessages/Msgty',formatter:.formatter.typeOfIcon}"
sap.ui.define([
	"s/im/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/core/Fragment',
	'sap/m/MessageItem',
	'sap/m/MessagePopover',
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Fragment, MessageItem, MessagePopover) {
	"use strict";

	return BaseController.extend("s.im.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("onSearch", this._applySearch, this);//подписываемся на событие onSearch, вызывая _applySearch с объектом, который будет оповещён о событии
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");
				

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},
		onAfterRendering: function () {
			var oTable = this.byId("table");
			var oBinding = oTable.getBinding("items");
			oBinding.attachDataReceived(this.setCountExecutionsItems, this);
				var currentDate=new Date();
			var FilterArray=[
			new Filter("Extim", FilterOperator.BT, "PT00H00M00S", "PT23H59M00S"), 
			new Filter("Exdat", FilterOperator.BT, currentDate, currentDate),
			new Filter("Intty", FilterOperator.EQ, "I")
			];
			sap.ui.getCore().getEventBus().publish("onSearch", FilterArray);
		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function () {
			history.go(-1);
		},

		onOpenDialog: function (oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("NextExecution");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "s.im.view.NextExecutionDialog", this);
				oView.addDependent(oDialog);
			}

			oDialog.setBindingContext(oEvent.getSource().getBindingContext());//устанавливаем контекст, взятый с текущей строки, на которую нажали
			oDialog.open();

		},

		onCancelDialog: function () {
			this.getView().byId("NextExecution").close();
		},

		handlePopoverPress: function (oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("s.im.view.popover", this);//creating popover
				this.getView().addDependent(this._oPopover);
			}

			var Intid = oEvent.getSource().getBindingContext().getObject().Intid;
			var Exeid = oEvent.getSource().getBindingContext().getObject().Exeid;

			var oMessageTemplate = new MessageItem({
				type: {
					path: "Msgty",
					formatter: formatter.typeOfPopover
				},
				title: "{Msgtx}"

			});

			function pressedbtn(src) {

				var obj = src.getBindingContext().getObject();//объект привязанной модели
				switch (src.data("id")) {//доступ к айди иконки
				case "0":
					return obj.Exha1;//поля объекта модели
				case "1":
					return obj.Exha2;
				case "2":
					return obj.Exha3;
				case "3":
					return obj.Exha4;
				default:
					return src.data("id");
				}
			}

			this._oPopover.bindAggregation("items", {//привязка аггрегации айтемс к поповеру
				path: "/Executions(Intid='" + Intid + "',Exeid='" + Exeid + "')/ToMessages",//сообщения текущей строки в таблице
				template: oMessageTemplate,//шаблон для айтемс
				filters: [new Filter({//пропускает только значения, совпадающие с номером кнопки
					path: "Exhan",
					operator: FilterOperator.EQ,
					value1: pressedbtn(oEvent.getSource())//куда была нажата кнопка 
				})]
			});

			this._oPopover.toggle(oEvent.getSource());//открыть поповер в месте, куда нажата кнопка
		},

	
		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Exeid")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		

		setCountExecutionsItems: function (oEvent) {
			var counts = oEvent.getParameters().data.results.length; //получить данные и привязать в модель
			var oModel = this.getView().getModel("SelectedFilters");
			oModel.setProperty("/countExecutionsItems", counts);
		},
		
		_applySearch: function (sChannel,sEvent,aTableSearchState) {
			var oTable = this.byId("table");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			var	oViewModel = this.getModel("worklistView");
			
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		}

	});
});