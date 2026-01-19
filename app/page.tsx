"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, ShieldCheck, AlertCircle, Users, Activity, ExternalLink } from 'lucide-react';

export default function SentinelPro() {
  const [data, setData] = useState({ items: [], stats: { total: 0, critical: 0, sent: 0 }, escalations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: items } = await supabase.from('items').select('*, departments(name)').order('expiry_date');
      const { count: total } = await supabase.from('items').select('*', { count: 'exact', head: true });
      const { data: esc } = await supabase.rpc('get_escalation_list');
      
      setData({ 
        items: items || [], 
        stats: { total: total || 0, critical: esc?.length || 0, sent: 0 },
        escalations: esc || []
      });
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-indigo-600 animate-pulse text-2xl">SENTINEL PRO IS LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-6 lg:p-12 font-sans" dir="rtl">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl"><ShieldCheck className="text-white w-8 h-8" /></div>
          <h1 className="text-2xl font-black text-slate-900">Sentinel<span className="text-indigo-600">Pro</span></h1>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">إدارة المستلمين</button>
          <button className="bg-indigo-600 shadow-xl shadow-indigo-100 px-5 py-2.5 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all">+ إضافة معاملة</button>
        </div>
      </nav>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
          <Activity className="text-indigo-600 mb-4" />
          <p className="text-slate-400 font-bold text-sm uppercase">إجمالي المؤمن</p>
          <h2 className="text-4xl font-black text-slate-900 mt-2">{data.stats.total}</h2>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm border-r-4 border-r-rose-500">
          <AlertCircle className="text-rose-500 mb-4" />
          <p className="text-slate-400 font-bold text-sm uppercase">حالات التصعيد</p>
          <h2 className="text-4xl font-black text-slate-900 mt-2 text-rose-600">{data.stats.critical}</h2>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
          <Users className="text-emerald-500 mb-4" />
          <p className="text-slate-400 font-bold text-sm uppercase">المستلمون النشطون</p>
          <h2 className="text-4xl font-black text-slate-900 mt-2">14</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Real-time Feed Area */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
          <h3 className="text-xl font-black mb-8 text-slate-800">أحدث المعاملات المؤمنة</h3>
          <div className="space-y-4">
            {data.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm"><Bell className="w-5 h-5 text-indigo-500" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.departments?.name}</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-700">{item.expiry_date}</div>
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{item.workflow_status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
            <h3 className="font-bold text-lg mb-4">نظام التصعيد الذكي 🤖</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">يتم مراقبة هذه المعاملات آلياً. في حال بقاء 3 أيام، سيتم إشعار المدير المباشر فوراً.</p>
            <div className="space-y-4">
              {data.escalations.map((esc: any, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="text-sm font-bold">{esc.item_title}</span>
                  <ExternalLink className="w-4 h-4 text-rose-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
