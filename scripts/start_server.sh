#!/bin/bash
cd /var/www/html/ethos-multi
chown -R www-data:www-data /var/www/html/ethos-multi
/usr/bin/systemctl restart ethos-customer
