function isCodeApplicable (customerDetails, transactionDetails, selectedOfferCode){
    //console.log("\nisCodeApplicable: Function Available\n");

    //Rule 1 - TD.Channel should be within selectedOfferCode.Channel
    if (checkRule1(transactionDetails.channel, selectedOfferCode.termsFilter.channel)){ 
        return {
            "requestID" : transactionDetails.requestID,
            "codeType" : selectedOfferCode.codeType,
            "validFor" : selectedOfferCode.validFor,
            "codeName" : selectedOfferCode.codeName,
            "applicable" : "N",
            "message" : "Channel '" + transactionDetails.channel + "' is Not Applicable for " + selectedOfferCode.codeName+ ", Available Channels [" + selectedOfferCode.termsFilter.channel +"]"};
    }

    //Rule 2 - TD.TransTypeCode should be within selectedOfferCode.TransTypeCode
    else if (checkRule2(transactionDetails.transTypeCode, selectedOfferCode.termsFilter.transTypeCode)){
        return {
            "requestID" : transactionDetails.requestID,
            "codeType" : selectedOfferCode.codeType,
            "validFor" : selectedOfferCode.validFor,
            "codeName" : selectedOfferCode.codeName,
            "applicable" : "N",
            "message" : "TransactionType " + transactionDetails.transTypeCode + " is Not Applicable for " + selectedOfferCode.codeName+ ", Available Transaction Types [" + selectedOfferCode.termsFilter.transTypeCode +"]"};

    } 

    //Rule 3 - CD.CustomerCategory should be within selectedOfferCode.CustomerCategory
    else if (checkRule3(customerDetails.customerCategory, selectedOfferCode.termsFilter.customerCategory)){
        return {
            "requestID" : transactionDetails.requestID,
            "codeType" : selectedOfferCode.codeType,
            "validFor" : selectedOfferCode.validFor,
            "codeName" : selectedOfferCode.codeName,
            "applicable" : "N",
            "message" : "Customer Category [" + customerDetails.customerCategory + "] is Not Applicable for " + selectedOfferCode.codeName+ ", Available Customer Categories [" + selectedOfferCode.termsFilter.customerCategory +"]"};
    } 

    //Rule 4 - TD.currency should be within selectedOfferCode.currency array
    else if (checkRule4(transactionDetails.currency, selectedOfferCode.termsFilter.currency)){ 
        return {
            "requestID" : transactionDetails.requestID,
            "codeType" : selectedOfferCode.codeType,
            "validFor" : selectedOfferCode.validFor,
            "codeName" : selectedOfferCode.codeName,
            "applicable" : "N",
            "message" : "Currency " + transactionDetails.currency + " is Not Applicable for " + selectedOfferCode.codeName+ ", Available Currencies [" + selectedOfferCode.termsFilter.customerCategory +"]"};
    } 

    //Rule 5 - If (selectedOfferCode.minMaxAmountType == LCY) then check if TD.LCY_Amount is between (selectedOfferCode.minimumLCYAmount and selectedOfferCode.maximumLCYAmount)
    else if (checkRule5(transactionDetails.lcyAmount, selectedOfferCode)){ 
        return {
            "requestID" : transactionDetails.requestID,
            "codeType" : selectedOfferCode.codeType,
            "validFor" : selectedOfferCode.validFor,
            "codeName" : selectedOfferCode.codeName,
            "applicable" : "N",
            "message" : "LCY Amount " + td.lcyAmount + " is Not in Range for " + selectedOfferCode.codeName+ ", Range is from " + selectedOfferCode.minimumINRAmount +" to "+selectedOfferCode.maximumINRAmount};
    } 

    //Rule 6 - If (selectedOfferCode.minMaxAmountType == FCY) then check if TD.LCY_Amount is between (selectedOfferCode.minAmount and selectedOfferCode.maxAmount) for selected currency
    else if (checkRule6(transactionDetails.lcyAmount, selectedOfferCode , rangeForSelectedCurrency(transactionDetails.currency, selectedOfferCode.termsFilter.currency))){
        var selectedCurrencyRange = rangeForSelectedCurrency(transactionDetails.currency, selectedOfferCode.termsFilter.currency)
        return {
            "requestID" : transactionDetails.requestID,
            "codeType" : selectedOfferCode.codeType,
            "validFor" : selectedOfferCode.validFor,
            "codeName" : selectedOfferCode.codeName,
            "applicable" : "N",
            "message" : "FCY Amount " + td.lcyAmount + " is Not in Range for " + selectedOfferCode.codeName+ ", Range is from " + selectedCurrencyRange.minAmount +" to "+selectedCurrencyRange.maxAmount};
    }

    //Rule 7 - TD.transDate is between (selectedOfferCode.startDateTime & selectedOfferCode.endDateTime)
    else if (checkRule7(transactionDetails.transDate, selectedOfferCode.startDateTime, selectedOfferCode.endDateTime)){
        return {
            "requestID" : transactionDetails.requestID,
            "codeType" : selectedOfferCode.codeType,
            "validFor" : selectedOfferCode.validFor,
            "codeName" : selectedOfferCode.codeName,
            "applicable" : "N",
            "message" : "Transaction Date " + transactionDetails.transDate + " is Not in Range for " + selectedOfferCode.codeName+ ", Range is from " + selectedOfferCode.startDateTime + " to " + selectedOfferCode.endDateTime};
    } 

    //Rule 8 - CD.usedcodes.usedcodecount for selectedOfferCode should be within selectedOfferCode.maximumUsagePerCustomer 
    else if (checkRule8(customerDetails.usedCodes, selectedOfferCode)){
        return {
            "requestID" : transactionDetails.requestID,
            "codeType" : selectedOfferCode.codeType,
            "validFor" : selectedOfferCode.validFor,
            "codeName" : selectedOfferCode.codeName,
            "applicable" : "N",
            "message" : "Customer has already used maximum no. of usages " + selectedOfferCode.maximumUsagePerCustomer + " available for offer code " + selectedOfferCode.codeName};
    } 
    else { //Success, code is applicable.
        return {
            "requestID" : transactionDetails.requestID,
            "codeType" : selectedOfferCode.codeType,
            "validFor" : selectedOfferCode.validFor,
            "codeName" : selectedOfferCode.codeName,
            "applicable" : "Y",
            "message" : ""};
    }
}

