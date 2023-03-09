// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SigningService.API.Data;

public class SigningDbContext : DbContext
{
    public DbSet<SigningPair> SigningPairs { get; set; }

    public SigningDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new SigningPairConfiguration());
    }
}

/// <summary>
/// This method is required to enable migrations on an azure function.
/// https://learn.microsoft.com/en-us/ef/core/cli/dbcontext-creation?tabs=dotnet-core-cli#from-a-design-time-factory
/// </summary>
public class SigningDbContextFactory : IDesignTimeDbContextFactory<SigningDbContext>
{
    public SigningDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<SigningDbContext>();
        optionsBuilder.UseSqlServer("");

        return new SigningDbContext(optionsBuilder.Options);
    }
}
