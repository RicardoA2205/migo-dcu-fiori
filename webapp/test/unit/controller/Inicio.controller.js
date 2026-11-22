/*global QUnit*/

sap.ui.define([
	"pe/pucp/tesis/migodcu/controller/Inicio.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Inicio Controller");

	QUnit.test("I should test the Inicio controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
