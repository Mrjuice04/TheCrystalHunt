export  class utils {
    static getTick() {
        let d = new Date();
        return d.getTime();
    };

    static tickElapsed(tick: number) {
        return this.getTick() - tick;
    };
}
