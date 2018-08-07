import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { Socket } from 'ng-socket-io';
import {Subject} from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
	code:any  = "Please copy your javascript code";

	constructor(
		private socket: Socket
	){
		this.listener();
	}
	
	listener(){
		this.socket
            .fromEvent("updateCode")
             .subscribe(
				data => {
            		this.code = data;
            	});

	}

	updateClients(){
		this.socket.emit("changeCode", this.code);
	}
}
