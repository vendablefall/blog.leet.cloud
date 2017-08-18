/*! RESOURCE: /scripts/js_includes_customer.js */
/*! RESOURCE: (CITEC) Hide reply to & from fields */
if(/email_client\.do/.test(document.location.pathname)){
Event.observe(window, 'load', function() {
$('fromLabel').up(0).up(0).hide();
$('replyToLabel').up(0).up(0).hide();
});
}
/*! RESOURCE: Validate Client Script Functions */
function validateFunctionDeclaration(fieldName, functionName) {
var code = g_form.getValue(fieldName);
if (code == "")
return true;
code = removeCommentsFromClientScript(code);
var patternString = "function(\\s+)" + functionName + "((\\s+)|\\(|\\[\r\n])";
var validatePattern = new RegExp(patternString);
if (!validatePattern.test(code)) {
var msg = new GwtMessage().getMessage('Missing function declaration for') + ' ' + functionName;
g_form.showErrorBox(fieldName, msg);
return false;
}
return true;
}
function validateNoServerObjectsInClientScript(fieldName) {
var code = g_form.getValue(fieldName);
if (code == "")
return true;
code = removeCommentsFromClientScript(code);
var doubleQuotePattern = /"[^"\r\n]*"/g;
code = code.replace(doubleQuotePattern,"");
var singleQuotePattern = /'[^'\r\n]*'/g;
code = code.replace(singleQuotePattern,"");
var rc = true;
var gsPattern = /(\s|\W)gs\./;
if (gsPattern.test(code)) {
var msg = new GwtMessage().getMessage('The object "gs" should not be used in client scripts.');
g_form.showErrorBox(fieldName, msg);
rc = false;
}
var currentPattern = /(\s|\W)current\./;
if (currentPattern.test(code)) {
var msg = new GwtMessage().getMessage('The object "current" should not be used in client scripts.');
g_form.showErrorBox(fieldName, msg);
rc = false;
}
return rc;
}
function validateUIScriptIIFEPattern(fieldName, scopeName, scriptName) {
var code = g_form.getValue(fieldName);
var rc = true;
if("global" == scopeName)
return rc;
code = removeCommentsFromClientScript(code);
code = removeSpacesFromClientScript(code);
code = removeNewlinesFromClientScript(code);
var requiredStart =  "var"+scopeName+"="+scopeName+"||{};"+scopeName+"."+scriptName+"=(function(){\"usestrict\";";
var requiredEnd = "})();";
if(!code.startsWith(requiredStart)) {
var msg = new GwtMessage().getMessage("Missing closure assignment.");
g_form.showErrorBox(fieldName,msg);
rc = false;
}
if(!code.endsWith(requiredEnd)) {
var msg = new GwtMessage().getMessage("Missing immediately-invoked function declaration end.");
g_form.showErrorBox(fieldName,msg);
rc = false;
}
return rc;
}
function validateNotCallingFunction (fieldName, functionName) {
var code = g_form.getValue(fieldName);
var rc = true;
var reg = new RegExp(functionName, "g");
var matches;
code = removeCommentsFromClientScript(code);
if (code == '')
return rc;
matches = code.match(reg);
rc = (matches && (matches.length == 1));
if(!rc) {
var msg = "Do not explicitly call the " + functionName + " function in your business rule. It will be called automatically at execution time.";
msg = new GwtMessage().getMessage(msg);
g_form.showErrorBox(fieldName,msg);
}
return rc;
}
function removeCommentsFromClientScript(code) {
var pattern1 = /\/\*(.|[\r\n])*?\*\//g;
code = code.replace(pattern1,"");
var pattern2 = /\/\/.*/g;
code = code.replace(pattern2,"");
return code;
}
function removeSpacesFromClientScript(code) {
var pattern = /\s*/g;
return code.replace(pattern,"");
}
function removeNewlinesFromClientScript(code) {
var pattern = /[\r\n]*/g;
return code.replace(pattern,"");
}
/*! RESOURCE: (CITEC)Tabs */
function citecResetTabs() {
if (g_tabs2Sections.activeTab > 1 ) {
g_tabs2Sections.setActive(1);
}
return true;
}
/*! RESOURCE: UI Action Context Menu */
function showUIActionContext(event) {
if (!g_user.hasRole("ui_action_admin"))
return;
var element = Event.element(event);
if (element.tagName.toLowerCase() == "span")
element = element.parentNode;
var id = element.getAttribute("gsft_id");
var mcm = new GwtContextMenu('context_menu_action_' + id);
mcm.clear();
mcm.addURL(getMessage('Edit UI Action'), "sys_ui_action.do?sys_id=" + id, "gsft_main");
contextShow(event, mcm.getID(), 500, 0, 0);
Event.stop(event);
}
addLoadEvent(function() {
document.on('contextmenu', '.action_context', function (evt, element) {
showUIActionContext(evt);
});
});
/*! RESOURCE: (CITEC) DynamicTabTitle */
addLoadEvent(setTitle);
function setTitle(){
var prefix = '';
var url = location.pathname;
var host_name = location.hostname;
if (host_name == 'citecsandpit.service-now.com'){
prefix = 'PIT ';
}else if (host_name == 'citecuat.service-now.com'){
prefix = 'UAT ';
}else if (host_name == 'citecdev.service-now.com'){
prefix = 'DEV ';
}
else if (host_name == 'citectraining.service-now.com'){
prefix = 'TRN ';
}
url = url.substring(1,url.length-3);
var base = prefix + url;
try{
var sd = g_form.getValue('short_description');
var num = g_form.getValue('number');
var nme = g_form.getValue('name');
} catch(e) {
}
if(sd || num || nme){
var add = '';
sd = (sd) ? sd : (nme) ? nme : '';
add = (sd != '' && num) ? num + ' - ' + sd : (sd != '') ? sd : num;
if((typeof g_user != 'undefined') && g_user.hasRole('admin')){
top.document.title = base + ' | ' + add;
} else {
if(prefix != '') {
top.document.title = prefix + ' | ' + add;
} else {
top.document.title = add;
}
}
} else {
if((typeof g_user != 'undefined') && g_user.hasRole('admin')){
top.document.title = base;
}else {
top.document.title = prefix +   ' Service-now ';
}
}
}
/*! RESOURCE: /scripts/lib/jquery/jquery_clean.js */
(function() {
if (!window.jQuery)
return;
if (!window.$j_glide)
window.$j = jQuery.noConflict();
if (window.$j_glide && jQuery != window.$j_glide) {
if (window.$j_glide)
jQuery.noConflict(true);
window.$j = window.$j_glide;
}
})();
;
;
