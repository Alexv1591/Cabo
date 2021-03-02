import { Injectable } from '@angular/core';
import { Client, Room } from 'colyseus.js';

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


  constructor() { }

  public get room() : Room  {  return this._room;  }

  public get myId() : string {  return this._myId;  }

  public get players() : string[] { return this._players;}
  

  public createClient() : void
  {
    this._client=new Client('ws://localhost:3000');
  }

  public async joinOrCreate(options?:any): Promise<Room>//i.e for options {players:5,AI:3}=> 5 players -> 3 of them are AI
  {
    console.log(options);
    try{
      if(typeof options==="undefined")
        this._room=await this._client.join("cabo_room");//TODO: CHANGE TO this._client.join("Cabo_room")
      else{
        this.checkOptions(options);
        this._room=await this._client.create("cabo_room",options);
      }
      this.loadMassages();
      this._myId=this._room.sessionId;
      return this._room;
    }catch(error){
      throw error+" Something bad happened while we were trying to create a room." ;
    }
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

  public async drawCard(){
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


}
