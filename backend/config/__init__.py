import pymysql
from django.db.backends.base.base import BaseDatabaseWrapper
from django.db.backends.mysql.features import DatabaseFeatures

pymysql.version_info = (2, 2, 1, "final", 0)
pymysql.install_as_MySQLdb()

# Bypass versi MariaDB lama (XAMPP MariaDB 10.4.x) di Django 5.x
BaseDatabaseWrapper.check_database_version_supported = lambda self: None
DatabaseFeatures.can_return_columns_from_insert = property(
    lambda self: bool(self.connection.mysql_is_mariadb and self.connection.mysql_version >= (10, 5))
)
DatabaseFeatures.has_native_uuid_field = property(
    lambda self: bool(self.connection.mysql_is_mariadb and self.connection.mysql_version >= (10, 7))
)

