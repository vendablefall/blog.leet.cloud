/*! RESOURCE: /scripts/journal.js */
function getJournalEntry(element, table, sysID) {
var valueField = "new";
if (table == "sys_audit")
valueField = "newvalue";
else if (table == "sys_journal_field")
valueField = "value";
var gr = new GlideRecord(table)
gr.addQuery("sys_id",sysID)
gr.query(function() {
if (gr.next()) {
var formattedValue = gr[valueField].replace(/\n/g, "<br />");
$(element).up().update(formattedValue);
}
});
$(element).update($(element).innerHTML + ' <img style="width: 14px" src="images/animated/loading.gif" />');
}
;
