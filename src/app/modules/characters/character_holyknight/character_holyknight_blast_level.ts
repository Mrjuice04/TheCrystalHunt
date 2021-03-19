export interface blastLevelParam {
    damage: number;
    heal : number;
    blastCount: number;
}


export class blastLevelData {
    private map = new Map();

    slashParamArray: Array<blastLevelParam> = [
        { damage: 25, heal: 0, blastCount: 8 },
        { damage: 40, heal: 0, blastCount: 8 }, // added stun
        { damage: 50, heal: 0, blastCount: 8 }, // added explosion 
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

