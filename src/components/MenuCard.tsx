'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Minus, Plus } from 'lucide-react';

interface MenuCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    is_available: boolean;
    category?: string;
    is_veg?: boolean;
  };
  onAdd: (quantity: number) => void;
}

export function MenuCard({ item, onAdd }: MenuCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(quantity);
    setQuantity(1); // Reset after adding
  };

  const isSignature = item.category?.toLowerCase().includes('signature');
  const isCombo = item.category?.toLowerCase().includes('combo');
  const isSpecial = isSignature || isCombo;

  return (
    <Card 
      className={`relative overflow-hidden transition-all ${
        !item.is_available ? 'opacity-60' : ''
      } ${
        isSignature ? 'border-[var(--color-byte-orange)] shadow-orange-100 shadow-md' : 
        isCombo ? 'border-yellow-400 shadow-yellow-100 shadow-md' : 'border-white shadow-sm'
      }`}
    >
      {/* Special Badge */}
      {isSpecial && (
        <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-black tracking-widest text-white z-10 ${
          isSignature ? 'bg-[var(--color-byte-orange)]' : 'bg-yellow-500'
        }`}>
          {isSignature ? 'SIGNATURE 🔥' : 'COMBO 👑'}
        </div>
      )}

      <CardContent className="p-4 flex gap-4 h-full">
        {/* Image Placeholder */}
        <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 relative overflow-hidden shadow-inner border border-gray-100">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              {item.name.toLowerCase().includes('fries') ? '🍟' : 
               item.name.toLowerCase().includes('combo') ? '🍱' : '🥟'}
            </div>
          )}
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
              <span className="text-white text-[10px] font-bold px-2 py-1 bg-black/80 rounded uppercase tracking-wider">Sold Out</span>
            </div>
          )}
          
          {/* Veg/Non-veg indicator */}
          {item.is_veg !== undefined && (
            <div className="absolute bottom-1 right-1 bg-white p-0.5 rounded-sm shadow-sm">
              <div className={`w-3 h-3 border-2 flex items-center justify-center ${item.is_veg ? 'border-green-600' : 'border-red-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? 'bg-green-600' : 'bg-red-600'}`} />
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-between pt-1">
          <div>
            <h3 className={`font-black leading-tight mb-1 ${isSignature ? 'text-[var(--color-byte-orange)] text-lg' : 'text-[var(--color-navy)] text-base'}`}>
              {item.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">{item.description}</p>
          </div>
          
          <div className="flex items-end justify-between mt-3">
            <span className="font-black text-xl text-[var(--color-navy)] tracking-tight">₹{item.price}</span>
            
            {item.is_available ? (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1 border border-gray-200">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 active:scale-95 transition-transform"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold w-3 text-center text-[var(--color-navy)]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white shadow-sm text-[var(--color-byte-orange)] active:scale-95 transition-transform"
                  >
                    <Plus className="w-3 h-3 font-bold" />
                  </button>
                </div>
                <Button size="sm" onClick={handleAdd} className={`h-8 px-4 text-xs font-bold w-full rounded-xl transition-transform active:scale-95 ${
                  isSpecial ? (isSignature ? 'bg-[var(--color-byte-orange)] text-white hover:bg-orange-600' : 'bg-yellow-500 text-white hover:bg-yellow-600') : ''
                }`}>
                  ADD
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="secondary" disabled className="h-8 px-4 text-xs rounded-xl font-bold bg-gray-100 text-gray-400">
                Unavailable
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
