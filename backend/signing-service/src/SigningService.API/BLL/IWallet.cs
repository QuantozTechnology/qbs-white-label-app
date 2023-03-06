using System;
using Azure;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using FluentResults;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace SigningService.API.BLL;


public class WalletOptions
{
    public string KeyVaultUrl { get; set; }
}

public interface IWallet
{
    WalletSecrets GetSecrets(string cryptoCode, string labelPartnerCode);
    bool StoreSecrets(string cryptoCode, string labelPartnerCode, WalletSecrets secrets);
}

public record WalletSecrets(string Mnemonic, string Password);

public class KeyVaultWallet : IWallet
{
    private readonly WalletOptions _options;
    private readonly ILogger _logger;

    public KeyVaultWallet(IOptions<WalletOptions> options, ILogger<KeyVaultWallet> logger)
    {
        if (options == null)
        {
            throw new ArgumentNullException(nameof(options));
        }

        _options = options.Value;
        _logger = logger;
    }

    public WalletSecrets GetSecrets(string cryptoCode, string labelPartnerCode)
    {
        SecretClient client;

        try
        {
            client = new SecretClient(new Uri(_options.KeyVaultUrl), new DefaultAzureCredential());
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed opening KeyVault");
            return null;
        }

        if (string.IsNullOrEmpty(cryptoCode) || string.IsNullOrEmpty(labelPartnerCode))
        {
            _logger.LogError("CryptoCode and/or LabelPartnerCode not set for mnemonic retrieval");
            return null;
        }

        try
        {
            var mnemonic = client.GetSecret($"seeds--{labelPartnerCode}--{cryptoCode}--mnemonic").Value.Value;
            var password = client.GetSecret($"seeds--{labelPartnerCode}--{cryptoCode}--password").Value.Value;

            return new WalletSecrets(mnemonic, password);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed finding KeyVault secret for mnemonic and password");
        }

        return null;
    }

    public bool StoreSecrets(string cryptoCode, string labelPartnerCode, WalletSecrets secrets)
    {
        SecretClient client;

        try
        {
            client = new SecretClient(new Uri(_options.KeyVaultUrl), new DefaultAzureCredential());
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed opening KeyVault");
            return false;
        }

        try
        {
            var mnemonic = client.GetSecret($"seeds--{labelPartnerCode}--{cryptoCode}--mnemonic");
            var password = client.GetSecret($"seeds--{labelPartnerCode}--{cryptoCode}--password");

            _logger.LogError("Mnemonic and Password already set");
            return false;
        }
        catch (RequestFailedException e)
        {
            if (e.Status != 404)
            {
                _logger.LogError(e, "Could not verify status of possibly existing Mnemonic and Password");
                return false;
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Could not verify status of possibly existing Mnemonic and Password");
            return false;
        }

        try
        {
            var mnemonicResponse = client.SetSecret(new KeyVaultSecret($"seeds--{labelPartnerCode}--{cryptoCode}--mnemonic", secrets.Mnemonic));
            var passwordResponse = client.SetSecret(new KeyVaultSecret($"seeds--{labelPartnerCode}--{cryptoCode}--password", secrets.Password));

            if (mnemonicResponse.ToResult().IsFailed || passwordResponse.ToResult().IsFailed)
            {
                return false;
            }
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed setting KeyVault secret for mnemonic and password");
            return false;
        }

        return true;
    }
}
