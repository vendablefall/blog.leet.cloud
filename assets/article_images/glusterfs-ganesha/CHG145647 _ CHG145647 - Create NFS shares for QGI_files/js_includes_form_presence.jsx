/*! RESOURCE: /scripts/js_includes_form_presence.js */
/*! RESOURCE: /scripts/sn/common/ui/popover/js_includes_ui_popover.js */
/*! RESOURCE: /scripts/sn/common/ui/popover/_module.js */
angular.module('sn.common.ui.popover', []);
;
/*! RESOURCE: /scripts/sn/common/ui/popover/directive.snBindPopoverSelection.js */
angular.module('sn.common.ui.popover').directive('snBindPopoverSelection', function(snCustomEvent) {
"use strict";
return {
restrict: "A",
controller: function ($scope, $element, $attrs , snCustomEvent){
snCustomEvent.observe('list.record_select', recordSelectDataHandler);
function recordSelectDataHandler(data, event){
if (!data || !event)
return;
event.stopPropagation();
var ref = ($scope.field) ? $scope.field.ref : $attrs.ref;
if (data.ref === ref) {
if (window.g_form) {
if ($attrs.addOption) {
addGlideListChoice('select_0' + $attrs.ref, data.value, data.displayValue);
} else {
var fieldValue = typeof $attrs.ref === 'undefined' ? data.ref : $attrs.ref;
window.g_form._setValue(fieldValue, data.value, data.displayValue);
clearDerivedFields(data.value);
}
}
if ($scope.field) {
$scope.field.value = data.value;
$scope.field.displayValue = data.displayValue;
}
}
}
function clearDerivedFields(value) {
if (window.DerivedFields) {
var df = new DerivedFields($scope.field ? $scope.field.ref : $attrs.ref);
df.clearRelated();
df.updateRelated(value);
}
}
}
};
});
;
/*! RESOURCE: /scripts/sn/common/ui/popover/directive.snComplexPopover.js */
angular.module('sn.common.ui.popover').directive('snComplexPopover', function(getTemplateUrl, $q, $http, $templateCache, $compile, $timeout){
"use strict";
return {
restrict: 'E',
replace:true,
templateUrl: function(elem, attrs){
return getTemplateUrl(attrs.buttonTemplate);
},
controller: function($scope, $element, $attrs, $q, $document, snCustomEvent, snComplexPopoverService){
$scope.type = $attrs.complexPopoverType || "complex_popover";
if ($scope.closeEvent){
snCustomEvent.observe($scope.closeEvent, destroyPopover);
$scope.$on($scope.closeEvent, destroyPopover);
}
$scope.$parent.$on('$destroy', destroyPopover);
var newScope;
var open;
var popover;
var content;
var popoverDefaults = {
container: 'body',
html: true,
placement: 'auto',
trigger: 'manual',
template: '<div class="complex_popover popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
};
var popoverConfig = angular.extend(popoverDefaults, $scope.popoverConfig);
$scope.loading      = false;
$scope.initialized  = false;
$scope.togglePopover = function(event) {
if (!$scope.initialized){
showPopover(event);
} else {
destroyPopover();
}
};
function showPopover(e) {
if ($scope.loading)
return;
$scope.$toggleButton = angular.element(e.target);
$scope.loading = true;
$scope.$emit('list.toggleLoadingState', true);
_getTemplate()
.then(_insertTemplate)
.then(_createPopover)
.then(_bindHtml)
.then(function(){
$scope.loading = false;
$scope.initialized = true;
if (!$scope.loadEvent)
_openPopover();
});
}
function destroyPopover() {
if (!newScope)
return;
$scope.$toggleButton.on('hidden.bs.popover', function(){
open = false;
$scope.$toggleButton.data('bs.popover').$element.removeData('bs.popover').off('.popover');
$scope.$toggleButton = null;
snCustomEvent.fire('hidden.complexpopover.' + $scope.ref);
});
$scope.$toggleButton.popover('hide');
snCustomEvent.fire('hide.complexpopover.' + $scope.ref, $scope.$toggleButton);
newScope.$broadcast('$destroy');
newScope.$destroy();
newScope = null;
$scope.initialized = false;
angular.element('html').off('click', complexHtmlHandler);
}
function _getTemplate() {
return snComplexPopoverService.getTemplate(getTemplateUrl($attrs.template));
}
function _createPopover() {
$scope.$toggleButton.popover(popoverConfig);
return $q.when(true);
}
function _insertTemplate(response) {
newScope = $scope.$new();
if ($scope.loadEvent)
newScope.$on($scope.loadEvent, _openPopover);
content = $compile(response.data)(newScope);
popoverConfig.content = content;
newScope.open = true;
snCustomEvent.fire('inserted.complexpopover.' + $scope.ref, $scope.$toggleButton);
return $q.when(true);
}
function _bindHtml() {
angular.element('html').on('click', complexHtmlHandler);
return $q.when(true);
}
function complexHtmlHandler(e) {
var parentComplexPopoverScope = angular.element(e.target).parents('.popover-content').children().scope();
if (parentComplexPopoverScope && (parentComplexPopoverScope.type = "complex_popover") && $scope.type === "complex_popover")
return;
if (angular.element(e.target).parents('html').length === 0)
return;
if ($scope.initialized && !$scope.loading && !$scope.$toggleButton.is(e.target) && content.parents('.popover').has(angular.element(e.target)).length === 0) {
e.preventDefault();
e.stopPropagation();
destroyPopover(e);
}
}
function _openPopover() {
if (open)
return;
open = true;
$timeout(function() {
$scope.$toggleButton.popover('show');
snCustomEvent.fire('show.complexpopover.' + $scope.ref, $scope.$toggleButton);
$scope.$toggleButton.on('shown.bs.popover', function(){
snCustomEvent.fire('shown.complexpopover.' + $scope.ref, $scope.$toggleButton);
});
}, 0 );
}
}
};
});
;
/*! RESOURCE: /scripts/sn/common/ui/popover/service.snComplexPopoverService.js */
angular.module('sn.common.ui.popover').service('snComplexPopoverService', function($http, $q, $templateCache){
"use strict";
return {
getTemplate: getTemplate
};
function getTemplate(template){
return $http.get(template, {cache: $templateCache});
}
});
;
;
/*! RESOURCE: /scripts/app.form_presence/app.form_presence.js */
angular.module('sn.form_presence', ['sn.base', 'sn.common.presence', 'sn.messaging', 'sn.i18n', 'sn.common.controls', 'sn.common.avatar', 'sn.common.ui.popover', 'sn.common.user_profile']).directive('formPresence',
function(snRecordPresence, getTemplateUrl, $rootScope, $q) {
"use strict";
return {
restrict: 'E',
templateUrl: getTemplateUrl('ng_form_presence.xml'),
controller: function($scope, $http, userData) {
var viewingUsersCounter = 0;
$scope.viewingUsers = [];
snRecordPresence.initPresence(g_form.getTableName(), g_form.getUniqueValue());
$rootScope.$on('sn.sessions', function(somescope, presence) {
validateViewingUsers(presence);
});
function validateViewingUsers(sessions) {
var raceCounter = ++viewingUsersCounter;
var viewingUsers = [];
var promises = [];
angular.forEach(sessions, function(item) {
var user = {
avatar: item.user_avatar,
initials: item.user_initials,
userID: item.user_id,
displayName: item.user_display_name,
name: item.user_display_name,
status: item.status
};
if (user.avatar && user.initials)
viewingUsers.push(user);
else {
promises.push(userData.getUserById(user.userID).then(function(userInfo) {
user.initials = userInfo.user_initials;
user.avatar = userInfo.user_avatar;
viewingUsers.push(user);
}));
}
});
$q.all(promises).then(function() {
if (raceCounter == viewingUsersCounter)
setViewingUsers(viewingUsers);
});
}
function setViewingUsers(users) {
$scope.viewingUsers = users;
if ($scope.viewingUsers.length !== 0) {
if (!$scope.$$phase)
$rootScope.$apply();
$rootScope.$emit('sn.presence', $scope.viewingUsers);
}
}
},
link: function($scope, $element) {
$scope.$watch('viewingUsers.length', function(newValue, oldValue) {
if (oldValue <= 1  && newValue > 1)
$element.find('.sn-popover-presence').tooltip().popover();
});
}
}
}).run(function(snRecordWatcher, $rootScope, $http, userData, i18n) {
"use strict";
var previousMessages = {};
var previousDecorations = {};
if (typeof(g_form) != "undefined")
snRecordWatcher.initRecord(g_form.getTableName(), g_form.getUniqueValue());
$rootScope.$on('record.updated', function(someScope, data) {
var modifiedFields = g_form.modifiedFields;
angular.forEach(data.changes, function(field) {
if (isConcurrentModification(data, field, modifiedFields) || isCurrentActiveElement(data, field)) {
if (!g_form.submitted)
showConcurrentFieldMsg(data, field);
} else {
var uiEl = g_form.getGlideUIElement(field);
if (!uiEl)
return;
if (uiEl.getType() == 'journal_input')
return;
if (!g_form.submitted && !g_submitted){
showFieldUpdatedDecoration(data, field);
}
}
});
});
function isConcurrentModification(data, field, modifiedFields) {
return modifiedFields[g_form.getTableName() + '.' + field]
&& g_user.getUserName() != data.record.sys_updated_by.value;
}
function isCurrentActiveElement(data, field) {
if (typeof document.activeElement === 'undefined') {
return;
}
return document.activeElement.name === g_form.getTableName() + '.' + field
&& g_user.getUserName() != data.record.sys_updated_by.value;
}
function showConcurrentFieldMsg(data, field) {
if (!(field in data.record))
return;
getUserDisplayName(data.record.sys_updated_by.display_value, function(display_name) {
var displayValue = data.record[field].display_value;
var message = i18n.getMessage("{name} has set this field to {value}").withValues({name : display_name, value : displayValue});
if (!displayValue)
message = i18n.getMessage("{name} has cleard the value of this field").withValues({name : display_name});
if (previousMessages[field])
g_form.hideFieldMsg(field);
previousMessages[field] = message;
g_form.showFieldMsg(field, message, 'error');
})
}
function showFieldUpdatedDecoration(data, field) {
if (typeof data.record[field] !== 'undefined') {
try {
g_form.setLiveUpdating(true);
g_form.setValue(field, data.record[field].value, data.record[field].display_value);
} finally {
g_form.setLiveUpdating(false);
}
}
getUserDisplayName(data.record.sys_updated_by.display_value, function(display_name) {
var message = i18n.getMessage("{name} has modified this field value").withValues({name : display_name.escapeHTML()});
if (previousDecorations[field])
g_form.removeDecoration(field, 'icon-activity-circle', previousDecorations[field], 'color-accent');
previousDecorations[field] = message;
g_form.addDecoration(field, 'icon-activity-circle', message, 'color-accent');
});
}
function getUserDisplayName(user_name, callback) {
userData.getUserByName(user_name).then(function(userInfo) {
var result = user_name;
if (userInfo && userInfo.user_name == user_name)
result = userInfo.user_display_name;
callback.call(null, result);
});
}
});
;
/*! RESOURCE: /scripts/app.form_presence/service.userData.js */
angular.module('sn.form_presence').service('userData', function($http, $q) {
var userCache = {
sys_id: {},
user_name: {}
}
function tryCache(field, value) {
return userCache[field][value];
}
function loadCache(result) {
userCache.sys_id[result.user_sys_id] = result;
userCache.user_name[result.user_name] = result;
}
function getUserBy(field, value) {
var defered = $q.defer();
var cachedResult = tryCache(field, value);
if (cachedResult) {
defered.resolve(cachedResult);
return defered.promise;
}
var url = '/api/now/ui/user/';
if (field == 'user_name')
url += 'user_name/' + value;
else
url += value;
$http.get(url).success(function(response) {
loadCache(response.result);
defered.resolve(response.result);
});
userCache[field][value] = defered.promise;
return defered.promise;
}
return {
getUserById: function(userId) {
return getUserBy('sys_id', userId);
},
getUserByName: function(userName) {
return getUserBy('user_name', userName);
}
}
})
;
;
