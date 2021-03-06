export enum CardType {
    Black,
    White
}

export default class CardDTO {
    id: string
    type?: CardType = CardType.White
    requiredAnswers?: Number = 1
    text: string = ''
}