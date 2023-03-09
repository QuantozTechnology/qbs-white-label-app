// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Web.SDK.Services.Models;

namespace Web.SDK.ROP;

public class Result<TValue> : Result
{
    private readonly TValue? _value;

    protected internal Result(TValue? value, bool isSuccess, CustomErrorsResponse error) : base(isSuccess, error) => _value = value;

    public TValue Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("The value of a failure result can not be accessed.");


    public static implicit operator Result<TValue>(TValue v) => new(v, true, CustomErrorsResponse.None);
    public static implicit operator Result<TValue>(CustomErrorsResponse e) => new(default, false, e);
}