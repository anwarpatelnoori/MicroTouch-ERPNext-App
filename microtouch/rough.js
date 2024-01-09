frappe.ui.form.on('Asset Users', {
    validate: function(frm) {
        if (frm.doc.__islocal) {
            create_new_user(frm);
            user_permission(frm);
        } else {
            update_existing_user(frm);
            user_permission(frm);
        }
    },
//     // after_save: function(frm,row) {
//     //       user_permission(frm);
//   },
  onload: function(frm) {
        if (!frm.doc.__islocal) {
            frm.original_password = frm.doc.password;
        }
      },
      on_update: function(frm) {
        if (!frm.doc.__islocal) {
            frm.original_password = frm.doc.password;
        }
      },
      refresh:function(frm) {
        if (!frm.doc.__islocal) {
            frm.original_password = frm.doc.password;
        }
      },
      before_save: function(frm) {
        if (!frm.doc.__islocal) {
            if (frm.original_password === frm.doc.password) {
                frm.set_value('password', frm.doc.password);
            } else {
                frm.set_value('password', frm.doc.password);
                update_password_changes(frm);
            }
        }
    }
});


function update_password_changes(frm) {
    frappe.call({
        method: 'frappe.client.set_value',
        args: {
            doctype: 'User',
            name: frm.doc.email,
            fieldname: {
                'new_password': frm.doc.password
            }
        },
        callback: function(r) {
            if (!r.exc) {
                // frappe.msgprint(__('User {0} password updated successfully.', [frm.doc.email]));
            }
        },
        error: function() {
            // frappe.throw(__('Error updating user password.'));
        }
    });
}



function create_new_user(frm) {
    frappe.call({
        method: 'frappe.client.insert',
        args: {
            doc: {
                doctype: 'User',
                email: frm.doc.email,
                first_name: frm.doc.name1,
                enabled: frm.doc.enabled,
                new_password: frm.doc.password,
                role_profile_name: frm.doc.role_profile,
                send_welcome_email: 0
            }
        },
        callback: function(r) {
            if (!r.exc) {
                frappe.msgprint(__('User {0} created successfully.', [frm.doc.email]));
                update_module_profile(frm.doc.email, frm.doc.module_profile).then(() => {
       user_permission(frm);
});

                // set_role_profile(frm.doc.email, frm.doc.role_profile);
            }
        },
        error: function() {
            frappe.throw(__('Error creating user.'));
        }
    });
    
}
function update_module_profile(user_email,module_profile) {
    setTimeout(() => {
    frappe.call({
        method: 'frappe.client.set_value',
        args: {
            doctype: 'User',
            name: user_email,
            fieldname: {
                'module_profile': module_profile
            }
        },
        // callback: function(r) {
        //     if (!r.exc) {
        //         // frappe.msgprint(__('User type  Module Profile updated for {0}.', [user_email]));
        //     }
        // },
        // error: function() {
        //     // frappe.throw(__('Error updating  Module Profile'));
        // }
            });
        }, 2000);
}


function update_existing_user(frm) {
    frappe.call({
        method: 'frappe.client.set_value',
        args: {
            doctype: 'User',
            name: frm.doc.email,
            fieldname: {
                'first_name': frm.doc.name1,
                'enabled': frm.doc.enabled,
                // 'new_password': frm.doc.password,
                 'role_profile_name': frm.doc.role_profile,
            }
        },
        callback: function(r) {
            if (!r.exc) {
                // frappe.msgprint(__('User {0} updated successfully.', [frm.doc.email]));
                update_module_profile(frm.doc.email, frm.doc.module_profile).then(() => {
                  user_permission(frm);
              });
                // set_role_profile(frm.doc.email, frm.doc.role_profile);
                frm.save();
            }
        },
        // error: function() {
        //     frappe.throw(__('Error updating user.'));
        // }
    });
}
      
function user_permission(frm) {
  if (frm.doc.user_branch) {
    frm.doc.user_branch.forEach(function(row) {
     setTimeout(() => {
      frappe.call({
        method: "frappe.client.insert",
        args: {
          doc: {
            doctype: "User Permission",
            user: frm.doc.email,
            allow: "Location",
            for_value: row.user_branch
          },
        },
        callback: function(response) {
          if (response.message) {
            // frappe.msgprint("User permission created successfully");
          } else {
            // frappe.throw("Failed to create user permission");
          }
        },
      });
     }, 5000);
    });
  }
}


