import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { Client, Room } from 'colyseus.js';

const TO_MUCH_TIME:number=3125;

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private _room:Room;
  private _client:Client;
  private serverMsg:any; 
  public players:Array<String>;


  constructor() { }

  public get room() : Room {
    return this._room;
  }
  

  public createClient() : void
  {
    this._client=new Client('ws://localhost:3000');
  }
  public async joinRoom():Promise<Room>{
    try {
      this._room= await this._client.joinOrCreate("cabo_room", {players:2,AI:0});
      console.log(this.room.sessionId+" joined successfully to "+this.room.id);
      this.loadMassages();
      return this.room;
    } catch (e) {
      throw "Something bad happened while we were trying to create a room." ;
    }
  }
  public async createRoom(options:any):Promise<Room>{
    try {
      this._room = await this._client.create("cabo_room", options);
      this.loadMassages();
      return this.room;
    } catch (e) {
      throw "Something bad happened while we were trying to create a room." ;
    }
  }

  private async loadMassages()
  {
    this.room.onMessage("drawn-card",(card)=>{this.serverMsg=card;});

    this.room.onMessage("get-card",(card)=>{this.serverMsg=card;});

    this.room.onMessage("players", (players:Array<string>)=>this.players=players);
  }

  public async nextTurn(){
    this.serverMsg=undefined;
    this.room.send("nextTurn", {});
  }

  private async waitForServerMessage(timeout,resolve,reject){
    setTimeout(() => {
      if(typeof this.serverMsg !== "undefined"){
        resolve(this.serverMsg)
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
      this.waitForServerMessage(5,resolve,rejects);
    });
  }

  public async discardCard(cardPath:string){
    this.room.send("to_discard",{card:cardPath});
  }

  //public async


}
