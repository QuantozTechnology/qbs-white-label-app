#r "paket:
nuget Fake.DotNet.AssemblyInfoFile
nuget Fake.IO.FileSystem
nuget Fake.DotNet.MSBuild
nuget Fake.DotNet.Cli
nuget Fake.IO.Zip
nuget Fake.Tools.Git
nuget Fake.Core.CommandLineParsing
nuget Fake.Core.Target
nuget Octopus.Client //"
#load "./.fake/build.fsx/intellisense.fsx"

open System
open Fake.IO
open Fake.IO.FileSystemOperators
open Fake.IO.Globbing.Operators //enables !! and globbing
open Fake.DotNet
open Fake.Core
open Fake.Tools
open Fake.Tools.Git

[<NoComparison>]
[<NoEquality>]
type SubProject =
    { Name: string; TestBinaries: string list; }

let coreProject =
    {  Name = "Core"
       TestBinaries = [
        "backend/core/tests/Core.ApplicationTests/bin/Release/net7.0/Core.ApplicationTests.dll",
        "backend/core/tests/Core.DomainTests/bin/Release/net7.0/Core.DomainTests.dll",
        "backend/core/tests/Core.InfrastructureTests/bin/Release/net7.0/Core.InfrastructureTests.dll"
        ] }

let signingServiceProject =
    {  Name = "SigningService"
       TestBinaries = [
        "backend/signing-service/tests/SigningService.API.Tests/bin/Release/net7.0/SigningService.API.Tests.dll",
        ] }

let projects = [ coreProject; signingServiceProject ]

Target.create "Default" (fun _ ->
    Trace.trace "May the payments forever be in your favor."
)

Target.create "BuildRelease" (fun t ->
    let buildProject =
        DotNet.build (fun x ->
            { x with
                Configuration = DotNet.BuildConfiguration.Release
                MSBuildParams = { MSBuild.CliArguments.Create() with Properties = [ ("RestoreLockedMode", "true")] } })

    projects |> List.iter (fun x -> buildProject x.SolutionFilter)
)

let testLoggerPostfix = """ --logger:"junit;LogFilePath=./artifacts/{assembly}-test-result.xml;MethodFormat=Class;FailureBodyFormat=Verbose" """

Target.create "RunTests" (fun t ->
    let binaries =
        projects
        |> List.collect (fun x -> x.TestBinaries)
        |> String.concat " "

    let testResults =
        match binaries with
        | s when String.isNullOrWhiteSpace(s) = false ->
            let result = DotNet.exec id "test" (s + testLoggerPostfix)
            result.ExitCode = 0
        | _ -> true // no tests is also okay

    match testResults with
    | false -> failwith "Tests failed"
    | _ -> ()
)

open Fake.Core.TargetOperators

// start build
Target.runOrDefaultWithArguments "Default"