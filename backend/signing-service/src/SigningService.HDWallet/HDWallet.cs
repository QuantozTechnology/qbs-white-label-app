/*
   Copyright Copyright 2018 Elucidsoft    

   Modified 2021 by Quantoz Technology B.V.
        * Changed the namespace
        * Removed functions those are not needed
        * Changed the function names
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at        

    http://www.apache.org/licenses/LICENSE-2.0    

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

using dotnetstandard_bip32;
using dotnetstandard_bip39;
using NBitcoin;

namespace SigningService.HDWallet;

public record WalletKeyPair(string PublicKey, string PrivateKey);

public class HDWallet
{
    static BIP32 Bip32 = new();
    private string _seedHex;

    private HDWallet(string seedHex)
    {
        _seedHex = seedHex;
    }

    public WalletKeyPair GetKeyPair(int index, string crypto)
    {
        var (publicKey, privateKey) = GetKeyPairBytes(index, crypto);

        if (publicKey == null || privateKey == null)
        {
            return null;
        }

        switch (crypto)
        {
            case "ALGO":
                return AlgorandAccountEncoding.EncodeAlgorandAccount(publicKey, privateKey);
            case "XLM":
                return StellarAccountEncoding.EncodeStellarAccount(publicKey, privateKey);
            default:
                return null;
        }
    }

    public static HDWallet FromSeed(string seed)
    {
        return new HDWallet(seed);
    }

    private (byte[] PublicKey, byte[] PrivateKey) GetKeyPairBytes(int index, string crypto)
    {
        var privateKey = DerivePathByIndex(index, crypto);

        if (privateKey == null)
        {
            return (null, null);
        }

        var publicKey = Bip32.GetPublicKey(privateKey, false);

        return (publicKey, privateKey);
    }

    private byte[] DerivePathByIndex(int index, string crypto)
    {
        // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
        // 148 = XLM, 283 = ALGO

        switch (crypto)
        {
            case "ALGO":
                return Bip32.DerivePath($"m/44'/283'/{index}'", _seedHex).Key;
            case "XLM":
                return Bip32.DerivePath($"m/44'/148'/{index}'", _seedHex).Key;
            default:
                return null;
        }
    }

    public static string GenerateSeed(string mnemonic, string password)
    {
        var mnemonicObj = new Mnemonic(mnemonic, Wordlist.English);

        return mnemonicObj.DeriveSeed(password).ToStringHex();
    }

    public static string GenerateMnemonic()
    {
        var bip39 = new BIP39();
        var mnemonic = bip39.GenerateMnemonic(160, BIP39Wordlist.English).Replace("\r", "");
        return mnemonic;
    }
}