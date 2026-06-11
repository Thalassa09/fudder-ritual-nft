'use client';

import { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

interface NFT {
  id: number;
  name: string;
  price: string;
  owner: string;
}

const nfts: NFT[] = [
  { id: 1, name: "Ritual Genesis #01", price: "0.042", owner: "0x8f2a...3b91" },
  { id: 2, name: "Ritual Genesis #02", price: "0.067", owner: "0x1c4d...7e2f" },
  { id: 3, name: "Ritual Genesis #03", price: "0.031", owner: "0x9b21...4a88" },
  { id: 4, name: "Ritual Genesis #04", price: "0.089", owner: "0x3f7c...9d15" },
  { id: 5, name: "Ritual Genesis #05", price: "0.055", owner: "0x6e8b...2c44" },
  { id: 6, name: "Ritual Genesis #06", price: "0.074", owner: "0x2a9f...5e77" },
];

export default function FudderRitual() {
  const [address, setAddress] = useState('');
  const [tab, setTab] = useState<'explore' | 'mint' | 'owned'>('explore');
  const [status, setStatus] = useState('');

  const connect = async () => {
    if (!(window as any).ethereum) return alert('Install MetaMask');
    try {
      const { ethers } = await import('ethers');
      const p = new ethers.BrowserProvider((window as any).ethereum);
      await p.send('eth_requestAccounts', []);
      const s = await p.getSigner();
      setAddress(await s.getAddress());
      setStatus('Connected • Ritual Testnet');
    } catch {}
  };

  const mint = async () => {
    if (!address) return alert('Connect first');
    setStatus('Minting...');
    // placeholder
    setTimeout(() => setStatus('Mint successful'), 1200);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1C1917] font-sans">
      {/* Nav */}
      <nav className="border-b border-[#e8e0d5]">
        <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <img src="/logo.png" className="w-9 h-9 rounded-xl" alt="" />
            <div>
              <div className="font-semibold tracking-[-0.5px] text-[21px]">Fudder</div>
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <div className="relative w-72">
              <Search size={17} className="absolute left-4 top-3.5 text-[#8B5E3C]" />
              <input 
                placeholder="Search Ritual NFTs" 
                className="w-full bg-white border border-[#e8e0d5] pl-11 h-11 rounded-2xl text-sm placeholder:text-[#8B5E3C]/60 focus:outline-none focus:border-[#8B5E3C]" 
              />
            </div>
            <button onClick={connect} className="px-6 h-11 rounded-2xl border border-[#1C1917] text-sm hover:bg-[#1C1917] hover:text-[#f5f0e8] transition-all">
              {address ? address.slice(0,6)+'...'+address.slice(-4) : 'Connect Wallet'}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 flex gap-x-9 text-sm border-t border-[#e8e0d5]">
          {(['explore','mint','owned'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`py-4 capitalize tracking-[-0.2px] ${tab===t ? 'border-b-2 border-[#1C1917] font-medium' : 'text-[#8B5E3C]'}`}>
              {t === 'owned' ? 'My Collection' : t}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 pt-12 pb-24">
        {/* Explore */}
        {tab === 'explore' && (
          <>
            <div className="flex items-end justify-between mb-9">
              <div>
                <div className="uppercase tracking-[3px] text-xs text-[#8B5E3C] mb-2">Ritual Testnet</div>
                <div className="text-6xl font-semibold tracking-[-3px]">Ritual Genesis</div>
              </div>
              <div className="text-[#8B5E3C] text-sm">6,420 NFTs • 214 Holders</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {nfts.map(nft => (
                <div key={nft.id} className="bg-white border border-[#e8e0d5] rounded-3xl overflow-hidden group">
                  <div className="h-56 bg-[#f8f3eb] flex items-center justify-center text-[72px] text-[#8B5E3C]/70">∞</div>
                  <div className="p-5">
                    <div className="font-medium tracking-[-0.3px] mb-4">{nft.name}</div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className="text-[#8B5E3C] text-xs">Price</div>
                        <div className="font-mono font-medium">{nft.price} ETH</div>
                      </div>
                      <button className="px-6 py-2 rounded-2xl bg-[#1C1917] text-[#f5f0e8] text-sm hover:bg-[#8B5E3C] transition-all">Buy</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mint */}
        {tab === 'mint' && (
          <div className="max-w-md mx-auto pt-10">
            <div className="text-center mb-9">
              <div className="text-xs tracking-[3px] text-[#8B5E3C] mb-3">RITUAL TESTNET</div>
              <div className="text-6xl font-semibold tracking-[-2.8px]">Mint</div>
            </div>

            <div className="bg-white border border-[#e8e0d5] rounded-3xl p-9">
              <div className="h-72 bg-[#f8f3eb] rounded-2xl flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="text-8xl text-[#8B5E3C]">∞</div>
                  <div className="mt-3 font-medium">Ritual Genesis</div>
                </div>
              </div>

              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between"><span className="text-[#8B5E3C]">Price</span><span className="font-medium">0.01 ETH</span></div>
                <div className="flex justify-between"><span className="text-[#8B5E3C]">Supply</span><span className="font-medium">10,000 / 10,000</span></div>
              </div>

              <button onClick={mint} disabled={!address} className="w-full h-14 bg-[#1C1917] text-[#f5f0e8] rounded-2xl font-medium flex items-center justify-center gap-x-2 disabled:opacity-60 hover:bg-[#8B5E3C]">
                Mint Now <ArrowRight size={19} />
              </button>
            </div>
            {status && <div className="text-center mt-6 text-sm text-[#8B5E3C]">{status}</div>}
          </div>
        )}

        {/* Owned */}
        {tab === 'owned' && (
          <div>
            <div className="text-4xl font-semibold tracking-[-1.2px] mb-8">My Collection</div>
            {!address ? (
              <div className="text-[#8B5E3C] py-20 text-center">Connect wallet to view your collection</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {nfts.slice(0,3).map(n => (
                  <div key={n.id} className="bg-white border border-[#e8e0d5] rounded-3xl p-5">
                    <div className="h-44 bg-[#f8f3eb] rounded-2xl flex items-center justify-center text-6xl text-[#8B5E3C]">∞</div>
                    <div className="mt-5 font-medium">{n.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
