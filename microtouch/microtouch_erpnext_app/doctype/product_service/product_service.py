# Copyright (c) 2023, Anwar Patel and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from erpnext.support.doctype.warranty_claim.warranty_claim import WarrantyClaim
import json

class ProductService(Document):
	pass
@frappe.whitelist()
def make_sales_invoice(product_data):
	json_product_data = json.loads(product_data)
	customer = json_product_data.get('customer_name')
	spare_parts = json_product_data.get('spare_parts')
	total = json_product_data.get('total_Charges')
	additional_discount_percentage = json_product_data.get('discount')
	# print(f'\n\n\nTotal is:{total}\n\n\n\n')
	# print(f'\n\n\nProduct data:{product_data}\n\n\n\n')
	# print(f'\n\n\nDiscount:{additional_discount_percentage}\n\n\n\n')
	new_invoice = frappe.new_doc('Sales Invoice')
	new_invoice.customer = customer
	new_invoice.total = total
	new_invoice.additional_discount_percentage = additional_discount_percentage
	for part in spare_parts:
		new_invoice.append('items',{
			'item_code':part.get('item_code'),
			'qty':part.get('quantity'),
			'rate':part.get('price'),
			'amount':part.get('amount')
		})
	new_invoice.insert()
	return new_invoice
