
export interface monsterParam {
    name: String;
    appearRate: number;
    count: number;
}


export class monster_data {
    private map = new Map();

    constructor() {
        let round1_array: Array<monsterParam> = [
            { name: 'zombie', appearRate: 1, count: 5 },
        ];
        this.map.set("round1", round1_array);

        let round2_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.2, count: 2},
            { name: 'zombie', appearRate: 1, count: 5 },
        ];
        this.map.set("round2", round2_array);

        let round3_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.3, count: 2},
            { name: 'zombie', appearRate: 1, count: 6 },
        ];
        this.map.set("round3", round3_array);
        
        let round4_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3},
            { name: 'zombie', appearRate: 1, count: 7 },
        ];
        this.map.set("round4", round4_array);
        
        let round5_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.5, count: 3},
            { name: 'zombie', appearRate: 1, count: 10 },
        ];
        this.map.set("round5", round5_array);

        let round6_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.5, count: 4},
            { name: 'zombie', appearRate: 1, count: 10 },
        ];
        this.map.set("round6", round6_array);

        let round7_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.5, count: 5},
            { name: 'zombie', appearRate: 1, count: 10 },
        ];
        this.map.set("round7", round7_array);

        let round8_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.5, count: 6},
            { name: 'zombie', appearRate: 1, count: 12 },
        ];
        this.map.set("round8", round8_array);

        let round9_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.5, count: 7},
            { name: 'zombie', appearRate: 1, count: 12 },
        ];
        this.map.set("round9", round9_array);

        let round10_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.5, count: 8},
            { name: 'zombie', appearRate: 1, count: 14 },
        ];
        this.map.set("round10", round10_array);
    }

    getArray(key: String): Array<monsterParam> {
        let retarray = JSON.parse(JSON.stringify(this.map.get(key)));
        return retarray;
    }
}
