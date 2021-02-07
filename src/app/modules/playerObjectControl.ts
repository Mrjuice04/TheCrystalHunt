export class playerObjectControl{
    playerObjectArray: Array<any> = [];
    constructor() {
        
    }

    addPlayerObject(aObject: any, aPosX: number, aPosY: number){
        aObject.create();
        this.playerObjectArray.push(aObject);
    }

    destroyObject(aObjectSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody){
        aObjectSprite.destroy();
    }

    hitMonster(){
        
    }
}