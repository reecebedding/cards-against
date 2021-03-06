import { Exclude, Expose } from "class-transformer"

@Exclude()
export class PlayerDTO {
    @Expose() id: string
    @Expose() gameId: string    
}