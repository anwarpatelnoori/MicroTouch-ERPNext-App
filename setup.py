from setuptools import setup, find_packages
setup(
    name='MicroTouch-ERPNext-App',
    version='0.0.1',
    description='Managing the Sales and Service Business Operations at MicroTouch'
    packages=find_packages(),
    include_package_data=True,
    install_requires=["frappe", "erpnext", "hrms"],
)

