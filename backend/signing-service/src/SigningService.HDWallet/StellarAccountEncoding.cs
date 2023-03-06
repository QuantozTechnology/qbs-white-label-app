using stellar_dotnet_sdk;

namespace SigningService.HDWallet;

public class StellarAccountEncoding
{
    public static WalletKeyPair EncodeStellarAccount(byte[] publicKey, byte[] privateKey)
    {
        return new WalletKeyPair(EncodePublicKey(publicKey), EncodePrivateKey(privateKey));
    }

    private static string EncodePublicKey(byte[] publicKey)
    {
        return KeyPair.FromPublicKey(publicKey).AccountId;
    }

    private static string EncodePrivateKey(byte[] privateKey)
    {
        return KeyPair.FromSecretSeed(privateKey).SecretSeed;
    }
}