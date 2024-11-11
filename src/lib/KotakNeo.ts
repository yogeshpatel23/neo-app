// class KotakNeo {
//     accessToken: string
//     token: string
//     constructor(accessToken:string,token:string,sid:string){
//         this.accessToken = accessToken
//         this.token = token
//     }
// }

import { Script } from "@/types/Script";

export class KotakNeo {
  constructor(
    public accessToken: string,
    public token: string,
    public sid: string,
    public serverid: string
  ) {}

  async searchScript(text: string): Promise<Script[]> {
    const res = await fetch(
      `https://neo.kotaksecurities.com/api/60search/scrips/${text}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    const resData = await res.json();
    if (res.status === 200) {
      return resData.data.scrips;
    } else {
      console.log(resData);
    }
    return [];
  }

  async placeOreder(data: {}) {
    const url = `https://gw-napi.kotaksecurities.com/Orders/2.0/quick/order/rule/ms/place?sId=${this.serverid}`;
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${this.accessToken}`,
      Auth: this.token,
      sid: this.sid,
      "neo-fin-key": "neotradeapi",
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const payload = `jData=${encodeURI(JSON.stringify(data))}`;
    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: payload,
    });

    const resData = await res.json();
    return resData;
  }

  async modifyOreder(data: {}) {
    const url = `https://gw-napi.kotaksecurities.com/Orders/2.0/quick/order/vr/modify?sId=${this.serverid}`;
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${this.accessToken}`,
      Auth: this.token,
      sid: this.sid,
      "neo-fin-key": "neotradeapi",
      "Content-Type": "application/x-www-form-urlencoded",
    };
    let urlencoded = new URLSearchParams();
    urlencoded.append("jData", JSON.stringify(data));
    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: urlencoded,
    });

    const resData = await res.json();
    return resData;
  }

  async cancleOreder(on: string) {
    const url = `https://gw-napi.kotaksecurities.com/Orders/2.0/quick/order/cancel?sid=${this.serverid}`;
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${this.accessToken}`,
      Auth: this.token,
      sid: this.sid,
      "neo-fin-key": "neotradeapi",
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const payload = `jData=${encodeURI(JSON.stringify({ on, amo: "NO" }))}`;
    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: payload,
    });

    const resData = await res.json();
    return resData;
  }

  async getOrderBook() {
    let url = `https://gw-napi.kotaksecurities.com/Orders/2.0/quick/user/orders?sid=${this.serverid}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        Auth: this.token,
        sid: this.sid,
        "neo-fin-key": "neotradeapi",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const resData = await res.json();
    return resData;
    if (res.status === 200) {
    } else {
      console.log(resData);
    }
    return [];
  }

  async getPosition() {
    let url = `https://gw-napi.kotaksecurities.com/Orders/2.0/quick/user/positions?sid=${this.serverid}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        Auth: this.token,
        sid: this.sid,
        "neo-fin-key": "neotradeapi",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const resData = await res.json();
    return resData;
    if (res.status === 200) {
    } else {
      console.log(resData);
    }
    return [];
  }
}
