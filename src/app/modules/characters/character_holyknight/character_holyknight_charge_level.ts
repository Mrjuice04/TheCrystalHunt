export interface chargeLevelParam {
    damage: number;
    duration: number;
    penetratePower: number;
}


export class chargeLevelData {
    private map = new Map();

    slashParamArray: Array<chargeLevelParam> = [
        { damage: 20, duration: 1000, penetratePower: 0 },
        { damage: 20, duration: 1000, penetratePower: 0 },
        { damage: 20, duration: 1000, penetratePower: 1 }, // added second charge
        { damage: 25, duration: 1200, penetratePower: 1 },
        { damage: 25, duration: 1200, penetratePower: 2 },
        { damage: 25, duration: 1300, penetratePower: 2 }, // added wave
        { damage: 30, duration: 1300, penetratePower: 3 },
        { damage: 30, duration: 1300, penetratePower: 3 },
        { damage: 35, duration: 1400, penetratePower: 9 }  // penetrating wave
    ]

    constructor() {

    }

    getParam(level: integer): chargeLevelParam {
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

    getArray(key: String): chargeLevelParam {
        let retarray = JSON.parse(JSON.stringify(this.map.get(key)));
        return retarray;
    }
}

