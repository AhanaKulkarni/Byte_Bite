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
  };
  onAdd: (quantity: number) => void;
}

export function MenuCard({ item, onAdd }: MenuCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(quantity);
    setQuantity(1); // Reset after adding
  };

  return (
    <Card className={`relative overflow-hidden ${!item.is_available ? 'opacity-60' : ''}`}>
      <CardContent className="p-4 flex gap-4">
        {/* Image Placeholder */}
        <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 relative overflow-hidden">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-200">
              Img
            </div>
          )}
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold px-2 py-1 bg-black/60 rounded">SOLD OUT</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[var(--color-navy)] leading-tight mb-1 text-base">{item.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
          </div>
          
          <div className="flex items-end justify-between mt-2">
            <span className="font-bold text-lg text-[var(--color-navy)]">₹{item.price}</span>
            
            {item.is_available ? (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 active:scale-95"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold w-3 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-[var(--color-byte-orange)] active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <Button size="sm" onClick={handleAdd} className="h-8 px-4 text-xs w-full">
                  ADD +
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="secondary" disabled className="h-8 px-4 text-xs">
                Unavailable
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
