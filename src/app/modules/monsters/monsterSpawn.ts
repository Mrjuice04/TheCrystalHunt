
export interface monsterParam {
    name: String;
    appearRate: number;
    count: number;
    preSpawn: boolean;
}


export class monster_data {
    private map = new Map();

    constructor() {
        let round0_array: Array<monsterParam> = [
            //for testing
            { name: 'bossSlime', appearRate: 1, count: 1, preSpawn: false },
        ];
        this.map.set("round0", round0_array);

        let round1_array: Array<monsterParam> = [
            { name: 'zombie', appearRate: 1, count: 3, preSpawn: false },
        ];
        this.map.set("round1", round1_array);

        let round2_array: Array<monsterParam> = [
            { name: 'zombie', appearRate: 1, count: 5, preSpawn: false },
        ];
        this.map.set("round2", round2_array);

        let round3_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 1, count: 1, preSpawn: true },
            { name: 'zombie', appearRate: 1, count: 5, preSpawn: false },
        ];
        this.map.set("round3", round3_array);

        let round4_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 1, count: 1, preSpawn: true },
            { name: 'skeleton', appearRate: 0.2, count: 1, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 5, preSpawn: false },
        ];
        this.map.set("round4", round4_array);

        let round5_array: Array<monsterParam> = [
            { name: 'hog', appearRate: 1, count: 1, preSpawn: true },
            { name: 'zombie', appearRate: 1, count: 4, preSpawn: false },
        ];
        this.map.set("round5", round5_array);

        let round6_array: Array<monsterParam> = [
            { name: 'hog', appearRate: 1, count: 1, preSpawn: true },
            { name: 'skeleton', appearRate: 0.4, count: 1, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 3, preSpawn: false },
        ];
        this.map.set("round6", round6_array);

        let round7_array: Array<monsterParam> = [
            { name: 'hog', appearRate: 1, count: 1, preSpawn: true },
            { name: 'skeleton', appearRate: 0.4, count: 2, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 2, preSpawn: false },
        ];
        this.map.set("round7", round7_array);

        let round8_array: Array<monsterParam> = [
            { name: 'hog', appearRate: 1, count: 1, preSpawn: true },
            { name: 'zombie', appearRate: 1, count: 1, preSpawn: true },
            { name: 'skeleton', appearRate: 0.4, count: 2, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 4, preSpawn: false },
        ];
        this.map.set("round8", round8_array);

        let round9_array: Array<monsterParam> = [
            { name: 'hog', appearRate: 1, count: 1, preSpawn: true },
            { name: 'hog', appearRate: 0.1, count: 1, preSpawn: false },
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 2, preSpawn: false },
        ];
        this.map.set("round9", round9_array);

        let round10_array: Array<monsterParam> = [
            { name: 'hog', appearRate: 1, count: 2, preSpawn: true },
            { name: 'hog', appearRate: 0.3, count: 1, preSpawn: false },
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 5, preSpawn: false },
        ];
        this.map.set("round10", round10_array);

        let round11_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 1, count: 1, preSpawn: true },
            { name: 'zombie', appearRate: 1, count: 8, preSpawn: false },
        ];
        this.map.set("round11", round11_array);

        let round12_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 1, count: 1, preSpawn: true },
            { name: 'zombie', appearRate: 1, count: 1, preSpawn: false },
            { name: 'skeleton', appearRate: 0.5, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 5, preSpawn: false },
        ];
        this.map.set("round12", round12_array);

        let round13_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 1, count: 1, preSpawn: true },
            { name: 'hog', appearRate: 1, count: 1, preSpawn: false },
            { name: 'skeleton', appearRate: 0.5, count: 2, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 4, preSpawn: false },
        ];
        this.map.set("round13", round13_array);

        let round14_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 1, count: 1, preSpawn: true },
            { name: 'hog', appearRate: 0.3, count: 2, preSpawn: false },
            { name: 'skeleton', appearRate: 0.5, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 5, preSpawn: false },
        ];
        this.map.set("round14", round14_array);

        let round15_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 1, count: 1, preSpawn: true },
            { name: 'hog', appearRate: 0.3, count: 2, preSpawn: false },
            { name: 'skeleton', appearRate: 0.5, count: 4, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 7, preSpawn: false },
        ];
        this.map.set("round15", round15_array);

        let round16_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 1, count: 2, preSpawn: true },
            { name: 'hog', appearRate: 0.3, count: 2, preSpawn: false },
            { name: 'skeleton', appearRate: 0.5, count: 4, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 7, preSpawn: false },
        ];
        this.map.set("round16", round16_array);

        let round17_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 1, count: 2, preSpawn: true },
            { name: 'hog', appearRate: 1, count: 1, preSpawn: false },
            { name: 'skeleton', appearRate: 1, count: 1, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 1, preSpawn: false },
            { name: 'hog', appearRate: 0.3, count: 2, preSpawn: false },
            { name: 'skeleton', appearRate: 0.5, count: 4, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 7, preSpawn: false },
        ];
        this.map.set("round17", round17_array);

        let round18_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 1, count: 1, preSpawn: true },
            { name: 'hog', appearRate: 1, count: 1, preSpawn: true },
            { name: 'mummy', appearRate: 0.3, count: 1, preSpawn: false },
            { name: 'hog', appearRate: 0.4, count: 1, preSpawn: false },
            { name: 'skeleton', appearRate: 0.5, count: 4, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 7, preSpawn: false },
        ];
        this.map.set("round18", round18_array);

        let round19_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 1, count: 1, preSpawn: true },
            { name: 'hog', appearRate: 1, count: 1, preSpawn: true },
            { name: 'skeleton', appearRate: 1, count: 1, preSpawn: true },
            { name: 'zombie', appearRate: 1, count: 1, preSpawn: true },
            { name: 'mummy', appearRate: 0.3, count: 1, preSpawn: false },
            { name: 'hog', appearRate: 0.4, count: 1, preSpawn: false },
            { name: 'skeleton', appearRate: 0.5, count: 1, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 1, preSpawn: false },
        ];
        this.map.set("round19", round19_array);

        let round20_array: Array<monsterParam> = [
            { name: 'bossSlime', appearRate: 1, count: 1, preSpawn: true },
            { name: 'mummy', appearRate: 1, count: 2, preSpawn: false },
            { name: 'hog', appearRate: 1, count: 3, preSpawn: false },
            { name: 'skeleton', appearRate: 1, count: 4, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 5, preSpawn: false },
        ];
        this.map.set("round20", round20_array);

        let round21_array: Array<monsterParam> = [
            { name: 'mummy', appearRate: 0.3, count: 10000000, preSpawn: false },
            { name: 'hog', appearRate: 0.4, count: 10000000, preSpawn: false },
            { name: 'skeleton', appearRate: 0.5, count: 10000000, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 10000000, preSpawn: false },
        ];
        this.map.set("round21", round21_array);

        let round22_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round22", round22_array);

        let round23_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round23", round23_array);

        let round24_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round24", round24_array);

        let round25_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round25", round25_array);

        let round26_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round26", round26_array);

        let round27_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round27", round27_array);

        let round28_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round28", round28_array);

        let round29_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round29", round29_array);

        let round30_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round30", round30_array);

        let round31_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round31", round31_array);

        let round32_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round32", round32_array);

        let round33_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round33", round33_array);

        let round34_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round34", round34_array);

        let round35_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round35", round35_array);

        let round36_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round36", round36_array);

        let round37_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round37", round37_array);

        let round38_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round38", round38_array);

        let round39_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round39", round39_array);

        let round40_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round40", round40_array);

        let round41_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round41", round41_array);

        let round42_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round42", round42_array);

        let round43_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round43", round43_array);

        let round44_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round44", round44_array);

        let round45_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round45", round45_array);

        let round46_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round46", round46_array);

        let round47_array: Array<monsterParam> = [
            { name: 'skeleton', appearRate: 0.4, count: 3, preSpawn: false },
            { name: 'zombie', appearRate: 1, count: 12, preSpawn: false },
        ];
        this.map.set("round47", round47_array);
    }

    getArray(key: String): Array<monsterParam> {
        let retarray = JSON.parse(JSON.stringify(this.map.get(key)));
        return retarray;
    }
}
