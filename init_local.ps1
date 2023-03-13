Write-Host "Executing database drop and creation" -ForegroundColor blue

sqlcmd -S "(localdb)\MSSQLLocalDB" -d master -Q "DROP DATABASE [quantoz-payments-db]; CREATE DATABASE [quantoz-payments-db];"

dotnet ef database update --project "./backend/core/src/Core.API" --connection "Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=quantoz-payments-db;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;"