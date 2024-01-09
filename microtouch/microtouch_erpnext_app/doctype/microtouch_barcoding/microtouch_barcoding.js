// Copyright (c) 2024, Anwar Patel and contributors
// For license information, please see license.txt

frappe.ui.form.on("microtouch barcoding", {

    after_save: function(frm) {
        // Check if the barcode field is not empty
        if (frm.doc.name) {
            // Set the document's name to the value of the barcode
            frm.set_value("barcode_number", frm.doc.name);
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Item',
                    name: frm.doc.product_name // Replace with the method to get the target item name
                },
                callback: function(r) {
                    if (r && r.message) {
                        let itemDoc = r.message;
        
                        // Add barcode to the child table in Item doctype
                        let child = frappe.model.add_child(itemDoc, 'Barcodes', 'barcodes'); // 'Barcodes' is the child table name, 'barcodes' is the field name in the Item doctype
                        child.barcode = frm.doc.name; // Set the barcode number
        
                        // Save the updated Item document
                        frappe.call({
                            method: 'frappe.client.save',
                            args: {
                                doc: itemDoc
                            },
                            callback: function(r) {
                                if (r && r.message) {
                                    frappe.msgprint('Barcode updated in Item.');
                                }
                            }
                        });
                    }
                }
            });
        }
        
    }
});
