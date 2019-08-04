export type ArithmeticOperator = "+" | "-" | "*" | "/" | "%";
export enum AccessRights {
    read = 1,
    write = 2,
    append = 4,
    appendTo = 32,
    create = 32,
    del = 65536,
    share = 262144,
    assign = 524288,
    undocumented = 134217728
}
export default class AccessRightsMaskDecoder {
    private static b = [1, 2, 4, 16, 32, 65536, 262144, 524288, 134217728];
    public static decode(accessRightsMask: number): string {
        const isRead = AccessRightsMaskDecoder.IsRightEnabled(accessRightsMask, AccessRights.read);
        const isWrite = AccessRightsMaskDecoder.IsRightEnabled(accessRightsMask, AccessRights.write);
        const isAppend = AccessRightsMaskDecoder.IsRightEnabled(accessRightsMask, AccessRights.append);
        const isAppendTo = AccessRightsMaskDecoder.IsRightEnabled(accessRightsMask, AccessRights.appendTo);
        const isCreate = AccessRightsMaskDecoder.IsRightEnabled(accessRightsMask, AccessRights.create);
        const isDelete = AccessRightsMaskDecoder.IsRightEnabled(accessRightsMask, AccessRights.del);
        const isShare = AccessRightsMaskDecoder.IsRightEnabled(accessRightsMask, AccessRights.share);
        const isAssign = AccessRightsMaskDecoder.IsRightEnabled(accessRightsMask, AccessRights.assign);
        const isUndocumented = AccessRightsMaskDecoder.IsRightEnabled(accessRightsMask, AccessRights.undocumented);

        let decodedMask = "";
        if (isRead) {
            if (decodedMask !== "") decodedMask += ", ";
            decodedMask += "Read";
        }
        if (isWrite) {
            if (decodedMask !== "") decodedMask += ", ";
            decodedMask += "Write";
        }
        if (isAppend) {
            if (decodedMask !== "") decodedMask += ", ";
            decodedMask += "Append";
        }
        if (isAppendTo) {
            if (decodedMask !== "") decodedMask += ", ";
            decodedMask += "Append To";
        }
        if (isCreate) {
            if (decodedMask !== "") decodedMask += ", ";
            decodedMask += "Create";
        }
        if (isDelete) {
            if (decodedMask !== "") decodedMask += ", ";
            decodedMask += "Delete";
        }
        if (isShare) {
            if (decodedMask !== "") decodedMask += ", ";
            decodedMask += "Share";
        }
        if (isAssign) {
            if (decodedMask !== "") decodedMask += ", ";
            decodedMask += "Assign";
        }
        if (isUndocumented) {
            if (decodedMask !== "") decodedMask += ", ";
            decodedMask += "Undocumented";
        }
        return decodedMask;
    }

    private static IsRightEnabled(accessRightsMask: number, right: AccessRights): boolean {
        var a = AccessRightsMaskDecoder.ArrayArithmetic(AccessRightsMaskDecoder.b, accessRightsMask, "/", false);
        var c: number[] = [];
        a.forEach(val => c.push(Math.floor(val)));
        var d = AccessRightsMaskDecoder.ArrayArithmetic(c, 2, "%", true);
        var e = AccessRightsMaskDecoder.MultiArrayArithmetic(AccessRightsMaskDecoder.b, d, "*");

        // second half of formula
        var f = AccessRightsMaskDecoder.ArrayArithmetic(AccessRightsMaskDecoder.b, right, "/", false);
        var g: number[] = [];
        f.forEach(val => g.push(Math.floor(val)));
        var h = AccessRightsMaskDecoder.ArrayArithmetic(g, 2, "%", true);

        // combine the two halves
        var i = AccessRightsMaskDecoder.MultiArrayArithmetic(e, h, "*");

        var j = i.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

        return j > 0;
    }

    private static ArrayArithmetic(
        array: number[],
        number: number,
        operator: ArithmeticOperator,
        firstOperandIsArr: boolean
    ): number[] {
        let returnArr: number[] = [];
        switch (operator) {
            case "+":
                array.forEach(a => returnArr.push(a + number));
                break;
            case "-":
                array.forEach(a => returnArr.push(firstOperandIsArr ? a - number : number - a));
                break;
            case "*":
                array.forEach(a => returnArr.push(a * number));
                break;
            case "/":
                array.forEach(a => returnArr.push(firstOperandIsArr ? a / number : number / a));
                break;
            case "%":
                array.forEach(a => returnArr.push(firstOperandIsArr ? a % number : number % a));
                break;
        }
        return returnArr;
    }

    private static MultiArrayArithmetic(array1: number[], array2: number[], operator: ArithmeticOperator): number[] {
        let returnArr: number[] = [];
        switch (operator) {
            case "+":
                array1.forEach((a1, i) => returnArr.push(a1 + array2[i]));
                break;
            case "-":
                array1.forEach((a1, i) => returnArr.push(a1 - array2[i]));
                break;
            case "*":
                array1.forEach((a1, i) => returnArr.push(a1 * array2[i]));
                break;
            case "/":
                array1.forEach((a1, i) => returnArr.push(a1 / array2[i]));
                break;
            case "%":
                array1.forEach((a1, i) => returnArr.push(a1 % array2[i]));
                break;
        }
        return returnArr;
    }
}
