var clone = require('clone');
var vanilla_selectors = [
    'className',
    'css',
    'id',
    'linkText',
    'js',
    'name',
    'partialLinkText',
    'tagName',
    'xpath'
];
var Page = {
    route: "",/*just path, not host /login /admin/dashboard*/
    sels: {
        /*
         selectorName: selector
         */
    },
    steps: {
        open: function(){
            this.get()
        }
    },
    construct: function(sels, route){
        if(typeof sels === 'object') {
            this.sels = sels;
        } else {
            throw new Error('first argument is expected to be a selector object')
        }
        if(typeof route === 'string'){
            this.route = route;
            return this;
        } else {
            throw new Error('second argument is expected to be a route string')
        };
    },
    get: function(waitFor, timeout){
        if(waitFor!==undefined) {
            browser.get(this.route);
            browser.wait(this.isElementPresent(waitFor), timeout);
        } else {
            browser.get(this.route);
        }
    },
    title: function(){return browser.getTitle()},
    currentUrl: function(){return browser.getCurrentUrl()},
    element: function(selName) {
        return element(this.sels[selName]);
    },
    elements: function(selName) {
        return element.all(this.sels[selName]);
    },
    velement: function(selName) {
        var selector = this.getSelector([selName]);
        if (vanilla_selectors.indexOf(Object.keys(selector)[0]) >= 0) {
            return browser.driver.findElement(selector);
        } else {
            throw new Error(Object.keys(selector)[0]+" is not an allowable locator strategy for "+selector[Object.keys(selector)[0]]);
        }
    },
    velements: function(selName) {
        var selector = this.getSelector([selName]);
        if (vanilla_selectors.indexOf(Object.keys(selector)[0]) >= 0) {
            return browser.driver.findElements(selector);
        } else {
            throw new Error(Object.keys(selector)[0]+" is not an allowable locator strategy for "+selector[Object.keys(selector)[0]]);
        }
    },
    getSelector: function(selName) {
        var elementSelector = this.sels[selName];
        if (!elementSelector) {
            throw new Error('Cannot find element "'+selName+'"');
        }
        return elementSelector;
    },
    waitForElementText: function (selName, text, timeout) {
        return browser.wait(protractor.ExpectedConditions.textToBePresentInElement(this.element(selName), text), timeout);
    },
    waitForElementVisible: function (selName, timeout) {
        return browser.wait(protractor.ExpectedConditions.visibilityOf(this.element(selName)), timeout);
    },
    waitForElementClickable: function (selName, timeout) {
        return browser.wait(protractor.ExpectedConditions.elementToBeClickable(this.element(selName)), timeout);
    },
    waitForElementSelected: function (selName, timeout) {
        return browser.wait(protractor.ExpectedConditions.elementToBeSelected(this.element(selName)), timeout);
    },
    waitForElementValue: function (selName, text, timeout) {
        return browser.wait(protractor.ExpectedConditions.textToBePresentInElementValue(this.element(selName), text), timeout);
    },
    isElementPresent: function (selName) {
        return this.element(selName).isPresent();
    }
};
module.exports = {
    Page: function(){
        return clone(Page);
    }
};