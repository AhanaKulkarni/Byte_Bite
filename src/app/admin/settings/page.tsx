'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, Send } from 'lucide-react';

export default function AdminSettings() {
  const [recipient1, setRecipient1] = useState('+91');
  const [recipient2, setRecipient2] = useState('+91');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleSendTestEOD = () => {
    alert('Simulating EOD Report generation and sending...');
    console.log('--- MOCK EOD REPORT ---');
    console.log('Date: 14 Aug 2026');
    console.log('Total Orders: 86');
    console.log('Gross Sales: ₹9,420');
    console.log('Net Sales: ₹8,800');
    console.log('-----------------------');
  };

  return (
    <div className="p-4 pt-6 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-4">Settings</h1>
      </header>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">EOD Report Recipients</CardTitle>
          <p className="text-sm text-gray-500">Configure phone numbers to receive the End-of-Day SMS/WhatsApp report.</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Recipient 1</label>
            <Input 
              value={recipient1}
              onChange={(e) => setRecipient1(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="bg-gray-50 shadow-none border border-gray-200 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Recipient 2</label>
            <Input 
              value={recipient2}
              onChange={(e) => setRecipient2(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="bg-gray-50 shadow-none border border-gray-200 focus:bg-white"
            />
          </div>
          <Button onClick={handleSave} className="w-full mt-2" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Recipients'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm bg-orange-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[var(--color-byte-orange)]">Manual Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Button onClick={handleSendTestEOD} variant="outline" className="w-full bg-white">
            <Send className="w-4 h-4 mr-2" />
            Send Test EOD Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
