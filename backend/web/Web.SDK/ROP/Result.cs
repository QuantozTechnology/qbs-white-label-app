// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

using Web.SDK.Services.Models;

namespace Web.SDK.ROP;

public class Result
{
    protected internal Result(bool isSuccess, CustomErrorsResponse error)
    {
        if (isSuccess && error != CustomErrorsResponse.None)
        {
            throw new InvalidOperationException();
        }

        if (!isSuccess && error == CustomErrorsResponse.None)
        {
            throw new InvalidOperationException();
        }

        IsSuccess = isSuccess;
        Error = error;
    }

    public bool IsSuccess { get; }

    public bool IsFailure => !IsSuccess;

    public CustomErrorsResponse Error { get; }

    public static Result Success() => new(true, CustomErrorsResponse.None);

    public static Result<TValue> Success<TValue>(TValue value) =>
        new(value, true, CustomErrorsResponse.None);

    public static Result Failure(CustomErrorsResponse error) =>
        new(false, error);

    public static Result<TValue> Failure<TValue>(CustomErrorsResponse error) =>
        new(default, false, error);

    public static implicit operator Result(CustomErrorsResponse e) => new(false, e);
}
