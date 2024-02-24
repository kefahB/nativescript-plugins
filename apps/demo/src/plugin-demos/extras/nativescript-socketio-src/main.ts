// import {SocketIO} from "@triniwiz/nativescript-socketio";
import { Frame, fromObject, NavigatedData, ObservableArray, Page } from '@nativescript/core';

let socketIO: any; //SocketIO;
let page: Page,
	context,
	fnOff,
	pageData: any = fromObject({
		list: new ObservableArray(),
		textMessage: '',
		currentUser: '',
	});

function setupSocketIO() {
	socketIO = new SocketIO(null, null, context.socket);

	socketIO.on('new message', function (data) {
		pageData.list.push(data);
		console.log(JSON.stringify(data));
	});

	fnOff = socketIO.on('new message', function (data) {
		alert(data.message);
	});

	socketIO.on('disconnect', function () {
		// pageData.list.push.length = 0;
		Frame.topmost().navigate(`~/plugin-demos/extras/nativescript-socketio`);
	});

	socketIO.on('getMessages', function (data) {
		if (data.length > 0) {
			if (pageData.list.length !== data.length) {
				let messages = data;
				for (let i = 0; i < messages.length; i++) {
					pageData.list.push(messages[i]);
				}
			}
			console.log(JSON.stringify(data));
		}
	});
	socketIO.emit('getMessages');
}

export function pageLoaded(args: NavigatedData) {
	page = <Page>args.object;
	context = page.navigationContext;
	pageData.set('currentUser', context.username);

	page.bindingContext = pageData;
	// setupSocketIO();
}

export function sendText() {
	let data = {
		username: context.username,
		message: pageData.get('textMessage'),
		timeStamp: +new Date(),
	};

	if (socketIO) {
		socketIO.emit('new message', data, (wasReceived) => {
			if (wasReceived) {
				console.log('ack executed');
				console.log(JSON.stringify(data));
				pageData.list.push(data);
				pageData.set('textMessage', '');
			}
		});
	}
}

export function logOut(args) {
	if (socketIO) {
		socketIO.disconnect();
	}
}

export function mute() {
	if (fnOff) {
		fnOff();
	}
}
