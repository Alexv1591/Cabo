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
    this.state.players.push(new Player(client));
    this.state.num_of_players++;
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
      console.log(message.card+" added to discard pile");//debug
    });

    this.onMessage("draw-card",(client,message)=>{
      if(this.getCurrentTurnId()==client.sessionId){
        let card=this.state.pack.draw()
        console.log(client.sessionId+" draw "+ card); 
        client.send("drawn-card",card.image);
      }
      else
        client.send("drawn-card","!");
    });

    this.onMessage("get-card",(client,message)=>{
      let player:Player=this.getPlayerById(message.player);
      let card=player.getCard(message.index);
      client.send("get-card",card.image);
    });

    this.onMessage("swap-with-deck",(client,message)=>{
      let player:Player=this.getPlayerById(client.sessionId);
      let card=player.swapCard(Card.CardFromPathFactory(message.card),message.index);
      this.state.discard_pile.push(card.image);
      console.log(client.sessionId+" swap the card in index " + message.index);//debug
      console.log(card.toString()+" added to discard pile");//debug
    });

    this.onMessage("swap-two-cards",(client,message)=>
    { //message template => {players:[**player1 id**,**player2 id**],cards:[**card index for player1**,**card index for player2**]}
      let players=message.players.map((value:any)=>this.getPlayerById(value));
      let indexes=message.cards;
      //swap cards
      let card=players[0].swapCard(players[1].getCard(indexes[1]),indexes[0]);
      players[1].swapCard(card,indexes[1]);
    });

    this.onMessage("chat-message",(client,message)=>{
      this.broadcast("chat-message",{player:client.sessionId,message:message});
    });

  }

  private getPlayerById(id:string){
    let player=this.state.players.find((player:any)=>{ return id===player.client.sessionId;});
    if(typeof player==="undefined")
      throw id +" is not a player in this game";
    return player;
  }

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

    for (let player of this.state.players) {
      console.log(player+"")
    }
    this.sendPlayers()
    this.currentTurnIndex=this.getRandomInt(this.state.num_of_players);//Randomly chose the first player
    this.broadcast('game-start',);//TODO: send to card from the hand for every player
    this.initPlayerTurn();
  }

  private initPlayerTurn(){
    this.turns++;
    this.state.currentTurn=this.getCurrentTurnId();
    console.log("turns: "+this.turns+" player: "+this.state.currentTurn);
    this.state.players[this.currentTurnIndex].client.send("my-turn",);
  }

  private sendPlayers()
  {
    let playersId=this.state.players.map((value:any)=>value.client.sessionId);
    for(let player of this.state.players.values()){
      player.client.send("players",playersId);
      let val=playersId.shift();
      playersId.push(val);
    }
  }

  private getCurrentTurnId(): any {
    return this.state.players[this.currentTurnIndex].client.sessionId;
  }

  private getRandomInt(max:number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
