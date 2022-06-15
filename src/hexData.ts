export class HexData {
    private static readonly VALID_CHARS: Record<string, true | undefined> = {
        "0": true,
        "1": true,
        "2": true,
        "3": true,
        "4": true,
        "5": true,
        "6": true,
        "7": true,
        "8": true,
        "9": true,
        a: true,
        b: true,
        c: true,
        d: true,
        e: true,
        f: true,
        A: true,
        B: true,
        C: true,
        D: true,
        E: true,
        F: true,
    };
    public hexString: string;
    constructor(hexString: string) {
        if (!this.verifyHexString(hexString)) {
            throw new Error("Invalid hex string");
        }
        this.hexString = hexString.substring(2);
    }
    getNumber(): number {
        return parseInt(this.hexString, 16);
    }
    getAscii(): string {
        let rv = "";
        for (let i = 0; i < this.hexString.length; i += 2) {
            const charCode = parseInt(this.hexString.substring(i, i + 2), 16);
            rv += String.fromCharCode(charCode);
        }
        return rv;
    }
    getHexString(): string {
        return "0x" + this.hexString;
    }
    verifyHexString(hexString: string): boolean {
        return hexString.startsWith("0x") && this.verifyChars(hexString.substring(2));
    }

    static fromString(str: string): HexData {
        str = str.toLocaleLowerCase();
        if (str.startsWith("0x")) return new HexData(str);
        return new HexData("0x" + str);
    }
    static fromNumber(num: number): HexData {
        return new HexData(`0x${num.toString(16)}`);
    }
    private verifyChars(str: string): boolean {
        for (let i = 0; i < str.length; i++) {
            if (!HexData.VALID_CHARS[str[i] as string]) return false;
        }
        return true;
    }
    static parseHexToNumberUnsafe(hex: string): number {
        return parseInt(hex.substring(2), 16);
    }
    static parseHexToBigIntUnsafe(hex: string): BigInt {
        if (hex.length % 2) {
            hex = "0" + hex;
        }
        return BigInt(hex);
    }
}
