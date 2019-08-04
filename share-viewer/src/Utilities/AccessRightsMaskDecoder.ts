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
/**
 * Decode Access Rights Masks.
 * Based on Excel decoder @ https://us.hitachi-solutions.com/blog/unmasking-the-crm-principalobjectaccess-table/
 */
export default class AccessRightsMaskDecoder {
    /* 
     This is just called "b" in Excel. It seems to be the individual access right values, except for 16,
     which may be an MS internal value?
     */
    private static b = [1, 2, 4, 16, 32, 65536, 262144, 524288, 134217728];

    /**
     * Decode an access rights mask to a human-readable string
     * @param accessRightsMask access rights mask to decode
     */
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

    /**
     * Determine if an access right is enabled in an access rights mask
     * @param accessRightsMask access rights mask to decode
     * @param right the right to check
     */
    private static IsRightEnabled(accessRightsMask: number, right: AccessRights): boolean {
        /*
         Original formula: =IF(SUMPRODUCT( b * MOD(INT(accessRightsMask/b),2) * MOD(INT(right/b),2) )>0,"TRUE","-")
         Substitutions/Transofmation: 
         0.  SUMPRODUCT( b * MOD(INT(accessRightsMask/b),2) * MOD(INT(right/b),2) )
         1.  SUMPRODUCT( b * MOD(INT(a),2) * MOD(INT(right/b),2) )
         2.  SUMPRODUCT( b * MOD(c,2) * MOD(INT(right/b),2) )
         3.  SUMPRODUCT( b * d * MOD(INT(right/b),2) )
         4.  SUMPRODUCT( b * d * MOD(INT(right/b),2) )
         5.  SUMPRODUCT( e * MOD(INT(right/b),2) )
         6.  SUMPRODUCT( e * MOD(INT(f),2) )
         7   SUMPRODUCT( e * MOD(g,2) )
         8.  SUMPRODUCT( e * h )
         9.  SUMPRODUCT( i )
         10. IF(j > 0, "TRUE", "-")
        */

        // 1. accessRightsMask / b
        var a = AccessRightsMaskDecoder.ArrayArithmetic(AccessRightsMaskDecoder.b, accessRightsMask, "/", false);

        // 2. INT(a)
        var c = AccessRightsMaskDecoder.FoorArray(a);

        // 3. MOD(c, 2)
        var d = AccessRightsMaskDecoder.ArrayArithmetic(c, 2, "%", true);

        // 4. b * d
        var e = AccessRightsMaskDecoder.MultiArrayArithmetic(AccessRightsMaskDecoder.b, d, "*");

        // 5. right / b
        var f = AccessRightsMaskDecoder.ArrayArithmetic(AccessRightsMaskDecoder.b, right, "/", false);

        // 6. INT(f)
        var g = AccessRightsMaskDecoder.FoorArray(f);

        // 7. MOD(g, 2)
        var h = AccessRightsMaskDecoder.ArrayArithmetic(g, 2, "%", true);

        // 8. e * h
        var i = AccessRightsMaskDecoder.MultiArrayArithmetic(e, h, "*");

        // 9. SUMPRODUCT(i)
        var j = i.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);

        // IF(j > 0, "TRUE", "-")
        return j > 0;
    }

    /**
     * Perform arithmetic over all values in an array
     * @param array array to perform arithmetic on
     * @param number number to perform arithmetic on
     * @param operator arithmetic operator
     * @param firstOperandIsArr is the first operand in the equation the array value of the parameter "number"
     */
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

    /**
     * Perform arithmetic over corresponding values in two arrays.
     * i.e.
     * [(array1[0] + array2[0]),
     * (array1[1] + array2[1]),
     * (array1[n] + array2[n])]
     * @param array1 first array to perform arithmetic on
     * @param array2 second array to perform arithemtic on
     * @param operator arithmetic operator
     */
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

    private static FoorArray(array: number[]) {
        let flooredArray: number[] = [];
        array.forEach(aVal => flooredArray.push(Math.floor(aVal)));
        return flooredArray;
    }
}
