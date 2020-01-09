
//数字转中文大写
const moneyToChinese = (money) => {
    //汉字的数字
    let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
    //基本单位
    let cnIntRadice = new Array("", "拾", "佰", "仟");
    //对应整数部分扩展单位
    let cnIntUnits = new Array("", "万", "亿", "兆");
    //对应小数部分单位
    let cnDecUnits = new Array("角", "分", "毫", "厘");
    //整数金额时后面跟的字符
    let cnInteger = "整";
    //整型完以后的单位
    let cnIntLast = "元";
    //最大处理的数字
    let maxNum = 999999999999999.9999;
    //金额整数部分
    let integerNum;
    //金额小数部分
    let decimalNum;
    //输出的中文金额字符串
    let chineseStr = "";
    //分离金额后用的数组，预定义
    let parts;
    if (money == "") {
        return "";
    }
    money = parseFloat(money);
    if (money >= maxNum) {
        //超出最大处理数字
        return "";
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf(".") == -1) {
        integerNum = money;
        decimalNum = "";
    } else {
        parts = money.split(".");
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        let zeroCount = 0;
        let IntLen = integerNum.length;
        for (let i = 0; i < IntLen; i++) {
            let n = integerNum.substr(i, 1);
            let p = IntLen - i - 1;
            let q = p / 4;
            let m = p % 4;
            if (n == "0") {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != "") {
        let decLen = decimalNum.length;
        for (let i = 0; i < decLen; i++) {
            let n = decimalNum.substr(i, 1);
            if (n != "0") {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == "") {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == "") {
        chineseStr += cnInteger;
    }
    return chineseStr;
};

// 元转分 - 解决精度问题 yuan:要转换的钱，单位元； digit：转换倍数
const yuanToFen = regYuanToFen = (yuan) => {
    if (!yuan) {
        return 0;
    }
    const index = yuan.toString().indexOf(',');
    if (index !== -1) {
        yuan = Number(yuan.replace(/,/g, ''));
    }
    const arg2 = 100;

    let m = 0;
    let s1 = yuan.toString();
    let s2 = arg2.toString();

    if (s1.split('.')[1]) {
        m += s1.split('.')[1].length;
    }
    if (s2.split('.')[1]) {
        m += s2.split('.')[1].length;
    }
    return parseInt((Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)).toFixed(2));
};

// 分转化为元 - 正则解决精度
const fenToYuan = (fen, comma = false) => {
    const toDecimal2 = (x) => {
        let f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        f = Math.round(x * 100) / 100;
        let s = f.toString();
        let rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    };
    let num = fen;
    if (num === undefined || num === null) {
        return 0.00;
    } else {
        num = fen * 0.01;
        num += '';
        let reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
        num = num.replace(reg, '$1');
        num = toDecimal2(num);
        return comma ? toThousands(num) : num;
    }
};

export default { moneyToChinese, yuanToFen, fenToYuan };