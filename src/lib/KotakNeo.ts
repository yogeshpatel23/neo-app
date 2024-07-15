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
    public sid: string
  ) {}

  async searchScript(text: string): Promise<Script[]> {
    const res = await fetch(
      `https://lapi.kotaksecurities.com/60search/scrips/${text}`,
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

  async placeOreder() {
    console.log("order placed");
  }
}
