/*******************************************************************************
 * @license
 * Copyright (c) 2013 VMware, Inc. All Rights Reserved.
 * THIS FILE IS PROVIDED UNDER THE TERMS OF THE ECLIPSE PUBLIC LICENSE
 * ("AGREEMENT"). ANY USE, REPRODUCTION OR DISTRIBUTION OF THIS FILE
 * CONSTITUTES RECIPIENTS ACCEPTANCE OF THE AGREEMENT.
 * You can obtain a current copy of the Eclipse Public License from
 * http://www.opensource.org/licenses/eclipse-1.0.php
 *
 * Contributors:
 *     Andrew Eisenberg
 *     Brian Cavalier
 ******************************************************************************/
/*jslint browser:true */
/*global onmessage define console */

define(function() {
	var handler;
	// handle situations where console is not defined,
	// eg- in a webworker
	if (typeof console === "undefined") {
		var delegate;
		if (typeof status === "function") {
			delegate = status;
		} else if (typeof onmessage === "function") {
			delegate = onmessage;
		} else {
			// logging is a no-op
			delegate = function() {};
		}
		handler = {
			info : delegate,
			debug : delegate,
			warn : delegate,
			error : delegate
		};
	} else {
		handler = console;
	}
	/**
	 * Set to false to disable a category
	 *
	 * Logger categories.  Change to false to disable
	 * To use, include a parameter when calling the scriptedLogger function
	 * The OTHER category is for messages that have no explicit category and
	 * The ALL category disables all messages.
	 * You may add new categories as necessary
	 */
	var scriptedLoggerCategories = {
		ALL : true,
		OTHER : true,
		INDEXER : false,
		CONTENT_ASSIST : true,
		EXPLORER_TABLE : true,
		SETUP : true,
		PANE : true,
		STORAGE : true
	};

	/**
	 * false means that the message kind will not be displayed
	 */
	var scriptedLogger = {
		SHOW_CALLER : false,
		INFO : true,
		DEBUG : true,
		WARN : true,
		ERROR : true,  // I don't know why we'd want to disable error handling, but I'll keep it here
		info : function(msg, category) {
			if (this.INFO && this.isEnabled(category)) {
				msg = this.SHOW_CALLER ? msg + " --- " + this.info.caller : msg;
				handler.info(msg);
			}
		},
		debug : function(msg, category) {
			if (this.DEBUG && this.isEnabled(category)) {
				msg = this.SHOW_CALLER ? msg + " --- " + this.debug.caller : msg;
				handler.debug(msg);
			}
		},
		warn : function(msg, category) {
			if (this.WARN && this.isEnabled(category)) {
				msg = this.SHOW_CALLER ? msg + " --- " + this.warn.caller : msg;
				handler.warn(msg);
			}
		},
		error : function(msg, category) {
			if (this.ERROR && this.isEnabled(category)) {
				msg = this.SHOW_CALLER ? msg + " --- " + this.error.caller : msg;
				handler.error(msg);
			}
		},

		// A message is
		isEnabled : function(catName) {
			if (!scriptedLoggerCategories.ALL) {
				return false;
			}
			return !catName || scriptedLoggerCategories[catName] === undefined ?
				scriptedLoggerCategories.OTHER :
				scriptedLoggerCategories[catName];
		}
	};
	return scriptedLogger;
});
