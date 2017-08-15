var PaymentCollect = {
    BankList: [
        { BankName: "支付宝", Paygate: 65, paygatetype: 0, paygatetypeaccount: 65 },
        { BankName: "微信", Paygate: 76, paygatetype: 0, paygatetypeaccount: 76 },
		{ BankName: "银联支付", Paygate: 62, paygatetype: 6, paygatetypeaccount: 62 },
        { BankName: "招商银行", Paygate: 1, paygatetype: 1, paygatetypeaccount: 65 },
        { BankName: "建设银行", Paygate: 2, paygatetype: 1, paygatetypeaccount: 65 },
        { BankName: "工商银行", Paygate: 3, paygatetype: 1, paygatetypeaccount: 65 },
        { BankName: "兴业银行", Paygate: 42, paygatetype: 1, paygatetypeaccount: 65 },
        { BankName: "交通银行", Paygate: 47, paygatetype: 1, paygatetypeaccount: 65 },
        //{ BankName: "光大银行", Paygate: 48, paygatetype: 1, paygatetypeaccount: 65 },
        { BankName: "北京农村商业银行", Paygate: 49, paygatetype: 1, paygatetypeaccount: 65 },
        { BankName: "中国银行", Paygate: 69, paygatetype: 1, paygatetypeaccount: 65 },
        { BankName: "农业银行", Paygate: 86, paygatetype: 1, paygatetypeaccount: 65 },
        { BankName: "中信银行", Paygate: 70, paygatetype: 1, paygatetypeaccount: 65 },
        { BankName: "平安银行", Paygate: 94, paygatetype: 1, paygatetypeaccount: 65 },       
        { BankName: "民生银行", Paygate: 901, paygatetype: 1, paygatetypeaccount: 65 }
    ],
    //根据银行编号取得支付信息
    GetBank: function (paygate) {
        for (var k in PaymentCollect.BankList) {
            var bank = PaymentCollect.BankList[k];
            if (bank.Paygate == paygate)
                return bank;
        }
        return null;
    },
}