import { Player } from "./Player";
import { Client } from "colyseus";

export class UserPlayer extends Player{
    constructor(private _serverClient:Client){
        super();
        super._id=_serverClient.sessionId;
    }

    public get client(){
        return this._serverClient;
    }

}