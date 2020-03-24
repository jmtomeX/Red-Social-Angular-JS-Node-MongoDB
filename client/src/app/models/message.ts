export class Publication{

  constructor(
    public _id: string,
    public emitter:string,
    public receiver: string,
    public text: string,
    public created_at: string,
    public viewed: boolean
  ){

  }
}
