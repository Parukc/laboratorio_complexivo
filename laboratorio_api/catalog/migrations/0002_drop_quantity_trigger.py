# Elimina el trigger/función fn_validar_quantity que referencia la columna "quantity"
# (inexistente en lab_tests). Ese trigger pertenecía a otro esquema/tabla.

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql="DROP FUNCTION IF EXISTS fn_validar_quantity() CASCADE;",
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
