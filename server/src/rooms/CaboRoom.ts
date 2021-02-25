import { Room, Client } from "colyseus";
import { Card } from "../../lib/Card";
import { Player } from "../../lib/Player";
import { CaboState } from "./State/CaboState";

export class CaboRoom extends Room {

  private turns:number=0;
  onCreate(options: any) {
    this.setState(new CaboState(options.AI));
    this.maxClients = options.players - options.AI;
    //TODO: adds the AI players
    this.loadMassageListener();

  }

  onJoin(client: Client, options: any) {
    this.state.players.set((this.state.numOfPlayers++).toString(), new Player(client));
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

  private loadMassageListener() {

    this.onMessage("type", (client, message) => {
      console.log(client.id+" "+message)
    });

    this.onMessage("nextTurn",(client, message) => {
      if(this.turns>=4){
        this.broadcast("GameOver",{});
        this.logDiscardPile();
      }
      else{
        this.state.currentTurn=((parseInt(this.state.currentTurn)+1)%this.state.numOfPlayers).toString();
        this.notifyCurrentPlayer();
      }
    });

    this.onMessage("draw-card",(client, card:string)=>{
      card=this.state.pack.draw().toString();
      console.log(client.id+" draw " +card);
    });

    this.onMessage("to_discard",(client, card) => {
      console.log(card+" added to discard pile");
      this.state.discard_pile.push(card);
    });

  }

  private logDiscardPile() {
    let str = "[";
    this.state.discard_pile.forEach((card: Card) => { str += " " + card; });
    str += "]";
    console.log(str);
  }

  private notifyCurrentPlayer(){
    console.log("turns:" +this.turns+" next trun "+this.state.currentTurn);
    this.state.players.get(this.state.currentTurn).client.send("my-turn",{});
    this.turns++;
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

    this.state.currentTurn=this.getRandomInt(this.state.numOfPlayers).toString();
    this.notifyCurrentPlayer();
  }

  private getRandomInt(max:number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
