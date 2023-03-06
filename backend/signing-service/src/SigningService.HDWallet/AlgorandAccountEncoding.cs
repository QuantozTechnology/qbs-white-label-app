namespace SigningService.HDWallet;

public class AlgorandAccountEncoding
{
    public static WalletKeyPair EncodeAlgorandAccount(byte[] publicKey, byte[] privateKey)
    {
        return new WalletKeyPair(EncodePublicKey(publicKey), EncodePrivateKey(privateKey));
    }

    private static string EncodePublicKey(byte[] publicKey)
    {
        return new Algorand.Address(publicKey).EncodeAsString();
    }

    private static string EncodePrivateKey(byte[] privateKey)
    {
        return Algorand.Account.AccountFromPrivateKey(privateKey).ToMnemonic();
    }
}