function checkRule1 (tdChannel, selectedOfferCodeChannel){
    //Returns true only if TD.Channel is not within selectedOfferCode.Channel 
    for(var i in selectedOfferCodeChannel){
        if (selectedOfferCodeChannel[i] == tdChannel){
            return false;
        }
    }
    return true;
}

function checkRule2(tdTransTypeCode, selectedOfferCodeTransTypeCode){
    //Returns true only if TD.TransTypeCode is not within selectedOfferCodeTransTypeCode
    for(var i in selectedOfferCodeTransTypeCode){
        if (selectedOfferCodeTransTypeCode[i] == tdTransTypeCode){
            return false;
        }
    }
    return true;
}

function checkRule3(cdCustomerCategory, selectedOfferCodeCustomerCategory){
    //Returns true only if CD.CustomerCategory is not within selectedOfferCodeCustomerCategory
    if (cdCustomerCategory.every(item => selectedOfferCodeCustomerCategory.includes(item))){
        return false;
    }
    return true;
}

function checkRule4(tdCurrency, selectedOfferCodeCurrency){
    //Returns true only if TD.Currency is not within selctedOfferCodeCurrencyArray
    for(var i in selectedOfferCodeCurrency){
        if(selectedOfferCodeCurrency[i].currCode == tdCurrency){
            return false;
        }
    }
    return true;

}

function checkRule5(tdLCYAmount, selectedOfferCode){
    //Returns true only if selectedOfferCode.minMaxAccountType is LCY and TD.LCYAmount is not witin selectedOfferCode.minimumINRAmount and selectedOfferCode.maximumINRAmount
    if(selectedOfferCode.minMaxAmountType == "LCY" && amountOutOfRange(Number(tdLCYAmount), Number(selectedOfferCode.minimumINRAmount), Number(selectedOfferCode.maximumINRAmount))){
        return true;
    }
    return false;
}

function rangeForSelectedCurrency(tdCurrency, selectedOfferCodeCurrency){
    //Returns range based on selected currency type
    for(var i in selectedOfferCodeCurrency){
        if(selectedOfferCodeCurrency[i].currCode == tdCurrency){
            return selectedOfferCodeCurrency[i];
        }
    }
    return undefined;
}

function checkRule6(tdLCYAmount, selectedOfferCode, selectedCurrencyRange){
    //Returns true only if selectedOfferCode.minMaxAccountType is not FCY and TD.LCYAmount is not witin selectedOfferCode.minAmount and selectedOfferCode.maxAmount of selected currency
    if(selectedOfferCode.minMaxAmountType == "FCY" && ((selectedCurrencyRange != undefined) ? (amountOutOfRange(Number(tdLCYAmount), Number(selectedCurrencyRange.minAmount), Number(selectedCurrencyRange.maxAmount))):true)){
        return true;
    }
    return false;
}

function amountOutOfRange(amount, min, max){
    //Returns true only if amount is out of range
    if((amount >= min) && (amount <= max)){
        return false;
    }
    return true;
}

function checkRule7(tdDate, selectedOfferCodeStartDateTime, selectedOfferCodeEndDateTime){
    //Returns true only if date is out of range
    if(new Date(tdDate).getTime() >= new Date(selectedOfferCodeStartDateTime).getTime() && new Date(tdDate).getTime() <= new Date(selectedOfferCodeEndDateTime).getTime()){
        return false;
    }
    return true;
}

function checkRule8(cdUsedCodes, selectedOfferCode){
    //Returns true only if selectedOfferCode.codename < selectedOfferCode.maximumUsagePerCustomer 
    for(var i in cdUsedCodes){
        if(cdUsedCodes[i].codeName == selectedOfferCode.codeName && cdUsedCodes[i].usedCount >= selectedOfferCode.maximumUsagePerCustomer){
            return true;
        }
    }
    return false;
}

module.exports = {isCodeApplicable};