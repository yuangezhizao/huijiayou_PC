var Mtype = {
    ChinaMobile: 1,
    ChinaUniCom: 2,
    ChinaTelCom: 3,
    Virtual: 4,
    Other: 5,
    GetName: function (imtype) {
        switch (imtype) {
            case Mtype.ChinaMobile:
                return "移动";
            case Mtype.ChinaTelCom:
                return "电信";
            case Mtype.ChinaUniCom:
                return "联通";
            default:
                return "";
        }
    }
};