# protractor-base-page
##Summary
A base class for protractor page objects that adds structure and a few helpers to write steps faster

##Page Structure
The base page object has a few properties for easy consistency across page object.
* route - string representing the url path after the hostname ex "/login", "?q=something"
* sels - the selector object created with the first argument in page.construct()
    {
        remember_me: {model: 'login.remember_me'},
        submit : {buttonText: 'submit'},
        username: {id: 'username'},
        password: {id: 'password'},
        /* etc. etc. */
        other_element: {strategy: selector}
    }
* steps - describe repeatable actions that you want to take against this page. You can add you step functions directly to page.steps.functionName after page.construct()

##Available Helper Functions
### construct: function(sels, route)
* sels - Object describing the names and locators for elements you want to use on this page
* route - Either an empty string or the path after the hostname
* Returns the page object with route and selectors added to the base page

### get: function(waitFor, timeout)
* waitFor - Optional element() to wait for after doing page.get(this.route)
* timeout - Integer in ms to wait for the above

### title: function()
* Returns the title of the page

### currentUrl: function()
* Returns the URL of the page

### element: function(selName)
Uses protractor-specifid binding functions to get element
* selName - String name for the element in the sels object
* Returns the element at selName's locator

### elements: function(selName)
Uses protractor-specifid binding functions to get elements
* selName - String name for the element in the sels object
* Returns the elements at selName's locator

### velement: function(selName)
Uses vanilla webdriver binding functions to get element
* selName - String name for the element in the sels object
* Returns the element at selName's locator

### velements: function(selName)
Uses vanilla webdriver binding functions to get elements
* selName - String name for the element in the sels object
* Returns the element at selName's locator

### waitForElementText: function (selName, text, timeout)
* selName - String name for the element in the sels object
* text - Strings that the element will wait to have
* timeout - Integer in ms to wait for the above

### waitForElementVisible: function (selName, timeout)
* selName - String name for the element in the sels object
* timeout - Integer in ms to wait for the above

### waitForElementClickable: function (selName, timeout)
* selName - String name for the element in the sels object
* timeout - Integer in ms to wait for the above

### waitForElementSelected: function (selName, timeout)
* selName - String name for the element in the sels object
* timeout - Integer in ms to wait for the above

### waitForElementValue: function (selName, value, timeout)
* selName - String name for the element in the sels object
* value - Value property that the element will wait to have
* timeout - Integer in ms to wait for the above

### isElementPresent: function (selName)
* selName - String name for the element in the sels object

##Code Examples
###Example page object, pages/login.page.js
    //set the page route (or use an empty string if desired)
    var route = '/login';

    //name your elements and describe how to find them
    var selectors =  {
        remember_me: {id: 'remember_me'},
        submit : {id: '_submit'},
        username: {id: 'username'},
        password: {id: 'password'}
    };

    //require the base page module, clone a new object to build on top of
    var page = require('protractor-base-page').Page();
    //add your elements, route to the new page
    page.construct(selectors, route);

    //add a step. this one used a data argument so you can adapt it to multiple testing scenarios
    page.steps.fillLoginForm = function(data){
        browser.wait(page.element('username').isPresent());
        page.element('username').sendKeys(data.username);
        page.element('password').sendKeys(data.password);
    };

    //export the page you created
    module.exports = page;

###Example Suite/Test, tests/login.spec.js
    //Using Mocha/Chai for test framework, assertions
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    var expect = chai.expect;

    //get the page object
    var LoginPage = require('./../pages/LoginPage.js');

    //create a suite
    describe('Users ',function(){
        //create a test
        it('Can log in with valid credentials', function(){
            //go to the page object
            LoginPage.get();
            //run your step with the specified data
            LoginPage.steps.fillLoginForm({
                username: 'someone',
                password: 'abcABC123'
            });
            LoginPage.element('submit').click();
            //assert something
        });
        it('Can't log in with invalid credentials', function(){
            //go to the page object
            LoginPage.get();
            //run your step with the specified data
            LoginPage.steps.fillLoginForm({
                username: 'someotherguy',
                password: 'wrongpassword'
            });
            LoginPage.element('submit').click();
            //assert something else
        });
    });