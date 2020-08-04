import { Injectable, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import * as io from 'socket.io-client';
import { UserData } from '../models/user.model';
import { HttpErrorHandler } from '../utils/http-error-handler.model';
import { SocketService } from './socket.service';
import { Rules } from '../models/rules.model';
import { Subscription } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
    providedIn: 'root',
})

export class ChatService extends HttpErrorHandler implements OnDestroy {

    private user: UserData;
    private _code: string;
    private _roomName: string;

    // TODO url kada se deployuje na heroku treba biti prazan string, ovo se mora uraditi programaticno a ne ovako
    // private url = '';

    private url = 'http://localhost:3000';
    private subscriptions: Subscription[] = [];

    constructor(private socketService: SocketService, private http: HttpClient, router: Router) {
        super(router);
        this.user = new UserData('', 0, '', '', false);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }


    public joinToRoom(code: string): void {
        this._code = code;
        this.socketService.socket.emit('joinGame', {code: code, username: this.username});
    }

    public createNewRoomRequest(roomName: string): void {
        this.adminPermission = true;
        this.http.post<string>(this.socketService.url + '/createRoom', {name: roomName})
                 .pipe(catchError(super.handleError()))
                 .subscribe((code: string) => {
                    window.alert(code);
                    this._code = code;
                    this.socketService.socket.emit('joinGame', {code: code , username: this.username});
                });
    }

    public sendMessage(message) {
        this.user.message = message;
        this.socketService.socket.emit('new-message', {
            message: `${this.user.name}: ${this.user.message}`,
            color: this.user.color
        });
    }

    public getMessages(): Observable<any> {
        return new Observable((observer) => {
            this.socketService.socket.on('message', ({message, color}) => {
                observer.next({message, color});
            });
        });
    }

    getRoomName(): Observable<string> {

        return this.http.get<string>(this.url + '/getName/' + this._code);
    }

    public sendRules(data): void {
        console.log({id: this._code, ...data});
        let sub: Subscription;
        sub = this.http.patch<Rules>(this.url + '/sendRules', {id: this._code, ...data})
            .pipe(catchError(super.handleError))
            .subscribe((data: Rules) => {
                console.log(data);
            });
        this.subscriptions.push(sub);
    }


    public getPlayers(): Observable<Player[]> {
        console.debug('getPlayers');
        return this.http.get<Player[]>(this.url + '/getPlayers/' + this._code);  
    }

    get code(): string {
        return this._code;
    }

    get roomName(): string {
        return this._roomName;
    }

    get adminPermission(): boolean {
        return this.user.isAdmin;
    }

    get userColor() {
        return this.user.color;
    }

    get username() {
        return this.user.name;
    }

    set roomName(value: string) {
        this._roomName = value;
    }

    set code(value: string) {
        this._code = value;
    }

    set username(username: string) {
        this.user.name = username;
    }

    set adminPermission(newValue: boolean) {
        this.user.isAdmin = newValue;
    }

  

}
