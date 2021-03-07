import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Client, Room } from 'colyseus.js';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AlertService } from 'src/app/_alert';

const TO_MUCH_TIME:number=3125;

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private _room:Room;
  private _client:Client;
  private _serverMsg:any; 
  private _players:Array<string>;
  private _myId:string;
  private _messages:Subject<any>=new BehaviorSubject<any>([]);


  constructor(private router:Router,private alert_service: AlertService ) { }

  public get room() : Room  {  return this._room;  }

  public get myId() : string {  return this._myId;  }

  public get players() : string[] { return this._players;}

  public get messages() { 
      return this._messages.asObservable();
  }


  
  public createClient() : void
  {
    this._client=new Client('ws://localhost:3000');
  }

  public async joinOrCreate(options?:any): Promise<Room>//i.e for options {players:5,AI:3}=> 5 players -> 3 of them are AI
  {
    try{
      if(typeof options==="undefined")
        await this.joinRoom();
      else{
        this.checkOptions(options);
        this._room=await this._client.create("cabo_room",options);
      }
      this.loadMassages();
      this._myId=this._room.sessionId;
      return this._room;
    }catch(error){
      switch(error){
        case 0:
          this.alert_service.error("There are no avilable room",{});
          break;
        default:
          this.alert_service.error("Cannot access the server.");
          break;
      }
      this.router.navigate( ['/*'],);
      return null;
    }
  }

  private async joinRoom(){
    if(await this.checkAvailableRoom())
      this._room=await this._client.join("cabo_room");
    else{
      throw 0;
    }
  }

  private async checkAvailableRoom():Promise<boolean>{
    let rooms=await this._client.getAvailableRooms("cabo_room");
    if(rooms.length>0)
      return true;
    else
      return false;
  }

  private checkOptions(options:any){
    if(isNaN(options.players) || isNaN(options.AI) || options.players>5 || options.players<=0)
      throw "problem with the room options";
  }

  private async loadMassages()
  {
    this.room.onMessage("drawn-card",(card)=>{this._serverMsg=card;});

    this.room.onMessage("get-card",(card)=>{this._serverMsg=card;});

    this.room.onMessage("players", (players:Array<string>)=>this._players=players);

    this.room.onMessage("chat-message",(message)=>this._messages.subscribe((messages)=>messages.push(message)));
  }

  public async nextTurn(){
    this._serverMsg=undefined;
    this.room.send("nextTurn", {});
  }

  private async waitForServerMessage(timeout,resolve,reject){
    setTimeout(() => {
      if(typeof this._serverMsg !== "undefined"){
        resolve(this._serverMsg)
      }
      else{
        if(timeout>TO_MUCH_TIME)
          reject('problem with the server')
        this.waitForServerMessage(timeout*5,resolve,reject);
      }
    }, timeout);
  }

  public async drawCard():Promise<string>{
    this.room.send("draw-card",{});
    return new Promise((resolve,reject)=>{
      this.waitForServerMessage(5,resolve,reject);
    });
  }

  public async discardCard(cardPath:string){
    this.room.send("to_discard",{card:cardPath});
  }

  public async getOpponentCard(playerId:string,cardIndex:number){
    this.room.send("get-card",{player:playerId,index:cardIndex});
    return new Promise((resolve,reject)=>this.waitForServerMessage(5,resolve,reject));
  }

  public async getMyCard(cardIndex:number)
  {
    this.room.send("get-card",{player:this._myId,index:cardIndex});
    return new Promise((resolve,reject)=> this.waitForServerMessage(5,resolve,reject));
  }

  public sendChatMessage(message){
    this._room.send("chat-message",message);
  }


}
