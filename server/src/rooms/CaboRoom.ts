import { Room, Client } from "colyseus";
import { Card } from "../../lib/Card";
import { Player } from "../../lib/Player";
import { CaboState } from "./State/CaboState";

export class CaboRoom extends Room {
  private currentTurnIndex:number;
  private turns:number=0;
  constructor(){
    super();
  }
  onCreate(options: any) {
    this.setState(new CaboState(options.AI));
    this.maxClients = options.players - options.AI;
    //TODO: adds the AI players
    this.loadMassageListener();

  }

  onJoin(client: Client, options: any) {
    this.state.players.set((this.state.num_of_players++).toString(), new Player(client));
    console.log(client.id + " joined successfully to "+this.roomId);
    if (!this.gameStart())
      return;
    this.lock();
    this.initGame();

  }

  onLeave(client: Client, consented: boolean) {
  }

  onDispose() {
  }

  private async loadMassageListener() {

    this.onMessage("nextTurn",(client, message) => {
      if(this.turns<4){
        this.currentTurnIndex=((this.currentTurnIndex+1)%this.state.num_of_players);
        this.initPlayerTurn();
      }
      else{
        console.log("GameOver");
        this.broadcast("GameOver",{});
        //this.logDiscardPile();
      }
    });

    this.onMessage("to_discard",(client, message) => {
      this.state.discard_pile.push(message.card);
      console.log(message.card+" added to discard pile");
    });

    this.onMessage("draw-card",(client,message)=>{
      if(this.getCurrentTurnId()==client.sessionId){
        let img=this.state.pack.draw().image;
        console.log(client.sessionId+" draw "+ img); 
        client.send("drawn-card",img);
      }
      else
        client.send("drawn-card","!");
    });

    this.onMessage("get-card",(client,message)=>{
      let player:Player=<Player>Array.from(this.state.players.values()).find((player:any)=>{return player.client.sessionId==message.player;});
      if(typeof player==="undefined")
        throw message.player +" is not a player in this game";
      let card=player.getCard(message.index);
      client.send("get-card",card.image);
    });

  }

  // private getClientById(id:string) :Client{
  //   let playersArray=Array.from(this.state.players.values()).map((player:any)=>player=player.client);
  //   console.log(playersArray)
  //   if(playersArray.includes())

    
  // }

  private logDiscardPile() {
    let str = "[";
    this.state.discard_pile.forEach((card: Card) => { str += " " + card; });
    str += "]";
    console.log(str);
  }

  private gameStart() {
    return this.clients.length == this.maxClients;
  }

  private initGame() {
    console.log("Start of the Game state:")
    for (let i = 0; i < 4; i++) {
      for (let player of this.state.players.values()) {
        player.addCard(this.state.pack.draw());
      }
    }

    for (let player of this.state.players.values()) {
      console.log(player+"")
    }
    this.sendPlayers()
    this.currentTurnIndex=this.getRandomInt(this.state.num_of_players);//Randomly chose the first player
    this.initPlayerTurn();
  }

  private initPlayerTurn(){
    this.turns++;
    this.state.currentTurn=this.getCurrentTurnId();
    console.log("turns: "+this.turns+" player: "+this.state.currentTurn);
    this.state.players.get(this.currentTurnIndex.toString()).client.send("my-turn",);
  }

  private sendPlayers()
  {
    let playersId=Array.from(this.state.players.values())//.map((player:any)=>{player.client.sessionId;});
    playersId=playersId.map((value:any)=>value.client.sessionId);
    for(let player of this.state.players.values()){
      player.client.send("players",playersId);
      let val=playersId.shift();
      playersId.push(val);
    }
  }

  private getCurrentTurnId(): any {
    return this.state.players.get(this.currentTurnIndex.toString()).client.id;
  }

  private getRandomInt(max:number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
