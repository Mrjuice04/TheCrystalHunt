export interface blastLevelParam {
    damage: number;
    heal : number;
    blastCount: number;
}


export class blastLevelData {
    private map = new Map();

    slashParamArray: Array<blastLevelParam> = [
        { damage: 25, heal: 3, blastCount: 12 },
        { damage: 35, heal: 4, blastCount: 16 }, // added stun
        { damage: 45, heal: 5, blastCount: 20 }, // added explosion 
    ]

    constructor() {

    }

    getParam(level: integer): blastLevelParam {
        if (level < 1) {
            return this.slashParamArray[0];
        }
        else if (level <= this.slashParamArray.length) {
            return this.slashParamArray[level - 1];
        }
        else {
            return this.slashParamArray[this.slashParamArray.length - 1];
        }
    }

    getArray(key: String): blastLevelParam {
        let retarray = JSON.parse(JSON.stringify(this.map.get(key)));
        return retarray;
    }
}

