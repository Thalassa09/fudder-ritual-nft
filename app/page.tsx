'use client';

import { useState } from 'react';
import { ArrowRight, Upload, Image as ImageIcon } from 'lucide-react';

interface NFT {
  id: number;
  name: string;
  price: string;
  image?: string;
}

const initialNFTs: NFT[] = [
  { id: 1, name: "Ritual Genesis #01", price: "0.042" },
  { id: 2, name: "Ritual Genesis #02", price: "0.067" },
  { id: 3, name: "Ritual Genesis #03", price: "0.031" },
  { id: 4, name: "Ritual Genesis #04", price: "0.089" },
  { id: 5, name: "Ritual Genesis #05", price: "0.055" },
  { id: 6, name: "Ritual Genesis #06", price: "0.074" },
];

const OWNER_ADDRESS = "0x3883f0dDccC55Ac112173BC67584952Bf13B1A7D"; // ganti dengan wallet kamu

export default function FudderRitual() {
  const [address, setAddress] = useState('');
  const [tab, setTab] = useState<'explore' | 'mint' | 'owned' | 'upload'>('explore');
  const [nfts, setNfts] = useState(initialNFTs);
  const [status, setStatus] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadPrice, setUploadPrice] = useState('0.05');

  const isOwner = address.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  const connect = async () => {
    if (!(window as any).ethereum) return alert('Install MetaMask');
    try {
      const { ethers } = await import('ethers');
      const p = new ethers.BrowserProvider((window as any).ethereum);
      await p.send('eth_requestAccounts', []);
      const s = await p.getSigner();
      setAddress(await s.getAddress());
    } catch {}
  };

  const mint = async () => {
    if (!address) return alert('Connect first');
    setStatus('Minting...');
    setTimeout(() => setStatus('Mint successful'), 1400);
  };

  const handleUpload = () => {
    if (!uploadFile || !uploadName) return alert('Upload gambar dan isi nama');
    
    const newNFT: NFT = {
      id: Date.now(),
      name: uploadName,
      price: uploadPrice,
    };
    
    setNfts([...nfts, newNFT]);
    setUploadFile(null);
    setUploadName('');
    setStatus('Collection updated');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0F0E0C] text-[#f5f0e8]">
      {/* Nav */}
      <nav className="border-b border-white/10 bg-[#0F0E0C]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <img src="/logo.png" className="w-9 h-9 rounded-2xl" alt="" />
            <div>
              <div className="font-semibold tracking-[-0.4px] text-[22px]">Fudder NFT</div>
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            <button onClick={connect} className="px-6 h-11 rounded-2xl border border-white/20 text-sm hover:bg-white hover:text-[#0F0E0C] transition-all">
              {address ? address.slice(0,6)+'...'+address.slice(-4) : 'Connect Wallet'}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 flex gap-x-10 text-sm border-t border-white/10">
          {(['explore','mint','owned','upload'] as const).map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              className={`py-4 capitalize tracking-[-0.2px] transition-all ${tab===t ? 'border-b-2 border-white font-medium' : 'text-white/40 hover:text-white/70'}`}
            >
              {t === 'owned' ? 'My Collection' : t === 'upload' ? 'Upload' : t}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 pt-14 pb-24">
        {/* Explore */}
        {tab === 'explore' && (
          <>
            <div className="mb-10">
              <div className="uppercase tracking-[4px] text-xs text-white/40 mb-3">Ritual Testnet</div>
              <div className="text-7xl font-semibold tracking-[-4.2px]">Ritual Genesis</div>
              <div className="text-white/50 mt-3 text-lg">Limited collection of autonomous agents</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {nfts.map(nft => (
                <div key={nft.id} className="bg-[#1A1816] border border-white/10 rounded-3xl overflow-hidden group">
                  <div className="h-60 bg-black/50 flex items-center justify-center text-[90px] text-white/20">∞</div>
                  <div className="p-6">
                    <div className="font-medium tracking-[-0.4px] text-lg mb-4">{nft.name}</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/40">Price</div>
                        <div className="font-mono font-medium">{nft.price} ETH</div>
                      </div>
                      <button className="px-7 py-2.5 rounded-2xl bg-white text-[#0F0E0C] text-sm font-medium hover:bg-[#8B5E3C] hover:text-white transition-all">Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mint */}
        {tab === 'mint' && (
          <div className="max-w-md mx-auto pt-8">
            <div className="text-center mb-10">
              <div className="text-xs tracking-[4px] text-white/40 mb-4">RITUAL TESTNET</div>
              <div className="text-7xl font-semibold tracking-[-3.5px]">Mint</div>
            </div>

            <div className="bg-[#1A1816] border border-white/10 rounded-3xl p-10">
              <div className="h-80 bg-black/40 rounded-2xl flex items-center justify-center mb-9">
                <div className="text-center">
                  <div className="text-[110px] text-white/20">∞</div>
                  <div className="font-medium tracking-tight mt-2">Ritual Genesis</div>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-9 px-1">
                <div><span className="text-white/40">Price</span><br /><span className="font-medium">0.01 ETH</span></div>
                <div><span className="text-white/40">Supply</span><br /><span className="font-medium">10,000</span></div>
              </div>

              <button onClick={mint} disabled={!address} className="w-full h-14 bg-white text-[#0F0E0C] rounded-2xl font-medium flex items-center justify-center gap-x-3 disabled:opacity-50 hover:bg-[#8B5E3C] hover:text-white transition-all">
                Mint Now <ArrowRight size={20} />
              </button>
            </div>
            {status && <div className="text-center mt-6 text-white/50 text-sm">{status}</div>}
          </div>
        )}

        {/* Owned */}
        {tab === 'owned' && (
          <div>
            <div className="text-5xl font-semibold tracking-[-2px] mb-9">My Collection</div>
            {!address ? (
              <div className="text-white/40 py-24 text-center">Connect your wallet to view owned NFTs</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {nfts.slice(0,3).map(n => (
                  <div key={n.id} className="bg-[#1A1816] border border-white/10 rounded-3xl p-6">
                    <div className="h-52 bg-black/40 rounded-2xl flex items-center justify-center text-7xl text-white/20">∞</div>
                    <div className="mt-6 font-medium tracking-tight">{n.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload (Owner Only) */}
        {tab === 'upload' && (
          <div className="max-w-xl mx-auto pt-6">
            <div className="mb-10">
              <div className="text-xs tracking-[4px] text-white/40 mb-3">OWNER ONLY</div>
              <div className="text-6xl font-semibold tracking-[-3px]">Upload New NFT</div>
            </div>

            {!isOwner ? (
              <div className="text-white/40 py-16 text-center">Only the collection owner can upload new NFTs</div>
            ) : (
              <div className="bg-[#1A1816] border border-white/10 rounded-3xl p-10">
                <div className="border-2 border-dashed border-white/20 rounded-2xl h-64 flex flex-col items-center justify-center mb-8 cursor-pointer hover:border-white/40 transition-all" onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload size={42} className="text-white/40 mb-4" />
                  <div className="text-white/60">Click to upload image</div>
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                  {uploadFile && <div className="text-sm text-[#8B5E3C] mt-3">{uploadFile.name}</div>}
                </div>

                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="NFT Name (e.g. Ritual Genesis #07)" 
                    value={uploadName} 
                    onChange={(e) => setUploadName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 h-14 px-6 rounded-2xl text-sm focus:outline-none focus:border-white/30"
                  />
                  <input 
                    type="text" 
                    placeholder="Price in ETH" 
                    value={uploadPrice} 
                    onChange={(e) => setUploadPrice(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 h-14 px-6 rounded-2xl text-sm focus:outline-none focus:border-white/30"
                  />
                </div>

                <button onClick={handleUpload} className="mt-8 w-full h-14 bg-white text-[#0F0E0C] rounded-2xl font-medium flex items-center justify-center gap-x-3 hover:bg-[#8B5E3C] hover:text-white transition-all">
                  Add to Collection <ArrowRight size={19} />
                </button>
              </div>
            )}
            {status && <div className="text-center mt-6 text-sm text-[#8B5E3C]">{status}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
