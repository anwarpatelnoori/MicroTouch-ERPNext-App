function calulate_total(frm, cdt, cdn){
	let child = locals[cdt][cdn]
	let total_price = child.quantity * child.price
	frappe.model.set_value(cdt,cdn,'total',total_price)
}
function calling_calulate_total(frm, cdt,cdn){
	calulate_total(frm,cdt,cdn)
	frm.compute_total(frm)
}
function on_remove_cal_total (frm,cdt,cdn){
	frm.compute_total(frm)
}
function on_discount_cal_total(frm){
	var discount =frm.doc.discount
	let discount_amount = (discount/100) * frm.doc.total_charges
	let total_charges_after_discount =frm.doc.total_charges -discount_amount
	frm.set_value('total_charges',total_charges_after_discount)

}
function check_warranty(frm) {
	if (frm.doc.warranty_status === 'Under Warranty') {
		frm.set_value('min_service_charge', 0);
		frm.set_value('total_charges',0)
	}
	else{
		frm.set_value('min_service_charge',350)
	}
}
// Copyright (c) 2023, Anwar Patel and contributors
// For license information, please see license.txt
frappe.ui.form.on("Product Service", {
	setup:function (frm){
		frm.compute_total = (frm)=>{
			var min_service_charge = frm.doc.min_service_charge
			var discount =frm.doc.discount
			var spare_total = 0
			frm.doc.costing_table.forEach(price => {
				spare_total += price.total
			});
			let total_charges = spare_total + min_service_charge
			let discount_amount = (discount/100) * total_charges
			let total_charges_after_discount = total_charges - discount_amount
			frm.set_value('spare_part_total',spare_total)
			frm.set_value('total_charges',total_charges_after_discount)	
		}; 
	},
	refresh: function (frm){
		frm.add_custom_button('Sales Invoice', function() {
			let product_data = {
				customer_name:frm.doc.customer_name,
				total_Charges:frm.doc.total_charges,
				discount:frm.doc.discount,
				spare_parts:cur_frm.doc.costing_table.map(spare_part=>({
					item_code:spare_part.item_code,
					quantity:spare_part.quantity,
					price:spare_part.price,
					amount:spare_part.total
				}))
			};
			console.log(product_data.total_Charges);
			frappe.call({
				method :'microtouch.microtouch_erpnext_app.doctype.product_service.product_service.make_sales_invoice',
				args:{product_data:product_data},
				callback: function (response){
					let new_invoice = response.message
					if(new_invoice){
						frappe.set_route('Form','Sales Invoice',new_invoice.name)
					}
				} 
			})
        });
	},
	discount: on_discount_cal_total,
	warranty_status:check_warranty
});
frappe.ui.form.on('Spares Parts',{
	quantity:calling_calulate_total,
	item_code:calling_calulate_total,
	price:calling_calulate_total,
	costing_table_remove:on_remove_cal_total
})

