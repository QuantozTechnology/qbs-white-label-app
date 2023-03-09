﻿/*
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
