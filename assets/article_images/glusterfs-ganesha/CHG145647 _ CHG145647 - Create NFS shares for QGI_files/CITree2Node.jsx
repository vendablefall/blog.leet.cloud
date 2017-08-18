/*! RESOURCE: /scripts/classes/CITree2Node.js */
var CITree2Node = Class.create(GwtTree2Node, {
initialize: function(parent, id) {
GwtTree2Node.prototype.initialize.call(this, parent, id);
this.sys_id = null;
this.tableName = "cmdb_related";
this.childName = "ci_child";
this.parentName = "ci_parent";
this.processedChildren = false;
this.relatedTree = null;
this.addNew = false;
this.relName = '';
this.relID = '';
this.relInstanceID = '';
this.picker = '';
this.slushBucket = false;
this.tableType = 'cmdb_ci';
this.displayValue = null;
this.urlRoot = 'addrelationship';
this.rootCI = '';
this.domainId = '';
},
setRelated: function(rtree) {
this.relatedTree = rtree;
},
setSlushBucket: function(b) {
this.slushBucket = b;
},
setDomain: function(d) {
if (d)
this.domainId = d;
},
setPicker: function(p) {
this.picker = p;
},
setAddNew: function(b) {
this.addNew = b;
},
buildAjaxDocument: function(allChildren, id, ajax) {
if (this.sys_id == null) {
ajax.addParam("sysparm_chars", "-1");
ajax.addParam("sysparm_value", "cmdb_ci_service");
} else {
ajax.addParam("sysparm_name", this.tableName + "." + this.parentName);
ajax.addParam("sysparm_type", this.childName);
ajax.addParam("sysparm_chars", this.sys_id);
}
if (this.domainId != '')
ajax.addParam("sysparm_domain", this.domainId);
},
createChildNode: function(parent, response) {
},
buildURL: function() {
this.setURL(this.urlRoot + ".do?sysparm_collection=" + this.tableName +
"&sysparm_collectionID=" + this.sys_id +
"&sysparm_collectionName=" + this.text +
"&sysparm_stack=no" +
"&sysparm_collectionType=" + this.tableType);
this.setFrame("_self");
},
getDisplayValue: function() {
if (this.displayValue)
return this.displayValue;
return this.text;
},
setDisplayValue: function(f) {
this.displayValue = f;
},
setTableType: function(type) {
this.tableType = type;
},
setURLRoot: function(root) {
this.urlRoot = root;
},
expandResponse: function(response) {
this.processXML(response.responseXML);
if (this.relatedTree != null) {
this.relatedTree.show();
this.relatedTree.expandResponse(response);
this.relatedTree.expand();
}
},
processXML: function(xml) {
this.processedChildren = true;
this.children.innerHTML = "";
var itemsFound = 0;
var rels = xml.getElementsByTagName("cmdb_rel_type");
for(var r = 0; r < rels.length; r++)	{
var rel = rels[r];
var rlabel = rel.getAttribute("label");
var rid = rel.getAttribute("sys_id");
var reltype = rel.getAttribute("type");
if (reltype != this.childName)
continue;
var ctypes = rel.getElementsByTagName('ci_type');
for (var t = 0; t < ctypes.length; t++) {
var ctype = ctypes[t];
var items = ctype.getElementsByTagName('cmdb_ci');
for (var i = 0; i < items.length; i++) {
var item = items[i];
var level = item.getAttribute("nested_level");
if (level != "0")
continue;
var sysID = item.getAttribute("sys_id");
var instanceID = item.getAttribute("relationship_URL");
var c = new CITree2Node(this, sysID);
var sysclass = item.getAttribute("sys_class_name");
c.setTable(sysclass);
c.setChildName(this.childName);
c.setParentName(this.parentName);
c.slushBucket = this.slushBucket;
c.picker = this.picker;
c.setAddNew(this.addNew);
c.setRelName(rlabel);
c.setRelID(rid);
c.setRelInstanceID(instanceID);
c.setText(item.getAttribute("name"));
c.sys_id = sysID
c.setPathID(instanceID);
c.setDisplayValue(item.getAttribute("display_value"));
c.rootCI = this.rootCI ? this.rootCI : this.sys_id;
if (ctype.getAttribute("image")) {
c.setNodeOpenImage(ctype.getAttribute("image"));
c.setNodeClosedImage(ctype.getAttribute("image"));
c.setImage(ctype.getAttribute("image"));
}
c.checkDecoration(item, "incident", "Incidents", "incidents.gifx", "Incident");
c.checkDecoration(item, "problem", "Problems", "problems.gifx", "Problem");
c.checkDecoration(item, "change_request", "Changes", "changes.gifx", "Change");
c.checkDecoration(item, "outages_past", "recently closed outages", "icons/outage_past.gifx", "recently closed outage");
c.checkDecoration(item, "outages_current", "current opened outages", "icons/outage_current.gifx", "current opened outage");
c.checkDecoration(item, "outages_planned", "planned outages", "icons/outage_planned.gifx", "planned outage");
c.checkDecoration(item, "changes_past", "recently closed changes", "icons/change_past.gifx", "recently closed change");
c.checkDecoration(item, "changes_current", "current opened changes", "changes.gifx", "current opened change");
c.checkDecoration(item, "changes_planned", "planned changes", "icons/change_planned.gifx", "planned change");
c.setCanClick(true);
if(sysID == this.rootCI || c.foundLoop()) {
c.setCanExpand(false);
c.setCanClick(false);
}
var pathID = c.tree.getPath(sysID);
if (!c.slushBucket) {
if (c.picker == '')
c.setURL(sysclass + ".do?sys_id=" + c.sys_id);
else {
var click = "top.window.opener.reflistPick('";
click += c.picker;
click += "','";
click += c.sys_id;
click += "','";
click += c.getDisplayValue().replace(/\'/g, "\\\'");
click += "');return false;";
c.setOnClick(click);
}
} else
c.setURL(this.urlRoot + ".do?sysparm_collection=" + sysclass +
"&sysparm_collectionID=" + c.sys_id +
"&sysparm_collectionName=" + c.text +
"&sysparm_tree_collectionID=" + c.tree.root.sys_id +
"&sysparm_tree_collectionName=" + c.tree.root.text +
"&sysparm_tree_collection=" + c.tree.root.tableName +
"&sysparm_tree_path=" + pathID +
"&sysparm_stack=no" +
"&sysparm_collectionType=" + this.tableType);
c.setFrame("_self");
c.collapse();
var children = item.getAttribute("children");
if (children) {
if (children == "0") {
c.setCanExpand(false);
} else {
var issues = item.getAttribute("childrenhaveissues");
if (issues != null && issues != '') {
var d = new GwtTree2NodeDecoration();
d.setText("My dependent items have open issues");
d.setImage("images/issues.gifx");
d.setPopup("if (!event) { event = window.event }; popIssueDiv(event,'" + issues + "');");
c.addDecoration(d);
}
}
}
c.show();
if (c.tree.inPath(instanceID)) {
c.expand();
}
itemsFound++;
}
}
}
if (itemsFound > 0) {
GwtTree2Node.prototype.expand.call(this);
} else
this.setCanExpand(false);
},
foundLoop: function() {
var current = this.parent;
while(current && current.level >= 0) {
if(current.sys_id == this.sys_id)
return true;
current = current.parent;
}
return false;
},
checkDecoration: function(item, attr, labelPlural, image, label) {
inc = item.getAttribute(attr);
if (inc) {
var fn = attr;
if (fn.indexOf("outages") == 0)
fn = "cmdb_ci_outage";
if (this.picker == '') {
var d = new GwtTree2NodeDecoration();
if (inc > 1)
d.setText("Click to see the " + inc + " " + labelPlural);
else
d.setText("Click to see the " + inc + " " + label);
var url = item.getAttribute(attr + "_url");
if (url == null)
url = fn + "_list.do?sysparm_query=active=true^cmdb_ci=" + this.sys_id;
d.setURL(url.unescapeHTML());
d.setImage("images/" + image);
this.addDecoration(d);
} else {
var d = new GwtTree2NodeDecoration();
if (inc > 1)
d.setText("There are " + inc + " " + labelPlural);
else
d.setText("There is " + inc + " " + label);
d.setImage("images/" + image);
var query = item.getAttribute(attr + "_url");
if (query == null)
query = "cmdb_ci=" + this.sys_id;
else {
var parts = query.split("?");
if (parts.length == 2)
query = parts[1];
if (query.indexOf("sysparm_query=") == 0)
query = query.substring(14);
}
var issues = attr + "query:" + query.unescapeHTML();
d.setPopup("popIssueDiv(event,'" + issues + "');");
this.addDecoration(d);
}
}
},
setTable: function(t) {
this.tableName = t;
},
setRelName: function(r) {
this.relName = r;
},
setRelID: function(id) {
this.relID = id;
},
setRelInstanceID: function(id) {
this.relInstanceID = id;
},
setChildName: function(c) {
this.childName = c;
},
setParentName: function(p) {
this.parentName = p;
},
loadRaw: function(label, id) {
jslog("LOAD RAW " + label + " - " + id);
this.setText(label);
this.sys_id = id;
}
});
;
