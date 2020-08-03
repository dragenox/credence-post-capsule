const assert = require ("chai").assert;
const app = require ("../app");

describe("Check isCodeApplicable for Transaction", function (){
    it("input code is applicable for transaction", function(){

        //3 Input JSON Objects
        var customerDetails={
            "cif":"12345",
            "customerCategory":[
            "EMPLOYEE",   "WEALTH"
            ],
            "usedCodes":
                [
                    {
                        "codeType":"P",
                        "codeName":"KOTAKFIRST",
                        "usedCount":"1"
                    },
                    {
                        "codeType":"D",
                        "codeName":"STUDENT",
                        "usedCount":"2"
                    }
                ]              
        };

        var transactionDetails={
            "requestID":"1",
            "transDate":"01-04-2020",
            "transTypeCode":"SVC-R",
            "currency":"USD",
            "amount":"1500",
            "promoCode":"KOTAKFIRST",
            "channel": "PORTAL",
            "rate":"77.31",
            "ibr":"75.31",
            "cardRate":"77.31",
            "perUnit":"1",
            "buySellSign":"-1",
            "orgCharges":"100",
            "lcyAmount":"115965"
        }

        var selectedOfferCode={
            "codeType":"D",
            "validFor":"RC",
            "codeName":"STUDENT",
            "description":" DISCOUNT FOR EDUCATIONAL SEASON- CHARGES Rs 100 OFF, 50 PAISE DISCOUNT ON CARD RATE",
            "startDateTime":"01-04-2020 00:00:00",
            "endDateTime":"01-07-2020 00:00:00",
            "minMaxAmountType":"LCY",
            "minimumINRAmount":"1000",
            "maximumINRAmount":"1000000",
            "maximumTotalUsage":"100000",
            "maximumUsagePerCustomer":"1",
            "rateApplyType":"GBL",
            "applicableRateMargin":"50",
            "chargesDiscount": {
                    "chargeDiscountType":"F",
                    "chargeDiscount":"100"
            },
            "rateDiscount": {
                    "rateDiscountType":"F",
                    "rateDiscountOn":"IBR",
                    "rateDiscountOrMargin":"50"
            },
            "termsFilter":{
                    "channel":["branch","mobile"],
                    "transTypeCode":["CN-SALE","SVC-S","SVC-R","TT-SALE","DD-SALE"],
                    "customerCategory":["STUDENT","EMPLOYEE"],
                    "currency": [
                            {
                                    "currCode":"USD",
                                    "minAmount":"",
                                    "maxAmount":"",
                                    "discount":""
                            },
                            {
                                    "currCode":"EUR",
                                    "minAmount":"",
                                    "maxAmount":"",
                                    "discount":""
                            },
                            {
                                    "currCode":"GBP",
                                    "minAmount":"",
                                    "maxAmount":"",
                                    "discount":""
                            }
                                    
                    ]
            }
        }
        //Expected Output JSON
        var expectedOutput = {
             "requestID":"1",
             "codeType":"D",
             "validFor":"RC",
             "codeName":"STUDENT",
             "applicable":"Y",
             "message":""
        }
        assert.equal(app.isCodeApplicable(customerDetails, transactionDetails, selectedOfferCode), expectedOutput);
    });
});