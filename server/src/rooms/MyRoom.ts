import { Room, Client } from "colyseus";
import { CaboState } from "./State/CaboState";

export class MyRoom extends Room {

  onCreate (options: any) {
    this.setState(new CaboState());

    this.onMessage("type", (client, message) => {
      console.log(client.id+" "+message)
    });

  }

  onJoin (client: Client, options: any) {
    console.log(client.id+" joined")
    client.send("Hello","hello");
  }
                    
  onLeave (client: Client, consented: boolean) {
  }

  onDispose() {
  }

}
