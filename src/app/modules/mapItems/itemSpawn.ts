
export interface itemParam {
    name: String;
    appearRate: number;
    count: number;
}


export class itemData {
    private map = new Map();

    constructor() {
        let round1_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 2 },
        ];
        this.map.set("round1", round1_array);

        let round2_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 3 },
        ];
        this.map.set("round2", round2_array);

        let round3_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 3 },
        ];
        this.map.set("round3", round3_array);
        
        let round4_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 4 },
        ];
        this.map.set("round4", round4_array);
        
        let round5_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 4 },
        ];
        this.map.set("round5", round5_array);

        let round6_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 5 },
        ];
        this.map.set("round6", round6_array);

        let round7_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 5 },
        ];
        this.map.set("round7", round7_array);

        let round8_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 6 },
        ];
        this.map.set("round8", round8_array);

        let round9_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 6 },
        ];
        this.map.set("round9", round9_array);

        let round10_array: Array<itemParam> = [
            { name: 'heal', appearRate: 0.3, count: 7 },
        ];
        this.map.set("round10", round10_array);
    }

    getArray(key: String): Array<itemParam> {
        let retarray = JSON.parse(JSON.stringify(this.map.get(key)));
        return retarray;
    }
}
