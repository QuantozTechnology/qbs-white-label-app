using dotnetstandard_bip39;
using SigningService.API.BLL;

namespace SigningService.API.Tests;

public class FailWallet : IWallet
{
    public WalletSecrets GetSecrets(string cryptoCode, string labelPartnerCode)
    {
        return null;
    }

    public bool StoreSecrets(string cryptoCode, string labelPartnerCode, WalletSecrets secrets)
    {
        return true;
    }
}

public class MnemonicWallet : IWallet
{
    private readonly string _mnemonic;
    private readonly string _password;
    public MnemonicWallet()
    {
        var bip39 = new BIP39();
        _mnemonic = bip39.GenerateMnemonic(160, BIP39Wordlist.English).Replace("\r", "");
        _password = "password";
    }

    public WalletSecrets GetSecrets(string cryptoCode, string labelPartnerCode)
    {
        return new WalletSecrets(_mnemonic, _password);
    }

    public bool StoreSecrets(string cryptoCode, string labelPartnerCode, WalletSecrets secrets)
    {
        return true;
    }
}