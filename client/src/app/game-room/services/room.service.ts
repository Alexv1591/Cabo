import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Client, Room } from 'colyseus.js';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { AlertService } from 'src/app/_alert';

const TO_MUCH_TIME:number=3125;

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private _room:Room;
  private _client:Client;
  private _serverMsg:any; 
  private _initialData:any;
  private _myId:string;
  private _messages:Subject<any>=new BehaviorSubject<any>([]);


  constructor(private router:Router,private alert_service: AlertService ) { }

  public get room() : Room  {  return this._room;  }

  public get myId() : string {  return this._myId;  }

  public get players() : string[] { return this._initialData.ids;}

  public get first2cards() : string[] { return this._initialData.cards;}

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

    this.room.onMessage("init-game", (dat:any)=>{this._initialData=dat});

    this.room.onMessage("chat-message",(message)=>this._messages.subscribe((messages)=>messages.push(message)));

    this.room.onMessage("my-end-point",(message)=>console.log(message));

    this.room.onMessage("winner",(message)=>console.log("winner:"+message.winner+" points:"+message.points));

    this.room.onMessage("you-win",(message)=>console.log("I WIN!"));
  }

  public async playerReady()
  {
    this.room.send("ready",);
  }

  public async cabo(){
    this.room.send("cabo",);
  }

  public async nextTurn(){
    this._serverMsg=undefined;
    setTimeout(() => {
      this.room.send("nextTurn", {});
    }, 600);
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

  public async getCard(cardIndex:number,playerId?:string){
    if(typeof playerId==="undefined")
      playerId=this.myId;
    this.room.send("get-card",{player:playerId,index:cardIndex});
    return new Promise((resolve,reject)=>this.waitForServerMessage(5,resolve,reject));
  }

  public takeFromDeck(handIndex:number, imgPath: string)
  {
    this.room.send("take-from-deck",{ card : imgPath, index : handIndex });
  }

  public async takeFromDiscard(handIndex:number){
    this.room.send("take-from-discard",{ index : handIndex});
  }

  public swapTwoCards(message:string)
  {
    let players:any=message.split(" ");
    players = players.map((player)=>player.split(":"));
    this.room.send("swap-two-cards",{players:[players[0][0],players[1][0]],cards:[parseInt(players[0][1]),parseInt(players[1][1])]});
  }

  public sendChatMessage(message){
    this._room.send("chat-message",message);
  }


}
