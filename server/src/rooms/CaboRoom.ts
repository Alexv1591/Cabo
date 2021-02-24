import { Room, Client } from "colyseus";
import { Player } from "../../lib/Player";
import { CaboState } from "./State/CaboState";

export class CaboRoom extends Room {

  //private turns:number=0;
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

  private loadMassageListener()
  {
    this.onMessage("type", (client, message) => {
      console.log(client.id+" "+message)
    });

    // this.onMessage("nextTurn",(client, message) => {
    //   if(this.turns>4)
    //     this.broadcast("GameOver",{});
    //   else{
    //     this.turns++;
    //     this.state.currentTurn=(this.state.currentTurn+1)%this.state.numOfPlayers;
    //     this.state.players.get(this.state.currentTurn.toString()).client.send("my-turn",{});
    //   }
    // });
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
  }

  private getRandomInt(max:number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
